import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const allergies = formData.getAll('allergies') as string[]
    const other = formData.get('other') as string | null
    
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
        food_allergies: allergies,
        food_allergies_other: other || null,
      })
      .eq('id', user.id)
    
    if (updateError) {
      console.error('Update error:', updateError)
      // You could redirect to an error page or back to dashboard with error param
      return NextResponse.redirect(new URL('/dashboard?error=update_failed', req.url))
    }
    
    console.log('Food allergies updated successfully for user:', user.id)
    return NextResponse.redirect(new URL('/dashboard?success=allergies_saved', req.url))
    
  } catch (error) {
    console.error('Unexpected error in food-allergies route:', error)
    return NextResponse.redirect(new URL('/dashboard?error=unexpected', req.url))
  }
}
