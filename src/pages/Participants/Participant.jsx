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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../@/components/ui/form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../@/components/ui/alert-dialog"

import { buttonVariants } from "../../@/components/ui/button";
import { Button } from "../../@/components/ui/button";
import { Input } from "../../@/components/ui/input";
import { Label } from "../../@/components/ui/label";
import { PersonIcon } from "@radix-ui/react-icons";
import { useToast } from "../../@/components/ui/use-toast";
import { ToastAction } from "../../@/components/ui/toast"
import { Description, Title } from "@radix-ui/react-dialog";

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
          <AlertDialogTitle>Delete Participant</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {props.data.name}?
          </AlertDialogDescription>
          <AlertDialogAction onClick={() => props.onDelete(props.data.recipientid)}>Delete</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
  );
};

const Participants = () => {
  
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
        "http://localhost:3000/addParticipant",
        data
      );
      toast({
        title:"Participant added succesfully",
        description: JSON.stringify(response.data),
      });
      fetchData();
    } catch (error) {
      // Display an alert with the error data and status code
      alert("Error adding participant:\n" + error.response + " - ");
      console.error("Error adding participant:", error);
    }
    
  }

  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/participants");
      setRowData(response.data);
      if (response.data.length > 0) {
        const properties = Object.keys(response.data[0]);
        const newColDefs = properties.map((property) => ({ field: property }));
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
      await axios.delete(`http://localhost:3000/participants/${id}`);
      setRowData((prevData) => prevData.filter((row) => row.id !== id));
      
      toast({
        title:"Deleted Successfully!",
        description: `Participant with ID ${id} has been deleted successfully.`,
      });
      fetchData();
    } catch (error) {
      toast({
        title:"Error Encountered!",
        description: `Error deleting participant. Check logs for more detail`,
      });
      console.error("Error deleting participant:", error);
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
            <Button style={{ width: "auto" }}>
              <PersonIcon className="mr-2 h-4 w-4" />
              Create New Participant
            </Button>
          </SheetTrigger>
          <SheetContent>
          <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-2/3 space-y-6"
              >
            <SheetHeader>
              <SheetTitle>Create Participant</SheetTitle>
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

export default Participants;
