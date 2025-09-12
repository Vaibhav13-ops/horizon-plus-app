// pages/PublicLandingPage.jsx

import { Link } from 'react-router-dom';
import { 
  FiTarget, 
  FiEdit, 
  FiMessageSquare, 
  FiCompass, 
  FiNavigation, 
  FiCheckSquare,
  FiArrowRight,
  FiStar,
  FiTrendingUp,
  FiLogIn,
  FiUserPlus
} from 'react-icons/fi';

const FeaturePreviewCard = ({ icon, title, description, benefits }) => {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 flex flex-col">
      <div className="flex-shrink-0 mb-6">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white shadow-lg">
          {icon}
        </div>
      </div>
      
      <div className="flex-grow">
        <h3 className="text-2xl font-bold text-white mb-4">
          {title}
        </h3>
        <p className="text-slate-400 leading-relaxed mb-6 text-lg">
          {description}
        </p>
        
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-sky-400 mb-3 uppercase tracking-wide">
            Key Features:
          </h4>
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center text-slate-300 text-sm">
                <FiStar className="w-4 h-4 text-sky-400 mr-3 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-700">
        <div className="text-center text-slate-500 font-semibold">
          Sign up to access this feature
        </div>
      </div>
    </div>
  );
};

const PublicLandingPage = () => {
  const features = [
    {
      icon: <FiTarget size={28} />,
      title: "Action Board",
      description: "Transform your dreams into achievable milestones with AI-powered guidance and smart goal-setting tools.",
      benefits: [
        "AI-generated roadmaps for any goal",
        "Visual progress tracking",
        "Smart milestone suggestions",
        "Personalized action steps"
      ]
    },
    {
      icon: <FiEdit size={28} />,
      title: "Growth Compass",
      description: "Your intelligent reflection companion with curated learning resources that match your growth path.",
      benefits: [
        "AI-curated YouTube recommendations",
        "Private, secure journaling",
        "Pattern recognition in your growth",
        "Mood and progress insights"
      ]
    },
    {
      icon: <FiMessageSquare size={28} />,
      title: "AI Coach",
      description: "Your 24/7 mindset mentor for personalized coaching and mental resilience building.",
      benefits: [
        "Unlimited coaching conversations",
        "Personalized mindset strategies",
        "Stress and anxiety management",
        "Goal-specific motivation"
      ]
    },
    {
      icon: <FiNavigation size={28} />,
      title: "Discover Journeys",
      description: "Join structured programs designed by industry experts for major life transitions.",
      benefits: [
        "Expert-designed curriculums",
        "Weekly structured content",
        "Community support",
        "Completion certificates"
      ]
    },
    {
      icon: <FiCheckSquare size={28} />,
      title: "My Journeys",
      description: "Track your enrolled programs and access course materials with progress monitoring.",
      benefits: [
        "Progress tracking dashboard",
        "Assignment submissions",
        "Peer interaction",
        "Course completion tracking"
      ]
    },
    {
      icon: <FiCompass size={28} />,
      title: "Find a Consultant",
      description: "Connect with vetted professional coaches and book one-on-one expert sessions.",
      benefits: [
        "Vetted professional consultants",
        "Flexible scheduling",
        "Video or chat sessions",
        "Specialized expertise matching"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation Bar for Public Users */}
      <header className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-sky-400">Horizon+</h1>
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="inline-flex items-center text-white hover:text-sky-400 transition px-4 py-2 rounded-lg border border-slate-600 hover:border-sky-500"
            >
              <FiLogIn className="w-4 h-4 mr-2" />
              Login
            </Link>
            <Link 
              to="/register" 
              className="inline-flex items-center bg-sky-600 hover:bg-sky-500 text-white font-semibold px-6 py-2 rounded-lg transition transform hover:scale-105"
            >
              <FiUserPlus className="w-4 h-4 mr-2" />
              Sign Up Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-8 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-sky-500/10 text-sky-400 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-sky-500/20">
              <FiTrendingUp className="w-4 h-4 mr-2" />
              Your Growth Journey Starts Here
            </div>
            
            <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-8">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400">Horizon+</span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed mb-12">
              Your all-in-one platform for personal and professional growth. Set ambitious goals, 
              reflect on your progress, get AI-powered coaching, and connect with expert consultants 
              — all designed to help you reach your full potential.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                to="/register" 
                className="inline-flex items-center bg-sky-600 hover:bg-sky-500 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-sky-500/25"
              >
                <FiUserPlus className="w-5 h-5 mr-3" />
                Start Your Journey Free
                <FiArrowRight className="w-5 h-5 ml-3" />
              </Link>
              <Link 
                to="/login" 
                className="inline-flex items-center bg-slate-700 hover:bg-slate-600 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 border border-slate-600"
              >
                <FiLogIn className="w-5 h-5 mr-3" />
                Already a Member?
              </Link>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="text-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
              <div className="text-3xl font-bold text-sky-400 mb-2">6</div>
              <div className="text-slate-300">Powerful Tools</div>
            </div>
            <div className="text-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
              <div className="text-3xl font-bold text-sky-400 mb-2">AI</div>
              <div className="text-slate-300">Powered Guidance</div>
            </div>
            <div className="text-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
              <div className="text-3xl font-bold text-sky-400 mb-2">24/7</div>
              <div className="text-slate-300">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <main className="max-w-7xl mx-auto px-8 pb-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            Everything You Need to <span className="text-sky-400">Succeed</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
            Discover the powerful tools waiting for you. Sign up now to unlock your full potential.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <FeaturePreviewCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              benefits={feature.benefits}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-sky-600/10 to-purple-600/10 rounded-3xl p-12 border border-sky-500/20">
            <h3 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Life?</h3>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Join thousands of users who are already achieving their goals with Horizon+. 
              Your journey to personal and professional growth starts with a single click.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="inline-flex items-center bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-sky-500/25"
              >
                <FiUserPlus className="w-5 h-5 mr-3" />
                Get Started Free
              </Link>
              <Link 
                to="/login" 
                className="inline-flex items-center bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 border border-slate-600"
              >
                <FiLogIn className="w-5 h-5 mr-3" />
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicLandingPage;
