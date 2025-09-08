import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { FiPlayCircle } from 'react-icons/fi';

const MyJourneysDashboard = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const { data } = await api.get('/journeys/my-enrollments');
                setEnrollments(data);
            } catch (error) {
                console.error("Failed to fetch user's journeys", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEnrollments();
    }, []);

    return (
        <main className="p-8 max-w-7xl mx-auto text-white">
            <div className="mb-12">
                <h1 className="text-5xl font-extrabold text-white">My Journeys</h1>
                <p className="text-lg text-slate-300 mt-4">Your personal space to track and continue your growth programs.</p>
            </div>

            {loading ? (
                <p>Loading your enrolled journeys...</p>
            ) : enrollments.length === 0 ? (
                <div className="text-center bg-slate-700/50 p-12 rounded-lg">
                    <h3 className="text-2xl font-bold">You are not enrolled in any Journeys yet.</h3>
                    <p className="text-slate-400 mt-2 mb-6">Explore our guided programs to find the perfect path for you.</p>
                    <Link to="/journeys" className="bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 transition">
                        Discover Journeys
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {enrollments.map(({ journey }) => (
                        <div key={journey._id} className="bg-slate-700/50 p-6 rounded-lg flex items-center justify-between border border-slate-700">
                            <div>
                                <h2 className="text-2xl font-bold">{journey.title}</h2>
                                <p className="text-slate-400">by {journey.consultant.username}</p>
                            </div>
                            <Link to={`/my-journeys/${journey._id}`} className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                                <FiPlayCircle /> Continue Journey
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};

export default MyJourneysDashboard;
