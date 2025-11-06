import React, { useState, useRef, useEffect, useContext } from 'react';
import { BotIcon, SendIcon, XIcon, LoaderIcon } from './icons/Icons';
import { ChatMessage } from '../types';
import { getAiFitnessResponse } from '../services/geminiService';
import { UserContext } from '../contexts/UserContext';

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Fix: Consume context safely.
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const workoutPlan = userContext?.workoutPlan;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'model',
        text: `Hello ${user?.profile.username}! I am GymEllo Coach. How can I help you crush your fitness goals today? Ask me for a workout plan, nutrition advice, or anything else!`
      }]);
    }
  }, [isOpen, messages.length, user]);


  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Fix: Pass user profile and workout plan from context to the AI service.
      const responseText = await getAiFitnessResponse(input, user?.profile, workoutPlan ?? undefined);
      const modelMessage: ChatMessage = { role: 'model', text: responseText };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = { role: 'model', text: 'Sorry, something went wrong. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-red-500"
          aria-label="Toggle AI Assistant"
        >
          {isOpen ? <XIcon /> : <BotIcon />}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-sm h-[70vh] max-h-[600px] z-50 bg-gray-900/80 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="font-heading text-lg font-bold text-white">GymEllo AI Coach</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white" aria-label="Close chat">
              <XIcon />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-red-600 flex-shrink-0 flex items-center justify-center">
                    <BotIcon className="w-5 h-5" />
                  </div>
                )}
                <div className={`max-w-[80%] p-3 rounded-xl ${msg.role === 'user' ? 'bg-red-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
                  {/* Fix: Removed character stripping to allow HTML formatting from AI. */}
                  <p className="text-sm" dangerouslySetInnerHTML={{__html: msg.text.replace(/\n/g, '<br />')}}></p>
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex-shrink-0 flex items-center justify-center">
                    <BotIcon className="w-5 h-5" />
                  </div>
                  <div className="max-w-[80%] p-3 rounded-xl bg-gray-800 text-gray-200 rounded-bl-none">
                     <LoaderIcon className="animate-spin" />
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center bg-gray-800 rounded-lg">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your fitness coach..."
                className="flex-1 bg-transparent p-3 text-white placeholder-gray-500 focus:outline-none"
                disabled={isLoading}
              />
              <button onClick={handleSend} className="p-3 text-red-500 hover:text-red-400 disabled:text-gray-600" disabled={isLoading} aria-label="Send message">
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistant;