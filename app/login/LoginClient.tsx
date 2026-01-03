'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginClient() {
  const [mode, setMode] = useState<'login' | 'register' | 'magic'>('magic')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      /* // Verifica che l'email sia nella lista invitati
      const { data: guest } = await supabase
        .from('guests')
        .select('email')
        .eq('email', email)
        .single()

      if (!guest) {
        setMessage({ 
          type: 'error', 
          text: 'Email non trovata nella lista degli invitati. Contatta gli sposi.' 
        })
        setLoading(false)
        return
      }*/

      // Registra l'utente
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      })
      
      if (error) throw error

      if (data.user) {
        setMessage({ 
          type: 'success', 
          text: 'Registrazione completata! Ora puoi effettuare il login.' 
        })
        setMode('login')
        setPassword('')
      }
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Si è verificato un errore durante la registrazione' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: 'Email o password non corretti' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setMessage(null)

  try {
    console.log('Tentativo magic link per:', email)
    
    // Usa la funzione invece della query diretta
    const { data: emailExists, error: checkError } = await supabase
      .rpc('email_exists_in_guests', { check_email: email })

    console.log('Email exists result:', { emailExists, checkError })

    if (checkError) {
      console.error('Errore verifica email:', checkError)
      throw checkError
    }

    if (!emailExists) {
      setMessage({ 
        type: 'error', 
        text: 'Email non trovata nella lista degli invitati. Contatta gli sposi.' 
      })
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    
    if (error) throw error
    
    setMessage({ 
      type: 'success', 
      text: 'Controlla la tua email per il link di accesso!' 
    })
  } catch (error: any) {
    console.error('Errore completo:', error)
    setMessage({ 
      type: 'error', 
      text: error.message || 'Si è verificato un errore' 
    })
  } finally {
    setLoading(false)
  }
}
  return (
    <div style={{
      background: 'white',
      padding: '48px',
      borderRadius: '8px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
      maxWidth: '450px',
      width: '100%',
      fontFamily: 'Georgia, serif'
    }}>
      <h1 style={{
        fontSize: '2rem',
        fontWeight: '300',
        textAlign: 'center',
        marginBottom: '32px',
        color: '#2c3e50',
        letterSpacing: '1px'
      }}>
        Accedi
      </h1>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '32px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <button
          onClick={() => { setMode('magic'); setMessage(null); }}
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '0.95rem',
            color: mode === 'magic' ? '#667eea' : '#999',
            borderBottom: mode === 'magic' ? '2px solid #667eea' : 'none',
            fontWeight: mode === 'magic' ? '500' : '400',
            fontFamily: 'inherit'
          }}
        >
          Magic Link
        </button>
        <button
          onClick={() => { setMode('login'); setMessage(null); }}
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '0.95rem',
            color: mode === 'login' ? '#667eea' : '#999',
            borderBottom: mode === 'login' ? '2px solid #667eea' : 'none',
            fontWeight: mode === 'login' ? '500' : '400',
            fontFamily: 'inherit'
          }}
        >
          Login
        </button>
        <button
          onClick={() => { setMode('register'); setMessage(null); }}
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '0.95rem',
            color: mode === 'register' ? '#667eea' : '#999',
            borderBottom: mode === 'register' ? '2px solid #667eea' : 'none',
            fontWeight: mode === 'register' ? '500' : '400',
            fontFamily: 'inherit'
          }}
        >
          Registrati
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div style={{
          padding: '12px',
          marginBottom: '20px',
          borderRadius: '4px',
          background: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          fontSize: '0.9rem'
        }}>
          {message.text}
        </div>
      )}

      {/* Form */}
      <form onSubmit={
        mode === 'magic' ? handleMagicLink : 
        mode === 'login' ? handleLogin : 
        handleRegister
      }>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#2c3e50',
            fontSize: '0.9rem'
          }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tuo@email.com"
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {mode !== 'magic' && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#2c3e50',
              fontSize: '0.9rem'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
            />
            {mode === 'register' && (
              <p style={{
                fontSize: '0.85rem',
                color: '#666',
                marginTop: '4px',
                margin: '4px 0 0 0'
              }}>
                Minimo 6 caratteri
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            fontFamily: 'inherit',
            transition: 'all 0.3s'
          }}
        >
          {loading ? '⏳ Caricamento...' : 
           mode === 'register' ? 'Crea Account' : 
           mode === 'magic' ? '✉️ Invia Magic Link' : 
           'Accedi'}
        </button>
      </form>

      {mode === 'magic' && (
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '0.85rem',
          color: '#666'
        }}>
          <p style={{ margin: 0 }}>
            💡 Inserisci l'email con cui sei stato invitato. Riceverai un link per accedere senza password.
          </p>
        </div>
      )}

      <div style={{
        marginTop: '24px',
        textAlign: 'center'
      }}>
        <a 
          href="/"
          style={{
            color: '#667eea',
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}
        >
          ← Torna alla home
        </a>
      </div>
    </div>
  )
}
