import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, Zap } from 'lucide-react';
import api from '../services/api';

const HomePage = () => {
  const [stats, setStats] = useState(null);
  const [featuredIdeas, setFeaturedIdeas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, ideasResponse, categoriesResponse] = await Promise.all([
          api.get('/api/stats'),
          api.get('/api/ideas?limit=6'),
          api.get('/api/categories')
        ]);
        setStats(statsResponse.data);
        setFeaturedIdeas(ideasResponse.data.ideas);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const features = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Market Analysis",
      description: "Detailed market research and competitive analysis for each business idea"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Driven",
      description: "Ideas curated by successful entrepreneurs and business experts"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Quick Start",
      description: "Step-by-step implementation guides and resource recommendations"
    }
  ];

  const [categories, setCategories] = useState([]);

  const categoryColors = [
    "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
    "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200", 
    "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
    "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200",
    "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
    "bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200",
    "bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200",
    "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
    "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
    "bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-primary py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Discover Your Next
              <span className="text-primary-600 dark:text-primary-400"> Business Venture</span>
            </h1>
                         <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
               Access {stats ? Math.floor(stats.totalIdeas / 50) * 50 + '+' : '1600+'} proven business ideas with detailed analysis, investment requirements, 
               and market insights. Find the perfect opportunity to start your entrepreneurial journey.
             </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/ideas" className="btn-primary text-lg px-10 py-4 inline-flex items-center">
                Browse Ideas
                <ArrowRight className="ml-3 w-6 h-6" />
              </Link>
              <Link to="/about" className="btn-secondary text-lg px-10 py-4">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-20 bg-white dark:bg-dark-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-3">{stats.totalIdeas}+</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Business Ideas</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-3">
                  {stats.categories || categories.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-3">{stats.lowBudgetIdeas}+</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Low Budget</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Business Ideas?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our database is carefully curated to provide you with the most promising and actionable business opportunities.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-8 text-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary-600 dark:text-primary-400">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Explore by Category
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Find business ideas that match your interests and expertise
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {categories.slice(0, 9).map((categoryData, index) => (
              <Link
                key={categoryData.category}
                to={`/ideas?categories=${categoryData.category}`}
                className="card p-6 hover:shadow-medium transition-shadow group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {categoryData.category.charAt(0).toUpperCase() + categoryData.category.slice(1)}
                  </span>
                  <span className={`badge ${categoryColors[index % categoryColors.length]}`}>
                    {categoryData.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Ideas Section */}
      {featuredIdeas.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-dark-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Business Ideas
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Get inspired by these trending business opportunities
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredIdeas.map((idea) => (
                <Link
                  key={idea.id}
                  to={`/ideas/${idea.id}`}
                  className="card p-6 hover:shadow-medium transition-shadow group"
                >
                  <div className="aspect-video bg-gray-200 dark:bg-dark-700 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={idea.image}
                      alt={idea.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {idea.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {idea.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`badge ${
                      idea.investmentLevel === 'low' ? 'badge-success' :
                      idea.investmentLevel === 'medium' ? 'badge-warning' : 'badge-gray'
                    }`}>
                      {idea.investmentLevel} investment
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {idea.estimatedCost}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/ideas" className="btn-primary text-lg px-8 py-3 inline-flex items-center">
                View All Ideas
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Business Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who have found their next business idea in our database.
          </p>
          <Link to="/ideas" className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center">
            Get Started Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 