import React from 'react'
import './App.css'
import Header from './components/header'
import Hero from './components/hero'
import Testimonials from './components/testimonials'
import HowItWorks from './components/howItWorks'
import Newsletter from './components/newsletter'
import Footer from './components/footer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/login'
import Signup from './components/signup'

function Home() {
  return (
    <>
      <Header />
      <Hero />
      <HowItWorks />
      <Testimonials />
      <Newsletter />
      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App