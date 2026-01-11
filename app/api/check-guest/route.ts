import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email richiesta' }, { status: 400 })
    }

    const supabase = createClient()
    
    const { data: guest, error } = await supabase
      .from('guests')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single()

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
