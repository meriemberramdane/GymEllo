import React, { useState } from 'react';
import Modal from './ui/Modal';

const Footer: React.FC = () => {
  const [isAboutModalOpen, setAboutModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-gray-900/50 border-t border-gray-800 mt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-heading font-bold text-white">
                Gym<span className="text-red-500">Ello</span>
              </h3>
              <p className="mt-2 text-gray-400 text-sm">Transform Your Body. Master Your Mind.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-200">About</h4>
              <ul className="mt-4 space-y-2">
                <li><button onClick={() => setAboutModalOpen(true)} className="text-gray-400 hover:text-red-500 text-sm">About Us</button></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} GymEllo. All Rights Reserved.
          </div>
        </div>
      </footer>
      {isAboutModalOpen && (
        <Modal title="About GymEllo" onClose={() => setAboutModalOpen(false)}>
          <p className="text-gray-300">
            GymEllo is a platform designed to help you track your workouts, monitor your nutrition, and stay consistent with your fitness goals. Our goal is to simplify your journey to a healthier, stronger version of yourself.
          </p>
        </Modal>
      )}
    </>
  );
};

export default Footer;