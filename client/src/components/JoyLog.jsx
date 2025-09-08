// import { useState, useEffect } from 'react';
// import { useAuth } from '../hooks/useAuth';
// import axios from 'axios';
// import { FiEdit, FiZap, FiTrash2, FiEdit3, FiPlusCircle, FiBookOpen } from 'react-icons/fi'; 
// import EditLogModal from './EditLogModal';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';


// const LogEntryCard = ({ entry, onEdit, onDelete }) => {
//     return (
//         <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative group">
//             <div className="flex justify-between items-start mb-4">
//                 <p className="text-slate-200 whitespace-pre-wrap text-lg flex-grow leading-relaxed">{entry.content}</p>
                
//                 <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <button 
//                         onClick={() => onEdit(entry)} 
//                         className="p-2 rounded-full bg-slate-700 text-slate-400 hover:text-sky-400 hover:bg-slate-600 transition-colors" 
//                         title="Edit Entry"
//                     >
//                         <FiEdit3 size={18} />
//                     </button>
//                     <button 
//                         onClick={() => onDelete(entry._id)} 
//                         className="p-2 rounded-full bg-slate-700 text-slate-400 hover:text-red-500 hover:bg-slate-600 transition-colors" 
//                         title="Delete Entry"
//                     >
//                         <FiTrash2 size={18} />
//                     </button>
//                 </div>
//             </div>
            
