import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Modal from "./Modal";
library.add(faUserPlus);

import { Button } from "../../@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../@/components/ui/dialog"
import { Input } from "../../@/components/ui/input"
import { Label } from "../../@/components/ui/label"
import Toast from "./Toast";

import BulkUpload from "../BulkUpload/BulkUpload";
import Cookies from "js-cookie";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { API_URL } from "../../lib/constants/index";


const CreateJob = ({ onCreateJob }) => {
  const [jobData, setJobData] = useState({
    name: "",
    description: "",
    message: "",
    jobTime: "",
    immediate: false,
    rerun: false,
    channelIds: [],
    employees: [],
    interval: 5
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showToast2, setShowToast2] = useState(false);

  const [selectedTime, setSelectedTime] = useState("");
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [displayData,setDisplayData]=useState([]);
  const [fileInfo,setFileInfo]=useState("");
  const [startDate, setStartDate] = useState(null);
  useEffect((
  )=>{
    const keysToExclude = ['RNo','errors'];
    console.log(displayData);
   const postData= displayData.map(obj => {
     
      const filteredObject = {};
  
    
      for (const key in obj) {
        if (!keysToExclude.includes(key)) {
          filteredObject[key.toLowerCase()] = obj[key];
        }
      }
      return filteredObject;
    });
    setJobData({ ...jobData, employees:  postData });
    },[displayData])

  const handleAddUserClick = () => {
    setOpen(true);
  };
 
 
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    console.log("New value detected : " + value);

    // Update state based on the input change
    setJobData((prevData) => {
      const updatedData = { ...prevData, [name]: newValue };
      // If the 'immediate' checkbox is checked, reset 'jobTime' to empty
      if (name === "immediate" && newValue) {
        const now = new Date();
        updatedData.jobTime = format(now, "yyyy-MM-dd'T'HH:mm");
        setSelectedTime(format(now, "dd-MM-yy hh:mm a"));
      }
      if (name === "interval" && newValue) {
        updatedData.interval = parseInt(newValue);
      }

      return updatedData;
    });
    console.log(jobData);
  };

  const handleDateChange = (date) => {
    const currentTime = format(date, "yyyy-MM-dd'T'HH:mm");

    setJobData((prevData) => {
      const updatedData = { ...prevData, jobTime: currentTime };
      setSelectedTime(format(date, "dd-MM-yy hh:mm a"));

      console.log(updatedData);
      return updatedData;
    });
  };

  const formatDate = (date) => {
    return format(date, "dd-MM-yyyy hh:mm a");
  };

 
  const handleChannelChange = (e) => {
    const value = parseInt(e.target.value);
    setJobData((prevJobData) => {
      const newChannelIds = prevJobData.channelIds.includes(value)
        ? prevJobData.channelIds.filter((id) => id !== value)
        : [...prevJobData.channelIds, value];
      return { ...prevJobData, channelIds: newChannelIds };
    });
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();
    setIsDisabled(true);
    try {
      const token = Cookies.get("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      // Send the job data to the server
      await axios.post(API_URL+"jobs", jobData, config);
   
      setShowToast2(true);
      // Trigger a callback to notify the parent component about the creation of a new job
    } catch (error) {
      alert("Error adding job:\n" + error.response + " - ");
      console.error("Error creating job:", error);
    }
    finally{
      setIsDisabled(false);
    }
  };

  const minDateTime = new Date();
  const maxTime = new Date();
  maxTime.setHours(23, 59, 59);

  const inputStyles = jobData.immediate
    ? { backgroundColor: "#f0f0f0", cursor: "not-allowed" }
    : {};

  const submitStyles = isDisabled
    ? { backgroundColor: "#f0f0f0", cursor: "not-allowed" }
    : {};

  return (
    <div className="container mx-auto mt-10 flex justify-center">
      <div className={`w-1/2 p-8 bg-white shadow-md rounded-lg `}>
        <h2 className="text-2xl font-bold mb-6 text-center">Create New Job</h2>
        <form onSubmit={handleSubmitJob} className="job-form">
          {/* Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-semibold mb-2"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name"
              value={jobData.name}
              onChange={handleChange}
              required
            />
          </div>
          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-semibold mb-2"
            >
              Description
            </label>
            <input
              type="text"
              name="description"
              id="description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description"
              value={jobData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Channel Types */}
          <div className="mb-4">
            <label
              htmlFor="channel_types"
              className="block text-gray-700 font-semibold mb-2"
            >
              Channel Types
            </label>
            <div className="flex">
              <label className="flex items-center mr-4">
                <input
                  type="checkbox"
                  name="channel_types"
                  value={1}
                  className="mr-2"
                  onChange={handleChannelChange}
                  checked={jobData.channelIds.includes(1)}
                />
                PhoneCall
              </label>
              <label className="flex items-center mr-4">
                <input
                  type="checkbox"
                  name="channel_types"
                  value={2}
                  className="mr-2"
                  onChange={handleChannelChange}
                  checked={jobData.channelIds.includes(2)}
                />
                Email
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="channel_types"
                  value={3}
                  className="mr-2"
                  onChange={handleChannelChange}
                  checked={jobData.channelIds.includes(3)}
                />
                WhatsApp
              </label>
            </div>
          </div>
          {/* Immediate */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="immediate"
              id="immediate"
              className="mr-2"
              checked={jobData.immediate}
              onChange={handleChange}
            />
            <label htmlFor="immediate" className="text-gray-700 font-semibold">
              Run Now
            </label>
          </div>
          {/* Rerun */}
          {/* <div className="mb-4 flex items-center">
          <input type="checkbox"  name="rerun" id="rerun" className="mr-2" checked={jobData.rerun} onChange={handleChange} />
          <label htmlFor="rerun" className="text-gray-700 font-semibold" >Rerun</label>
        </div> */}
          <div className="mb-4">
            <label
              htmlFor="interval"
              className="block text-gray-700 font-semibold mb-2"
            >
              Reminder Interval
            </label>
            <select
              name="interval"
              id="interval"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={jobData.interval}
              onChange={handleChange}
              disabled={jobData.immediate}
              style={inputStyles}
            >
              <option value="5">5 minutes before</option>
              <option value="10">10 minutes before</option>
              <option value="15">15 minutes before</option>
              <option value="20">20 minutes before</option>
              <option value="30">30 minutes before</option>
              <option value="60">1 hour before</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-gray-700 font-semibold mb-2"
            >
              Message
            </label>
            <input
              type="text"
              name="message"
              id="message"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter message"
              value={jobData.message}
              onChange={handleChange}
              required
            />
          </div>
          {/* Job Time */}
          <div className="mb-4">
            <label
              htmlFor="jobTime"
              className="block text-gray-700 font-semibold mb-2"
            >
              Job Time
            </label>
            <div
              className="w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={jobData.immediate}
              style={inputStyles}
              required
            >
              <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                minDate={minDateTime} // Allow dates starting from the current date
                minTime={minDateTime} // Allow times starting from the current time
                maxTime={maxTime} // Allow times until the end of the day
                placeholderText="Select date and time"
                showTimeSelect
                // value={jobData.jobTime ? formatDate(jobData.jobTime) : ''}
                value={selectedTime}
                timeCaption="Time"
                timeFormat="hh:mm aa"
                timeIntervals={1}
                dateFormat="dd-MM-yyyy hh:mm aa" // Updated dateFormat
                disabled={jobData.immediate}
                style={inputStyles}
              />
            </div>
          </div>

   
          <div className="mb-4 flex justify-center">
  <Dialog className="flex justify-center items-center">
  <DialogTrigger> <button type="button" onClick={handleAddUserClick} className="w-24 mt-5 text-sm bg-[#053868] text-white"> <FontAwesomeIcon icon={faUserPlus} />Upload excel  </button>  </DialogTrigger>
  <DialogContent className="max-w-fit w-10/12">
    <DialogHeader>
      <DialogTitle></DialogTitle>
      <DialogDescription>
       <BulkUpload dData={displayData} setDData={setDisplayData} fileInfo={fileInfo} setFileInfo={setFileInfo}/>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
        </div>
          <button
            type="submit"
            className="w-full bg-[#053868] text-white py-2 rounded-md"
            disabled={isDisabled}
            style={submitStyles}
          >
            Create Job
          </button>
        </form>
      </div>
      

      {/* Toast message */}
      <Toast
        title="Job User created successfully"
        description="New job user has been added."
        show={showToast}
        onClose={() => setShowToast(false)}
      />

      <Toast
        title="Job created successfully"
        description="New job has been added."
        show={showToast2}
        onClose={() => setShowToast2(false)}
      />
    </div>
  );
 
};


export default CreateJob;
