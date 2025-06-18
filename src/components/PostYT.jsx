import React, { useEffect, useState } from 'react';
import axios from 'axios';

function YouTubePosts() {
  const [videos, setVideos] = useState([]);
  const [googleTokenValid, setGoogleTokenValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      const res = await axios.get('https://socialsuit-backend-h9md.onrender.com/api/youtube/auth-url', { withCredentials: true });
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      alert('Failed to get Google login URL');
    }
  };

  useEffect(() => {
    const checkGoogleAuth = async () => {
      try {
        await axios.get('https://socialsuit-backend-h9md.onrender.com/api/youtube/check-auth', { withCredentials: true });
        setGoogleTokenValid(true);
      } catch {
        setGoogleTokenValid(false);
      }
    };
    checkGoogleAuth();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://socialsuit-backend-h9md.onrender.com/api/youtube/uploads', { withCredentials: true });
      setVideos(res.data || []);
    } catch (err) {
      setVideos([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (googleTokenValid) {
      fetchVideos();
    }
  }, [googleTokenValid]);

  const infiniteVideos = [...videos, ...videos];

  if (!googleTokenValid) {
    return (
      <div className="w-full max-w-xs mx-auto flex flex-col items-center">
        <button
          onClick={handleGoogleLogin}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow transition text-lg"
        >
          Login to YouTube
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .modal-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); z-index: 50; display: flex; align-items: center; justify-content: center; }
        .modal-content { background: #222; color: #fff; border-radius: 18px; max-width: 600px; width: 95vw; padding: 32px 24px 24px 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); position: relative; max-height: 90vh; overflow-y: auto; }
        .modal-close { position: absolute; top: 12px; right: 18px; font-size: 2rem; color: #fff; background: none; border: none; cursor: pointer; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .marquee-wrapper { overflow-x: hidden; position: relative; width: 100%; }
        .infinite-marquee { display: flex; animation: marquee 25s linear infinite; white-space: nowrap; will-change: transform; width: fit-content; }
        .infinite-marquee:hover { animation-play-state: paused; }
        .video-card { width: 180px; min-width: 180px; max-width: 180px; margin-right: 16px; height: 210px; background: #101522; border-radius: 14px; box-shadow: 0 2px 8px #0004; overflow: hidden; display: flex; flex-direction: column; cursor: pointer; }
        .video-card:last-child { margin-right: 0; }
        .video-title-overlay { position: absolute; bottom: 0; left: 0; width: 100%; background: rgba(0,0,0,0.7); color: #fff; font-size: 0.95rem; padding: 5px 10px; border-bottom-left-radius: 14px; border-bottom-right-radius: 14px; text-align: left; z-index: 2; }
        .video-frame-container { position: relative; width: 100%; height: 90px; background: #000; border-top-left-radius: 14px; border-top-right-radius: 14px; overflow: hidden; }
        @media (max-width: 800px) {
          .video-card { width: 130px; min-width: 130px; max-width: 130px; height: 150px; }
          .video-frame-container { height: 55px; }
        }
      `}</style>

      <div className="w-full">
        <h2 className="text-2xl font-semibold text-white mb-4">YOUTUBE VIDEOS</h2>
        {loading ? (
          <div className="text-blue-300 text-center py-10">Loading...</div>
        ) : (
          <div className="marquee-wrapper">
            <div className="infinite-marquee pb-2">
              {infiniteVideos.length === 0 ? (
                <div className="text-blue-200 text-lg">No videos found.</div>
              ) : (
                infiniteVideos.map((video, idx) => (
                  <div
                    key={`${video.id || idx}-${idx}`}
                    className="video-card"
                    onClick={() => setSelectedVideo(video)}
                    title="Click to view details"
                  >
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-blue-900/30">
                      <div className="w-7 h-7 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-base">
                        Y
                      </div>
                      <div>
                        <div className="font-semibold text-xs truncate">{video.snippet?.channelTitle || 'YouTube'}</div>
                        <div className="text-[10px] text-blue-300">
                          {video.snippet?.publishedAt ? new Date(video.snippet.publishedAt).toLocaleDateString() : ''}
                        </div>
                      </div>
                    </div>
                    <div className="video-frame-container">
                      {video.id && (
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${video.id}`}
                          title={video.snippet?.title || "YouTube video"}
                          frameBorder="0"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        />
                      )}
                      <div className="video-title-overlay">
                        {video.snippet?.title
                          ? video.snippet.title.slice(0, 40) + (video.snippet.title.length > 40 ? '...' : '')
                          : 'No title'}
                      </div>
                    </div>
                    <div className="flex justify-between items-center px-3 py-1 text-xs text-blue-300 border-t border-b border-blue-900/30">
                      <div><span role="img" aria-label="like">👍</span></div>
                      <div></div>
                    </div>
                    <div className="flex justify-around py-1">
                      <button className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300">👍 Like</button>
                      <button className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300">💬 Comment</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {selectedVideo && (
        <div className="modal-bg" onClick={() => setSelectedVideo(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedVideo(null)}>&times;</button>
            <h3 className="text-xl font-bold mb-2">{selectedVideo.snippet?.channelTitle || 'YouTube Channel'}</h3>
            <div className="text-xs text-blue-300 mb-2">
              {selectedVideo.snippet?.publishedAt ? new Date(selectedVideo.snippet.publishedAt).toLocaleString() : ''}
            </div>
            {selectedVideo.id && (
              <div className="w-full mb-4">
                <iframe
                  width="100%"
                  height="300"
                  src={`https://www.youtube.com/embed/${selectedVideo.id}`}
                  title={selectedVideo.snippet?.title || 'Video'}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-md"
                />
              </div>
            )}
            <div className="mb-2">
              <h4 className="font-semibold mb-1">Title</h4>
              <div>{selectedVideo.snippet?.title || 'No title'}</div>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Description</h4>
              <div>{selectedVideo.snippet?.description || 'No description'}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default YouTubePosts;
