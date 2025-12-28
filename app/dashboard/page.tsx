'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Guest = {
  first_name: string
  last_name: string
  email: string
  rsvp_status: 'pending' | 'yes' | 'no'
  has_plus_one: boolean
  role: string
}

export default function DashboardPage() {
  const [guest, setGuest] = useState<Guest | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadGuest = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user?.email) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('guests')
        .select('*')
        .eq('email', user.email)
        .single()

      setGuest(data)
      setLoading(false)
    }

    loadGuest()
  }, [])

  const updateRsvp = async (status: 'yes' | 'no') => {
    if (!guest) return

    setSaving(true)

    const { error } = await supabase
      .from('guests')
      .update({ rsvp_status: status })
      .eq('email', guest.email)

    if (!error) {
      setGuest({ ...guest, rsvp_status: status })
    }

    setSaving(false)
  }

  if (loading) return <p>Caricamento…</p>

  if (!guest) {
    return <p>Non risulti tra gli invitati.</p>
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>
        Ciao {guest.first_name} {guest.last_name} 👋
      </h1>

      <p>
        Stato RSVP:{' '}
        <strong>
          {guest.rsvp_status === 'pending'
            ? 'In attesa'
            : guest.rsvp_status === 'yes'
            ? 'Confermato'
            : 'Non parteciperò'}
        </strong>
      </p>

      <div style={{ marginTop: 20 }}>
        <button
          disabled={saving}
          onClick={() => updateRsvp('yes')}
        >
          Parteciperò
        </button>

        <button
          disabled={saving}
          style={{ marginLeft: 10 }}
          onClick={() => updateRsvp('no')}
        >
          Non parteciperò
        </button>
      </div>

      {guest.has_plus_one && guest.rsvp_status === 'yes' && (
        <p style={{ marginTop: 20 }}>
          ✅ Hai diritto a portare un +1
        </p>
      )}
    </main>
  )
}
