import React, { useEffect, useState } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const CombinedData = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:443/jobs/combined");
        console.log(response.data);

        // Extracting relevant data fields from the API response
        const formattedData = response.data.map(job => ({
          jobName: job.name,
          description: job.description,
          cost: job.cost,
          jobTime: job.jobTime,
          jobStatus: job.status,
          rerun: job.rerun,
          immediate: job.immediate,
          responseStatus: job.responseStatus,
          sentTime: job.sentTime,
          responded: job.responded,
          lifted: job.lifted,
          employeeName: job.employee.name,
          employeeEmail: job.employee.email,
          employeePhone: job.employee.phone,
          channelType: job.channels.map(channel => channel.type).join(', ') // Assuming channels is an array of objects with 'type' field
        }));

        setRowData(formattedData);

        // Define column definitions for AG Grid in the desired order
        const columnDefs = [
          { headerName: "Job Name", field: "jobName" },
          { headerName: "Description", field: "description" },
          { headerName: "Cost", field: "cost" },
          { headerName: "Job Time", field: "jobTime" },
          { headerName: "Job Status", field: "jobStatus" },
          { headerName: "Rerun", field: "rerun" },
          { headerName: "Immediate", field: "immediate" },
          { headerName: "Response Status", field: "responseStatus" },
          { headerName: "Sent Time", field: "sentTime" },
          { headerName: "Responded", field: "responded" },
          { headerName: "Lifted", field: "lifted" },
          { headerName: "Employee Name", field: "employeeName" },
          { headerName: "Employee Email", field: "employeeEmail" },
          { headerName: "Employee Phone", field: "employeePhone" },
          { headerName: "Channel Type", field: "channelType" }
        ];

        setColDefs(columnDefs);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);

  return (
    <div
      className="ag-theme-quartz"
      style={{ width: "100%", height: "100%" }}
    >
      <AgGridReact rowData={rowData} columnDefs={colDefs} />
    </div>
  );
};

export default CombinedData;
