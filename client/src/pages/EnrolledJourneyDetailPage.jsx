import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api.js';
import { FiClock, FiTag, FiUser, FiCheckCircle, FiArrowLeft, FiCalendar } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';

const EnrolledJourneyDetailPage = () => {
  const { id } = useParams();
  const [journey, setJourney] = useState(null);
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledJourneyDetails = async () => {
      try {
        
        const { data: journeyData } = await api.get(`/journeys/${id}`);
        setJourney(journeyData);

        const { data: statusData } = await api.get(`/journeys/${id}/enrollment-status`);
        setEnrollmentData(statusData);

      } catch (error) {
        console.error('Failed to fetch enrolled journey details', error);
        toast.error('Could not load journey details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledJourneyDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto mb-4"></div>
          <p className="text-xl">Loading Journey Details...</p>
        </div>
      </div>
    );
  }
  
  if (!journey) {
    return (
      <div className="min-h-screen bg-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Journey not found</h2>
          <Link to="/my-journeys" className="text-sky-400 hover:text-sky-300">
            Back to My Journeys
          </Link>
        </div>
      </div>
    );
  }

  // Group steps by week
  const stepsByWeek = journey.steps.reduce((acc, step) => {
    (acc[step.week] = acc[step.week] || []).push(step);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-800">
      <ToastContainer position="bottom-right" theme="dark" />
      <main className="p-8 max-w-4xl mx-auto text-white">
        
        {/* Back Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/my-journeys" className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300">
            <FiArrowLeft />
            Back to My Journeys
          </Link>
          <span className="text-slate-500">|</span>
          <Link to="/journeys" className="text-slate-400 hover:text-sky-300">
            Browse All Journeys
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-extrabold mb-3">{journey.title}</h1>
          <p className="text-lg text-slate-300">{journey.description}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-slate-300">
            <div className="flex items-center gap-2">
              <FiUser className="text-sky-400" />
              Curated by {journey.consultant.username}
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="text-sky-400" />
              {journey.durationWeeks} Weeks
            </div>
            <div className="flex items-center gap-2">
              <FiTag className="text-sky-400" />
              ₹{journey.price}
            </div>
          </div>
        </div>

        
        <div className="my-8">
          <div className="bg-green-600/20 border-2 border-green-500/50 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-500 rounded-full p-2">
                <FiCheckCircle className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-400">You are enrolled in this journey!</h3>
                <p className="text-slate-300">You have full access to all content and can track your progress.</p>
              </div>
            </div>
            
        
            {enrollmentData?.enrollment?.createdAt && (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <FiCalendar className="text-green-400" />
                <span>
                  Enrolled on: {new Date(enrollmentData.enrollment.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link 
            to="/my-journeys"
            className="bg-sky-600 text-white font-bold py-4 rounded-lg text-lg hover:bg-sky-700 transition flex items-center justify-center gap-3"
          >
            Go to My Journeys Dashboard
          </Link>
          <button 
            disabled
            className="bg-gray-600 text-gray-300 font-bold py-4 rounded-lg text-lg cursor-not-allowed flex items-center justify-center gap-3"
            title="You are already enrolled in this journey"
          >
            <FiCheckCircle />
            Already Enrolled
          </button>
        </div>

        
        <div className="mb-8 bg-slate-700/40 border border-slate-600 rounded-lg p-4">
          <div className="flex items-center justify-center gap-2 text-slate-300">
            <FiCheckCircle className="text-green-400" />
            <p>You already have full access to this journey. No additional enrollment needed.</p>
          </div>
        </div>

        
        <div className="space-y-8">
          <h2 className="text-3xl font-bold border-b border-slate-700 pb-3">Your Journey Content</h2>
          <p className="text-slate-400">Here's what you have access to as an enrolled participant:</p>
          
          {Object.entries(stepsByWeek).map(([week, steps]) => (
            <div key={week} className="bg-slate-700/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-2xl font-semibold text-sky-400 mb-4">Week {week}</h3>
              <ul className="space-y-3">
                {steps.map(step => (
                  <li key={step._id} className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-100">{step.title}</p>
                      <p className="text-sm text-slate-400">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};

export default EnrolledJourneyDetailPage;
