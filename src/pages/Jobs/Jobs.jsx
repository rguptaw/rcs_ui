import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Cookies from "js-cookie";
//import { BiLoaderCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaSearch } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { TooltipProvider } from "src/@/components/ui/tooltip";

import ToolTipComponent from "src/lib/constants/ToolTipComponent";
import UserDetailDrawerComponent from "src/lib/constants/UserDetailDrawerComponent";

const Jobs = () => {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);
  const [isLoader, setIsLoader] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null); // Selected job data
  const [email, setEmail] = useState("");
  const [jobName, setJobName] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const gridRef = useRef();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchData = async () => {
    try {
      const token = Cookies.get("token");

      const decodedToken = jwtDecode(token); // Decode the JWT
      const userEmail = decodedToken.email; // Extract the email from the decoded token
      setEmail(userEmail);

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get("http://localhost:8080/jobs", config);
      setIsLoader(false);
      console.log(response);
      let newData = response.data;
      if (newData.length > 0) {
        const properties = Object.keys(newData[0]);
        // Define the order of fixed columns
        const fixedColumnsOrder = [
          "name",
          "description",
          "immediate",
          "jobTime",
          "status",
          "cost",
          "interval",
        ];

        // Generate column definitions
        const newColDefs = fixedColumnsOrder
          .map((columnName) => {
            const property = properties.find((prop) => prop === columnName);
            if (property) {
              // Customize value display for specific columns
              const valueGetter = (params) => {
                if (property === "jobTime") {
                  const date = new Date(params.data.jobTime);
                  return date.toLocaleString(); // Adjust formatting as needed
                }
                if (property === "channels") {
                  return params.data.channels
                    .map((channel) => channel.channelType)
                    .join(", ");
                }

                return params.data[property];
              };

              let cellRenderer = null;
              if (property === "immediate") {
                cellRenderer = "agCheckboxCellRenderer";
              } else if (property === "description") {
                cellRenderer = (params) => {
                  return <ToolTipComponent name={params.value} />;
                };
              } else if (property === "name") {
                cellRenderer = (params) => {
                  //return <UserDetailDrawerComponent content={params.value} />;
                  const jobId = params.data.jobId; // Assuming each job has a unique id
                  return <UserDetailDrawerComponent content={params.value} jobId={jobId} />
                };
              }

              return {
                field: property,
                valueGetter: valueGetter,
                suppressMovable: true, // Prevent column from being moved
                cellRenderer: cellRenderer,
              };
            }
            return null;
          })
          .filter((column) => column !== null);

        setRowData(newData);
        setColDefs(newColDefs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      Cookies.remove("token");
      navigate("/authenticate?expiredCredentials");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleSearch = () => {
    const filteredData = rowData.filter(
      (item) =>
        (jobName
          ? item.name.toLowerCase().includes(jobName.toLowerCase())
          : true) &&
        (status
          ? item.status.toLowerCase().includes(status.toLowerCase())
          : true)
    );
    // Update rowData with filtered data
    setRowData(filteredData);
  };

  const handleReset = () => {
    // Reset search inputs and fetch data again
    setJobName("");
    setStatus("");
    setIsLoader(true);
    fetchData();
  };

  const gridOptions = {
    defaultColDef: {
      resizable: false,
      minWidth: 100,
    },
    onFirstDataRendered: (params) => {
      params.api.sizeColumnsToFit();
    },
    rowHeight: 50,
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <TooltipProvider>
        <div className="montserrat-heading">
          Jobs: {email}
          {/* Interviews: riya.gupta@wissen.com */}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "right",
            margin: "0px 30px",
          }}
        >
          <input
            type="text"
            placeholder="Job Name"
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
            style={{
              padding: "10px 15px",
              marginRight: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "20px",
            }}
          />
          <input
            type="text"
            placeholder="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              padding: "5px 15px",
              marginRight: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "20px",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              display: "inline-block",
              padding: "5px 20px",
              borderRadius: "4px",
              backgroundColor: "#003366",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              margin: "0px 15px",
            }}
          >
            <FaSearch
              style={{ display: "inline-block", marginRight: "10px" }}
            />
            Search
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: "5px 20px",
              borderRadius: "4px",
              backgroundColor: "#003366",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              margin: "0px 15px",
            }}
          >
            <GrPowerReset
              style={{ display: "inline-block", marginRight: "10px" }}
            />{" "}
            Reset
          </button>
        </div>
        <div
          className="ag-theme-alpine"
          style={{ width: "100%", height: "70%", position: "relative" }}
          domLayout="autoHeight"
        >
          {isLoader && (
            <div className="absolute inset-0 flex items-center justify-center  bg-white">
              <div className="w-16 h-16 relative">
                <div className="absolute top-0 left-0 w-full h-full animate-spin rounded-full border-t-4 border-[#fc6d26]"></div>
              </div>
            </div>
          )}
          {!isLoader && (
            <AgGridReact
              rowData={rowData}
              columnDefs={colDefs}
              className="z-0 m-14 borderc"
              pagination={true}
              ref={gridRef}
              gridOptions={gridOptions}
            />
          )}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default Jobs;
