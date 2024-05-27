import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Footer from './Footer'
import Header from './Header'

function Layout() {
  return (
    <div>
    <div   className='flex flex-row h-screen w-screen overflow-hidden'>
      {/* <Header/> */}
        <Sidebar/>
        {/* <div className="bg-sky-300">Header</div> */}
        <div style={{width:"100%",height:"100%"}}>{<Outlet/>}</div>
        
    </div>
    <Footer/>
    </div>
  )
}

export default Layout