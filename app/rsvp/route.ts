import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const status = formData.get('status') as string
    
    // Validate status
    if (status !== 'yes' && status !== 'no') {
      console.error('Invalid RSVP status:', status)
      return NextResponse.redirect(new URL('/dashboard?error=invalid_status', req.url))
    }
    
    const supabase = createClient()
    
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('Authentication error:', userError)
      return NextResponse.redirect(new URL('/login', req.url))
    }
    
    console.log('=== RSVP UPDATE DEBUG ===')
    console.log('User ID:', user.id)
    console.log('User email:', user.email)
    console.log('New status:', status)
    
    // First, check if guest exists with this email
    const { data: existingGuest, error: checkError } = await supabase
      .from('guests')
      .select('id, email, user_id, rsvp_status')
      .eq('email', user.email)
      .single()
    
    console.log('Existing guest found:', existingGuest)
    console.log('Check error:', checkError)
    
    if (!existingGuest) {
      console.error('No guest found with email:', user.email)
      return NextResponse.redirect(new URL('/dashboard?error=guest_not_found', req.url))
    }
    
    // Now update with .select() to see what changed
    const { data: updateData, error: updateError } = await supabase
      .from('guests')
      .update({
        rsvp_status: status,
        user_id: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('email', user.email)
      .select()
    
    console.log('Update result:', updateData)
    console.log('Update error:', updateError)
    
    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.redirect(new URL('/dashboard?error=update_failed', req.url))
    }
    
    if (!updateData || updateData.length === 0) {
      console.error('Update succeeded but no rows affected')
      return NextResponse.redirect(new URL('/dashboard?error=no_rows_updated', req.url))
    }
    
    console.log('✅ RSVP updated successfully')
    return NextResponse.redirect(new URL('/dashboard?success=rsvp_saved', req.url))
    
  } catch (error) {
    console.error('Unexpected error in RSVP route:', error)
    return NextResponse.redirect(new URL('/dashboard?error=unexpected', req.url))
  }
}
