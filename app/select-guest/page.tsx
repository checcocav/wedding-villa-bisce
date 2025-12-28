'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Guest = {
  id: string
  full_name: string
}

export default function SelectGuestPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [selectedGuest, setSelectedGuest] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    const loadGuests = async () => {
      const { data, error } = await supabase
        .from('guests')
        .select('id, full_name')
        .order('full_name')

      if (!error && data) {
        setGuests(data)
      }
    }

    loadGuests()
  }, [])

  const handleConfirm = async () => {
    if (!selectedGuest) return

    const { error } = await supabase.rpc('link_guest_to_user', {
      selected_guest_id: selectedGuest,
    })

    if (!error) {
      router.push('/dashboard')
    } else {
      alert('Errore nel collegamento, riprova')
    }
  }

  return (
    <main style={{ padding: 32 }}>
      <h1>Chi sei?</h1>

      <select
        value={selectedGuest}
        onChange={(e) => setSelectedGuest(e.target.value)}
        style={{ marginTop: 16 }}
      >
        <option value="">Seleziona il tuo nome</option>
        {guests.map((g) => (
          <option key={g.id} value={g.id}>
            {g.full_name}
          </option>
        ))}
      </select>

      <br />

      <button
        onClick={handleConfirm}
        disabled={!selectedGuest}
        style={{ marginTop: 16 }}
      >
        Conferma
      </button>
    </main>
  )
}
