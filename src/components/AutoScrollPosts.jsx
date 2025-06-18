import React from 'react';
import './AutoScrollPosts.css';

const AutoScrollPosts = ({ posts }) => {
  const repeatedPosts = [...posts, ...posts, ...posts];

  return (
    <div className="auto-scroll-wrapper">
      <div className="auto-scroll-track">
        {repeatedPosts.map((post, index) => (
          <div
            key={index}
            className="bg-[#2b2b2b] text-white rounded-xl shadow-md overflow-hidden w-[300px] flex-shrink-0"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-600">
              <div className="w-10 h-10 rounded-full bg-gray-400"></div>
              <div>
                <div className="font-semibold">{post.from?.name || 'Facebook Page'}</div>
                <div className="text-xs text-gray-400">
                  {new Date(post.created_time).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="px-4 py-2 text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">
              {post.message || 'No content'}
            </div>
            {post.full_picture && (
              <img
                src={post.full_picture}
                alt="Post"
                className="w-full object-cover h-48"
              />
            )}
            <div className="flex justify-between items-center px-4 py-2 text-sm text-gray-400 border-t border-gray-600">
              <div>👍 {post.likes?.summary?.total_count || 0}</div>
              <div>{post.comments?.summary?.total_count || 0} Comments</div>
            </div>
            <div className="flex justify-around py-2">
              <button className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-blue-400">
                👍 Like
              </button>
              <button className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-blue-400">
                💬 Comment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutoScrollPosts;
