import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bookmark, ArrowRight, Search, Filter } from 'lucide-react';
import axios from 'axios';

const SavedIdeasPage = () => {
  const { user, loading } = useAuth();
  const [savedIdeas, setSavedIdeas] = useState([]);
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedInvestmentLevels, setSelectedInvestmentLevels] = useState([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);

  useEffect(() => {
    if (user) {
      fetchSavedIdeas();
    }
  }, [user]);

  useEffect(() => {
    filterIdeas();
  }, [savedIdeas, searchQuery, selectedCategories, selectedInvestmentLevels, selectedDifficulties]);

  // Redirect if not logged in
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  const fetchSavedIdeas = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/saved-ideas');
      setSavedIdeas(response.data.savedIdeas);
    } catch (error) {
      console.error('Error fetching saved ideas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterIdeas = () => {
    let filtered = [...savedIdeas];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(idea =>
        idea.title.toLowerCase().includes(query) ||
        idea.description.toLowerCase().includes(query) ||
        idea.categories.some(cat => cat.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(idea =>
        idea.categories.some(cat => selectedCategories.includes(cat))
      );
    }

    // Investment level filter
    if (selectedInvestmentLevels.length > 0) {
      filtered = filtered.filter(idea =>
        selectedInvestmentLevels.includes(idea.investmentLevel)
      );
    }

    // Difficulty filter
    if (selectedDifficulties.length > 0) {
      filtered = filtered.filter(idea =>
        selectedDifficulties.includes(idea.difficulty)
      );
    }

    setFilteredIdeas(filtered);
  };

  const removeSavedIdea = async (ideaId) => {
    try {
      await axios.delete(`/api/saved-ideas/${ideaId}`);
      setSavedIdeas(prev => prev.filter(idea => idea.id !== ideaId));
    } catch (error) {
      console.error('Error removing saved idea:', error);
    }
  };

  const toggleFilter = (filterType, value) => {
    switch (filterType) {
      case 'category':
        setSelectedCategories(prev =>
          prev.includes(value)
            ? prev.filter(cat => cat !== value)
            : [...prev, value]
        );
        break;
      case 'investmentLevel':
        setSelectedInvestmentLevels(prev =>
          prev.includes(value)
            ? prev.filter(level => level !== value)
            : [...prev, value]
        );
        break;
      case 'difficulty':
        setSelectedDifficulties(prev =>
          prev.includes(value)
            ? prev.filter(diff => diff !== value)
            : [...prev, value]
        );
        break;
      default:
        break;
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedInvestmentLevels([]);
    setSelectedDifficulties([]);
  };

  // Get unique categories from saved ideas
  const allCategories = [...new Set(savedIdeas.flatMap(idea => idea.categories))];
  const allInvestmentLevels = [...new Set(savedIdeas.map(idea => idea.investmentLevel))];
  const allDifficulties = [...new Set(savedIdeas.map(idea => idea.difficulty))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Hero Section */}
      <section className="gradient-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Your Saved Ideas
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Access your bookmarked business ideas and keep track of opportunities that interest you
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your saved ideas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                />
              </div>
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedCategories.length > 0 || selectedInvestmentLevels.length > 0 || selectedDifficulties.length > 0) && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map(category => (
              <button
                key={category}
                onClick={() => toggleFilter('category', category)}
                className="badge badge-primary"
              >
                {category} ×
              </button>
            ))}
            {selectedInvestmentLevels.map(level => (
              <button
                key={level}
                onClick={() => toggleFilter('investmentLevel', level)}
                className="badge badge-primary"
              >
                {level} investment ×
              </button>
            ))}
            {selectedDifficulties.map(difficulty => (
              <button
                key={difficulty}
                onClick={() => toggleFilter('difficulty', difficulty)}
                className="badge badge-primary"
              >
                {difficulty} difficulty ×
              </button>
            ))}
          </div>
        </div>

        {/* Filters Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Categories */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Categories
            </h3>
            <div className="space-y-2">
              {allCategories.map(category => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleFilter('category', category)}
                    className="rounded border-gray-300 dark:border-dark-600 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Investment Levels */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Investment Level</h3>
            <div className="space-y-2">
              {allInvestmentLevels.map(level => (
                <label key={level} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedInvestmentLevels.includes(level)}
                    onChange={() => toggleFilter('investmentLevel', level)}
                    className="rounded border-gray-300 dark:border-dark-600 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {level}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Difficulties */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Difficulty</h3>
            <div className="space-y-2">
              {allDifficulties.map(difficulty => (
                <label key={difficulty} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedDifficulties.includes(difficulty)}
                    onChange={() => toggleFilter('difficulty', difficulty)}
                    className="rounded border-gray-300 dark:border-dark-600 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {difficulty}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : savedIdeas.length === 0 ? (
          <div className="text-center py-12">
            <Bookmark className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No saved ideas yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start exploring business ideas and save the ones that interest you
            </p>
            <Link to="/ideas" className="btn-primary">
              Browse Ideas
            </Link>
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No ideas match your filters
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filters
            </p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Showing {filteredIdeas.length} of {savedIdeas.length} saved ideas
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredIdeas.map((idea) => (
                <div key={idea.id} className="card p-6 hover:shadow-medium transition-shadow group">
                  <div className="aspect-video bg-gray-200 dark:bg-dark-700 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={idea.image}
                      alt={idea.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {idea.title}
                    </h3>
                    <button
                      onClick={() => removeSavedIdea(idea.id)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                      title="Remove from saved"
                    >
                      <Bookmark className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4" style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {idea.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {idea.categories.slice(0, 3).map((category) => (
                      <span key={category} className="badge badge-gray">
                        {category}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`badge ${
                      idea.investmentLevel === 'low' ? 'badge-success' :
                      idea.investmentLevel === 'medium' ? 'badge-warning' : 'badge-gray'
                    }`}>
                      {idea.investmentLevel} investment
                    </span>
                    <Link
                      to={`/ideas/${idea.id}`}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm flex items-center transition-colors"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SavedIdeasPage; 