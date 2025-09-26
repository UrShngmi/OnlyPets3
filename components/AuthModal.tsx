import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

type AuthMode = 'login' | 'signup';

const AuthModal: React.FC = () => {
  const { isAuthModalOpen, toggleAuthModal, addToast } = useAppContext();
  const [mode, setMode] = useState<AuthMode>('login');

  if (!isAuthModalOpen) {
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Login successful! (Simulated)', 'success');
    toggleAuthModal(false);
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Signup successful! Welcome! (Simulated)', 'success');
    toggleAuthModal(false);
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={() => toggleAuthModal(false)}
    >
      <div 
        className="bg-[#2a2a2a] rounded-2xl shadow-2xl shadow-yellow-500/10 w-full max-w-md p-8 transform transition-all duration-300 scale-95"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'fade-in 0.3s ease-out forwards' }}
      >
        <div className="flex mb-6 border-b border-gray-700">
          <button 
            onClick={() => setMode('login')}
            className={`w-1/2 py-3 text-lg font-semibold transition-colors duration-300 ${mode === 'login' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setMode('signup')}
            className={`w-1/2 py-3 text-lg font-semibold transition-colors duration-300 ${mode === 'signup' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}
          >
            Sign Up
          </button>
        </div>
        
        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back!</h2>
            <div className="space-y-4">
              <input type="email" placeholder="Email" className="w-full bg-[#1c1c1c] text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
              <input type="password" placeholder="Password" className="w-full bg-[#1c1c1c] text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
            </div>
            <button type="submit" className="w-full mt-6 bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors duration-300">
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Join OnlyPets</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full bg-[#1c1c1c] text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
              <input type="email" placeholder="Email" className="w-full bg-[#1c1c1c] text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
              <input type="password" placeholder="Password" className="w-full bg-[#1c1c1c] text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
            </div>
            <button type="submit" className="w-full mt-6 bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors duration-300">
              Create Account
            </button>
          </form>
        )}
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AuthModal;
