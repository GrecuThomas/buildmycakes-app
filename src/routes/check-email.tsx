import { createFileRoute } from '@tanstack/react-router'
import { MailCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

export const Route = createFileRoute('/check-email')({
  component: CheckEmailPage,
})

function CheckEmailPage() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const value = params.get('email')
    setEmail(value)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-sans text-slate-900 flex flex-col">
      <Navigation tab="Sign Up" />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-2xl">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-8 sm:p-10 text-center">
            <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <MailCheck className="w-7 h-7" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-4">Check Your Email</h1>
            <p className="text-slate-700 leading-relaxed text-base sm:text-lg">
              You should receive an activation email on {email ? `${email}` : 'your email address'} shortly. Please go ahead and activate your
              account to be able to log in. You can safely close this page now, as you will be redirected to the log in
              section from the activation email.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
