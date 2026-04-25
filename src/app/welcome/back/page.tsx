import type { Metadata } from 'next'
import { Suspense } from 'react'
import BackForm from './BackForm'

export const metadata: Metadata = {
  title: 'С возвращением — LUCOVICA',
  robots: { index: false, follow: false },
}

export default function WelcomeBackPage() {
  return (
    <Suspense>
      <BackForm />
    </Suspense>
  )
}
