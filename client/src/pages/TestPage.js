import React, { useState } from 'react';
import api from '../services/api';
import config from '../config';

const TestPage = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, result, error = null) => {
    setTestResults(prev => [...prev, { test, result, error, timestamp: new Date().toISOString() }]);
  };

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);

    // Test 1: Check config
    addResult('Config Check', `API_BASE_URL: ${config.API_BASE_URL}`);

    // Test 2: Test ideas endpoint
    try {
      const response = await api.get('/api/ideas');
      addResult('Ideas API Test', `Success: ${response.data.ideas?.length || 0} ideas found`);
    } catch (error) {
      addResult('Ideas API Test', 'Failed', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: error.config?.url
      });
    }

    // Test 3: Test registration endpoint
    try {
      await api.post('/api/auth/register', {
        email: 'test@example.com',
        password: 'testpassword123'
      });
      addResult('Registration API Test', 'Success');
    } catch (error) {
      addResult('Registration API Test', 'Failed', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: error.config?.url
      });
    }

    // Test 4: Direct fetch test
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/ideas`);
      const data = await response.json();
      addResult('Direct Fetch Test', `Success: ${data.ideas?.length || 0} ideas found`);
    } catch (error) {
      addResult('Direct Fetch Test', 'Failed', {
        message: error.message
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Connection Test</h1>
        
        <button
          onClick={runTests}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-6"
        >
          {loading ? 'Running Tests...' : 'Run Tests'}
        </button>

        <div className="space-y-4">
          {testResults.map((result, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-900">{result.test}</h3>
              <p className="text-gray-700 mt-1">{result.result}</p>
              {result.error && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-800 text-sm">
                    <strong>Error:</strong> {JSON.stringify(result.error, null, 2)}
                  </p>
                </div>
              )}
              <p className="text-gray-500 text-xs mt-2">{result.timestamp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestPage;
