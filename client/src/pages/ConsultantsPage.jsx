import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { FiStar } from 'react-icons/fi';


const ConsultantsPage = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const { data } = await api.get('/consultants');
        setConsultants(data);
      } catch (error) {
        console.error('Failed to fetch consultants', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConsultants();
  }, []);

  return (
    <div className="min-h-screen bg-slate-800">
      <main className="p-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-white">Find Your Guide</h1>
            <p className="text-lg text-slate-300 mt-4 max-w-2xl mx-auto">Browse our community of vetted professionals ready to help you on your journey.</p>
        </div>
        
        {loading ? (
          <p className="text-white text-center text-xl">Loading consultants...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {consultants.map(profile => (
              <Link to={`/consultants/${profile.user._id}`} key={profile._id} className="block bg-slate-700/50 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-sky-500 hover:bg-slate-700 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-sky-500 flex items-center justify-center text-white text-2xl font-bold mr-4">
                        {profile.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{profile.user.username}</h2>
                        <div className="flex items-center gap-1 text-amber-400 mt-1">
                          {profile.numReviews > 0 ? (
                            <>
                              <FiStar fill="currentColor" />
                              <span className="text-white font-semibold">{profile.avgRating}</span>
                              <span className="text-slate-400 text-sm">({profile.numReviews} reviews)</span>
                            </>
                          ) : (
                            <span className="text-slate-400 text-sm">No reviews yet</span>
                          )}
                        </div>
                         
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 my-4">
                  {profile.expertise.slice(0, 3).map(skill => (
                    <span key={skill} className="bg-sky-500/20 text-sky-300 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
                  ))}
                </div>
                <p className="text-slate-300 line-clamp-3">{profile.bio}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ConsultantsPage;
