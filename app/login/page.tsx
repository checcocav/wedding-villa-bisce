'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')

  async function signIn() {
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          'https://wedding-villa-bisce-tq5f.vercel.app/auth/callback',
      },
    })
  }

  return (
    <div>
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={signIn}>Accedi</button>
    </div>
  )
}
