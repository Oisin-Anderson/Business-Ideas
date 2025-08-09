import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, TrendingUp, Award } from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { number: "10+", label: "Business Ideas", icon: <Target className="w-6 h-6" /> },
    { number: "15+", label: "Categories", icon: <TrendingUp className="w-6 h-6" /> },
    { number: "5+", label: "Years Experience", icon: <Award className="w-6 h-6" /> },
    { number: "1K+", label: "Entrepreneurs Helped", icon: <Users className="w-6 h-6" /> }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      bio: "Former startup founder with 15+ years in business development and entrepreneurship.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
    },
    {
      name: "Michael Chen",
      role: "Head of Research",
      bio: "Business analyst with expertise in market research and competitive analysis.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    },
    {
      name: "Emily Rodriguez",
      role: "Content Director",
      bio: "Former consultant helping businesses scale from startup to enterprise level.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-dark-800 dark:to-dark-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            About Our
            <span className="text-primary-600 dark:text-primary-400"> Business Ideas Database</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We're on a mission to help entrepreneurs find and launch successful businesses 
            by providing comprehensive, research-backed business ideas and implementation guidance.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary-600 dark:text-primary-400">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              We believe that everyone deserves the opportunity to build a successful business. 
              Our comprehensive database of business ideas is designed to help entrepreneurs at 
              every stage of their journey, from initial concept to successful launch.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Each business idea in our database comes with detailed market analysis, 
              investment requirements, implementation steps, and potential revenue projections 
              to help you make informed decisions about your next venture.
            </p>
            <Link to="/ideas" className="btn-primary text-lg px-8 py-3">
              Explore Our Ideas
            </Link>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our team of experienced entrepreneurs and business experts are dedicated to 
              helping you find and launch your next successful business.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="w-24 h-24 bg-gray-200 dark:bg-dark-700 rounded-full mx-auto mb-4 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Next Business Idea?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who have already discovered their next business opportunity 
            in our comprehensive database.
          </p>
          <Link to="/ideas" className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center">
            Start Exploring
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 