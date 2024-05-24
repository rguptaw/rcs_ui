import React, { Fragment, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Modal from './Modal';
library.add(faUserPlus);
import { Dialog, Transition } from "@headlessui/react";
import Toast from "./Toast";
import Cookies from 'js-cookie';

const CreateJob = ({ onCreateJob }) => {
  
  const [jobData, setJobData] = useState({
    name: "",
    description: "",
    jobTime: "",
    isImmediate: false,
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
    setIsModalOpen(false);
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

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(userFormData.phone)) {
      newErrors.phone = 'Phone number must be of 10 digits';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
    } else {
      handleSubmit(userFormData);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setJobData({ ...jobData, [name]: newValue });
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
      //   isImmediate: false,
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
        {/* Job Time */}
        <div className="mb-4">
          <label htmlFor="jobTime" className="block text-gray-700 font-semibold mb-2">Job Time</label>
          <input type="datetime-local"name="jobTime"  id="jobTime" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
          value={jobData.jobTime} onChange={handleChange} required />
        </div>
        {/* Immediate */}
        <div className="mb-4 flex items-center">
          <input type="checkbox" name="immediate" id="immediate" className="mr-2" />
          <label htmlFor="immediate" className="text-gray-700 font-semibold" checked={jobData.isImmediate} onChange={handleChange}>Is Immediate</label>
        </div>
        {/* Rerun */}
        <div className="mb-4 flex items-center">
          <input type="checkbox"  name="rerun" id="rerun" className="mr-2" />
          <label htmlFor="rerun" className="text-gray-700 font-semibold" checked={jobData.rerun} onChange={handleChange}>Rerun</label>
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
        {/* Add User Button */}
        <div className="mb-4 flex justify-center">
            <button type="button" onClick={handleAddUserClick} className="w-24 text-sm bg-[#053868] text-white">
            <FontAwesomeIcon icon={faUserPlus} />Add User
          </button>  
          
        </div>
        {/* Recipients */}
        <div className="mb-4">
          <label htmlFor="employees" className="block text-gray-700 font-semibold mb-2">Recipients</label>
          <ul>
            {jobData.employees.slice(0, 1).map((employee, index) => (
              <li key={index}>{employee.name} - {employee.email} - {employee.phone}</li>
            ))}
          </ul>
        {jobData.employees.length > 0  && (
          <div className="flex justify-center mt-2">
        <button
          onClick={showMoreEmployees}
          className="w-32 mt-2 px-4  border border-transparent text-sm font-medium rounded-md text-white bg-[#053868] hover:bg-[#053868] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          show more
        </button>
        </div>
        )}
        </div>
        {/* Submit Button */}
        <button type="submit" className="w-full bg-[#053868] text-white py-2 rounded-md">
          Create Job
        </button>
      </form>
    </div>

    {/* Add user Modal */}

    <Modal isOpen={isModalOpen} onClose={closeModal} handleDelete={handleDelete} employees ={jobData.employees} />

   { /* Add User Slider Form*/ }

      <Transition.Root show={open} as={Fragment}>
      <Dialog className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpen(false)}
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">

                    <div className="ml-10 max-w-md p-8 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Add User</h2>
            <form onSubmit={handleUserFormSubmit}>
              {/* User Name */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
                <input type="text" name='name' id="name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter user name"
                value={userFormData.name} onChange={handleUserFormChange} />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>
              {/* User Email */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2"> Email</label>
                <input type="email" name="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter user email" 
                value={userFormData.email} onChange={handleUserFormChange}/>
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              {/* User Phone */}
              <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">Phone</label>
                <input type="text" name="phone" id="pnone" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter user email" 
                value={userFormData.phone} onChange={handleUserFormChange}/>
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>
              {/* Save Button */}
              <div className="mb-4 flex justify-center">
                <button type="submit" className="text-sm bg-[#053868] text-white py-1 px-3 rounded-md hover:bg-[#053868] focus:outline-none focus:ring-2 focus:ring-[#053868">
                Submit
                </button>
              </div>
            </form>
          </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>

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
