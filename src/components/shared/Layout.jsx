import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Footer from './Footer'
import Header from './Header'

function Layout() {
  return (
    <div>
    <div   className='flex flex-row h-screen w-screen overflow-hidden'>

        <Header/> 
        <div className='mt-14 mb-10 flex'>
        <Sidebar/>
        <div style={{width:"100%"}}>{<Outlet/>}</div>
        </div>
        
    </div>
    <Footer/>
    </div>
  )
}

export default Layout