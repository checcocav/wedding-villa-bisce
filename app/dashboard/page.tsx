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
  
  // Verifica la sessione
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  console.log('Session:', session)
  console.log('Session error:', sessionError)
  
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()
  
  console.log('User:', user)
  console.log('User error:', userError)
  
  if (!user) {
    return <p>Non autenticato</p>
  }

  const { data: guest, error: guestError } = await supabase
    .from('guests')
    .select('*')
    .eq('id', user.id)
    .single()

  console.log('Guest error:', guestError)
  console.log('Guest data:', guest)
  console.log('Has plus one:', guest?.has_plus_one)

  if (!guest) {
    return (
      <div>
        <p>Non risulti tra gli invitati.</p>
        <p>Email: {user.email}</p>
        {guestError && <p>Errore: {JSON.stringify(guestError)}</p>}
      </div>
    )
  }

  return (
    <main style={{ padding: 32 }}>
      {/* Success Messages */}
      {searchParams.success === 'allergies_saved' && (
        <div style={{ 
          padding: 12, 
          marginBottom: 16, 
          background: '#d4edda', 
          color: '#155724', 
          borderRadius: 4,
          border: '1px solid #c3e6cb'
        }}>
          ✅ Allergie salvate con successo!
        </div>
      )}
      
      {searchParams.success === 'plus_one_saved' && (
        <div style={{ 
          padding: 12, 
          marginBottom: 16, 
          background: '#d4edda', 
          color: '#155724', 
          borderRadius: 4,
          border: '1px solid #c3e6cb'
        }}>
          ✅ Accompagnatore salvato con successo!
        </div>
      )}
      
      {searchParams.success === 'rsvp_saved' && (
        <div style={{ 
          padding: 12, 
          marginBottom: 16, 
          background: '#d4edda', 
          color: '#155724', 
          borderRadius: 4,
          border: '1px solid #c3e6cb'
        }}>
          ✅ RSVP aggiornato con successo!
        </div>
      )}

      {/* Error Messages */}
      {searchParams.error === 'update_failed' && (
        <div style={{ 
          padding: 12, 
          marginBottom: 16, 
          background: '#f8d7da', 
          color: '#721c24', 
          borderRadius: 4,
          border: '1px solid #f5c6cb'
        }}>
          ❌ Errore nel salvataggio. Riprova.
        </div>
      )}
      
      {searchParams.error === 'unexpected' && (
        <div style={{ 
          padding: 12, 
          marginBottom: 16, 
          background: '#f8d7da', 
          color: '#721c24', 
          borderRadius: 4,
          border: '1px solid #f5c6cb'
        }}>
          ❌ Errore imprevisto. Riprova più tardi.
        </div>
      )}

      {searchParams.error === 'missing_fields' && (
        <div style={{ 
          padding: 12, 
          marginBottom: 16, 
          background: '#f8d7da', 
          color: '#721c24', 
          borderRadius: 4,
          border: '1px solid #f5c6cb'
        }}>
          ❌ Compila tutti i campi obbligatori.
        </div>
      )}

      {searchParams.error === 'invalid_status' && (
        <div style={{ 
          padding: 12, 
          marginBottom: 16, 
          background: '#f8d7da', 
          color: '#721c24', 
          borderRadius: 4,
          border: '1px solid #f5c6cb'
        }}>
          ❌ Stato RSVP non valido.
        </div>
      )}

      <h1>
        Benvenuto {guest.first_name} {guest.last_name}
      </h1>
      <p>
        📅 <strong>29 Agosto 2026</strong>
      </p>
      <p>
        📍 <strong>Villa delle Bisce</strong>
      </p>
      <p>
        Stato RSVP: <strong>{guest.rsvp_status || 'pending'}</strong>
      </p>
      
      <form method="post" action="/rsvp">
        <button name="status" value="yes" style={{ padding: 8, marginRight: 8 }}>
          Confermo la presenza
        </button>
        <button name="status" value="no" style={{ padding: 8 }}>
          Non partecipo
        </button>
      </form>

      {/* Photo Upload Link */}
      <div style={{ marginTop: 16 }}>
        <a 
          href="/photos" 
          style={{
            display: 'inline-block',
            padding: 12,
            background: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 4,
            fontWeight: 'bold'
          }}
        >
          📷 Carica foto del matrimonio
        </a>
      </div>

      {guest.has_plus_one === true && (
        <section style={{ 
          marginTop: 32, 
          padding: 16, 
          border: '1px solid #ccc', 
          borderRadius: 8,
          background: '#f9f9f9'
        }}>
          <h2>Il tuo accompagnatore</h2>
          <form method="post" action="/plus-one" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="text"
              name="first_name"
              placeholder="Nome"
              defaultValue={guest.plus_one_first_name || ''}
              required
              style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
            <input
              type="text"
              name="last_name"
              placeholder="Cognome"
              defaultValue={guest.plus_one_last_name || ''}
              required
              style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
            <button type="submit" style={{ padding: 8, borderRadius: 4 }}>
              Salva accompagnatore
            </button>
          </form>
        </section>
      )}

      <section style={{ 
        marginTop: 32, 
        padding: 16, 
        border: '1px solid #ccc', 
        borderRadius: 8,
        background: '#f9f9f9'
      }}>
        <h2>Allergie e intolleranze alimentari</h2>
        <form method="post" action="/food-allergies">
          <fieldset style={{ border: 'none', padding: 0 }}>
            {ALLERGIES.map((allergy) => (
              <label key={allergy} style={{ display: 'block', marginBottom: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="allergies"
                  value={allergy}
                  defaultChecked={guest.food_allergies?.includes(allergy)}
                  style={{ marginRight: 8 }}
                />{' '}
                {allergy}
              </label>
            ))}
          </fieldset>
          <div style={{ marginTop: 16 }}>
            <label>
              Altro (specificare):
              <br />
              <textarea
                name="other"
                rows={3}
                defaultValue={guest.food_allergies_other ?? ''}
                style={{ 
                  width: '100%', 
                  padding: 8, 
                  marginTop: 8, 
                  borderRadius: 4, 
                  border: '1px solid #ccc',
                  fontFamily: 'inherit'
                }}
              />
            </label>
          </div>
          <button style={{ marginTop: 16, padding: 8, borderRadius: 4 }} type="submit">
            Salva
          </button>
        </form>
      </section>

      {/* Debug info - remove after testing */}
      <div style={{ marginTop: 32, padding: 16, background: '#f0f0f0', fontSize: 12, borderRadius: 4 }}>
        <p><strong>Debug info:</strong></p>
        <p>has_plus_one = {JSON.stringify(guest.has_plus_one)}</p>
        <p>food_allergies = {JSON.stringify(guest.food_allergies)}</p>
        <p>rsvp_status = {JSON.stringify(guest.rsvp_status)}</p>
      </div>
    </main>
  )
}
