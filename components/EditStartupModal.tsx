import React, { useState, useEffect } from 'react';
import { Startup } from '../types.ts';
import Modal from './ui/Modal.tsx';
import Input from './ui/Input.tsx';
import Button from './ui/Button.tsx';

interface EditStartupModalProps {
  startup?: Startup; // If undefined, it's in "add" mode
  onClose: () => void;
  onSave: (startup: Startup | Omit<Startup, 'id'>) => void;
}

const EditStartupModal: React.FC<EditStartupModalProps> = ({ startup, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Startup>>({});

  const isEditMode = !!startup;

  useEffect(() => {
    setFormData(startup || { name: '', website: '', founderLinkedIn: '', deckUrl: '' });
  }, [startup]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || formData.name.trim() === '') {
        alert('Startup name is required.');
        return;
    }
    
    const processedData = { ...formData };
    const urlFields = ['website', 'founderLinkedIn', 'deckUrl'] as const;

    urlFields.forEach(field => {
      const url = processedData[field];
      if (url && typeof url === 'string' && url.trim() !== '') {
        const trimmedUrl = url.trim();
        // Prepend https:// if it doesn't start with http:// or https://
        if (!/^https?:\/\//i.test(trimmedUrl)) {
          processedData[field] = `https://${trimmedUrl}`;
        } else {
          processedData[field] = trimmedUrl;
        }
      } else {
        // Set to undefined if empty or whitespace only
        processedData[field] = undefined;
      }
    });

    onSave(processedData as Startup | Omit<Startup, 'id'>);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={isEditMode ? `Edit ${startup.name}` : 'Add New Startup'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="startupName">Startup Name</label>
          <Input id="startupName" type="text" name="name" value={formData.name || ''} onChange={handleChange} required className="mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="website">Website URL</label>
          <Input id="website" type="text" name="website" placeholder="example.com" value={formData.website || ''} onChange={handleChange} className="mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="founderLinkedIn">Founder LinkedIn URL</label>
          <Input id="founderLinkedIn" type="text" name="founderLinkedIn" placeholder="linkedin.com/in/founder" value={formData.founderLinkedIn || ''} onChange={handleChange} className="mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="deckUrl">Deck URL</label>
          <Input id="deckUrl" type="text" name="deckUrl" placeholder="deck.com/slide" value={formData.deckUrl || ''} onChange={handleChange} className="mt-1" />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" onClick={onClose} variant="secondary">Cancel</Button>
          <Button type="submit">{isEditMode ? 'Save Changes' : 'Add Startup'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditStartupModal;
