'use client'

export default function LandingClient() {
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
          Martina & Francesco
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
          margin: '0 0 40px 0'
        }} />
        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <a 
            href="/login"
            style={{
              display: 'inline-block',
              padding: '16px 48px',
              background: 'white',
              color: '#2c3e50',
              textDecoration: 'none',
              borderRadius: '2px',
              fontSize: '1rem',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              border: '1px solid #ddd',
              transition: 'all 0.3s',
              fontWeight: '400'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2c3e50'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white'
              e.currentTarget.style.color = '#2c3e50'
            }}
          >
            Accedi all'area riservata
          </a>
          <a 
            href="/public-photos"
            style={{
              display: 'inline-block',
              padding: '16px 48px',
              background: '#f093fb',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '2px',
              fontSize: '1rem',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              border: 'none',
              transition: 'all 0.3s',
              fontWeight: '400'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e066eb'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f093fb'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            📸 Carica Foto
          </a>
        </div>
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
          {/* Data */}
          <div>
            <div style={{
              fontSize: '3rem',
              marginBottom: '16px'
            }}>📅</div>
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
              Sabato<br />
              29 Agosto 2026
            </p>
          </div>

          {/* Location */}
          <div>
            <div style={{
              fontSize: '3rem',
              marginBottom: '16px'
            }}>📍</div>
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
              Palazzo delle Bisce<br />
              Molinella, BO
            </p>
          </div>

          {/* Orario */}
          <div>
            <div style={{
              fontSize: '3rem',
              marginBottom: '16px'
            }}>🕐</div>
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
            {/* Timeline line */}
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

      {/* Photo Upload CTA Section */}
      <section style={{
        padding: '100px 20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: 'white'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: '300',
          marginBottom: '24px',
          letterSpacing: '1px'
        }}>
          Condividi i Tuoi Momenti
        </h2>
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '40px',
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto 40px auto'
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
            color: '#f093fb',
            textDecoration: 'none',
            borderRadius: '2px',
            fontSize: '1rem',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontWeight: '500',
            transition: 'all 0.3s'
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

      {/* RSVP Section */}
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
          Conferma la Tua Presenza
        </h2>
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '40px',
          opacity: 0.9,
          maxWidth: '700px',
          margin: '0 auto 40px auto'
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
            color: '#667eea',
            textDecoration: 'none',
            borderRadius: '2px',
            fontSize: '1rem',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontWeight: '500',
            transition: 'all 0.3s'
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
          © 2025 Francesco & Martina · Con amore
        </p>
      </footer>
    </div>
  )
}
