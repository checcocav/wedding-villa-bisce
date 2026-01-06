'use client'

import { useEffect, useState } from 'react'

export default function LandingClient() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [openFaq, setOpenFaq] = useState<number | null>(null)

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

  const faqs = [
    {
      question: "C'è parcheggio disponibile?",
      answer: "Sì, il Palazzo delle Biscie dispone di un ampio parcheggio gratuito per gli ospiti."
    },
    {
      question: "Posso fare foto durante la cerimonia?",
      answer: "Vi chiediamo di astenervi dalle foto durante la cerimonia per permettere al fotografo ufficiale di fare il suo lavoro. Dopo sarete liberi di fotografare!"
    },
    {
      question: "È possibile prenotare l'alloggio presso la location?",
      answer: "Sì, il Palazzo offre camere per gli ospiti. Accedi all'area riservata per maggiori informazioni."
    }
  ]

  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f4f1e8 0%, #e8dcc4 100%)',
        textAlign: 'center',
        padding: '40px 20px',
        position: 'relative'
      }}>
        {/* Video Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0
        }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.4
            }}
          >
            <source src="https://cdn.jsdelivr.net/gh/checcocav/wedding-villa-bisce@main/background_video.mp4" type="video/mp4" />
          </video>
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 8vw, 5rem)',
          fontWeight: '300',
          margin: '0 0 20px 0',
          color: '#6b2c3e',
          letterSpacing: '2px',
          fontStyle: 'italic',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          lineHeight: '1.3'
        }}>
          Martina<br />
          &<br />
          Francesco
        </h1>

        <p style={{
          fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
          color: '#8b7c6f',
          margin: '0 0 40px 0',
          fontStyle: 'italic',
          position: 'relative',
          zIndex: 1
        }}>
          Sabato 29 Agosto 2026
        </p>
      </section>

      {/* Countdown Section */}
      <section style={{
        padding: '100px 20px',
        textAlign: 'center',
        background: '#faf8f5'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
          fontWeight: '300',
          color: '#6b2c3e',
          marginBottom: '60px',
          letterSpacing: '1px',
          fontStyle: 'italic'
        }}>
          Quanto manca al nostro "Lo Voglio"
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
            background: 'white',
            borderRadius: 8,
            border: '2px solid #d4a5a5'
          }}>
            <div style={{
              fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              fontWeight: '300',
              color: '#6b2c3e',
              marginBottom: 8
            }}>
              {timeLeft.days}
            </div>
            <div style={{
              fontSize: '1rem',
              color: '#8b7c6f',
              fontStyle: 'italic'
            }}>
              Giorni
            </div>
          </div>
          
          <div style={{
            padding: 30,
            background: 'white',
            borderRadius: 8,
            border: '2px solid #d4a5a5'
          }}>
            <div style={{
              fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              fontWeight: '300',
              color: '#6b2c3e',
              marginBottom: 8
            }}>
              {timeLeft.hours}
            </div>
            <div style={{
              fontSize: '1rem',
              color: '#8b7c6f',
              fontStyle: 'italic'
            }}>
              Ore
            </div>
          </div>
          
          <div style={{
            padding: 30,
            background: 'white',
            borderRadius: 8,
            border: '2px solid #d4a5a5'
          }}>
            <div style={{
              fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              fontWeight: '300',
              color: '#6b2c3e',
              marginBottom: 8
            }}>
              {timeLeft.minutes}
            </div>
            <div style={{
              fontSize: '1rem',
              color: '#8b7c6f',
              fontStyle: 'italic'
            }}>
              Minuti
            </div>
          </div>
          
          <div style={{
            padding: 30,
            background: 'white',
            borderRadius: 8,
            border: '2px solid #d4a5a5'
          }}>
            <div style={{
              fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              fontWeight: '300',
              color: '#6b2c3e',
              marginBottom: 8
            }}>
              {timeLeft.seconds}
            </div>
            <div style={{
              fontSize: '1rem',
              color: '#8b7c6f',
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
        background: '#f4f1e8',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
          fontWeight: '300',
          color: '#6b2c3e',
          marginBottom: '40px',
          letterSpacing: '1px',
          fontStyle: 'italic'
        }}>
          Location
        </h2>
        
        <h3 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: '400',
          color: '#8b7c6f',
          marginBottom: '40px',
          fontStyle: 'italic'
        }}>
          Palazzo delle Biscie
        </h3>
        
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
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
          href="https://maps.google.com/?q=Palazzo+delle+Biscie+Molinella"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: 24,
            padding: '12px 32px',
            background: '#6b2c3e',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 4,
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
        background: '#faf8f5'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '300',
            color: '#6b2c3e',
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
              background: '#d4a5a5'
            }} />

            {[
              { time: '16:30', title: 'Arrivo degli ospiti', desc: 'Benvenuto al Palazzo delle Biscie' },
              { time: '17:00', title: 'Cerimonia', desc: 'Momento della promessa' },
              { time: '18:00', title: 'Aperitivo', desc: 'Brindisi e foto nel giardino' },
              { time: '20:00', title: 'Cena', desc: 'Ricevimento e festeggiamenti' },
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
                  border: '2px solid #d4a5a5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#6b2c3e',
                  zIndex: 1
                }}>
                  {event.time}
                </div>
                <div style={{ paddingLeft: '20px' }}>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '400',
                    color: '#6b2c3e',
                    marginBottom: '8px',
                    fontStyle: 'italic'
                  }}>
                    {event.title}
                  </h3>
                  <p style={{
                    fontSize: '1rem',
                    color: '#8b7c6f',
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

      {/* RSVP Section */}
      <section style={{
        padding: '100px 20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #a8b5a5 0%, #8b9d8b 100%)',
        color: 'white'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: '300',
          marginBottom: '24px',
          letterSpacing: '1px',
          fontStyle: 'italic'
        }}>
          Conferma la Tua Presenza
        </h2>
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '40px',
          opacity: 0.95,
          maxWidth: '700px',
          margin: '0 auto 40px auto',
          fontStyle: 'italic'
        }}>
          Accedi all'area riservata per confermare la tua partecipazione,<br />
          indicare eventuali allergie e vedere tutte le foto della giornata
        </p>
        <a 
          href="/login"
          style={{
            display: 'inline-block',
            padding: '16px 48px',
            background: 'white',
            color: '#8b9d8b',
            textDecoration: 'none',
            borderRadius: '2px',
            fontSize: '1rem',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontWeight: '500',
            transition: 'all 0.3s',
            fontStyle: 'italic'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Accedi Ora
        </a>
      </section>

      {/* FAQ Section */}
      <section style={{
        padding: '100px 20px',
        background: '#f4f1e8'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '300',
            color: '#6b2c3e',
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
                  boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
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
                    color: '#6b2c3e',
                    fontFamily: 'Georgia, serif',
                    fontStyle: 'italic',
                    textAlign: 'left',
                    transition: 'background 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#faf8f5'}
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
                    color: '#8b7c6f',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    fontStyle: 'italic',
                    animation: 'fadeIn 0.3s ease-in'
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Upload CTA Section */}
      <section style={{
        padding: '100px 20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #d4a5a5 0%, #e6c9c9 100%)',
        color: 'white'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: '300',
          marginBottom: '24px',
          letterSpacing: '1px',
          fontStyle: 'italic'
        }}>
          Condividi i Tuoi Momenti
        </h2>
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '40px',
          opacity: 0.95,
          maxWidth: '600px',
          margin: '0 auto 40px auto',
          fontStyle: 'italic'
        }}>
          Carica le tue foto del matrimonio e aiutaci a catturare ogni momento speciale!<br />
          Non è necessario registrarsi 📸
        </p>
        <a 
          href="/public-photos"
          style={{
            display: 'inline-block',
            padding: '16px 48px',
            background: 'white',
            color: '#d4a5a5',
            textDecoration: 'none',
            borderRadius: '2px',
            fontSize: '1rem',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontWeight: '500',
            transition: 'all 0.3s',
            fontStyle: 'italic'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          📸 Carica le Tue Foto
        </a>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 20px',
        textAlign: 'center',
        background: '#6b2c3e',
        color: 'white'
      }}>
        <p style={{
          fontSize: '1rem',
          opacity: 0.9,
          margin: 0,
          fontStyle: 'italic'
        }}>
          © 2026 Martina & Francesco · Con amore
        </p>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
