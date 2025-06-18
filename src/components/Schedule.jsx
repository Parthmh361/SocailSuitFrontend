import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPages, setUser, setFbToken } from '../store/pagesSlice';
import { FaFacebook, FaRegClock, FaPaperPlane } from 'react-icons/fa';

const SchPost = () => {
  const dispatch = useDispatch();
  const pages = useSelector((state) => state.pages.pages);
  const user = useSelector((state) => state.pages.user);
  const fbTokenValid = useSelector((state) => state.pages.fbTokenValid);

  const [selectedPage, setSelectedPage] = useState('');
  const [message, setMessage] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState('photo');
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef();

  // Get user_id from localStorage
  const userId = (() => {
    try {
      const stored = localStorage.getItem('user');
      const parsed = stored ? JSON.parse(stored) : null;
      return parsed && parsed._id ? parsed._id : '';
    } catch {
      return '';
    }
  })();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
    checkFbAuth();
    fetchPages();
    // eslint-disable-next-line
  }, [dispatch]);

  const checkFbAuth = async () => {
    if (!userId) {
      dispatch(setFbToken(false));
      return;
    }
    try {
      await axios.get('https://socialsuit-backend-h9md.onrender.com/auth/facebook/status', {
        params: { user_id: userId },
      });
      dispatch(setFbToken(true));
    } catch {
      dispatch(setFbToken(false));
    }
  };

  const handleFacebookLogin = () => {
    if (!userId) {
      alert('Please login first.');
      return;
    }
    window.location.href = `https://socialsuit-backend-h9md.onrender.com/auth/facebook?user_id=${userId}`;
  };

  const fetchPages = async () => {
    if (!userId) return;
    try {
      const res = await axios.get('https://socialsuit-backend-h9md.onrender.com/auth/facebook/pages', {
        params: { user_id: userId },
      });
      dispatch(setPages(res.data.pages || []));
    } catch (err) {
      console.error('Error fetching pages:', err);
      dispatch(setPages([]));
    }
  };

  const handleSchedulePost = async () => {
    if (!mediaFile) return alert('Please select a media file.');
    if (!selectedPage) return alert('Select a valid page.');
    if (!scheduledTime) return alert('Select a scheduled time.');

    const timestamp = Math.floor(new Date(scheduledTime).getTime() / 1000);
    if (isNaN(timestamp) || timestamp <= Math.floor(Date.now() / 1000)) {
      return alert('Please select a valid future time for scheduling.');
    }

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('pageId', selectedPage);
    formData.append('message', message);
    formData.append('scheduledTime', timestamp);
    formData.append('mediaType', mediaType);
    formData.append('file', mediaFile);

    setLoading(true);
    try {
      const res = await axios.post('https://socialsuit-backend-h9md.onrender.com/schedulePost/timing', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Scheduled Post ID: ' + res.data.postId);
      resetForm();
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Unknown error';
      alert('Failed to schedule post: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePostNow = async () => {
    if (!mediaFile) return alert('Please select a media file.');
    if (!selectedPage) return alert('Select a valid page.');

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('pageId', selectedPage);
    formData.append('message', message);
    formData.append('mediaType', mediaType);
    formData.append('file', mediaFile);

    setLoading(true);
    try {
      const res = await axios.post('https://socialsuit-backend-h9md.onrender.com/schedulePost/instantly', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Post ID: ' + res.data.postId);
      resetForm();
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Unknown error';
      alert('Failed to post instantly: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMessage('');
    setScheduledTime('');
    setMediaFile(null);
    setMediaType('photo');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#23272f' }}>
      {!fbTokenValid ? (
        <button
          onClick={handleFacebookLogin}
          className="px-8 py-4 bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg flex items-center gap-2 hover:bg-blue-800 transition"
        >
          <FaFacebook size={22} />
          Login with Facebook
        </button>
      ) : (
        <div className="shadow-2xl rounded-3xl w-full max-w-xl flex flex-col overflow-hidden" style={{ background: '#181c24' }}>
          <div className="p-4 text-center" style={{ background: '#101522' }}>
            <h2 className="text-xl font-extrabold text-white tracking-wide mb-1">
              Schedule a Facebook Post
            </h2>
            <p className="text-blue-200 text-sm">
              Plan your content and reach your audience at the perfect time!
            </p>
          </div>

          <div className="p-4 flex flex-col gap-3" style={{ background: '#23272f' }}>
            <label className="block mb-1 text-sm font-semibold text-blue-200">Select Page</label>
            <select
              onChange={e => setSelectedPage(e.target.value)}
              value={selectedPage}
              className="w-full mb-2 border border-blue-700 rounded-lg p-2 bg-[#101522] text-white font-semibold focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Choose a Page --</option>
              {pages.map(page => (
                <option key={page.id || page.pageId} value={page.id || page.pageId}>
                  {page.name}
                </option>
              ))}
            </select>

            <label className="block mb-1 text-sm font-semibold text-blue-200">Message / Caption</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full mb-2 border border-blue-700 rounded-lg p-2 h-14 bg-[#101522] text-white focus:ring-2 focus:ring-blue-400"
              placeholder="Write your post message or caption..."
            />

            <label className="block mb-1 text-sm font-semibold text-blue-200">Media Type</label>
            <select
              value={mediaType}
              onChange={e => setMediaType(e.target.value)}
              className="w-full mb-2 border border-blue-700 rounded-lg p-2 bg-[#101522] text-white focus:ring-2 focus:ring-blue-400"
            >
              <option value="photo">Photo</option>
              <option value="video">Video</option>
            </select>

            <label className="block mb-1 text-sm font-semibold text-blue-200">Upload Media</label>
            <input
              ref={fileInputRef}
              type="file"
              accept={mediaType === 'photo' ? 'image/*' : 'video/*'}
              onChange={e => setMediaFile(e.target.files[0])}
              className="w-full mb-2 border border-blue-700 rounded-lg p-2 bg-[#101522] text-white focus:ring-2 focus:ring-blue-400"
            />

            <label className="block mb-1 text-sm font-semibold text-blue-200">Schedule Time</label>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={e => setScheduledTime(e.target.value)}
              className="w-full mb-4 border border-blue-700 rounded-lg p-2 bg-[#101522] text-white focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={handleSchedulePost}
                disabled={loading}
                className="flex-1 bg-black text-blue-400 px-4 py-2 rounded-lg font-semibold shadow flex items-center justify-center gap-2 hover:bg-[#181c24] transition"
              >
                <FaRegClock />
                {loading ? 'Scheduling...' : 'Schedule Later'}
              </button>
              <button
                onClick={handlePostNow}
                disabled={loading}
                className="flex-1 bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow flex items-center justify-center gap-2 hover:bg-blue-800 transition"
              >
                <FaPaperPlane />
                {loading ? 'Posting...' : 'Post Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchPost;
