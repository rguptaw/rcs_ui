
import React, { Fragment } from 'react'
import { Menu, MenuButton, Popover, Transition, MenuItem, MenuItems} from '@headlessui/react'
import { HiOutlineBell, HiOutlineSearch, HiOutlineChatAlt } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'

function Header() {
  return (
    <div className=" flex justify-between fixed w-full  bg-[#053868] text-white text-center p-2">
      <div className='flex items-center gap-2'>
     <div>
      <div className='text-lg'>
        WISSEN<span className='text-[#FC6D26] '>NOTIFIER</span>
      </div>
      <div className='text-[10px] justify-around'>THE NOTIFICATION EXPERT</div>
      </div>
      <img src="https://res.cloudinary.com/ddskymhg2/image/upload/v1716362838/WissenNotifier/hsj6srlrpcky1wzl7yus.png" alt=""  className=' h-8 items-center'/>
      </div>
      <Menu as="div" className="relative">
					<div>
						<MenuButton className="ml-2 bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400">
							<span className="sr-only">Open user menu</span>
							<div
								className="h-10 w-10 rounded-full bg-sky-500 bg-cover bg-no-repeat bg-center"
								style={{ backgroundImage: 'url("https://source.unsplash.com/80x80?face")' }}
							>
								<span className="sr-only">Marc Backes</span>
							</div>
						</MenuButton>
					</div>
					<Transition
						as={Fragment}
						enter="transition ease-out duration-100"
						enterFrom="transform opacity-0 scale-95"
						enterTo="transform opacity-100 scale-100"
						leave="transition ease-in duration-75"
						leaveFrom="transform opacity-100 scale-100"
						leaveTo="transform opacity-0 scale-95"
					>
						<MenuItems className="origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-sm shadow-md p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
							<MenuItem>
								
									<div
										onClick={() => navigate('/')}
										// className={classNames(
										// 	active && 'bg-gray-100',
										// 	'active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200'
										// )}
										className='text-black'
									>
										Signout
									</div>
							
							</MenuItem> 
						</MenuItems>
					</Transition>
				</Menu>
    </div>
  )
}

export default Header