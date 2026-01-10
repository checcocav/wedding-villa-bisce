'use client'

import { useState } from 'react'

type Guest = {
  id: string
  first_name: string
  last_name: string
  email: string
  has_plus_one: boolean
  has_children: boolean
  rsvp_status: string | null
  plus_one_first_name: string | null
  plus_one_last_name: string | null
  children_count: number | null
  needs_accommodation: boolean
  accommodation_notes: string | null
  allergies_notes: string | null
  message_to_couple: string | null
}

export default function LandingClient() {
  const [step, setStep] = useState<'email' | 'form' | 'success'>('email')
  const [email, setEmail] = useState('')
  const [guest, setGuest] = useState<Guest | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [rsvpStatus, setRsvpStatus] = useState<'yes' | 'no' | ''>('')
  const [plusOneFirstName, setPlusOneFirstName] = useState('')
  const [plusOneLastName, setPlusOneLastName] = useState('')
  const [childrenCount, setChildrenCount] = useState(0)
  const [needsAccommodation, setNeedsAccommodation] = useState(false)
  const [accommodationNotes, setAccommodationNotes] = useState('')
  const [allergiesNotes, setAllergiesNotes] = useState('')
  const [messageToCouple, setMessageToCouple] = useState('')

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/check-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase() }),
      })

      const data = await response.json()

      if (data.found) {
        setGuest(data.guest)
        // Pre-popola i dati se già compilati
        if (data.guest.rsvp_status) {
          setRsvpStatus(data.guest.rsvp_status)
        }
        if (data.guest.plus_one_first_name) {
          setPlusOneFirstName(data.guest.plus_one_first_name)
        }
        if (data.guest.plus_one_last_name) {
          setPlusOneLastName(data.guest.plus_one_last_name)
        }
        if (data.guest.children_count) {
          setChildrenCount(data.guest.children_count)
        }
        if (data.guest.needs_accommodation) {
          setNeedsAccommodation(data.guest.needs_accommodation)
        }
        if (data.guest.accommodation_notes) {
          setAccommodationNotes(data.guest.accommodation_notes)
        }
        if (data.guest.allergies_notes) {
          setAllergiesNotes(data.guest.allergies_notes)
        }
        if (data.guest.message_to_couple) {
          setMessageToCouple(data.guest.message_to_couple)
        }
        setStep('form')
      } else {
        setError('Email non trovata nella lista degli invitati')
      }
    } catch (err) {
      setError('Errore di connessione. Riprova.')
    } finally {
      setLoading(false)
    }
  }

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!rsvpStatus) {
      setError('Seleziona se parteciperai o meno')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/save-rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: guest?.email,
          rsvp_status: rsvpStatus,
          plus_one_first_name: plusOneFirstName,
          plus_one_last_name: plusOneLastName,
          children_count: childrenCount,
          needs_accommodation: needsAccommodation,
          accommodation_notes: accommodationNotes,
          allergies_notes: allergiesNotes,
          message_to_couple: messageToCouple,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setStep('success')
      } else {
        setError(data.error || 'Errore durante il salvataggio')
      }
    } catch (err) {
      setError('Errore di connessione. Riprova.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        textAlign: 'center',
        padding: '40px 20px'
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 8vw, 5rem)',
          fontWeight: '300',
          margin: '0 0 20px 0',
          color: '#2c3e50',
          letterSpacing: '2px'
        }}>
          Francesco & Martina
        </h1>
        <p style={{
          fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
          color: '#546e7a',
          margin: '0 0 40px 0',
          fontStyle: 'italic'
        }}>
          29 Agosto 2026
        </p>
        <div style={{
          width: '60px',
          height: '1px',
          background: '#b8860b',
          margin: '0 0 60px 0'
        }} />

        {/* Email Check Form */}
        {step === 'email' && (
          <div style={{
            background: 'white',
            padding: '48px',
            borderRadius: '8px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
            maxWidth: '500px',
            width: '100%'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '300',
              marginBottom: '24px',
              color: '#2c3e50'
            }}>
              Conferma la tua presenza
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#666',
              marginBottom: '32px'
            }}>
              Inserisci la tua email per accedere al modulo RSVP
            </p>

            {error && (
              <div style={{
                padding: '12px',
                marginBottom: '20px',
                background: '#f8d7da',
                color: '#721c24',
                borderRadius: '4px',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tua@email.com"
                required
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginBottom: '16px',
                  fontFamily: 'inherit'
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Verifica...' : 'Continua'}
              </button>
            </form>
          </div>
        )}

        {/* RSVP Form */}
        {step === 'form' && guest && (
          <div style={{
            background: 'white',
            padding: '48px',
            borderRadius: '8px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '300',
              marginBottom: '8px',
              color: '#2c3e50',
              textAlign: 'center'
            }}>
              Ciao {guest.first_name}!
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#666',
              marginBottom: '32px',
              textAlign: 'center'
            }}>
              Conferma la tua partecipazione al nostro matrimonio
            </p>

            {error && (
              <div style={{
                padding: '12px',
                marginBottom: '20px',
                background: '#f8d7da',
                color: '#721c24',
                borderRadius: '4px',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleRsvpSubmit}>
              {/* RSVP Status */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '12px',
                  color: '#2c3e50',
                  fontSize: '1.1rem',
                  fontWeight: '500'
                }}>
                  Parteciperai? *
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setRsvpStatus('yes')}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: rsvpStatus === 'yes' ? '#28a745' : 'white',
                      color: rsvpStatus === 'yes' ? 'white' : '#2c3e50',
                      border: `2px solid ${rsvpStatus === 'yes' ? '#28a745' : '#ddd'}`,
                      borderRadius: '4px',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      fontFamily: 'inherit'
                    }}
                  >
                    ✓ Sì, ci sarò!
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpStatus('no')}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: rsvpStatus === 'no' ? '#dc3545' : 'white',
                      color: rsvpStatus === 'no' ? 'white' : '#2c3e50',
                      border: `2px solid ${rsvpStatus === 'no' ? '#dc3545' : '#ddd'}`,
                      borderRadius: '4px',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      fontFamily: 'inherit'
                    }}
                  >
                    ✗ Non potrò
                  </button>
                </div>
              </div>

              {/* Plus One (only if enabled) */}
              {guest.has_plus_one && rsvpStatus === 'yes' && (
                <div style={{
                  marginBottom: '24px',
                  padding: '16px',
                  background: '#f8f9fa',
                  borderRadius: '4px'
                }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '12px',
                    color: '#2c3e50',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}>
                    Accompagnatore
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input
                      type="text"
                      value={plusOneFirstName}
                      onChange={(e) => setPlusOneFirstName(e.target.value)}
                      placeholder="Nome"
                      style={{
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        fontFamily: 'inherit'
                      }}
                    />
                    <input
                      type="text"
                      value={plusOneLastName}
                      onChange={(e) => setPlusOneLastName(e.target.value)}
                      placeholder="Cognome"
                      style={{
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Children (only if enabled) */}
              {guest.has_children && rsvpStatus === 'yes' && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#2c3e50',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}>
                    Numero di bambini
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={childrenCount}
                    onChange={(e) => setChildrenCount(parseInt(e.target.value) || 0)}
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
              )}

              {/* Accommodation */}
              {rsvpStatus === 'yes' && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    marginBottom: '12px'
                  }}>
                    <input
                      type="checkbox"
                      checked={needsAccommodation}
                      onChange={(e) => setNeedsAccommodation(e.target.checked)}
                      style={{ marginRight: '8px', cursor: 'pointer' }}
                    />
                    <span style={{
                      color: '#2c3e50',
                      fontSize: '1rem',
                      fontWeight: '500'
                    }}>
                      Ho bisogno di supporto per l'alloggio
                    </span>
                  </label>
                  {needsAccommodation && (
                    <textarea
                      value={accommodationNotes}
                      onChange={(e) => setAccommodationNotes(e.target.value)}
                      placeholder="Note sull'alloggio (es. numero di persone, preferenze)"
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                      }}
                    />
                  )}
                </div>
              )}

              {/* Allergies */}
              {rsvpStatus === 'yes' && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#2c3e50',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}>
                    Allergie e intolleranze alimentari
                  </label>
                  <textarea
                    value={allergiesNotes}
                    onChange={(e) => setAllergiesNotes(e.target.value)}
                    placeholder="Indica eventuali allergie o intolleranze"
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>
              )}

              {/* Message to Couple */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2c3e50',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}>
                  Messaggio per gli sposi (opzionale)
                </label>
                <textarea
                  value={messageToCouple}
                  onChange={(e) => setMessageToCouple(e.target.value)}
                  placeholder="Lasciaci un messaggio 💌"
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Salvataggio...' : 'Salva RSVP'}
              </button>
            </form>
          </div>
        )}

        {/* Success Message */}
        {step === 'success' && (
          <div style={{
            background: 'white',
            padding: '48px',
            borderRadius: '8px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '24px' }}>
              {rsvpStatus === 'yes' ? '🎉' : '💌'}
            </div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '300',
              marginBottom: '16px',
              color: '#2c3e50'
            }}>
              {rsvpStatus === 'yes' ? 'Grazie!' : 'Grazie per la risposta'}
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#666',
              marginBottom: '32px'
            }}>
              {rsvpStatus === 'yes' 
                ? 'La tua conferma è stata registrata. Ci vediamo il 29 Agosto!' 
                : 'Ci dispiace che non potrai esserci. Grazie per averci avvisato.'}
            </p>
            <button
              onClick={() => {
                setStep('email')
                setEmail('')
                setGuest(null)
                setRsvpStatus('')
                setError('')
              }}
              style={{
                padding: '12px 32px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Modifica risposta
            </button>
          </div>
        )}
      </section>

      {/* Info Section */}
      <section style={{
        padding: '100px 20px',
        maxWidth: '1000px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: '300',
          color: '#2c3e50',
          marginBottom: '60px',
          letterSpacing: '1px'
        }}>
          Il Nostro Giorno Speciale
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginTop: '60px'
        }}>
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📅</div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '400',
              color: '#2c3e50',
              marginBottom: '12px',
              letterSpacing: '0.5px'
            }}>
              Data
            </h3>
            <p style={{
              fontSize: '1.1rem',
              color: '#546e7a',
              lineHeight: '1.6'
            }}>
              Venerdì<br />
              29 Agosto 2026
            </p>
          </div>

          <div>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📍</div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '400',
              color: '#2c3e50',
              marginBottom: '12px',
              letterSpacing: '0.5px'
            }}>
              Location
            </h3>
            <p style={{
              fontSize: '1.1rem',
              color: '#546e7a',
              lineHeight: '1.6'
            }}>
              Villa delle Bisce<br />
              Carate Brianza, MB
            </p>
          </div>

          <div>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🕐</div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '400',
              color: '#2c3e50',
              marginBottom: '12px',
              letterSpacing: '0.5px'
            }}>
              Orario
            </h3>
            <p style={{
              fontSize: '1.1rem',
              color: '#546e7a',
              lineHeight: '1.6'
            }}>
              Cerimonia: 16:00<br />
              Ricevimento: 18:00
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section style={{
        padding: '100px 20px',
        background: '#f8f9fa'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '300',
            color: '#2c3e50',
            marginBottom: '60px',
            textAlign: 'center',
            letterSpacing: '1px'
          }}>
            Programma della Giornata
          </h2>

          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '2px',
              background: '#ddd',
              transform: 'translateX(-50%)'
            }} />

            {[
              { time: '15:30', title: 'Arrivo degli ospiti', desc: 'Benvenuto a Villa delle Bisce' },
              { time: '16:00', title: 'Cerimonia', desc: 'Momento della promessa' },
              { time: '17:00', title: 'Aperitivo', desc: 'Brindisi e foto nel giardino' },
              { time: '18:30', title: 'Ricevimento', desc: 'Cena e festeggiamenti' },
              { time: '23:00', title: 'Taglio della torta', desc: 'Dolce finale' }
            ].map((event, index) => (
              <div key={index} style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                gap: '20px',
                alignItems: 'center',
                marginBottom: '40px'
              }}>
                {index % 2 === 0 ? (
                <>
<div style={{ textAlign: 'right', paddingRight: '20px' }}>
<h3 style={{
fontSize: '1.3rem',
fontWeight: '400',
color: '#2c3e50',
marginBottom: '8px'
}}>
{event.title}
</h3>
<p style={{
fontSize: '1rem',
color: '#546e7a'
}}>
{event.desc}
</p>
</div>
<div style={{
width: '60px',
height: '60px',
borderRadius: '50%',
background: 'white',
border: '2px solid #b8860b',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
fontSize: '0.9rem',
fontWeight: '500',
color: '#2c3e50',
zIndex: 1
}}>
{event.time}
</div>
<div />
</>
) : (
<>
<div />
<div style={{
width: '60px',
height: '60px',
borderRadius: '50%',
background: 'white',
border: '2px solid #b8860b',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
fontSize: '0.9rem',
fontWeight: '500',
color: '#2c3e50',
zIndex: 1
}}>
{event.time}
</div>
<div style={{ textAlign: 'left', paddingLeft: '20px' }}>
<h3 style={{
fontSize: '1.3rem',
fontWeight: '400',
color: '#2c3e50',
marginBottom: '8px'
}}>
{event.title}
</h3>
<p style={{
fontSize: '1rem',
color: '#546e7a'
}}>
{event.desc}
</p>
</div>
</>
)}
</div>
))}
</div>
</div>
</section>
      {/* Gallery Link */}
  <section style={{
    padding: '100px 20px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  }}>
    <h2 style={{
      fontSize: 'clamp(2rem, 5vw, 3rem)',
      fontWeight: '300',
      marginBottom: '24px',
      letterSpacing: '1px'
    }}>
      Condividi i tuoi momenti
    </h2>
    <p style={{
      fontSize: '1.2rem',
      marginBottom: '40px',
      opacity: 0.9
    }}>
      Carica e visualizza le foto della giornata
    </p>
    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
      <a 
        href="/photos"
        style={{
          display: 'inline-block',
          padding: '16px 48px',
          background: 'white',
          color: '#667eea',
          textDecoration: 'none',
          borderRadius: '2px',
          fontSize: '1rem',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          fontWeight: '500',
          transition: 'all 0.3s'
        }}
      >
        📷 Carica Foto
      </a>
      <a 
        href="/gallery"
        style={{
          display: 'inline-block',
          padding: '16px 48px',
          background: 'transparent',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '2px',
          fontSize: '1rem',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          fontWeight: '500',
          border: '2px solid white',
          transition: 'all 0.3s'
        }}
      >
        🖼️ Gallery
      </a>
    </div>
  </section>

  {/* Footer */}
  <footer style={{
    padding: '40px 20px',
    textAlign: 'center',
    background: '#2c3e50',
    color: 'white'
  }}>
    <p style={{
      fontSize: '1rem',
      opacity: 0.8,
      margin: 0
    }}>
      © 2026 Francesco & Martina · Con amore
    </p>
  </footer>
</div>
