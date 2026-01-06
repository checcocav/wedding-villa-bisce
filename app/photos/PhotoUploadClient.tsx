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

      for (const file of files) {
        try {
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

      if (successCount > 0 && errorCount === 0) {
        setMessage({ 
          type: 'success', 
          text: `✅ ${successCount} ${successCount === 1 ? 'foto caricata' : 'foto caricate'} con successo!` 
        })
        setPreviewUrls([])
        if (cameraInputRef.current) cameraInputRef.current.value = ''
        if (galleryInputRef.current) galleryInputRef.current.value = ''
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
          padding: 16,
          marginBottom: 24,
          background: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          borderRadius: 8,
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          fontStyle: 'italic'
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button
            onClick={handleCameraCapture}
            style={{
              width: '100%',
              padding: 24,
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: '400',
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              letterSpacing: '0.5px',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}
          >
            📷 Scatta una foto
          </button>
          
          <button
            onClick={handleGallerySelect}
            style={{
              width: '100%',
              padding: 24,
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: '400',
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              letterSpacing: '0.5px',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(240, 147, 251, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(240, 147, 251, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(240, 147, 251, 0.3)'
            }}
          >
            🖼️ Scegli dalla galleria
          </button>
        </div>
      ) : (
        <div>
          {/* Preview Grid */}
          <div style={{
            marginBottom: 24,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: 16
          }}>
            {previewUrls.map((url, index) => (
              <div key={index} style={{
                border: '2px solid #b8860b',
                borderRadius: 8,
                overflow: 'hidden',
                aspectRatio: '1',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <img 
                  src={url} 
                  alt={`Preview ${index + 1}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>

          <p style={{ 
            marginBottom: 20, 
            fontSize: '1rem', 
            color: '#546e7a', 
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            {previewUrls.length} {previewUrls.length === 1 ? 'foto selezionata' : 'foto selezionate'}
          </p>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 16 }}>
            <button
              onClick={handleUpload}
              disabled={uploading}
              style={{
                flex: 1,
                padding: 16,
                fontSize: '1rem',
                background: uploading ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: uploading ? 'not-allowed' : 'pointer',
                fontWeight: '400',
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                letterSpacing: '0.5px',
                transition: 'all 0.3s',
                boxShadow: uploading ? 'none' : '0 2px 8px rgba(40, 167, 69, 0.3)'
              }}
            >
              {uploading ? '⏳ Caricamento...' : '✅ Carica foto'}
            </button>
            
            <button
              onClick={handleCancel}
              disabled={uploading}
              style={{
                flex: 1,
                padding: 16,
                fontSize: '1rem',
                background: uploading ? '#ccc' : '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: uploading ? 'not-allowed' : 'pointer',
                fontWeight: '400',
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                letterSpacing: '0.5px',
                transition: 'all 0.3s',
                boxShadow: uploading ? 'none' : '0 2px 8px rgba(220, 53, 69, 0.3)'
              }}
            >
              ❌ Annulla
            </button>
          </div>
        </div>
      )}

      {/* Info */}
      <p style={{ 
        marginTop: 32, 
        fontSize: '0.95rem', 
        color: '#546e7a', 
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        Le tue foto saranno visibili nella gallery del matrimonio 🎉
      </p>
    </div>
  )
}
