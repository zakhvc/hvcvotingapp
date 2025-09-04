import React, { useState, useEffect } from 'react';
import { Startup, VoteCategory } from '../types';

interface StartupCardProps {
  startup: Startup;
  selection: VoteCategory;
  onSelect: (startupId: string, category: VoteCategory) => void;
  isDisabled: (category: VoteCategory) => boolean;
}

const StartupCard: React.FC<StartupCardProps> = ({ startup, selection, onSelect, isDisabled }) => {
  const [iconError, setIconError] = useState(false);

  // Reset error state if the startup (and its website) changes
  useEffect(() => {
    setIconError(false);
  }, [startup.id]);
  
  const getCardStyle = (category: VoteCategory) => {
    switch (category) {
      case VoteCategory.DemoDay:
        return 'border-primary bg-blue-50 shadow-md';
      case VoteCategory.PrivatePitch:
        return 'border-secondary bg-cyan-50 shadow-md';
      default:
        return 'border-gray-200 bg-white hover:shadow-lg';
    }
  };

  const hasLinks = startup.website || startup.founderLinkedIn || startup.deckUrl;

  // Using Google's favicon service as a reliable proxy
  const iconUrl = startup.website && !iconError 
    ? `https://www.google.com/s2/favicons?sz=64&domain_url=${startup.website}`
    : null;

  return (
    <div className={`p-4 border rounded-lg transition-all duration-300 flex flex-col justify-between ${getCardStyle(selection)}`}>
      <div>
        <div className="h-14 flex items-center justify-center mb-2">
          {iconUrl ? (
            <img
              src={iconUrl}
              alt={`${startup.name} logo`}
              className="w-12 h-12 object-contain rounded-md"
              onError={() => setIconError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          )}
        </div>
        <h3 className="font-semibold text-gray-800 text-center truncate h-12 flex items-center justify-center">{startup.name}</h3>
        <div className="mt-2 flex justify-center space-x-2">
          <button
            onClick={() => onSelect(startup.id, VoteCategory.DemoDay)}
            disabled={isDisabled(VoteCategory.DemoDay) && selection !== VoteCategory.DemoDay}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              selection === VoteCategory.DemoDay
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400'
            }`}
          >
            Demo
          </button>
          <button
            onClick={() => onSelect(startup.id, VoteCategory.PrivatePitch)}
            disabled={isDisabled(VoteCategory.PrivatePitch) && selection !== VoteCategory.PrivatePitch}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              selection === VoteCategory.PrivatePitch
                ? 'bg-secondary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-cyan-200 disabled:bg-gray-100 disabled:text-gray-400'
            }`}
          >
            Private
          </button>
        </div>
      </div>
      {hasLinks && (
        <div className="mt-4 pt-3 border-t border-gray-200 flex justify-center items-center space-x-4">
          {startup.website && (
            <a href={startup.website} target="_blank" rel="noopener noreferrer" title="Website" className="text-gray-400 hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9M3 12a9 9 0 019-9m0 18a9 9 0 00-9-9m9 9V3" />
              </svg>
            </a>
          )}
          {startup.founderLinkedIn && (
            <a href={startup.founderLinkedIn} target="_blank" rel="noopener noreferrer" title="Founder LinkedIn" className="text-gray-400 hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          )}
          {startup.deckUrl && (
            <a href={startup.deckUrl} target="_blank" rel="noopener noreferrer" title="Startup Deck" className="text-gray-400 hover:text-primary transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default StartupCard;