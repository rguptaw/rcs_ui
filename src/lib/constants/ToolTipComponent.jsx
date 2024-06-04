import React, { useState } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "src/@/components/ui/tooltip";

const ToolTipComponent = ({ name }) => {
    const [isTooltipVisible, setTooltipVisible] = useState(false);

    const handleMouseEnter = () => {
        setTooltipVisible(true);
    };

    const handleMouseLeave = () => {
        setTooltipVisible(false);
    };
    return (
        <div>
        
            <Tooltip isOpen={isTooltipVisible}>
                <TooltipTrigger>
                    <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        {name}
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{name}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
};

export default ToolTipComponent;