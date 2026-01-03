import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) {
    return redirect('/login')
  }

  try {
    const formData = await request.formData()
    const needsAccommodation = formData.get('needs_accommodation') === 'yes'
    const accommodationNotes = formData.get('accommodation_notes') as string

    const { error } = await supabase
      .from('guests')
      .update({
        needs_accommodation: needsAccommodation,
        accommodation_notes: accommodationNotes || null
      })
      .eq('user_id', user.id)

    if (error) {
      console.error('Update error:', error)
      return redirect('/dashboard?error=update_failed')
    }

    return redirect('/dashboard?success=accommodation_saved')
  } catch (error) {
    console.error('Unexpected error:', error)
    return redirect('/dashboard?error=unexpected')
  }
}
