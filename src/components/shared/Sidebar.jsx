import React from 'react'
import { IoMdHome } from "react-icons/io";
function Sidebar() {
  return (
    <div 
    className="flex justify-between items-center bg-[#053868]  border-gray-300 shadow-inner flex-col"
    style={{ 
      // height: 'calc(100vh - 78px)', 
      boxShadow: 'inset -10px 0 10px -10px rgba(0, 0, 0, 0.1)' 
    }}
  >
    <div className="border-l-4 border-[#fc6d26] bg-[hsla(0,0%,82.7%,0.1)] p-3 cursor-pointer">
      <IoMdHome className="text-[#fc6d26] text-2xl" />
    </div>
  </div>
  )
}

export default Sidebar