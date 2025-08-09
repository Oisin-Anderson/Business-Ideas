import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bookmark } from 'lucide-react';
import axios from 'axios';

const BookmarkButton = ({ ideaId }) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkIfSaved = useCallback(async () => {
    try {
      const response = await axios.get('/api/saved-ideas');
      const savedIdeas = response.data.savedIdeas;
      setIsSaved(savedIdeas.some(idea => idea.id === ideaId));
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  }, [ideaId]);

  useEffect(() => {
    if (user) {
      checkIfSaved();
    }
  }, [user, ideaId, checkIfSaved]);

  const toggleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      if (isSaved) {
        await axios.delete(`/api/saved-ideas/${ideaId}`);
        setIsSaved(false);
      } else {
        await axios.post('/api/saved-ideas', { ideaId });
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null; // Don't show bookmark button if user is not logged in
  }

  return (
    <button
      onClick={toggleSave}
      disabled={isLoading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
        isSaved
          ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800'
          : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={isSaved ? 'Remove from saved' : 'Save idea'}
    >
      <Bookmark 
        className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} 
      />
      <span className="font-medium">
        {isLoading ? '...' : isSaved ? 'Saved' : 'Save'}
      </span>
    </button>
  );
};

export default BookmarkButton; 