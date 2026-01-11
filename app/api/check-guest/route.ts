import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email richiesta' }, { status: 400 })
    }

    // Usa direttamente le credenziali invece del wrapper
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const normalizedEmail = email.toLowerCase().trim()
    
    const { data: guests, error } = await supabase
      .from('guests')
      .select('*')
      .ilike('email', normalizedEmail)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        found: false, 
        message: 'Errore database',
        debug: error.message 
      })
    }

    if (!guests || guests.length === 0) {
      return NextResponse.json({ 
        found: false, 
        message: 'Email non trovata nella lista invitati' 
      })
    }

    const guest = guests[0]

    return NextResponse.json({ 
      found: true, 
      guest: {
        id: guest.id,
        first_name: guest.first_name,
        last_name: guest.last_name,
        email: guest.email,
        has_plus_one: guest.has_plus_one || false,
        has_children: guest.has_children || false,
        rsvp_status: guest.rsvp_status,
        plus_one_first_name: guest.plus_one_first_name,
        plus_one_last_name: guest.plus_one_last_name,
        children_count: guest.children_count,
        needs_accommodation: guest.needs_accommodation || false,
        accommodation_notes: guest.accommodation_notes,
        allergies_notes: guest.allergies_notes,
        message_to_couple: guest.message_to_couple,
      }
    })
  } catch (error) {
    console.error('Error checking guest:', error)
    return NextResponse.json({ 
      error: 'Errore del server',
      debug: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
