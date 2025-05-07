import React, { useEffect, useState } from "react";
import {
  FaChartPie,
  FaBookOpen,
  FaUserCircle,
  FaTrashAlt,
} from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getLearningPlans } from "../services/api";
import { Link } from "react-router-dom";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await getLearningPlans();
      setPlans(response.data);
    } catch (err) {
      console.error("Error fetching learning plans:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/learning-plans/${id}`);
      setPlans(plans.filter((plan) => plan.id !== id));
      setShowConfirm(false);
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };
  const filteredPlans = plans.filter((plan) =>
    plan.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const countStatus = (status) =>
    plans.filter((p) => p.status === status).length;

  const chartData = {
    labels: ["Completed", "In Progress", "Not Started"],
    datasets: [
      {
        data: [
          countStatus("COMPLETED"),
          countStatus("IN_PROGRESS"),
          countStatus("NOT_STARTED"),
        ],
        backgroundColor: ["#10B981", "#3B82F6", "#EF4444"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          📘 Learning Dashboard
        </h1>
      </header>

      {loading ? (
        <div className="text-center text-gray-600">Loading plans...</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="bg-white shadow rounded-xl p-4 col-span-1">
            <h2 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FaChartPie /> Progress Overview
            </h2>
            <Pie data={chartData} />
          </div>

          {/* Plan List */}
          <div className="md:col-span-2 bg-white shadow rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <FaBookOpen /> Your Learning Plans
              </h2>
              <Link
                to="/plan/create"
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                + Create Plan
              </Link>
            </div>

            {plans.length === 0 ? (
              <div className="text-gray-500">No learning plans found.</div>
            ) : (
              <div>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search plans by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <ul className="space-y-4">
                  {filteredPlans.map((plan) => (
                    <li
                      key={plan.id}
                      className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center"
                    >
                      <div className="flex-grow">
                        <Link
                          to={`/plans/${plan.id}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {plan.title}
                        </Link>

                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${plan.progress || 0}%`,
                              backgroundColor:
                                plan.status === "COMPLETED"
                                  ? "#10B981"
                                  : plan.status === "IN_PROGRESS"
                                  ? "#3B82F6"
                                  : "#EF4444",
                            }}
                          />
                        </div>
                      </div>
                      <div className="ml-4 flex items-center gap-3">
                        <span
                          className={`text-sm font-semibold px-2 py-1 rounded-full
                          ${
                            plan.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : plan.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          }
                        `}
                        >
                          {plan.status.replace("_", " ")}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedPlanId(plan.id);
                            setShowConfirm(true);
                          }}
                          className="text-red-500 hover:text-red-700"
                          title="Delete Plan"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure?
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              This will permanently delete the learning plan.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => handleDelete(selectedPlanId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
