import React, { useEffect, useState } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid

const DisplayGrid = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/meetings");
        console.log(response);
        setRowData(response.data); // Assuming the response.data is an array of objects
        
        // Generate column definitions dynamically based on the properties of the first item in the response
        if (response.data.length > 0) {
          const properties = Object.keys(response.data[0]);
          const newColDefs = properties.map(property => ({ field: property }));
          setColDefs(newColDefs);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState([]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([]);

  return (
    // wrapping container with theme & size
    <div
      className="ag-theme-quartz" // applying the grid theme
      style={{ width: "100%", height: "100%" }} // the grid will fill the size of the parent container
    >
      <AgGridReact rowData={rowData} columnDefs={colDefs} />
    </div>
  );
};

export default DisplayGrid;
