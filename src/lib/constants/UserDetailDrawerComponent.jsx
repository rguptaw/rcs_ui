import React, { useEffect, useState } from "react";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerHeader,
  DrawerFooter,
  DrawerClose,
} from "src/@/components/ui/drawer";

import Cookies from "js-cookie";
import axios from "axios";

const UserDetailDrawerComponent = ({ content, jobId }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);
  const [jobResponses, setJobResponses] = useState([]);

  const handleClick = async () => {
    setIsDrawerOpen(true);
    try {
      const token = Cookies.get("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      
      const jobDetailsResponse = await axios.get(`http://localhost:8080/jobs/${jobId}`, config);
      const jobDetailsData = jobDetailsResponse.data;
      console.log(jobDetailsData);
      setJobDetails(jobDetailsData);

      const jobResponsesResponse = await axios.get(`http://localhost:8080/responses/${jobId}`, config);
      const jobResponsesData = jobResponsesResponse.data;
      console.log(jobResponsesData);
      setJobResponses(jobResponsesData);
      
    } catch (error) {
      console.error("Error fetching job details or responses:", error);
    }
  };

  useEffect(() => {
    if (isDrawerOpen) {
      console.log("DRAWER OPENED!");
    }
  }, [isDrawerOpen]);

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const parseAdditionalInfo = (additionalInfo) => {
    if (!additionalInfo) {
      return "No response";
    }

    try {
      const parsedInfo = JSON.parse(additionalInfo);
      if (parsedInfo.input_key && parsedInfo.input_key.length > 0) {
        return parsedInfo.input_key.map((item) => item.label).join(", ")+"ed";
      }
      return "No response";
    } catch (error) {
      console.error("Error parsing additionalInfo:", error);
      return "No response";
    }
  };

  return (
    <div>
      <Drawer isOpen={isDrawerOpen} onClose={handleDrawerClose}>
        <DrawerTrigger onClick={handleClick}>
          <span>{content}</span>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <div className="align-middle justify-center text-center">
              <p className="text-3xl ">Job Detail : {jobId + ""}</p>
            </div>

            {jobDetails ? (
              <div className="job-details-container">
                <div className="job-detail">
                  <span className="job-detail-label">Name:</span>
                  <span className="job-detail-value">{jobDetails.name}</span>
                </div>
                <div className="job-detail">
                  <span className="job-detail-label">Description:</span>
                  <span className="job-detail-value">
                    {jobDetails.description}
                  </span>
                </div>
                <div className="job-detail">
                  <span className="job-detail-label">Cost:</span>
                  <span className="job-detail-value">{jobDetails.cost}</span>
                </div>
                <div className="job-detail">
                  <span className="job-detail-label">Immediate:</span>
                  <span className="job-detail-value">
                    {jobDetails.immediate.toString()}
                  </span>
                </div>
                <div className="job-detail">
                  <span className="job-detail-label">Interval:</span>
                  <span className="job-detail-value">
                    {jobDetails.interval}
                  </span>
                </div>
                <div className="job-detail">
                  <span className="job-detail-label">Job Time:</span>
                  <span className="job-detail-value">
                    {jobDetails.jobTime ? jobDetails.jobTime.toString() : "N/A"}
                  </span>
                </div>
                <div className="job-detail">
                  <span className="job-detail-label">Status:</span>
                  <span className="job-detail-value">{jobDetails.status}</span>
                </div>
                <div className="job-detail">
                  <span className="job-detail-label">Employees:</span>
                  <span className="job-detail-value">
                    {jobDetails.employees.length > 0
                      ? jobDetails.employees.map((employee, index) => (
                        <span key={index}>
                          {Object.entries(employee).filter(([key]) => key !== 'id').map(([key, value]) => `${key}: ${value}`).join(', ')}
                          <br />
                        </span>
                      )) : 'N/A'}
                  </span>
                </div>
                <div className="job-detail">
                  <span className="job-detail-label">Message:</span>
                  <span className="job-detail-value">
                    {jobDetails.message || "N/A"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="loading-message">Loading...</div>
            )}

            <div className="responses-container mt-4 align-middle justify-center text-center">
              <h2 className="text-2xl mb-2">Responses</h2>
              {jobResponses.length > 0 ? (
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Employee Name</th>
                      <th className="py-2 px-4 border-b">Email</th>
                      <th className="py-2 px-4 border-b">Phone</th>
                      <th className="py-2 px-4 border-b">Status</th>
                      <th className="py-2 px-4 border-b">Sent Time</th>
                      <th className="py-2 px-4 border-b">Responded</th>
                      <th className="py-2 px-4 border-b">Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobResponses.map((response, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border-b">{response.employee.name}</td>
                        <td className="py-2 px-4 border-b">{response.employee.email}</td>
                        <td className="py-2 px-4 border-b">{response.employee.phone}</td>
                        <td className="py-2 px-4 border-b">{response.status}</td>
                        <td className="py-2 px-4 border-b">{new Date(response.sentTime).toLocaleString()}</td>
                        <td className="py-2 px-4 border-b">{response.responded.toString()}</td>
                        <td className="py-2 px-4 border-b">{parseAdditionalInfo(response.additionalInfo)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="loading-message">No responses found</div>
              )}
            </div>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default UserDetailDrawerComponent;
