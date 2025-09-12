import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import PublicLandingPage from './pages/PublicLandingPage.jsx';
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

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists but doesn't have required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
  }

  // If user is already logged in, redirect to dashboard
  if (user) {
    if (user.role === 'consultant') {
      return <Navigate to="/consultant/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes - Only accessible when NOT logged in */}
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <PublicLandingPage />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } 
      />
      
      {/* Protected Routes - Only accessible when logged in */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['user', 'consultant']}>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* This is now the authenticated user's welcome page */}
        <Route index element={<WelcomePage />} />
      </Route>

      <Route 
        path="/action-board" 
        element={
          <ProtectedRoute allowedRoles={['user', 'consultant']}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ActionBoard />} />
      </Route>

      <Route 
        path="/joy-log" 
        element={
          <ProtectedRoute allowedRoles={['user', 'consultant']}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<JoyLog />} />
      </Route>

      <Route 
        path="/ai-coach" 
        element={
          <ProtectedRoute allowedRoles={['user', 'consultant']}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AICoach />} />
      </Route>

      <Route 
        path="/consultants" 
        element={
          <ProtectedRoute allowedRoles={['user', 'consultant']}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ConsultantsPage />} />
        <Route path=":id" element={<ConsultantDetailPage />} />
      </Route>

      <Route 
        path="/journeys" 
        element={
          <ProtectedRoute allowedRoles={['user', 'consultant']}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<JourneysPage />} />
        <Route path=":id" element={<JourneyDetailPage />} />
      </Route>

      <Route 
        path="/my-journeys" 
        element={
          <ProtectedRoute allowedRoles={['user', 'consultant']}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<MyJourneysDashboard />} />
        <Route path=":id" element={<EnrolledJourneyDetailPage />} />
      </Route>

      <Route 
        path="/booking-success" 
        element={
          <ProtectedRoute allowedRoles={['user', 'consultant']}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<BookingSuccessPage />} />
      </Route>

      <Route 
        path="/journey-success" 
        element={
          <ProtectedRoute allowedRoles={['user', 'consultant']}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<JourneySuccessPage />} />
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

      {/* Catch all - redirect based on auth status */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
