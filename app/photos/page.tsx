import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PhotoUploadClient from './PhotoUploadClient'

export default async function PhotosPage() {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: guest } = await supabase
    .from('guests')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!guest) {
    return <p>Non risulti tra gli invitati.</p>
  }

  return (
    <div style={{ 
      fontFamily: 'Georgia, serif',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e0e0e0',
        padding: '24px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: '300',
          color: '#2c3e50',
          margin: 0,
          letterSpacing: '1px',
          fontStyle: 'italic'
        }}>
          📸 Condividi i Tuoi Momenti
        </h1>
      </header>

      <main style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Welcome Message */}
        <div style={{
          background: 'white',
          borderRadius: 8,
          padding: '32px',
          marginBottom: 32,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#2c3e50',
            margin: 0,
            fontStyle: 'italic'
          }}>
            Ciao <strong>{guest.first_name}</strong>! 
          </p>
          <p style={{
            fontSize: '1rem',
            color: '#546e7a',
            marginTop: 12,
            fontStyle: 'italic'
          }}>
            Scatta e condividi i tuoi momenti speciali del matrimonio
          </p>
        </div>

        {/* Navigation Links */}
        <div style={{ 
          marginBottom: 32, 
          display: 'flex', 
          gap: 12, 
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <a 
            href="/dashboard" 
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'white',
              color: '#2c3e50',
              textDecoration: 'none',
              borderRadius: 8,
              fontSize: '0.95rem',
              fontStyle: 'italic',
              border: '1px solid #ddd',
              transition: 'all 0.3s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            ← Dashboard
          </a>
          <a 
            href="/gallery" 
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 8,
              fontSize: '0.95rem',
              fontStyle: 'italic',
              fontWeight: '500',
              transition: 'all 0.3s',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)'
            }}
          >
            🖼️ Vedi tutte le foto
          </a>
        </div>

        {/* Upload Section */}
        <div style={{
          background: 'white',
          borderRadius: 8,
          padding: '32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <PhotoUploadClient guestId={guest.id} guestName={`${guest.first_name} ${guest.last_name}`} />
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '32px 20px',
        textAlign: 'center',
        marginTop: 60
      }}>
        <a 
          href="/"
          style={{
            color: '#667eea',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontStyle: 'italic'
          }}
        >
          ← Torna alla home
        </a>
      </footer>
    </div>
  )
}
