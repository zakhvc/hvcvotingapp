import React, { useState } from 'react';
import { Startup } from '../types';
import Button from './ui/Button';
import EditStartupModal from './EditStartupModal';

interface AdminPanelProps {
  startups: Startup[];
  onUpdateStartup: (startup: Startup) => void;
  onAddStartup: (startup: Omit<Startup, 'id'>) => void;
  onDeleteStartup: (startupId: string) => void;
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ startups, onUpdateStartup, onAddStartup, onDeleteStartup, onBack }) => {
  const [modalState, setModalState] = useState<{ mode: 'add' | 'edit'; startup?: Startup } | null>(null);

  const handleSave = (formData: Startup | Omit<Startup, 'id'>) => {
    if ('id' in formData) {
      onUpdateStartup(formData as Startup);
    } else {
      onAddStartup(formData as Omit<Startup, 'id'>);
    }
    setModalState(null);
  };

  const handleDelete = (startupId: string) => {
    if (window.confirm('Are you sure you want to delete this startup? This will also remove any votes cast for it. This action cannot be undone.')) {
        onDeleteStartup(startupId);
    }
  };

  const renderLink = (url: string | undefined) => {
    if (!url) return <span className="text-gray-400">Not set</span>;
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate" style={{maxWidth: '150px', display: 'inline-block'}}>
        {url}
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-primary">Admin Panel</h1>
            <p className="text-gray-600 mt-1">Manage startup information, add new startups, or remove them.</p>
          </div>
          <div className="flex-shrink-0 flex gap-4">
            <Button onClick={() => setModalState({ mode: 'add' })}>Add New Startup</Button>
            <Button onClick={onBack} variant="secondary">Back to Home</Button>
          </div>
        </header>
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Startup Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LinkedIn</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deck</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {startups.map(startup => (
                <tr key={startup.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{startup.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renderLink(startup.website)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renderLink(startup.founderLinkedIn)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renderLink(startup.deckUrl)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button onClick={() => setModalState({ mode: 'edit', startup })} variant="ghost" className="text-primary hover:text-secondary p-2">Edit</Button>
                    <Button onClick={() => handleDelete(startup.id)} variant="ghost" className="text-red-600 hover:text-red-800 p-2">Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modalState && (
        <EditStartupModal
          startup={modalState.startup}
          onClose={() => setModalState(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AdminPanel;