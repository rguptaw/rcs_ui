import logo from "./logo.svg";
import "./App.css";
import { Route, Router, Routes } from "react-router-dom";
import DisplayGrid from "./components/DisplayGrid/DisplayGrid";
import CreateMeeting from "./components/CreateMeeting/CreateMeeting";

function App() {
  return (
    <div className="App" style={{height: '100vh', width: '100vw', display: 'flex'}}>
      <Routes>
      
        <Route path="/" element={<DisplayGrid />} />
        <Route path="/create" element={<CreateMeeting />} />
      </Routes>
    </div>
  );
}

export default App;
