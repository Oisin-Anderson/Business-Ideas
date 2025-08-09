import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List, ChevronLeft, ChevronRight, X, Lock } from 'lucide-react';
import axios from 'axios';
import BookmarkButton from '../components/BookmarkButton';
import { useAuth } from '../contexts/AuthContext';

const IdeasPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [ideas, setIdeas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    categories: searchParams.get('categories') ? searchParams.get('categories').split(',') : [],
    investmentLevels: searchParams.get('investmentLevels') ? searchParams.get('investmentLevels').split(',') : [],
    difficulties: searchParams.get('difficulties') ? searchParams.get('difficulties').split(',') : []
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: 12,
        search: filters.search,
        categories: filters.categories.join(','),
        investmentLevels: filters.investmentLevels.join(','),
        difficulties: filters.difficulties.join(',')
      });
      
      const response = await axios.get(`/api/ideas?${params}`);
      setIdeas(response.data.ideas);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.totalPages,
        total: response.data.total
      }));
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchIdeas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    
    // Update URL params
    const newSearchParams = new URLSearchParams();
    if (newFilters.search) newSearchParams.set('search', newFilters.search);
    if (newFilters.categories.length > 0) newSearchParams.set('categories', newFilters.categories.join(','));
    if (newFilters.investmentLevels.length > 0) newSearchParams.set('investmentLevels', newFilters.investmentLevels.join(','));
    if (newFilters.difficulties.length > 0) newSearchParams.set('difficulties', newFilters.difficulties.join(','));
    setSearchParams(newSearchParams);
  };

  const handleInvestmentLevelToggle = (level) => {
    let newLevels;
    if (level === 'all') {
      // If "All" is being checked, select all levels
      newLevels = ['low', 'medium', 'high'];
    } else {
      // Toggle individual level
      newLevels = filters.investmentLevels.includes(level)
        ? filters.investmentLevels.filter(l => l !== level)
        : [...filters.investmentLevels, level];
      
      // If all individual levels are now selected, select "All" (empty array means "All")
      if (newLevels.length === 3) {
        newLevels = [];
      }
    }
    handleFilterChange('investmentLevels', newLevels);
  };

  const handleDifficultyToggle = (difficulty) => {
    let newDifficulties;
    if (difficulty === 'all') {
      // If "All" is being checked, select all difficulties
      newDifficulties = ['low', 'medium', 'high'];
    } else {
      // Toggle individual difficulty
      newDifficulties = filters.difficulties.includes(difficulty)
        ? filters.difficulties.filter(d => d !== difficulty)
        : [...filters.difficulties, difficulty];
      
      // If all individual difficulties are now selected, select "All" (empty array means "All")
      if (newDifficulties.length === 3) {
        newDifficulties = [];
      }
    }
    handleFilterChange('difficulties', newDifficulties);
  };

  const isAllInvestmentLevelsSelected = () => {
    return filters.investmentLevels.length === 0;
  };

  const isAllDifficultiesSelected = () => {
    return filters.difficulties.length === 0;
  };

  const handleCategoryToggle = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    handleFilterChange('categories', newCategories);
  };

  const clearFilters = () => {
    const newFilters = {
      search: '',
      categories: [],
      investmentLevels: [],
      difficulties: []
    };
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const getInvestmentLevelColor = (level) => {
    switch (level) {
      case 'low': return 'badge-success';
      case 'medium': return 'badge-warning';
      case 'high': return 'badge-gray';
      default: return 'badge-gray';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const hasActiveFilters = filters.search || filters.categories.length > 0 || filters.investmentLevels.length > 0 || filters.difficulties.length > 0;

  if (loading && ideas.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card p-6">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Business Ideas Database
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Discover {pagination.total} innovative business ideas to start your entrepreneurial journey
          </p>
          {!user && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-blue-800 dark:text-blue-200 font-medium">
                    Sign up to unlock full access
                  </p>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    Create a free account to view detailed analysis, implementation guides, and save your favorite ideas.
                  </p>
                </div>
                <Link
                  to="/auth"
                  className="btn-primary py-2 px-4 text-sm ml-auto"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="card p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search ideas..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-dark-600 rounded-xl bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center gap-3 px-6 py-3"
            >
              <Filter className="w-5 h-5" />
              Filters
              {hasActiveFilters && (
                <span className="bg-primary-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {filters.categories.length + (filters.investmentLevels.length > 0 ? 1 : 0) + (filters.difficulties.length > 0 ? 1 : 0)}
                </span>
              )}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn-outline flex items-center gap-3 px-6 py-3"
              >
                <X className="w-5 h-5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="card p-6 mb-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Categories</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map((categoryData) => (
                    <label key={categoryData.category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(categoryData.category)}
                        onChange={() => handleCategoryToggle(categoryData.category)}
                        className="rounded border-gray-300 dark:border-dark-600 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {categoryData.category.charAt(0).toUpperCase() + categoryData.category.slice(1)} ({categoryData.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Investment Level */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Investment Level</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAllInvestmentLevelsSelected()}
                      onChange={() => handleInvestmentLevelToggle('all')}
                      className="rounded border-gray-300 dark:border-dark-600 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">All Investment Levels</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.investmentLevels.includes('low') || isAllInvestmentLevelsSelected()}
                      onChange={() => handleInvestmentLevelToggle('low')}
                      className="rounded border-gray-300 dark:border-dark-600 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Low Investment</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.investmentLevels.includes('medium') || isAllInvestmentLevelsSelected()}
                      onChange={() => handleInvestmentLevelToggle('medium')}
                      className="rounded border-gray-300 dark:border-dark-600 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Medium Investment</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.investmentLevels.includes('high') || isAllInvestmentLevelsSelected()}
                      onChange={() => handleInvestmentLevelToggle('high')}
                      className="rounded border-gray-300 dark:border-dark-600 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">High Investment</span>
                  </label>
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Difficulty</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAllDifficultiesSelected()}
                      onChange={() => handleDifficultyToggle('all')}
                      className="rounded border-gray-300 dark:border-dark-600 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">All Difficulties</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.difficulties.includes('low') || isAllDifficultiesSelected()}
                      onChange={() => handleDifficultyToggle('low')}
                      className="rounded border-gray-300 dark:border-dark-600 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Easy</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.difficulties.includes('medium') || isAllDifficultiesSelected()}
                      onChange={() => handleDifficultyToggle('medium')}
                      className="rounded border-gray-300 dark:border-dark-600 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Medium</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.difficulties.includes('high') || isAllDifficultiesSelected()}
                      onChange={() => handleDifficultyToggle('high')}
                      className="rounded border-gray-300 dark:border-dark-600 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Hard</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {filters.categories.map((category) => (
                <span key={category} className="badge badge-primary flex items-center gap-1">
                  {category}
                  <button
                    onClick={() => handleCategoryToggle(category)}
                    className="ml-1 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filters.investmentLevels.length > 0 && (
                <span className="badge badge-warning flex items-center gap-1">
                  {filters.investmentLevels.map(level => level.charAt(0).toUpperCase() + level.slice(1)).join(', ')} investment
                  <button
                    onClick={() => handleInvestmentLevelToggle('all')}
                    className="ml-1 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.difficulties.length > 0 && (
                <span className="badge badge-gray flex items-center gap-1">
                  {filters.difficulties.map(difficulty => difficulty.charAt(0).toUpperCase() + difficulty.slice(1)).join(', ')} difficulty
                  <button
                    onClick={() => handleDifficultyToggle('all')}
                    className="ml-1 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* View Mode Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Showing {((pagination.page - 1) * 12) + 1} - {Math.min(pagination.page * 12, pagination.total)} of {pagination.total} ideas
          </p>
        </div>

        {/* Ideas Grid/List */}
        <div className={`grid gap-8 ${
          viewMode === 'grid' 
            ? 'md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {ideas.map((idea) => (
            <div
              key={idea.id}
              className={`card p-6 hover:shadow-medium transition-shadow group relative ${
                viewMode === 'list' ? 'flex md:flex-row flex-col' : ''
              }`}
            >
              <Link
                to={`/ideas/${idea.id}`}
                className="block"
              >
                <div className={`bg-gray-200 rounded-lg overflow-hidden mb-4 ${
                  viewMode === 'list' ? 'md:w-48 md:h-32' : 'aspect-video'
                }`}>
                  <img
                    src={idea.image}
                    alt={idea.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                
                <div className={`flex-1 ${viewMode === 'list' ? 'md:ml-6' : ''}`}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {idea.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {idea.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {idea.categories.slice(0, 3).map((category) => (
                      <span key={category} className="badge badge-primary">
                        {category}
                      </span>
                    ))}
                    {idea.categories.length > 3 && (
                      <span className="badge badge-gray">
                        +{idea.categories.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`badge ${getInvestmentLevelColor(idea.investmentLevel)}`}>
                      {idea.investmentLevel} investment
                    </span>
                    <span className="text-sm text-gray-500">
                      {idea.estimatedCost}
                    </span>
                  </div>
                  
                  {viewMode === 'list' && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-700">
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>Difficulty: <span className={getDifficultyColor(idea.difficulty)}>{idea.difficulty}</span></span>
                        <span>Market: {idea.marketSize}</span>
                        <span>Revenue: {idea.potentialRevenue}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
              
              {/* Bookmark Button */}
              <div className="absolute top-4 right-4">
                <BookmarkButton ideaId={idea.id} />
              </div>

              {/* Authentication Overlay for Non-Authenticated Users */}
              {!user && (
                <div className="absolute inset-0 bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <div className="text-center p-4">
                    <Lock className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Sign up to view details
                    </p>
                    <Link
                      to="/auth"
                      className="btn-primary py-2 px-4 text-sm"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-12">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-gray-300 dark:border-dark-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-dark-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {[...Array(pagination.totalPages)].map((_, i) => {
              const page = i + 1;
              const isCurrent = page === pagination.page;
              const isNearCurrent = Math.abs(page - pagination.page) <= 1;
              const isFirst = page === 1;
              const isLast = page === pagination.totalPages;
              
              if (isCurrent || isNearCurrent || isFirst || isLast) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg border ${
                      isCurrent
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-gray-300 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === pagination.page - 2 || page === pagination.page + 2) {
                return <span key={page} className="px-2">...</span>;
              }
              return null;
            })}
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="p-2 rounded-lg border border-gray-300 dark:border-dark-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-dark-700"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeasPage; 