import { React, useState }from 'react';

const Modal = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    
    const closeModal = () => {
        setIsModalOpen(false);
      };
  return (
    <>
    {isModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-purple-custom p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Welcome to Flyer Footprints!</h2>
        <p className="text-gray-700 mb-6">
          This tool helps you explore internships.
        </p>
        <button
              onClick={closeModal}
              className="bg-purple-custom hover:bg-purple-500 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
      </div>
    </div>
  )};
  </>
  );
};
export default Modal;
