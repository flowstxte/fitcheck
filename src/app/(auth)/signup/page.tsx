import AuthForm from '@/components/auth/AuthForm'

export const metadata = {
  title: 'Create Account',
  description: 'Create your free FitCheck account and get 5 AI outfit ratings per day.',
}

export default function SignupPage() {
  return (
    <main
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.25rem',
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <AuthForm mode="signup" />
    </main>
  )
}
