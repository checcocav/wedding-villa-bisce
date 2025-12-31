'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

type Photo = {
  id: string
  storage_path: string
  created_at: string
  guests: {
    first_name: string
    last_name: string
  } | null
}

export default function GalleryClient({ photos: initialPhotos }: { photos: Photo[] }) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos)
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({})
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; photo: Photo } | null>(null)
  const supabase = createClient()

  // Load photo URLs
  useEffect(() => {
    const loadPhotoUrls = async () => {
      const urls: Record<string, string> = {}
      
      for (const photo of photos) {
        const { data } = await supabase.storage
          .from('wedding-photos')
          .createSignedUrl(photo.storage_path, 3600) // 1 hour expiry
        
        if (data?.signedUrl) {
          urls[photo.id] = data.signedUrl
        }
      }
      
      setPhotoUrls(urls)
    }

    loadPhotoUrls()
  }, [photos, supabase])

  // REALTIME: Listen for new photos
  useEffect(() => {
    const channel = supabase
      .channel('photos-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'photos'
        },
        async (payload) => {
          console.log('New photo inserted!', payload)
          
          // Fetch the new photo with guest info
          const { data: newPhoto } = await supabase
            .from('photos')
            .select(`
              id,
              storage_path,
              created_at,
              guests!inner (
                first_name,
                last_name
              )
            `)
            .eq('id', payload.new.id)
            .single()

          if (newPhoto) {
            const transformedPhoto = {
              id: newPhoto.id,
              storage_path: newPhoto.storage_path,
              created_at: newPhoto.created_at,
              guests: Array.isArray(newPhoto.guests) ? newPhoto.guests[0] : newPhoto.guests
            }
            
            // Add to the top of the list
            setPhotos(prev => [transformedPhoto, ...prev])
            
            // Load the URL for the new photo
            const { data } = await supabase.storage
              .from('wedding-photos')
              .createSignedUrl(transformedPhoto.storage_path, 3600)
            
            if (data?.signedUrl) {
              setPhotoUrls(prev => ({
                ...prev,
                [transformedPhoto.id]: data.signedUrl
              }))
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      {/* Gallery Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: 16
      }}>
        {photos.map((photo) => (
          <div
            key={photo.id}
            style={{
              position: 'relative',
              background: '#f0f0f0',
              borderRadius: 8,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              border: '1px solid #ddd',
              animation: 'fadeIn 0.5s ease-in'
            }}
            onClick={() => photoUrls[photo.id] && setSelectedPhoto({ url: photoUrls[photo.id], photo })}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {photoUrls[photo.id] ? (
              <>
                <img
                  src={photoUrls[photo.id]}
                  alt={`Foto di ${photo.guests?.first_name || 'Ospite'}`}
                  style={{
                    width: '100%',
                    height: 250,
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <div style={{
                  padding: 12,
                  background: 'white'
                }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 'bold' }}>
                    {photo.guests ? `${photo.guests.first_name} ${photo.guests.last_name}` : 'Ospite'}
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#666' }}>
                    {formatDate(photo.created_at)}
                  </p>
                </div>
              </>
            ) : (
              <div style={{
                width: '100%',
                height: 250,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999'
              }}>
                Caricamento...
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div style={{ maxWidth: '90%', maxHeight: '90%', position: 'relative' }}>
            <img
              src={selectedPhoto.url}
              alt="Foto ingrandita"
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: 8
              }}
            />
            <div style={{
              marginTop: 16,
              padding: 16,
              background: 'white',
              borderRadius: 8,
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>
                {selectedPhoto.photo.guests 
                  ? `${selectedPhoto.photo.guests.first_name} ${selectedPhoto.photo.guests.last_name}` 
                  : 'Ospite'}
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: 14, color: '#666' }}>
                {formatDate(selectedPhoto.photo.created_at)}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedPhoto(null)
              }}
              style={{
                position: 'absolute',
                top: -40,
                right: 0,
                background: 'white',
                border: 'none',
                borderRadius: '50%',
                width: 40,
                height: 40,
                fontSize: 24,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  )
}
