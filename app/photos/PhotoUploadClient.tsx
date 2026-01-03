'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useRef } from 'react'

export default function PhotoUploadClient({ 
  guestId, 
  guestName 
}: { 
  guestId: string
  guestName: string 
}) {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleCameraCapture = () => {
    cameraInputRef.current?.click()
  }

  const handleGallerySelect = () => {
    galleryInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Mostra preview
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setMessage(null)
  }

  const handleUpload = async () => {
    const file = cameraInputRef.current?.files?.[0] || galleryInputRef.current?.files?.[0]
    if (!file) {
      setMessage({ type: 'error', text: 'Nessuna foto selezionata' })
      return
    }

    setUploading(true)
    setMessage(null)

    try {
      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${guestId}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('wedding-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // 2. Insert record in photos table
      const { error: dbError } = await supabase
        .from('photos')
        .insert({
          guest_id: guestId,
          storage_path: filePath,
        })

      if (dbError) throw dbError

      // Success!
      setMessage({ type: 'success', text: '✅ Foto caricata con successo!' })
      setPreviewUrl(null)
      if (cameraInputRef.current) cameraInputRef.current.value = ''
      if (galleryInputRef.current) galleryInputRef.current.value = ''

    } catch (error: any) {
      console.error('Upload error:', error)
      setMessage({ type: 'error', text: `❌ Errore: ${error.message}` })
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = () => {
    setPreviewUrl(null)
    setMessage(null)
    if (cameraInputRef.current) cameraInputRef.current.value = ''
    if (galleryInputRef.current) galleryInputRef.current.value = ''
  }

  return (
    <div style={{ marginTop: 32 }}>
      {/* Messages */}
      {message && (
        <div style={{
          padding: 12,
          marginBottom: 16,
          background: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          borderRadius: 4,
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message.text}
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Two separate buttons or Preview */}
      {!previewUrl ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={handleCameraCapture}
            style={{
              width: '100%',
              padding: 20,
              fontSize: 18,
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            📷 Scatta una foto
          </button>
          
          <button
            onClick={handleGallerySelect}
            style={{
              width: '100%',
              padding: 20,
              fontSize: 18,
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🖼️ Scegli dalla galleria
          </button>
        </div>
      ) : (
        <div>
          {/* Preview */}
          <div style={{
            marginBottom: 16,
            border: '2px solid #ccc',
            borderRadius: 8,
            overflow: 'hidden'
          }}>
            <img 
              src={previewUrl} 
              alt="Preview" 
              style={{ width: '100%', display: 'block' }}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={handleUpload}
              disabled={uploading}
              style={{
                flex: 1,
                padding: 12,
                fontSize: 16,
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: uploading ? 'not-allowed' : 'pointer',
                opacity: uploading ? 0.6 : 1,
                fontWeight: 'bold'
              }}
            >
              {uploading ? '⏳ Caricamento...' : '✅ Carica foto'}
            </button>
            
            <button
              onClick={handleCancel}
              disabled={uploading}
              style={{
                flex: 1,
                padding: 12,
                fontSize: 16,
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: uploading ? 'not-allowed' : 'pointer',
                opacity: uploading ? 0.6 : 1,
                fontWeight: 'bold'
              }}
            >
              ❌ Annulla
            </button>
          </div>
        </div>
      )}

      {/* Info */}
      <p style={{ marginTop: 24, fontSize: 14, color: '#666', textAlign: 'center' }}>
        Le tue foto saranno visibili nella gallery del matrimonio 🎉
      </p>
    </div>
  )
}
