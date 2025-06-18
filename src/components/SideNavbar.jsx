import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const icons = {
  Homepage: <svg width="22" height="22" fill="currentColor" className="text-purple-400" viewBox="0 0 20 20"><path d="M10 2L2 8.5V18a1 1 0 001 1h5v-5h4v5h5a1 1 0 001-1V8.5L10 2z" /></svg>,
  Post: <svg width="22" height="22" fill="currentColor" className="text-purple-400" viewBox="0 0 20 20"><path d="M17 8h-6V2H9v6H3v2h6v6h2v-6h6z" /></svg>,
  Analytics: <svg width="22" height="22" fill="currentColor" className="text-purple-400" viewBox="0 0 20 20"><path d="M3 17h2v-7H3v7zm4 0h2V7H7v10zm4 0h2v-4h-2v4zm4 0h2v-2h-2v2z" /></svg>,
  Earning: <svg width="22" height="22" fill="currentColor" className="text-green-400" viewBox="0 0 20 20"><text x="2" y="16" fontSize="18" fontWeight="bold">$</text></svg>,
  Trending: <svg width="22" height="22" fill="currentColor" className="text-pink-400" viewBox="0 0 20 20"><path d="M3 17l6-6 4 4 8-8-1.41-1.42L13 13.17l-4-4-7 7z" /></svg>,
  Logout: <svg width="22" height="22" fill="currentColor" className="text-purple-400" viewBox="0 0 20 20"><path d="M7 17v-2h6v2a2 2 0 01-2 2H9a2 2 0 01-2-2zm7-7V7a5 5 0 00-10 0v3a5 5 0 0010 0zm-2 0a3 3 0 11-6 0V7a3 3 0 016 0v3z" /></svg>,
};

function SideNavbar({ handleLogout }) {
  const [postsDropdownOpen, setPostsDropdownOpen] = useState(false);
  const [expanded, setExpanded] = useState(() => {
    return localStorage.getItem('sidebarExpanded') === 'true';
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('sidebarExpanded', expanded);
  }, [expanded]);

  return (
    <aside
      className={`bg-[#0f0f1a] shadow-2xl text-white h-screen z-20 transition-all duration-300 ease-in-out ${
        expanded ? 'w-64' : 'w-20'
      } flex flex-col justify-between fixed top-0 left-0 group`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="p-4 space-y-4 relative">
        <div className="text-purple-400 font-bold text-2xl px-1">
          {expanded ? 'Socialsuite' : 'S'}
        </div>

        <NavLink
          to="/homepage"
          className={({ isActive }) =>
            `flex items-center gap-4 py-2 px-3 rounded-lg hover:bg-[#23232f] transition ${
              isActive ? 'bg-[#1c1c2b]' : ''
            }`
          }
        >
          {icons.Homepage}
          {expanded && 'Homepage'}
        </NavLink>

        <div className="relative">
          <div
            className={`flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[#23232f] transition cursor-pointer ${
              postsDropdownOpen ? 'bg-[#1c1c2b]' : ''
            }`}
            onClick={() => setPostsDropdownOpen(!postsDropdownOpen)}
          >
            <div className="flex items-center gap-4">
              {icons.Post}
              {expanded && 'Posts'}
            </div>
            {expanded && (
              <svg
                className={`transition-transform duration-200 ${
                  postsDropdownOpen ? 'rotate-90' : ''
                }`}
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6 6l6 4-6 4V6z" />
              </svg>
            )}
          </div>
          {postsDropdownOpen && expanded && (
            <div className="ml-10 mt-1 space-y-1">
              <button
                className="text-left text-sm w-full px-3 py-1 hover:bg-[#2c2c40] rounded-md"
                onClick={() => {
                  setPostsDropdownOpen(false);
                  navigate('/posts');
                }}
              >
                • Facebook
              </button>
              <NavLink to = "/youtube" onClick={() => setPostsDropdownOpen(false)}>
                <button
                className="text-left text-sm w-full px-3 py-1 hover:bg-[#2c2c40] rounded-md"
              >
                • YouTube
              </button>
              </NavLink>
              
            </div>
          )}
        </div>

        <NavLink
          to="/schedulepost"
          className={({ isActive }) =>
            `flex items-center gap-4 py-2 px-3 rounded-lg hover:bg-[#23232f] transition ${
              isActive ? 'bg-[#1c1c2b]' : ''
            }`
          }
        >
          {icons.Post}
          {expanded && 'Scheduling Post'}
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex items-center gap-4 py-2 px-3 rounded-lg hover:bg-[#23232f] transition ${
              isActive ? 'bg-[#1c1c2b]' : ''
            }`
          }
        >
          {icons.Analytics}
          {expanded && 'Analytics'}
        </NavLink>

        <NavLink
          to="/earning"
          className={({ isActive }) =>
            `flex items-center gap-4 py-2 px-3 rounded-lg hover:bg-[#23232f] transition ${
              isActive ? 'bg-[#1c1c2b]' : ''
            }`
          }
        >
          {icons.Earning}
          {expanded && 'Earning'}
        </NavLink>

        <NavLink
          to="/trending"
          className={({ isActive }) =>
            `flex items-center gap-4 py-2 px-3 rounded-lg hover:bg-[#23232f] transition ${
              isActive ? 'bg-[#1c1c2b]' : ''
            }`
          }
        >
          {icons.Trending}
          {expanded && 'Trending'}
        </NavLink>
      </div>

      <div className="p-4">
        <button
          className="flex items-center gap-4 py-2 px-3 rounded-lg hover:bg-red-600 transition w-full"
          onClick={handleLogout}
        >
          {icons.Logout}
          {expanded && 'Logout'}
        </button>
      </div>
    </aside>
  );
}

export default SideNavbar;
