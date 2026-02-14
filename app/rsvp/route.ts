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
    
    // Update by EMAIL instead of user_id, and also set user_id
    const { error: updateError } = await supabase
      .from('guests')
      .update({
        rsvp_status: status,
        user_id: user.id  // Also populate user_id for future use
      })
      .eq('email', user.email)  // Match by email instead
    
    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.redirect(new URL('/dashboard?error=update_failed', req.url))
    }
    
    console.log('RSVP updated successfully for user:', user.email, 'Status:', status)
    return NextResponse.redirect(new URL('/dashboard?success=rsvp_saved', req.url))
    
  } catch (error) {
    console.error('Unexpected error in RSVP route:', error)
    return NextResponse.redirect(new URL('/dashboard?error=unexpected', req.url))
  }
}
