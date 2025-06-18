import React from 'react';
import './PostCard.css';

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <img src={post.full_picture} alt="Post" className="post-img" />
      <div className="post-info">
        <p><strong>{post.pageName || 'Page'}</strong></p>
        <p>{post.message || post.caption || 'No caption'}</p>
        <div className="post-stats">
          <span>❤️ {post.likes?.summary?.total_count ?? 0}</span>
          <span>👁️ {post.views ?? 'N/A'}</span>
        </div>
        <p className="post-date">{new Date(post.created_time).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default PostCard;
