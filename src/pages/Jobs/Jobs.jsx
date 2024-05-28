import React, { useEffect, useState } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Cookies from 'js-cookie';
import { BiLoaderCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Jobs = () => {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);
  const [isLoader,SetIsLoader]=useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get("http://localhost:8080/jobs", config);
        SetIsLoader(false)
        console.log(response);
        let newData = response.data;
        if (newData.length > 0) {
          const properties = Object.keys(newData[0]);
          // Define the order of fixed columns
          const fixedColumnsOrder = ["name", "description", "rerun", "immediate", "jobTime", "status", "cost"];
          
          // Generate column definitions
          const newColDefs = fixedColumnsOrder.map((columnName) => {
            const property = properties.find(prop => prop === columnName);
            if (property) {
              // Customize value display for specific columns
              const valueGetter = (params) => {
                if (property === "jobTime") {
                  const date = new Date(params.data.jobTime);
                  return date.toLocaleString(); // Adjust formatting as needed
                }
                if (property === "channels") {
                  return params.data.channels.map(channel => channel.channelType).join(", ");
                }
                return params.data[property];
              };
          
              return {
                field: property,
                valueGetter: valueGetter,
                suppressMovable: true // Prevent column from being moved
              };
            }
            return null;
          }).filter(column => column !== null);
          
        
          setRowData(newData);
          setColDefs(newColDefs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        Cookies.remove("token");
        navigate("/authenticate?expiredCredentials");

      }
    };

    fetchData();
  }, []);

  return (
    <div className="ag-theme-alpine" style={{ width: "100%", height: "100%", position: "relative" }}>
      {isLoader && 
        <div className="absolute inset-0 flex items-center justify-center  bg-white">
          <div className="w-16 h-16 relative">
            <div className="absolute top-0 left-0 w-full h-full animate-spin rounded-full border-t-4 border-[#fc6d26]"></div>
          </div>
        </div>
      }
      {!isLoader && <AgGridReact rowData={rowData} columnDefs={colDefs} className="z-0" pagination={true}/>}
    </div>
  );
  
  
};

export default Jobs;
