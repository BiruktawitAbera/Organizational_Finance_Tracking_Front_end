import React from 'react'

import { TopHeader } from '@/components/landing-page/header'
import Hero from '@/components/landing-page/Hero'
import Nav from '@/components/landing-page/nav'
import Deals from '@/components/landing-page/Deals'
import Testimonials from '@/components/landing-page/Testimonials'
import Footer from '@/components/landing-page/Footer'


function HomePage() {
  return (
    <>
      <TopHeader />
      <Nav />
      <Hero />
      <Deals />
      <Testimonials />
      <Footer />
    </>
  )
}

export default HomePage