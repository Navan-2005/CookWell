import React from 'react'
import Navbar from './landingpage/components/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './landingpage/components/Footer'
import Landing from './landingpage/Home'
import LandingPage from './LandingPage'

export const Layout = () => {
  return (
    <div>
        <Navbar/>
        <Landing/>
        <Footer/>
    </div>
  )
}
