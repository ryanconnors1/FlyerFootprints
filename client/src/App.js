import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import InternshipTable from './components/InternshipTable';
import Modal from './components/Modal';

const App = () => {
  // State to hold search and filter results
  const [internships, setInternships] = useState([]);

  const handleSearch = async (searchParams) => {
    try {
      const query = new URLSearchParams(searchParams).toString();
      const response = await fetch(`/internships?${query}`);
      const data = await response.json();
      setInternships(data);
    } catch (error) {
        console.error('Error fetching internships:', error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);  

  return (
    <div className="App">
      <header className="bg-purple-800 text-gold-custom p-4 text-center">
        <h1 className="text-5xl font-semibold font-serif">Flyer Footprints</h1>
      </header>
      <main className="p-4">
        <Modal />
        <SearchBar onSearch={handleSearch} />
        <InternshipTable internships={internships} />
      </main>
    </div>
  );
};

export default App;
