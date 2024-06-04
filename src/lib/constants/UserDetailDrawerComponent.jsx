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

const UserDetailDrawerComponent = ({ content }) => {
    const [isTooltipVisible, setTooltipVisible] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [jobDetails, setJobDetails] = useState(null);
    const jobId = 8;

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
                <DrawerTrigger>
                    <Tooltip isOpen={isTooltipVisible}>
                        <TooltipTrigger>
                            <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
                        <p></p>
                    </DrawerHeader>
                    <DrawerFooter>
                        <button>Submit</button>
                        <DrawerClose>
                            <button variant="outline">Cancel</button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default UserDetailDrawerComponent;