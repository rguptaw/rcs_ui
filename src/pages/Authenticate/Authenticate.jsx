import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { API_URL } from "../../lib/constants/index";

function Authenticate() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);


  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      // Redirect to /jobs endpoint if token exists
      console.log("redirected");
      navigate("/create/job");
    } else {
      // Otherwise, display login failed message
      console.log("Login failed");
    }
  }, []);

  function validateAndLogin(email, password) {
    return new Promise(async (resolve, reject) => {
      try {
        setIsDisabled(true);
        if (!email.includes("@")) {
          throw new Error("Invalid email address");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }
        setError("");

        // Handle form submission
        console.log("Email:", email);
        console.log("Password:", password);

        const response = await axios.post(API_URL+"auth/login", {
          email,
          password,
        });

        console.log("Response:", response.data);
        const token = response.data.token; // Assuming your API returns the token in the response
        Cookies.set("token", token, { expires: 7, secure: true });
        navigate("/create/job");
        resolve("Login successful");
      } catch (error) {
        console.error("Error:", error);
        try{
          setError(error.response.data+"");
        }
        catch{
          setError(error+"")
        }
        reject("Login failed. Please check your credentials and try again.");
      }
      finally{
        setIsDisabled(false);
      }
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    toast.promise(validateAndLogin(email, password), {
      loading: "Logging In...",
      success: <b>Logged In!</b>,
      error: <b>{error}</b>
    });
  };

  return (
    <div
      className="bg-cover bg-center w-screen h-screen flex flex-col items-center justify-center font-sans"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/ddskymhg2/image/upload/v1716213295/WissenNotifier/awziz45uaykysk08mnen.png')",
      }}
    >
      <div className="text-white text-3xl mb-8">
        WISSEN NOTIFIER - WISSEN TECHNOLOGY
      </div>
      <div className="border-t-4 border-[#06c] bg-white px-20 py-10 flex flex-col items-center">
        <div className="mb-4 text-2xl text-[#363636] font-light">
          Sign in to your Wissen account
        </div>
        <div className="h-8">
        {/* {error && <div className="text-red-500 mb-4">{error}</div>} */}
        </div>
        <form className="w-11/12" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none bo  rder rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`bg-${isDisabled ? 'gray-500' : 'blue-500'} hover:bg-${isDisabled ? 'gray-700' : 'blue-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
              style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
              disabled={isDisabled}
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="mt-4">
          <Link to="/signup" className="text-blue-500 hover:underline">
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Authenticate;
