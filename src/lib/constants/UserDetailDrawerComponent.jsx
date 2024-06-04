import React, { useEffect, useState } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "src/@/components/ui/tooltip";
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerFooter,
    DrawerClose,
} from "src/@/components/ui/drawer";

const UserDetailDrawerComponent = ({ content , jobId}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [jobDetails, setJobDetails] = useState(null);
    // const jobId = 8;


    const handleClick = async () => {
        setIsDrawerOpen(true);
        try {
            const response = await fetch(`http://localhost:8080/jobs/${jobId}`);
            const data = await response.json();
            console.log(data);
            setJobDetails(data);
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

    useEffect(() => {
        if(isDrawerOpen){
            console.log("DRAWER OPENED!");
        }
    }, [isDrawerOpen]);

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };


    return (
        <div>
            <Drawer isOpen={isDrawerOpen} onClose={handleDrawerClose}>
                <DrawerTrigger onClick={handleClick}>
                    
                            <span>
                                {content}
                            </span>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <div className='align-middle justify-center text-center'>
                        <p className='text-3xl '>Job Detail : {jobId+""}</p>
                        </div>

                        <div className='justify-center text-center align-middle m-20'>
                            {JSON.stringify(jobDetails || "Loading")}
                        </div>
                    </DrawerHeader>
                    {/* <DrawerFooter>
                        <button>Submit</button>
                        <DrawerClose>
                            Close
                        </DrawerClose>
                    </DrawerFooter> */}
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default UserDetailDrawerComponent;