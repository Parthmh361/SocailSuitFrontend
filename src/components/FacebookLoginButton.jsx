import React from "react";

const FacebookLoginButton = () => {
  const handleFacebookLogin = () => {
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    if (!user || !user._id) {
      alert("Please login first.");
      return;
    }
    window.location.href = `https://socialsuit-backend-h9md.onrender.com/auth/facebook?user_id=${user._id}`;
  };

  return (
    <div >
      <button
        onClick={handleFacebookLogin}
        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-700 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:from-blue-800 hover:to-purple-700 transition"
      >
        <svg className="w-6 h-6" viewBox="0 0 32 32" fill="currentColor">
          <path d="M29 0h-26c-1.654 0-3 1.346-3 3v26c0 1.654 1.346 3 3 3h13v-12h-4v-5h4v-3.5c0-4.136 2.522-6.5 6.293-6.5 1.826 0 3.707.326 3.707.326v4h-2.089c-2.057 0-2.707 1.277-2.707 2.586v3.088h5l-1 5h-4v12h7c1.654 0 3-1.346 3-3v-26c0-1.654-1.346-3-3-3z" />
        </svg>
        Login with Facebook
      </button>
    </div>
  );
};

export default FacebookLoginButton;
