import Link from 'next/link'

export default function HomePage() {
  return (
    <main style={{ padding: 40 }}>
      <h1>💍 Matrimonio a Villa delle Bisce</h1>
      <p>29 Agosto 2026</p>

      <div style={{ marginTop: 24 }}>
        <Link href="/login">
          <button>Accedi</button>
        </Link>
      </div>

      <div style={{ marginTop: 16 }}>
        <Link href="/select-guest">
          <button>Seleziona invitato (test)</button>
        </Link>
      </div>
    </main>
  )
}
