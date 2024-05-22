import React, { useEffect, useState } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const Jobs = () => {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token =
          "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJoZWxsb0BnbWFpbC5jb20iLCJpYXQiOjE3MTYzNjk0MTUsImV4cCI6MTcxNjM3MTIxNX0.2o5A-YkcTFwj6BCtk7JiUVFrsABHbWSORCvllxfFkBzbcRozOICba6emat7HQmX3";
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get("http://localhost:8080/jobs", config);
        console.log(response);
        let newData = response.data.flatMap((item) => {
          if (item.employees.length === 0) {
            // If there are no employees for this job, return the parent object as is
            return [{ jobName: item.name, ...item }];
          } else {
            // If there are employees, duplicate the parent object for each employee detail
            return item.employees.map((employee) => {
              let newObject = { jobName: item.name, ...item };
              Object.keys(employee).forEach((key) => {
                const newKey = `${key.charAt(0) + key.slice(1)}`;
                newObject[newKey] = employee[key];
              });

              delete newObject.employees;
              return newObject;
            });
          }
        });
        if (newData.length > 0) {
          const properties = Object.keys(newData[0]);
          // Filter out columns for 'jobId' and 'userId'
          const newColDefs = properties
            .filter((property) => property !== "jobId" && property !== "userId")
            .map((property) => {
              return {
                field: property,
                valueGetter: (params) => {
                  // Customize value display for 'channels' field
                  if (property === "channels") {
                    // Extract channel types and join them with comma
                    return params.data.channels
                      .map((channel) => channel.channelType)
                      .join(", ");
                  }

                  return params.data[property]; // Default value getter for other fields
                },
              };
            });

          setRowData(newData);
          setColDefs(newColDefs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="ag-theme-alpine" style={{ width: "100%", height: "100%" }}>
      <AgGridReact rowData={rowData} columnDefs={colDefs} />
    </div>
  );
};

export default Jobs;
