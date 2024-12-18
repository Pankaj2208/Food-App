import React, { useEffect, useState } from "react";
import { getFoodReport } from "../services/foodReportService";
import FoodOrderDetails from "../components/FoodOrderTable";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FoodReport = () => {
  const [foodReport, setFoodReport] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const fetchFoodReport = async () => {
      try {
        const data = await getFoodReport(11);
        setFoodReport(data.reports);
        setUserDetails(data.user);
        setLoading(false);
      } catch (err) {
        setError(`Failed to load food report: ${err.message}`);
        setLoading(false);
      }
    };
    fetchFoodReport();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const totalPages = Math.ceil(foodReport.length / itemsPerPage);
  const chartData = {
    labels: foodReport.map((report) => report.date),
    datasets: [
      {
        label: "Delivered",
        data: foodReport.map((report) => {
          return Object.values(report.opt_ins).filter(
            (status) => status === "Delivered"
          ).length;
        }),
        backgroundColor: "rgba(0, 128, 0, 0.6)",
        borderRadius: 8
      },
      {
        label: "Canceled",
        data: foodReport.map((report) => {
          return Object.values(report.opt_ins).filter(
            (status) => status === "Canceled"
          ).length;
        }),
        backgroundColor: "rgba(255, 0, 0, 0.6)",
        borderRadius: 8
      },
      {
        label: "Pending",
        data: foodReport.map((report) => {
          return Object.values(report.opt_ins).filter(
            (status) => status === "Pending"
          ).length;
        }),
        backgroundColor: "rgba(255, 255, 0, 0.6)",
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Date"
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Orders Count"
        }
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Food Order Report</h1>
      {userDetails && (
        <div className="mb-6 p-4 bg-blue-100 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800">User Details</h2>
          <p className="text-lg text-gray-700">
            <strong>Name:</strong> {userDetails.f_name} {userDetails.l_name}
          </p>
          <p className="text-lg text-gray-700">
            <strong>Email:</strong> {userDetails.email}
          </p>
          <p className="text-lg text-gray-700">
            <strong>Phone:</strong> {userDetails.phone}
          </p>
          <p className="text-lg text-gray-700">
            <strong>Employee ID:</strong> {userDetails.emp_id}
          </p>
          <p className="text-lg text-gray-700">
            <strong>Department ID:</strong> {userDetails.department_id}
          </p>
        </div>
      )}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Daily Food Consumption Status
        </h2>
        <div className="border border-gray-200 rounded-lg p-4">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <FoodOrderDetails
          foodReport={foodReport}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      </div>
      <div className="mt-6 flex justify-center space-x-4">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Previous
          </button>
        )}
        <span className="self-center text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FoodReport;
