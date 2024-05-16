import React, { useState } from "react";
import axios from "axios";
import "./CreateJob.css"; // Import CSS for styling
import { useToast } from "../../@/components/ui/use-toast";
import { ToastAction } from "../../@/components/ui/toast"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "../../@/components/ui/sheet"
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
import { Description, Title } from "@radix-ui/react-dialog";
const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().min(2, {
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
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Participant</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {props.data.name}?
          </AlertDialogDescription>
          <AlertDialogAction onClick={() => props.onDelete(props.data.id)}>Delete</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
  );
};

const CreateJob = ({ onCreateJob }) => {
  const {toast} = useToast();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      phonenumber: ""
    },
  });

  const [jobData, setJobData] = useState({
    name: "",
    description: "",
    jobTime: "",
    isImmediate: false,
    rerun: false,
    channel_types: "",
    recipients: []
  });

  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setJobData({ ...jobData, [name]: newValue });
  };


  // const handleSubmitUser = () => {
  //   // Logic to submit the user form data and add the user to the recipients list
  //   // Add the userFormData to the recipients list in jobData
  //   setJobData({ ...jobData, recipients: [...jobData.recipients, userFormData] });
  //   // Clear the user form data
  //   setUserFormData({
  //     name: "",
  //     email: "",
  //     phone: ""
  //   });
  //   toast({
  //   title:"Job User created successfully", // Display toast message for successful user creation
  //   description: "New job user has been added.",
  //   });
  // };

  const onSubmit = async (data) => {
    console.log("Trying to add a new user");
    console.log(data);
    try {
      setJobData({ ...jobData, recipients: [...jobData.recipients, data] });
      // Clear the user form data
      setUserFormData({
        name: "",
        email: "",
        phone: ""
      });
      toast({
      title:"Job User created successfully", // Display toast message for successful user creation
      description: "New job user has been added.",
      });
     
    } catch (error) {
      // Display an alert with the error data and status code
      alert("Error adding participant:\n" + error.response + " - ");
      console.error("Error adding participant:", error);
    }
    finally{
      console.log(jobData);
    }
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();
    try {
      // Send the job data to the server
      await axios.post("https://localhost:443/jobs", jobData);
      // Clear the form after successful submission
      setJobData({
        name: "",
        description: "",
        jobTime: "",
        isImmediate: false,
        rerun: false,
        channel_types: "",
        recipients: []
      });
      toast({
        title:"Job created successfully", // Display toast message for successful job creation
        description: "New job has been added.",
      });
      // Trigger a callback to notify the parent component about the creation of a new job
      
    } catch (error) {
      alert("Error adding job:\n" + error.response + " - ");
      console.error("Error creating job:", error);
    }
  };

  return (
    <div className="form-container">
      <b>Create New Job</b>
      <form onSubmit={handleSubmitJob} className="job-form">
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={jobData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={jobData.description} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Job Time:</label>
          <input type="datetime-local" name="jobTime" value={jobData.jobTime} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Is Immediate:</label>
          <input type="checkbox" name="isImmediate" checked={jobData.isImmediate} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Rerun:</label>
          <input type="checkbox" name="rerun" checked={jobData.rerun} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Channel Types:</label>
          <input type="text" name="channel_types" value={jobData.channel_types} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Recipients:</label>
          <ul>
            {jobData.recipients.map((recipient, index) => (
              <li key={index}>{recipient.name} - {recipient.email} - {recipient.phone}</li>
            ))}
          </ul>
        </div>
        <div className="form-group">
        <Sheet>
          <SheetTrigger asChild>
            <Button style={{ width: "auto", backgroundColor: "#007bff" }}>
              <PersonIcon className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </SheetTrigger>
          <SheetContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-2/3 space-y-6"
              >
                <SheetHeader>
                  <SheetTitle>Add User</SheetTitle>
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
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
                    <Button type="submit" onClick={form.handleSubmit(onSubmit)} style={{ width: "auto" }}>Submit</Button>
                  </SheetClose>
                </SheetFooter>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
        </div>
        <button type="submit">Create Job</button>
      </form>
    </div>
  );
};

export default CreateJob;
