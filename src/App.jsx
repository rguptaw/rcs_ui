
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
          </Route>
          <Route path="authenticate" element={<Authenticate/>}/>
      </Routes>
    </div>
  );
}

export default App;
