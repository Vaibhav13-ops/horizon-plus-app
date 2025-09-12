import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiGrid, FiTarget, FiEdit, FiMessageSquare, FiCompass, FiNavigation, FiCheckSquare } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) {
    return null;
  }

  const activeLinkStyle = {
    color: '#38bdf8', // sky-400
    borderBottom: '2px solid #38bdf8',
  };

  
  const isDashboardPage = location.pathname === '/dashboard';

  return (
    <header className="bg-slate-900 shadow-md p-4 flex justify-between items-center border-b border-slate-700">
      <h1 className="text-2xl font-bold text-sky-400">Horizon+</h1>
      
      {/* Only show navigation when NOT on dashboard */}
      {!isDashboardPage ? (
        <nav className="flex items-center gap-6 text-lg">
          <NavLink 
            to="/dashboard" 
            style={({ isActive }) => isActive ? activeLinkStyle : undefined}
            className="text-white hover:text-sky-400 transition pb-1 flex items-center gap-2"
          >
            <FiGrid />
            Dashboard
          </NavLink>
          
          <NavLink 
            to="/action-board" 
            style={({ isActive }) => isActive ? activeLinkStyle : undefined} 
            className="text-white hover:text-sky-400 transition pb-1 flex items-center gap-2"
          >
            <FiTarget />
            Action Board
          </NavLink>
          
          <NavLink 
            to="/joy-log" 
            style={({ isActive }) => isActive ? activeLinkStyle : undefined} 
            className="text-white hover:text-sky-400 transition pb-1 flex items-center gap-2"
          >
            <FiEdit />
            Growth Compass
          </NavLink>
          
          <NavLink 
            to="/ai-coach" 
            style={({ isActive }) => isActive ? activeLinkStyle : undefined} 
            className="text-white hover:text-sky-400 transition pb-1 flex items-center gap-2"
          >
            <FiMessageSquare />
            AI Coach
          </NavLink>
          
          <NavLink 
            to="/journeys" 
            style={({ isActive }) => isActive ? activeLinkStyle : undefined} 
            className="text-white hover:text-sky-400 transition pb-1 flex items-center gap-2"
          >
            <FiNavigation />
            Discover Journeys
          </NavLink>
          
          <NavLink 
            to="/my-journeys" 
            style={({ isActive }) => isActive ? activeLinkStyle : undefined} 
            className="text-white hover:text-sky-400 transition pb-1 flex items-center gap-2"
          >
            <FiCheckSquare />
            My Journeys
          </NavLink>
          
          <NavLink 
            to="/consultants" 
            style={({ isActive }) => isActive ? activeLinkStyle : undefined} 
            className="text-white hover:text-sky-400 transition pb-1 flex items-center gap-2"
          >
            <FiCompass />
            Find a Consultant
          </NavLink>
        </nav>
      ) : (
        // Empty div to maintain layout spacing on dashboard
        <div></div>
      )}
      
      <div>
        <span className="mr-4 text-white">Welcome, {user.username}!</span>
        <button 
          onClick={logout} 
          className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition cursor-pointer"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
