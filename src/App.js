import logo from "./logo.svg";
import "./App.css";
import { Route, Router, Routes } from "react-router-dom";
import DisplayGrid from "./components/DisplayGrid/DisplayGrid";
import CreateMeeting from "./components/CreateMeeting/CreateMeeting";
import Participants from "./components/Participants/Participant";
import Meetings from "./components/Meetings/Meetings";
import AddParticipantForm from "./components/AddParticipant/AddParticipant";


function App() {
  return (
    <div className="App" style={{height: '100vh', width: '100vw', display: 'flex'}}>
      <Routes>
      
        <Route path="/" element={<DisplayGrid />} />
        <Route path="/participants" element={<Participants />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/create/meeting" element={<CreateMeeting />} />
        <Route path="/create/participant" element={<AddParticipantForm />} />

      </Routes>
    </div>
  );
}

export default App;
