import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Footer from './Footer'
import Header from './Header'
import { useNavigate ,useLocation } from 'react-router-dom'
import classNames from 'classnames'

function Layout() {
  const { pathname } = useLocation();
  const isRootPath = location.pathname === '/';
  return (
    <div>
    <div   className='flex flex-row h-screen w-screen overflow-hidden'>
        <Header/> 
        <div className='mt-14 mb-10 flex w-screen'>
        <Sidebar/>
        <div  className={classNames(
        'w-screen',
        pathname === "/" ? '' : 'overflow-auto'
      )}>{<Outlet/>}</div>
        </div>
        
    </div>
    <Footer/>
    </div>
  )
}

export default Layout