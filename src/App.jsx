
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./shared/Layout";
import Login from "./pages/Login/Login";
import Authenticate from "./pages/Authenticate/Authenticate";
import CreateJob from "./pages/CreateJob/CreateJob";
import Jobs from "./pages/Jobs/Jobs";
import Signup from "./pages/Signup/Signup";


function App() {
  return (
    <div className="App" style={{height: '100vh', width: '100vw', display: 'flex'}}>
      <Routes>
      <Route index element={<Login/>}/>
        <Route path="/" element={<Layout/>}>
        <Route path="jobs" element={<Jobs />} />
        <Route path="create/job" element={<CreateJob />} />
        </Route>
      <Route path="authenticate" element={<Authenticate/>}/>
      <Route path="signup" element={<Signup/>} />
      </Routes>
    </div>
  );
}

export default App;
