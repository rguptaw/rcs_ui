import React from 'react'
import { IoMdHome } from "react-icons/io";
import classNames from 'classnames'
import { Link, useLocation } from 'react-router-dom'
import { DASHBOARD_SIDEBAR_LINKS } from '../../lib/constants'

// const linkClass =
// 	'flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base'
  const linkClass='border-l-4 border-[#fc6d26]  p-3 cursor-pointer border-t-2 border-t-white mb-2'
  const logoClass="text-white"
function Sidebar() {
  const { pathname } = useLocation();
  const isRootPath = location.pathname === '/';
  return (
    <div 
    className="flex  bg-[#053868]  border-gray-300 shadow-inner flex-col "
    style={{ 
      // height: 'calc(100vh - 78px)', 
      boxShadow: 'inset -10px 0 10px -10px rgba(0, 0, 0, 0.1)' 
    }}
    
  > 
    {!isRootPath && DASHBOARD_SIDEBAR_LINKS.map((link) => (
					<SidebarLink key={link.key} link={link} />
				))} 
  </div>
  )
}



function SidebarLink({ link }) {
  const { pathname } = useLocation();
  

  return (
    <Link
      to={link.path}
      className={classNames(
        'group border-l-4 p-3 cursor-pointer mb-2',
        pathname === link.path ? 'bg-[#d3d3d31a] text-white border-[#fc6d26]' : 'text-neutral-400 border-transparent',
        linkClass
      )}
    >
      <span
        className={classNames(
          'text-2xl',
          pathname === link.path ? 'text-[#fc6d26]' : 'text-current group-hover:text-[#fc6d26]', 
          logoClass
        )}
        style={{ color: pathname === link.path ? '#fc6d26' : 'white' }}
      >
        {link.icon}
      </span>
    </Link>
  );
}




export default Sidebar