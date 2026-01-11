import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      email,
      rsvp_status,
      plus_one_first_name,
      plus_one_last_name,
      children_count,
      needs_accommodation,
      accommodation_notes,
      allergies_notes,
      message_to_couple,
    } = body

    if (!email || !rsvp_status) {
      return NextResponse.json({ 
        error: 'Email e stato RSVP sono obbligatori' 
      }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const normalizedEmail = email.toLowerCase().trim()

    // Verifica che il guest esista
    const { data: guests } = await supabase
      .from('guests')
      .select('id, has_plus_one, has_children')
      .ilike('email', normalizedEmail)

    if (!guests || guests.length === 0) {
      return NextResponse.json({ 
        error: 'Guest non trovato' 
      }, { status: 404 })
    }

    const existingGuest = guests[0]

    // Prepara i dati da aggiornare
    const updateData: any = {
      rsvp_status,
      rsvp_submitted_at: new Date().toISOString(),
      allergies_notes: allergies_notes || null,
      message_to_couple: message_to_couple || null,
    }

    if (existingGuest.has_plus_one) {
      updateData.plus_one_first_name = plus_one_first_name || null
      updateData.plus_one_last_name = plus_one_last_name || null
    }

    if (existingGuest.has_children) {
      updateData.children_count = children_count || 0
    }

    updateData.needs_accommodation = needs_accommodation || false
    updateData.accommodation_notes = accommodation_notes || null

    // Aggiorna il database
    const { error: updateError } = await supabase
      .from('guests')
      .update(updateData)
      .eq('id', existingGuest.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ 
        error: 'Errore durante il salvataggio' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'RSVP salvato con successo!' 
    })

  } catch (error) {
    console.error('Error saving RSVP:', error)
    return NextResponse.json({ 
      error: 'Errore del server' 
    }, { status: 500 })
  }
}
