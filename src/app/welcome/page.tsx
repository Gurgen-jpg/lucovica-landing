import type { Metadata } from 'next'
import { Suspense } from 'react'
import WelcomeForm from './WelcomeForm'

export const metadata: Metadata = {
  title: 'Добро пожаловать — LUCOVICA',
  robots: { index: false, follow: false },
}

export default function WelcomePage() {
  return (
    <Suspense>
      <WelcomeForm />
    </Suspense>
  )
}
