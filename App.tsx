import React, { useState, useContext } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import AiAssistant from './components/AiAssistant';
import { View, WorkoutSession } from './types';
import { UserContext } from './contexts/UserContext';
import Auth from './components/auth/Auth';
import Planner from './components/planner/Planner';
import Nutrition from './components/nutrition/Nutrition';
import Profile from './components/profile/Profile';
import WorkoutSessionView from './components/workout/WorkoutSessionView';

const App: React.FC = () => {
  const userContext = useContext(UserContext);
  const [activeView, setActiveView] = useState<View>('home');
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(null);

  if (!userContext) {
    return null; // Or a loading spinner
  }
  const { user, toggleWorkoutCompleted } = userContext;

  React.useEffect(() => {
    if (user) {
      setActiveView('dashboard');
      setAuthModalOpen(false);
    } else {
      setActiveView('home');
    }
  }, [user]);

  const handleStartWorkout = (session: WorkoutSession) => {
    setActiveWorkout(session);
  };
  
  const handleFinishWorkout = () => {
    if (activeWorkout) {
        toggleWorkoutCompleted(activeWorkout.day);
    }
    setActiveWorkout(null);
  }

  const renderView = () => {
    if (!user) {
      return <HeroSection onCtaClick={() => setAuthModalOpen(true)} />;
    }
    
    if (activeWorkout) {
        return <WorkoutSessionView session={activeWorkout} onFinish={handleFinishWorkout} />;
    }

    switch (activeView) {
      case 'dashboard':
        return <Dashboard onStartWorkout={handleStartWorkout} onNavigate={setActiveView} />;
      case 'planner':
        return <Planner />;
      case 'nutrition':
        return <Nutrition />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard onStartWorkout={handleStartWorkout} onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="bg-stone-950 min-h-screen text-gray-200 overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-stone-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
      <Header 
        setActiveView={setActiveView} 
      />
      <main className="relative z-10">
        {renderView()}
      </main>
      {isAuthModalOpen && <Auth onClose={() => setAuthModalOpen(false)} />}
      {user && <AiAssistant />}
      <Footer />
    </div>
  );
};

export default App;