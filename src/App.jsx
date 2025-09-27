import React from 'react'
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Testimonials from './components/Testimonials'
import HowItWorks from './components/HowItWorks'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'


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
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App