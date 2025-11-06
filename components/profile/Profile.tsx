import React, { useContext, useState, useRef, useEffect } from 'react';
import { UserContext } from '../../contexts/UserContext';
import Card from '../ui/Card';
import ProgressTracker from '../ProgressTracker';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { CameraIcon, EditIcon, UserIcon } from '../icons/Icons';
import { FitnessGoal, UserProfile } from '../../types';


const Profile: React.FC = () => {
  const userContext = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(userContext?.user?.profile || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentWeight, setCurrentWeight] = useState(userContext?.user?.profile.weight || 0);

  useEffect(() => {
    if (userContext?.user) {
        setEditedProfile(userContext.user.profile);
        setCurrentWeight(userContext.user.profile.weight)
    }
  }, [userContext?.user]);
  
  if (!userContext || !userContext.user || !editedProfile) {
    return <div>Loading...</div>;
  }
  const { user, updateUserProfile, addWeightLog } = userContext;

  const handleProfileChange = (field: keyof UserProfile, value: any) => {
    setEditedProfile(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSave = () => {
    if (editedProfile) {
      if (editedProfile.workoutDays.length === 0) {
          alert("Please select at least one workout day.");
          return;
      }
      // Keep workoutFrequency in sync with workoutDays array length
      const updatedProfileWithFrequency = {
          ...editedProfile,
          workoutFrequency: editedProfile.workoutDays.length,
      };
      updateUserProfile(updatedProfileWithFrequency);
      setIsEditing(false);
    }
  };
  
  const handlePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleProfileChange('profilePicture', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentWeight > 0 && addWeightLog) {
      addWeightLog(currentWeight);
      handleProfileChange('weight', currentWeight);
    }
  };

  const toggleWorkoutDay = (day: string) => {
    if (!editedProfile) return;
    const currentDays = editedProfile.workoutDays || [];
    const newDays = currentDays.includes(day)
        ? currentDays.filter(d => d !== day)
        : [...currentDays, day];
    handleProfileChange('workoutDays', newDays);
  };
  
  const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
            <Card>
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center ring-4 ring-red-500/50">
                            {editedProfile.profilePicture ? (
                                <img src={editedProfile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-16 h-16 text-gray-500" />
                            )}
                        </div>
                        {isEditing && (
                            <>
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePictureUpload} className="hidden" />
                                <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 bg-gray-900/80 text-white p-2 rounded-full hover:bg-gray-800">
                                    <CameraIcon className="w-5 h-5"/>
                                </button>
                            </>
                        )}
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-heading font-bold text-white">{editedProfile.name}</h1>
                        <p className="text-gray-300">@{editedProfile.username}</p>
                    </div>
                    {isEditing ? (
                        <div className="flex space-x-2">
                            <Button onClick={() => { setIsEditing(false); setEditedProfile(user.profile); }} variant="secondary" size="sm">Cancel</Button>
                            <Button onClick={handleSave} size="sm">Save Changes</Button>
                        </div>
                    ) : (
                        <Button onClick={() => setIsEditing(true)} variant="secondary" size="sm">
                            <EditIcon className="w-4 h-4 mr-2"/> Edit Profile
                        </Button>
                    )}
                </div>
            </Card>
             <Card>
                <h2 className="text-2xl font-heading text-white mb-4">Log Today's Weight</h2>
                <form onSubmit={handleLogWeight} className="space-y-4">
                    <Input 
                        label="Current Weight (kg)"
                        type="number"
                        step="0.1"
                        value={currentWeight}
                        onChange={(e) => setCurrentWeight(parseFloat(e.target.value))}
                    />
                    <Button type="submit" className="w-full">Log Weight</Button>
                </form>
            </Card>
        </div>
        <div className="lg:col-span-2">
             {isEditing ? (
                 <Card>
                     <h2 className="text-2xl font-heading text-white mb-4">Edit Details</h2>
                     <div className="space-y-4">
                        <Input label="Name" value={editedProfile.name} onChange={e => handleProfileChange('name', e.target.value)} />
                        <Input label="Weight (kg)" type="number" value={editedProfile.weight} onChange={e => handleProfileChange('weight', parseFloat(e.target.value))} />
                        <Select label="Primary Goal" value={editedProfile.fitnessGoal} onChange={e => handleProfileChange('fitnessGoal', e.target.value as FitnessGoal)}>
                            <option value="build_muscle">Build Muscle</option>
                            <option value="lose_fat">Lose Fat</option>
                            <option value="recomposition">Body Recomposition</option>
                        </Select>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Workout Days</label>
                            <div className="grid grid-cols-4 gap-2">
                                {WEEK_DAYS.map(day => (
                                    <button 
                                        key={day} 
                                        onClick={() => toggleWorkoutDay(day)}
                                        className={`p-2 rounded-lg text-xs text-center font-bold transition-colors ${editedProfile.workoutDays.includes(day) ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                     </div>
                 </Card>
             ) : (
                <ProgressTracker />
             )}
        </div>
      </div>
    </div>
  );
};

export default Profile;