import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Import axios library
import Login from './Login';
import Register from './Register';
import StockInputPage from './StockInputPage';
import Portfolio from './Portfolio'; // Import the Portfolio component
import PortfolioForm from './PortfolioForm'; // Import the PortfolioForm component
import PortfolioTable from './PortfolioTable'; // Import the PortfolioTable component
import Chart from 'chart.js/auto';
import 'chartjs-plugin-zoom';
import './App.css';
import Navbar from './Navbar'; // Import the Navbar component
import HomePage from './HomePage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userData, setUserData] = useState(null);
  const [stockName, setStockName] = useState('');
  const [userName, setUserName] = useState(null);

  const [stockPercentageChange, setstockPercentageChange] = useState('');
  const [stockCurrent, setstockCurrent] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const stockChartRef = useRef(null);
  const dailyReturnChartRef = useRef(null);
  const [error, setError] = useState(null);
  const [predictionImage, setPredictionImage] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [stockInfo, setStockInfo] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!submitted) return;

    const fetchUserName = async () => {
      try {
        // Make a GET request to the /get_user_name endpoint
        const response = await axios.get('http://127.0.0.1:5000/get_user_name');
        if (response.data.success) {
          // Set the username state if the request is successful
          setUserName(response.data.name);
        } else {
         
          console.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    // Call the fetchUserName function when the component mounts
    fetchUserName();
    const fetchDataAndRenderCharts = async () => {
      try {


        const stockPercentageChangeResponse = await fetch(`http://127.0.0.1:5000/stock_pc?stock_name=${stockName}`);
        const stockPercentageChangeData = await stockPercentageChangeResponse.json();
        setstockPercentageChange(stockPercentageChangeData.percentage_change.toFixed(2)); // Rounding to 2 decimal places

        const stockCurrentResponse = await fetch(`http://127.0.0.1:5000/current_p?stock_name=${stockName}`);
        const stockCurrentData = await stockCurrentResponse.json();
        setstockCurrent(stockCurrentData.current_price.toFixed(2));

        const stockInfoResponse = await fetch(`http://127.0.0.1:5000/stock_info?stock_name=${stockName}`);
        const stockInfoData = await stockInfoResponse.json();

        if (!stockInfoResponse.ok) {
          throw new Error('Failed to fetch stock information');
        }


        setStockInfo(stockInfoData);

        const stockDataResponse = await fetch(`http://127.0.0.1:5000/stock_data?stock_name=${stockName}`);
        const stockData = await stockDataResponse.json();

        if (!stockDataResponse.ok) {
          throw new Error('Failed to fetch stock data');
        }

        setStockData(stockData);

        const dailyReturnResponse = await fetch(`http://127.0.0.1:5000/daily_return?stock_name=${stockName}`);
        const predictionImageResponse = await fetch(`http://127.0.0.1:5000/stock_prediction?stock_name=${stockName}`);

        if (!dailyReturnResponse.ok || !predictionImageResponse.ok) {
          throw new Error('Failed to fetch additional data');
        }

        const dailyReturnData = await dailyReturnResponse.json();

        if (stockChartRef.current && dailyReturnChartRef.current) {
          const stockCtx = stockChartRef.current.getContext('2d');
          const dailyReturnCtx = dailyReturnChartRef.current.getContext('2d');



          new Chart(stockCtx, {
            type: 'line',
            data: {
              labels: stockData.map(point => point.x),
              datasets: [{
                label: 'Stock Price',
                data: stockData.map(point => point.y),
                borderColor: 'rgb(0, 155, 255)',
                backgroundColor: 'rgba(0, 155, 255, 0.1)',
                tension: 0.2,
                fill: true,
                borderWidth: 2,
                pointRadius: 0,
              }]
            },
            options: {
              plugins: {
                zoom: {
                  zoom: {
                    wheel: {
                      enabled: true,
                    },
                    pinch: {
                      enabled: true
                    },
                    mode: 'xy',
                  }
                }
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                },
                y: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    font: {
                      size: 12,
                    },
                    color: 'rgba(0,0,0,0.5)',
                  },
                },
              },
              elements: {
                line: {
                  tension: 0.2,
                },
              },
              interaction: {
                intersect: false,
              },
            }
          });

          new Chart(dailyReturnCtx, {
            type: 'bar',
            data: {
              labels: dailyReturnData.map(point => point.x),
              datasets: [{
                label: 'Daily Return',
                data: dailyReturnData.map(point => point.y),
                backgroundColor: 'rgba(0, 155, 255, 0.5)',
                borderWidth: 0,
              }]
            },
            options: {
              scales: {
                x: {
                  grid: {
                    color: 'rgba(0,0,0,0.05)',
                  },
                  ticks: {
                    font: {
                      size: 12,
                    },
                    color: 'rgba(0,0,0,0.5)',
                  },
                },
                y: {
                  grid: {
                    display: false,
                  },
                },
              },
              interaction: {
                intersect: false,
              },
            }
          });
        }

        const blob = await predictionImageResponse.blob();
        const url = URL.createObjectURL(blob);
        setPredictionImage(url);
      } catch (error) {
        setError(error.message);
        // console.error('Error fetching data:', error);
      }
    };

    fetchDataAndRenderCharts();
  }, [submitted, stockName]);

  
  const handleLogin = () => {
    setUserData({ name: userName });
    setLoggedIn(true);
    setCurrentPage('predictor');
  };

  const redirectToStockInput = () => {
    setCurrentPage('predictor');
  };

  const handleRegister = () => {
    setCurrentPage('register');
  };

  const handleStockSubmit = (name) => {
    setStockName(name);
    setSubmitted(true);
  };

  const handlePortfolioAdd = async ({ stockName, quantity }) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/stock_price?stock_name=${stockName}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stock price');
      }
      const data = await response.json();
      const price = data.price;
      setPortfolio([...portfolio, { stockName, quantity, price }]);
    } catch (error) {
      console.error('Error adding stock to portfolio:', error);
    }
  };
  // const response = await fetch(`http://127.0.0.1:5000/g`);
  const handleStockRemove = (index) => {
    const updatedPortfolio = [...portfolio];
    updatedPortfolio.splice(index, 1);
    setPortfolio(updatedPortfolio);
  };

  const handleLogout = () => {
    setUserData(null);
    setLoggedIn(false);
    setCurrentPage('login');
  };

  const renderPage = () => {
    const getPercentageChangeStyle = (percentageChange) => {
      return {
        color: percentageChange >= 0 ? '#198639' : 'rgb(212, 25, 40)'
      };
    };
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'login':
        return <Login onLogin={handleLogin} onRegister={handleRegister} redirectToStockInput={redirectToStockInput} />;
      case 'register':
        return <Register onLogin={handleLogin} />;
      case 'predictor':
        return (
          <div>
            <br />
            {!submitted && <StockInputPage onSubmit={handleStockSubmit} />}
            {submitted && (
              <>
              <p>{userName}</p>


                <div className="container-sm mx-auto bg-white p-8 rounded-2xl shadow-lg mb-10 mt-20 flex">
                  <div className="flex-1">
                    <h1 className="graph-title">Stock Price</h1>
                    <br />
                    {/* {error && <div>Error: {error}</div>} */}
                    <div className="mr-20" style={{ width: "1200", height: "900" }}>
                      <canvas ref={stockChartRef} width="1500" height="1000"></canvas>
                    </div>
                  </div>
                  <div className="">
                    {stockInfo && (
                      <>
                        <div className="max-w-s bg-white p-8 rounded-md shadow-md mt-40">
                          <p className="text-lg">{stockInfo.symbol}    - ₹{stockCurrent}</p>
                          <p className="text-lg" style={getPercentageChangeStyle(stockPercentageChange)}>({stockPercentageChange}%)</p>
                        </div>
                        <div className="max-w-s bg-white p-8 rounded-md shadow-md mb-10 mt-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="font-bold">Company Name:</div>
                            <div>{stockInfo.company_name}</div>
                            <div className="font-bold">Closing Price:</div>
                            <div>{stockInfo.closing_price}</div>
                            <div className="font-bold">Market Cap:</div>
                            <div>{stockInfo.market_cap}</div>
                            <div className="font-bold">Volume:</div>
                            <div>{stockInfo.volume}</div>
                            <div className="font-bold">Average Volume:</div>
                            <div>{stockInfo.average_volume}</div>
                            <div className="font-bold">Profit Margin:</div>
                            <div>{stockInfo.profit_margin}</div>
                            <div className="font-bold">EBITDA:</div>
                            <div>{stockInfo.EBITDA}</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="container-sm mx-auto bg-white p-8 rounded-2xl shadow-lg mb-10 mt-20 flex">
                  <div className="flex-1">
                    {predictionImage && (
                      <>
                        <h2 className="graph-title">Predictions</h2>
                        <img className="mx-auto" src={predictionImage} alt="Prediction Graph" />

                      </>
                    )}
                  </div>
                </div>



                <div className="container-sm mx-auto bg-white p-8 rounded-2xl shadow-lg mb-10 mt-20 flex">
                  <div className="flex-1">
                    <h2 className="graph-title mb-10">Daily Return Histogram</h2>
                    <div className="mr-20" style={{ width: "600", height: "400" }}>
                      <canvas ref={dailyReturnChartRef} width="400" height="200"></canvas>
                    </div>
                  </div>
                </div>

                
              </>
            )}
          </div>
        );
      case 'portfolio':
        return (
          <div>
            <PortfolioForm onStockAdd={handlePortfolioAdd} />
            <PortfolioTable stocks={portfolio} onStockRemove={handleStockRemove} />
          </div>
        );
      default:
        return <StockInputPage onSubmit={handleStockSubmit} />;
    }
  };

  return (
    <div className="App">
      <Navbar userData={userData} onLogout={handleLogout} transparent onHome={() => setCurrentPage('home')} onPredictor={() => setCurrentPage('predictor')} onPortfolio={() => setCurrentPage('portfolio')} onLogin={() => setCurrentPage('login')} />
      {renderPage()}
    </div>
  );
}

export default App;
