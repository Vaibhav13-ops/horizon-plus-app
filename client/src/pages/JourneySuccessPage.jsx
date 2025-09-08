import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { FiCheckCircle, FiLoader, FiXCircle } from 'react-icons/fi';
import api from '../api.js';

const JourneySuccessPage = () => {
  const { width, height } = useWindowSize();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('confirming');
  const hasFinalized = useRef(false);

  useEffect(() => {
    const finalizeEnrollment = async () => {
      if (hasFinalized.current) return;
      hasFinalized.current = true;

      try {
        const paymentIntentId = searchParams.get('payment_intent');
        const journeyId = searchParams.get('journey_id');

        if (!paymentIntentId || !journeyId) {
          throw new Error("Missing journey details for finalization.");
        }

        // Call the backend to officially enroll the user
        await api.post('/journeys/enroll', { paymentIntentId, journeyId });

        setStatus('success');
      } catch (error) {
        console.error("Journey enrollment finalization failed:", error);
        setStatus('error');
      }
    };

    finalizeEnrollment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center">
      {status === 'success' && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.2} />}
      <main className="p-8 max-w-2xl mx-auto text-center text-white">
        <div className="bg-slate-700/50 p-12 rounded-xl flex flex-col items-center">
          {status === 'confirming' && (
             <><FiLoader className="text-sky-400 text-7xl mb-6 animate-spin" />
              <h1 className="text-4xl font-bold mb-4">Finalizing Your Enrollment...</h1></>
          )}
          {status === 'success' && (
             <><FiCheckCircle className="text-green-400 text-7xl mb-6" />
              <h1 className="text-4xl font-bold mb-4">Enrollment Confirmed!</h1>
              <p className="text-slate-300 text-lg mb-8">Welcome! You can now begin your new Journey from your dashboard.</p>
              <Link to="/my-journeys" className="bg-sky-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-600 transition">Go to My Journeys</Link></>
          )}
           {status === 'error' && (
             <><FiXCircle className="text-red-400 text-7xl mb-6" />
              <h1 className="text-4xl font-bold mb-4">Enrollment Failed</h1>
              <p className="text-slate-300 text-lg mb-8">There was an issue confirming your enrollment. Please contact support if payment was taken.</p>
              <Link to="/journeys" className="bg-sky-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-600 transition">Back to Journeys</Link></>
          )}
        </div>
      </main>
    </div>
  );
};

export default JourneySuccessPage;
