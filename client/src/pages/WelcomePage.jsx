import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  FiTarget, 
  FiZap, 
  FiEdit, 
  FiMessageSquare, 
  FiCompass, 
  FiNavigation, 
  FiCheckSquare,
  FiArrowRight,
  FiStar,
  FiTrendingUp
} from 'react-icons/fi';

const FeatureCard = ({ icon, title, description, linkTo, linkText, benefits }) => {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 flex flex-col hover:border-sky-500 hover:shadow-2xl hover:shadow-sky-500/20 transition-all duration-500 transform hover:-translate-y-2 group">
      <div className="flex-shrink-0 mb-6">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
      
      <div className="flex-grow">
        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-sky-400 transition-colors">
          {title}
        </h3>
        <p className="text-slate-400 leading-relaxed mb-6 text-lg">
          {description}
        </p>
        
        {benefits && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-sky-400 mb-3 uppercase tracking-wide">
              What you'll get:
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
        )}
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-700">
        <Link 
          to={linkTo} 
          className="inline-flex items-center justify-center w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 group-hover:bg-sky-500 transform group-hover:scale-105"
        >
          <span>{linkText}</span>
          <FiArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

const WelcomePage = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <FiTarget size={28} />,
      title: "Action Board",
      description: "Transform your dreams into achievable milestones. Our intelligent goal-setting system helps you break down big objectives into actionable steps with AI-powered guidance.",
      linkTo: "/dashboard",
      linkText: "Start Planning Goals",
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
      description: "Your intelligent reflection companion. Document your journey, celebrate wins, and receive curated learning resources that match your personal growth path.",
      linkTo: "/joy-log",
      linkText: "Open Your Journal",
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
      description: "Your 24/7 mindset mentor. Get personalized coaching, work through challenges, and build mental resilience with conversations tailored to your unique situation.",
      linkTo: "/ai-coach",
      linkText: "Start Coaching Session",
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
      description: "Join structured programs designed by industry experts. Multi-week courses that guide you through major life transitions like career changes or skill development.",
      linkTo: "/journeys",
      linkText: "Browse Programs",
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
      description: "Track your enrolled programs and see your learning progress. Access all your course materials, assignments, and connect with fellow participants.",
      linkTo: "/my-journeys",
      linkText: "View My Progress",
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
      description: "Connect with vetted professional coaches and consultants. Browse profiles, read reviews, and book one-on-one sessions with experts in your field of interest.",
      linkTo: "/consultants",
      linkText: "Find Your Expert",
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
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-8 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-sky-500/10 text-sky-400 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-sky-500/20">
              <FiTrendingUp className="w-4 h-4 mr-2" />
              Welcome to Your Growth Journey
            </div>
            
            <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-8">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400">Horizon+</span>
            </h1>
            
            <div className="text-2xl text-slate-300 mb-4">
              Hello, <span className="text-sky-400 font-semibold">{user?.username}</span>! 👋
            </div>
            
            <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
              Your all-in-one platform for personal and professional growth. Set ambitious goals, 
              reflect on your progress, get AI-powered coaching, and connect with expert consultants 
              — all designed to help you reach your full potential.
            </p>
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
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Explore each feature below to discover how Horizon+ can accelerate your personal and professional growth journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              linkTo={feature.linkTo}
              linkText={feature.linkText}
              benefits={feature.benefits}
            />
          ))}
        </div>

        {/* Getting Started Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-sky-600/10 to-purple-600/10 rounded-3xl p-12 border border-sky-500/20">
            <h3 className="text-3xl font-bold text-white mb-6">Ready to Begin?</h3>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              We recommend starting with the <strong className="text-sky-400">Action Board</strong> to set your first goal, 
              then exploring the <strong className="text-sky-400">AI Coach</strong> to get personalized guidance on your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center bg-sky-600 hover:bg-sky-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-sky-500/25"
              >
                <FiTarget className="w-5 h-5 mr-3" />
                Set Your First Goal
              </Link>
              <Link 
                to="/ai-coach" 
                className="inline-flex items-center bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 border border-slate-600"
              >
                <FiMessageSquare className="w-5 h-5 mr-3" />
                Meet Your AI Coach
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WelcomePage;
