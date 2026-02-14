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
    const { data: updateDat
