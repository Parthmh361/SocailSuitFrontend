import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  setPages,
  setSelectedPage,
  setFbToken,
  setGoogleToken,
} from '../store/pagesSlice';
import AutoScrollPosts from './AutoScrollPosts';
import FacebookLoginButton from './FacebookLoginButton';
import GoogleLoginButton from './GoogleLogin';
import Posts from './Posts';
import YouTubePosts from './PostYT';

// Icons
import {
  LayoutDashboard,
  Facebook,
  Clock,
  BarChart2,
  DollarSign,
  Flame,
  LogOut,
  Youtube,
} from 'lucide-react';
import Analytics from './Analytics';
import SchPost from './Schedule';
import YouTubeDashboard from './YouTubeDashboard';
import UploadForm from './UploadForm';

export default function Homepage() {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const dispatch = useDispatch();
  const pages = useSelector((state) => state.pages.pages);
  const selectedPage = useSelector((state) => state.pages.selectedPage);
  const fbTokenValid = useSelector((state) => state.pages.fbTokenValid);
  const googleTokenValid = useSelector((state) => state.pages.googleTokenValid);

  // Get user_id from localStorage
  const userId = (() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user && user._id ? user._id : '';
    } catch {
      return '';
    }
  })();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(
          'https://socialsuit-backend-h9md.onrender.com/auth/facebook/pages',
          { params: { user_id: userId } }
        );
        dispatch(setFbToken(true));
      } catch {
        dispatch(setFbToken(false));
      }

      try {
        await axios.get(
          'https://socialsuit-backend-h9md.onrender.com/api/youtube/check-auth',
          { withCredentials: true }
        );
        dispatch(setGoogleToken(true));
      } catch {
        dispatch(setGoogleToken(false));
      }
    };

    const fetchPages = async () => {
      try {
        const res = await axios.get(
          'https://socialsuit-backend-h9md.onrender.com/auth/facebook/pages',
          { params: { user_id: userId } }
        );
        dispatch(setPages(res.data.pages));
      } catch (err) {
        console.error('Error fetching pages:', err);
      }
    };

    if (userId) {
      checkAuth();
      fetchPages();
    }
  }, [userId, dispatch]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!selectedPage) return;
      const page = pages.find((p) => p.id === selectedPage);
      if (!page) return;

      try {
        const res = await axios.get(
          'https://socialsuit-backend-h9md.onrender.com/posts/getallpostsfilter',
          {
            params: {
              user_id: userId,
              pageId: selectedPage,
              accessToken: page.access_token,
              sortBy,
              order,
            },
          }
        );
        setPosts(res.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        alert('Failed to fetch posts');
      }
    };

    if (userId) fetchPosts();
  }, [selectedPage, sortBy, order, pages, userId]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const Sidebar = () => (
    <div className="w-72 h-screen bg-black p-6 text-white flex flex-col shadow-xl">
      <h2 className="text-3xl font-bold mb-10 text-purple-400">Socialsuite</h2>
      <nav className="flex flex-col space-y-6 text-lg">
        <button onClick={() => setActiveSection('dashboard')} className="flex items-center gap-3 text-white hover:text-purple-400">
          <LayoutDashboard /> Dashboard
        </button>
        <button onClick={() => setActiveSection('fbposts')} className="flex items-center gap-3 text-white hover:text-purple-400">
          <Facebook /> Facebook Posts
        </button>
        <button onClick={() => setActiveSection('youtube')} className="flex items-center gap-3 text-white hover:text-purple-400">
          <Youtube /> Youtube
        </button>
        <button onClick={() => setActiveSection('schedule')} className="flex items-center gap-3 text-white hover:text-purple-400">
          <Clock /> Schedule Facebook Post
        </button>
        <button onClick={() => setActiveSection('yts')} className="flex items-center gap-3 text-white hover:text-purple-400">
          <Clock /> Schedule Youtube Video
        </button>
        <button onClick={() => setActiveSection('analytics')} className="flex items-center gap-3 text-white hover:text-purple-400">
          <BarChart2 /> Analytics
        </button>
        <button onClick={() => setActiveSection('earning')} className="flex items-center gap-3 text-white hover:text-purple-400">
          <DollarSign /> Earnings
        </button>
        <button onClick={() => setActiveSection('trending')} className="flex items-center gap-3 text-white hover:text-purple-400">
          <Flame /> Trending
        </button>
        <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 hover:text-red-400">
          <LogOut /> Logout
        </button>
      </nav>
    </div>
  );

  const renderPageFilters = () => (
    <div className="flex gap-3 mb-4 text-white">
      <select
        value={selectedPage || ''}
        onChange={(e) => dispatch(setSelectedPage(e.target.value))}
        className="px-3 py-2 border rounded-md bg-gray-800 text-white"
      >
        <option value="">Select Page</option>
        {pages.map((page) => (
          <option key={page.id} value={page.id}>{page.name}</option>
        ))}
      </select>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="px-3 py-2 border rounded-md bg-gray-800 text-white"
      >
        <option value="date">Date</option>
        <option value="likes">Likes</option>
        <option value="comments">Comments</option>
      </select>
      <select
        value={order}
        onChange={(e) => setOrder(e.target.value)}
        className="px-3 py-2 border rounded-md bg-gray-800 text-white"
      >
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <section className="bg-gray-900 text-white shadow rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Facebook Rolling Posts</h2>
              {fbTokenValid ? (
                <>
                  {renderPageFilters()}
                  <AutoScrollPosts posts={posts} />
                </>
              ) : <FacebookLoginButton />}
            </section>

            <div
              id="homepage"
              className="h-[350px] bg-[#1f1f1f]/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-8 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="flex flex-1 items-center justify-center h-full">
                {!googleTokenValid ? (
                  <div className="w-full max-w-xs">
                    <GoogleLoginButton />
                  </div>
                ) : (
                  <YouTubePosts />
                )}
              </div>
            </div>
          </>
        );
      case 'fbposts':
        return (
          <section className="bg-gray-900 text-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Facebook Posts</h2>
            {fbTokenValid ? (
              <>
                {renderPageFilters()}
                <Posts />
              </>
            ) : <FacebookLoginButton />}
          </section>
        );
      case 'schedule':
        return (
          <section className="bg-gray-900 text-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Schedule Post</h2>
            {fbTokenValid ? (
              <>
                {renderPageFilters()}
                <SchPost />
              </>
            ) : <FacebookLoginButton />}
          </section>
        );
      case 'analytics':
        return (
          <section className="bg-gray-900 text-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Analytics</h2>
            {fbTokenValid ? (
              <>
                {renderPageFilters()}
                <Analytics />
              </>
            ) : <FacebookLoginButton />}
          </section>
        );
      case 'youtube':
        return (
          <section className="bg-gray-900 text-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Youtube</h2>
            {googleTokenValid ? (
              <>
                {renderPageFilters()}
                <YouTubeDashboard />
              </>
            ) : <GoogleLoginButton />}
          </section>
        );
      case 'yts':
        return (
          <section className="bg-gray-900 text-white shadow rounded-xl p-6">
            {googleTokenValid ? (
              <>
                {renderPageFilters()}
                <UploadForm />
              </>
            ) : <GoogleLoginButton />}
          </section>
        );
      default:
        return (
          <section className="bg-gray-900 text-gray-400 shadow rounded-xl p-6 text-center">
            Coming Soon: {activeSection}
          </section>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      {Sidebar()}
      <div className="flex flex-col flex-1">
        <nav className="bg-gray-900 text-white px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-400 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold text-purple-400">Socialsuite Dashboard</h1>
        </nav>
        <main className="p-6 space-y-6">{renderContent()}</main>
      </div>
    </div>
  );
}
