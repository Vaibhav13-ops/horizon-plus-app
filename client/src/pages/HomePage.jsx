import { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import ActionBoard from '../components/ActionBoard.jsx';
import JoyLog from '../components/JoyLog.jsx';
import AICoach from '../components/AICoach.jsx';

const HomePage = () => {
  const [activeComponent, setActiveComponent] = useState('actionBoard');


  const renderComponent = () => {
    switch (activeComponent) {
      case 'joyLog':
        return <JoyLog />;
      case 'aiCoach':
        return <AICoach />;
      case 'actionBoard':
      default:
        return <ActionBoard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-800">
      <Navbar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
      <main>
        {renderComponent()}
      </main>
    </div>
  );
};

export default HomePage;