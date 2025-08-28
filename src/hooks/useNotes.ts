import { useState, useEffect } from 'react'
import { supabase, Note, NoteContentType, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { uploadFile, deleteFile, validateFile, FileUploadResult } from '../lib/fileUpload'
import toast from 'react-hot-toast'

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const { user, supabaseReady } = useAuth()

  useEffect(() => {
    if (user && supabaseReady) {
      fetchNotes()
    } else {
      setNotes([])
      setLoading(false)
    }
  }, [user, supabaseReady])

  const fetchNotes = async () => {
    if (!supabaseReady) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch notes')
    } finally {
      setLoading(false)
    }
  }

  const createNote = async (content: string) => {
    if (!user || !supabaseReady) {
      toast.error('Please connect your Supabase project first')
      return
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{ 
          content, 
          user_id: user.id,
          content_type: 'text' as NoteContentType
        }])
        .select()
        .single()

      if (error) throw error
      
      setNotes(prev => [data, ...prev])
      toast.success('Note created successfully!')
      return data
    } catch (error: any) {
      toast.error(error.message || 'Failed to create note')
      throw error
    }
  }

  const createMultimediaNote = async (
    content: string,
    contentType: NoteContentType,
    file?: File
  ) => {
    if (!user || !supabaseReady) {
      toast.error('Please connect your Supabase project first')
      return
    }

    try {
      let fileUploadResult: FileUploadResult | null = null

      // Handle file upload for audio and image notes
      if (file && (contentType === 'audio' || contentType === 'image')) {
        // Validate file
        const validationError = validateFile(file, contentType)
        if (validationError) {
          toast.error(validationError)
          return
        }

        // Upload file
        toast.loading('Uploading file...')
        fileUploadResult = await uploadFile(file, user.id, contentType)
        toast.dismiss()
      }

      // Create note record
      const noteData = {
        content,
        user_id: user.id,
        content_type: contentType,
        ...(fileUploadResult && {
          file_url: fileUploadResult.url,
          file_name: fileUploadResult.fileName,
          file_size: fileUploadResult.fileSize
        })
      }

      const { data, error } = await supabase
        .from('notes')
        .insert([noteData])
        .select()
        .single()

      if (error) throw error
      
      setNotes(prev => [data, ...prev])
      toast.success(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} note created successfully!`)
      return data
    } catch (error: any) {
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
      // Find the note to get file info before deletion
      const noteToDelete = notes.find(note => note.id === noteId)
      
      // Delete the note from database
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)

      if (error) throw error

      // Delete associated file if it exists
      if (noteToDelete?.file_name) {
        try {
          await deleteFile(noteToDelete.file_name)
        } catch (fileError) {
          console.error('Failed to delete associated file:', fileError)
          // Don't throw here as the note is already deleted from DB
        }
      }
      
      setNotes(prev => prev.filter(note => note.id !== noteId))
      toast.success('Note deleted successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete note')
      throw error
    }
  }

  return {
    notes,
    loading,
    createNote,
    createMultimediaNote,
    deleteNote,
    refetch: fetchNotes,
  }
}
