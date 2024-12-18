const FoodOrderDetails = ({ foodReport, currentPage, itemsPerPage }) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = foodReport.slice(startIndex, startIndex + itemsPerPage);

  const calculateFine = (status) => {
    return status === 'Pending' ? 100 : 0;
  };

  const calculateMonthlyFine = () => {
    return foodReport.reduce((total, report) => {
      const fines = Object.values(report.opt_ins).reduce((sum, status) => sum + calculateFine(status), 0);
      return total + fines;
    }, 0);
  };

  return (
    <div className="overflow-x-auto rounded-lg p-6">
      <div className="overflow-hidden rounded-lg border-b border-gray-300 shadow-lg">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
            <tr>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Breakfast</th>
              <th className="px-6 py-4 text-left">Lunch</th>
              <th className="px-6 py-4 text-left">Dinner</th>
              <th className="px-6 py-4 text-left">Fine</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((report, index) => (
              <tr key={index} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className="px-6 py-4 font-medium text-gray-800">{report.date}</td>
                <td className="px-6 py-4 text-gray-700">{report.opt_ins.breakfast || 'No Order'}</td>
                <td className="px-6 py-4 text-gray-700">{report.opt_ins.lunch || 'No Order'}</td>
                <td className="px-6 py-4 text-gray-700">{report.opt_ins.dinner || 'No Order'}</td>
                <td className="px-6 py-4 text-gray-700">
                  {Object.values(report.opt_ins).reduce((total, status) => total + calculateFine(status), 0)} Rs
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 p-6 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg shadow-lg text-center">
        <strong className="text-2xl font-semibold">
          Monthly Total Fine: {calculateMonthlyFine()} Rs
        </strong>
      </div>
    </div>
  );
};

export default FoodOrderDetails;
