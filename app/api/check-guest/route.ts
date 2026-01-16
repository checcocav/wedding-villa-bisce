import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email richiesta' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const normalizedEmail = email.toLowerCase().trim()
    
    const { data: guest, error } = await supabase
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
      .ilike('email', normalizedEmail)
      .single()

    if (error || !guest) {
      console.error('Supabase error:', error)
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
        assigned_accommodation_id: guest.assigned_accommodation_id,
        accommodations: Array.isArray(guest.accommodations) ? guest.accommodations[0] : guest.accommodations
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
