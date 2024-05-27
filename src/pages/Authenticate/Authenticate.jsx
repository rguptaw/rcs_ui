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
import { useState , useEffect } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function Authenticate() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');
    
    if (token) {
      // Redirect to /jobs endpoint if token exists
      console.log("redirected");
      navigate('/create/job'); 
    } else {
      // Otherwise, display login failed message
      console.log('Login failed');
    }
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.includes('@')) {
      setError('Invalid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setError('');
    // Handle form submission
    console.log('Email:', email);
    console.log('Password:', password);

    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        email,
        password
      });
      console.log('Response:', response.data);
      const token = response.data.token; // Assuming your API returns the token in the response
      Cookies.set('token', token, { expires: 7, secure: true });
      navigate('/create/job'); 
    } catch (error) {
      console.error('Error:', error);
      setError('Login failed. Please check your credentials and try again.');
    }
  };

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
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form className='w-11/12' onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
              Email
            </label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
              Password
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='shadow appearance-none bo  rder rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              required
            />
          </div>
          <div className='flex items-center justify-between'>
            <button
              type='submit'
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            >
              Sign In
            </button>
          </div>
        </form>
        <div className='mt-4'>
          <Link to='/signup' className='text-blue-500 hover:underline'>
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Authenticate;
