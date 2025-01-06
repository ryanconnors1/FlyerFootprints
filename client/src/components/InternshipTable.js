import React, { useState } from 'react';

const InternshipTable = ({ internships }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedInternships = [...internships].sort((a, b) => {
    if (!sortConfig.key){
      const aVal = a['year']?.toString().toLowerCase() || '';
      const bVal = b['year']?.toString().toLowerCase() || '';
      if (aVal < bVal) return 1;
      else if (aVal > bVal) return -1;
      return 0;
    }
    const aVal = a[sortConfig.key]?.toString().toLowerCase() || '';
    const bVal = b[sortConfig.key]?.toString().toLowerCase() || '';
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    else if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="p-2 overflow-x-auto">
      <h2 className="text-3xl font-semibold text-center">Past Internships</h2>
      <h4 className="mb-2 text-center">(Click to sort by column)</h4>
      <div className="rounded-3xl overflow-hidden border border-gray-700 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-purple-custom text-white">
              <th
                className="border border-gray-500 hover:bg-purple-500 px-4 py-2 cursor-pointer"
                onClick={() => handleSort('company')}
              >
                Company {sortConfig.key === 'company' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th
                className="border border-gray-500 hover:bg-purple-500 px-4 py-2 cursor-pointer"
                onClick={() => handleSort('location')}
              >
                Location {sortConfig.key === 'location' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th
                className="border border-gray-500 hover:bg-purple-500 px-4 py-2 cursor-pointer"
                onClick={() => handleSort('industry')}
              >
                Industry {sortConfig.key === 'industry' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th
                className="border border-gray-500 hover:bg-purple-500 px-4 py-2 cursor-pointer"
                onClick={() => handleSort('major')}
              >
                Major {sortConfig.key === 'major' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th
                className="border border-gray-500 hover:bg-purple-500 px-4 py-2 cursor-pointer"
                onClick={() => handleSort('term')}
              >
                Term {sortConfig.key === 'term' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th
                className="border border-gray-500 hover:bg-purple-500 px-4 py-2 cursor-pointer"
                onClick={() => handleSort('year')}
              >
                Year {sortConfig.key === 'year' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th
                className="border border-gray-500 hover:bg-purple-500 px-4 py-2 cursor-pointer"
                onClick={() => handleSort('moreinfo')}
              >
                More Info {sortConfig.key === 'moreinfo' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedInternships.map((internship, index) => (
              <tr
                key={internship.id}
                className={
                  index % 2 === 0
                    ? 'bg-gold-custom text-purple-custom'
                    : 'bg-purple-custom text-gold-custom'
                }
              >
                <td className="border border-gray-500 px-4 py-2">{internship.company}</td>
                <td className="border border-gray-500 px-4 py-2">{internship.location}</td>
                <td className="border border-gray-500 px-4 py-2">{internship.industry}</td>
                <td className="border border-gray-500 px-4 py-2 ">{internship.major}</td>
                <td className="border border-gray-500 px-4 py-2">{internship.term}</td>
                <td className="border border-gray-500 px-4 py-2">{internship.year}</td>
                <td className={`border border-gray-500 px-4 py-2 ${internship.moreInfo ? '' : 'text-center'}`}> {internship.moreinfo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InternshipTable;
