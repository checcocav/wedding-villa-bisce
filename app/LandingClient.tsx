'use client'

import { useState, useEffect } from 'react'

type Accommodation = {
  id: string
  name: string
  address: string
  description: string | null
  phone: string | null
  email: string | null
  maps_link: string | null
}

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
  assigned_accommodation_id: string | null
  accommodations?: Accommodation | null
}

export default function LandingClient() {
  const [step, setStep] = useState<'email' | 'form' | 'success'>('email')
  const [email, setEmail] = useState('')
  const [guest, setGuest] = useState<Guest | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  const [rsvpStatus, setRsvpStatus] = useState<'yes' | 'no' | ''>('')
  const [plusOneFirstName, setPlusOneFirstName] = useState('')
  const [plusOneLastName, setPlusOneLastName] = useState('')
  const [childrenCount, setChildrenCount] = useState(0)
  const [needsAccommodation, setNeedsAccommodation] = useState(false)
  const [accommodationNotes, setAccommodationNotes] = useState('')
  const [allergiesNotes, setAllergiesNotes] = useState('')
  const [messageToCouple, setMessageToCouple] = useState('')

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
    { question: "Qual è il dress code?", answer: "L'evento è elegante. Suggeriamo abito lungo per le signore e completo scuro per i signori." },
    { question: "Posso portare bambini?", answer: "Sì, i bambini sono i benvenuti! Vi preghiamo di segnalarcelo nel modulo RSVP." },
    { question: "C'è parcheggio disponibile?", answer: "Sì, il Palazzo delle Bisce dispone di un ampio parcheggio gratuito per gli ospiti." },
    { question: "Posso fare foto durante la cerimonia?", answer: "Vi chiediamo di astenervi dalle foto durante la cerimonia per permettere al fotografo ufficiale di fare il suo lavoro. Dopo sarete liberi di fotografare!" },
    { question: "È possibile prenotare l'alloggio presso la location?", answer: "Sì, il Palazzo offre camere per gli ospiti. Indica le tue esigenze nel modulo RSVP." }
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

  const assignedAccommodation = guest?.accommodations

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#2c2c2c' }}>
      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#faf9f7',
        textAlign: 'center',
        padding: '60px 20px',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UwZDBjMCIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=)',
          opacity: 0.3,
          zIndex: 0
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: 'clamp(3rem, 10vw, 6rem)',
            fontWeight: '300',
            margin: '0 0 10px 0',
            color: '#8b7355',
            letterSpacing: '3px'
          }}>
            Francesco & Martina
          </h1>
          
          <div style={{
            width: '100px',
            height: '1px',
            background: '#c9b8a0',
            margin: '30px auto'
          }} />

          <div style={{
            width: '100%',
            maxWidth: '450px',
            aspectRatio: '3/4',
            background: '#e8e0d5',
            borderRadius: 4,
            margin: '40px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#a89885',
            fontSize: '0.9rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            border: '1px solid #d5c9b8'
          }}>
            [Immagine/Video]
          </div>

          <p style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            color: '#8b7355',
            margin: '20px 0',
            fontWeight: '300',
            letterSpacing: '2px'
          }}>
            29 Agosto 2026
          </p>
          
          <p style={{
            fontSize: '1rem',
            color: '#9b8b7e',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: '400'
          }}>
            Palazzo delle Bisce • Molinella, BO
          </p>
        </div>
      </section>

      {/* Countdown */}
      <section style={{ padding: '100px 20px', background: 'white', textAlign: 'center' }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: '300',
          color: '#8b7355',
          marginBottom: '60px',
          letterSpacing: '2px'
        }}>
          Quanto manca al nostro giorno speciale
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 30,
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          {[
            { value: timeLeft.days, label: 'Giorni' },
            { value: timeLeft.hours, label: 'Ore' },
            { value: timeLeft.minutes, label: 'Minuti' },
            { value: timeLeft.seconds, label: 'Secondi' }
          ].map((item, i) => (
            <div key={i} style={{
              padding: '40px 20px',
              background: '#faf9f7',
              border: '1px solid #e8e0d5',
              borderRadius: 2
            }}>
              <div style={{
                fontSize: 'clamp(3rem, 8vw, 5rem)',
                fontWeight: '300',
                color: '#8b7355',
                marginBottom: 10,
                lineHeight: 1
              }}>
                {item.value}
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: '#9b8b7e',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontFamily: "'Montserrat', sans-serif"
              }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Location */}
      <section style={{ padding: '100px 20px', background: '#faf9f7', textAlign: 'center' }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: '300',
          color: '#8b7355',
          marginBottom: '20px',
          letterSpacing: '2px'
        }}>
          Location del giorno
        </h2>
        
        <h3 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
          fontWeight: '400',
          color: '#8b7355',
          marginBottom: '50px',
          letterSpacing: '1px'
        }}>
          Palazzo delle Bisce
        </h3>
        
        <div style={{
          maxWidth: '700px',
          margin: '0 auto 30px',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid #d5c9b8'
        }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2835.9!2d11.65!3d44.62!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDM3JzEyLjAiTiAxMcKwMzknMDAuMCJF!5e0!3m2!1sit!2sit!4v1234567890"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          />
        </div>
        
        <a
          href="https://maps.google.com/?q=Palazzo+delle+Bisce+Molinella"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '14px 40px',
            background: '#8b7355',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 2,
            fontSize: '0.85rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: '500',
            transition: 'all 0.3s'
          }}
        >
          Apri in Google Maps
        </a>
      </section>

      {/* Timeline */}
      <section style={{ padding: '100px 20px', background: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '300',
            color: '#8b7355',
            marginBottom: '80px',
            textAlign: 'center',
            letterSpacing: '2px'
          }}>
            Programma della Giornata
          </h2>

          <div style={{ position: 'relative', paddingLeft: '80px' }}>
            <div style={{
              position: 'absolute',
              left: '30px',
              top: 0,
              bottom: 0,
              width: '1px',
              background: '#e8e0d5'
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
                marginBottom: '60px',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  left: '-55px',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'white',
                  border: '1px solid #c9b8a0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#8b7355',
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: '1px'
                }}>
                  {event.time}
                </div>
                <div style={{ paddingLeft: '30px' }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '400',
                    color: '#8b7355',
                    marginBottom: '8px',
                    letterSpacing: '1px'
                  }}>
                    {event.title}
                  </h3>
                  <p style={{
                    fontSize: '1rem',
                    color: '#9b8b7e',
                    lineHeight: '1.6'
                  }}>
                    {event.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '100px 20px', background: '#faf9f7' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '300',
            color: '#8b7355',
            marginBottom: '60px',
            textAlign: 'center',
            letterSpacing: '2px'
          }}>
            Domande Frequenti
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {faqs.map((faq, index) => (
              <div 
                key={index}
                style={{
                  background: 'white',
                  border: '1px solid #e8e0d5',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  style={{
                    width: '100%',
                    padding: '25px 30px',
                    background: 'white',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    color: '#8b7355',
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    textAlign: 'left',
                    transition: 'background 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#faf9f7'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <span style={{ letterSpacing: '0.5px' }}>{faq.question}</span>
                  <span style={{
                    fontSize: '1.2rem',
                    transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s',
                    color: '#c9b8a0'
                  }}>
                    ▼
                  </span>
                </button>
                
                {openFaq === index && (
                  <div style={{
                    padding: '0 30px 25px 30px',
                    color: '#6b5d52',
                    fontSize: '1rem',
                    lineHeight: '1.7'
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section style={{ padding: '100px 20px', background: 'white' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '300',
            color: '#8b7355',
            marginBottom: '50px',
            letterSpacing: '2px'
          }}>
            Conferma la Tua Presenza
          </h2>

          {step === 'email' && (
            <div style={{
              background: '#faf9f7',
              padding: '50px 40px',
              border: '1px solid #e8e0d5',
              borderRadius: 2
            }}>
              <p style={{
                fontSize: '1.1rem',
                color: '#6b5d52',
                marginBottom: '30px',
                lineHeight: '1.6'
              }}>
                Inserisci la tua email per accedere al modulo RSVP
              </p>

              {error && (
                <div style={{
                  padding: '15px',
                  marginBottom: '20px',
                  background: '#f8d7da',
                  color: '#721c24',
                  borderRadius: 2,
                  fontSize: '0.95rem'
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
                    padding: '18px',
                    fontSize: '1rem',
                    border: '1px solid #d5c9b8',
                    borderRadius: 2,
                    marginBottom: '20px',
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    background: 'white'
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '18px',
                    background: '#8b7355',
                    color: 'white',
                    border: 'none',
                    borderRadius: 2,
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    fontFamily: "'Montserrat', sans-serif",
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
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
              background: '#faf9f7',
              padding: '50px 40px',
              border: '1px solid #e8e0d5',
              borderRadius: 2,
              maxHeight: '75vh',
              overflowY: 'auto',
              textAlign: 'left'
            }}>
              <h3 style={{
                fontSize: '2rem',
                fontWeight: '300',
                marginBottom: '10px',
                color: '#8b7355',
                textAlign: 'center',
                letterSpacing: '1px'
              }}>
                Ciao {guest.first_name}!
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#6b5d52',
                marginBottom: '40px',
                textAlign: 'center'
              }}>
                Conferma la tua partecipazione al nostro matrimonio
              </p>

              {error && (
                <div style={{
                  padding: '15px',
                  marginBottom: '20px',
                  background: '#f8d7da',
                  color: '#721c24',
                  borderRadius: 2,
                  fontSize: '0.95rem'
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleRsvpSubmit}>
                <div style={{ marginBottom: '30px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '15px',
                    color: '#8b7355',
                    fontSize: '1rem',
                    fontWeight: '500',
                    letterSpacing: '0.5px'
                  }}>
                    Parteciperai? *
                  </label>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                      type="button"
                      onClick={() => setRsvpStatus('yes')}
                      style={{
                        flex: 1,
                        padding: '18px',
                        background: rsvpStatus === 'yes' ? '#8b7355' : 'white',
                        color: rsvpStatus === 'yes' ? 'white' : '#8b7355',
                        border: `1px solid ${rsvpStatus === 'yes' ? '#8b7355' : '#d5c9b8'}`,
                        borderRadius: 2,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        letterSpacing: '0.5px',
                        transition: 'all 0.3s'
                      }}
                    >
                      ✓ Sì, ci sarò!
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpStatus('no')}
                      style={{
                        flex: 1,
                        padding: '18px',
                        background: rsvpStatus === 'no' ? '#8b7355' : 'white',
                        color: rsvpStatus === 'no' ? 'white' : '#8b7355',
                        border: `1px solid ${rsvpStatus === 'no' ? '#8b7355' : '#d5c9b8'}`,
                        borderRadius: 2,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        letterSpacing: '0.5px',
                        transition: 'all 0.3s'
                      }}
                    >
                      ✗ Non potrò
                    </button>
                  </div>
                </div>

                {guest.has_plus_one && rsvpStatus === 'yes' && (
                  <div style={{ marginBottom: '30px', padding: '25px', background: 'white', borderRadius: 2, border: '1px solid #e8e0d5' }}>
                    <label style={{ display: 'block', marginBottom: '18px', color: '#8b7355', fontSize: '1rem', fontWeight: '500', letterSpacing: '0.5px' }}>
                      Accompagnatore
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <input
                        type="text"
                        value={plusOneFirstName}
                        onChange={(e) => setPlusOneFirstName(e.target.value)}
                        placeholder="Nome"
                        style={{ padding: '15px', border: '1px solid #d5c9b8', borderRadius: 2, fontSize: '1rem', fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                      />
                      <input
                        type="text"
                        value={plusOneLastName}
                        onChange={(e) => setPlusOneLastName(e.target.value)}
                        placeholder="Cognome"
                        style={{ padding: '15px', border: '1px solid #d5c9b8', borderRadius: 2, fontSize: '1rem', fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                      />
                    </div>
                  </div>
                )}

                {guest.has_children && rsvpStatus === 'yes' && (
                  <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '15px', color: '#8b7355', fontSize: '1rem', fontWeight: '500', letterSpacing: '0.5px' }}>
                      Numero di bambini
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(parseInt(e.target.value) || 0)}
style={{ width: '100%', padding: '15px', border: '1px solid #d5c9b8', borderRadius: 2, fontSize: '1rem', fontFamily: "'Cormorant Garamond', Georgia, serif"                        }}
                    />
                  </div>
                )}

                {/* Alloggio - Logica ripristinata */}
                {rsvpStatus === 'yes' && (
                  <div style={{ marginBottom: '30px' }}>
                    {assignedAccommodation ? (
                      // Ha un alloggio assegnato
                      <div style={{
                        background: 'linear-gradient(135deg, #e7f3ff 0%, #d4e9ff 100%)',
                        border: '2px solid #2196F3',
                        borderRadius: 2,
                        padding: '30px'
                      }}>
                        <h4 style={{
                          fontSize: '1.3rem',
                          color: '#8b7355',
                          marginBottom: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          letterSpacing: '0.5px'
                        }}>
                          ✨ Alloggio Riservato per Te
                        </h4>
                        <div style={{ marginBottom: 15 }}>
                          <strong style={{ color: '#1976D2', fontSize: '1.15rem' }}>
                            {assignedAccommodation.name}
                          </strong>
                        </div>
                        {assignedAccommodation.description && (
                          <p style={{ color: '#546e7a', marginBottom: 15, lineHeight: 1.6 }}>
                            {assignedAccommodation.description}
                          </p>
                        )}
                        <div style={{ color: '#2c3e50', marginBottom: 10 }}>
                          📍 <strong>Indirizzo:</strong> {assignedAccommodation.address}
                        </div>
                        {assignedAccommodation.phone && (
                          <div style={{ color: '#2c3e50', marginBottom: 10 }}>
                            📞 <strong>Telefono:</strong> {assignedAccommodation.phone}
                          </div>
                        )}
                        {assignedAccommodation.email && (
                          <div style={{ color: '#2c3e50', marginBottom: 10 }}>
                            ✉️ <strong>Email:</strong> {assignedAccommodation.email}
                          </div>
                        )}
                        {assignedAccommodation.maps_link && (
                          <a 
                            href={assignedAccommodation.maps_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-block',
                              marginTop: 20,
                              padding: '12px 25px',
                              background: '#2196F3',
                              color: 'white',
                              textDecoration: 'none',
                              borderRadius: 2,
                              fontSize: '0.85rem',
                              letterSpacing: '1px',
                              textTransform: 'uppercase',
                              fontFamily: "'Montserrat', sans-serif"
                            }}
                          >
                            🗺️ Vedi su Maps
                          </a>
                        )}
                      </div>
                    ) : (
                      // Non ha alloggio assegnato - chiedi se ne ha bisogno
                      <>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          marginBottom: '15px'
                        }}>
                          <input
                            type="checkbox"
                            checked={needsAccommodation}
                            onChange={(e) => setNeedsAccommodation(e.target.checked)}
                            style={{ marginRight: '10px', cursor: 'pointer', width: 20, height: 20 }}
                          />
                          <span style={{
                            color: '#8b7355',
                            fontSize: '1rem',
                            fontWeight: '500',
                            letterSpacing: '0.5px'
                          }}>
                            Necessiti di supporto per trovare un alloggio?
                          </span>
                        </label>
                        {needsAccommodation && (
                          <textarea
                            value={accommodationNotes}
                            onChange={(e) => setAccommodationNotes(e.target.value)}
                            placeholder="Note sull'alloggio (es. numero di persone, preferenze, numero di notti)"
                            rows={3}
                            style={{
                              width: '100%',
                              padding: '15px',
                              border: '1px solid #d5c9b8',
                              borderRadius: 2,
                              fontSize: '1rem',
                              fontFamily: "'Cormorant Garamond', Georgia, serif",
                              resize: 'vertical'
                            }}
                          />
                        )}
                      </>
                    )}
                  </div>
                )}

                {rsvpStatus === 'yes' && (
                  <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '15px', color: '#8b7355', fontSize: '1rem', fontWeight: '500', letterSpacing: '0.5px' }}>
                      Allergie e intolleranze
                    </label>
                    <textarea
                      value={allergiesNotes}
                      onChange={(e) => setAllergiesNotes(e.target.value)}
                      placeholder="Indica eventuali allergie o intolleranze alimentari"
                      rows={3}
                      style={{ width: '100%', padding: '15px', border: '1px solid #d5c9b8', borderRadius: 2, fontSize: '1rem', fontFamily: "'Cormorant Garamond', Georgia, serif", resize: 'vertical' }}
                    />
                  </div>
                )}

                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '15px', color: '#8b7355', fontSize: '1rem', fontWeight: '500', letterSpacing: '0.5px' }}>
                    Messaggio per gli sposi (opzionale)
                  </label>
                  <textarea
                    value={messageToCouple}
                    onChange={(e) => setMessageToCouple(e.target.value)}
                    placeholder="Lasciaci un messaggio 💌"
                    rows={4}
                    style={{ width: '100%', padding: '15px', border: '1px solid #d5c9b8', borderRadius: 2, fontSize: '1rem', fontFamily: "'Cormorant Garamond', Georgia, serif", resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '18px',
                    background: '#8b7355',
                    color: 'white',
                    border: 'none',
                    borderRadius: 2,
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    fontFamily: "'Montserrat', sans-serif",
                    letterSpacing: '2px',
                    textTransform: 'uppercase'
                  }}
                >
                  {loading ? 'Salvataggio...' : 'Salva RSVP'}
                </button>
              </form>
            </div>
          )}

          {step === 'success' && (
            <div style={{
              background: '#faf9f7',
              padding: '60px 40px',
              border: '1px solid #e8e0d5',
              borderRadius: 2
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '30px' }}>
                {rsvpStatus === 'yes' ? '🎉' : '💌'}
              </div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: '300', marginBottom: '20px', color: '#8b7355', letterSpacing: '1px' }}>
                {rsvpStatus === 'yes' ? 'Grazie!' : 'Grazie per la risposta'}
              </h3>
              <p style={{ fontSize: '1.1rem', color: '#6b5d52', marginBottom: '40px', lineHeight: '1.6' }}>
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
                  padding: '14px 40px',
                  background: '#8b7355',
                  color: 'white',
                  border: 'none',
                  borderRadius: 2,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: '2px',
                  textTransform: 'uppercase'
                }}
              >
                Modifica risposta
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Gallery */}
      <section style={{ padding: '100px 20px', background: '#faf9f7', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '300', color: '#8b7355', marginBottom: '30px', letterSpacing: '2px' }}>
          Condividi i tuoi momenti
        </h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '50px', color: '#6b5d52' }}>
          Carica e visualizza le foto della giornata
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/public-photos" style={{ display: 'inline-block', padding: '16px 40px', background: '#8b7355', color: 'white', textDecoration: 'none', borderRadius: 2, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif", fontWeight: '500' }}>
            📷 Carica Foto
          </a>
          <a href="/gallery" style={{ display: 'inline-block', padding: '16px 40px', background: 'transparent', color: '#8b7355', textDecoration: 'none', borderRadius: 2, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif", fontWeight: '500', border: '1px solid #8b7355' }}>
            🖼️ Gallery
          </a>
        </div>
      </section>

      <footer style={{ padding: '60px 20px', textAlign: 'center', background: 'white', borderTop: '1px solid #e8e0d5' }}>
        <p style={{ fontSize: '0.9rem', color: '#9b8b7e', margin: 0, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif" }}>
          © 2026 Francesco & Martina · Con amore
        </p>
      </footer>
    </div>
  )
}