//             <p className="text-right text-sm text-slate-500 mt-2">
//                 {new Date(entry.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
//             </p>

            
//             <div className="mt-8 pt-8 border-t border-slate-700">
//                 {entry.recommendationsLoading ? (
//                     <div className="flex items-center justify-center gap-3 text-sky-400 py-6">
//                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-400"></div>
//                         <span className="text-lg">AI is finding the best resources for you...</span>
//                     </div>
//                 ) : entry.aiRecommendations?.length > 0 ? (
//                     <div>
//                         <h4 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
//                             <FiZap className="text-yellow-400" size={24} /> AI Guidance & Resources
//                         </h4>
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                             {entry.aiRecommendations.map(rec => (
//                                 <a 
//                                     key={rec.videoId} 
//                                     href={`https://www.youtube.com/watch?v=${rec.videoId}`} 
//                                     target="_blank" 
//                                     rel="noopener noreferrer"
//                                     className="block bg-slate-700 rounded-lg shadow-md overflow-hidden hover:bg-slate-600 hover:scale-105 transition-all duration-300 group"
//                                 >
//                                     <div className="aspect-video mb-3">
//                                         <img 
//                                             src={`https://img.youtube.com/vi/${rec.videoId}/hqdefault.jpg`} 
//                                             alt={rec.title} 
//                                             className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
//                                         />
//                                     </div>
//                                     <div className="p-4">
//                                         <h5 className="font-semibold text-sky-400 text-base mb-1 group-hover:text-white transition-colors">{rec.title}</h5>
//                                     </div>
//                                 </a>
//                             ))}
//                         </div>
//                     </div>
//                 ) : (
//                     !entry.recommendationsLoading && (
//                         <div className="text-center py-6 text-slate-500">
//                             <FiBookOpen size={32} className="mx-auto mb-3" />
//                             <p className="text-lg">No specific AI recommendations were generated for this entry.</p>
//                             <p className="text-sm">Try writing a more detailed or problem-focused entry next time!</p>
//                         </div>
//                     )
//                 )}
//             </div>
//         </div>
//     );
// };


// const JoyLogPage = () => {
//     const { user } = useAuth();
//     const [entries, setEntries] = useState([]);
//     const [newEntry, setNewEntry] = useState('');
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
    
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [editingEntry, setEditingEntry] = useState(null);

//     useEffect(() => {
//         const fetchEntries = async () => {
//             if (!user) return;
//             try {
//                 const config = { headers: { Authorization: `Bearer ${user.token}` } };
//                 const { data } = await axios.get('http://localhost:5000/api/joylog', config);
//                 setEntries(data);
//             } catch (err) {
//                 setError('Failed to load your entries. Please try again later.',err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchEntries();
//     }, [user]);

//     const pollForRecommendations = async (entryId) => {
//         const interval = setInterval(async () => {
//             try {
//                 const config = { headers: { Authorization: `Bearer ${user.token}` } };
//                 const { data: refreshedEntries } = await axios.get('http://localhost:5000/api/joylog', config);
//                 const updatedEntry = refreshedEntries.find(e => e._id === entryId);
                
//                 if (updatedEntry && !updatedEntry.recommendationsLoading || !updatedEntry) {
//                     setEntries(refreshedEntries); 
//                     clearInterval(interval);
//                 }
//             } catch (err) {
//                 console.error("Polling error:", err);
//                 clearInterval(interval); 
//             }
//         }, 5000); 
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (newEntry.trim() === '') {
//             toast.warn("Please write something before saving.");
//             return;
//         }

//         try {
//             const config = { headers: { Authorization: `Bearer ${user.token}` } };
//             const { data: createdEntry } = await axios.post('http://localhost:5000/api/joylog', { content: newEntry }, config);
            
//             setEntries([createdEntry, ...entries]); 
//             setNewEntry(''); 
//             setError(''); 
//             toast.success("Entry saved! AI is now finding resources...");
            
//             pollForRecommendations(createdEntry._id); 
//         } catch (err) {
//             console.error("Error saving entry:", err);
//             setError('Could not save your entry. Please try again.');
//             toast.error('Could not save your entry.');
//         }
//     };

//     const handleDeleteEntry = async (entryId) => {
//         if (window.confirm("Are you sure you want to delete this log entry? This action cannot be undone.")) {
//             try {
//                 const config = { headers: { Authorization: `Bearer ${user.token}` } };
//                 await axios.delete(`http://localhost:5000/api/joylog/${entryId}`, config);
//                 setEntries(entries.filter(e => e._id !== entryId)); 
//                 toast.success("Entry deleted successfully.");
//             } catch (err) {
//                 toast.error("Failed to delete entry. Please try again.",err);
//             }
//         }
//     };

//     const handleOpenEditModal = (entry) => {
//         setEditingEntry(entry);
//         setIsEditModalOpen(true);
//     };

//     const handleUpdateEntry = async (entryId, content) => {
//         try {
//             const config = { headers: { Authorization: `Bearer ${user.token}` } };
//             const { data: updatedEntry } = await axios.put(`http://localhost:5000/api/joylog/${entryId}`, { content }, config);
            
//             setEntries(entries.map(e => (e._id === entryId ? updatedEntry : e))); 
//             setIsEditModalOpen(false); 
//             setEditingEntry(null); 
//             toast.success("Entry updated successfully!");
//         } catch (err) {
//             toast.error("Failed to update entry. Please try again.",err);
//         }
//     };

//     return (
//         <div className="p-8 text-white max-w-5xl mx-auto">
//             <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />

//             {/* Enhanced Header */}
//             <div className="mb-12 text-center">
//                 <h1 className="text-5xl font-extrabold text-white mb-3 flex items-center justify-center gap-4">
//                     <FiEdit className="text-sky-400" size={48} /> Growth Compass
//                 </h1>
//                 <p className="text-xl text-slate-400 max-w-2xl mx-auto">
//                     This is your private space to reflect on your journey. When you save an entry, your AI partner will find helpful YouTube resources based on your thoughts.
//                 </p>
//             </div>

//             {/* Input Form with better styling */}
//             <form onSubmit={handleSubmit} className="mb-16 p-8 bg-slate-800 rounded-xl shadow-xl border border-slate-700">
//                 <label htmlFor="joy-entry" className="block text-xl font-semibold text-slate-200 mb-4">
//                     What brought you joy today, or what's on your mind?
//                 </label>
//                 <textarea
//                     id="joy-entry"
//                     className="w-full p-5 bg-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-600 focus:border-transparent transition-all duration-200 caret-sky-400 resize-y"
//                     rows="6"
//                     placeholder="Write about a small step you took, a moment of clarity, or anything that brought you joy..."
//                     value={newEntry}
//                     onChange={(e) => setNewEntry(e.target.value)}
//                 />
//                 <button
//                     type="submit"
//                     className="mt-6 w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-lg rounded-full shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
//                 >
//                     <FiPlusCircle size={20} /> Save Entry & Get AI Insights
//                 </button>
//             </form>

//             {/* Past Entries Section */}
//             <div>
//                 <h3 className="text-3xl font-bold text-white border-b-2 border-slate-700 pb-4 mb-8">Past Entries</h3>
//                 {loading ? ( 
//                     <div className="text-center py-10"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400"></div><p className="mt-4 text-lg text-slate-400">Loading your journal...</p></div>
//                 ) : error ? ( 
//                     <p className="text-red-400 text-center py-10 text-lg">{error}</p> 
//                 ) : entries.length === 0 ? ( 
//                     <div className="text-center py-10 text-slate-500">
//                         <FiBookOpen size={48} className="mx-auto mb-4" />
//                         <p className="text-xl">Your Joy Log is empty!</p>
//                         <p className="text-md mt-2">Start by writing your first entry above to track your progress and get AI-powered insights.</p>
//                     </div>
//                 ) : (
//                     <div className="space-y-8"> 
//                         {entries.map((entry) => (
//                             <LogEntryCard 
//                                 key={entry._id} 
//                                 entry={entry} 
//                                 onEdit={handleOpenEditModal}
//                                 onDelete={handleDeleteEntry}
//                             />
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {isEditModalOpen && (
//                 <EditLogModal 
//                     entry={editingEntry}
//                     onSave={handleUpdateEntry}
//                     onClose={() => setIsEditModalOpen(false)}
//                 />
//             )}
//         </div>
//     );
// };

// export default JoyLogPage;







import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api.js';
import { FiEdit, FiZap, FiTrash2, FiEdit3, FiPlusCircle, FiBookOpen } from 'react-icons/fi'; 
import EditLogModal from './EditLogModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const LogEntryCard = ({ entry, onEdit, onDelete }) => {
    return (
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative group">
            <div className="flex justify-between items-start mb-4">
                <p className="text-slate-200 whitespace-pre-wrap text-lg flex-grow leading-relaxed">{entry.content}</p>
                
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                        onClick={() => onEdit(entry)} 
                        className="p-2 rounded-full bg-slate-700 text-slate-400 hover:text-sky-400 hover:bg-slate-600 transition-colors" 
                        title="Edit Entry"
                    >
                        <FiEdit3 size={18} />
                    </button>
                    <button 
                        onClick={() => onDelete(entry._id)} 
                        className="p-2 rounded-full bg-slate-700 text-slate-400 hover:text-red-500 hover:bg-slate-600 transition-colors" 
                        title="Delete Entry"
                    >
                        <FiTrash2 size={18} />
                    </button>
                </div>
            </div>
            
            <p className="text-right text-sm text-slate-500 mt-2">
                {new Date(entry.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>

            
            <div className="mt-8 pt-8 border-t border-slate-700">
                {entry.recommendationsLoading ? (
                    <div className="flex items-center justify-center gap-3 text-sky-400 py-6">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-400"></div>
                        <span className="text-lg">AI is finding the best resources for you...</span>
                    </div>
                ) : entry.aiRecommendations?.length > 0 ? (
                    <div>
                        <h4 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
                            <FiZap className="text-yellow-400" size={24} /> AI Guidance & Resources
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {entry.aiRecommendations.map(rec => (
                                <a 
                                    key={rec.videoId} 
                                    href={`https://www.youtube.com/watch?v=${rec.videoId}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block bg-slate-700 rounded-lg shadow-md overflow-hidden hover:bg-slate-600 hover:scale-105 transition-all duration-300 group"
                                >
                                    <div className="aspect-video mb-3">
                                        <img 
                                            src={`https://img.youtube.com/vi/${rec.videoId}/hqdefault.jpg`} 
                                            alt={rec.title} 
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h5 className="font-semibold text-sky-400 text-base mb-1 group-hover:text-white transition-colors">{rec.title}</h5>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                ) : (
                    !entry.recommendationsLoading && (
                        <div className="text-center py-6 text-slate-500">
                            <FiBookOpen size={32} className="mx-auto mb-3" />
                            <p className="text-lg">No specific AI recommendations were generated for this entry.</p>
                            <p className="text-sm">Try writing a more detailed or problem-focused entry next time!</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};


const JoyLogPage = () => {
    const { user } = useAuth();
    const [entries, setEntries] = useState([]);
    const [newEntry, setNewEntry] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);

    useEffect(() => {
        const fetchEntries = async () => {
            if (!user) return;
            try {
                const { data } = await api.get('/joylog');
                setEntries(data);
            } catch (err) {
                setError('Failed to load your entries. Please try again later.',err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEntries();
    }, [user]);

    const pollForRecommendations = async (entryId) => {
        const interval = setInterval(async () => {
            try {
                const { data: refreshedEntries } = await api.get('/joylog');
                const updatedEntry = refreshedEntries.find(e => e._id === entryId);
                
                if (updatedEntry && !updatedEntry.recommendationsLoading || !updatedEntry) {
                    setEntries(refreshedEntries); 
                    clearInterval(interval);
                }
            } catch (err) {
                console.error("Polling error:", err);
                clearInterval(interval); 
            }
        }, 5000); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newEntry.trim() === '') {
            toast.warn("Please write something before saving.");
            return;
        }

        try {
            const { data: createdEntry } = await api.post('/joylog', { content: newEntry });
            
            setEntries([createdEntry, ...entries]); 
            setNewEntry(''); 
            setError(''); 
            toast.success("Entry saved! AI is now finding resources...");
            
            pollForRecommendations(createdEntry._id); 
        } catch (err) {
            console.error("Error saving entry:", err);
            setError('Could not save your entry. Please try again.');
            toast.error('Could not save your entry.');
        }
    };

    const handleDeleteEntry = async (entryId) => {
        if (window.confirm("Are you sure you want to delete this log entry? This action cannot be undone.")) {
            try {
                await api.delete(`/joylog/${entryId}`);
                setEntries(entries.filter(e => e._id !== entryId)); 
                toast.success("Entry deleted successfully.");
            } catch (err) {
                toast.error("Failed to delete entry. Please try again.",err.message);
            }
        }
    };

    const handleOpenEditModal = (entry) => {
        setEditingEntry(entry);
        setIsEditModalOpen(true);
    };

    const handleUpdateEntry = async (entryId, content) => {
        try {
            const { data: updatedEntry } = await api.put(`/joylog/${entryId}`, { content });
            
            setEntries(entries.map(e => (e._id === entryId ? updatedEntry : e))); 
            setIsEditModalOpen(false); 
            setEditingEntry(null); 
            toast.success("Entry updated successfully!");
        } catch (err) {
            toast.error("Failed to update entry. Please try again.",err.message);
        }
    };

    return (
        <div className="p-8 text-white max-w-5xl mx-auto">
            <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />

            {/* Enhanced Header */}
            <div className="mb-12 text-center">
                <h1 className="text-5xl font-extrabold text-white mb-3 flex items-center justify-center gap-4">
                    <FiEdit className="text-sky-400" size={48} /> Growth Compass
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                    This is your private space to reflect on your journey. When you save an entry, your AI partner will find helpful YouTube resources based on your thoughts.
                </p>
            </div>

            {/* Input Form with better styling */}
            <form onSubmit={handleSubmit} className="mb-16 p-8 bg-slate-800 rounded-xl shadow-xl border border-slate-700">
                <label htmlFor="joy-entry" className="block text-xl font-semibold text-slate-200 mb-4">
                    What brought you joy today, or what's on your mind?
                </label>
                <textarea
                    id="joy-entry"
                    className="w-full p-5 bg-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-600 focus:border-transparent transition-all duration-200 caret-sky-400 resize-y"
                    rows="6"
                    placeholder="Write about a small step you took, a moment of clarity, or anything that brought you joy..."
                    value={newEntry}
                    onChange={(e) => setNewEntry(e.target.value)}
                />
                <button
                    type="submit"
                    className="mt-6 w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-lg rounded-full shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                    <FiPlusCircle size={20} /> Save Entry & Get AI Insights
                </button>
            </form>

            {/* Past Entries Section */}
            <div>
                <h3 className="text-3xl font-bold text-white border-b-2 border-slate-700 pb-4 mb-8">Past Entries</h3>
                {loading ? ( 
                    <div className="text-center py-10"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400"></div><p className="mt-4 text-lg text-slate-400">Loading your journal...</p></div>
                ) : error ? ( 
                    <p className="text-red-400 text-center py-10 text-lg">{error}</p> 
                ) : entries.length === 0 ? ( 
                    <div className="text-center py-10 text-slate-500">
                        <FiBookOpen size={48} className="mx-auto mb-4" />
                        <p className="text-xl">Your Joy Log is empty!</p>
                        <p className="text-md mt-2">Start by writing your first entry above to track your progress and get AI-powered insights.</p>
                    </div>
                ) : (
                    <div className="space-y-8"> 
                        {entries.map((entry) => (
                            <LogEntryCard 
                                key={entry._id} 
                                entry={entry} 
                                onEdit={handleOpenEditModal}
                                onDelete={handleDeleteEntry}
                            />
                        ))}
                    </div>
                )}
            </div>

            {isEditModalOpen && (
                <EditLogModal 
                    entry={editingEntry}
                    onSave={handleUpdateEntry}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )}
        </div>
    );
};

export default JoyLogPage;
