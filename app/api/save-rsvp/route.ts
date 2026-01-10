import { createClient } from '@/lib/supabase/server'
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

    const supabase = createClient()

    // Verifica che il guest esista
    const { data: existingGuest } = await supabase
      .from('guests')
      .select('id, has_plus_one, has_children')
      .eq('email', email.toLowerCase())
      .single()

    if (!existingGuest) {
      return NextResponse.json({ 
        error: 'Guest non trovato' 
      }, { status: 404 })
    }

    // Prepara i dati da aggiornare
    const updateData: any = {
      rsvp_status,
      rsvp_submitted_at: new Date().toISOString(),
      allergies_notes: allergies_notes || null,
      message_to_couple: message_to_couple || null,
    }

    // Aggiungi plus one solo se abilitato
    if (existingGuest.has_plus_one) {
      updateData.plus_one_first_name = plus_one_first_name || null
      updateData.plus_one_last_name = plus_one_last_name || null
    }

    // Aggiungi bambini solo se abilitato
    if (existingGuest.has_children) {
      updateData.children_count = children_count || 0
    }

    // Aggiungi alloggio
    updateData.needs_accommodation = needs_accommodation || false
    updateData.accommodation_notes = accommodation_notes || null

    // Aggiorna il database
    const { error: updateError } = await supabase
      .from('guests')
      .update(updateData)
      .eq('email', email.toLowerCase())

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
