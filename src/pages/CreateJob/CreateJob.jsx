import React, { Fragment, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Modal from './Modal';
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
import Cookies from 'js-cookie';
import BulkUpload from "../BulkUpload/BulkUpload";

const CreateJob = ({ onCreateJob }) => {
  const [displayData,setDisplayData]=useState([]);
  
  const [jobData, setJobData] = useState({
    name: "",
    description: "",
    jobTime: "",
    runNow: false,
    rerun: false,
    channelIds: [],
    employees: []
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showToast2, setShowToast2] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const showMoreEmployees = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleAddUserClick = () => {
    setOpen(true);
  };
 
  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserFormData({
      ...userFormData,
      [name]: value
    });

    setErrors({
      ...errors,
      [name]: ''
    });
  };

  const handleDelete = (user) => {
    setJobData((prevJobData) => ({
      ...prevJobData,
      employees: prevJobData.employees.filter((employee) => employee !== user),
    }));
  };

  const handleUserFormSubmit = (e) => {
    e.preventDefault();

    let hasError = false;
    let newErrors = { name: '', email: '', phone: '' };

    if (userFormData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
      hasError = true;
    }

    if (!userFormData.email) {
      newErrors.email = 'Email is required';
      hasError = true;
    }

    const phoneRegex = /^(\+\d{1,3})?\d{10}$/;
    if (!phoneRegex.test(userFormData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits long or include a valid country code followed by 10 digits';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
    } else {
      handleSubmit(userFormData);
    }
  };

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   const newValue = type === 'checkbox' ? checked : value;
  //   setJobData({ ...jobData, [name]: newValue });
  //   console.log(jobData);
  // };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    // Update state based on the input change
    setJobData((prevData) => {
      const updatedData = { ...prevData, [name]: newValue };
      // If the 'runNow' checkbox is checked, reset 'jobTime' to empty
      if (name === 'runNow' && newValue) {
        updatedData.jobTime = '';
      }
      return updatedData;
    });
  };

  const handleSubmit = async (data) => {
    try {
      setJobData({ ...jobData, employees: [...jobData.employees, data] });
      // Clear the user form data
      setUserFormData({
        name: "",
        email: "",
        phone: ""
      });
      setShowToast(true);
    } catch (error) {
      // Display an alert with the error data and status code
      alert("Error adding participant:\n" + error.response + " - ");
      console.error("Error adding participant:", error);
    }
    finally{
      setOpen(false);
    }
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
    try {
      const token = Cookies.get('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
      // Send the job data to the server
      await axios.post("http://localhost:8080/jobs", jobData,config);
      // Clear the form after successful submission
      // setJobData({
      //   name: "",
      //   description: "",
      //   jobTime: "",
      //   isrunNow: false,
      //   rerun: false,
      //   channel_types: "",
      //   employees: []
      // });
      setShowToast2(true);
      // Trigger a callback to notify the parent component about the creation of a new job
      
    } catch (error) {
      alert("Error adding job:\n" + error.response + " - ");
      console.error("Error creating job:", error);
    }
  };
  

  
  const inputStyles = jobData.runNow
    ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' }
    : {};

  return (
    <div className="container mx-auto mt-10 flex justify-center">
      <div className={`w-1/2 p-8 bg-white shadow-md rounded-lg `}>
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Job</h2>
      <form onSubmit={handleSubmitJob} className="job-form">
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
          <input type="text" name="name" id="name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter name" 
          value={jobData.name} onChange={handleChange} required />
        </div>
        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">Description</label>
          <input type="text" name="description" id="description" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter description"
          value={jobData.description} onChange={handleChange} required />
        </div>
         {/* Channel Types */}
         <div className="mb-4">
  <label htmlFor="channel_types" className="block text-gray-700 font-semibold mb-2">Channel Types</label>
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
        {/* Run Now */}
        <div className="mb-4 flex items-center">
          <input type="checkbox" name="runNow" id="runNow" className="mr-2" checked={jobData.runNow} onChange={handleChange} />
          <label htmlFor="runNow" className="text-gray-700 font-semibold" >runNow</label>
        </div>
        {/* Rerun */}
        {/* <div className="mb-4 flex items-center">
          <input type="checkbox"  name="rerun" id="rerun" className="mr-2" checked={jobData.rerun} onChange={handleChange} />
          <label htmlFor="rerun" className="text-gray-700 font-semibold" >Rerun</label>
        </div> */}
        {/* Job Time */}
        <div className="mb-4">
          <label htmlFor="jobTime" className="block text-gray-700 font-semibold mb-2">Job Time</label>
          <input type="datetime-local"name="jobTime"  id="jobTime" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
          value={jobData.jobTime} onChange={handleChange} style={inputStyles}  disabled={jobData.runNow} required />
        </div>
        
       
       
        {/* Recipients */}
        <div className="mb-4">
  <label htmlFor="employees" className="block text-gray-700 font-semibold mb-2">Job Users</label>
  <div className="h-20 overflow-y-auto border border-gray-300 rounded-md p-2">
    {jobData.employees.map((user, index) => (
      <div key={index} className="flex justify-between items-center mb-2">
        <div className="flex-shrink-0"> {/* Ensures the container doesn't grow beyond its content */}
          <span className="font-semibold">{user.name} - {user.email} - {user.phone}</span>
        </div>
        <button
          type="button"
          onClick={() => handleDelete(user)} 
          className="text-red-500 hover:text-red-700 focus:outline-none"
        >
          <XMarkIcon className="ml-5 h-5 w-5" />
        </button>
      </div>
    ))}
  </div>
</div>
          {/* Add User Button */}
        <div className="mb-4 flex justify-center">
  <Dialog className="flex justify-center items-center">
  <DialogTrigger> <button type="button" onClick={handleAddUserClick} className="w-24 mt-5 text-sm bg-[#053868] text-white"> <FontAwesomeIcon icon={faUserPlus} />Upload excel  </button>  </DialogTrigger>
  <DialogContent className="max-w-fit w-10/12">
    <DialogHeader>
      <DialogTitle></DialogTitle>
      <DialogDescription>
       <BulkUpload dData={displayData} setDData={setDisplayData}/>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
        </div>
        {/* Submit Button */}
        <button type="submit" className="w-full bg-[#053868] text-white py-2 rounded-md">
          Create Job
        </button>
      </form>
    </div>
  

    {/* Add user Modal */}

    {/* <Modal isOpen={isModalOpen} onClose={closeModal} handleDelete={handleDelete} employees ={jobData.employees} /> */}

   { /* Add User Slider Form*/ }

  

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
