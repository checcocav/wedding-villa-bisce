import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GalleryClient from './GalleryClient'

export default async function GalleryPage() {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch all photos with guest information
  const { data: photos, error } = await supabase
    .from('photos')
    .select(`
      id,
      storage_path,
      created_at,
      guest:guests(first_name, last_name)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching photos:', error)
  }

  return (
    <main style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1>🎉 Gallery del Matrimonio</h1>
        <p>Tutti i momenti speciali condivisi dagli ospiti</p>
        
        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          <a 
            href="/dashboard" 
            style={{
              display: 'inline-block',
              padding: 10,
              background: '#6c757d',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 4,
              fontSize: 14
            }}
          >
            ← Torna alla dashboard
          </a>
          <a 
            href="/photos" 
            style={{
              display: 'inline-block',
              padding: 10,
              background: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 'bold'
            }}
          >
            📷 Carica nuova foto
          </a>
        </div>
      </div>

      {photos && photos.length > 0 ? (
        <>
          <p style={{ marginBottom: 16, color: '#666' }}>
            {photos.length} {photos.length === 1 ? 'foto' : 'foto'} condivise
          </p>
          <GalleryClient photos={photos} />
        </>
      ) : (
        <div style={{ 
          padding: 40, 
          textAlign: 'center', 
          background: '#f9f9f9', 
          borderRadius: 8,
          border: '1px solid #ccc'
        }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>📷</p>
          <p style={{ fontSize: 18, marginBottom: 8 }}>Nessuna foto ancora</p>
          <p style={{ color: '#666' }}>Sii il primo a condividere un momento speciale!</p>
          <a 
            href="/photos" 
            style={{
              display: 'inline-block',
              marginTop: 16,
              padding: 12,
              background: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 4,
              fontWeight: 'bold'
            }}
          >
            📷 Carica la prima foto
          </a>
        </div>
      )}
    </main>
  )
}
