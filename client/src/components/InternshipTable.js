import React from 'react';

const InternshipTable = ({ internships }) => {
  console.log('Internships:', internships);
  return (
    <div className="p-2 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-2 text-center">Past Internships</h2>
      <div className="rounded-3xl overflow-hidden border border-gray-700">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-purple-custom text-white">
              <th className="border border-gray-500 px-4 py-2">Company</th>
              <th className="border border-gray-500 px-4 py-2">Location</th>
              <th className="border border-gray-500 px-4 py-2">Industry</th>
              <th className="border border-gray-500 px-4 py-2">Major</th>
              <th className="border border-gray-500 px-4 py-2">Term</th>
              <th className="border border-gray-500 px-4 py-2">Year</th>
              <th className="border border-gray-500 px-4 py-2">More Info</th>
            </tr>
          </thead>
          <tbody>
            {internships.map((internship, index) => (
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
                <td className="border border-gray-500 px-4 py-2">{internship.major}</td>
                <td className="border border-gray-500 px-4 py-2">{internship.term}</td>
                <td className="border border-gray-500 px-4 py-2">{internship.year}</td>
                <td className={`border border-gray-500 px-4 py-2 ${internship.moreinfo === '—' ? 'text-center' : ''}`}
                >{internship.moreinfo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InternshipTable;
