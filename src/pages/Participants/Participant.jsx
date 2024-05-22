
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../@/components/ui/sheet";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../@/components/ui/form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../@/components/ui/alert-dialog"

import { Button } from "../../@/components/ui/button";
import { Input } from "../../@/components/ui/input";
import { PersonIcon } from "@radix-ui/react-icons";
import { useToast } from "../../@/components/ui/use-toast";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  phonenumber: z.string().min(10, {
    message: "Phone Number must be 10 digits long"
  })
});

const CustomButtonComponent = (props) => {

  return (
    <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            style={{
              padding: "0px 8px",
              margin: "0",
              height: "35px",
              backgroundColor: "black",
              border: "none",
              cursor: "pointer"
            }}
          >
            🗑️
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {props.data.name}?
          </AlertDialogDescription>
          <AlertDialogAction onClick={() => props.onDelete(props.data.id)}>Delete</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
  );
};

const JobUsers = () => {
  
  const {toast} = useToast();
  useEffect(() => {
    fetchData();
  }, []);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      phonenumber: ""
    },
  });

  async function onSubmit(data) {
    try {
      const response = await axios.post(
        "http://localhost:3000/addUser",
        data
      );
      toast({
        title:"User added succesfully",
        description: JSON.stringify(response.data),
      });
      fetchData();
    } catch (error) {
      // Display an alert with the error data and status code
      alert("Error adding User:\n" + error.response + " - ");
      console.error("Error adding User:", error);
    }
    
  }

  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://localhost:443/job_users");
      const modifiedData = response.data.map((user) => ({
        ...user,
        job: user.job.name, // Accessing the name property directly from the job object
      }));
      console.log("Modified Data:", modifiedData); // Log modifiedData
      setRowData(modifiedData);
      if (modifiedData.length > 0) {
        const properties = Object.keys(modifiedData[0]);
        const newColDefs = properties.map((property) => ({
          field: property === "job" ? "job" : property, // Just use "job" for the field
        }));
        newColDefs.push({
          field: "delete",
          cellRenderer: CustomButtonComponent,
          cellRendererParams: { onDelete: handleDelete },
        });
        setColDefs(newColDefs);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  


  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:443/job_users/${id}`);
      setRowData((prevData) => prevData.filter((row) => row.id !== id));
      
      toast({
        title:"Deleted Successfully!",
        description: `User with ID ${id} has been deleted successfully.`,
      });
      fetchData();
    } catch (error) {
      toast({
        title:"Error Encountered!",
        description: `Error deleting User. Check logs for more detail`,
      });
      console.error("Error deleting User:", error);
    }
  };


  return (
    <div style={{ position: "relative", width: "100%", height: "100%" ,padding: '30px',
    backgroundColor: '#053868',
   display:"flex",
    flexDirection:"column",
    alignItems:"center",
      gap:"2%"}}
    >
      <h2 style={{color:"white"}}>Participants</h2>
      <div className="ag-theme-quartz" style={{ width: "100%", height: "80%" }}>
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "120px",
          zIndex: "1",
        }}
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button style={{ width: "auto", backgroundColor: "red" }}>
              <PersonIcon className="mr-2 h-4 w-4" />
              Create New User
            </Button>
          </SheetTrigger>
          <SheetContent>
          <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-2/3 space-y-6"
              >
            <SheetHeader>
              <SheetTitle>Create User</SheetTitle>
            </SheetHeader>
            
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    
                  )}
                />
                <FormField
                  control={form.control}
                  name="phonenumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="90102 25250" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    
                  )}
                />
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" style={{ width: "auto" }}>Submit</Button>
              </SheetClose>
            </SheetFooter>
            
            </form>
            </Form>
          </SheetContent>
        </Sheet>
        
      </div>
    </div>
  );
};

export default JobUsers;
