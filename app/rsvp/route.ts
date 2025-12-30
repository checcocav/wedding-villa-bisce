import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const formData = await req.formData()
  const status = formData.get('status')

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  await supabase
    .from('guests')
    .update({ rsvp_status: status })
    .eq('id', user.id)

  return NextResponse.redirect(new URL('/dashboard', req.url))
}
