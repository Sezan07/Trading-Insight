import React, { useState, useEffect } from 'react';
import { FiBarChart2, FiBriefcase } from 'react-icons/fi';
import stockLogo from './f2.png';

function Navbar({ userData, onLogout, onPredictor, onPortfolio, onLogin, onHome, transparent }) {
  const [fixedNavbar, setFixedNavbar] = useState(!transparent);

  useEffect(() => {
    const handleScroll = () => {
      setFixedNavbar(!transparent || window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove the scroll event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [transparent]); // Re-run effect when `transparent` prop changes

  return (
    <nav className={`absolute top-0 left-0 w-full z-50 ${fixedNavbar ? 'fixed bg-gray-800' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">  
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="cursor-pointer flex items-center" onClick={onHome}>
              <img width="50" height="10" src={stockLogo} alt="Logo" />
              <span className="text-lg font-bold text-white ml-2">TradingInsight</span>
            </div>
          </div>
          <div className="hidden md:flex items-center">
            <span className="mr-6 cursor-pointer" onClick={onPredictor}>
              <FiBarChart2 className="h-6 w-6 text-white" />
            </span>
            <span className="mr-6 cursor-pointer" onClick={onPortfolio}>
              <FiBriefcase className="h-6 w-6 text-white" />
            </span>
            {userData ? (
              <div className="flex items-center">
                <span className="mr-2 text-gray-200">{userData.name}</span>
                <button className="text-gray-200" onClick={onLogout}>Logout</button>
              </div>
            ) : (
              <button className="text-gray-200" onClick={onLogin}>Login</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
