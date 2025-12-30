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
    .eq('email', user.email)
    .single()

  console.log('Guest error:', guestError)
  console.log('Guest data:', guest)

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
    <div>
      <h1>Ciao {guest.first_name} {guest.last_name} 👋</h1>
      <p>RSVP: {guest.rsvp_status}</p>
    </div>
  )
}
