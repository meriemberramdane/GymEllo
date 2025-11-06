import React, { useContext, useState, useRef, useEffect } from 'react';
import { View, User } from '../types';
import Button from './ui/Button';
import { UserIcon } from './icons/Icons';
import { UserContext } from '../contexts/UserContext';

interface HeaderProps {
  setActiveView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ setActiveView }) => {
  const userContext = useContext(UserContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const navItems = [
    { label: 'Dashboard', view: 'dashboard' },
    { label: 'Workout Planner', view: 'planner' },
    { label: 'Nutrition', view: 'nutrition' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const ProfileButton = ({ user }: { user: User }) => (
    <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 text-gray-300 hover:text-white">
      <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center">
        {user.profile.profilePicture ? (
          <img src={user.profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <UserIcon className="w-6 h-6" />
        )}
      </div>
      <span className="hidden sm:inline">{user.profile.username}</span>
    </button>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-black/50 backdrop-blur-lg border-b border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div 
            className="text-2xl font-heading font-bold text-white cursor-pointer"
            onClick={() => setActiveView(userContext?.user ? 'dashboard' : 'home')}
          >
            Gym<span className="text-red-500">Ello</span>
          </div>
          
          {userContext?.user && (
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => setActiveView(item.view as View)}
                  className="text-gray-300 hover:text-red-500 transition-colors duration-300 font-semibold"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}

          <div className="relative" ref={dropdownRef}>
            {userContext?.user ? (
              <>
                <ProfileButton user={userContext.user} />
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 animate-fade-in-down">
                    <button
                      onClick={() => {
                        setActiveView('profile');
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-red-600/50"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        userContext.logout();
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-red-600/50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
                null
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;