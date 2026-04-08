import Hero from '@/components/Hero'
import Trust from '@/components/Trust'
import Services from '@/components/Services'
import Pricing from '@/components/Pricing'
import Process from '@/components/Process'
import Reviews from '@/components/Reviews'
import Promos from '@/components/Promos'
import FAQ from '@/components/FAQ'
import About from '@/components/About'
import Contacts from '@/components/Contacts'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import LogoDivider from '@/components/LogoDivider'

export default function Home() {
  return (
    <>
      <Hero />
      <Trust />
      <Services />
      <Pricing />
      <LogoDivider />
      <Reviews />
      <Promos />
      <FAQ />
      <About />
      <Contacts />
      <Footer />
      <FloatingCTA />
    </>
  )
}
