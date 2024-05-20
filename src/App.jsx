
import "./App.css";
import { Route, Router, Routes } from "react-router-dom";
import CombinedData from "./components/CombinedData/CombinedData";
import CreateJob from "./components/CreateJob/CreateJob";
import JobUsers from "./components/JobUsers/JobUsers";
import Jobs from "./components/Jobs/Jobs";


function App() {
  return (
    <div className="App" style={{height: '100vh', width: '100vw', display: 'flex'}}>
      <Routes>
      
        
        <Route path="/jobs/combined" element={<CombinedData />} />
        <Route path="/job_users" element={<JobUsers />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/create/job" element={<CreateJob />} />

      </Routes>
    </div>
  );
}

export default App;
