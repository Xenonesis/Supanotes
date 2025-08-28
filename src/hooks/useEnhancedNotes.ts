import { useState, useEffect } from 'react'
import { supabase, Note, NoteContentType, NoteAttachment, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { uploadFile, deleteFile, validateFile, FileUploadResult } from '../lib/fileUpload'
import toast from 'react-hot-toast'

export interface CreateNoteData {
  title?: string
  content: string
  contentType: NoteContentType
  attachments?: File[]
  tags?: string[]
  isFavorite?: boolean
}

export interface SearchFilters {
  query?: string
  tags?: string[]
  contentType?: NoteContentType | ''
  isFavorite?: boolean | null
}

export const useEnhancedNotes = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({})
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const { user, supabaseReady } = useAuth()

  useEffect(() => {
    if (user && supabaseReady) {
      fetchNotes()
      fetchAvailableTags()
    } else {
      setNotes([])
      setLoading(false)
    }
  }, [user, supabaseReady, searchFilters])

  const fetchNotes = async () => {
    if (!supabaseReady) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Try enhanced search first, fallback to basic query
      let data, error
      
      try {
        // Try enhanced search function
        const result = await supabase.rpc('search_notes', {
          search_query: searchFilters.query || '',
          tag_filter: searchFilters.tags || [],
          content_type_filter: searchFilters.contentType || '',
          is_favorite_filter: searchFilters.isFavorite
        })
        data = result.data
        error = result.error
      } catch (rpcError) {
        // Fallback to basic query if enhanced search not available
        console.log('Enhanced search not available, using basic query')
        let query = supabase
          .from('notes')
          .select('*')
          .order('created_at', { ascending: false })

        // Apply basic filters
        if (searchFilters.query) {
          query = query.or(`content.ilike.%${searchFilters.query}%,title.ilike.%${searchFilters.query}%`)
        }
        if (searchFilters.contentType) {
          query = query.eq('content_type', searchFilters.contentType)
        }
        if (searchFilters.isFavorite === true) {
          query = query.eq('is_favorite', true)
        }

        const result = await query
        data = result.data
        error = result.error
      }

      if (error) throw error
      
      // Process the data to include attachments
      const processedNotes = await Promise.all(
        (data || []).map(async (note: any) => {
          // Try to fetch attachments, fallback gracefully
          try {
            const { data: attachments } = await supabase
              .from('note_attachments')
              .select('*')
              .eq('note_id', note.id)
              .order('order_index')

            return {
              ...note,
              attachments: attachments || []
            }
          } catch (attachmentError) {
            // If attachments table doesn't exist, return note without attachments
            return {
              ...note,
              attachments: []
            }
          }
        })
      )

      setNotes(processedNotes)
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch notes')
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableTags = async () => {
    if (!supabaseReady) return

    try {
      // Try to fetch from note_tags table first
      const { data, error } = await supabase
        .from('note_tags')
        .select('name')
        .order('name')

      if (error) throw error
      setAvailableTags(data?.map(tag => tag.name) || [])
    } catch (error: any) {
      // If note_tags table doesn't exist, extract tags from existing notes
      try {
        const { data: notes } = await supabase
          .from('notes')
          .select('tags')
          .not('tags', 'is', null)

        if (notes) {
          const allTags = new Set<string>()
          notes.forEach(note => {
            if (note.tags && Array.isArray(note.tags)) {
              note.tags.forEach(tag => allTags.add(tag))
            }
          })
          setAvailableTags(Array.from(allTags).sort())
        }
      } catch (fallbackError) {
        console.log('Tags feature not available yet')
        setAvailableTags([])
      }
    }
  }

  const createEnhancedNote = async (noteData: CreateNoteData) => {
    if (!user || !supabaseReady) {
      toast.error('Please connect your Supabase project first')
      return
    }

    try {
      toast.loading('Creating note...')
      
      // Create the note first
      const { data: note, error: noteError } = await supabase
        .from('notes')
        .insert([{
          title: noteData.title,
          content: noteData.content,
          content_type: noteData.contentType,
          tags: noteData.tags || [],
          is_favorite: noteData.isFavorite || false,
          user_id: user.id
        }])
        .select()
        .single()

      if (noteError) throw noteError

      // Upload attachments if any
      const attachments: NoteAttachment[] = []
      if (noteData.attachments && noteData.attachments.length > 0) {
        for (let i = 0; i < noteData.attachments.length; i++) {
          const file = noteData.attachments[i]
          const fileType = file.type.startsWith('image/') ? 'image' : 'audio'
          
          // Validate file
          const validationError = validateFile(file, fileType)
          if (validationError) {
            toast.error(`${file.name}: ${validationError}`)
            continue
          }

          // Upload file
          const fileUploadResult = await uploadFile(file, user.id, fileType)
          
          // Try to create attachment record in new table, fallback to legacy fields
          try {
            const { data: attachment, error: attachmentError } = await supabase
              .from('note_attachments')
              .insert([{
                note_id: note.id,
                type: fileType,
                url: fileUploadResult.url,
                file_name: fileUploadResult.fileName,
                file_size: fileUploadResult.fileSize,
                order_index: i
              }])
              .select()
              .single()

            if (attachmentError) throw attachmentError
            
            attachments.push({
              id: attachment.id,
              type: fileType,
              url: fileUploadResult.url,
              fileName: fileUploadResult.fileName,
              fileSize: fileUploadResult.fileSize
            })
          } catch (attachmentError) {
            // If note_attachments table doesn't exist, store in legacy fields for first file
            if (i === 0) {
              await supabase
                .from('notes')
                .update({
                  file_url: fileUploadResult.url,
                  file_name: fileUploadResult.fileName,
                  file_size: fileUploadResult.fileSize
                })
                .eq('id', note.id)
            }
            
            // Add to local attachments array for UI
            attachments.push({
              id: `legacy-${i}`,
              type: fileType,
              url: fileUploadResult.url,
              fileName: fileUploadResult.fileName,
              fileSize: fileUploadResult.fileSize
            })
          }
        }
      }

      // Add tags to available tags if they're new
      if (noteData.tags) {
        for (const tag of noteData.tags) {
          if (!availableTags.includes(tag)) {
            try {
              await supabase
                .from('note_tags')
                .upsert([{ user_id: user.id, name: tag }])
            } catch (tagError) {
              // If note_tags table doesn't exist, just continue
              console.log('Tag management not available yet')
            }
          }
        }
      }

      const finalNote = { ...note, attachments }
      setNotes(prev => [finalNote, ...prev])
      
      toast.dismiss()
      toast.success('Note created successfully!')
      return finalNote
    } catch (error: any) {
      toast.dismiss()
      toast.error(error.message || 'Failed to create note')
      throw error
    }
  }

  const updateNote = async (noteId: string, updates: Partial<CreateNoteData>) => {
    if (!supabaseReady) {
      toast.error('Please connect your Supabase project first')
      return
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .update({
          title: updates.title,
          content: updates.content,
          tags: updates.tags,
          is_favorite: updates.isFavorite
        })
        .eq('id', noteId)
        .select()
        .single()

      if (error) throw error

      setNotes(prev => prev.map(note => 
        note.id === noteId ? { ...note, ...data } : note
      ))
      
      toast.success('Note updated successfully!')
      return data
    } catch (error: any) {
      toast.error(error.message || 'Failed to update note')
      throw error
    }
  }

  const deleteNote = async (noteId: string) => {
    if (!supabaseReady) {
      toast.error('Please connect your Supabase project first')
      return
    }

    try {
      // Get note attachments before deletion
      const { data: attachments } = await supabase
        .from('note_attachments')
        .select('file_name')
        .eq('note_id', noteId)

      // Delete the note (cascades to attachments)
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)

      if (error) throw error

      // Delete associated files
      if (attachments && attachments.length > 0) {
        for (const attachment of attachments) {
          try {
            await deleteFile(attachment.file_name)
          } catch (fileError) {
            console.error('Failed to delete file:', fileError)
          }
        }
      }

      setNotes(prev => prev.filter(note => note.id !== noteId))
      toast.success('Note deleted successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete note')
      throw error
    }
  }

  const toggleFavorite = async (noteId: string) => {
    const note = notes.find(n => n.id === noteId)
    if (!note) return

    try {
      const { error } = await supabase
        .from('notes')
        .update({ is_favorite: !note.is_favorite })
        .eq('id', noteId)

      if (error) throw error

      setNotes(prev => prev.map(n => 
        n.id === noteId ? { ...n, is_favorite: !n.is_favorite } : n
      ))
    } catch (error: any) {
      toast.error('Failed to update favorite status')
    }
  }

  const addAttachmentToNote = async (noteId: string, file: File, caption?: string) => {
    if (!user || !supabaseReady) return

    try {
      const fileType = file.type.startsWith('image/') ? 'image' : 'audio'
      
      // Validate and upload file
      const validationError = validateFile(file, fileType)
      if (validationError) {
        toast.error(validationError)
        return
      }

      toast.loading('Uploading attachment...')
      const fileUploadResult = await uploadFile(file, user.id, fileType)
      
      // Get current attachment count for order
      const { count } = await supabase
        .from('note_attachments')
        .select('*', { count: 'exact', head: true })
        .eq('note_id', noteId)

      // Create attachment record
      const { data: attachment, error } = await supabase
        .from('note_attachments')
        .insert([{
          note_id: noteId,
          type: fileType,
          url: fileUploadResult.url,
          file_name: fileUploadResult.fileName,
          file_size: fileUploadResult.fileSize,
          caption,
          order_index: count || 0
        }])
        .select()
        .single()

      if (error) throw error

      // Update local state
      setNotes(prev => prev.map(note => {
        if (note.id === noteId) {
          const newAttachment: NoteAttachment = {
            id: attachment.id,
            type: fileType,
            url: fileUploadResult.url,
            fileName: fileUploadResult.fileName,
            fileSize: fileUploadResult.fileSize,
            caption
          }
          return {
            ...note,
            attachments: [...(note.attachments || []), newAttachment],
            content_type: 'mixed'
          }
        }
        return note
      }))

      toast.dismiss()
      toast.success('Attachment added successfully!')
    } catch (error: any) {
      toast.dismiss()
      toast.error(error.message || 'Failed to add attachment')
    }
  }

  const recordNoteView = async (noteId: string) => {
    if (!user || !supabaseReady) return

    try {
      await supabase
        .from('note_views')
        .insert([{
          note_id: noteId,
          user_id: user.id
        }])
    } catch (error) {
      // Silently fail for view tracking
      console.error('Failed to record note view:', error)
    }
  }

  // Legacy support methods
  const createNote = async (content: string) => {
    return createEnhancedNote({
      content,
      contentType: 'text'
    })
  }

  const createMultimediaNote = async (
    content: string,
    contentType: NoteContentType,
    file?: File
  ) => {
    return createEnhancedNote({
      content,
      contentType,
      attachments: file ? [file] : undefined
    })
  }

  return {
    // Data
    notes,
    loading,
    availableTags,
    searchFilters,
    
    // Actions
    createEnhancedNote,
    updateNote,
    deleteNote,
    toggleFavorite,
    addAttachmentToNote,
    recordNoteView,
    setSearchFilters,
    refetch: fetchNotes,
    
    // Legacy support
    createNote,
    createMultimediaNote,
  }
}