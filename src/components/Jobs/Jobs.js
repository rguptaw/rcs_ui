import React, { useEffect, useState } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const Jobs = () => {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:443/jobs");
        console.log("Response:", response);

        if (response.data.length > 0) {
          const properties = Object.keys(response.data[0]);
          console.log("Properties:", properties);

          // Filter out columns for 'jobId' and 'userId'
          const newColDefs = properties
            .filter((property) => property !== "jobId" && property !== "userId")
          //   .map((property) => ({ field: property }));
          // console.log("Column Definitions:", newColDefs);
          .map((property) => ({
            field: property,
            valueGetter: (params) => {
              // Customize value display for 'channels' field
              if (property === "channels") {
                // Extract channel types and join them with comma
                return params.data.channels.map((channel) => channel.channelType).join(", ");
              }
              return params.data[property]; // Default value getter for other fields
            },
          }));
          console.log("Column Definitions:", newColDefs);

          setRowData(response.data);
          setColDefs(newColDefs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="ag-theme-quartz" style={{ width: "100%", height: "100%" }}>
      <AgGridReact rowData={rowData} columnDefs={colDefs} />
    </div>
  );
};

export default Jobs;