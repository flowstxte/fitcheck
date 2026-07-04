import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 640, margin: '4rem auto', padding: '0 1.5rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
      <h1 className="font-serif" style={{ fontSize: '2rem', color: '#fff', marginBottom: '1.5rem' }}>
        Privacy Policy
      </h1>
      <p style={{ marginBottom: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
        Last updated: July 2026
      </p>

      <p style={{ marginBottom: '1.25rem' }}>
        This policy explains what data FitCheck collects and how it is used.
      </p>

      <h2 style={{ color: '#fff', fontSize: '1.1rem', marginTop: '2rem', marginBottom: '0.75rem' }}>What we collect</h2>
      <ul style={{ marginBottom: '1.25rem', paddingLeft: '1.25rem' }}>
        <li style={{ marginBottom: '0.5rem' }}>Your email address, if you create an account (via Supabase Auth)</li>
        <li style={{ marginBottom: '0.5rem' }}>Photos you upload for outfit checks, stored via Cloudinary</li>
        <li style={{ marginBottom: '0.5rem' }}>AI-generated ratings and feedback tied to your account, if logged in</li>
        <li style={{ marginBottom: '0.5rem' }}>Basic usage data (e.g. daily check counts) needed to enforce free-tier limits</li>
      </ul>

      <h2 style={{ color: '#fff', fontSize: '1.1rem', marginTop: '2rem', marginBottom: '0.75rem' }}>How we use it</h2>
      <p style={{ marginBottom: '1.25rem' }}>
        Uploaded photos are sent to Gemini API for analysis and stored via Cloudinary so results can be
        displayed and, if you are logged in, saved to your history. We do not sell your data or share it with
        advertisers.
      </p>

      <h2 style={{ color: '#fff', fontSize: '1.1rem', marginTop: '2rem', marginBottom: '0.75rem' }}>Third parties</h2>
      <p style={{ marginBottom: '1.25rem' }}>
        We use Supabase (authentication & database), Cloudinary (image hosting), and Google Gemini (AI analysis).
        Each processes data under their own privacy terms as sub-processors of this service.
      </p>

      <h2 style={{ color: '#fff', fontSize: '1.1rem', marginTop: '2rem', marginBottom: '0.75rem' }}>Guest usage</h2>
      <p style={{ marginBottom: '1.25rem' }}>
        If you use FitCheck without an account, your photo is analyzed but not saved to any history — we only
        store a small anonymous cookie to track your free-check count.
      </p>

      <h2 style={{ color: '#fff', fontSize: '1.1rem', marginTop: '2rem', marginBottom: '0.75rem' }}>Your rights</h2>
      <p style={{ marginBottom: '1.25rem' }}>
        You can delete your account and associated history at any time by contacting through the email address provided. We will remove your data within a reasonable timeframe.
      </p>

      <h2 style={{ color: '#fff', fontSize: '1.1rem', marginTop: '2rem', marginBottom: '0.75rem' }}>Contact</h2>
      <p>
        Questions about this policy: iitztirtha@gmail.com
      </p>
    </div>
  )
}
