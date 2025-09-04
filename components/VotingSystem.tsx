import React, { useState, useMemo } from 'react';
import { Selections, VoteCategory, Ballot, Startup } from '../types.ts';
import StartupCard from './StartupCard.tsx';
import { DEMO_DAY_TARGET, PRIVATE_PITCH_TARGET } from '../constants.ts';
import Button from './ui/Button.tsx';

interface VotingSystemProps {
  voterName: string;
  onSubmit: (ballot: Ballot) => void;
  startups: Startup[];
  onAdminAction: (action: 'results' | 'admin') => void;
}

const VotingSystem: React.FC<VotingSystemProps> = ({ voterName, onSubmit, startups, onAdminAction }) => {
  const [selections, setSelections] = useState<Selections>(() =>
    startups.reduce((acc, s) => ({ ...acc, [s.id]: VoteCategory.None }), {})
  );

  const counts = useMemo(() => {
    return Object.values(selections).reduce(
      (acc, category) => {
        if (category === VoteCategory.DemoDay) acc.demoDay++;
        if (category === VoteCategory.PrivatePitch) acc.privatePitch++;
        return acc;
      },
      { demoDay: 0, privatePitch: 0 }
    );
  }, [selections]);

  const handleSelect = (startupId: string, category: VoteCategory) => {
    const currentSelection = selections[startupId];
    
    // Deselect if clicking the same category again
    if (currentSelection === category) {
      setSelections(prev => ({ ...prev, [startupId]: VoteCategory.None }));
      return;
    }
    
    // Check if target category is full
    if (category === VoteCategory.DemoDay && counts.demoDay >= DEMO_DAY_TARGET) {
        alert(`You can only select ${DEMO_DAY_TARGET} startups for Demo Day.`);
        return;
    }
    if (category === VoteCategory.PrivatePitch && counts.privatePitch >= PRIVATE_PITCH_TARGET) {
        alert(`You can only select ${PRIVATE_PITCH_TARGET} startups for Private Pitch.`);
        return;
    }
    
    // Set new selection
    setSelections(prev => ({ ...prev, [startupId]: category }));
  };
  
  const isCategoryFull = (category: VoteCategory): boolean => {
      if (category === VoteCategory.DemoDay) return counts.demoDay >= DEMO_DAY_TARGET;
      if (category === VoteCategory.PrivatePitch) return counts.privatePitch >= PRIVATE_PITCH_TARGET;
      return false;
  };

  const isSubmissionValid = counts.demoDay === DEMO_DAY_TARGET && counts.privatePitch === PRIVATE_PITCH_TARGET;

  const handleSubmit = () => {
    if (isSubmissionValid) {
      const ballot: Ballot = {
        voterName,
        voterNameLower: voterName.toLowerCase(),
        selections,
        timestamp: Date.now(),
      };
      onSubmit(ballot);
    } else {
        alert("Please ensure you have selected exactly 15 for Demo Day and 20 for Private Pitch.");
    }
  };

  const ProgressBar: React.FC<{count: number, target: number, color: string, name: string}> = ({count, target, color, name}) => (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <span className={`text-sm font-medium ${count === target ? 'text-green-600' : 'text-gray-700'}`}>{count} / {target}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${(count / target) * 100}%` }}></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white shadow rounded-lg p-6 mb-8 sticky top-4 z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-primary">Vote for Startups</h1>
                <p className="text-gray-600">Welcome, {voterName}. Select exactly {DEMO_DAY_TARGET} for Demo Day and {PRIVATE_PITCH_TARGET} for Private Pitch.</p>
              </div>
              <div className="w-full md:w-1/2 lg:w-1/3 flex flex-col gap-4">
                  <ProgressBar count={counts.demoDay} target={DEMO_DAY_TARGET} color="bg-primary" name="Demo Day Pitch"/>
                  <ProgressBar count={counts.privatePitch} target={PRIVATE_PITCH_TARGET} color="bg-secondary" name="Private Pitch"/>
              </div>
              <div className="flex flex-col items-center md:items-end gap-2">
                <Button onClick={handleSubmit} disabled={!isSubmissionValid} className="w-full">
                  Submit My Votes
                </Button>
                 <div className="flex justify-center items-center space-x-4 text-sm">
                  <button onClick={() => onAdminAction('admin')} className="font-medium text-primary hover:text-secondary transition-colors">Admin Panel</button>
                  <span className="text-gray-300">|</span>
                  <button onClick={() => onAdminAction('results')} className="font-medium text-primary hover:text-secondary transition-colors">View Results</button>
                </div>
              </div>
          </div>
        </header>

        <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {startups.map(startup => (
            <StartupCard
              key={startup.id}
              startup={startup}
              selection={selections[startup.id]}
              onSelect={handleSelect}
              isDisabled={isCategoryFull}
            />
          ))}
        </main>
      </div>
    </div>
  );
};

export default VotingSystem;
