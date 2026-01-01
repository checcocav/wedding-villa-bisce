'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

type Guest = {
  id: string
  first_name: string
  last_name: string
  email: string
  rsvp_status: string | null
  has_plus_one: boolean
  plus_one_first_name: string | null
  plus_one_last_name: string | null
  food_allergies: string[] | null
  food_allergies_other: string | null
  role: string
}

export default function AdminDashboardClient({ guests: initialGuests }: { guests: Guest[] }) {
  const [guests, setGuests] = useState(initialGuests)
  const [filter, setFilter] = useState<'all' | 'yes' | 'no' | 'pending'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const supabase = createClient()

  const filteredGuests = guests.filter(guest => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'yes' && guest.rsvp_status === 'yes') ||
      (filter === 'no' && guest.rsvp_status === 'no') ||
      (filter === 'pending' && (guest.rsvp_status === 'pending' || !guest.rsvp_status))

    const matchesSearch =
      searchTerm === '' ||
      guest.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const stats = {
    total: guests.length,
    confirmed: guests.filter(g => g.rsvp_status === 'yes').length,
    declined: guests.filter(g => g.rsvp_status === 'no').length,
    pending: guests.filter(g => !g.rsvp_status || g.rsvp_status === 'pending').length,
    withPlusOne: guests.filter(g => g.has_plus_one).length,
  }

  const togglePlusOne = async (guestId: string, currentValue: boolean) => {
    const { error } = await supabase
      .from('guests')
      .update({ has_plus_one: !currentValue })
      .eq('id', guestId)

    if (!error) {
      setGuests(prev =>
        prev.map(g => (g.id === guestId ? { ...g, has_plus_one: !currentValue } : g))
      )
    } else {
      alert('Errore nell\'aggiornamento')
    }
  }

  return (
    <div>
      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 32
      }}>
        <div style={{
          background: 'white',
          padding: 24,
          borderRadius: 8,
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>👥</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>Totale Invitati</div>
        </div>

        <div style={{
          background: 'white',
          padding: 24,
          borderRadius: 8,
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>✅</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
            {stats.confirmed}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>Confermati</div>
        </div>

        <div style={{
          background: 'white',
          padding: 24,
          borderRadius: 8,
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>❌</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc3545' }}>
            {stats.declined}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>Non Partecipano</div>
        </div>

        <div style={{
          background: 'white',
          padding: 24,
          borderRadius: 8,
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>⏳</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>
            {stats.pending}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>In Attesa</div>
        </div>

        <div style={{
          background: 'white',
          padding: 24,
          borderRadius: 8,
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>➕</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
            {stats.withPlusOne}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>Con +1</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: 'white',
        padding: 24,
        borderRadius: 8,
        marginBottom: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="🔍 Cerca per nome o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              fontSize: '1rem',
              border: '1px solid #ddd',
              borderRadius: 4,
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(['all', 'yes', 'no', 'pending'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                background: filter === f ? '#667eea' : 'white',
                color: filter === f ? 'white' : '#2c3e50',
                border: `1px solid ${filter === f ? '#667eea' : '#ddd'}`,
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontFamily: 'inherit'
              }}
            >
              {f === 'all' ? '🌐 Tutti' :
               f === 'yes' ? '✅ Confermati' :
               f === 'no' ? '❌ Non Partecipano' :
               '⏳ In Attesa'}
            </button>
          ))}
        </div>
      </div>

      {/* Guests Table */}
      <div style={{
        background: 'white',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.9rem'
          }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e0e0e0' }}>
                <th style={{ padding: 12, textAlign: 'left', fontWeight: '600' }}>Nome</th>
                <th style={{ padding: 12, textAlign: 'left', fontWeight: '600' }}>Email</th>
                <th style={{ padding: 12, textAlign: 'center', fontWeight: '600' }}>RSVP</th>
                <th style={{ padding: 12, textAlign: 'center', fontWeight: '600' }}>+1</th>
                <th style={{ padding: 12, textAlign: 'left', fontWeight: '600' }}>Accompagnatore</th>
                <th style={{ padding: 12, textAlign: 'left', fontWeight: '600' }}>Allergie</th>
                <th style={{ padding: 12, textAlign: 'center', fontWeight: '600' }}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map((guest, index) => (
                <tr
                  key={guest.id}
                  style={{
                    borderBottom: '1px solid #e0e0e0',
                    background: index % 2 === 0 ? 'white' : '#f9f9f9'
                  }}
                >
                  <td style={{ padding: 12 }}>
                    <strong>{guest.first_name} {guest.last_name}</strong>
                    {guest.role === 'admin' && (
                      <span style={{
                        marginLeft: 8,
                        padding: '2px 8px',
                        background: '#667eea',
                        color: 'white',
                        fontSize: '0.75rem',
                        borderRadius: 4
                      }}>
                        ADMIN
                      </span>
                    )}
                  </td>
                  <td style={{ padding: 12, color: '#666' }}>{guest.email}</td>
                  <td style={{ padding: 12, textAlign: 'center' }}>
                    {guest.rsvp_status === 'yes' ? '✅' :
                     guest.rsvp_status === 'no' ? '❌' :
                     '⏳'}
                  </td>
                  <td style={{ padding: 12, textAlign: 'center' }}>
                    {guest.has_plus_one ? '✅' : '—'}
                  </td>
                  <td style={{ padding: 12, color: '#666' }}>
                    {guest.plus_one_first_name && guest.plus_one_last_name
                      ? `${guest.plus_one_first_name} ${guest.plus_one_last_name}`
                      : '—'}
                  </td>
                  <td style={{ padding: 12, color: '#666', fontSize: '0.85rem' }}>
                    {guest.food_allergies && guest.food_allergies.length > 0
                      ? guest.food_allergies.join(', ')
                      : '—'}
                    {guest.food_allergies_other && (
                      <div style={{ fontStyle: 'italic', marginTop: 4 }}>
                        Altro: {guest.food_allergies_other}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: 12, textAlign: 'center' }}>
                    <button
                      onClick={() => togglePlusOne(guest.id, guest.has_plus_one)}
                      style={{
                        padding: '6px 12px',
                        background: guest.has_plus_one ? '#dc3545' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontFamily: 'inherit'
                      }}
                    >
                      {guest.has_plus_one ? 'Rimuovi +1' : 'Abilita +1'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredGuests.length === 0 && (
          <div style={{
            padding: 40,
            textAlign: 'center',
            color: '#999'
          }}>
            Nessun invitato trovato
          </div>
        )}
      </div>
    </div>
  )
}
