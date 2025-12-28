'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [guest, setGuest] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadGuest = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user?.email) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('email', user.email)
        .single()

      if (!error) {
        setGuest(data)
      }

      setLoading(false)
    }

    loadGuest()
  }, [])

  if (loading) return <p>Caricamento…</p>

  if (!guest) {
    return <p>Non risulti tra gli invitati.</p>
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>
        Ciao {guest.first_name} {guest.last_name} 👋
      </h1>

      <p>RSVP: {guest.rsvp_status}</p>

      {guest.has_plus_one && (
        <p>Hai diritto a un +1</p>
      )}

      {guest.role === 'admin' && (
        <p>🔐 Accesso amministratore</p>
      )}
    </main>
  )
}
