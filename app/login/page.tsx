'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email) return

    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          'https://wedding-villa-bisce-tq5f.vercel.app/auth/callback',
  },
})


    setLoading(false)

    if (!error) {
      setSent(true)
    } else {
      alert(error.message)
    }
  }

  if (sent) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Controlla la tua email 📩</h1>
        <p>Ti abbiamo inviato un link per accedere.</p>
      </main>
    )
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Accesso invitati</h1>
      <p>Inserisci la tua email per accedere</p>

      <input
        type="email"
        placeholder="nome@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', marginTop: 20 }}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{ marginTop: 20 }}
      >
        Accedi
      </button>
    </main>
  )
}
