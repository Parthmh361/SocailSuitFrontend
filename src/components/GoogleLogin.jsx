import React from 'react';
import axios from 'axios';

const GoogleLoginButton = () => {
  const handleLogin = async () => {
    try {
      const res = await axios.get('https://socialsuit-backend-h9md.onrender.com/api/youtube/auth-url', { withCredentials: true });
      window.location.href = res.data.url;
    } catch (err) {
      alert('Failed to get Google login URL');
    }
  };

  return (
    <div >
      <button
        onClick={handleLogin}
        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-lg hover:from-red-700 hover:to-pink-700 transition"
      >
        <svg className="w-6 h-6" viewBox="0 0 48 48">
          <g>
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.72 1.22 9.23 3.23l6.9-6.9C36.08 2.36 30.36 0 24 0 14.82 0 6.73 5.18 2.69 12.74l8.06 6.26C12.5 13.01 17.79 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.43c-.54 2.91-2.18 5.38-4.67 7.04l7.19 5.6C43.98 37.13 46.1 31.35 46.1 24.55z"/>
            <path fill="#FBBC05" d="M10.75 28.99c-1.01-2.99-1.01-6.22 0-9.21l-8.06-6.26C.98 17.92 0 20.87 0 24c0 3.13.98 6.08 2.69 8.48l8.06-6.26z"/>
            <path fill="#34A853" d="M24 48c6.36 0 12.08-2.09 16.62-5.7l-7.19-5.6c-2.01 1.35-4.59 2.15-7.43 2.15-6.21 0-11.5-3.51-13.25-8.5l-8.06 6.26C6.73 42.82 14.82 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </g>
        </svg>
        Login with Google (YouTube)
      </button>
    </div>
  );
};

export default GoogleLoginButton;
