import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboardClient from './AdminDashboardClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verify admin
  const { data: admin } = await supabase
    .from('guests')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!admin || admin.role !== 'admin') {
    redirect('/dashboard')
  }

  // Fetch all guests
  const { data: guests } = await supabase
    .from('guests')
    .select('*')
    .order('last_name', { ascending: true })

  return (
    <div style={{
      fontFamily: 'Georgia, serif',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
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
          letterSpacing: '1px'
        }}>
          🛠️ Admin Dashboard
        </h1>
      </header>

      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        <div style={{ marginBottom: 24 }}>
          
            href="/dashboard"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              background: 'white',
              color: '#667eea',
              textDecoration: 'none',
              borderRadius: 4,
              fontSize: '0.9rem',
              border: '1px solid #667eea'
            }}
          >
            ← Torna alla dashboard
          </a>
        </div>

        <AdminDashboardClient guests={guests || []} />
      </main>
    </div>
  )
}
