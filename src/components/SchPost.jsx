// const SchPost = () => {
//   const dispatch = useDispatch();
//   const pages = useSelector((state) => state.pages.pages);
//   const user = useSelector((state) => state.pages.user);

//   const [selectedPage, setSelectedPage] = useState('');
//   const [message, setMessage] = useState('');
//   const [scheduledTime, setScheduledTime] = useState('');
//   const [mediaFile, setMediaFile] = useState(null);
//   const [mediaType, setMediaType] = useState('photo');

//   // Restore user from localStorage on mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       dispatch(setUser(JSON.parse(storedUser)));
//     }
//     fetchPages();
//   }, [dispatch]);

//   // Fetch pages after Facebook login
//   const fetchPages = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/auth/facebook/pages', {
//         withCredentials: true,
//       });
//       dispatch(setPages(res.data.pages));
//     } catch (err) {
//       console.error('Error fetching pages:', err);
//     }
//   };

//   const handleSchedulePost = async () => {
//     if (!mediaFile) return alert('Please select a media file.');
//     if (!selectedPage) return alert('Select a valid page.');
//     if (!scheduledTime) return alert('Select a scheduled time.');

//     const timestamp = Math.floor(new Date(scheduledTime).getTime() / 1000);
//     const formData = new FormData();
//     formData.append('pageId', selectedPage);
//     formData.append('message', message);
//     formData.append('scheduledTime', timestamp);
//     formData.append('mediaType', mediaType);
//     formData.append('file', mediaFile);

//     try {
//       const res = await axios.post('http://localhost:5000/schedulePost/timing', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         withCredentials: true,
//       });
//       alert('Scheduled Post ID: ' + res.data.postId);
//     } catch (err) {
//       alert('Failed to schedule post: ' + (err.response?.data?.error || err.message));
//     }
//   };

//   const handlePostNow = async () => {
//     if (!mediaFile) return alert('Please select a media file.');
//     if (!selectedPage) return alert('Select a valid page.');

//     const formData = new FormData();
//     formData.append('pageId', selectedPage);
//     formData.append('message', message);
//     formData.append('mediaType', mediaType);
//     formData.append('file', mediaFile);

//     try {
//       const res = await axios.post('http://localhost:5000/schedulePost/instantly', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         withCredentials: true,
//       });
//       alert('Post ID: ' + res.data.postId);
//     } catch (err) {
//       alert('Failed to post instantly: ' + (err.response?.data?.error || err.message));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#c7d2fe] flex items-center justify-center px-4">
//       {pages.length === 0 ? (
//         <FacebookLoginButton />
//       ) : (
//         <div className="bg-white shadow-2xl rounded-3xl w-full max-w-xl flex flex-col overflow-hidden">
//           {/* Headline Section */}
//           <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-center">
//             <h2 className="text-xl font-extrabold text-white tracking-wide mb-1">
//               Schedule a Facebook Post
//             </h2>
//             <p className="text-purple-100 text-sm">
//               Plan your content and reach your audience at the perfect time!
//             </p>
//           </div>

//           {/* Form Section */}
//           <div className="p-4 flex flex-col gap-3 bg-[#f6f8fa]">
//             <label className="block mb-1 text-sm font-semibold text-gray-700">Select Page</label>
//             <select
//               onChange={e => setSelectedPage(e.target.value)}
//               value={selectedPage}
//               className="w-full mb-2 border border-purple-300 rounded-lg p-2 bg-gradient-to-r from-blue-700 to-purple-600 text-white font-semibold focus:ring-2 focus:ring-purple-400"
//             >
//               <option value="">-- Choose a Page --</option>
//               {pages.map(page => (
//                 <option key={page.id} value={page.id}>{page.name}</option>
//               ))}
//             </select>

//             <label className="block mb-1 text-sm font-semibold text-gray-700">Message / Caption</label>
//             <textarea
//               value={message}
//               onChange={e => setMessage(e.target.value)}
//               className="w-full mb-2 border border-purple-300 rounded-lg p-2 h-14 bg-white text-gray-800 focus:ring-2 focus:ring-purple-400"
//               placeholder="Write your post message or caption..."
//             />

//             <label className="block mb-1 text-sm font-semibold text-gray-700">Media Type</label>
//             <select
//               value={mediaType}
//               onChange={e => setMediaType(e.target.value)}
//               className="w-full mb-2 border border-purple-300 rounded-lg p-2 bg-white text-gray-800 focus:ring-2 focus:ring-purple-400"
//             >
//               <option value="photo">Photo</option>
//               <option value="video">Video</option>
//             </select>

//             <label className="block mb-1 text-sm font-semibold text-gray-700">Upload Media</label>
//             <input
//               type="file"
//               accept={mediaType === 'photo' ? 'image/*' : 'video/*'}
//               onChange={e => setMediaFile(e.target.files[0])}
//               className="w-full mb-2 border border-purple-300 rounded-lg p-2 bg-white text-gray-800 focus:ring-2 focus:ring-purple-400"
//             />

//             <label className="block mb-1 text-sm font-semibold text-gray-700">Schedule Time</label>
//             <input
//               type="datetime-local"
//               value={scheduledTime}
//               onChange={e => setScheduledTime(e.target.value)}
//               className="w-full mb-4 border border-purple-300 rounded-lg p-2 bg-white text-gray-800 focus:ring-2 focus:ring-purple-400"
//             />

//             <div className="flex flex-col sm:flex-row gap-3 mt-2">
//               <button
//                 onClick={handleSchedulePost}
//                 className="flex-1 bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-green-600 hover:to-green-800 transition"
//               >
//                 Schedule Later
//               </button>
//               <button
//                 onClick={handlePostNow}
//                 className="flex-1 bg-gradient-to-r from-pink-500 to-pink-700 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-pink-600 hover:to-pink-800 transition"
//               >
//                 Post Now
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SchPost;