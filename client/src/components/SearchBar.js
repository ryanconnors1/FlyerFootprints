import React, { useState } from 'react';
import Select from 'react-select';

const SearchBar = ({ onSearch }) => {
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState(null);
  const [major, setMajor] = useState(null);
  const [term, setTerm] = useState('');

  const industries = [
    { value: 'Construction', label: 'Construction' },
    { value: 'Education', label: 'Education' },
    { value: 'Energy & Utilities', label: 'Energy & Utilities' },
    { value: 'Entertainment & Media', label: 'Entertainment & Media' },
    { value: 'Financial Services & Accounting', label: 'Financial Services & Accounting' },
    { value: 'Government & Public Services', label: 'Government & Public Services' },
    { value: 'Health & Human Services', label: 'Health & Human Services' },
    { value: 'Hospitality', label: 'Hospitality' },
    { value: 'International Business', label: 'International Business' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Real Estate', label: 'Real Estate' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Sports & Recreation', label: 'Sports & Recreation' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Telecommunications', label: 'Telecommunications' },
    { value: 'Transportation', label: 'Transportation' },
  ];

  const majors = [
    { value: 'Accounting', label: 'Accounting' },
    { value: 'Business Leadership', label: 'Business Leadership' },
    { value: 'Business, AI & Innovation', label: 'Business, AI & Innovation' },
    { value: 'Digital Marketing Strategy', label: 'Digital Marketing Strategy' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Music Business', label: 'Music Business' },
    { value: 'SPARK', label: 'SPARK' },
    { value: 'Sports & Entertainment Management', label: 'Sports & Entertainment Management' },
    { value: 'Technology, AI & Society', label: 'Technology, AI & Society' }
  ];

  const terms = ['Fall Semester', 'Spring Semester', 'Summer'];

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
      <div>
        <label>Company</label>
        <input
          type="text"
          placeholder="Search by company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      <div>
        <label>Location</label>
        <input
          type="text"
          placeholder="Search by location (city and/or state)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div>
        <label>Industry</label>
        <Select
          options={industries}
          value={industry}
          onChange={setIndustry}
          placeholder="Select an industry"
          isClearable
        />
      </div>
      <div>
        <label>Major</label>
        <Select
          options={majors}
          value={major}
          onChange={setMajor}
          placeholder="Select a major"
          isClearable
          isSearchable
        />
      </div>
      <div>
        <label>Term</label>
        <select value={term} onChange={(e) => setTerm(e.target.value)}>
          <option value="">Select a term</option>
          {terms.map((termOption) => (
            <option key={termOption} value={termOption}>
              {termOption}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleSearch} className='bg-purple-custom hover:bg-purple-500 text-white font-bold py-2 px-4 rounded'>Search
      </button>
    </div>
  );
};

export default SearchBar;
