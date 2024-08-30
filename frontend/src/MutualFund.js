import React, { useState, useEffect } from 'react';

// Reusable component for fund selection buttons
function FundButtons({ onSelect }) {
  return (
    <div className="mb-4">
      <button className="mr-2 py-2 px-4 rounded focus:outline-none bg-blue-500 text-white" onClick={() => onSelect('smallcap')}>
        Small Cap
      </button>
      <button className="mr-2 py-2 px-4 rounded focus:outline-none bg-blue-500 text-white" onClick={() => onSelect('midcap')}>
        Mid Cap
      </button>
      <button className="py-2 px-4 rounded focus:outline-none bg-blue-500 text-white" onClick={() => onSelect('largecap')}>
        Large Cap
      </button>
    </div>
  );
}

function MutualFund() {
  const [funds, setFunds] = useState([]);
  const [selectedFundType, setSelectedFundType] = useState('smallcap');
  const [sortBy, setSortBy] = useState('fund_name'); // Default sorting column
  const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order

  useEffect(() => {
    if (!selectedFundType) return;

    // Fetch data from the API endpoint based on selected fund type and sorting criteria
    fetch(`http://127.0.0.1:5000/funds?type=${selectedFundType}&sortBy=${sortBy}&sortOrder=${sortOrder}`)
  .then(response => response.json())
  .then(data => setFunds(data.funds))
  .catch(error => console.error('Error fetching data:', error));

  }, [selectedFundType, sortBy, sortOrder]);

  // Function to handle sorting
  const handleSort = column => {
    if (column === sortBy) {
      // If already sorting by the same column, toggle the order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If sorting by a different column, set the new sorting column and order to ascending
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Mutual Funds</h2>

      {/* Reusable fund selection buttons */}
      <FundButtons onSelect={setSelectedFundType} />

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2">Fund Name</th>
              <th className="border border-gray-200 px-4 py-2 cursor-pointer" onClick={() => handleSort('fund_size')}>
                Fund Size {sortBy === 'fund_size' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
              </th>
              <th className="border border-gray-200 px-4 py-2 cursor-pointer" onClick={() => handleSort('annual_return')}>
                Annual Return {sortBy === 'annual_return' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
              </th>
            </tr>
          </thead>
          <tbody>
            {funds.map(fund => (
              <tr key={fund.id} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-4 py-2">{fund.fund_name}</td>
                <td className="border border-gray-200 px-4 py-2">{fund.fund_size}</td>
                <td className="border border-gray-200 px-4 py-2">{fund.annual_return}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MutualFund;
