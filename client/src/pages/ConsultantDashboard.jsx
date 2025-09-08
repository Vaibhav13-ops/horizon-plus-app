import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api.js';
import { FiUser, FiEdit, FiClock, FiDollarSign, FiLogOut, FiCalendar, FiPlus, FiNavigation } from 'react-icons/fi';
import EditProfileModal from '../components/EditProfileModal.jsx';
import ManageAvailabilityModal from '../components/ManageAvailabilityModal.jsx';
import JourneyFormModal from '../components/JourneyFormModal.jsx'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConsultantDashboard = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [journeys, setJourneys] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isManagingAvailability, setIsManagingAvailability] = useState(false);
  const [editingJourney, setEditingJourney] = useState(null); 
  const [isJourneyModalOpen, setIsJourneyModalOpen] = useState(false);


  useEffect(() => {
    const fetchDashboardData = async () => {
      if (user?.role === 'consultant') {
        try {
          const [profileRes, bookingsRes, journeysRes] = await Promise.all([
            api.get('/consultants/profile/me'),
            api.get('/consultants/bookings/my'),
            api.get('/journeys/my-journeys'), 
          ]);

          setProfile(profileRes.data);
          setBookings(bookingsRes.data);
          setJourneys(journeysRes.data);

        } catch (error) {
          console.error('Failed to fetch dashboard data', error);
          toast.error('Could not load your dashboard data.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDashboardData();
  }, [user]);

  const handleSaveProfile = async (updatedData) => {
    try {
      const { data } = await api.put('/consultants/profile', updatedData);
      setProfile(data);
      setIsEditingProfile(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleSaveAvailability = async (newAvailability) => {
    try {
      const { data } = await api.put('/consultants/availability', { availability: newAvailability });
      setProfile(prevProfile => ({ ...prevProfile, availability: data }));
      setIsManagingAvailability(false);
      toast.success('Availability saved!');
    } catch (error) {
      console.error('Failed to save availability', error);
      toast.error('Failed to save availability. Please try again.');
    }
  };


  const handleSaveJourney = async (journeyData) => {
    try {
        if (journeyData._id) { 
            const { data } = await api.put(`/journeys/${journeyData._id}`, journeyData);
            setJourneys(journeys.map(j => j._id === data._id ? data : j));
            toast.success('Journey updated successfully!');
        } else { 
            const { data } = await api.post('/journeys', journeyData);
            setJourneys([...journeys, data]);
            toast.success('Journey created successfully!');
        }
        setIsJourneyModalOpen(false);
        setEditingJourney(null);
    } catch (error) {
        console.error('Failed to save journey', error);
        toast.error('Failed to save the journey. Please try again.');
    }
  };


  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading Your Workspace...</div>;
  }

  if (!profile) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Could not load your profile. Please try logging out and back in.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <ToastContainer position="bottom-right" theme="dark" />
      <header className="bg-slate-800 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-sky-400">Horizon+ for Consultants</h1>
        <div>
          <span className="mr-4">Welcome, {profile.user.username}!</span>
          <button onClick={logout} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition inline-flex items-center gap-2">
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-8">
          Professional Dashboard: <span className="text-sky-400">{profile.user.username}</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Public Profile Card */}
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold flex items-center gap-3"><FiUser className="text-sky-400" /> Your Public Profile</h3>
                <button onClick={() => setIsEditingProfile(true)} className="bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-600 transition flex items-center gap-2">
                  <FiEdit /> Edit Profile
                </button>
              </div>
              <div className="space-y-4 text-slate-300">
                <div>
                  <h4 className="font-bold text-slate-100">Bio</h4>
                  <p className="whitespace-pre-wrap">{profile.bio}</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-100">Areas of Expertise</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.expertise.map((skill, index) => (
                      <span key={index} className="bg-slate-700 text-sky-300 text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

        
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-semibold flex items-center gap-3"><FiNavigation className="text-purple-400" /> My Journeys</h3>
                    <button onClick={() => { setEditingJourney(null); setIsJourneyModalOpen(true); }} className="bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-600 transition flex items-center gap-2">
                        <FiPlus /> Create New Journey
                    </button>
                </div>
                <div className="space-y-3">
                    {journeys.length > 0 ? (
                        journeys.map(journey => (
                            <div key={journey._id} className="bg-slate-700/50 p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{journey.title} <span className={`text-xs ml-2 px-2 py-0.5 rounded-full ${journey.isPublished ? 'bg-green-500/20 text-green-300' : 'bg-slate-600 text-slate-300'}`}>{journey.isPublished ? 'Published' : 'Draft'}</span></p>
                                    <p className="text-sm text-slate-400">{journey.durationWeeks} weeks - ₹{journey.price}</p>
                                </div>
                                <button onClick={() => { setEditingJourney(journey); setIsJourneyModalOpen(true); }} className="text-slate-300 hover:text-white font-semibold">Edit</button>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-400 text-sm">You haven't created any Journeys yet. Click "Create" to get started!</p>
                    )}
                </div>
            </div>
            
           
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
              <h3 className="text-2xl font-semibold flex items-center gap-3 mb-4">
                <FiCalendar className="text-green-400" />
                Session Management
              </h3>
              <div>
                <h4 className="font-bold text-slate-100 mb-2">All My Sessions ({bookings.length})</h4>
                {bookings.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {bookings.map(booking => (
                       <div key={booking._id} className="bg-slate-700/50 p-3 rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{booking.user.username}</p>
                            <p className="text-sm text-slate-400">{booking.timeSlot}</p>
                          </div>
                          <a href={booking.videoCallLink} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white text-sm font-bold py-1 px-3 rounded-md hover:bg-green-600">Join Call</a>
                       </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">You have no booked sessions.</p>
                )}
              </div>
            </div>
          </div>

          
          <div className="space-y-8">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
              <h3 className="text-2xl font-semibold flex items-center gap-3 mb-4"><FiDollarSign className="text-green-400" /> Your Rate</h3>
              <div className="text-4xl font-bold text-white">
                ₹{profile.ratePerSession}<span className="text-lg font-normal text-slate-400"> / session</span>
              </div>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
              <h3 className="text-2xl font-semibold flex items-center gap-3 mb-4"><FiClock className="text-purple-400" /> Availability</h3>
              <button onClick={() => setIsManagingAvailability(true)} className="text-sky-400 font-semibold hover:text-sky-300">Manage</button>
              <div className="space-y-3 mt-4">
                {profile.availability?.length > 0 ? (
                  profile.availability.map(daySchedule => (
                    <div key={daySchedule.day}>
                      <p className="font-semibold text-slate-200">{daySchedule.day}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {daySchedule.slots.map(slot => (
                          <span key={slot} className="bg-green-500/20 text-green-300 text-xs font-medium px-2.5 py-1 rounded-full">{slot}</span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400">Your schedule is not set up yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {isEditingProfile && <EditProfileModal profile={profile} onClose={() => setIsEditingProfile(false)} onSave={handleSaveProfile} />}
      {isManagingAvailability && <ManageAvailabilityModal currentAvailability={profile.availability} onClose={() => setIsManagingAvailability(false)} onSave={handleSaveAvailability} />}
      
      {/* Render the Journey Form Modal */}
      {isJourneyModalOpen && <JourneyFormModal existingJourney={editingJourney} onSave={handleSaveJourney} onClose={() => { setIsJourneyModalOpen(false); setEditingJourney(null); }} />}
    </div>
  );
};

export default ConsultantDashboard;
