import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const SearchBar = ({ onSearch }) => {
  const [company, setCompany] = useState(null);
  const [location, setLocation] = useState(null);
  const [industry, setIndustry] = useState(null);
  const [major, setMajor] = useState(null);
  const [term, setTerm] = useState(null);

  const [industries, setIndustries] = useState([]);
  const [majors, setMajors] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [terms, setTerms] = useState([]);

  useEffect(() => {
    const fetchAttributes = async (column, setter) => {
      try {
        const response = await fetch(`/attributes/${column}`);
        const data = await response.json();
        const options = data.map((value) => ({ value, label: value }));
        setter(options);
      } catch (error) {
        console.error(`Error fetching ${column} options:`, error);
      }
    };

    fetchAttributes('industry', setIndustries);
    fetchAttributes('major', setMajors);
    fetchAttributes('company', setCompanies);
    fetchAttributes('location', setLocations);
    fetchAttributes('terms', setTerms);
  }, []);

  const handleSearch = () => {
    onSearch({
      company,
      location,
      industry: industry?.value || '',
      major: major?.value || '',
      term,
    });
  };

  return (
    <div className="search-bar">
      <img
        src="./naz-logo.png"
        alt="Naz Logo"
        className="absolute top-40 right-20 mr-24 w-50 h-50"
      />
      <div className="ml-2 mb-2 w-1/3">
        <label>Company</label>
        <Select
          options={companies}
          value={company}
          onChange={(selected) => setCompany(selected?.value || '')}
          placeholder="Search by company"
          isClearable
          isSearchable
        />
      </div>
      <div className="ml-2 mb-2 w-1/3">
        <label>Location</label>
        <Select
          options={locations}
          value={location}
          onChange={(selected) => setLocation(selected?.value || '')}
          placeholder="Search by location"
          isClearable
          isSearchable
        />
      </div>
      <div className="ml-2 mb-2 w-1/3">
        <label>Industry</label>
        <Select
          options={industries}
          value={industry}
          onChange={(selected) => setIndustry(selected?.value || '')}
          placeholder="Select an industry"
          isClearable
          isSearchable
        />
      </div>
      <div className="ml-2 mb-2 w-1/3">
        <label>Major</label>
        <Select
          options={majors}
          value={major}
          onChange={(selected) => setMajor(selected?.value || '')}
          placeholder="Select a major"
          isClearable
          isSearchable
        />
      </div>
      <div className="ml-2 mb-2 w-1/3">
        <label className="block text-gray-700">Term</label>
        <Select
          options={terms}
          value={terms.find((option) => option.value === term)}
          onChange={(selected) => setTerm(selected?.value || '')}
          placeholder="Select a term"
          isClearable
          isSearchable
        />
      </div>
      <button
        onClick={handleSearch}
        className="bg-purple-custom hover:bg-purple-500 text-white font-bold py-2 px-4 rounded mt-2 ml-2"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
