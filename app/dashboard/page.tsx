import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) {
    return <p>Non autenticato</p>
  }

  // Cerca per EMAIL invece che per ID
  const { data: guest, error } = await supabase
    .from('guests')
    .select('*')
    .eq('email', user.email)
    .single()

  // Debug: mostra l'errore se c'è
  if (error) {
    console.error('Errore query guest:', error)
  }

  if (!guest) {
    return (
      <div>
        <p>Non risulti tra gli invitati.</p>
        <p className="text-sm text-gray-500">Email: {user.email}</p>
      </div>
    )
  }

  return (
    <div>
      <h1>
        Ciao {guest.first_name} {guest.last_name} 👋
      </h1>
      <p>RSVP: {guest.rsvp_status}</p>
    </div>
  )
}
