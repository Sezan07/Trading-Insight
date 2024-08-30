import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-plugin-zoom';
import btclogo from './logo/Bitcoin-Logo.png';
import etlogo from './logo/Ethereum_logo_2014.svg.png';
import tetlogo from './logo/tether-usdt-logo.png';
import bnblogo from './logo/bnb-bnb-logo.png';
import slnlogo from './logo/Solana_logo.png';

function Crypto() {
    const a=83.4;

  const [stockName, setStockName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const stockChartRef1 = useRef(null);
  const stockChartRef2 = useRef(null);
  const stockChartRef3 = useRef(null);
  const stockChartRef4 = useRef(null);
  const stockChartRef5 = useRef(null);
  const stockChartRef6 = useRef(null);

  const [bitcoinPercentageChange, setbitcoinPercentageChange] = useState('');
  const [bitcoinCurrent, setbitcoinCurrent] = useState('');

  const [EthereumPercentageChange, setEthereumPercentageChange] = useState('');
  const [EthereumCurrent, setEthereumCurrent] = useState('');

  const [TetherPercentageChange, setTetherPercentageChange] = useState('');
  const [TetherCurrent, setTetherCurrent] = useState('');

  const [BNBPercentageChange, setBNBPercentageChange] = useState('');
  const [BNBCurrent, setBNBCurrent] = useState('');

  const [SolanaPercentageChange, setSolanaPercentageChange] = useState('');
  const [SolanaCurrent, setSolanaCurrent] = useState('');
  
  const [banexPercentageChange, setbanexPercentageChange] = useState('');
  const [banexCurrent, setbanexCurrent] = useState('');
  

  

  useEffect(() => {
    const fetchDataAndRenderCharts = async () => {
      try {
    

        const bitcoinResponse = await fetch(`http://127.0.0.1:5000/stock_d?stock_name=${'BTC-USD'}`);
        const bitcoinData = await bitcoinResponse.json();

        if (!bitcoinResponse.ok) {
          throw new Error('Failed to fetch stock data');
        }
        // Fetching data for Bank Nifty
      const EthereumResponse = await fetch(`http://127.0.0.1:5000/stock_d?stock_name=${'ETH-USD'}`);
      const EthereumData = await EthereumResponse.json();

      if (!EthereumResponse.ok) {
        throw new Error('Failed to fetch Bank Nifty data');
      }

      // Fetching data for Tether
      const TetherResponse = await fetch(`http://127.0.0.1:5000/stock_d?stock_name=${'USDT-USD'}`);
      const TetherData = await TetherResponse.json();

      if (!TetherResponse.ok) {
        throw new Error('Failed to fetch Tether data');
      }

      // Fetching data for Gold
      const BNBResponse = await fetch(`http://127.0.0.1:5000/stock_d?stock_name=${'BNB-USD'}`);
      const BNBData = await BNBResponse.json();

      if (!BNBResponse.ok) {
        throw new Error('Failed to fetch Gold data');
      }

      // Fetching data for Midcap Nifty
      const SolanaResponse = await fetch(`http://127.0.0.1:5000/stock_d?stock_name=${'SOL-USD'}`);
      const SolanaData = await SolanaResponse.json();

      if (!SolanaResponse.ok) {
        throw new Error('Failed to fetch Midcap Nifty data');
      }

      // Fetching data for Banex
      const banexResponse = await fetch(`http://127.0.0.1:5000/stock_d?stock_name=${'INR=X'}`);
      const banexData = await banexResponse.json();

      if (!banexResponse.ok) {
        throw new Error('Failed to fetch Banex data');
      }

      
      const bitcoinPercentageChangeResponse = await fetch(`http://127.0.0.1:5000/stock_pc?stock_name=${'BTC-USD'}`);
      const bitcoinPercentageChangeData = await bitcoinPercentageChangeResponse.json();
      setbitcoinPercentageChange(bitcoinPercentageChangeData.percentage_change.toFixed(2)); // Rounding to 2 decimal places
        
      const bitcoinCurrentResponse = await fetch(`http://127.0.0.1:5000/current_p?stock_name=${'BTC-USD'}`);
      const bitcoinCurrentData = await bitcoinCurrentResponse.json();
      setbitcoinCurrent((bitcoinCurrentData.current_price*a).toFixed(2));

      const EthereumPercentageChangeResponse = await fetch(`http://127.0.0.1:5000/stock_pc?stock_name=${'ETH-USD'}`);
      const EthereumPercentageChangeData = await EthereumPercentageChangeResponse.json();
      setEthereumPercentageChange(EthereumPercentageChangeData.percentage_change.toFixed(2)); // Rounding to 2 decimal places
        
      const EthereumCurrentResponse = await fetch(`http://127.0.0.1:5000/current_p?stock_name=${'ETH-USD'}`);
      const EthereumCurrentData = await EthereumCurrentResponse.json();
      setEthereumCurrent((EthereumCurrentData.current_price*a).toFixed(2));


      const TetherPercentageChangeResponse = await fetch(`http://127.0.0.1:5000/stock_pc?stock_name=${'USDT-USD'}`);
      const TetherPercentageChangeData = await TetherPercentageChangeResponse.json();
      setTetherPercentageChange(TetherPercentageChangeData.percentage_change.toFixed(2)); // Rounding to 2 decimal places
        
      const TetherCurrentResponse = await fetch(`http://127.0.0.1:5000/current_p?stock_name=${'USDT-USD'}`);
      const TetherCurrentData = await TetherCurrentResponse.json();
      setTetherCurrent((TetherCurrentData.current_price*a).toFixed(2));

      const BNBPercentageChangeResponse = await fetch(`http://127.0.0.1:5000/stock_pc?stock_name=${'BNB-USD'}`);
      const BNBPercentageChangeData = await BNBPercentageChangeResponse.json();
      setBNBPercentageChange(BNBPercentageChangeData.percentage_change.toFixed(2)); // Rounding to 2 decimal places
        
      const BNBCurrentResponse = await fetch(`http://127.0.0.1:5000/current_p?stock_name=${'BNB-USD'}`);
      const BNBCurrentData = await BNBCurrentResponse.json();
      setBNBCurrent((BNBCurrentData.current_price*a).toFixed(2));


      const SolanaPercentageChangeResponse = await fetch(`http://127.0.0.1:5000/stock_pc?stock_name=${'SOL-USD'}`);
      const SolanaPercentageChangeData = await SolanaPercentageChangeResponse.json();
      setSolanaPercentageChange(SolanaPercentageChangeData.percentage_change.toFixed(2)); // Rounding to 2 decimal places
        
      const SolanaCurrentResponse = await fetch(`http://127.0.0.1:5000/current_p?stock_name=${'SOL-USD'}`);
      const SolanaCurrentData = await SolanaCurrentResponse.json();
      setSolanaCurrent((SolanaCurrentData.current_price*a).toFixed(2));

      const banexPercentageChangeResponse = await fetch(`http://127.0.0.1:5000/stock_pc?stock_name=${'INR=X'}`);
      const banexPercentageChangeData = await banexPercentageChangeResponse.json();
      setbanexPercentageChange(banexPercentageChangeData.percentage_change.toFixed(2)); // Rounding to 2 decimal places
        
      const banexCurrentResponse = await fetch(`http://127.0.0.1:5000/current_p?stock_name=${'INR=X'}`);
      const banexCurrentData = await banexCurrentResponse.json();
      setbanexCurrent(banexCurrentData.current_price.toFixed(2));
      console.log(parseFloat(bitcoinPercentageChangeData.percentage_change));
    
    if (stockChartRef1.current) {
        const stockCtx = stockChartRef1.current.getContext('2d');
 new Chart(stockCtx, {
        type: 'line',
        data: {
            labels: bitcoinData.map(point => point.x),
            datasets: [{
                data: bitcoinData.map(point => point.y*a),
                borderColor: parseFloat(bitcoinPercentageChangeData.percentage_change) < 0 ? 'rgb(212, 25, 40)' : '#198639',
                backgroundColor: 'transparent', // Remove area fill
                tension: 0.2,
                fill: false,
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
                    zoomButton: {
                      enabled: false // Hide zoom buttons
                    },
                    drag: {
                      enabled: true,
                      threshold: 10 // Adjust the drag threshold if necessary
                    }
                  }
                }
              },
              scales: {
                x: {
                  display: false, // Hide x axis
                  grid: {
                    display: false,
                  },
                },
                y: {
                  display: false, // Hide y axis
                  grid: {
                    display: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
              },
              elements: {
                line: {
                  tension: 0.2,
                  fill: false, // Remove area chart fill
                  borderWidth: 2, // Adjust line width if necessary
                  borderColor: 'white', // Adjust line color if necessary
                  pointRadius: 0, // Remove data point markers
                },
              },
              interaction: {
                intersect: false,
              },
            }
          });

          if (stockChartRef2.current) {
            const stockCtx = stockChartRef2.current.getContext('2d');
            new Chart(stockCtx, {
              type: 'line',
              data: {
                labels: EthereumData.map(point => point.x),
                datasets: [{
                 // label: 'Stock Price',
                  data: EthereumData.map(point => point.y*a),
                  borderColor: EthereumPercentageChange.charAt(0) <=0 ? 'rgb(212, 25, 40)' : '#198639', // Change border color dynamically
                  backgroundColor: 'transparent', // Remove area fill
                  tension: 0.2,
                  fill: false,
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
                      zoomButton: {
                        enabled: false // Hide zoom buttons
                      },
                      drag: {
                        enabled: true,
                        threshold: 10 // Adjust the drag threshold if necessary
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    display: false, // Hide x axis
                    grid: {
                      display: false,
                    },
                  },
                  y: {
                    display: false, // Hide y axis
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    tension: 0.2,
                    fill: false, // Remove area chart fill
                    borderWidth: 2, // Adjust line width if necessary
                    borderColor: 'white', // Adjust line color if necessary
                    pointRadius: 0, // Remove data point markers
                  },
                },
                interaction: {
                  intersect: false,
                },
              }
            });

            if (stockChartRef3.current) {
              const stockCtx = stockChartRef3.current.getContext('2d');
              new Chart(stockCtx, {
                type: 'line',
                data: {
                  labels: TetherData.map(point => point.x),
                  datasets: [{
                   // label: 'Stock Price',
                    data: TetherData.map(point => point.y*a),
                    borderColor: TetherPercentageChange >= 0 ?  'rgb(212, 25, 40)': '#198639', // Change border color dynamically
                    backgroundColor: 'transparent', // Remove area fill
                    tension: 0.2,
                    fill: false,
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
                        zoomButton: {
                          enabled: false // Hide zoom buttons
                        },
                        drag: {
                          enabled: true,
                          threshold: 10 // Adjust the drag threshold if necessary
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      display: false, // Hide x axis
                      grid: {
                        display: false,
                      },
                    },
                    y: {
                      display: false, // Hide y axis
                      grid: {
                        display: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                  elements: {
                    line: {
                      tension: 0.2,
                      fill: false, // Remove area chart fill
                      borderWidth: 2, // Adjust line width if necessary
                      borderColor: 'white', // Adjust line color if necessary
                      pointRadius: 0, // Remove data point markers
                    },
                  },
                  interaction: {
                    intersect: false,
                  },
                }
              });

              if (stockChartRef4.current) {
                const stockCtx = stockChartRef4.current.getContext('2d');
                new Chart(stockCtx, {
                  type: 'line',
                  data: {
                    labels: BNBData.map(point => point.x),
                    datasets: [{
                     // label: 'Stock Price',
                      data: BNBData.map(point => point.y*a),
                      borderColor: BNBPercentageChange>= 0 ? '#198639' : 'rgb(212, 25, 40)', // Change border color dynamically
                      backgroundColor: 'transparent', // Remove area fill
                      tension: 0.2,
                      fill: false,
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
                          zoomButton: {
                            enabled: false // Hide zoom buttons
                          },
                          drag: {
                            enabled: true,
                            threshold: 10 // Adjust the drag threshold if necessary
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        display: false, // Hide x axis
                        grid: {
                          display: false,
                        },
                      },
                      y: {
                        display: false, // Hide y axis
                        grid: {
                          display: false,
                        },
                        ticks: {
                          display: false,
                        },
                      },
                    },
                    elements: {
                      line: {
                        tension: 0.2,
                        fill: false, // Remove area chart fill
                        borderWidth: 2, // Adjust line width if necessary
                        borderColor: 'white', // Adjust line color if necessary
                        pointRadius: 0, // Remove data point markers
                      },
                    },
                    interaction: {
                      intersect: false,
                    },
                  }
                });

                if (stockChartRef5.current) {
                  const stockCtx = stockChartRef5.current.getContext('2d');
                  new Chart(stockCtx, {
                    type: 'line',
                    data: {
                      labels: SolanaData.map(point => point.x),
                      datasets: [{
                       // label: 'Stock Price',
                        data: SolanaData.map(point => point.y*a),
                        borderColor: SolanaPercentageChange <=0 ? 'rgb(212, 25, 40)' : '#198639', // Change border color dynamically
                        backgroundColor: 'transparent', // Remove area fill
                        tension: 0.2,
                        fill: false,
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
                            zoomButton: {
                              enabled: false // Hide zoom buttons
                            },
                            drag: {
                              enabled: true,
                              threshold: 10 // Adjust the drag threshold if necessary
                            }
                          }
                        }
                      },
                      scales: {
                        x: {
                          display: false, // Hide x axis
                          grid: {
                            display: false,
                          },
                        },
                        y: {
                          display: false, // Hide y axis
                          grid: {
                            display: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      },
                      elements: {
                        line: {
                          tension: 0.2,
                          fill: false, // Remove area chart fill
                          borderWidth: 2, // Adjust line width if necessary
                          borderColor: 'white', // Adjust line color if necessary
                          pointRadius: 0, // Remove data point markers
                        },
                      },
                      interaction: {
                        intersect: false,
                      },
                    }
                  });
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
  
    };
    fetchDataAndRenderCharts();
  }, [submitted]); // Include submitted in the dependency array

  // Conditional styling for positive and negative percentage change
  const getPercentageChangeStyle = (percentageChange) => {
    return {
      color: percentageChange >= 0 ? '#198639' : 'rgb(212, 25, 40)'
    };
  };
  

  return (
    <div>
      <h2 className="text-xl font-bold mb-5">CRYPTOCURRENCIES</h2>
      <div className="flex items-center mb-3 ml-2">
        <div className="mr-20 ml-5">
          <p className="text-lg"><img className="h-8 w-auto" src={btclogo} alt="Logo"/>BITCOIN</p>
        </div>
        <div className="flex-20"></div> {/* Add flexible space */}
        <div className="w-60 h-24 mr-20 ">
          <canvas ref={stockChartRef1}></canvas>
        </div>
        <div className="flex-20"></div> {/* Add flexible space */}
        <div className="mr-2">
          <p className="text-lg">{bitcoinCurrent}</p>
          <p className="text-lg" style={getPercentageChangeStyle(bitcoinPercentageChange)}>({bitcoinPercentageChange}%)</p>
        </div>
      </div>
      <hr className="my-2 border-t border-gray-300" />
      <div className="flex items-center mb-3 mt-3 ">
        <div className="mr-20 ml-5">
        <img className="h-8 w-auto itms-center ml-6" src={etlogo} alt="Logo"/>
          <p className="text-lg">Ethereum</p>
        </div>
        <div className="w-60 h-24 mr-10">
          <canvas ref={stockChartRef2}></canvas>
        </div>
        <div className="ml-10">
          <p className="text-lg">{EthereumCurrent}</p>
          <p className="text-lg" style={getPercentageChangeStyle(EthereumPercentageChange)}>({EthereumPercentageChange}%)</p>
        </div>
      </div>
  
      <hr className="my-2 border-t border-gray-300" />
      <div className="flex items-center mb-3 mt-3 ml-3">
        <div className="mr-20 ml-5">
        <img className="h-8 w-auto itms-center ml-2" src={tetlogo} alt="Logo"/>
          <p className="text-lg">Tether</p>
        </div>
        <div className="w-60 h-24 mr-20 ml-4">
          <canvas ref={stockChartRef3}></canvas>
        </div>
        <div className="mr-5">
          <p className="text-lg">{TetherCurrent}</p>
          <p className="text-lg" style={getPercentageChangeStyle(TetherPercentageChange)}>({TetherPercentageChange}%)</p>
        </div>
      </div>
      <hr className="my-2 border-t border-gray-300" />
      {/* <div className="flex items-center mb-10">
        <div className="mr-20 ml-5">
          <p className="text-lg">USD/INR</p>
        </div>
        <div className="w-60 h-24 mr-20 ml-6">
          <canvas ref={stockChartRef6}></canvas>
        </div>
        <div className="mr-2">
          <p className="text-lg">{banexCurrent}</p>
          <p className="text-lg" style={getPercentageChangeStyle(banexPercentageChange)}>({banexPercentageChange}%)</p>
        </div>
      </div> */}
  
      <div className="flex items-center mb-3 mt-3 ml-4">
        <div className="mr-20 ml-5">
        <img className="h-8 w-auto itms-center " src={bnblogo} alt="Logo"/>
          <p className="text-lg">BNB</p>
        </div>
        <div className="w-60 h-24 mr-20 ml-6">
          <canvas ref={stockChartRef4}></canvas>
        </div>
        <div className="mr-6">
          <p className="text-lg">{BNBCurrent}</p>
          <p className="text-lg" style={getPercentageChangeStyle(BNBPercentageChange)}>({BNBPercentageChange}%)</p>
        </div>
      </div>
  
      <hr className="my-2 border-t border-gray-300" />
      <div className="flex items-center mb-3 mt-3">
        <div className="mr-20 ml-5">
        <img className="h-8 w-auto itms-center ml-4" src={slnlogo} alt="Logo"/>
          <p className="text-lg">SOLANA</p>
        </div>
        <div className="w-60 h-24 mr-20 ">
          <canvas ref={stockChartRef5}></canvas>
        </div>
        <div className="mr-2">
          <p className="text-lg">{SolanaCurrent}</p>
          <p className="text-lg" style={getPercentageChangeStyle(SolanaPercentageChange)}>({SolanaPercentageChange}%)</p>
        </div>
      </div>
    </div>
  );
  
}

export default Crypto;
