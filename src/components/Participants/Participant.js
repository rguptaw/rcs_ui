import React, { useEffect, useState } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../@/components/ui/sheet"



const CustomButtonComponent = (props) => {
  const handleButtonClick = () => {
    if (window.confirm(`Are you sure you want to delete ${props.data.name}?`)) {
      props.onDelete(props.data.recipientid); // Assuming "id" is the unique identifier for each row
    }
  };

  return (
    <button 
      style={{ padding: '0px 8px', margin: '0',height:'35px',backgroundColor:'black' }} 
      onClick={handleButtonClick}
    >
      🗑️
    </button>
  );
};


const Participants = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/participants");
        console.log(response);
        setRowData(response.data); // Assuming the response.data is an array of objects
        
        // Generate column definitions dynamically based on the properties of the first item in the response
        if (response.data.length > 0) {
          const properties = Object.keys(response.data[0]);
          const newColDefs = properties.map(property => ({ field: property }));
          newColDefs.push({ 
            field: 'delete', 
            cellRenderer: CustomButtonComponent, // Assign cell renderer
            cellRendererParams: { onDelete: handleDelete } // Pass onDelete function as prop
          });
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

  // Function to handle row deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/participants/${id}`);
      // Remove the deleted row from rowData state
      setRowData(prevData => prevData.filter(row => row.id !== id));
      alert(`Participant with ID ${id} has been deleted successfully.`);
    } catch (error) {
      console.error("Error deleting participant:", error);
    }
  };

  return (
    // wrapping container with theme & size
    <div
      className="ag-theme-quartz" // applying the grid theme
      style={{ width: "100%", height: "100%" }} // the grid will fill the size of the parent container
    >
      <AgGridReact rowData={rowData} columnDefs={colDefs} />
      <Sheet>
      <SheetTrigger asChild>
        <button>asdomas</button>
      </SheetTrigger>
      <SheetContent>
        <p1>aloo lelo</p1>
      </SheetContent>
    </Sheet>
    </div>
  );
};

export default Participants;
