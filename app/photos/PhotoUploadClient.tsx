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
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
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
    const files = e.target.files
    if (!files || files.length === 0) return

    // Crea preview per tutte le foto selezionate
    const urls = Array.from(files).map(file => URL.createObjectURL(file))
    setPreviewUrls(urls)
    setMessage(null)
  }

  const handleUpload = async () => {
    const files = Array.from(cameraInputRef.current?.files || []).concat(
      Array.from(galleryInputRef.current?.files || [])
    )
    
    if (files.length === 0) {
      setMessage({ type: 'error', text: 'Nessuna foto selezionata' })
      return
    }

    setUploading(true)
    setMessage(null)

    try {
      let successCount = 0
      let errorCount = 0

      // Carica ogni foto
      for (const file of files) {
        try {
          // 1. Upload file to Supabase Storage
          const fileExt = file.name.split('.').pop()
          const fileName = `${guestId}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
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

          successCount++
        } catch (error) {
          console.error('Error uploading file:', error)
          errorCount++
        }
      }

      // Mostra risultato
      if (successCount > 0 && errorCount === 0) {
        setMessage({ 
          type: 'success', 
          text: `✅ ${successCount} ${successCount === 1 ? 'foto caricata' : 'foto caricate'} con successo!` 
        })
      } else if (successCount > 0 && errorCount > 0) {
        setMessage({ 
          type: 'success', 
          text: `⚠️ ${successCount} foto caricate, ${errorCount} non riuscite` 
        })
      } else {
        setMessage({ 
          type: 'error', 
          text: `❌ Errore nel caricamento delle foto` 
        })
      }

      setPreviewUrls([])
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
    setPreviewUrls([])
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
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Two separate buttons or Preview */}
      {previewUrls.length === 0 ? (
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
          {/* Preview Grid */}
          <div style={{
            marginBottom: 16,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: 12
          }}>
            {previewUrls.map((url, index) => (
              <div key={index} style={{
                border: '2px solid #ccc',
                borderRadius: 8,
                overflow: 'hidden',
                aspectRatio: '1'
              }}>
                <img 
                  src={url} 
                  alt={`Preview ${index + 1}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>

          <p style={{ marginBottom: 12, fontSize: 14, color: '#666', textAlign: 'center' }}>
            {previewUrls.length} {previewUrls.length === 1 ? 'foto selezionata' : 'foto selezionate'}
          </p>

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
