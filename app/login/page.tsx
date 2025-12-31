import LoginClient from './LoginClient'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px'
    }}>
      <LoginClient />
    </main>
  )
}
