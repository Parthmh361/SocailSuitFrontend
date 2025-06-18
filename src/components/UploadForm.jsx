// src/components/UploadForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!video) return alert("Missing video");

    const formData = new FormData();
    formData.append('video', video);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('scheduledAt', scheduledAt);

    try {
      const res = await axios.post('https://socialsuit-backend-h9md.onrender.com/api/youtube/schedule', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(`✅ Scheduled: https://youtube.com/watch?v=${res.data.videoId}`);
    } catch (err) {
      console.error('Upload error:', err);
      setMessage('❌ Upload Failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-4">
      <form
        onSubmit={handleUpload}
        className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-lg shadow-2xl transition-all duration-300"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-purple-400">
          🎬 Schedule a YouTube Video
        </h2>

        <div className="space-y-5">
          <label className="block">
            <span className="text-sm text-gray-400">Upload Video</span>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
              className="mt-1 block w-full file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-700 file:text-white hover:file:bg-purple-800 transition-all duration-200"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-400">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Amazing Video Title"
              className="mt-1 w-full rounded-md bg-gray-800 border border-gray-600 text-white p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-400">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief video description..."
              className="mt-1 w-full rounded-md bg-gray-800 border border-gray-600 text-white p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-400">Schedule Date & Time</span>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="mt-1 w-full rounded-md bg-gray-800 border border-gray-600 text-white p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full py-3 bg-purple-700 hover:bg-purple-800 transition-colors duration-200 text-white font-semibold rounded-lg shadow-md"
          >
            🚀 Upload & Schedule
          </button>

          {message && (
            <p
              className={`mt-4 text-center font-medium ${
                message.startsWith('✅') ? 'text-green-400' : 'text-red-500'
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default UploadForm;
