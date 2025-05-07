import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaFileAlt, FaImage, FaVideo } from "react-icons/fa";
import { Doughnut } from "react-chartjs-2";

const ViewPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/learning-plans/${id}`
        );
        setPlan(res.data);
      } catch (err) {
        console.error("Error fetching plan:", err);
      }
    };

    fetchPlan();
  }, [id]);

  const chartData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [plan?.progress || 0, 100 - (plan?.progress || 0)],
        backgroundColor: ["#10B981", "#E5E7EB"],
        borderWidth: 0,
      },
    ],
  };

  const getIcon = (type) => {
    if (type === "IMAGE") return <FaImage className="text-blue-500" />;
    if (type === "VIDEO") return <FaVideo className="text-red-500" />;
    return <FaFileAlt className="text-gray-700" />;
  };

  if (!plan) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{plan.title}</h2>
          <button
            onClick={() => navigate(`/plan/edit/${plan.id}`)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center gap-2"
          >
            <FaEdit /> Edit
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Left Info Section */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold
          ${
            plan.status === "COMPLETED"
              ? "bg-green-100 text-green-700"
              : plan.status === "IN_PROGRESS"
              ? "bg-blue-100 text-blue-700"
              : "bg-red-100 text-red-700"
          }`}
              >
                {plan.status.replace("_", " ")}
              </span>
            </div>

            <div className="flex gap-6">
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium text-gray-700">{plan.startDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-medium text-gray-700">{plan.endDate}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Topics</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {plan.topics.map((t, i) => (
                  <span
                    key={i}
                    className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-sm"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </div>

            {plan.topicsCovered?.length > 0 && (
              <div>
                <p className="text-sm text-gray-500">Topics Covered</p>
                <ul className="list-disc list-inside text-gray-700 text-sm mt-1 space-y-1">
                  {plan.topicsCovered.map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                </ul>
              </div>
            )}
            {plan.description && (
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <ul className="list-disc list-inside text-gray-700 text-sm mt-1 space-y-1">
                  {plan.description}
                </ul>
              </div>
            )}
          </div>

          {/* Right Chart Section */}
          <div className="flex flex-col items-center justify-center gap-2">
            <Doughnut data={chartData} />
            <p className="text-sm text-gray-500">Progress: {plan.progress}%</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">Resources</h3>
          {plan.resources.length === 0 ? (
            <p className="text-gray-500">No resources uploaded.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {plan.resources.map((res, i) => (
                <a
                  key={i}
                  href={`http://localhost:8080${res.fileUrl}`}
                  target={res.type === "IMAGE" ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  download={res.type !== "IMAGE"}
                  className="bg-gray-50 p-4 rounded shadow hover:shadow-md flex gap-3 items-center justify-between transition-transform hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3">
                    {getIcon(res.type)}
                    <div>
                      <p className="font-medium text-sm">{res.fileName}</p>
                      {res.description && (
                        <p className="text-xs text-gray-500">
                          {res.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-sm text-blue-600 hover:underline">
                    {res.type === "IMAGE" ? "Preview" : "Download"}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPlan;
