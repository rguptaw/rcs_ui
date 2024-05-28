import React, { useState, useRef, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { useToast } from '../../@/components/ui/use-toast';
import { IoIosDownload } from "react-icons/io";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const BulkUpload = () => {
  const { toast } = useToast(); // Assuming useToast provides a toast function
  const [fileData, setFileData] = useState([]);
  const fileInputRef = useRef();
  const gridApiRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[1]; // corrected index
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const { valid, errors } = validateData(jsonData);

      if (valid) {
        setFileData(jsonData.slice(1).map((row, index) => ({
          id: index,
          Job_Id: row[0],
          Name: row[1],
          Email: row[2],
          Phone: row[3],
        }))); // Exclude header row
        toast({
          title: "File uploaded successfully!",
          description: "Your file has been uploaded successfully.",
        });
      } else {
        setFileData([]);
        console.log(errors);
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset the file input
        }
        toast({
          title: "Validation failed",
          description: `Missing data or Improper Format ${errors[0]}`,
        });
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const validateData = (data) => {
    const errors = [];
    const requiredColumns = ['Job_Id', 'Name', 'Email', 'Phone'];
    const header = data[0];
    const emailSet = new Set();
    const phoneSet = new Set();

    requiredColumns.forEach((col) => {
      if (!header.includes(col.trim())) {
        errors.push(`Missing required column: ${col}`);
      }
    });

    if (data.length === 1) {
      errors.push(`Only one row of data found. At least two rows of data are recommended.`);
    }

    if (data.length > 1) {
      data.slice(1).forEach((row, index) => {
        const rowIndex = index + 1;

        requiredColumns.forEach((col) => {
          const colIndex = header.indexOf(col);
          const value = row[colIndex];

          if (!value) {
            errors.push(`Invalid or missing '${col}' at row ${rowIndex}: must be a non-empty string`);
          }

          if (col === 'Email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
              errors.push(`Invalid email format in 'Email' column at row ${rowIndex}`);
            } else {
              if (emailSet.has(value)) {
                errors.push(`Duplicate email '${value}' found at row ${rowIndex}`);
              } else {
                emailSet.add(value);
              }
            } 
          }

          if (col === 'Phone') {
            const phoneRegex = /^\+?[1-9]\d{1,14}$/;
            if (!phoneRegex.test(value)) {
              errors.push(`Invalid phone number format in 'Phone' column at row ${rowIndex}`);
            } else {
              if (phoneSet.has(value)) {
                errors.push(`Duplicate phone number '${value}' found at row ${rowIndex}`);
              } else {
                phoneSet.add(value);
              }
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
    setFileData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input
    }
  };

  const handleDeleteSelected = () => {
    const selectedNodes = gridApiRef.current.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    const remainingData = fileData.filter(row => !selectedData.includes(row));
    setFileData(remainingData);
  };

  const onGridReady = params => {
    gridApiRef.current = params.api;
  };

  const onCellValueChanged = useCallback((params) => {
    const updatedData = [...fileData];
    const rowIndex = params.node.rowIndex;
    updatedData[rowIndex] = { ...updatedData[rowIndex], ...params.data };
    setFileData(updatedData);
  }, [fileData]);


  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      width: 50,
    },
    { headerName: 'Job_Id', field: 'Job_Id', editable: true },
    { headerName: 'Name', field: 'Name', editable: true },
    { headerName: 'Email', field: 'Email', editable: true },
    { headerName: 'Phone', field: 'Phone', editable: true },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  return (
    <div className='flex flex-col p-10 gap-10'>
      <div className='flex' >
      <div className='flex flex-col'>
        <IoIosDownload className='text-6xl text-[#fc6d26] cursor-pointer' onClick={handleDownloadTemplate} />
        <div className="text-[#fc6d26] p-2 cursor-pointer" onClick={handleDownloadTemplate}>Download Template</div>
      </div>
      <div className='flex flex-col gap-4 w-screen'>
        <h2>Upload Excel File</h2>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          ref={fileInputRef}
        />
<div className='flex justify-between'> 
        <button className="bg-[#053868] text-white py-2 px-2" onClick={handleResetUpload}>Reset Upload</button>
       <div className='flex gap-4'>
        <button className="bg-red-600 text-white py-2 px-2 " onClick={handleDeleteSelected}>Delete Selected</button>
        <button className="bg-[#053868] text-white py-2 px-2 " onClick={()=>{
          console.log(fileData)
          handleResetUpload()
        }}>Create Jobs</button>
        </div>
      </div>
       </div>
      </div>
      <div className='ag-theme-alpine' style={{ height: '500px', width: '100%' }}>
      <AgGridReact
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowData={fileData}
        pagination={true}
        paginationPageSize={20}
        rowSelection="multiple"
        onGridReady={onGridReady}
        onCellValueChanged={onCellValueChanged}
      />

      </div>
    </div>
  );
};

export default BulkUpload
