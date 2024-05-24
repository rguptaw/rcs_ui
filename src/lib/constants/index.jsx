import {
	HiOutlineViewGrid,
	HiOutlineCube,
	HiOutlineShoppingCart,
	HiOutlineUsers,
	HiOutlineDocumentText,
	HiOutlineAnnotation,
	HiOutlineQuestionMarkCircle,
	HiOutlineCog
} from 'react-icons/hi'
import { IoMdHome } from "react-icons/io";
export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'home',
		label: 'home',
		path: '/',
		icon: <IoMdHome />
	},
	{
		key: 'meetings',
		label: 'Meetings',
		path: '/meetings',
		icon: <HiOutlineCube />
	},
	{
		key: 'participants',
		label: 'Participants',
		path: '/participants',
		icon: <HiOutlineShoppingCart />
	},
	{
		key: 'jobs',
		label: 'Jobs',
		path: '/jobs',
		icon: <HiOutlineUsers />
	},
	{
		key: 'transactions',
		label: 'Transactions',
		path: '/transactions',
		icon: <HiOutlineDocumentText />
	},
	{
		key: 'messages',
		label: 'Messages',
		path: '/messages',
		icon: <HiOutlineAnnotation />
	}
]