// import React from 'react';
// import { FaWindows } from "react-icons/fa";
// function Authenticate() {
//   return (
//     <div 
//       className="bg-cover bg-center w-screen flex flex-col items-center justify-center" 
//       style={{ backgroundImage: "url('https://res.cloudinary.com/ddskymhg2/image/upload/v1716213295/WissenNotifier/awziz45uaykysk08mnen.png')" }}
//     >
//       <div className='text-white text-3xl  '>INTERVIEW NINJA - WISSEN TECHNOLOGY</div>
//       <div className='bt-[#06] border-t-4 bg-white p-20'>
//         <div>Sign in to your Wissen account</div>
//         <hr></hr>
//         <div className=' flex flex-row justify-center items-center'>
//            <div className=''> <FaWindows/></div>
//             <div> Microsoft</div></div>
//       </div>
//     </div>
//   );
// }

// export default Authenticate;

import React from 'react';
import { FaWindows } from "react-icons/fa";

function Authenticate() {
  return (
    <div 
      className="bg-cover bg-center w-screen h-screen flex flex-col items-center justify-center font-sans" 
      style={{ backgroundImage: "url('https://res.cloudinary.com/ddskymhg2/image/upload/v1716213295/WissenNotifier/awziz45uaykysk08mnen.png')" }}
    >
      <div className='text-white text-3xl mb-8'>
        WISSEN NOTIFIER - WISSEN TECHNOLOGY
      </div>
      <div className='border-t-4 border-[#06c] bg-white px-20 py-10 flex flex-col items-center'>
        <div className='mb-4 text-2xl text-[#363636] font-light'>Sign in to your Wissen account</div>
        <div className='w-11/12'>
        <hr className='w-full mb-4'/>
        <div className='flex items-center w-full border-2 border=[rgba(230, 230, 230, 0.5)] p-2'>
          <div className='flex-grow-0'><FaWindows size={25} color='#6a6e73'/></div>
          <div className='flex-grow text-center'>Microsoft</div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Authenticate;
