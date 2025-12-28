'use client'

import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Accesso invitati</h1>
      <p>Accedi con Google per confermare la tua presenza</p>

      <button onClick={handleLogin} style={{ marginTop: 20 }}>
        Accedi con Google
      </button>
    </main>
  )
}
