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

const UserDetailDrawerComponent = ({ content, jobId }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);
  // const jobId = 8;

  const handleClick = async () => {
    setIsDrawerOpen(true);
    try {
      const response = await fetch(`http://localhost:8080/jobs/${jobId}`);
      const data = await response.json();
      console.log(data);
      setJobDetails(data);
    } catch (error) {
      console.error("Error fetching job details:", error);
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

            {/* <div className='justify-center text-center align-middle m-20'>
                            {JSON.stringify(jobDetails || "Loading")}
                        </div> */}
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
          </DrawerHeader>
          {/* <DrawerFooter>
                        <button>Submit</button>
                        <DrawerClose>
                            Close
                        </DrawerClose>
                    </DrawerFooter> */}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default UserDetailDrawerComponent;
