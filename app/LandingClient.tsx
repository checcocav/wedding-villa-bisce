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
  accommodation_given: boolean
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

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
const [isSafari, setIsSafari] = useState(false)
  
  const [rsvpStatus, setRsvpStatus] = useState<'yes' | 'no' | ''>('')
  const [plusOneFirstName, setPlusOneFirstName] = useState('')
  const [plusOneLastName, setPlusOneLastName] = useState('')
  const [childrenCount, setChildrenCount] = useState(0)
  const [needsAccommodation, setNeedsAccommodation] = useState(false)
  const [accommodationNotes, setAccommodationNotes] = useState('')
  const [allergiesNotes, setAllergiesNotes] = useState('')
  const [messageToCouple, setMessageToCouple] = useState('')

  useEffect(() => {
    const weddingDate = new Date('2026-08-29T17:00:00').getTime()
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

 useEffect(() => {
  const checkSafari = () => {
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    setIsSafari(isSafariBrowser)
  }
  checkSafari()
}, [])

  const faqs = [
    { 
      question: "C'è un parcheggio in location?", 
      answer: "Sì, il Palazzo delle Biscie dispone di un ampio parcheggio gratuito per gli ospiti." 
    },
    { 
      question: "Posso fare foto durante l'evento?", 
      answer: "Siete liberissimi di fare foto durante tutto l'evento, lo raccomandiamo! Vi chiediamo la cortesia di condividerle con noi." 
    },
    { 
      question: "È possibile prenotare un alloggio per la notte?", 
      answer: "In zona ci sono diverse alternative. Nel caso vogliate supporto potete indicarlo nella vostra area riservata e vi daremo una mano noi!" 
    },
    { 
      question: "Cosa posso regalarvi?",  
      answer: "Il regalo più bello sarà condividere con voi questo giorno speciale. Per chi lo desidera, è possibile contribuire al nostro viaggio di nozze: un safari in Sudafrica e il relax delle Seychelles, un sogno che non vediamo l’ora di vivere insieme. Il nostro IBAN apparirà in questo box qualche settimana prima del matrimonio." 
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
    <div style={{  fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#2c2c2c'}}>
      {/* Hero */}
      <section style={{
        minHeight: isSafari ? '80vh' : '95vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0
        }}>
          <img 
            src="https://cdn.jsdelivr.net/gh/checcocav/wedding-villa-bisce@main/foto_sfondo.jpeg"
            alt="Martina  
            & 
            Francesco" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
        
        {/* Overlay scuro per leggibilità */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1
        }} />

        {/* Testo sovrapposto */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '40px 20px',
          color: 'white',
          textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
            fontFamily: "'Playfair Display', serif",
            fontWeight: '400',  
            fontStyle: 'italic',
            margin: '0 0 30px 0',
            letterSpacing: '4px',
            textTransform: 'uppercase'
          }}>
            Martina & Francesco
          </h1>
          
          <div style={{
            width: '100px',
            height: '2px',
            background: 'rgba(255, 255, 255, 0.8)',
            margin: '30px auto'
          }} />

          <p style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
            margin: '20px 0 15px 0',
            fontWeight: '300',
            letterSpacing: '3px'
          }}>
            29 Agosto 2026
          </p>
          
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.3rem)',
            letterSpacing: '3px',
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: '300',
            textTransform: 'uppercase'
          }}>
            Palazzo delle Biscie
          </p>
        </div>
