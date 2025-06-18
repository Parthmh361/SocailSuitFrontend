import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPages, setSelectedPage } from '../store/pagesSlice';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [selectedPost, setSelectedPost] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedMessage, setEditedMessage] = useState('');

  const dispatch = useDispatch();
  const pages = useSelector((state) => state.pages.pages);
  const selectedPage = useSelector((state) => state.pages.selectedPage);

  // Get user_id from localStorage
  const userId = (() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user && user._id ? user._id : '';
    } catch {
      return '';
    }
  })();

  const fetchPages = async () => {
    try {
      const res = await axios.get('https://socialsuit-backend-h9md.onrender.com/auth/facebook/pages', {
        params: { user_id: userId },
      });
      dispatch(setPages(res.data.pages));
    } catch (err) {
      console.error('Error fetching pages:', err);
      alert('Failed to fetch pages');
    }
  };

  const fetchPosts = async () => {
    if (!selectedPage) return;
    const page = pages.find((p) => p.id === selectedPage);
    if (!page) return;
    try {
      const res = await axios.get('https://socialsuit-backend-h9md.onrender.com/posts/getallpostsfilter', {
        params: {
          user_id: userId,
          pageId: selectedPage,
          accessToken: page.access_token,
          sortBy,
          order,
        },
      });
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      alert('Failed to fetch posts');
    }
  };

  const handleEditPost = async () => {
    try {
      const res = await axios.post('https://socialsuit-backend-h9md.onrender.com/editpost', {
        user_id: userId,
        postId: selectedPost.postId || selectedPost.id,
        pageId: selectedPage,
        message: editedMessage,
      });
      if (res.data.success) {
        alert('Post updated successfully!');
        setEditMode(false);
        setSelectedPost(null);
        fetchPosts();
      } else {
        alert('Failed to update post');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating post');
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await axios.delete('https://socialsuit-backend-h9md.onrender.com/deletepost', {
        data: {
          user_id: userId,
          postId: selectedPost.postId || selectedPost.id,
          pageId: selectedPage,
        },
      });
      if (res.data.success) {
        alert('Post deleted successfully!');
        setSelectedPost(null);
        fetchPosts();
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting post');
    }
  };

  useEffect(() => {
    if (userId) fetchPages();
    // eslint-disable-next-line
  }, [userId]);

  useEffect(() => {
    if (selectedPage && userId) {
      fetchPosts();
    }
    // eslint-disable-next-line
  }, [selectedPage, sortBy, order, userId]);

  return (
    <>
      <style>{`
        .modal-bg {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.7);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          background: #222;
          color: #fff;
          border-radius: 18px;
          max-width: 500px;
          width: 95vw;
          padding: 32px 24px 24px 24px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
        }
        .modal-close {
          position: absolute;
          top: 12px;
          right: 18px;
          font-size: 2rem;
          color: #fff;
          background: none;
          border: none;
          cursor: pointer;
        }
        .modal-img {
          width: 100%;
          max-height: 250px;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 16px;
        }
        .modal-section {
          margin-bottom: 18px;
        }
        .modal-section h4 {
          margin-bottom: 6px;
          font-weight: 600;
          color: #a78bfa;
        }
        .modal-list {
          max-height: 120px;
          overflow-y: auto;
          background: #181818;
          border-radius: 8px;
          padding: 8px 12px;
        }
      `}</style>

      <div className="flex h-full">
        <main className="flex-1 p-10 flex flex-col gap-10">
          <div
            id="post"
            className="min-h-[350px] bg-[#1f1f1f]/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-8 transition-transform duration-300 hover:scale-[1.02]"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h2 className="text-2xl font-semibold text-white">FACEBOOK POSTS</h2>
              <div className="flex flex-wrap gap-4 items-center">
                <select
                  className="p-2 rounded-md bg-[#2b2b2b] text-white"
                  value={selectedPage || ''}
                  onChange={(e) => dispatch(setSelectedPage(e.target.value))}
                >
                  <option value="">-- Select Page --</option>
                  {pages.map((page) => (
                    <option key={page.id} value={page.id}>
                      {page.name}
                    </option>
                  ))}
                </select>
                <select
                  className="p-2 rounded-md bg-[#2b2b2b] text-white"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Sort by Date</option>
                  <option value="likes">Sort by Likes</option>
                  <option value="comments">Sort by Comments</option>
                </select>
                <select
                  className="p-2 rounded-md bg-[#2b2b2b] text-white"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post.postId || post.id}
                  className="bg-white text-black rounded-xl shadow-lg overflow-hidden cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                  title="Click to view details"
                >
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-300">
                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                    <div>
                      <div className="font-semibold">{post.from?.name || 'Facebook Page'}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(post.created_time).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2 text-sm">
                    {post.message ? post.message.slice(0, 100) + '...' : 'No content'}
                  </div>
                  {post.full_picture && (
                    <img
                      src={post.full_picture}
                      alt="Post"
                      className="w-full object-cover h-48"
                    />
                  )}
                  <div className="flex justify-between items-center px-4 py-2 text-sm text-gray-500 border-t border-b border-gray-300">
                    <div>
                      <span role="img" aria-label="like">👍</span> {post.likes?.summary?.total_count || 0}
                    </div>
                    <div>{post.comments?.summary?.total_count || 0} Comments</div>
                  </div>
                  <div className="flex justify-around py-2">
                    <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600">
                      👍 Like
                    </button>
                    <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600">
                      💬 Comment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {selectedPost && (
        <div className="modal-bg" onClick={() => setSelectedPost(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPost(null)}>&times;</button>
            <h3 className="text-2xl font-bold mb-2">{selectedPost.from?.name || 'Facebook Page'}</h3>
            <div className="text-xs text-gray-400 mb-2">
              {new Date(selectedPost.created_time).toLocaleString()}
            </div>
            {selectedPost.full_picture && (
              <img src={selectedPost.full_picture} alt="Post" className="modal-img" />
            )}

            <div className="modal-section">
              <h4>Message</h4>
              {editMode ? (
                <>
                  <textarea
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                    className="w-full p-2 rounded text-black"
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={handleEditPost} className="bg-green-600 px-4 py-1 rounded">Save</button>
                    <button onClick={() => setEditMode(false)} className="bg-gray-500 px-4 py-1 rounded">Cancel</button>
                  </div>
                </>
              ) : (
                <div>{selectedPost.message || 'No content'}</div>
              )}
            </div>

            <div className="modal-section">
              <h4>Likes</h4>
              <div className="modal-list">
                {selectedPost.likes?.data?.length > 0 ? (
                  selectedPost.likes.data.map((like, idx) => (
                    <div key={idx}>{like.name || like.username || 'User'}</div>
                  ))
                ) : (
                  <div>No likes</div>
                )}
              </div>
            </div>

            <div className="modal-section">
              <h4>Comments</h4>
              <div className="modal-list">
                {selectedPost.comments?.data?.length > 0 ? (
                  selectedPost.comments.data.map((comment, idx) => (
                    <div key={idx} style={{ marginBottom: 8 }}>
                      <b>{comment.from?.name || 'User'}:</b> {comment.message}
                    </div>
                  ))
                ) : (
                  <div>No comments</div>
                )}
              </div>
            </div>

            {!editMode && (
              <div className="flex justify-between mt-4">
                <button onClick={() => {
                  setEditMode(true);
                  setEditedMessage(selectedPost.message || '');
                }} className="bg-blue-600 px-4 py-1 rounded">
                  Edit Post
                </button>
                <button onClick={handleDeletePost} className="bg-red-600 px-4 py-1 rounded">
                  Delete Post
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Posts;
