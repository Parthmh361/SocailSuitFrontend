import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
function YouTubeDashboard() {
//   const accessToken = useSelector((state) => state.google.accessToken); // <-- Top level!
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideos = async () => {
    try {
      const response= await axios.get('https://socialsuit-backend-h9md.onrender.com/api/youtube/uploads', { withCredentials: true });
      console.log('Response:', response);
        if (response.status != 200) {
         
        throw new Error('Failed to fetch videos');
      }
      const data = await response.data;
     
      setVideos(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Error fetching uploaded videos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line
  }, []); // re-run when accessToken changes

  return (
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {videos.map((video) => (
    <div key={video.id} className="border p-2 rounded shadow">
      <h2 className="font-semibold">{video.snippet.title}</h2>
      <iframe
        width="100%"
        height="215"
        src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1`}
        title={video.snippet.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full mt-2"
      ></iframe>
    </div>
  ))}
</div>
  );
}

export default YouTubeDashboard;
