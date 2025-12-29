import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <p>Non autenticato</p>
  }

  const { data: guest } = await supabase
    .from('guests')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!guest) {
    return <p>Non risulti tra gli invitati.</p>
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
