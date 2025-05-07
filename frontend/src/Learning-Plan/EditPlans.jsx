import React, { useState, useEffect } from "react";
import { FaEdit, FaSave } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../components/Modal";

const EditPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [topics, setTopics] = useState([]);
  const [topicInput, setTopicInput] = useState("");
  const [topicsCovered, setTopicsCovered] = useState([]);
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [progress, setProgress] = useState(0);
  const [resources, setResources] = useState([]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [existingResources, setExistingResources] = useState([]);

  const allowedTypes = {
    IMAGE: ["jpg", "jpeg", "png", "gif"],
    DOCUMENT: ["pdf", "doc", "docx", "ppt", "pptx"],
    VIDEO: ["mp4", "mov", "avi", "mkv"],
  };

  const detectType = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    for (let [type, exts] of Object.entries(allowedTypes)) {
      if (exts.includes(ext)) return type;
    }
    return null;
  };

  useEffect(() => {
    fetchPlan();
  }, [id]);

  const fetchPlan = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/learning-plans/${id}`
      );
      const data = res.data;

      setTitle(data.title);
      setTopics(data.topics.map((t) => t.name));
      setTopicsCovered(data.topicsCovered || []);
      setStatus(data.status);
      setStartDate(data.startDate);
      setEndDate(data.endDate);
      setProgress(data.progress || 0);
      setExistingResources(data.resources || []);
    } catch (err) {
      setError("Failed to load plan");
      console.error(err);
    }
  };

  const handleAddTopic = () => {
    const trimmed = topicInput.trim();
    if (trimmed && !topics.includes(trimmed)) {
      setTopics([...topics, trimmed]);
      setTopicInput("");
    }
  };

  const handleRemoveTopic = (index) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    setResources(Array.from(e.target.files));
  };

  const validateInputs = () => {
    if (!title.trim()) return "Title is required.";
    if (!topics.length) return "At least one topic is required.";
    if (!status) return "Status is required.";
    if (!startDate || !endDate) return "Both dates are required.";
    if (new Date(endDate) < new Date(startDate))
      return "End date cannot be before start date.";
    if (progress < 0 || progress > 100)
      return "Progress must be between 0 and 100";

    const hasInvalid = resources.some((file) => detectType(file.name) === null);
    if (hasInvalid) return "Some files have unsupported types.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationMessage = validateInputs();
    if (validationMessage) return setError(validationMessage);

    const updatedPlan = {
      userId: "user123",
      title,
      topics,
      topicsCovered,
      status,
      startDate,
      endDate,
      progress,
      description,
    };

    try {
      await axios.put(
        `http://localhost:8080/api/learning-plans/${id}`,
        updatedPlan
      );

      for (let file of resources) {
        const type = detectType(file.name);
        if (!type) continue;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        formData.append("description", description || "");

        await axios.post(
          `http://localhost:8080/api/learning-plans/${id}/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      navigate(`/plans/${id}`);
    } catch (err) {
      console.error("Update failed:", err);
      setError("Something went wrong while updating the plan.");
    }
  };
  const handleDeleteResource = async (fileName) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/learning-plans/${id}/resources/${encodeURIComponent(
          fileName
        )}`
      );
      setExistingResources(
        existingResources.filter((res) => res.fileName !== fileName)
      );
    } catch (err) {
      console.error("Error deleting resource:", err);
      setError("Failed to delete resource.");
    }
  };
  const renderPreview = (file) => {
    const type = detectType(file.name);
    if (type === "IMAGE") {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="h-16 rounded"
        />
      );
    }
    if (type === "VIDEO")
      return <span className="text-orange-600">🎥 {file.name}</span>;
    if (type === "DOCUMENT")
      return <span className="text-purple-600">📄 {file.name}</span>;
    return <span className="text-gray-500">❓ {file.name}</span>;
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaEdit /> Edit Learning Plan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Title"
          />

          <div>
            <div className="flex gap-2">
              <input
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                className="flex-grow p-2 border rounded"
                placeholder="Add topic"
              />
              <button
                type="button"
                onClick={handleAddTopic}
                className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {topics.map((topic, i) => (
                <span
                  key={i}
                  className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
                >
                  {topic}
                  <button
                    type="button"
                    onClick={() => handleRemoveTopic(i)}
                    className="ml-2 text-blue-500 hover:text-blue-800 font-bold"
                    title="Remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <textarea
            value={topicsCovered}
            onChange={(e) => setTopicsCovered(e.target.value.split(","))}
            className="w-full p-2 border rounded"
            placeholder="Topics covered (comma-separated)"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Progress: {progress}%
            </label>
            <input
              type="number"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Progress %"
              min="0"
              max="100"
            />
          </div>

          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
          {resources.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {resources.map((file, i) => (
                <div key={i} className="bg-gray-100 p-2 rounded border">
                  {renderPreview(file)}
                </div>
              ))}
            </div>
          )}

          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Description (optional)"
          />
          {existingResources.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm text-gray-600 font-semibold">
                Existing Resources:
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {existingResources.map((res, i) => (
                  <div
                    key={i}
                    className="bg-gray-100 p-2 rounded border flex flex-col gap-1"
                  >
                    <div className="text-sm font-medium truncate">
                      {res.fileName}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {res.description}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <a
                        href={`http://localhost:8080${res.fileUrl}`}
                        target={res.type === "IMAGE" ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        download={res.type !== "IMAGE"}
                        className="text-blue-600 text-xs hover:underline"
                      >
                        {res.type === "IMAGE" ? "Preview" : "Download"}
                      </a>
                      <button
                        type="button"
                        className="text-red-500 text-xs hover:underline"
                        onClick={() => handleDeleteResource(res.fileName)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 flex items-center gap-2"
            >
              <FaSave /> Update Plan
            </button>
          </div>
        </form>
      </div>

      {error && <Modal message={error} onClose={() => setError("")} />}
    </div>
  );
};

export default EditPlan;
