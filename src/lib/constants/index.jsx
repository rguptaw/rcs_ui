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
		label: 'createjobs',
		path: '/create/job',
		icon: <IoMdHome />
	},
	{
		key: 'jobs',
		label: 'Jobs',
		path: '/jobs',
		icon: <HiOutlineCube />
	},
	{
		key: 'participants',
		label: 'Participants',
		path: '/participants',
		icon: <HiOutlineShoppingCart />
	},
	{
		key: 'meetings',
		label: 'Meetings',
		path: '/meetings',
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