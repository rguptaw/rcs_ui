import { useEffect } from "react";

const Toast = ({ title, description, show, onClose, failed = false }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); 
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const toastClass = failed ? 'bg-red-500' : 'bg-green-500';

  return (
    show && (
      <div className={`fixed bottom-4 right-4 max-w-xs w-full ${toastClass} text-white rounded-lg shadow-lg z-50`}>
        <div className="p-4">
          <div className="font-bold">{title}</div>
          <div className="mt-1">{description}</div>
        </div>
      </div>
    )
  );
};

export default Toast;
