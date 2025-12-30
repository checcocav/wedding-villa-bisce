import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const firstName = formData.get('first_name') as string
    const lastName = formData.get('last_name') as string
    
    // Validate required fields
    if (!firstName || !lastName) {
      console.error('Missing required fields')
      return NextResponse.redirect(new URL('/dashboard?error=missing_fields', req.url))
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
    
    const { error: updateError } = await supabase
      .from('guests')
      .update({
        plus_one_first_name: firstName.trim(),
        plus_one_last_name: lastName.trim(),
      })
      .eq('id', user.id)
    
    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.redirect(new URL('/dashboard?error=update_failed', req.url))
    }
    
    console.log('Plus one updated successfully for user:', user.id)
    return NextResponse.redirect(new URL('/dashboard?success=plus_one_saved', req.url))
    
  } catch (error) {
    console.error('Unexpected error in plus-one route:', error)
    return NextResponse.redirect(new URL('/dashboard?error=unexpected', req.url))
  }
}
