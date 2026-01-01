import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboardClient from './AdminDashboardClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Verify admin
  const { data: admin } = await supabase
    .from('guests')
    .select('role')
    .eq('user_id', user.id)
    .single()
  
  if (!admin || admin.role !== 'admin') {
    redirect('/dashboard')
  }
  
  // Fetch all guests
  const { data: guests } = await supabase
    .from('guests')
    .select('*')
    .order('last_name', { ascending: true })
  
  return <AdminDashboardClient guests={guests || []} />
}
