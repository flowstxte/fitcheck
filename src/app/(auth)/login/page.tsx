import AuthForm from '@/components/auth/AuthForm'

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your FitCheck account to view your outfit history and ratings.',
}

export default function LoginPage() {
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
      <AuthForm mode="login" />
    </main>
  )
}
