import { useState, useEffect } from 'react'
import { supabase, Note, NoteContentType, isSupabaseConfigured } from '../lib/supabase'
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

export const useCompatibleNotes = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({})
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [isEnhancedMode, setIsEnhancedMode] = useState(false)
  const { user, supabaseReady } = useAuth()

  // Check if enhanced features are available
  useEffect(() => {
    const checkEnhancedFeatures = async () => {
      if (!supabaseReady) return

      try {
        // Test if enhanced tables and columns exist
        await supabase.from('note_tags').select('id').limit(1)
        await supabase.from('note_attachments').select('id').limit(1)
        
        // Test if enhanced columns exist in notes table
        await supabase.from('notes').select('updated_at, title, tags, is_favorite').limit(1)
        
        setIsEnhancedMode(true)
        console.log('Enhanced features available')
      } catch (error) {
        setIsEnhancedMode(false)
        console.log('Using basic mode - enhanced features not available')
      }
    }

    checkEnhancedFeatures()
  }, [supabaseReady])

  useEffect(() => {
    if (user && supabaseReady) {
      fetchNotes()
      fetchAvailableTags()
    } else {
      setNotes([])
      setLoading(false)
    }
  }, [user, supabaseReady, searchFilters, isEnhancedMode])

  const fetchNotes = async () => {
    if (!supabaseReady) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Build query with filters based on available columns
      let query = supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })

      // Apply filters
      if (searchFilters.query) {
        if (isEnhancedMode) {
          query = query.or(`content.ilike.%${searchFilters.query}%,title.ilike.%${searchFilters.query}%`)
        } else {
          query = query.ilike('content', `%${searchFilters.query}%`)
        }
      }
      
      if (searchFilters.contentType) {
        query = query.eq('content_type', searchFilters.contentType)
      }
      
      if (isEnhancedMode && searchFilters.isFavorite === true) {
        query = query.eq('is_favorite', true)
      }

      const { data, error } = await query

      if (error) throw error
      
      // Process notes to include attachments
      const processedNotes = await Promise.all(
        (data || []).map(async (note: any) => {
          if (isEnhancedMode) {
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
              return { ...note, attachments: [] }
            }
          } else {
            return { ...note, attachments: [] }
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
      if (isEnhancedMode) {
        const { data, error } = await supabase
          .from('note_tags')
          .select('name')
          .order('name')

        if (error) throw error
        setAvailableTags(data?.map(tag => tag.name) || [])
      } else {
        // Extract tags from existing notes if enhanced mode not available
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
      }
    } catch (error: any) {
      console.log('Tags not available')
      setAvailableTags([])
    }
  }

  const createNote = async (noteData: CreateNoteData) => {
    if (!user || !supabaseReady) {
      toast.error('Please connect your Supabase project first')
      return
    }

    try {
      toast.loading('Creating note...')
      
      // Determine content type
      let finalContentType = noteData.contentType
      if (noteData.attachments && noteData.attachments.length > 1) {
        finalContentType = 'mixed'
      } else if (noteData.attachments && noteData.attachments.length === 1) {
        const file = noteData.attachments[0]
        finalContentType = file.type.startsWith('image/') ? 'image' : 'audio'
      }

      // Create note data object with only basic fields
      const noteInsertData: any = {
        content: noteData.content,
        content_type: finalContentType,
        user_id: user.id
      }

      // Add enhanced fields only if enhanced mode is confirmed
      if (isEnhancedMode) {
        if (noteData.title) noteInsertData.title = noteData.title
        if (noteData.tags && noteData.tags.length > 0) noteInsertData.tags = noteData.tags
        if (noteData.isFavorite) noteInsertData.is_favorite = noteData.isFavorite
      }

      // Create the note
      const { data: note, error: noteError } = await supabase
        .from('notes')
        .insert([noteInsertData])
        .select()
        .single()

      if (noteError) throw noteError

      // Handle file uploads
      if (noteData.attachments && noteData.attachments.length > 0) {
        const firstFile = noteData.attachments[0]
        const fileType = firstFile.type.startsWith('image/') ? 'image' : 'audio'
        
        // Validate and upload first file
        const validationError = validateFile(firstFile, fileType)
        if (validationError) {
          toast.error(validationError)
          return
        }

        const fileUploadResult = await uploadFile(firstFile, user.id, fileType)
        
        // Update note with file info (legacy support)
        await supabase
          .from('notes')
          .update({
            file_url: fileUploadResult.url,
            file_name: fileUploadResult.fileName,
            file_size: fileUploadResult.fileSize
          })
          .eq('id', note.id)

        // If enhanced mode, also create attachment records
        if (isEnhancedMode) {
          try {
            for (let i = 0; i < noteData.attachments.length; i++) {
              const file = noteData.attachments[i]
              const attachmentType = file.type.startsWith('image/') ? 'image' : 'audio'
              
              let uploadResult = fileUploadResult
              if (i > 0) {
                // Upload additional files
                uploadResult = await uploadFile(file, user.id, attachmentType)
              }

              await supabase
                .from('note_attachments')
                .insert([{
                  note_id: note.id,
                  type: attachmentType,
                  url: uploadResult.url,
                  file_name: uploadResult.fileName,
                  file_size: uploadResult.fileSize,
                  order_index: i
                }])
            }
          } catch (attachmentError) {
            console.log('Could not create attachment records:', attachmentError)
          }
        }

        // Update local note object
        note.file_url = fileUploadResult.url
        note.file_name = fileUploadResult.fileName
        note.file_size = fileUploadResult.fileSize
      }

      // Add tags to available tags if enhanced mode
      if (isEnhancedMode && noteData.tags) {
        for (const tag of noteData.tags) {
          if (!availableTags.includes(tag)) {
            try {
              await supabase
                .from('note_tags')
                .upsert([{ user_id: user.id, name: tag }])
            } catch (tagError) {
              console.log('Could not save tag:', tagError)
            }
          }
        }
      }

      setNotes(prev => [note, ...prev])
      toast.dismiss()
      toast.success('Note created successfully!')
      return note
    } catch (error: any) {
      toast.dismiss()
      toast.error(error.message || 'Failed to create note')
      throw error
    }
  }

  const deleteNote = async (noteId: string) => {
    if (!supabaseReady) {
      toast.error('Please connect your Supabase project first')
      return
    }

    try {
      // Find the note to get file info
      const noteToDelete = notes.find(note => note.id === noteId)
      
      // Delete the note
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)

      if (error) throw error

      // Delete associated files
      if (noteToDelete?.file_name) {
        try {
          await deleteFile(noteToDelete.file_name)
        } catch (fileError) {
          console.error('Failed to delete file:', fileError)
        }
      }

      // Delete additional attachment files if enhanced mode
      if (isEnhancedMode && noteToDelete?.attachments) {
        for (const attachment of noteToDelete.attachments) {
          try {
            await deleteFile(attachment.fileName)
          } catch (fileError) {
            console.error('Failed to delete attachment:', fileError)
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
    if (!isEnhancedMode) {
      toast.error('Favorites feature requires database upgrade')
      return
    }

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

  const recordNoteView = async (noteId: string) => {
    if (!isEnhancedMode || !user || !supabaseReady) return

    try {
      await supabase
        .from('note_views')
        .insert([{
          note_id: noteId,
          user_id: user.id
        }])
    } catch (error) {
      // Silently fail for view tracking
      console.log('View tracking not available')
    }
  }

  // Legacy support methods
  const createTextNote = async (content: string) => {
    return createNote({
      content,
      contentType: 'text'
    })
  }

  const createMultimediaNote = async (
    content: string,
    contentType: NoteContentType,
    file?: File
  ) => {
    return createNote({
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
    isEnhancedMode,
    
    // Actions
    createNote,
    deleteNote,
    toggleFavorite,
    recordNoteView,
    setSearchFilters,
    refetch: fetchNotes,
    
    // Legacy support
    createTextNote,
    createMultimediaNote,
  }
}