import React from 'react'
import LandingPage from './components/LandingPae'
import Login from './components/student/Auth/Login'
import Register from './components/student/Auth/Register'
import AdminRegister from './components/admin/AdminRegister'
import AdminLogin from './components/admin/AdminLogin'
import AdminSidebar from './components/admin/dashboard/Sidebar'
import StudentSidebar from './components/student/dashboard/Sidebar'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'


import { ToastContainer } from 'react-toastify';


const App = () => {
  return (
    <div>
      <ToastContainer />
      <Header/>
      <Outlet/>
      <Footer/>
      
    </div>
  )
}

export default App