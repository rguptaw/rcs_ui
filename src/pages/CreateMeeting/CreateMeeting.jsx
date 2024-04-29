import React, { useState } from "react";
import axios from "axios";
import "./CreateMeeting.css"; // Import CSS for styling

const AddMeetingForm = ({ onAddMeeting }) => {
  const [meetingData, setMeetingData] = useState({
    title: "",
    date: "",
    startTime: "",
    participants: "",
    description: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeetingData({ ...meetingData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the meeting data to the server
      await axios.post("http://localhost:3000/meetings", meetingData);
      // Clear the form after successful submission
      setMeetingData({
        title: "",
        date: "",
        startTime: "",
        participants: "",
        description: ""
      });
      // Trigger a callback to notify the parent component about the addition of a new meeting
      onAddMeeting();
    } catch (error) {
      console.error("Error adding meeting:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Meeting</h2>
      <form onSubmit={handleSubmit} className="meeting-form">
        <div className="form-group">
          <label>Title:</label>
          <input type="text" name="title" value={meetingData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input type="date" name="date" value={meetingData.date} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Start Time:</label>
          <input type="time" name="startTime" value={meetingData.startTime} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Participants:</label>
          <input type="text" name="participants" value={meetingData.participants} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={meetingData.description} onChange={handleChange} required />
        </div>
        <button type="submit">Add Meeting</button>
      </form>
    </div>
  );
};

export default AddMeetingForm;
