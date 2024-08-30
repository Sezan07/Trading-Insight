import React, { useState, useEffect } from 'react';
import MarketSegments from './MarketSegments';
import Crypto from './Crypto';
import MutualFund from './MutualFund';
import trading from './trading.jpg';
import Navbar from './Navbar';

function HomePage() {
  const [activeSection, setActiveSection] = useState("Market and Segments");

  const handleButtonClick = (section) => {
    setActiveSection(section);
  };

  useEffect(() => {
    // Delay changing active section to "Crypto" after 3000 milliseconds (3 seconds)
    const timer = setTimeout(() => {
      setActiveSection("Crypto");
    },6000);

    // Cleanup function to clear the timer
    return () => clearTimeout(timer);
  }, []); // Empty dependency array to run only once on component mount

  return (
    <div>
      {/* Background image with blur effect */}
      <div
        className="bg-cover bg-center bg-no-repeat min-h-screen flex-col"
        style={{
          backgroundImage: `url(${trading})`,
          // filter: "blur(10px)", // Apply blur effect
        }}
      >
        <div className="content">
          <h1>Welcome to TradingInsight</h1>
        </div>
      </div>

      {/* Content section */}
      <div>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg mb-10 mt-20 align-item-left">
          <MarketSegments />
        </div>
        
        {activeSection === "Crypto" && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg mb-10"> 
            <Crypto />
          </div>
        )}

        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg mb-10">
          <MutualFund />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
