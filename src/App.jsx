
import "./App.css";
import { Route, Router, Routes } from "react-router-dom";
import DisplayGrid from "./pages/DisplayGrid/DisplayGrid";
import CreateMeeting from "./pages/CreateMeeting/CreateMeeting";
import Participants from "./pages/Participants/Participant";
import Meetings from "./pages/Meetings/Meetings";
import AddParticipantForm from "./pages/AddParticipant/AddParticipant";
import Layout from "./components/shared/Layout";
import Login from "./pages/Login/Login";
import Authenticate from "./pages/Authenticate/Authenticate";
import CombinedData from "./components/CombinedData/CombinedData";
import CreateJob from "./components/CreateJob/CreateJob";
import JobUsers from "./components/JobUsers/JobUsers";
import Jobs from "./components/Jobs/Jobs";
import Signup from "./pages/Signup/Signup";
import BulkUpload from "./pages/BulkUpload/BulkUpload";


function App() {
  return (
    <div className="App" style={{height: '100vh', width: '100vw', display: 'flex'}}>
      <Routes>
        <Route path="/" element={<Layout/>} >
          <Route index element={<Login/>}/>
          <Route path="/participants" element={<Participants />} />
          <Route path="/meetings" element={<Meetings />} />
        <Route path="/create/meeting" element={<CreateMeeting />} />
        <Route path="/create/participant" element={<AddParticipantForm />} />
        <Route path="/jobs/combined" element={<CombinedData />} />
        <Route path="/job_users" element={<JobUsers />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/create/job" element={<CreateJob />} />
        <Route path="/bulkupload" element={<BulkUpload />} />
          </Route>
          <Route path="authenticate" element={<Authenticate/>}/>
          <Route path="/signup" element={<Signup/>} />
       

      </Routes>
    </div>
  );
}

export default App;
