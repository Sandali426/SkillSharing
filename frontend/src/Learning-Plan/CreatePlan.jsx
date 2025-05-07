import React, { useState } from 'react';
import { FaPlus, FaSave } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

const CreatePlan = () => {
  const [title, setTitle] = useState('');
  const [topics, setTopics] = useState([]);
  const [topicInput, setTopicInput] = useState('');
  const [topicsCovered, setTopicsCovered] = useState([]);
  const [status, setStatus] = useState('NOT_STARTED');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [resources, setResources] = useState([]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const allowedTypes = {
    IMAGE: ['jpg', 'jpeg', 'png', 'gif'],
    DOCUMENT: ['pdf', 'doc', 'docx', 'ppt', 'pptx'],
    VIDEO: ['mp4', 'mov', 'avi', 'mkv']
  };

  const detectType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    for (let [type, exts] of Object.entries(allowedTypes)) {
      if (exts.includes(ext)) return type;
    }
    return null;
  };

  const handleAddTopic = () => {
    if (topicInput.trim() !== '') {
      setTopics([...topics, topicInput.trim()]);
      setTopicInput('');
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setResources(files);
  };

  const validateInputs = () => {
    if (!title.trim()) return 'Title is required.';
    if (topics.length === 0) return 'At least one topic is required.';
    if (!status) return 'Status is required.';
    if (!startDate || !endDate) return 'Both start and end dates are required.';
    if (new Date(endDate) < new Date(startDate)) return 'End date cannot be before start date.';

    if (resources.length > 0) {
      const hasInvalid = resources.some(file => detectType(file.name) === null);
      if (hasInvalid) return 'One or more files have unsupported file types.';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationMessage = validateInputs();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    const newPlan = {
      userId: 'user123',
      title,
      topics,
      topicsCovered,
      status,
      startDate,
      endDate
    };

    try {
      const res = await axios.post('http://localhost:8080/api/learning-plans', newPlan);
      const planId = res.data.id;

      for (let file of resources) {
        const formData = new FormData();
        const type = detectType(file.name);
        if (!type) continue;

        formData.append('file', file);
        formData.append('type', type);
        formData.append('description', description || '');

        await axios.post(`http://localhost:8080/api/learning-plans/${planId}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      navigate('/');
    } catch (err) {
      console.error('Error creating plan:', err);
      setError('Something went wrong while creating the plan.');
    }
  };

  const renderPreview = (file) => {
    const type = detectType(file.name);
    if (type === 'IMAGE') {
      return <img src={URL.createObjectURL(file)} alt={file.name} className="h-16 rounded" />;
    } else if (type === 'VIDEO') {
      return <span className="text-orange-600">🎥 {file.name}</span>;
    } else if (type === 'DOCUMENT') {
      return <span className="text-purple-600">📄 {file.name}</span>;
    } else {
      return <span className="text-gray-500">❓ {file.name}</span>;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaPlus /> Create New Learning Plan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold">Title</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Topics</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                className="flex-grow p-2 border rounded"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
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
                <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Topics Covered (optional)</label>
            <textarea
              className="w-full mt-1 p-2 border rounded"
              value={topicsCovered}
              onChange={(e) => setTopicsCovered(e.target.value.split(','))}
              placeholder="Separate with commas"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Status</label>
            <select
              className="w-full mt-1 p-2 border rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold">Start Date</label>
              <input
                type="date"
                className="w-full mt-1 p-2 border rounded"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">End Date</label>
              <input
                type="date"
                className="w-full mt-1 p-2 border rounded"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* RESOURCE UPLOAD */}
          <div>
            <label className="block text-gray-700 font-semibold">Upload Resources</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full mt-1 p-2 border rounded"
            />
            {resources.length > 0 && (
              <div className="mt-3 space-y-2">
                <h4 className="text-sm text-gray-600 font-semibold">Preview:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {resources.map((file, index) => (
                    <div key={index} className="bg-gray-100 p-2 rounded border">
                      {renderPreview(file)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Description (optional)</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 flex items-center gap-2"
            >
              <FaSave /> Save Plan
            </button>
          </div>
        </form>
      </div>

      {/* Modal for validation errors */}
      {error && <Modal message={error} onClose={() => setError('')} />}
    </div>
  );
};

export default CreatePlan;
