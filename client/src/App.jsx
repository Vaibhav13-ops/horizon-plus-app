import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ActionBoard from './components/ActionBoard.jsx';
import JoyLog from './components/JoyLog.jsx';
import AICoach from './components/AICoach.jsx';
import ConsultantDashboard from './pages/ConsultantDashboard.jsx';
import ConsultantsPage from './pages/ConsultantsPage.jsx';
import ConsultantDetailPage from './pages/ConsultantDetailPage.jsx';
import BookingSuccessPage from './pages/BookingSuccessPage.jsx';
import JourneysPage from './pages/JourneysPage.jsx';
import JourneyDetailPage from './pages/JourneyDetailPage.jsx';
import JourneySuccessPage from './pages/JourneySuccessPage.jsx';
import MyJourneysDashboard from './pages/MyJourneysDashboard.jsx';
import EnrolledJourneyDetailPage from './pages/EnrolledJourneyDetailPage.jsx';
import WelcomePage from './pages/WelcomePage.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
  }

  return user && allowedRoles.includes(user.role) ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected Routes with Layout */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute allowedRoles={['user', 'consultant']}>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* IMPORTANT: This is the main fix - make sure welcome is the index route */}
        <Route index element={<WelcomePage />} />
        <Route path="welcome" element={<WelcomePage />} />
        <Route path="dashboard" element={<ActionBoard />} />
        <Route path="joy-log" element={<JoyLog />} />
        <Route path="ai-coach" element={<AICoach />} />
        <Route path="consultants" element={<ConsultantsPage />} />
        <Route path="consultants/:id" element={<ConsultantDetailPage />} />
        <Route path="booking-success" element={<BookingSuccessPage />} />
        <Route path="journeys" element={<JourneysPage />} />
        <Route path="journeys/:id" element={<JourneyDetailPage />} />
        <Route path="journey-success" element={<JourneySuccessPage />} />
        <Route path="my-journeys" element={<MyJourneysDashboard />} />
        <Route path="my-journeys/:id" element={<EnrolledJourneyDetailPage />} />
      </Route>
      
      {/* Consultant Dashboard - Separate Route */}
      <Route 
        path="/consultant/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['consultant']}>
            <ConsultantDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Catch all redirect to login if not authenticated */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;