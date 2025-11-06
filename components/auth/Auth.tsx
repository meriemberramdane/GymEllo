import React, { useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { UserProfile, FitnessGoal, Gender } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { XIcon } from '../icons/Icons';

interface AuthProps {
  onClose: () => void;
}

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Auth: React.FC<AuthProps> = ({ onClose }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [step, setStep] = useState<'auth' | 'onboarding'>('auth');
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const userContext = useContext(UserContext);

  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    name: '',
    age: 25,
    gender: 'male',
    height: 175,
    weight: 70,
    workoutFrequency: 4,
    workoutDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    fitnessGoal: 'build_muscle',
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setError('');
      setStep('onboarding');
    } else {
      setError('Please fill in all fields.');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('Login not available in demo. Please register.');
  };

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.workoutDays.length === 0) {
        setError('Please select at least one workout day.');
        return;
    }
    if (!userContext) return;

    const result = userContext.register(email, profile);
    if (result.success) {
      onClose();
    } else {
      setError(result.message || 'An unknown error occurred.');
      // If error is about email, go back to the first step so they can change it
      if (result.message?.toLowerCase().includes('email')) {
        setStep('auth');
      }
    }
  };

  const handleProfileChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const toggleWorkoutDay = (day: string) => {
    const currentDays = profile.workoutDays || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    const newFreq = newDays.length;
    setProfile(prev => ({ ...prev, workoutDays: newDays, workoutFrequency: newFreq }));
  };

  const renderAuthForm = () => (
    <>
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setAuthMode('register')}
          className={`flex-1 py-3 font-heading text-lg ${authMode === 'register' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}
        >
          Register
        </button>
        <button
          onClick={() => setAuthMode('login')}
          className={`flex-1 py-3 font-heading text-lg ${authMode === 'login' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}
        >
          Login
        </button>
      </div>
      <form onSubmit={authMode === 'register' ? handleRegister : handleLogin} className="p-8 space-y-6">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full">
          {authMode === 'register' ? 'Create Account' : 'Login'}
        </Button>
      </form>
    </>
  );

  const renderOnboardingForm = () => (
    <form onSubmit={handleOnboardingSubmit} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
      <h2 className="text-2xl font-heading text-center text-white pb-4">Tell Us About Yourself</h2>
      <Input label="Username" value={profile.username} onChange={e => handleProfileChange('username', e.target.value)} required />
      <Input label="Name" value={profile.name} onChange={e => handleProfileChange('name', e.target.value)} required />
      <Input label="Age" type="number" value={profile.age} onChange={e => handleProfileChange('age', parseInt(e.target.value))} required />
      <Select label="Gender" value={profile.gender} onChange={e => handleProfileChange('gender', e.target.value as Gender)}>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </Select>
      <Input label="Height (cm)" type="number" value={profile.height} onChange={e => handleProfileChange('height', parseInt(e.target.value))} required />
      <Input label="Weight (kg)" type="number" value={profile.weight} onChange={e => handleProfileChange('weight', parseFloat(e.target.value))} required />
       <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Select Your Workout Days</label>
        <div className="grid grid-cols-4 gap-2">
          {WEEK_DAYS.map(day => (
            <button
              type="button"
              key={day}
              onClick={() => toggleWorkoutDay(day)}
              className={`p-2 rounded-lg text-xs text-center font-bold transition-colors ${profile.workoutDays.includes(day) ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
      <Select label="Primary Goal" value={profile.fitnessGoal} onChange={e => handleProfileChange('fitnessGoal', e.target.value as FitnessGoal)}>
        <option value="build_muscle">Build Muscle</option>
        <option value="lose_fat">Lose Fat</option>
        <option value="recomposition">Body Recomposition</option>
      </Select>
       {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <Button type="submit" className="w-full !mt-8">
        Generate My Plan
      </Button>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center">
      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <XIcon />
        </button>
        {step === 'auth' ? renderAuthForm() : renderOnboardingForm()}
      </div>
    </div>
  );
};

export default Auth;