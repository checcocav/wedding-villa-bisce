import { createClient } from '@/lib/supabase/server'

const ALLERGIES = [
  'lattosio/latte',
  'celiachia',
  'uova',
  'pomodori',
  'banane',
  'melanzane',
  'avocado',
  'mango',
  'olive',
  'uva',
]

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { success?: string; error?: string }
}) {
  const supabase = createClient()
  
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()
  
  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Georgia, serif'
      }}>
        <p style={{ fontSize: '1.2rem', color: '#546e7a' }}>Non autenticato</p>
      </div>
    )
  }

  const { data: guest } = await supabase
    .from('guests')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!guest) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Georgia, serif',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', color: '#546e7a', marginBottom: '16px' }}>
            Non risulti tra gli invitati.
          </p>
          <p style={{ fontSize: '1rem', color: '#999' }}>Email: {user.email}</p>
          {guestError && (
            <p style={{ fontSize: '0.9rem', color: '#dc3545', marginTop: '12px' }}>
              Errore: {JSON.stringify(guestError)}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      fontFamily: 'Georgia, serif',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e0e0e0',
        padding: '24px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: '300',
          color: '#2c3e50',
          margin: 0,
          letterSpacing: '1px'
        }}>
          Benvenuto, {guest.first_name}
        </h1>
      </header>

      <main style={{ 
        maxWidth: '900px', 
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Success Messages */}
        {searchParams.success === 'allergies_saved' && (
          <div style={{ 
            padding: 16, 
            marginBottom: 24, 
            background: '#d4edda', 
            color: '#155724', 
            borderRadius: 8,
            border: '1px solid #c3e6cb',
            textAlign: 'center'
          }}>
            ✅ Allergie salvate con successo!
          </div>
        )}
        
        {searchParams.success === 'plus_one_saved' && (
          <div style={{ 
            padding: 16, 
            marginBottom: 24, 
            background: '#d4edda', 
            color: '#155724', 
            borderRadius: 8,
            border: '1px solid #c3e6cb',
            textAlign: 'center'
          }}>
            ✅ Accompagnatore salvato con successo!
          </div>
        )}
        
        {searchParams.success === 'rsvp_saved' && (
          <div style={{ 
            padding: 16, 
            marginBottom: 24, 
            background: '#d4edda', 
            color: '#155724', 
            borderRadius: 8,
            border: '1px solid #c3e6cb',
            textAlign: 'center'
          }}>
            ✅ RSVP aggiornato con successo!
          </div>
        )}

        {/* Error Messages */}
        {searchParams.error === 'update_failed' && (
          <div style={{ 
            padding: 16, 
            marginBottom: 24, 
            background: '#f8d7da', 
            color: '#721c24', 
            borderRadius: 8,
            border: '1px solid #f5c6cb',
            textAlign: 'center'
          }}>
            ❌ Errore nel salvataggio. Riprova.
          </div>
        )}
        
        {searchParams.error === 'unexpected' && (
          <div style={{ 
            padding: 16, 
            marginBottom: 24, 
            background: '#f8d7da', 
            color: '#721c24', 
            borderRadius: 8,
            border: '1px solid #f5c6cb',
            textAlign: 'center'
          }}>
            ❌ Errore imprevisto. Riprova più tardi.
          </div>
        )}

        {searchParams.error === 'missing_fields' && (
          <div style={{ 
            padding: 16, 
            marginBottom: 24, 
            background: '#f8d7da', 
            color: '#721c24', 
            borderRadius: 8,
            border: '1px solid #f5c6cb',
            textAlign: 'center'
          }}>
            ❌ Compila tutti i campi obbligatori.
          </div>
        )}

        {searchParams.error === 'invalid_status' && (
          <div style={{ 
            padding: 16, 
            marginBottom: 24, 
            background: '#f8d7da', 
            color: '#721c24', 
            borderRadius: 8,
            border: '1px solid #f5c6cb',
            textAlign: 'center'
          }}>
            ❌ Stato RSVP non valido.
          </div>
        )}

        {/* Event Info Card */}
        <section style={{
          background: 'white',
          borderRadius: 8,
          padding: '32px',
          marginBottom: 32,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '300',
              color: '#2c3e50',
              marginBottom: 24,
              letterSpacing: '0.5px'
            }}>
              Dettagli Evento
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 24,
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>📅</div>
                <p style={{ fontSize: '1rem', color: '#546e7a', margin: 0 }}>
                  <strong>29 Agosto 2026</strong>
                </p>
              </div>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>📍</div>
                <p style={{ fontSize: '1rem', color: '#546e7a', margin: 0 }}>
                  <strong>Villa delle Bisce</strong>
                </p>
              </div>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>
                  {guest.rsvp_status === 'yes' ? '✅' : guest.rsvp_status === 'no' ? '❌' : '⏳'}
                </div>
                <p style={{ fontSize: '1rem', color: '#546e7a', margin: 0 }}>
                  <strong>
                    {guest.rsvp_status === 'yes' ? 'Confermato' : 
                     guest.rsvp_status === 'no' ? 'Non parteciperà' : 
                     'In attesa'}
                  </strong>
                </p>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid #e0e0e0',
            paddingTop: 24,
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: '400',
              color: '#2c3e50',
              marginBottom: 16
            }}>
              Conferma la tua presenza
            </h3>
            <form method="post" action="/rsvp" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                name="status" 
                value="yes" 
                style={{ 
                  padding: '12px 32px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s'
                }}
              >
                ✓ Confermo la presenza
              </button>
              <button 
                name="status" 
                value="no" 
                style={{ 
                  padding: '12px 32px',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s'
                }}
              >
                ✗ Non parteciperò
              </button>
            </form>
          </div>
        </section>

        {/* Quick Actions */}
        <section style={{
          background: 'white',
          borderRadius: 8,
          padding: '32px',
          marginBottom: 32,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '300',
            color: '#2c3e50',
            marginBottom: 24,
            textAlign: 'center',
            letterSpacing: '0.5px'
          }}>
            Azioni Rapide
          </h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a 
              href="/photos" 
              style={{
                display: 'inline-block',
                padding: '14px 28px',
                background: '#667eea',
                color: 'white',
                textDecoration: 'none',
                borderRadius: 4,
                fontSize: '1rem',
                fontWeight: '400',
                transition: 'all 0.3s'
              }}
            >
              📷 Carica Foto
            </a>
            <a 
              href="/gallery" 
              style={{
                display: 'inline-block',
                padding: '14px 28px',
                background: '#764ba2',
                color: 'white',
                textDecoration: 'none',
                borderRadius: 4,
                fontSize: '1rem',
                fontWeight: '400',
                transition: 'all 0.3s'
              }}
            >
              🖼️ Gallery
            </a>
          </div>
        </section>

        {/* Plus One */}
        {guest.has_plus_one === true && (
          <section style={{ 
            background: 'white',
            borderRadius: 8,
            padding: 32,
            marginBottom: 32,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '300',
              color: '#2c3e50',
              marginBottom: 24,
              textAlign: 'center',
              letterSpacing: '0.5px'
            }}>
              Il Tuo Accompagnatore
            </h3>
            <form method="post" action="/plus-one" style={{ maxWidth: 400, margin: '0 auto' }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block',
                  marginBottom: 8,
                  color: '#2c3e50',
                  fontSize: '0.9rem'
                }}>
                  Nome
                </label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="Nome"
                  defaultValue={guest.plus_one_first_name || ''}
                  required
                  style={{ 
                    width: '100%',
                    padding: 12,
                    border: '1px solid #ddd',
                    borderRadius: 4,
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block',
                  marginBottom: 8,
                  color: '#2c3e50',
                  fontSize: '0.9rem'
                }}>
                  Cognome
                </label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Cognome"
                  defaultValue={guest.plus_one_last_name || ''}
                  required
                  style={{ 
                    width: '100%',
                    padding: 12,
                    border: '1px solid #ddd',
                    borderRadius: 4,
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              <button 
                type="submit" 
                style={{ 
                  width: '100%',
                  padding: 14,
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: '500'
                }}
              >
                Salva Accompagnatore
              </button>
            </form>
          </section>
        )}

        {/* Allergies */}
        <section style={{ 
          background: 'white',
          borderRadius: 8,
          padding: 32,
          marginBottom: 32,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '300',
            color: '#2c3e50',
            marginBottom: 24,
            textAlign: 'center',
            letterSpacing: '0.5px'
          }}>
            Allergie e Intolleranze
          </h3>
          <form method="post" action="/food-allergies" style={{ maxWidth: 500, margin: '0 auto' }}>
            <fieldset style={{ border: 'none', padding: 0 }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 12
              }}>
                {ALLERGIES.map((allergy) => (
                  <label key={allergy} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="allergies"
                      value={allergy}
                      defaultChecked={guest.food_allergies?.includes(allergy)}
                      style={{ marginRight: 8, cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.95rem', color: '#2c3e50' }}>{allergy}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div style={{ marginTop: 24 }}>
              <label style={{
                display: 'block',
                marginBottom: 8,
                color: '#2c3e50',
                fontSize: '0.9rem'
              }}>
                Altro (specificare):
              </label>
              <textarea
                name="other"
                rows={3}
                defaultValue={guest.food_allergies_other ?? ''}
                style={{ 
                  width: '100%',
                  padding: 12,
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>
            <button 
              type="submit"
              style={{ 
                width: '100%',
                marginTop: 16,
                padding: 14,
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                fontSize: '1rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: '500'
              }}
            >
              Salva Preferenze
            </button>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '32px 20px',
        textAlign: 'center',
        background: 'white',
        borderTop: '1px solid #e0e0e0'
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
      </footer>
    </div>
  )
}
