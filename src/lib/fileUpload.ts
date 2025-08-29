import { supabase } from './supabase'
import { v4 as uuidv4 } from 'uuid'

export interface FileUploadResult {
  url: string
  fileName: string
  fileSize: number
}

export const uploadFile = async (
  file: File,
  userId: string,
  contentType: 'audio' | 'image' | 'profile'
): Promise<FileUploadResult> => {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = contentType === 'profile' 
      ? `${userId}/profile/avatar.${fileExt}`
      : `${userId}/${contentType}/${uuidv4()}.${fileExt}`
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('notes-media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: contentType === 'profile' // Allow overwriting for profile pictures
      })

    if (error) {
      // Provide more specific error messages
      if (error.message.includes('Bucket not found')) {
        throw new Error('Storage bucket "notes-media" not found. Please create it in your Supabase dashboard. See SETUP_INSTRUCTIONS.md for detailed steps.')
      }
      throw new Error(`Upload failed: ${error.message}`)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('notes-media')
      .getPublicUrl(fileName)

    return {
      url: publicUrl,
      fileName: data.path,
      fileSize: file.size
    }
  } catch (error) {
    console.error('File upload error:', error)
    throw error
  }
}

export const deleteFile = async (fileName: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from('notes-media')
      .remove([fileName])

    if (error) {
      throw new Error(`Delete failed: ${error.message}`)
    }
  } catch (error) {
    console.error('File delete error:', error)
    throw error
  }
}

export const validateFile = (file: File, type: 'audio' | 'image'): string | null => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  
  if (file.size > maxSize) {
    return 'File size must be less than 10MB'
  }

  if (type === 'image') {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validImageTypes.includes(file.type)) {
      return 'Please select a valid image file (JPEG, PNG, GIF, or WebP)'
    }
  }

  if (type === 'audio') {
    const validAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/webm']
    if (!validAudioTypes.includes(file.type)) {
      return 'Please select a valid audio file (MP3, WAV, OGG, MP4, or WebM)'
    }
  }

  return null
}
