import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api.js';
import { FiArrowRight, FiClock, FiTag, FiUser, FiCheckCircle, FiPlayCircle, FiAlertCircle } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import JourneyCheckoutForm from '../components/JourneyCheckoutForm.jsx';
import { useAuth } from '../hooks/useAuth.js';

const stripePromise = loadStripe('pk_test_51S0GBR0MvkBDHESUnPCZlbqZRSffBKsrWmElHtBKH9DjgAzoh5TSH4cVG7nGkR7UNWP84iFCQvCxsK7m2JNyWGZp00caFAU9WB');

const JourneyDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [journey, setJourney] = useState(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState({ isEnrolled: false, enrollment: null });
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const fetchJourneyDetails = async () => {
      try {
        const { data: journeyData } = await api.get(`/journeys/${id}`);
        setJourney(journeyData);

        if (user) {
          try {
            const { data: statusData } = await api.get(`/journeys/${id}/enrollment-status`);
            setEnrollmentStatus(statusData);
          } catch (error) {
            setEnrollmentStatus({ isEnrolled: false, enrollment: null });
          }
        }
      } catch (error) {
        console.error('Failed to fetch journey details', error);
        toast.error('Could not load journey details.');
      } finally {
        setLoading(false);
      }
    };
    fetchJourneyDetails();
  }, [id, user]);

  const handleEnroll = async () => {
    if (enrollmentStatus.isEnrolled) {
      toast.error('You are already enrolled in this journey!');
      return;
    }

    try {
      const { data } = await api.post('/payments/create-journey-payment-intent', { journeyId: id });
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Failed to create payment intent for journey", error);
      if (error.response?.data?.message?.includes('already enrolled')) {
        toast.error("You are already enrolled in this journey!");
      } else {
        toast.error("Could not start the enrollment process. Please try again.");
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-800 text-white flex items-center justify-center">Loading Journey...</div>;
  }
  
  if (!journey) {
    return <div className="min-h-screen bg-slate-800 text-white flex items-center justify-center">Journey not found.</div>;
  }

  const stepsByWeek = journey.steps.reduce((acc, step) => {
    (acc[step.week] = acc[step.week] || []).push(step);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-800">
      <ToastContainer position="bottom-right" theme="dark" />
      <main className="p-8 max-w-4xl mx-auto text-white">
        <div className="mb-8">
          <h1 className="text-5xl font-extrabold mb-3">{journey.title}</h1>
          <p className="text-lg text-slate-300">{journey.description}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-slate-300">
            <div className="flex items-center gap-2"><FiUser className="text-sky-400" />Curated by {journey.consultant.username}</div>
            <div className="flex items-center gap-2"><FiClock className="text-sky-400" />{journey.durationWeeks} Weeks</div>
            <div className="flex items-center gap-2"><FiTag className="text-sky-400" />₹{journey.price}</div>
          </div>
        </div>

        <div className="my-8">
          {enrollmentStatus.isEnrolled ? (
            <div className="space-y-4">
              <div className="bg-green-600/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-3">
                <FiCheckCircle className="text-green-400 text-2xl" />
                <div>
                  <h3 className="font-bold text-green-400">You are enrolled in this journey!</h3>
                  <p className="text-slate-300 text-sm">Continue your progress and complete the steps.</p>
                </div>
              </div>
              <Link 
                to={`/my-journeys/${journey._id}`}
                className="w-full bg-green-600 text-white font-bold py-4 rounded-lg text-xl hover:bg-green-700 transition flex items-center justify-center gap-3"
              >
                <FiPlayCircle />
                Continue Your Journey
              </Link>
            </div>
          ) : user ? (
            <button 
              onClick={handleEnroll} 
              className="w-full bg-sky-600 text-white font-bold py-4 rounded-lg text-xl hover:bg-sky-700 transition flex items-center justify-center gap-3"
            >
              Enroll in this Journey <FiArrowRight />
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-amber-600/20 border border-amber-500/50 rounded-lg p-4 flex items-center gap-3">
                <FiAlertCircle className="text-amber-400 text-2xl" />
                <div>
                  <h3 className="font-bold text-amber-400">Login Required</h3>
                  <p className="text-slate-300 text-sm">Please log in to enroll in this journey.</p>
                </div>
              </div>
              <Link 
                to="/login"
                className="w-full bg-sky-600 text-white font-bold py-4 rounded-lg text-xl hover:bg-sky-700 transition flex items-center justify-center gap-3"
              >
                Login to Enroll <FiArrowRight />
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-8">
            <h2 className="text-3xl font-bold border-b border-slate-700 pb-3">What You'll Accomplish</h2>
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

        {clientSecret && (
            <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
              <div className="bg-slate-800 rounded-xl p-8 w-full max-w-md border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-white">Complete Your Enrollment</h3>
                  <button onClick={() => setClientSecret("")} className="text-slate-400 hover:text-white text-2xl">&times;</button>
                </div>
                <Elements options={{ clientSecret, appearance: { theme: 'night', labels: 'floating' } }} stripe={stripePromise}>
                  <JourneyCheckoutForm journeyId={id} />
                </Elements>
              </div>
            </div>
        )}        
      </main>
    </div>
  );
};

export default JourneyDetailPage;
