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
        fontFamily: 'Georgia, serif',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <p style={{ fontSize: '1.2rem', color: '#546e7a', fontStyle: 'italic' }}>Non autenticato</p>
      </div>
    )
  }

  const { data: guest, error: guestError } = await supabase
    .from('guests')
    .select(`
      *,
      accommodations (
        id,
        name,
        address,
        description,
        phone,
        email,
        maps_link
      )
    `)
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
        padding: '20px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', color: '#546e7a', marginBottom: '16px', fontStyle: 'italic' }}>
            Non risulti tra gli invitati.
          </p>
          <p style={{ fontSize: '1rem', color: '#999', fontStyle: 'italic' }}>Email: {user.email}</p>
          {guestError && (
            <p style={{ fontSize: '0.9rem', color: '#dc3545', marginTop: '12px', fontStyle: 'italic' }}>
              Errore: {JSON.stringify(guestError)}
            </p>
          )}
        </div>
      </div>
    )
  }

  const assignedAccommodation = Array.isArray(guest.accommodations) 
    ? guest.accommodations[0] 
    : guest.accommodations

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
        padding: '32px 24px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 5vw, 3rem)',
          fontWeight: '300',
          color: '#2c3e50',
          margin: 0,
          letterSpacing: '1px',
          fontStyle: 'italic'
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
            textAlign: 'center',
            fontStyle: 'italic'
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
            textAlign: 'center',
            fontStyle: 'italic'
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
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            ✅ RSVP aggiornato con successo!
          </div>
        )}

        {searchParams.success === 'accommodation_saved' && (
          <div style={{ 
            padding: 16, 
            marginBottom: 24, 
            background: '#d4edda', 
            color: '#155724', 
            borderRadius: 8,
            border: '1px solid #c3e6cb',
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            ✅ Preferenze alloggio salvate con successo!
          </div>
        )}

        {/* Error Messages */}
        {(searchParams.error === 'update_failed' || searchParams.error === 'unexpected' || 
          searchParams.error === 'missing_fields' || searchParams.error === 'invalid_status') && (
          <div style={{ 
            padding: 16, 
            marginBottom: 24, 
            background: '#f8d7da', 
            color: '#721c24', 
            borderRadius: 8,
            border: '1px solid #f5c6cb',
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            ❌ {searchParams.error === 'update_failed' ? 'Errore nel salvataggio. Riprova.' :
                searchParams.error === 'unexpected' ? 'Errore imprevisto. Riprova più tardi.' :
                searchParams.error === 'missing_fields' ? 'Compila tutti i campi obbligatori.' :
                'Stato RSVP non valido.'}
          </div>
        )}

        {/* Event Info Card */}
        <section style={{
          background: 'white',
          borderRadius: 8,
          padding: '40px 32px',
          marginBottom: 32,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: '300',
            color: '#2c3e50',
            marginBottom: 32,
            letterSpacing: '0.5px',
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            Il Nostro Matrimonio
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 24,
            textAlign: 'center',
            marginBottom: 32
          }}>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📅</div>
              <p style={{ fontSize: '1.1rem', color: '#2c3e50', margin: 0, fontStyle: 'italic' }}>
                <strong>29 Agosto 2026</strong>
              </p>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📍</div>
              <p style={{ fontSize: '1.1rem', color: '#2c3e50', margin: 0, fontStyle: 'italic' }}>
                <strong>Palazzo delle Bisce</strong>
              </p>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>
                {guest.rsvp_status === 'yes' ? '✅' : guest.rsvp_status === 'no' ? '❌' : '⏳'}
              </div>
              <p style={{ fontSize: '1.1rem', color: '#2c3e50', margin: 0, fontStyle: 'italic' }}>
                <strong>
                  {guest.rsvp_status === 'yes' ? 'Confermato' : 
                   guest.rsvp_status === 'no' ? 'Non parteciperà' : 
                   'In attesa'}
                </strong>
              </p>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid #e0e0e0',
            paddingTop: 32,
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: '400',
              color: '#2c3e50',
              marginBottom: 20,
              fontStyle: 'italic'
            }}>
              Conferma la tua presenza
            </h3>
            <form method="post" action="/rsvp" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                name="status" 
                value="yes" 
                style={{ 
                  padding: '14px 32px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)'
                }}
              >
                ✓ Confermo la presenza
              </button>
              <button 
                name="status" 
                value="no" 
                style={{ 
                  padding: '14px 32px',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)'
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
          padding: '40px 32px',
          marginBottom: 32,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
            fontWeight: '300',
            color: '#2c3e50',
            marginBottom: 28,
            textAlign: 'center',
            letterSpacing: '0.5px',
            fontStyle: 'italic'
          }}>
            Azioni Rapide
          </h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a 
              href="/photos" 
              style={{
                display: 'inline-block',
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: 8,
                fontSize: '1rem',
                fontStyle: 'italic',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}
            >
              📷 Carica Foto
            </a>
            <a 
              href="/gallery" 
              style={{
                display: 'inline-block',
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: 8,
                fontSize: '1rem',
                fontStyle: 'italic',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(240, 147, 251, 0.3)'
              }}
            >
              🖼️ Gallery
            </a>
          </div>
        </section>

        {/* Accommodation Section */}
        <section style={{ 
          background: 'white',
          borderRadius: 8,
          padding: '40px 32px',
          marginBottom: 32,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
            fontWeight: '300',
            color: '#2c3e50',
            marginBottom: 28,
            textAlign: 'center',
            letterSpacing: '0.5px',
            fontStyle: 'italic'
          }}>
            🏨 Alloggio
          </h3>

          {assignedAccommodation ? (
            <div style={{
              background: 'linear-gradient(135deg, #e7f3ff 0%, #d4e9ff 100%)',
              border: '2px solid #2196F3',
              borderRadius: 12,
              padding: 32,
              marginBottom: 24
            }}>
              <h4 style={{
                fontSize: '1.4rem',
                color: '#2c3e50',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontStyle: 'italic'
              }}>
                ✨ Alloggio Riservato per Te
              </h4>
              <div style={{ marginBottom: 16, textAlign: 'center' }}>
                <strong style={{ color: '#1976D2', fontSize: '1.2rem', fontStyle: 'italic' }}>
                  {assignedAccommodation.name}
                </strong>
              </div>
              {assignedAccommodation.description && (
                <p style={{ color: '#546e7a', marginBottom: 16, lineHeight: 1.6, textAlign: 'center', fontStyle: 'italic' }}>
                  {assignedAccommodation.description}
                </p>
              )}
              <div style={{ color: '#2c3e50', marginBottom: 12, fontStyle: 'italic' }}>
                📍 <strong>Indirizzo:</strong> {assignedAccommodation.address}
              </div>
              {assignedAccommodation.phone && (
                <div style={{ color: '#2c3e50', marginBottom: 12, fontStyle: 'italic' }}>
                  📞 <strong>Telefono:</strong> {assignedAccommodation.phone}
                </div>
              )}
              {assignedAccommodation.email && (
                <div style={{ color: '#2c3e50', marginBottom: 12, fontStyle: 'italic' }}>
                  ✉️ <strong>Email:</strong> {assignedAccommodation.email}
                </div>
              )}
              {assignedAccommodation.maps_link && (
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                  <a 
                    href={assignedAccommodation.maps_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      padding: '12px 28px',
                      background: '#2196F3',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: 8,
                      fontSize: '1rem',
                      fontStyle: 'italic',
                      transition: 'all 0.3s',
                      boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)'
                    }}
                  >
                    🗺️ Vedi su Maps
                  </a>
                </div>
              )}
            </div>
          ) : (
            <form method="post" action="/accommodation" style={{ maxWidth: 500, margin: '0 auto' }}>
              <div style={{ marginBottom: 28 }}>
                <label style={{
                  display: 'block',
                  marginBottom: 16,
                  color: '#2c3e50',
                  fontSize: '1.1rem',
                  fontWeight: '400',
                  fontStyle: 'italic'
                }}>
                  Hai bisogno di alloggio?
                </label>
                <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1, fontSize: '1rem', fontStyle: 'italic' }}>
                    <input
                      type="radio"
                      name="needs_accommodation"
                      value="yes"
                      defaultChecked={guest.needs_accommodation === true}
                      style={{ marginRight: 10, cursor: 'pointer', width: 20, height: 20 }}
                    />
                    <span style={{ color: '#2c3e50' }}>Sì</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1, fontSize: '1rem', fontStyle: 'italic' }}>
                    <input
                      type="radio"
                      name="needs_accommodation"
                      value="no"
                      defaultChecked={guest.needs_accommodation === false}
                      style={{ marginRight: 10, cursor: 'pointer', width: 20, height: 20 }}
                    />
                    <span style={{ color: '#2c3e50' }}>No</span>
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={{
                  display: 'block',
                  marginBottom: 12,
                  color: '#2c3e50',
                  fontSize: '1rem',
                  fontStyle: 'italic'
                }}>
                  Note o richieste particolari (opzionale):
                </label>
                <textarea
                  name="accommodation_notes"
                  rows={3}
                  defaultValue={guest.accommodation_notes ?? ''}
                  placeholder="Es. preferenze, numero di notti, ecc."
                  style={{ 
                    width: '100%',
                    padding: 14,
                    border: '1px solid #ddd',
                    borderRadius: 8,
                    fontSize: '1rem',
                    fontFamily: 'Georgia, serif',
                    fontStyle: 'italic',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button 
                type="submit"
                style={{ 
                  width: '100%',
                  padding: 16,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}
              >
                Salva Preferenze
              </button>
            </form>
          )}
        </section>

        {/* Plus One */}
        {guest.has_plus_one === true && (
          <section style={{ 
            background: 'white',
            borderRadius: 8,
            padding: '40px 32px',
            marginBottom: 32,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
              fontWeight: '300',
              color: '#2c3e50',
              marginBottom: 28,
              textAlign: 'center',
              letterSpacing: '0.5px',
              fontStyle: 'italic'
            }}>
              Il Tuo Accompagnatore
            </h3>
            <form method="post" action="/plus-one" style={{ maxWidth: 400, margin: '0 auto' }}>
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block',
                  marginBottom: 10,
                  color: '#2c3e50',
                  fontSize: '1rem',
                  fontStyle: 'italic'
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
                    padding: 14,
                    border: '1px solid #ddd',
                    borderRadius: 8,
                    fontSize: '1rem',
                    fontFamily: 'Georgia, serif',
                    fontStyle: 'italic'
                  }}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block',
                  marginBottom: 10,
                  color: '#2c3e50',
                  fontSize: '1rem',
                  fontStyle: 'italic'
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
                    padding: 14,
                    border: '1px solid #ddd',
                    borderRadius: 8,
                    fontSize: '1rem',
                    fontFamily: 'Georgia, serif',
                    fontStyle: 'italic'
                  }}
                />
              </div>
              <button 
                type="submit" 
                style={{ 
                  width: '100%',
                  padding: 16,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
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
          padding: '40px 32px',
          marginBottom: 32,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
            fontWeight: '300',
            color: '#2c3e50',
            marginBottom: 28,
            textAlign: 'center',
            letterSpacing: '0.5px',
            fontStyle: 'italic'
          }}>
            Allergie e Intolleranze
          </h3>
          <form method="post" action="/food-allergies" style={{ maxWidth: 500, margin: '0 auto' }}>
            <fieldset style={{ border: 'none', padding: 0 }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 16
              }}>
                {ALLERGIES.map((allergy) => (
                  <label key={allergy} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="allergies"
                      value={allergy}
                      defaultChecked={guest.food_allergies?.includes(allergy)}
                      style={{ marginRight: 10, cursor: 'pointer', width: 18, height: 18 }}
                    />
                    <span style={{ fontSize: '1rem', color: '#2c3e50', fontStyle: 'italic' }}>{allergy}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div style={{ marginTop: 28 }}>
              <label style={{
                display: 'block',
                marginBottom: 10,
                color: '#2c3e50',
                fontSize: '1rem',
                fontStyle: 'italic'
              }}>
                Altro (specificare):
              </label>
              <textarea
                name="other"
                rows={3}
                defaultValue={guest.food_allergies_other ?? ''}
                style={{ 
                  width: '100%',
                  padding: 14,
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  fontSize: '1rem',
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                  resize: 'vertical'
                }}
              />
            </div>
            <button 
              type="submit"
              style={{ 
                width: '100%',
                marginTop: 20,
                padding: 16,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: '1rem',
                cursor: 'pointer',
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}
            >
              Salva Preferenze
            </button>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '40px 20px',
        textAlign: 'center',
        marginTop: 40
      }}>
        <a 
          href="/"
          style={{
            color: '#667eea',
            textDecoration: 'none',
            fontSize: '1rem',
            fontStyle: 'italic'
          }}
        >
          ← Torna alla home
        </a>
      </footer>
    </div>
  )
}
