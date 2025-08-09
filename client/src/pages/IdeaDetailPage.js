import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, DollarSign, TrendingUp, Target, CheckCircle, XCircle, Lock } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import BookmarkButton from '../components/BookmarkButton';
import { useAuth } from '../contexts/AuthContext';

const IdeaDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIdea = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/ideas/${id}`);
      setIdea(response.data);
    } catch (error) {
      setError('Business idea not found');
      console.error('Error fetching idea:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdea();
    // Scroll to top when idea changes
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-dark-700 rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-gray-200 dark:bg-dark-700 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-dark-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Business Idea Not Found</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">The business idea you're looking for doesn't exist or has been removed.</p>
            <Link to="/ideas" className="btn-primary">
              Browse All Ideas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/ideas"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Ideas
        </Link>

        {/* Hero Section */}
        <div className="card p-8 mb-8">
          <div className="aspect-video bg-gray-200 dark:bg-dark-700 rounded-lg mb-6 overflow-hidden">
            <img
              src={idea.image}
              alt={idea.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {idea.title}
            </h1>
            <BookmarkButton ideaId={idea.id} />
          </div>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            {idea.description}
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {idea.categories.map((category) => (
              <span key={category} className="badge badge-primary">
                {category}
              </span>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <DollarSign className="w-6 h-6 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
              <div className="text-sm text-gray-600 dark:text-gray-400">Investment</div>
              <div className="font-semibold text-gray-900 dark:text-white">{idea.estimatedCost}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <Clock className="w-6 h-6 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
              <div className="text-sm text-gray-600 dark:text-gray-400">Time to Launch</div>
              <div className="font-semibold text-gray-900 dark:text-white">{idea.timeToLaunch}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
              <div className="text-sm text-gray-600 dark:text-gray-400">Potential Revenue</div>
              <div className="font-semibold text-gray-900 dark:text-white">{idea.potentialRevenue}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <Target className="w-6 h-6 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
              <div className="text-sm text-gray-600 dark:text-gray-400">Market Size</div>
              <div className="font-semibold text-gray-900 dark:text-white">{idea.marketSize}</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Full Content (if available) */}
            {idea.fullContent && (
              <div className="card p-6 relative">
                {!user ? (
                  <>
                    {/* Blurred Content */}
                    <div className="blur-sm pointer-events-none">
                      <div className="prose prose-lg max-w-none dark:prose-invert">
                        <ReactMarkdown
                          components={{
                            h2: ({children}) => <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{children}</h2>,
                            h3: ({children}) => <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{children}</h3>,
                            p: ({children}) => <p className="mb-4 text-gray-700 dark:text-gray-300">{children}</p>,
                            ul: ({children}) => <ul className="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal list-inside mb-4 text-gray-700 dark:text-gray-300">{children}</ol>,
                            li: ({children}) => <li className="mb-1">{children}</li>,
                            blockquote: ({children}) => <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-4">{children}</blockquote>,
                            hr: () => <hr className="my-6 border-gray-200 dark:border-gray-700" />,
                            strong: ({children}) => <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>,
                            em: ({children}) => <em className="italic">{children}</em>
                          }}
                        >
                          {idea.fullContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                    
                    {/* Authentication Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm">
                      <div className="text-center p-8 max-w-md">
                        <Lock className="w-16 h-16 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          Sign Up to View Full Details
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          Create a free account to access the complete business idea analysis, implementation guide, and detailed insights.
                        </p>
                        <div className="space-y-3">
                          <Link
                            to="/auth"
                            className="w-full btn-primary py-3 block text-center"
                          >
                            Sign Up Now
                          </Link>
                          <Link
                            to="/auth"
                            className="w-full btn-secondary py-3 block text-center"
                          >
                            Sign In
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    <ReactMarkdown
                      components={{
                        h2: ({children}) => <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{children}</h2>,
                        h3: ({children}) => <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{children}</h3>,
                        p: ({children}) => <p className="mb-4 text-gray-700 dark:text-gray-300">{children}</p>,
                        ul: ({children}) => <ul className="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal list-inside mb-4 text-gray-700 dark:text-gray-300">{children}</ol>,
                        li: ({children}) => <li className="mb-1">{children}</li>,
                        blockquote: ({children}) => <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-4">{children}</blockquote>,
                        hr: () => <hr className="my-6 border-gray-200 dark:border-gray-700" />,
                        strong: ({children}) => <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>,
                        em: ({children}) => <em className="italic">{children}</em>
                      }}
                    >
                      {idea.fullContent}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Investment Level */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Investment Level</h3>
              <span className={`badge ${getInvestmentLevelColor(idea.investmentLevel)} text-sm`}>
                {idea.investmentLevel} investment
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {idea.estimatedCost} required to get started
              </p>
            </div>

            {/* Difficulty */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Difficulty Level</h3>
              <span className={`font-semibold ${getDifficultyColor(idea.difficulty)}`}>
                {idea.difficulty.charAt(0).toUpperCase() + idea.difficulty.slice(1)}
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {idea.difficulty === 'low' && 'Easy to implement with basic skills'}
                {idea.difficulty === 'medium' && 'Requires some expertise and planning'}
                {idea.difficulty === 'high' && 'Complex implementation requiring specialized knowledge'}
              </p>
            </div>

            {/* Market Information */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Market Information</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Market Size</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{idea.marketSize}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Time to Launch</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{idea.timeToLaunch}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Potential Revenue</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{idea.potentialRevenue}</div>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="card p-6 relative">
              {!user ? (
                <>
                  {/* Blurred Content */}
                  <div className="blur-sm pointer-events-none">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Features</h3>
                    <ul className="space-y-3">
                      {idea.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Authentication Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm">
                    <div className="text-center p-4">
                      <Lock className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Sign up to view features
                      </p>
                      <Link
                        to="/auth"
                        className="btn-primary py-2 px-4 text-sm"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    {idea.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Pros and Cons */}
            <div className="card p-6 relative">
              {!user ? (
                <>
                  {/* Blurred Content */}
                  <div className="blur-sm pointer-events-none">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pros</h3>
                    <ul className="space-y-3 mb-6">
                      {idea.pros.map((pro, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{pro}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cons</h3>
                    <ul className="space-y-3">
                      {idea.cons.map((con, index) => (
                        <li key={index} className="flex items-start">
                          <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Authentication Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm">
                    <div className="text-center p-4">
                      <Lock className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Sign up to view pros & cons
                      </p>
                      <Link
                        to="/auth"
                        className="btn-primary py-2 px-4 text-sm"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pros</h3>
                  <ul className="space-y-3 mb-6">
                    {idea.pros.map((pro, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{pro}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cons</h3>
                  <ul className="space-y-3">
                    {idea.cons.map((con, index) => (
                      <li key={index} className="flex items-start">
                        <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{con}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Related Ideas */}
        {idea.relatedIdeas && idea.relatedIdeas.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Business Ideas</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {idea.relatedIdeas.map((relatedIdea) => (
                <Link 
                  key={relatedIdea.id} 
                  to={`/ideas/${relatedIdea.id}`}
                  className="card p-4 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="aspect-video bg-gray-200 dark:bg-dark-700 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={relatedIdea.image}
                      alt={relatedIdea.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                                     <h3 className="font-semibold text-gray-900 dark:text-white mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                     {relatedIdea.title}
                   </h3>
                   <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                     {relatedIdea.description}
                   </p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {relatedIdea.categories.slice(0, 2).map((category) => (
                      <span key={category} className="badge badge-primary text-xs">
                        {category}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`badge ${getInvestmentLevelColor(relatedIdea.investmentLevel)} text-xs`}>
                      {relatedIdea.investmentLevel} investment
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {relatedIdea.relationDescription}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaDetailPage; 