import React, { Fragment, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Modal from "./Modal";
library.add(faUserPlus);
import { Dialog, Transition } from "@headlessui/react";
import Toast from "./Toast";
import Cookies from "js-cookie";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

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
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
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
    let newErrors = { name: "", email: "", phone: "" };

    if (userFormData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
      hasError = true;
    }

    if (!userFormData.email) {
      newErrors.email = "Email is required";
      hasError = true;
    }

    const phoneRegex = /^\+\d{1,2}\d{10}$/;
    console.log(userFormData.phone);
    if (!phoneRegex.test(userFormData.phone)) {
      newErrors.phone =
        "Phone number must be 10 digits long";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
    } else {
      handleSubmit(userFormData);
    }
  };
  const [startDate, setStartDate] = useState(null);

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   const newValue = type === 'checkbox' ? checked : value;
  //   setJobData({ ...jobData, [name]: newValue });
  //   console.log(jobData);
  // };
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

  const handleSubmit = async (data) => {
    try {
      setJobData({ ...jobData, employees: [...jobData.employees, data] });
      // Clear the user form data
      setUserFormData({
        name: "",
        email: "",
        phone: "",
      });
      setShowToast(true);
    } catch (error) {
      // Display an alert with the error data and status code
      alert("Error adding participant:\n" + error.response + " - ");
      console.error("Error adding participant:", error);
    } finally {
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
      const token = Cookies.get("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      // Send the job data to the server
      await axios.post("http://localhost:8080/jobs", jobData, config);
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

  const minDateTime = new Date();
  const maxTime = new Date();
  maxTime.setHours(23, 59, 59);

  const inputStyles = jobData.immediate
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
              disabled={jobData.immediate}
              style={inputStyles}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={jobData.interval}
              onChange={handleChange}
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

          {/* Recipients */}
          {/* <div className="mb-4">
            <label
              htmlFor="employees"
              className="block text-gray-700 font-semibold mb-2"
            >
              Job Users
            </label>
            <div className="h-20 overflow-y-auto border border-gray-300 rounded-md p-2">
              {jobData.employees.map((user, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-2"
                >
                  <div className="flex-shrink-0">

                    <span className="font-semibold">
                      {user.name} - {user.email} - {user.phone}
                    </span>
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
          </div> */}
          {/* Add User Button */}
          {/* <div className="mb-4 flex justify-center">
            <button
              type="button"
              onClick={handleAddUserClick}
              className="w-40 mt-5 text-sm bg-[#053868] text-white"
            >
              <FontAwesomeIcon icon={faUserPlus} />
              Add Participant
            </button>
          </div> */}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#053868] text-white py-2 rounded-md"
          >
            Create Job
          </button>
        </form>
      </div>

      {/* Add user Modal */}

      {/* <Modal isOpen={isModalOpen} onClose={closeModal} handleDelete={handleDelete} employees ={jobData.employees} /> */}

      {/* Add User Slider Form*/}

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
                          <h2 className="text-xl font-bold mb-4 text-center">
                            Add User
                          </h2>
                          <form onSubmit={handleUserFormSubmit}>
                            {/* User Name */}
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
                                placeholder="Enter user name"
                                value={userFormData.name}
                                onChange={handleUserFormChange}
                              />
                              {errors.name && (
                                <p className="text-red-500 text-sm">
                                  {errors.name}
                                </p>
                              )}
                            </div>
                            {/* User Email */}
                            <div className="mb-4">
                              <label
                                htmlFor="email"
                                className="block text-gray-700 font-semibold mb-2"
                              >
                                {" "}
                                Email
                              </label>
                              <input
                                type="email"
                                name="email"
                                id="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter user email"
                                value={userFormData.email}
                                onChange={handleUserFormChange}
                              />
                              {errors.email && (
                                <p className="text-red-500 text-sm">
                                  {errors.email}
                                </p>
                              )}
                            </div>
                            {/* User Phone */}
                            <div className="mb-4">
                              <label
                                htmlFor="phone"
                                className="block text-gray-700 font-semibold mb-2"
                              >
                                Phone
                              </label>
                              {/* <input type="text" name="phone" id="pnone" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter phone number" 
                value={userFormData.phone} onChange={handleUserFormChange}/>
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>} */}

                              <PhoneInput
                                defaultCountry="IN"
                                id="phone"
                                name="phone"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter phone number"
                                value={userFormData.phone}
                                onChange={(value) =>
                                  handleUserFormChange({
                                    target: { name: "phone", value },
                                  })
                                }
                                required
                              /> {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                            </div>
                            {/* Save Button */}
                            <div className="mb-4 flex justify-center">
                              <button
                                type="submit"
                                className="text-sm bg-[#053868] text-white py-1 px-3 rounded-md hover:bg-[#053868] focus:outline-none focus:ring-2 focus:ring-[#053868"
                              >
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
