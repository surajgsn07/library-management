import React, { useEffect } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'
import { getCookie, removeCookie } from './axiosConfig/cookieFunc'
import axiosInstance from './axiosConfig/axiosConfig'
import { login } from './store/authSlice'


const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user);
  console.log({user})
  const fetchUser = async()=>{
    const token = getCookie('accessToken');
    if(!token){
      return;
    }

    const type = getCookie('type');
    try {
      const response = await axiosInstance(`${type}/user`);
      if(response.data){
        const user = response.data.user;
        dispatch(login({ user, type }));
      }else{
        removeCookie('accessToken');
        removeCookie('type');
      }
    } catch (error) {
      console.log("error : ",error);
      removeCookie('accessToken');
      removeCookie('type');
    }
  }


  
  const type = useSelector((state) => state.auth.type);
  console.log({user, type})

  useEffect(() => {
    fetchUser();
  }, [])
  
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