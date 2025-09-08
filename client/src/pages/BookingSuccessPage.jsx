import { useEffect, useState, useRef } from 'react'; // Import useRef
import { Link, useSearchParams } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { FiCheckCircle, FiLoader, FiXCircle } from 'react-icons/fi';
import api from '../api.js';

const BookingSuccessPage = () => {
  const { width, height } = useWindowSize();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('confirming');
  
  const hasFinalized = useRef(false);

  useEffect(() => {
    const finalize = async () => {
      if (hasFinalized.current) {
        return;
      }
      hasFinalized.current = true;

      try {
        const paymentIntentId = searchParams.get('payment_intent');
        const consultantId = searchParams.get('consultant_id');
        const timeSlot = searchParams.get('time_slot');

        if (!paymentIntentId || !consultantId || !timeSlot) {
          throw new Error("Missing booking details.");
        }

        await api.post('/bookings/finalize', {
          paymentIntentId,
          consultantId,
          timeSlot,
        });

        setStatus('success');
      } catch (error) {
        console.error("Finalization failed:", error);
        setStatus('error');
      }
    };

    finalize();
  }, [searchParams]);

  
  return (
    <div className="min-h-screen bg-slate-800">
      {status === 'success' && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.2} />}
      <main className="p-8 max-w-2xl mx-auto text-center text-white">
        <div className="bg-slate-700/50 p-12 rounded-xl flex flex-col items-center">
          {status === 'confirming' && (
             <><FiLoader className="text-sky-400 text-7xl mb-6 animate-spin" />
              <h1 className="text-4xl font-bold mb-4">Confirming Your Booking...</h1></>
          )}
          {status === 'success' && (
             <><FiCheckCircle className="text-green-400 text-7xl mb-6" />
              <h1 className="text-4xl font-bold mb-4">Booking Confirmed!</h1>
              <p className="text-slate-300 text-lg mb-8">Your session is confirmed. A confirmation email has been sent with the meeting details.</p>
              <Link to="/dashboard" className="bg-sky-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-600 transition">Back to Dashboard</Link></>
          )}
           {status === 'error' && (
             <><FiXCircle className="text-red-400 text-7xl mb-6" />
              <h1 className="text-4xl font-bold mb-4">Booking Failed</h1>
              <p className="text-slate-300 text-lg mb-8">There was an issue confirming your booking. Your payment has not been charged. Please contact support.</p>
              <Link to="/consultants" className="bg-sky-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-600 transition">Find Another Consultant</Link></>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookingSuccessPage;