<style>
    {`
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(10px); }
      }
    `}
  </style>  
      <div style={{
    position: 'absolute',
    bottom: '20px', // Distanza dal bordo inferiore
    left: '0',
    right: '0',
    textAlign: 'center',
    zIndex: 10 // Per assicurarne la visibilità sopra l'immagine
  }}>
    <p style={{
      fontSize: 'clamp(1rem, 2vw, 1.3rem)',
      color: 'white',
            letterSpacing: '3px',
            fontFamily: "'Playfair Display', serif",
    fontWeight: '400',
    fontStyle: 'italic',
            
    }}>
     conferma la tua presenza 
    </p>
        <div style={{ 
    fontSize: '1rem', 
  color: 'white',
    marginTop: '10px', 
    fontWeight: '300',
    display: 'inline-block', 
    animation: 'bounce 2s infinite ease-in-out' 
  }}>
    ∨
  </div>
  </div>
      </section>
      
      {/* Countdown */}
      <section style={{ padding: '100px 20px', background: 'white', textAlign: 'center' }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: '300',
          color: '#5C161E',
          marginBottom: '60px',
          letterSpacing: '2px'
        }}>
          Quanto manca al nostro "Lo Voglio"
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
              background: '#F2E6E1',
              border: '1px solid #F2E6E1',
              borderRadius: 4
            }}>
              <div style={{
                fontSize: 'clamp(3rem, 8vw, 5rem)',
                fontWeight: '300',
                color: '#5C161E',
                marginBottom: 10,
                lineHeight: 1
              }}>
                {item.value}
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: '#a8836f',
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
      <section style={{ padding: '100px 20px', background: '#A4B3A9', textAlign: 'center' }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: '300',
          color: '#5C161E',
          marginBottom: '20px',
          letterSpacing: '2px'
        }}>
          Location del giorno
        </h2>
        
        <h3 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
          fontWeight: '400',
          color: '#5C161E',
          marginBottom: '50px',
          letterSpacing: '1px'
        }}>
          Palazzo delle Biscie
        </h3>
        
        <div style={{
          maxWidth: '700px',
          margin: '0 auto 30px',
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid #A4B3A9'
        }}>
          <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10161!2d11.6606956!3d44.6182114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13!3m3!1m2!1s0x477e3bcda4bd3189:0x225c1bb9c86e99df!2sPalazzo%20delle%20Biscie!5e0!3m2!1sit!2sit!4v1234567890"
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
            background: '#5C161E',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 4,
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
            color: '#5C161E',
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
              background: '#A4B3A9'
            }} />

            {[
              { time: '16:30', title: 'Arrivo Ospiti', desc: 'Benvenuto al Palazzo delle Biscie' },
              { time: '17:00', title: 'Cerimonia', desc: 'Momento della promessa' },
              { time: '18:00', title: 'Aperitivo', desc: 'Brindisi e foto nel giardino' },
              { time: '20:00', title: 'Cena', desc: 'Cena e festeggiamenti' },
              { time: '23:00', title: 'Taglio torta', desc: 'Dolce finale' }
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
                  border: '1px solid #a8836f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#5C161E',
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: '1px'
                }}>
                  {event.time}
                </div>
                <div style={{ paddingLeft: '30px' }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '400',
                    color: '#5C161E',
                    marginBottom: '8px',
                    letterSpacing: '1px'
                  }}>
                    {event.title}
                  </h3>
                  <p style={{
                    fontSize: '1rem',
                    color: '#8b8376',
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
      <section style={{ padding: '100px 20px', background: '#A4B3A9' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '300',
            color: '#5C161E',
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
                  border: '1px solid #A4B3A9',
                  borderRadius: 4,
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
                    color: '#5C161E',
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    textAlign: 'left',
                    transition: 'background 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#7D8F82'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <span style={{ letterSpacing: '0.5px' }}>{faq.question}</span>
                  <span style={{
                    fontSize: '1.2rem',
                    transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s',
                    color: '#a8836f'
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
            color: '#5C161E',
            marginBottom: '50px',
            letterSpacing: '2px'
          }}>
            Conferma la Tua Presenza
          </h2>

          {step === 'email' && (
            <div style={{
              background: '#F2E6E1',
              padding: '50px 40px',
              border: '1px solid #A4B3A9',
              borderRadius: 4
            }}>
              <p style={{
                fontSize: '1.1rem',
                color: '#6b5d52',
                marginBottom: '30px',
                lineHeight: '1.6'
              }}>
                Inserisci la tua email per rispondere
              </p>

              {error && (
                <div style={{
                  padding: '15px',
                  marginBottom: '20px',
                  background: '#f8d7da',
                  color: '#721c24',
                  borderRadius: 4,
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
                    border: '1px solid #A4B3A9',
                    borderRadius: 4,
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
                    background: '#5C161E',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
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
              background: '#F2E6E1',
              padding: 'clamp(20px, 5vw, 50px)',
              border: '1px solid #A4B3A9',
              borderRadius: 4,
              maxHeight: '80vh',
              overflowY: 'auto',
              textAlign: 'left'
            }}>
              <h3 style={{
                fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                fontWeight: '300',
                marginBottom: '10px',
                color: '#5C161E',
                textAlign: 'center',
                letterSpacing: '1px'
              }}>
                Ciao {guest.first_name}!
              </h3>
              <p style={{
                fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                color: '#6b5d52',
                marginBottom: '30px',
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
                  borderRadius: 4,
                  fontSize: '0.9rem'
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleRsvpSubmit}>
                {/* Parteciperai */}
                <div style={{ marginBottom: '25px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '12px',
                    color: '#5C161E',
                    fontSize: 'clamp(0.95rem, 3vw, 1rem)',
                    fontWeight: '500',
                    letterSpacing: '0.5px'
                  }}>
                    Parteciperai? *
                  </label>
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px'
                  }}>
                    <button
                      type="button"
                      onClick={() => setRsvpStatus('yes')}
                      style={{
                        padding: 'clamp(12px, 3vw, 18px)',
                        background: rsvpStatus === 'yes' ? '#5C161E' : 'white',
                        color: rsvpStatus === 'yes' ? 'white' : '#5C161E',
                        border: `1px solid ${rsvpStatus === 'yes' ? '#5C161E' : '#A4B3A9'}`,
                        borderRadius: 4,
                        fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
                        cursor: 'pointer',
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        letterSpacing: '0.5px',
                        transition: 'all 0.3s'
                      }}
                    >
                      ✓ Sì
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpStatus('no')}
                      style={{
                        padding: 'clamp(12px, 3vw, 18px)',
                        background: rsvpStatus === 'no' ? '#5C161E' : 'white',
                        color: rsvpStatus === 'no' ? 'white' : '#5C161E',
                        border: `1px solid ${rsvpStatus === 'no' ? '#5C161E' : '#A4B3A9'}`,
                        borderRadius: 4,
                        fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
                        cursor: 'pointer',
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        letterSpacing: '0.5px',
                        transition: 'all 0.3s'
                      }}
                    >
                      ✗ No
                    </button>
                  </div>
                </div>

                {/* Plus One */}
                {guest.has_plus_one && rsvpStatus === 'yes' && (
                  <div style={{ 
                    marginBottom: '25px', 
                    padding: 'clamp(15px, 4vw, 25px)', 
                    background: 'white', 
                    borderRadius: 4, 
                    border: '1px solid #A4B3A9' 
                  }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '15px', 
                      color: '#5C161E', 
                      fontSize: 'clamp(0.95rem, 3vw, 1rem)', 
                      fontWeight: '500', 
                      letterSpacing: '0.5px' 
                    }}>
                      Accompagnatore
                    </label>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr',
                      gap: '12px'
                    }}>
                      <input
                        type="text"
                        value={plusOneFirstName}
                        onChange={(e) => setPlusOneFirstName(e.target.value)}
                        placeholder="Nome"
                        style={{ 
                          padding: '12px', 
                          border: '1px solid #A4B3A9', 
                          borderRadius: 4, 
                          fontSize: 'clamp(0.9rem, 3vw, 1rem)', 
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          width: '100%',
                          boxSizing: 'border-box'
                        }}
                      />
                      <input
                        type="text"
                        value={plusOneLastName}
                        onChange={(e) => setPlusOneLastName(e.target.value)}
                        placeholder="Cognome"
                        style={{ 
                          padding: '12px', 
                          border: '1px solid #A4B3A9', 
                          borderRadius: 4, 
                          fontSize: 'clamp(0.9rem, 3vw, 1rem)', 
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          width: '100%',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Bambini */}
                {guest.has_children && rsvpStatus === 'yes' && (
                  <div style={{ marginBottom: '25px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '12px', 
                      color: '#5C161E', 
                      fontSize: 'clamp(0.95rem, 3vw, 1rem)', 
                      fontWeight: '500', 
                      letterSpacing: '0.5px' 
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
                        border: '1px solid #A4B3A9', 
                        borderRadius: 4, 
                        fontSize: 'clamp(0.9rem, 3vw, 1rem)', 
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                )}

                {/* Alloggio */}
                {rsvpStatus === 'yes' && (
                  <div style={{ marginBottom: '25px' }}>
                    {guest.accommodation_given ? (
                      <div style={{
                        background: 'linear-gradient(135deg, #e7f3ff 0%, #d4e9ff 100%)',
                        border: '2px solid #7a9cc6',
                        borderRadius: 4,
                        padding: 'clamp(20px, 5vw, 30px)',
                        textAlign: 'center'
                      }}>
                        <h4 style={{
                          fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
                          color: '#5C161E',
                          marginBottom: '15px',
                          letterSpacing: '1px'
                        }}>
                          🎉 Hai l'accommodation inclusa in location!
                        </h4>
                        <p style={{ 
                          color: '#5a7399', 
                          fontSize: 'clamp(0.9rem, 3vw, 1rem)', 
                          lineHeight: 1.6 
                        }}>
                          Abbiamo riservato una camera per te al Palazzo delle Bisce. 
                          Riceverai tutti i dettagli via email prima dell'evento.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '12px',
                          color: '#5C161E',
                          fontSize: 'clamp(0.95rem, 3vw, 1rem)',
                          fontWeight: '500',
                          letterSpacing: '0.5px'
                        }}>
                          Per quante persone cerchi alloggio?
                        </label>
                        <textarea
                          value={accommodationNotes}
                          onChange={(e) => setAccommodationNotes(e.target.value)}
                          placeholder="Indica il numero di persone e eventuali preferenze (es. 2 persone, 1 notte)"
                          rows={4}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #A4B3A9',
                            borderRadius: 4,
                            fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            resize: 'vertical',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Allergie */}
                {rsvpStatus === 'yes' && (
                  <div style={{ marginBottom: '25px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '12px', 
                      color: '#5C161E', 
                      fontSize: 'clamp(0.95rem, 3vw, 1rem)', 
                      fontWeight: '500', 
                      letterSpacing: '0.5px' 
                    }}>
                      Allergie e intolleranze
                    </label>
                    <textarea
                      value={allergiesNotes}
                      onChange={(e) => setAllergiesNotes(e.target.value)}
                      placeholder="Indica eventuali allergie o intolleranze alimentari"
                      rows={3}
                      style={{ 
                        width: '100%', 
                        padding: '12px', 
                        border: '1px solid #A4B3A9', 
                        borderRadius: 4, 
                        fontSize: 'clamp(0.9rem, 3vw, 1rem)', 
                        fontFamily: "'Cormorant Garamond', Georgia, serif", 
                        resize: 'vertical',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                )}

                {/* Messaggio */}
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '12px', 
                    color: '#5C161E', 
                    fontSize: 'clamp(0.95rem, 3vw, 1rem)', 
                    fontWeight: '500', 
                    letterSpacing: '0.5px' 
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
                      border: '1px solid #A4B3A9', 
                      borderRadius: 4, 
                      fontSize: 'clamp(0.9rem, 3vw, 1rem)', 
                      fontFamily: "'Cormorant Garamond', Georgia, serif", 
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: 'clamp(14px, 4vw, 18px)',
                    background: '#5C161E',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    fontSize: 'clamp(0.8rem, 2.5vw, 0.85rem)',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    fontFamily: "'Montserrat', sans-serif",
                    letterSpacing: '2px',
                    textTransform: 'uppercase'
                  }}
                >
                  {loading ? 'Salvataggio...' : 'Salva'}
                </button>
              </form>
            </div>
          )}
          
          {step === 'success' && (
            <div style={{
              background: '#F2E6E1',
              padding: '60px 40px',
              border: '1px solid #A4B3A9',
              borderRadius: 4
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '30px' }}>
                {rsvpStatus === 'yes' ? '🎉' : '💌'}
              </div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: '300', marginBottom: '20px', color: '#5C161E', letterSpacing: '1px' }}>
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
                  background: '#5C161E',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
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

      <footer style={{ padding: '60px 20px', textAlign: 'center', background: 'white', borderTop: '1px solid #A4B3A9' }}>
        <p style={{ fontSize: '0.9rem', color: '#8b8376', margin: 0, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif" }}>
          © 2026 Martina & Francesco
        </p>
        <p style={{
    fontSize: '0.8rem',
      color: '#8b8376',
    letterSpacing: '1px', 
    fontFamily: "'Playfair Display', serif",
    fontWeight: '400',
    fontStyle: 'italic',
    lineHeight: '0.8',
    textAlign: 'center' // Opzionale: aggiunge eleganza se il testo è su due righe
}}>
    come for the love, stay for the party
</p>
      </footer>
    </div>
  )
}
