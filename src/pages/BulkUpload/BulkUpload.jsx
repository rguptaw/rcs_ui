import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {useToast} from '../../@/components/ui/use-toast';
import { IoIosDownload } from "react-icons/io";

const BulkUpload = () => {
  const { toast } = useToast(); // Assuming useToast provides a toast function
  const [fileData, setFileData] = useState(null);
  const fileInputRef = React.createRef();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[1]; // Corrected the index here
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const { valid, errors } = validateData(jsonData);

      if (valid) {
        setFileData(jsonData);
        toast({
          title: "File uploaded successfully!",
          description: "Your file has been uploaded successfully.",
        });
      } else {
        setFileData(null); 
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset the file input
        } 
        toast({
          title: "Validation failed",
          description: "Missing data or Improper Format",
        });
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const validateData = (data) => {
    const errors = [];
    const requiredColumns = ['Job_Id', 'Name', 'Email', 'Phone'];
    const header = data[0];
  
    // Check if all required columns are present in the header
    console.log(header);
    requiredColumns.forEach((col) => {
      console.log(col);
      console.log("Checking column:", col);
      if (!header.includes(col.trim())) {
        console.log("Missing column:", col);
        errors.push(`Missing required column: ${col}`);
      }
    });
    
    // If there's only one row of data, add a warning
    if (data.length === 1) {
      errors.push(`Only one row of data found. At least two rows of data are recommended.`);
    }
  
    // If there's more than one row of data, validate each row
    if (data.length > 1) {

      data.slice(1).forEach((row, index) => {
        const rowIndex = index + 1; // Account for the header row
  
        // Validate each column of the row
        requiredColumns.forEach((col) => {
          const colIndex = header.indexOf(col);
          const value = row[colIndex];
  
          // Check for missing or invalid values
          if (!value) {
            errors.push(`Invalid or missing '${col}' at row ${rowIndex}: must be a non-empty string`);
          }
  
          // Additional validation for 'Email' column
          if (col === 'Email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
              errors.push(`Invalid email format in 'Email' column at row ${rowIndex}`);
            }
          }
  
          // Additional validation for 'Phone' column
          if (col === 'Phone') {
            const phoneRegex = /^\+?[1-9]\d{1,14}$/;
            if (!phoneRegex.test(value)) {
              errors.push(`Invalid phone number format in 'Phone' column at row ${rowIndex}`);
            }
          }
        });
      });
    }
  
    return { valid: errors.length === 0, errors };
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/bulk_upload_template.xlsx';
    link.download = 'sample_template.xlsx';
    link.click();
  };

  const handleResetUpload = () => {
    setFileData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input
    }
  };

  return (
    <div className='flex p-10 gap-10  '>
      <div className='flex flex-col items-center ' >
      <IoIosDownload  className='text-6xl text-[#fc6d26] cursor-pointer ' onClick={handleDownloadTemplate}/>
      <div  className=" text-[#fc6d26] p-2 cursor-pointer" onClick={handleDownloadTemplate}>Download Template </div>
     
      </div>
      <div className='flex flex-col gap-4'>
      <h2>Upload Excel File</h2>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        ref={fileInputRef}
      />
      
       <button  className=" bg-[#053868] text-white py-2 px-0 "onClick={handleResetUpload}>Reset Upload</button>
       </div>
       </div>
  );
};

export default BulkUpload;
