import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react'; 
import 'ag-grid-community/styles/ag-grid.css'; 
import 'ag-grid-community/styles/ag-theme-quartz.css'; 

const DisplayGrid = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/data');
        setRowData(response.data); // Assuming the response.data is an array of objects

        if (response.data.length > 0) {
          const properties = Object.keys(response.data[0]);
          const newColDefs = properties.map(property => ({ field: property }));
          setColDefs(newColDefs);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);

  return (
    <div style={{
      width:"100%",height:"100%",
     padding: '30px',
      backgroundColor: '#053868' }}>
      <div
        className="ag-theme-quartz"
        style={{ height: '100%', width: '100%' }}
      >
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
      </div>
    </div>
  );
};

export default DisplayGrid;
