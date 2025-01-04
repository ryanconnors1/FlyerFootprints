import React, { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import InternshipTable from './components/InternshipTable';

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

  return (
    <div className="App">
      <header className="bg-purple-800 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Flyer Footprints</h1>
      </header>
      <main className="p-4">
        <SearchBar onSearch={handleSearch} />
        <InternshipTable internships={internships} />
      </main>
    </div>
  );
};

export default App;
