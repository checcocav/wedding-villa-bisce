import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createClient()
  
  // Verifica la sessione
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  console.log('Session:', session)
  console.log('Session error:', sessionError)
  
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()
  
  console.log('User:', user)
  console.log('User error:', userError)
  
  if (!user) {
    return <p>Non autenticato</p>
  }

  const { data: guest, error: guestError } = await supabase
    .from('guests')
    .select('*')
    .eq('id', user.id)
    .single()

  console.log('Guest error:', guestError)
  console.log('Guest data:', guest)
  console.log('Has plus one:', guest?.has_plus_one) // Added debug

  if (!guest) {
    return (
      <div>
        <p>Non risulti tra gli invitati.</p>
        <p>Email: {user.email}</p>
        {guestError && <p>Errore: {JSON.stringify(guestError)}</p>}
      </div>
    )
  }

  return (
    <main style={{ padding: 32 }}>
      <h1>
        Benvenuto {guest.first_name} {guest.last_name}
      </h1>
      <p>
        📅 <strong>29 Agosto 2026</strong>
      </p>
      <p>
        📍 <strong>Villa delle Bisce</strong>
      </p>
      <p>
        Stato RSVP: <strong>{guest.rsvp_status || 'pending'}</strong>
      </p>
      
      <form method="post" action="/rsvp">
        <button name="status" value="yes">
          Confermo la presenza
        </button>
        <button name="status" value="no">
          Non partecipo
        </button>
      </form>

      {guest.has_plus_one === true && (
        <section style={{ marginTop: 32, padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
          <h2>Il tuo accompagnatore</h2>
          <form method="post" action="/plus-one" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="text"
              name="first_name"
              placeholder="Nome"
              defaultValue={guest.plus_one_first_name || ''}
              required
              style={{ padding: 8 }}
            />
            <input
              type="text"
              name="last_name"
              placeholder="Cognome"
              defaultValue={guest.plus_one_last_name || ''}
              required
              style={{ padding: 8 }}
            />
            <button type="submit" style={{ padding: 8 }}>
              Salva accompagnatore
            </button>
          </form>
        </section>
      )}

      {/* Debug info - remove after testing */}
      <div style={{ marginTop: 32, padding: 16, background: '#f0f0f0', fontSize: 12 }}>
        <p>Debug: has_plus_one = {JSON.stringify(guest.has_plus_one)}</p>
      </div>
    </main>
  )
}
