import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(faTrash, faTimes);

const Modal = ({ isOpen, onClose, handleDelete, recipients }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
      <div className="bg-white p-6 rounded-lg shadow-lg z-10 max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
        </button>
        <h2 className="text-xl font-semibold mb-4">All Recipients</h2>
        <ul>
          {recipients.map((recipient, index) => (
            <li key={index} className="mb-2 flex justify-between items-center">
              <span>{recipient.name} - {recipient.email} - {recipient.phone}</span>
              <button
                onClick={() => handleDelete(recipient)}
                className="ml-4 text-red-600"
              >
                <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Modal;


