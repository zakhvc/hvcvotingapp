import React, { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';

interface VoterLoginProps {
  onLogin: (name: string) => void;
  onAdminAction: (action: 'results' | 'admin') => void;
}

const VoterLogin: React.FC<VoterLoginProps> = ({ onLogin, onAdminAction }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    } else {
      alert("Please enter your name.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-xl">
        <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Welcome to HVC Accelerator Cohort 003 Startup Voting</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="voterName" className="text-sm font-medium text-gray-700 sr-only">Voter Name</label>
            <Input
              id="voterName"
              type="text"
              placeholder="Enter your name to start"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
             <p className="mt-2 text-xs text-gray-500 text-center">(Each startup can only vote once)</p>
          </div>
          <Button type="submit" className="w-full">
            Start Voting
          </Button>
        </form>
        <div className="text-center border-t pt-4 flex justify-center items-center space-x-4">
            <button onClick={() => onAdminAction('results')} className="font-medium text-sm text-primary hover:text-secondary transition-colors">
                View Results
            </button>
            <button onClick={() => onAdminAction('admin')} className="font-medium text-sm text-primary hover:text-secondary transition-colors">
                Admin Access
            </button>
        </div>
      </div>
    </div>
  );
};

export default VoterLogin;
