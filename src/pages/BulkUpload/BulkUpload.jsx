import React, { useState, useRef, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useToast } from '../../@/components/ui/use-toast';
import { RiFileDownloadFill } from "react-icons/ri";

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const BulkUpload = () => {
  const { toast } = useToast(); // Assuming useToast provides a toast function
  const [fileData, setFileData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
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
      const validatedData = validateData(jsonData);

      setFileData(validatedData);
      const rowsWithErrors = validatedData.filter(row => row.errors.length > 0);
      if(rowsWithErrors.length == 0)
    {
      toast({
        title: "File uploaded successfully!",
        description: "No errors found",
      });
    }
    else{
      toast({
        title: "File uploaded failed!",
        description: "Please correct errors and re-upload Excel",
      });
    }
      
    };

    reader.readAsArrayBuffer(file);
  };

  const validateData = (data) => {
    const requiredColumns = ['Name', 'Email', 'Phone']; // Removed 'Job_Id'
    const header = data[0];
    const emailSet = new Set();
    const phoneSet = new Set();
    const resultData = [];

    data.slice(1).forEach((row, index) => {
      const rowData = {
        RNo: index + 2, // Serial number starts from 1
        Name: row[0], // Adjusted index since Job_Id is removed
        Email: row[1],
        Phone: row[2],
        errors: [],
      };

      requiredColumns.forEach((col, colIndex) => {
        const value = row[colIndex];

        if (!value) {
          rowData.errors.push(`Invalid or missing '${col}'`);
        }

        if (col === 'Email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            rowData.errors.push(`Invalid email format`);
          } else if (emailSet.has(value)) {
            rowData.errors.push(`Duplicate email '${value}'`);
          } else {
            emailSet.add(value);
          }
        }

        if (col === 'Phone') {
          const phoneRegex = /^\+?[1-9]\d{1,14}$/;
          if (!phoneRegex.test(value)) {
            rowData.errors.push(`Invalid phone number format`);
          } else if (phoneSet.has(value)) {
            rowData.errors.push(`Duplicate phone number '${value}'`);
          } else {
            phoneSet.add(value);
          }
        }
      });

      resultData.push(rowData);
    });
    console.log(resultData)
    return resultData;
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/bulk_upload_template.xlsx';
    link.download = 'sample_template.xlsx';
    link.click();
  };

  const handleResetUpload = () => {
    setFileData([]);
    setDisplayData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input
    }
  };

  const clearFilters = () => {
    if (gridApiRef.current) {
      gridApiRef.current.setFilterModel(null); // Clear all filters
    }
  };

  const onGridReady = params => {
    gridApiRef.current = params.api;
  };

  useEffect(() => {
    const rowsWithErrors = fileData.filter(row => row.errors.length > 0);
    setDisplayData(rowsWithErrors.length > 0 ? rowsWithErrors : fileData);

    
  }, [fileData]);

  const columnDefs = useMemo(() => {
    const baseColumns = [
      { headerName: "Row No.", field: "RNo" },
      { headerName: "Name", field: "Name" },
      { headerName: "Email", field: "Email" },
      { headerName: "Phone", field: "Phone" }
    ];

    const errorColumn = {
      headerName: "Errors",
      field: "errors",
      cellRenderer: (params) => params.value.join(", "),
      cellStyle: (params) => (params.value.length > 0 ? { color: "red" } : {}),
      filter: true, // Enable filtering on this column
      sortable: true,
    };

    return [...baseColumns, errorColumn];
  }, [fileData]);

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  return (
    <div className='flex flex-col p-10 gap-10'>
      <div className='flex justify-center items-center'>
        <div className='flex flex-col justify-center items-center'>
          <RiFileDownloadFill className='text-7xl text-[#fc6d26] cursor-pointer' onClick={handleDownloadTemplate} />
          <div className="text-[#fc6d26] p-2 text-center cursor-pointer" onClick={handleDownloadTemplate}>Download Template</div>
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
            <button className="bg-[#053868] text-white py-2 px-2" onClick={() => {
                console.log(fileData)
                
              }}>Create Jobs</button>
            <button className="bg-[#053868] text-white py-2 px-2" onClick={clearFilters}>Clear Filters</button>
          </div>
        </div>
      </div>
      <div className='ag-theme-alpine' style={{ height: '500px', width: '100%' }}>
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={displayData}
          pagination={true}
          paginationPageSize={20}
          rowSelection="multiple"
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default BulkUpload;
