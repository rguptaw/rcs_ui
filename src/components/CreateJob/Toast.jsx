import { useEffect } from "react";

const Toast = ({ title, description, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    show && (
      <div className="fixed bottom-4 right-4 max-w-xs w-full bg-green-500 text-white rounded-lg shadow-lg z-50">
        <div className="p-4">
          <div className="font-bold">{title}</div>
          <div className="mt-1">{description}</div>
        </div>
      </div>
    )
  );
};

export default Toast;
