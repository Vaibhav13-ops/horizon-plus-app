import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm.jsx';
import { FiUser, FiDollarSign, FiClock, FiStar, FiSend } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../hooks/useAuth.js';

const stripePromise = loadStripe('pk_test_51S0GBR0MvkBDHESUnPCZlbqZRSffBKsrWmElHtBKH9DjgAzoh5TSH4cVG7nGkR7UNWP84iFCQvCxsK7m2JNyWGZp00caFAU9WB');

const ConsultantDetailPage = () => {
  const { id: consultantId } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchConsultantData = async () => {
      if (!consultantId) return;
      try {
        const profilePromise = api.get(`/consultants/${consultantId}`);
        const reviewsPromise = api.get(`/reviews/${consultantId}`);
        
        const [profileRes, reviewsRes] = await Promise.all([profilePromise, reviewsPromise]);
        
        setProfile(profileRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error('Failed to fetch consultant data', error);
        toast.error('Could not load consultant details.');
      } finally {
        setLoading(false);
      }
    };
    fetchConsultantData();
  }, [consultantId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (newReview.comment.trim() === '') {
      toast.warn('Please write a comment for your review.');
      return;
    }
    try {
      await api.post(`/reviews/${consultantId}`, newReview);
      toast.success('Thank you for your review!');
      const { data } = await api.get(`/reviews/${consultantId}`);
      setReviews(data);
      setNewReview({ rating: 5, comment: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review.');
    }
  };

  const startBookingProcess = async () => {
    if (!selectedSlot) {
      toast.warn("Please select an available time slot first.");
      return;
    }
    try {
      const { data } = await api.post('/payments/create-payment-intent', { 
        consultantId,
        timeSlot: `${selectedSlot.day} ${selectedSlot.time}`
      });
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Failed to create payment intent", error);
      toast.error("Could not start booking process. Please try again.");
    }
  }; 

  if (loading) {
    return <div className="min-h-screen bg-slate-800 text-white flex items-center justify-center">Loading Profile...</div>;
  }
  
  if (!profile) {
    return <div className="min-h-screen bg-slate-800 text-white flex items-center justify-center">Consultant not found.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-800">
      <ToastContainer position="bottom-right" theme="dark" />
      <main className="p-8 max-w-6xl mx-auto text-white">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center mb-12">
          <div className="w-32 h-32 rounded-full bg-sky-500 flex items-center justify-center text-white text-5xl font-bold mr-0 sm:mr-8 mb-4 sm:mb-0 flex-shrink-0 border-4 border-slate-700">
            {profile.user.username.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-5xl font-bold">{profile.user.username}</h1>
            <div className="flex flex-wrap gap-2 my-3 justify-center sm:justify-start">
              {profile.expertise.map(skill => (
                <span key={skill} className="bg-sky-500/20 text-sky-300 text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
              ))}
            </div>
             <div className="flex items-center gap-1 text-amber-400 justify-center sm:justify-start">
                {profile.numReviews > 0 ? (
                    <>
                    <FiStar fill="currentColor" />
                    <span className="text-white font-semibold">{profile.avgRating}</span>
                    <span className="text-slate-400 text-base">({profile.numReviews} reviews)</span>
                    </>
                ) : (
                    <span className="text-slate-400 text-base">No reviews yet</span>
                )}
            </div>
          </div>
        </div>

      
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-2xl font-semibold mb-3 flex items-center gap-3"><FiUser /> About Me</h3>
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{profile.bio}</p>
            </div>
            
            <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3"><FiStar /> Client Reviews</h3>
                <div className="space-y-6 mb-8">
                    {reviews.length > 0 ? (
                        reviews.map(review => (
                            <div key={review._id} className="border-b border-slate-600 pb-6 last:border-b-0 last:pb-0">
                                <div className="flex items-center mb-2">
                                    <div className="flex text-amber-400 text-lg">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar key={i} fill={i < review.rating ? 'currentColor' : 'none'} />
                                        ))}
                                    </div>
                                    <p className="ml-4 font-bold text-slate-100">{review.username}</p>
                                </div>
                                <p className="text-slate-300">{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-400">This consultant doesn't have any reviews yet.</p>
                    )}
                </div>
                
                {user && user.role === 'user' && (
                    <form onSubmit={handleReviewSubmit}>
                        <h4 className="text-xl font-semibold mb-3 pt-6 border-t border-slate-600">Leave a Review</h4>
                        <div className="flex items-center mb-3">
                            <span className="text-slate-300 mr-3">Your Rating:</span>
                            {[...Array(5)].map((_, i) => (
                                <FiStar 
                                    key={i} 
                                    className="cursor-pointer text-2xl text-slate-400 hover:text-amber-400 transition"
                                    fill={i < newReview.rating ? '#FBBF24' : 'none'}
                                    stroke={i < newReview.rating ? '#FBBF24' : 'currentColor'}
                                    onClick={() => setNewReview({...newReview, rating: i + 1})}
                                />
                            ))}
                        </div>
                        <textarea 
                            className="w-full p-3 bg-slate-800 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            rows="4"
                            placeholder="Share your experience with this consultant..."
                            value={newReview.comment}
                            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        />
                        <button type="submit" className="mt-4 bg-sky-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-sky-700 transition flex items-center gap-2">
                            <FiSend /> Submit Review
                        </button>
                    </form>
                )}
            </div>
          </div>

          
          <div className="lg:col-span-2">
             <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-700 sticky top-8">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-600">
                    <FiDollarSign className="text-green-400 text-3xl" />
                    <span className="text-3xl font-bold">₹{profile.ratePerSession}</span>
                    <span className="text-slate-400 text-lg mt-1">/ session</span>
                </div>
                
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-3"><FiClock /> Select a Time</h3>
                    {profile.availability?.length > 0 ? (
                    profile.availability.map(daySchedule => (
                        <div key={daySchedule.day}>
                        <p className="font-semibold text-slate-200 mb-2">{daySchedule.day}</p>
                        <div className="flex flex-wrap gap-2">
                            {daySchedule.slots.map(slot => (
                            <button 
                                key={slot} 
                                onClick={() => setSelectedSlot({ day: daySchedule.day, time: slot })}
                                className={`transition px-4 py-2 rounded-lg text-sm font-medium ${
                                selectedSlot?.time === slot && selectedSlot?.day === daySchedule.day 
                                    ? 'bg-green-500 text-white ring-2 ring-white shadow-lg' 
                                    : 'bg-slate-600 hover:bg-slate-500'
                                }`}
                            >
                                {slot}
                            </button>
                            ))}
                        </div>
                        </div>
                    ))
                    ) : (
                    <p className="text-slate-400 text-sm">This consultant has not set their schedule yet.</p>
                    )}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-600">
                    <p className="text-slate-300 text-center text-sm mb-4 h-5">
                        {selectedSlot ? `Selected: ${selectedSlot.day} at ${selectedSlot.time}` : "Please select a time to proceed."}
                    </p>
                    <button 
                        onClick={startBookingProcess} 
                        disabled={!selectedSlot}
                        className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 text-lg"
                    >
                        Book Session
                    </button>
                </div>
             </div>
          </div>
        </div>

        
        {clientSecret && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl p-8 w-full max-w-md border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white">Confirm Your Booking</h3>
                <button onClick={() => setClientSecret("")} className="text-slate-400 hover:text-white text-2xl">&times;</button>
              </div>
              <Elements 
                options={{ clientSecret, appearance: { theme: 'night', labels: 'floating' } }} 
                stripe={stripePromise}
              >
                <CheckoutForm 
                  consultantId={consultantId} 
                  timeSlot={`${selectedSlot.day} ${selectedSlot.time}`} 
                />
              </Elements>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ConsultantDetailPage;
