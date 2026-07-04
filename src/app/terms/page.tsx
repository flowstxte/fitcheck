import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
}

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 640, margin: '4rem auto', padding: '0 1.5rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
      <h1 className="font-serif" style={{ fontSize: '2rem', color: '#fff', marginBottom: '1.5rem' }}>
        Terms of Service
      </h1>
      <p style={{ marginBottom: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
        Last updated: July 2026
      </p>

      <p style={{ marginBottom: '1.25rem' }}>
        FitCheck provides an AI-powered outfit rating tool. By using FitCheck, you agree to the following terms.
      </p>

      <h2 style={{ color: '#fff', fontSize: '1.1rem', marginTop: '2rem', marginBottom: '0.75rem' }}>1. The Service</h2>
      <p style={{ marginBottom: '1.25rem' }}>
        FitCheck lets you upload photos of your outfit and receive an AI-generated rating and styling feedback.
        Guests get a limited number of free checks; registered users get a limited number of checks per day.
        Ratings and feedback are generated automatically by an AI model and are for entertainment and general
        styling guidance only — not professional styling, medical, or any other advice.
      </p>

      <h2 style={{ color: '#fff', fontSize: '1.1rem', marginTop: '2rem', marginBottom: '0.75rem' }}>2. Your Content</h2>
      <p style={{ marginBottom: '1.25rem' }}>
        You retain ownership of any photo you upload. By uploading a photo, you confirm you have the right to
        share it and grant us a limited license to process and store it as needed to provide the service
        (e.g. sending it to our AI provider for analysis, storing it if you are logged in so you can view your history).
      </p>
      <p style={{ marginBottom: '1.25rem' }}>
        Do not upload photos of anyone without their consent, photos of minors, or any illegal, harmful, or
        infringing content. We reserve the right to remove content or suspend accounts that violate this.
      </p>

      <h2 style={{ color: '#fff', fontSize: '1.1rem', marginTop: '2rem', marginBottom: '0.75rem' }}>3. No Warranty</h2>
      <p style={{ marginBottom: '1.25rem' }}>
        AI-generated ratings may be inaccurate, inconsistent, or reflect biases
        inherent to the underlying model. We make no guarantees about accuracy, availability, or fitness for
        any particular purpose.
      </p>

      <h2 style={{ color: '#fff', fontSize: '1.1rem', marginTop: '2rem', marginBottom: '0.75rem' }}>4. Changes</h2>
      <p style={{ marginBottom: '1.25rem' }}>
        We may update these terms as the service evolves. Continued use after changes means you accept the
        updated terms.
      </p>

      <h2 style={{ color: '#fff', fontSize: '1.1rem', marginTop: '2rem', marginBottom: '0.75rem' }}>5. Contact</h2>
      <p>
        Questions about these terms: iitztirtha@gmail.com
      </p>
    </div>
  )
}
