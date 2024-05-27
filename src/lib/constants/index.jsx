import {
	HiOutlineCube,
	HiOutlineShoppingCart,
	HiOutlineUsers,
	HiOutlineDocumentText,
	HiOutlineAnnotation
} from 'react-icons/hi'
import { IoMdHome } from "react-icons/io";
import { GrGroup } from "react-icons/gr";
import { MdUploadFile } from "react-icons/md";
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
		icon: <GrGroup />
	},
	{
		key: 'bulkupload',
		label: 'BulkUpload',
		path: '/bulkupload',
		icon: <MdUploadFile />
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