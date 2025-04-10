import { useState, useEffect } from 'react';

import websiteLogo from '/logo.png'; // Example path, replace with your actual logo path

export default function UnderConstructionPage() {
  const [progress, setProgress] = useState(0);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [visitorsCount, setVisitorsCount] = useState(0);
  const targetProgress = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // Animated stars configuration
  const [stars, setStars] = useState([]);
  
  useEffect(() => {
    // Generate stars for background effect
    const newStars = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 3 + 1
    }));
    
    setStars(newStars);
    
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= targetProgress) {
          clearInterval(progressInterval);
          return targetProgress;
        }
        return prev + 0.5;
      });
    }, 100);
    
    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    // Fetch subscribers count
    fetch(`${backendUrl}/api/subscribers`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setSubscribersCount(data.count);
        }
      })
      .catch(error => console.error('Error fetching subscribers:', error));

    // Check if this is a new visitor
    const isNewVisitor = !localStorage.getItem('hasVisited');

    if (isNewVisitor) {
      fetch(`${backendUrl}/api/visitors/increment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setVisitorsCount(data.count);
            localStorage.setItem('hasVisited', 'true');
          }
        })
        .catch(error => console.error('Error incrementing visitors:', error));
    } else {
      fetch(`${backendUrl}/api/visitors`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setVisitorsCount(data.count);
          }
        })
        .catch(error => console.error('Error fetching visitors:', error));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`${backendUrl}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Thank you! We\'ll notify you when the site is ready.');
        setEmail('');
        setSubscribersCount(prev => prev + 1);
      } else {
        setMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-black p-4 font-sans relative overflow-hidden">
      {/* Animated stars */}
      {stars.map((star, index) => (
        <div 
          key={index}
          className="absolute rounded-full bg-blue-100"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${star.twinkleSpeed}s ease-in-out infinite alternate`
          }}
        />
      ))}
      
      {/* Glowing orbs for accent */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-10" />
      <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-indigo-600 rounded-full filter blur-3xl opacity-10" />
      
      {/* Main container - horizontal design */}
      <div className="w-full max-w-6xl mx-auto relative z-10">
        {/* Responsive grid container */}
        <div className="grid md:grid-cols-2 gap-6 bg-gray-900 bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-900 overflow-hidden">
          
          {/* Left side - Progress visualization */}
          <div className="flex flex-col items-center justify-center p-8 relative bg-gradient-to-br from-gray-900 to-blue-900">
            {/* Logo/progress circle */}
            <div className="relative w-48 h-48 mb-6">
              <div className="absolute inset-0">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#2DD4BF" />
                    </linearGradient>
                  </defs>
                  <circle 
                    className="text-gray-800 stroke-current" 
                    strokeWidth="4" 
                    cx="50" 
                    cy="50" 
                    r="44" 
                    fill="transparent"
                  />
                  <circle 
                    stroke="url(#progressGradient)" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                    cx="50" 
                    cy="50" 
                    r="44" 
                    fill="transparent" 
                    strokeDasharray={`${2.76 * progress}, 276`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
              
              {/* Custom website logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src={websiteLogo} 
                  alt="Whitehilll Logo" 
                  className="w-24 h-24 object-contain"
                />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-3">Whitehilll</h1>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full mb-3"></div>
            <p className="text-blue-200 mb-4 text-center">Launching Soon</p>
            
            {/* Stats side by side */}
            <div className="flex justify-between w-full max-w-xs mt-4">
              <div className="text-center">
                <p className="text-blue-300 text-sm">Subscribers</p>
                <p className="text-white text-2xl font-semibold">{formatNumber(subscribersCount)}</p>
              </div>
              <div className="text-center">
                <p className="text-blue-300 text-sm">Visitors</p>
                <p className="text-white text-2xl font-semibold">{formatNumber(visitorsCount)}</p>
              </div>
            </div>
          </div>
          
          {/* Right side - Content and form */}
          <div className="flex flex-col justify-center p-8">
            <h2 className="text-3xl font-bold text-white mb-2">We're Building Something <span className="text-blue-400">Amazing</span></h2>
            <p className="text-blue-100 mb-6">Our team is working hard to bring you an exceptional experience. Stay tuned for updates!</p>
            
            {/* Progress bar with gradient */}
            <div className="w-full bg-gray-800 rounded-full h-2 mb-2 overflow-hidden">
              <div 
                className="h-2 rounded-full transition-all duration-300 ease-out"
                style={{ 
                  width: `${progress}%`,
                  background: 'linear-gradient(to right, #3B82F6, #2DD4BF)'
                }}
              ></div>
            </div>
            
            <p className="text-sm text-blue-300 mb-6">Development progress: <span className="font-medium">{Math.round(progress)}%</span></p>
            
            {/* Subscription form */}
            <form onSubmit={handleSubmit} className="mb-6 w-full">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for updates"
                  className="w-full px-5 py-4 bg-gray-800 border border-blue-900 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  className={`absolute right-2 top-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-md hover:from-blue-700 hover:to-teal-600 transition-all shadow-lg ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Notify Me'}
                </button>
              </div>
              {message && (
                <p className={`mt-3 text-sm ${message.includes('Thank you') ? 'text-green-400' : 'text-red-400'}`}>
                  {message}
                </p>
              )}
            </form>
            
            {/* Social media links */}
            <div className="flex space-x-4 mb-6">
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                <div className="bg-blue-900 bg-opacity-30 p-3 rounded-full hover:bg-opacity-50 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0H1.325C0.593 0 0 0.593 0 1.325v21.351C0 23.407 0.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463 0.099 2.795 0.143v3.24l-1.918 0.001c-1.504 0-1.795 0.715-1.795 1.763v2.313h3.587l-0.467 3.622h-3.12V24h6.116c0.73 0 1.323-0.593 1.323-1.325V1.325C24 0.593 23.407 0 22.675 0z" />
                  </svg>
                </div>
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                <div className="bg-blue-900 bg-opacity-30 p-3 rounded-full hover:bg-opacity-50 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.998 12c0-6.628-5.372-12-11.999-12C5.372 0 0 5.372 0 12c0 5.988 4.388 10.952 10.124 11.852v-8.384H7.078v-3.469h3.046V9.356c0-3.008 1.792-4.669 4.532-4.669 1.313 0 2.686.234 2.686.234v2.953H15.83c-1.49 0-1.955.925-1.955 1.874V12h3.328l-.532 3.469h-2.796v8.384c5.736-.9 10.124-5.864 10.124-11.853z" />
                  </svg>
                </div>
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                <div className="bg-blue-900 bg-opacity-30 p-3 rounded-full hover:bg-opacity-50 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z" />
                  </svg>
                </div>
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                <div className="bg-blue-900 bg-opacity-30 p-3 rounded-full hover:bg-opacity-50 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>
              </a>
            </div>
            
            {/* Updated Contact section with phone numbers */}
            <div className="mt-auto">
              <p className="text-sm text-blue-200">
                Email: <a href="mailto:whitehilll.info@gmail.com" className="text-blue-400 hover:text-blue-300">whitehilll.info@gmail.com</a>
              </p>
              <p className="text-sm text-blue-200 mt-1">
                Phone: 
                <a href="tel:+1234567890" className="text-blue-400 hover:text-blue-300 ml-1">+91 8474896216</a> | 
                <a href="tel:+0987654321" className="text-blue-400 hover:text-blue-300 ml-1">+91 7662824778</a>
              </p>
              <p className="text-sm text-blue-300 mt-2">
                © {new Date().getFullYear()} Whitehilll. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS for twinkling animation */}
      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}