import React, { useState, useEffect } from 'react';

import VoterLogin from './components/VoterLogin';
import VotingSystem from './components/VotingSystem';
import ResultsPage from './components/ResultsPage';
import AdminPanel from './components/AdminPanel';
import { Ballot, Startup } from './types';
import { ADMIN_PASSWORD } from './constants';
import Modal from './components/ui/Modal';
import Input from './components/ui/Input';
import Button from './components/ui/Button';
import { supabase } from './supabaseClient';

enum View {
  Loading,
  Login,
  Voting,
  Results,
  ThankYou,
  Admin,
}

const App: React.FC = () => {
  const [voterName, setVoterName] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.Loading);
  const [ballots, setBallots] = useState<Ballot[]>([]);
  const [startups, setStartups] = useState<Startup[]>([]);
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [adminAction, setAdminAction] = useState<'results' | 'admin' | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: startupsData, error: startupsError } = await supabase
          .from('startups')
          .select('*')
          .order('name', { ascending: true });

        if (startupsError) throw startupsError;
        setStartups(startupsData || []);

        const { data: ballotsData, error: ballotsError } = await supabase
          .from('ballots')
          .select('*');

        if (ballotsError) throw ballotsError;
        setBallots(ballotsData || []);

      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load data from the server. Please check your connection and refresh the page.');
      } finally {
        setCurrentView(View.Login);
      }
    };

    fetchData();
  }, []);
  
  const handleLogin = (name: string) => {
    const trimmedName = name.trim();
    const hasVoted = ballots.some(
      (ballot) => ballot.voterNameLower === trimmedName.toLowerCase()
    );

    if (hasVoted) {
      alert("This name has already voted.");
      return;
    }
    setVoterName(trimmedName);
    setCurrentView(View.Voting);
  };

  const handleVoteSubmit = async (ballot: Omit<Ballot, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('ballots')
        .insert([ballot])
        .select();

      if (error) throw error;

      if (data) {
        setBallots(prevBallots => [...prevBallots, data[0]]);
        setCurrentView(View.ThankYou);
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('There was an error submitting your vote. Please try again.');
    }
  };

  const handleOpenPasswordModal = (action: 'results' | 'admin') => {
    setAdminAction(action);
    setIsPasswordModalOpen(true);
    setPasswordError('');
    setPassword('');
  };
  
  const handlePasswordCheck = () => {
      if (password === ADMIN_PASSWORD) {
          if (adminAction === 'results') {
              setCurrentView(View.Results);
          } else if (adminAction === 'admin') {
              setCurrentView(View.Admin);
          }
          setIsPasswordModalOpen(false);
          setAdminAction(null);
      } else {
          setPasswordError('Incorrect password. Please try again.');
      }
  };

  const handleUpdateStartup = async (updatedStartup: Startup) => {
    try {
      const { data, error } = await supabase
        .from('startups')
        .update(updatedStartup)
        .eq('id', updatedStartup.id)
        .select();
      
      if (error) throw error;

      if (data) {
        setStartups(prevStartups => 
          prevStartups.map(s => s.id === updatedStartup.id ? data[0] : s)
        );
      }
    } catch (error) {
      console.error('Error updating startup:', error);
      alert('Failed to update startup. Please try again.');
    }
  };

  const handleAddStartup = async (newStartupData: Omit<Startup, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('startups')
        .insert(newStartupData)
        .select();
      
      if (error) throw error;
      
      if (data) {
        setStartups(prevStartups => [...prevStartups, data[0]]);
      }
    } catch (error) {
      console.error('Error adding startup:', error);
      alert('Failed to add startup. Please try again.');
    }
  };

  const handleDeleteStartup = async (startupId: string) => {
    try {
      const { error } = await supabase
        .from('startups')
        .delete()
        .eq('id', startupId);

      if (error) throw error;
      
      setStartups(prevStartups => prevStartups.filter(s => s.id !== startupId));
    } catch (error) {
      console.error('Error deleting startup:', error);
      alert('Failed to delete startup. Please try again.');
    }
  };

  const renderView = () => {
    switch (currentView) {
      case View.Loading:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
            <h1 className="text-2xl font-bold text-primary animate-pulse">Loading Application...</h1>
          </div>
        );
      case View.Login:
        return <VoterLogin onLogin={handleLogin} onAdminAction={handleOpenPasswordModal} />;
      case View.Voting:
        return <VotingSystem voterName={voterName!} onSubmit={handleVoteSubmit} startups={startups} onAdminAction={handleOpenPasswordModal} />;
      case View.Results:
        return <ResultsPage ballots={ballots} onBack={() => setCurrentView(View.Login)} startups={startups} />;
      case View.ThankYou:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
            <h1 className="text-4xl font-bold text-primary mb-4">Thank You!</h1>
            <p className="text-lg text-gray-700">Your vote has been successfully submitted.</p>
            <Button onClick={() => setCurrentView(View.Login)} className="mt-8">
              Back to Home
            </Button>
          </div>
        );
      case View.Admin:
        return <AdminPanel 
          startups={startups} 
          onUpdateStartup={handleUpdateStartup} 
          onAddStartup={handleAddStartup}
          onDeleteStartup={handleDeleteStartup}
          onBack={() => setCurrentView(View.Login)} 
        />;
      default:
        return <VoterLogin onLogin={handleLogin} onAdminAction={handleOpenPasswordModal} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {renderView()}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Admin Access Required"
      >
        <div className="space-y-4">
            <p className="text-gray-600">Please enter the admin password to continue.</p>
            <Input 
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePasswordCheck()}
            />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            <div className="flex justify-end gap-2">
                <Button onClick={() => setIsPasswordModalOpen(false)} variant="secondary">Cancel</Button>
                <Button onClick={handlePasswordCheck}>Submit</Button>
            </div>
        </div>
      </Modal>
    </div>
  );
};

export default App;