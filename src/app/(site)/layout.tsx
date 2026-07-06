import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import MessengerWidgets from '@/components/MessengerWidgets'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <Footer />
      <FloatingCTA />
      <MessengerWidgets />
    </>
  )
}
