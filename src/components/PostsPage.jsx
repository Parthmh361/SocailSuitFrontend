// pages/PostsPage.jsx
import React from 'react';
import { useGetAllPosts } from '../hooks/useGetAllPosts';
import PostCard from '../components/PostCard';

const PostsPage = () => {
  const { data: posts, isLoading, error } = useGetAllPosts();

  if (isLoading) return <p>Loading posts...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!posts || posts.length === 0) return <p>No posts found.</p>;

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>📸 Your Social Media Posts</h2>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostsPage;
