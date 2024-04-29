import React, { useState } from "react";
import axios from "axios";
import "./AddParticipant.css"; // Import CSS for styling
import Participants from "../Participants/Participant";

const AddParticipantForm = ({ onAddMeeting }) => {
  const [meetingData, setMeetingData] = useState({
    name: "",
    phonenumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeetingData({ ...meetingData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert(meetingData.name + " > " + meetingData.phonenumber);
    try {
      // Send the meeting data to the server
      const response = await axios.post(
        "http://localhost:3000/addParticipant",
        meetingData
      );
      alert(
        "Participant added successfully:\n" + JSON.stringify(response.data)
      );
      // Clear the form after successful submission
      setMeetingData({
        name: "",
        phonenumber: "",
      });
    } catch (error) {
      // Display an alert with the error data and status code
      alert("Error adding participant:\n" + error.response + " - ");
      console.error("Error adding participant:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Participant</h2>
      <form onSubmit={handleSubmit} className="meeting-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={meetingData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phonenumber"
            value={meetingData.phonenumber}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Create Participant</button>
      </form>
    </div>
  );
};

export default AddParticipantForm;
