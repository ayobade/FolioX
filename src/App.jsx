import React from 'react'
import './App.css'
import Header from './components/header'
import Hero from './components/hero'
import Testimonials from './components/testimonials'
import HowItWorks from './components/howItWorks'
import Newsletter from './components/newsletter'
import Footer from './components/footer'


function App() {
  return (
    <div className='App'>
      <Header />
      <Hero />
      <HowItWorks />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default App