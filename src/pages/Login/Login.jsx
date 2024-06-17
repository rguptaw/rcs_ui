import { useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen bg-[#053868] flex justify-between">
      <div className='pl-4 flex flex-col justify-center gap-5 '>
      <div className='text-5xl text-white'>Lead the Notification As an expert</div>
      
      <div className='flex flex-row gap-5'>
      <div onClick={()=>navigate("/authenticate")} className='p-1 px-3 w-4/12 bg-[#fc6d26] text-white rounded-md flex justify-center cursor-pointer'>Sign In</div>
      <div onClick={()=>navigate("/signup")} className='p-1 px-3 w-4/12 bg-[#fc6d26] text-white rounded-md flex justify-center cursor-pointer'>Sign Up</div>
      </div>
      </div>
      <img src="https://res.cloudinary.com/ddskymhg2/image/upload/v1716180029/WissenNotifier/pams700amrxkages3dzt.png" alt="" className='w-4/12 h-4/5 items-center'  />
      
      </div>
  )
}

export default Login