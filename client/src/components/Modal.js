import React, { useState } from 'react';

const Modal = () => {
    // Set the initial state of the modal to open
    const [isModalOpen, setIsModalOpen] = useState(true);
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Welcome to Flyer Footprints!</h2>
                        <p className="text-gray-700 mb-6">
                            This tool helps you explore the past internships of Nazareth University students. You can apply filters to search for internships by company, location, industry, major, and/or term. Click on the column headers to sort the table (once for ascending or twice for descending).
                        </p>
                        <button
                            onClick={closeModal}
                            className="bg-purple-custom hover:bg-purple-500 text-white font-bold py-2 px-4 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;
