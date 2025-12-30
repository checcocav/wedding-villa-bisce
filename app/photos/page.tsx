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
    .eq('id', user.id)
    .single()

  if (!guest) {
    return <p>Non risulti tra gli invitati.</p>
  }

  return (
    <main style={{ padding: 32, maxWidth: 800, margin: '0 auto' }}>
      <h1>📸 Foto del Matrimonio</h1>
      <p>Ciao {guest.first_name}! Scatta e condividi i tuoi momenti speciali.</p>
      
      <PhotoUploadClient guestId={user.id} guestName={`${guest.first_name} ${guest.last_name}`} />
    </main>
  )
}
