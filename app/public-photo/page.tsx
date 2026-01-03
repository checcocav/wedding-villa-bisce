'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useRef } from 'react'

export default function PublicPhotoUpload() {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [uploaderName, setUploaderName] = useState('')
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
    if (!uploaderName.trim()) {
      setMessage({ type: 'error', text: 'Per favore inserisci il tuo nome' })
      return
    }

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
          const fileName = `public-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
          const filePath = `${fileName}`

          const { error: uploadError } = await supabase.storage
            .from('wedding-photos')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            })

          if (uploadError) throw uploadError

          // Insert with null guest_id and uploader_name
          const { error: dbError } = await supabase
            .from('photos')
            .insert({
              guest_id: null,
              storage_path: filePath,
              uploader_name: uploaderName.trim()
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
        setUploaderName('')
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
    <div style={{
      fontFamily: 'Georgia, serif',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '40px 20px'
    }}>
      <main style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{
          background: 'white',
          borderRadius: 8,
          padding: 32,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '300',
            color: '#2c3e50',
            marginBottom: 16,
            textAlign: 'center',
            letterSpacing: '0.5px'
          }}>
            📸 Condividi i Tuoi Momenti
          </h1>
          <p style={{ 
            textAlign: 'center', 
            color: '#546e7a',
            marginBottom: 32,
            fontSize: '1.1rem'
          }}>
            Carica le tue foto del matrimonio per condividerle con gli sposi! 🎉
          </p>

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

          {/* Name Input */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              marginBottom: 8,
              color: '#2c3e50',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              Il tuo nome *
            </label>
            <input
              type="text"
              value={uploaderName}
              onChange={(e) => setUploaderName(e.target.value)}
              placeholder="Es. Mario Rossi"
              style={{
                width: '100%',
                padding: 12,
                border: '1px solid #ddd',
                borderRadius: 4,
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
            />
          </div>

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

          {/* Buttons or Preview */}
          {previewUrls.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={handleCameraCapture}
                style={{
                  width: '100%',
                  padding: 20,
                  fontSize: 18,
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontFamily: 'inherit'
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
                  background: '#764ba2',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontFamily: 'inherit'
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
                    fontWeight: 'bold',
                    fontFamily: 'inherit'
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
                    fontWeight: 'bold',
                    fontFamily: 'inherit'
                  }}
                >
                  ❌ Annulla
                </button>
              </div>
            </div>
          )}

          {/* Info */}
          <p style={{ marginTop: 24, fontSize: 14, color: '#666', textAlign: 'center' }}>
            Le tue foto saranno visibili agli sposi e agli ospiti registrati 💝
          </p>
        </div>
      </main>
    </div>
  )
}
