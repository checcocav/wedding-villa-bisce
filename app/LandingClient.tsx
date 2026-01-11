'use client'

import { useState, useEffect } from 'react'

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
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // Form state
  const [rsvpStatus, setRsvpStatus] = useState<'yes' | 'no' | ''>('')
  const [plusOneFirstName, setPlusOneFirstName] = useState('')
  const [plusOneLastName, setPlusOneLastName] = useState('')
  const [childrenCount, setChildrenCount] = useState(0)
  const [needsAccommodation, setNeedsAccommodation] = useState(false)
  const [accommodationNotes, setAccommodationNotes] = useState('')
  const [allergiesNotes, setAllergiesNotes] = useState('')
  const [messageToCouple, setMessageToCouple] = useState('')

  // Countdown timer
  useEffect(() => {
    const weddingDate = new Date('2026-08-29T16:00:00').getTime()
    
    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = weddingDate - now
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      })
    }
    
    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const faqs = [
    {
      question: "Qual è il dress code?",
      answer: "L'evento è elegante. Suggeriamo abito lungo per le signore e completo scuro per i signori."
    },
    {
      question: "Posso portare bambini?",
      answer: "Sì, i bambini sono i benvenuti! Vi preghiamo di segnalarcelo nel modulo RSVP."
    },
    {
      question: "C'è parcheggio disponibile?",
      answer: "Sì, il Palazzo delle Bisce dispone di un ampio parcheggio gratuito per gli ospiti."
    },
    {
      question: "Posso fare foto durante la cerimonia?",
      answer: "Vi chiediamo di astenervi dalle foto durante la cerimonia per permettere al fotografo ufficiale di fare il suo lavoro. Dopo sarete liberi di fotografare!"
    },
    {
      question: "È possibile prenotare l'alloggio presso la location?",
      answer: "Sì, il Palazzo offre camere per gli ospiti. Indica le tue esigenze nel modulo RSVP."
    }
  ]

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
        if (data.guest.rsvp_status) setRsvpStatus(data.guest.rsvp_status)
        if (data.guest.plus_one_first_name) setPlusOneFirstName(data.guest.plus_one_first_name)
        if (data.guest.plus_one_last_name) setPlusOneLastName(data.guest.plus_one_last_name)
        if (data.guest.children_count) setChildrenCount(data.guest.children_count)
        if (data.guest.needs_accommodation) setNeedsAccommodation(data.guest.needs_accommodation)
        if (data.guest.accommodation_notes) setAccommodationNotes(data.guest.accommodation_notes)
        if (data.guest.allergies_notes) setAllergiesNotes(data.guest.allergies_notes)
        if (data.guest.message_to_couple) setMessageToCouple(data.guest.message_to_couple)
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
          letterSpacing: '2px',
          fontStyle: 'italic'
        }}>
          Francesco & Martina
        </h1>

        {/* Image/Video Placeholder */}
        <div style={{
          width: '100%',
          maxWidth: '400px',
          aspectRatio: '3/4',
          background: '#e0e0e0',
          borderRadius: 8,
          marginBottom: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '1rem',
          fontStyle: 'italic',
          overflow: 'hidden'
        }}>
          {/* Sostituisci con: <img src="URL_IMMAGINE" /> o <video src="URL_VIDEO" /> */}
          [Inserisci immagine o video qui]
        </div>

        <p style={{
          fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
          color: '#546e7a',
          margin: '0 0 40px 0',
          fontStyle: 'italic'
        }}>
          29 Agosto 2026
        </p>
      </section>

      {/* Countdown Section */}
      <section style={{
        padding: '100px 20px',
        textAlign: 'center',
        background: 'white'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
          fontWeight: '300',
          color: '#2c3e50',
          marginBottom: '60px',
          letterSpacing: '1px',
          fontStyle: 'italic'
        }}>
          Quanto manca al nostro giorno speciale
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 20,
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <div style={{
            padding: 30,
            background: '#f8f9fa',
            borderRadius: 8,
            border: '2px solid #b8860b'
          }}>
            <div style={{
              fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              fontWeight: '300',
              color: '#2c3e50',
              marginBottom: 8
            }}>
              {timeLeft.days}
            </div>
            <div style={{
              fontSize: '1rem',
              color: '#546e7a',
              fontStyle: 'italic'
            }}>
              Giorni
            </div>
          </div>
          
          <div style={{
            padding: 30,
            background: '#f8f9fa',
            borderRadius: 8,
            border: '2px solid #b8860b'
          }}>
            <div style={{
              fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              fontWeight: '300',
              color: '#2c3e50',
              marginBottom: 8
            }}>
              {timeLeft.hours}
            </div>
            <div style={{
              fontSize: '1rem',
              color: '#546e7a',
              fontStyle: 'italic'
            }}>
              Ore
            </div>
          </div>
          
          <div style={{
            padding: 30,
            background: '#f8f9fa',
            borderRadius: 8,
            border: '2px solid #b8860b'
          }}>
            <div style={{
              fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              fontWeight: '300',
              color: '#2c3e50',
              marginBottom: 8
            }}>
              {timeLeft.minutes}
            </div>
            <div style={{
              fontSize: '1rem',
              color: '#546e7a',
              fontStyle: 'italic'
            }}>
              Minuti
            </div>
          </div>
          
          <div style={{
            padding: 30,
            background: '#f8f9fa',
            borderRadius: 8,
            border: '2px solid #b8860b'
          }}>
            <div style={{
              fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              fontWeight: '300',
              color: '#2c3e50',
              marginBottom: 8
            }}>
              {timeLeft.seconds}
            </div>
            <div style={{
              fontSize: '1rem',
              color: '#546e7a',
              fontStyle: 'italic'
            }}>
              Secondi
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section style={{
        padding: '100px 20px',
        background: '#f8f9fa',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
          fontWeight: '300',
          color: '#2c3e50',
          marginBottom: '40px',
          letterSpacing: '1px',
          fontStyle: 'italic'
        }}>
          Location del giorno
        </h2>
        
        <h3 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: '400',
          color: '#2c3e50',
          marginBottom: '40px',
          fontStyle: 'italic'
        }}>
          Palazzo delle Bisce
        </h3>
        
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2835.9!2d11.65!3d44.62!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDM3JzEyLjAiTiAxMcKwMzknMDAuMCJF!5e0!3m2!1sit!2sit!4v1234567890"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        
        <a
          href="https://maps.google.com/?q=Palazzo+delle+Bisce+Molinella"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: 24,
            padding: '12px 32px',
            background: '#2c3e50',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 8,
            fontSize: '1rem',
            fontStyle: 'italic',
            transition: 'all 0.3s'
          }}
        >
          📍 Apri in Google Maps
        </a>
      </section>

      {/* Timeline Section */}
      <section style={{
        padding: '100px 20px',
        background: 'white'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '300',
            color: '#2c3e50',
            marginBottom: '60px',
            textAlign: 'center',
            letterSpacing: '1px',
            fontStyle: 'italic'
          }}>
            Programma della Giornata
          </h2>

          <div style={{ position: 'relative', paddingLeft: '60px' }}>
            {/* Timeline line */}
            <div style={{
              position: 'absolute',
              left: '20px',
              top: 0,
              bottom: 0,
              width: '2px',
              background: '#ddd'
            }} />

            {[
              { time: '15:30', title: 'Arrivo degli ospiti', desc: 'Benvenuto al Palazzo delle Bisce' },
              { time: '16:00', title: 'Cerimonia', desc: 'Momento della promessa' },
              { time: '17:00', title: 'Aperitivo', desc: 'Brindisi e foto nel giardino' },
              { time: '18:30', title: 'Ricevimento', desc: 'Cena e festeggiamenti' },
              { time: '23:00', title: 'Taglio della torta', desc: 'Dolce finale' }
            ].map((event, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '40px',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  left: '-40px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'white',
                  border: '2px solid #b8860b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#2c3e50',
                  zIndex: 1
                }}>
                  {event.time}
                </div>
                <div style={{ paddingLeft: '20px' }}>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '400',
                    color: '#2c3e50',
                    marginBottom: '8px',
                    fontStyle: 'italic'
                  }}>
                    {event.title}
                  </h3>
                  <p style={{
                    fontSize: '1rem',
                    color: '#546e7a',
                    fontStyle: 'italic'
                  }}>
                    {event.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
            letterSpacing: '1px',
            fontStyle: 'italic'
          }}>
            Domande Frequenti
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {faqs.map((faq, index) => (
              <div 
                key={index}
                style={{
                  background: 'white',
                  borderRadius: 8,
                  overflow: 'hidden',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    background: 'white',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    color: '#2c3e50',
                    fontFamily: 'Georgia, serif',
                    fontStyle: 'italic',
                    textAlign: 'left',
                    transition: 'background 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <span>{faq.question}</span>
                  <span style={{
                    fontSize: '1.5rem',
                    transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s'
                  }}>
                    ▼
                  </span>
                </button>
                
                {openFaq === index && (
                  <div style={{
                    padding: '0 24px 20px 24px',
                    color: '#546e7a',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    fontStyle: 'italic'
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section style={{
        padding: '100px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '300',
            marginBottom: '40px',
            letterSpacing: '1px',
            fontStyle: 'italic'
          }}>
            Conferma la Tua Presenza
          </h2>

          {step === 'email' && (
            <div style={{
              background: 'white',
              padding: '48px',
              borderRadius: '8px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '300',
                marginBottom: '24px',
                color: '#2c3e50',
                fontStyle: 'italic'
              }}>
                Inserisci la tua email
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#666',
                marginBottom: '32px',
                fontStyle: 'italic'
              }}>
                per accedere al modulo RSVP
              </p>

              {error && (
                <div style={{
                  padding: '12px',
                  marginBottom: '20px',
                  background: '#f8d7da',
                  color: '#721c24',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontStyle: 'italic'
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
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontFamily: 'Georgia, serif',
                    fontStyle: 'italic'
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    fontFamily: 'Georgia, serif',
                    fontStyle: 'italic',
                    transition: 'all 0.3s'
                  }}
                >
                  {loading ? 'Verifica...' : 'Continua'}
                </button>
              </form>
            </div>
          )}

          {step === 'form' && guest && (
            <div style={{
              background: 'white',
              padding: '48px',
              borderRadius: '8px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
              maxWidth: '600px',
              margin: '0 auto',
              maxHeight: '70vh',
              overflowY: 'auto'
            }}>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '300',
                marginBottom: '8px',
                color: '#2c3e50',
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                Ciao {guest.first_name}!
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#666',
                marginBottom: '32px',
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                Conferma la tua partecipazione
              </p>

              {error && (
                <div style={{
                  padding: '12px',
                  marginBottom: '20px',
                  background: '#f8d7da',
                  color: '#721c24',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontStyle: 'italic'
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleRsvpSubmit}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '12px',
                    color: '#2c3e50',
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    fontStyle: 'italic'
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
                        borderRadius: '8px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        fontFamily: 'Georgia, serif',
                        fontStyle: 'italic'
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
                        borderRadius: '8px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        fontFamily: 'Georgia, serif',
                        fontStyle: 'italic'
                      }}
                    >
                      ✗ Non potrò
                    </button>
                  </div>
                </div>

                {guest.has_plus_one && rsvpStatus === 'yes' && (
                  <div style={{ marginBottom: '24px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
                    <label style={{ display: 'block', marginBottom: '16px', color: '#2c3e50', fontSize: '1rem', fontWeight: '500', fontStyle: 'italic' }}>
                      Accompagnatore
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <input
                        type="text"
                        value={plusOneFirstName}
                        onChange={(e) => setPlusOneFirstName(e.target.value)}
                        placeholder="Nome"
                        style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
                      />
                      <input
                        type="text"
                        value={plusOneLastName}
                        onChange={(e) => setPlusOneLastName(e.target.value)}
                        placeholder="Cognome"
                        style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
                      />
                    </div>
                  </div>
                )}

                {guest.has_children && rsvpStatus === 'yes' && (
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '12px', color: '#2c3e50', fontSize: '1rem', fontWeight: '500', fontStyle: 'italic' }}>
                      Numero di bambini
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(parseInt(e.target.value) || 0)}
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
                    />
                  </div>
                )}

                {rsvpStatus === 'yes' && (
                  <>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '12px' }}>
                        <input
                          type="checkbox"
                          checked={needsAccommodation}
                          onChange={(e) => setNeedsAccommodation(e.target.checked)}
                          style={{ marginRight: '8px', cursor: 'pointer', width: 18, height: 18 }}
                        />
                        <span style={{ color: '#2c3e50', fontSize: '1rem', fontWeight: '500', fontStyle: 'italic' }}>
                          Ho bisogno di supporto per l'alloggio
                        </span>
                      </label>
                      {needsAccommodation && (
                        <textarea
                          value={accommodationNotes}
                          onChange={(e) => setAccommodationNotes(e.target.value)}
                          placeholder="Note sull'alloggio"
                          rows={3}
                          style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', fontFamily: 'Georgia, serif', fontStyle: 'italic', resize: 'vertical' }}
                        />
                      )}
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', marginBottom: '12px', color: '#2c3e50', fontSize: '1rem', fontWeight: '500', fontStyle: 'italic' }}>
                        Allergie e intolleranze
                      </label>
                      <textarea
                        value={allergiesNotes}
                        onChange={(e) => setAllergiesNotes(e.target.value)}
                        placeholder="Indica eventuali allergie"
                        rows={3}
                        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', fontFamily: 'Georgia, serif', fontStyle: 'italic', resize: 'vertical' }}
                      />
                    </div>
                  </>
                )}

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '12px', color: '#2c3e50', fontSize: '1rem', fontWeight: '500', fontStyle: 'italic' }}>
                    Messaggio per gli sposi (opzionale)
                  </label>
                  <textarea
                    value={messageToCouple}
                    onChange={(e) => setMessageToCouple(e.target.value)}
                    placeholder="Lasciaci un messaggio 💌"
                    rows={4}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', fontFamily: 'Georgia, serif', fontStyle: 'italic', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    fontFamily: 'Georgia, serif',
                    fontStyle: 'italic',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  {loading ? 'Salvataggio...' : 'Salva RSVP'}
                </button>
              </form>
            </div>
          )}

          {step === 'success' && (
            <div style={{
              background: 'white',
              padding: '48px',
              borderRadius: '8px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '24px' }}>
                {rsvpStatus === 'yes' ? '🎉' : '💌'}
              </div>
              <h3 style={{ fontSize: '2rem', fontWeight: '300', marginBottom: '16px', color: '#2c3e50', fontStyle: 'italic' }}>
                {rsvpStatus === 'yes' ? 'Grazie!' : 'Grazie per la risposta'}
              </h3>
              <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '32px', fontStyle: 'italic' }}>
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
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic'
                }}
              >
                Modifica risposta
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Link */}
      <section style={{ padding: '100px 20px', textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '300', marginBottom: '24px', letterSpacing: '1px', fontStyle: 'italic' }}>
          Condividi i tuoi momenti
        </h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '40px', opacity: 0.9, fontStyle: 'italic' }}>
          Carica e visualizza le foto della giornata
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/public-photos" style={{ display: 'inline-block', padding: '16px 48px', background: 'white', color: '#f093fb', textDecoration: 'none', borderRadius: '8px', fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '500', fontStyle: 'italic' }}>
            📷 Carica Foto
          </a>
          <a href="/gallery" style={{ display: 'inline-block', padding: '16px 48px', background: 'transparent', color: 'white', textDecoration: 'none', borderRadius: '8px', fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '500', border: '2px solid white', fontStyle: 'italic' }}>
            🖼️ Gallery
          </a>
        </div>
      </section>

      <footer style={{ padding: '40px 20px', textAlign: 'center', background: '#2c3e50', color: 'white' }}>
        <p style={{ fontSize: '1rem', opacity: 0.8, margin: 0, fontStyle: 'italic' }}>
          © 2026 Francesco & Martina · Con amore
        </p>
      </footer>
    </div>
  )
}
