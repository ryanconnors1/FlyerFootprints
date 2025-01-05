import React from 'react';

const InternshipTable = ({ internships }) => {
  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Past Internships</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-purple-custom text-white">
            <th className="px-4 py-2">Company</th>
            <th className="px-4 py-2">More Info</th>
            <th className="px-4 py-2">Location</th>
            <th className="px-4 py-2">Industry</th>
            <th className="px-4 py-2">Major</th>
            <th className="px-4 py-2">Term</th>
            <th className="px-4 py-2">Year</th>
          </tr>
        </thead>
        <tbody>
          {internships.map((internship, index) => (
            <tr
              key={internship.id}
              className={index % 2 === 0 ? 'bg-gold-custom text-purple-custom' : 'bg-purple-custom text-gold-custom'}

            >
              <td className="border px-4 py-2">{internship.company}</td>
              <td className="border px-4 py-2">{internship.moreInfo}</td>
              <td className="border px-4 py-2">{internship.location}</td>
              <td className="border px-4 py-2">{internship.industry}</td>
              <td className="border px-4 py-2">{internship.major}</td>
              <td className="border px-4 py-2">{internship.term}</td>
              <td className="border px-4 py-2">{internship.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InternshipTable;
