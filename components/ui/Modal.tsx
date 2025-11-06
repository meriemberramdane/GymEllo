import React from 'react';
import { XIcon } from '../icons/Icons';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ children, onClose, title }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center animate-fade-in">
      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md relative">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="font-heading text-lg font-bold text-white">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">
              <XIcon />
            </button>
        </div>
        <div className="p-6">
            {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
