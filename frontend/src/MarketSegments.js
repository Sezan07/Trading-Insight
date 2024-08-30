import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-plugin-zoom';


function MarketSegments() {

    const [activeSection, setActiveSection] = useState("Market and Segments");
  
    const handleButtonClick = (section) => {
      setActiveSection(section);
    };

  const [stockName, setStockName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const stockChartRef1 = useRef(null);
  const stockChartRef2 = useRef(null);
  const stockChartRef3 = useRef(null);
  const stockChartRef4 = useRef(null);
  const stockChartRef5 = useRef(null);
  const stockChartRef6 = useRef(null);

  const [nifty50PercentageChange, setNifty50PercentageChange] = useState('');
  const [nifty50Current, setNifty50Current] = useState('');

  const [bankNiftyPercentageChange, setbankNiftyPercentageChange] = useState('');
  const [bankNiftyCurrent, setbankNiftyCurrent] = useState('');

  const [sensexPercentageChange, setsensexPercentageChange] = useState('');
  const [sensexCurrent, setsensexCurrent] = useState('');

  const [finniftyPercentageChange, setfinniftyPercentageChange] = useState('');
  const [finniftyCurrent, setfinniftyCurrent] = useState('');

  const [niftyitPercentageChange, setniftyitPercentageChange] = useState('');
  const [niftyitCurrent, setniftyitCurrent] = useState('');
  
  const [banexPercentageChange, setbanexPercentageChange] = useState('');
  const [banexCurrent, setbanexCurrent] = useState('');
  



  useEffect(() => {
    const fetchDataAndRenderCharts = async () => {
      try {

        // Fetching stock data and setting up chart
       
        const nifty50Response = await fetch(`http://127.0.0.1:5000/stock_d?stock_name=${'^NSEI'}`);
        const nifty50Data = await nifty50Response.json();

        if (!nifty50Response.ok) {
          throw new Error('Failed to fetch stock data');
        }
        // Fetching data for Bank Nifty
      const bankNiftyResponse = await fetch(`http://127.0.0.1:5000/stock_d?stock_name=${'^NSEBANK'}`);
      const bankNiftyData = await bankNiftyResponse.json();

      if (!bankNiftyResponse.ok) {
        throw new Error('Failed to fetch Bank Nifty data');
      }

      // Fetching data for Sensex
      const sensexResponse = await fetch(`http://127.0.0.1:5000/stock_d?stock_name=${'^BSESN'}`);
      const sensexData = await sensexResponse.json();

      if (!sensexResponse.ok) {
        throw new Error('Failed to fetch Sensex data');
      }

      // Fetching data for Gold
      const finniftyResponse = await fetch(`http://127.0.0.1:5000/stock_d?stock_name=${'NIFTY_FIN_SERVICE.NS'}`);
      const finniftyData = await finniftyResponse.json();

      if (!finniftyResponse.ok) {
        throw new Error('Failed to fetch Gold data');
      }

      // Fetching data for Midcap Nifty
      const niftyitResponse = await fetch(`http://127.0.0.1:5000/stock_d?stock_name=${'^CNXIT'}`);
      const niftyitData = await niftyitResponse.json();

      if (!niftyitResponse.ok) {
        throw new Error('Failed to fetch Midcap Nifty data');
      }

      // Fetching data for Banex
      const banexResponse = await fetch(`http://127.0.0.1:5000/stock_d?stock_name=${'INR=X'}`);
      const banexData = await banexResponse.json();

      if (!banexResponse.ok) {
        throw new Error('Failed to fetch Banex data');
      }


      const nifty50PercentageChangeResponse = await fetch(`http://127.0.0.1:5000/stock_pc?stock_name=${'^NSEI'}`);
      const nifty50PercentageChangeData = await nifty50PercentageChangeResponse.json();
      setNifty50PercentageChange(nifty50PercentageChangeData.percentage_change.toFixed(2)); // Rounding to 2 decimal places
        
      const nifty50CurrentResponse = await fetch(`http://127.0.0.1:5000/current_p?stock_name=${'^NSEI'}`);
      const nifty50CurrentData = await nifty50CurrentResponse.json();
      setNifty50Current(nifty50CurrentData.current_price.toFixed(2));
      

      const bankniftyPercentageChangeResponse = await fetch(`http://127.0.0.1:5000/stock_pc?stock_name=${'^NSEBANK'}`);
      const bankniftyPercentageChangeData = await bankniftyPercentageChangeResponse.json();
      setbankNiftyPercentageChange(bankniftyPercentageChangeData.percentage_change.toFixed(2)); // Rounding to 2 decimal places
        
      const bankniftyCurrentResponse = await fetch(`http://127.0.0.1:5000/current_p?stock_name=${'^NSEBANK'}`);
      const bankniftyCurrentData = await bankniftyCurrentResponse.json();
      setbankNiftyCurrent(bankniftyCurrentData.current_price.toFixed(2));


      const sensexPercentageChangeResponse = await fetch(`http://127.0.0.1:5000/stock_pc?stock_name=${'^BSESN'}`);
      const sensexPercentageChangeData = await sensexPercentageChangeResponse.json();
      setsensexPercentageChange(sensexPercentageChangeData.percentage_change.toFixed(2)); // Rounding to 2 decimal places
        
      const sensexCurrentResponse = await fetch(`http://127.0.0.1:5000/current_p?stock_name=${'^BSESN'}`);
      const sensexCurrentData = await sensexCurrentResponse.json();
      setsensexCurrent(sensexCurrentData.current_price.toFixed(2));

      const finniftyPercentageChangeResponse = await fetch(`http://127.0.0.1:5000/stock_pc?stock_name=${'NIFTY_FIN_SERVICE.NS'}`);
      const finniftyPercentageChangeData = await finniftyPercentageChangeResponse.json();
      setfinniftyPercentageChange(finniftyPercentageChangeData.percentage_change.toFixed(2)); // Rounding to 2 decimal places
        
      const finniftyCurrentResponse = await fetch(`http://127.0.0.1:5000/current_p?stock_name=${'NIFTY_FIN_SERVICE.NS'}`);
      const finniftyCurrentData = await finniftyCurrentResponse.json();
      setfinniftyCurrent(finniftyCurrentData.current_price.toFixed(2));


      const niftyitPercentageChangeResponse = await fetch(`http://127.0.0.1:5000/stock_pc?stock_name=${'^CNXIT'}`);
      const niftyitPercentageChangeData = await niftyitPercentageChangeResponse.json();
      setniftyitPercentageChange(niftyitPercentageChangeData.percentage_change.toFixed(2)); // Rounding to 2 decimal places
        
      const niftyitCurrentResponse = await fetch(`http://127.0.0.1:5000/current_p?stock_name=${'^CNXIT'}`);
      const niftyitCurrentData = await niftyitCurrentResponse.json();
      setniftyitCurrent(niftyitCurrentData.current_price.toFixed(2));

      const banexPercentageChangeResponse = await fetch(`http://127.0.0.1:5000/stock_pc?stock_name=${'INR=X'}`);
      const banexPercentageChangeData = await banexPercentageChangeResponse.json();
      setbanexPercentageChange(banexPercentageChangeData.percentage_change.toFixed(2)); // Rounding to 2 decimal places
        
      const banexCurrentResponse = await fetch(`http://127.0.0.1:5000/current_p?stock_name=${'INR=X'}`);
      const banexCurrentData = await banexCurrentResponse.json();
      setbanexCurrent(banexCurrentData.current_price.toFixed(2));


      
        if (stockChartRef1.current) {
          const stockCtx = stockChartRef1.current.getContext('2d');
    new Chart(stockCtx, {
        type: 'line',
        data: {
            labels: nifty50Data.map(point => point.x),
            datasets: [{
                data: nifty50Data.map(point => point.y),
                borderColor: nifty50PercentageChange >= 0 ? '#198639' : 'rgb(212, 25, 40)', // Change border color dynamically
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
                labels: bankNiftyData.map(point => point.x),
                datasets: [{
                 // label: 'Stock Price',
                  data: bankNiftyData.map(point => point.y),
                  borderColor: bankNiftyPercentageChange >= 0 ? '#198639' : 'rgb(212, 25, 40)', // Change border color dynamically
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
                  labels: sensexData.map(point => point.x),
                  datasets: [{
                   // label: 'Stock Price',
                    data: sensexData.map(point => point.y),
                    borderColor: sensexPercentageChange >= 0 ? '#198639' : 'rgb(212, 25, 40)', // Change border color dynamically
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
                    labels: finniftyData.map(point => point.x),
                    datasets: [{
                     // label: 'Stock Price',
                      data: finniftyData.map(point => point.y),
                      borderColor: finniftyPercentageChange>= 0 ? '#198639' : 'rgb(212, 25, 40)', // Change border color dynamically
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
                      labels: niftyitData.map(point => point.x),
                      datasets: [{
                       // label: 'Stock Price',
                        data: niftyitData.map(point => point.y),
                        borderColor: niftyitPercentageChange <=0 ? 'rgb(212, 25, 40)' : '#198639', // Change border color dynamically
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

                  if (stockChartRef6.current) {
                    const stockCtx = stockChartRef6.current.getContext('2d');
                    new Chart(stockCtx, {
                      type: 'line',
                      data: {
                        labels: banexData.map(point => point.x),
                        datasets: [{
                         // label: 'Stock Price',
                          data: banexData.map(point => point.y),
                          borderColor: banexPercentageChange >= 0 ?  'rgb(212, 25, 40)': '#198639', // Change border color dynamically
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
      <h2 className="text-xl font-bold mb-5">Market and Sectors</h2>
      <div className="flex items-center mb-10">
        <div className="mr-20 ml-5">
          <p className="text-lg">NIFTY 50</p>
        </div>
        <div className="flex-20"></div> {/* Add flexible space */}
        <div className="w-60 h-24 mr-20 ml-5">
          <canvas ref={stockChartRef1}></canvas>
        </div>
        <div className="flex-20"></div> {/* Add flexible space */}
        <div className="mr-2">
          <p className="text-lg">{nifty50Current}</p>
          <p className="text-lg" style={getPercentageChangeStyle(nifty50PercentageChange)}>({nifty50PercentageChange}%)</p>
        </div>
      </div>
  
      <div className="flex items-center mb-10">
        <div className="mr-20 ml-5">
          <p className="text-lg">BANKNIFTY</p>
        </div>
        <div className="w-60 h-24 mr-10">
          <canvas ref={stockChartRef2}></canvas>
        </div>
        <div className="ml-9">
          <p className="text-lg">{bankNiftyCurrent}</p>
          <p className="text-lg" style={getPercentageChangeStyle(bankNiftyPercentageChange)}>({bankNiftyPercentageChange}%)</p>
        </div>
      </div>
  
      <div className="flex items-center mb-10">
        <div className="mr-20 ml-5">
          <p className="text-lg">SENSEX</p>
        </div>
        <div className="w-60 h-24 mr-20 ml-6">
          <canvas ref={stockChartRef3}></canvas>
        </div>
        <div className="mr-2">
          <p className="text-lg">{sensexCurrent}</p>
          <p className="text-lg" style={getPercentageChangeStyle(sensexPercentageChange)}>({sensexPercentageChange}%)</p>
        </div>
      </div>
  
      <div className="flex items-center mb-10">
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
      </div>
  
      <div className="flex items-center mb-10">
        <div className="mr-20 ml-5">
          <p className="text-lg">FINNIFTY</p>
        </div>
        <div className="w-60 h-24 mr-20 ml-6">
          <canvas ref={stockChartRef4}></canvas>
        </div>
        <div className="mr-6">
          <p className="text-lg">{finniftyCurrent}</p>
          <p className="text-lg" style={getPercentageChangeStyle(finniftyPercentageChange)}>({finniftyPercentageChange}%)</p>
        </div>
      </div>
  
      <div className="flex items-center mb-10">
        <div className="mr-20 ml-5">
          <p className="text-lg">NIFTY IT</p>
        </div>
        <div className="w-60 h-24 mr-20 ml-6">
          <canvas ref={stockChartRef5}></canvas>
        </div>
        <div className="mr-2">
          <p className="text-lg">{niftyitCurrent}</p>
          <p className="text-lg" style={getPercentageChangeStyle(niftyitPercentageChange)}>({niftyitPercentageChange}%)</p>
        </div>
      </div>
    </div>
  );
  
}

export default MarketSegments;
