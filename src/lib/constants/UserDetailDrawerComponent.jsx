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
    DrawerTitle,
    DrawerDescription,
    DrawerHeader,
    DrawerFooter,
    DrawerClose,
} from "src/@/components/ui/drawer";

const UserDetailDrawerComponent = ({ content, jobId }) => {
    const [isTooltipVisible, setTooltipVisible] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [jobDetails, setJobDetails] = useState(null);

    const handleMouseEnter = () => {
        setTooltipVisible(true);
    };

    const handleMouseLeave = () => {
        setTooltipVisible(false);
    };

    const handleClick = () => {
        setIsDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/jobs/${jobId}`);
                if (!response.ok) {
                    throw new Error(`Error fetching job details: ${response.statusText}`);
                }
                const data = await response.json();
                setJobDetails(data);
            } catch (error) {
                console.error('Error fetching job details:', error);
            }
        };

        if (isDrawerOpen && jobId) {
            fetchData();
        }
    }, [isDrawerOpen, jobId]);


    return (
        <div>
             <Drawer isOpen={isDrawerOpen} onClose={handleDrawerClose}>
                <DrawerTrigger >
            <Tooltip isOpen={isTooltipVisible}>
                <TooltipTrigger>
                    <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick} style={{ cursor: 'pointer' }}>
                        {content}
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{content}</p>
                </TooltipContent>
            </Tooltip>
           </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Job Details</DrawerTitle>
                        <DrawerDescription>Details about the selected job.</DrawerDescription>
                    </DrawerHeader>
                    <div>
                        {jobDetails ? (
                            <div>
                                <p><strong>Job Name:</strong> {jobDetails.name}</p>
                                <p><strong>Participants:</strong> {jobDetails.participants.join(', ')}</p>
                                {/* Add more job details as needed */}
                            </div>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                    <DrawerFooter>
                        <DrawerClose>
                            <button onClick={handleDrawerClose} variant="outline">Close</button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default UserDetailDrawerComponent;
