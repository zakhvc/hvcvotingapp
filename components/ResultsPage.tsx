import React, { useMemo, useState } from 'react';
import { Ballot, VoteCategory, Startup } from '../types';
import Button from './ui/Button';

interface ResultsPageProps {
  ballots: Ballot[];
  onBack: () => void;
  startups: Startup[];
}

type VoteDetails = Record<string, { count: number; voters: string[] }>;

const ResultsPage: React.FC<ResultsPageProps> = ({ ballots, onBack, startups }) => {
  const results = useMemo(() => {
    const demoDayVotes: VoteDetails = {};
    const privatePitchVotes: VoteDetails = {};

    for (const ballot of ballots) {
      for (const startupId in ballot.selections) {
        const category = ballot.selections[startupId];
        if (category === VoteCategory.DemoDay) {
          if (!demoDayVotes[startupId]) {
            demoDayVotes[startupId] = { count: 0, voters: [] };
          }
          demoDayVotes[startupId].count++;
          demoDayVotes[startupId].voters.push(ballot.voterName);
        } else if (category === VoteCategory.PrivatePitch) {
          if (!privatePitchVotes[startupId]) {
            privatePitchVotes[startupId] = { count: 0, voters: [] };
          }
          privatePitchVotes[startupId].count++;
          privatePitchVotes[startupId].voters.push(ballot.voterName);
        }
      }
    }

    const sortedDemoDay = Object.entries(demoDayVotes).sort(([, a], [, b]) => b.count - a.count);
    const sortedPrivatePitch = Object.entries(privatePitchVotes).sort(([, a], [, b]) => b.count - a.count);

    return { sortedDemoDay, sortedPrivatePitch };
  }, [ballots]);

  const startupNameMap: Record<string, string> = startups.reduce((acc: Record<string, string>, s: Startup) => {
    acc[s.id.toString()] = s.name;
    return acc;
  }, {});

  const ResultList: React.FC<{ title: string; data: [string, { count: number; voters: string[] }][]; color: string }> = ({ title, data, color }) => {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const toggleExpansion = (startupId: string) => {
      setExpandedItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(startupId)) {
          newSet.delete(startupId);
        } else {
          newSet.add(startupId);
        }
        return newSet;
      });
    };
    
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className={`text-2xl font-bold mb-4 ${color}`}>{title}</h2>
        {data.length > 0 ? (
          <ol className="space-y-2">
            {data.map(([startupId, { count, voters }], index) => {
              const isExpanded = expandedItems.has(startupId);
              return (
                 <li key={startupId} className="bg-gray-50 rounded-md overflow-hidden transition-all duration-300">
                  <div
                    onClick={() => toggleExpansion(startupId)}
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100"
                    aria-expanded={isExpanded}
                    aria-controls={`voters-list-${startupId}`}
                  >
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-500 w-8">{index + 1}.</span>
                      <span className="font-medium text-gray-800">{startupNameMap[startupId] || `Startup ID: ${startupId}`}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-700">{count} vote{count !== 1 ? 's' : ''}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                  </div>
                  {isExpanded && (
                    <div id={`voters-list-${startupId}`} className="px-4 pb-3 pt-1 pl-14 bg-gray-50">
                      <h4 className="text-sm font-semibold text-gray-600 mb-1">Voted by:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {voters.sort().map((voter, i) => (
                          <li key={i}>{voter}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        ) : (
          <p className="text-gray-500">No votes have been cast in this category yet.</p>
        )}
      </div>
    )
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Voting Results</h1>
          <Button onClick={onBack}>Back to Home</Button>
        </header>
        <div className="grid md:grid-cols-2 gap-8">
          <ResultList title="Demo Day Pitch" data={results.sortedDemoDay} color="text-primary" />
          <ResultList title="Private Pitch" data={results.sortedPrivatePitch} color="text-secondary" />
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
