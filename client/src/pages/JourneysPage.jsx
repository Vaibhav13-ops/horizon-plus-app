import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { FiNavigation, FiClock, FiTag, FiUser, FiCheckCircle, FiPlayCircle } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth.js';

const JourneysPage = () => {
  const [journeys, setJourneys] = useState([]);
  const [enrollmentStatuses, setEnrollmentStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchJourneysAndEnrollments = async () => {
      try {
        const { data: journeysData } = await api.get('/journeys');
        setJourneys(journeysData);

        if (user) {
          const enrollmentPromises = journeysData.map(async (journey) => {
            try {
              const { data } = await api.get(`/journeys/${journey._id}/enrollment-status`);
              return { journeyId: journey._id, ...data };
            } catch (error) {
              return { journeyId: journey._id, isEnrolled: false, enrollment: null };
            }
          });

          const enrollmentResults = await Promise.all(enrollmentPromises);
          const statusMap = {};
          enrollmentResults.forEach(result => {
            statusMap[result.journeyId] = {
              isEnrolled: result.isEnrolled,
              enrollment: result.enrollment
            };
          });
          setEnrollmentStatuses(statusMap);
        }
      } catch (error) {
        console.error('Failed to fetch journeys', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJourneysAndEnrollments();
  }, [user]);

  const getJourneyCardContent = (journey) => {
    const enrollmentStatus = enrollmentStatuses[journey._id];
    const isEnrolled = enrollmentStatus?.isEnrolled || false;

    if (isEnrolled) {
      return {
        linkTo: `/my-journeys/${journey._id}`,
        buttonText: "Continue Journey",
        buttonIcon: <FiPlayCircle />,
        buttonClass: "bg-green-600 hover:bg-green-700",
        cardClass: "border-green-500/50 bg-gradient-to-br from-slate-700/50 to-green-900/20",
        statusBadge: (
          <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <FiCheckCircle size={12} />
            Enrolled
          </div>
        )
      };
    }

    return {
      linkTo: `/journeys/${journey._id}`,
      buttonText: "Enroll Now",
      buttonIcon: <FiNavigation />,
      buttonClass: "bg-sky-600 hover:bg-sky-700",
      cardClass: "border-slate-700 hover:border-sky-500",
      statusBadge: null
    };
  };

  return (
    <div className="min-h-screen bg-slate-800">
      <main className="p-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-white">Discover Your Path with Journeys</h1>
            <p className="text-lg text-slate-300 mt-4 max-w-3xl mx-auto">
              Explore our guided programs, curated by top consultants to help you achieve your goals, one step at a time.
            </p>
        </div>
        
        {loading ? (
          <p className="text-white text-center text-xl">Loading Journeys...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {journeys.map(journey => {
              const cardContent = getJourneyCardContent(journey);
              
              return (
                <div key={journey._id} className="relative group">
                  <Link 
                    to={cardContent.linkTo} 
                    className={`block bg-slate-700/50 rounded-xl shadow-lg border p-6 hover:bg-slate-700 transition-all duration-300 transform hover:-translate-y-1 flex flex-col ${cardContent.cardClass}`}
                  >
                    {cardContent.statusBadge}
                    
                    <div className="flex-grow">
                        <h2 className="text-2xl font-bold text-white mb-2">{journey.title}</h2>
                        <p className="text-slate-300 line-clamp-3 mb-4">{journey.description}</p>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-slate-600 space-y-2 text-slate-300 text-sm">
                        <div className="flex items-center gap-2">
                            <FiUser className="text-sky-400" />
                            <span>Curated by {journey.consultant.username}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FiClock className="text-sky-400" />
                            <span>{journey.durationWeeks} Weeks</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FiTag className="text-sky-400" />
                            <span>₹{journey.price}</span>
                          </div>
                          <div className={`text-xs px-3 py-1 rounded-full font-medium ${cardContent.buttonClass} text-white flex items-center gap-1`}>
                            {cardContent.buttonIcon}
                            {cardContent.buttonText}
                          </div>
                        </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default JourneysPage;
