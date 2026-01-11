import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email richiesta' }, { status: 400 })
    }

    const supabase = createClient()
    
    // Normalizza l'email
    const normalizedEmail = email.toLowerCase().trim()
    
    console.log('Searching for email:', normalizedEmail) // Debug log
    
    const { data: guest, error } = await supabase
      .from('guests')
      .select('*')
      .ilike('email', normalizedEmail) // Usa ilike invece di eq per case-insensitive
      .single()

    console.log('Guest found:', guest) // Debug log
    console.log('Error:', error) // Debug log

    if (error || !guest) {
      return NextResponse.json({ 
        found: false, 
        message: 'Email non trovata nella lista invitati' 
      })
    }

    return NextResponse.json({ 
      found: true, 
      guest: {
        id: guest.id,
        first_name: guest.first_name,
        last_name: guest.last_name,
        email: guest.email,
        has_plus_one: guest.has_plus_one,
        has_children: guest.has_children,
        rsvp_status: guest.rsvp_status,
        plus_one_first_name: guest.plus_one_first_name,
        plus_one_last_name: guest.plus_one_last_name,
        children_count: guest.children_count,
        needs_accommodation: guest.needs_accommodation,
        accommodation_notes: guest.accommodation_notes,
        allergies_notes: guest.allergies_notes,
        message_to_couple: guest.message_to_couple,
      }
    })
  } catch (error) {
    console.error('Error checking guest:', error)
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 })
  }
}
