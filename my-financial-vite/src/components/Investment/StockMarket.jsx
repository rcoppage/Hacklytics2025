import React, { useState, useEffect } from 'react';
import './StockMarket.css';

const StockMarketData = () => {
  const [nasdaqData, setNasdaqData] = useState(null);
  const [sp500Data, setSp500Data] = useState(null);
  const [nasdaqAction, setNasdaqAction] = useState(null);
  const [sp500Action, setSp500Action] = useState(null);

  // Fetch data for Nasdaq and S&P 500 when the component mounts
  useEffect(() => {
    // Fetch Nasdaq data
    fetch('https://cors-anywhere.herokuapp.com/https://api.stlouisfed.org/fred/series/observations?series_id=NASDAQCOM&api_key=e4cc6320f97f206a3ad166fbdab00b81&file_type=json')
      .then(response => response.json())
      .then(data => {
        const latestData = data.observations[data.observations.length - 1];
        setNasdaqData(latestData);
        sendMarketDataToModel(latestData, 'nasdaq');
      })
      .catch(error => console.error('Error fetching Nasdaq data:', error));

    // Fetch S&P 500 data
    fetch('https://cors-anywhere.herokuapp.com/https://api.stlouisfed.org/fred/series/observations?series_id=SP500&api_key=e4cc6320f97f206a3ad166fbdab00b81&file_type=json')
      .then(response => response.json())
      .then(data => {
        const latestData = data.observations[data.observations.length - 1];
        setSp500Data(latestData);
        sendMarketDataToModel(latestData, 'sp500');
      })
      .catch(error => console.error('Error fetching S&P 500 data:', error));
  }, []);

  const sendMarketDataToModel = (data, marketType) => {
    const dataToSend = {
      market_type: marketType,  // Send the market type (Nasdaq or S&P 500)
      price: parseFloat(data.value),  // Latest adjusted close value (price)
    };

    // Send data to the backend for either Nasdaq or S&P 500
    fetch('http://localhost:5000/predict_stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
      mode: 'cors',
    })
      .then(response => response.json())
      .then(result => {
        // Update the action for Nasdaq or S&P 500
        if (marketType === 'nasdaq') {
          setNasdaqAction(result.action);  // Set the action (Buy, Sell, Hold) from the model's output for Nasdaq
        } else if (marketType === 'sp500') {
          setSp500Action(result.action);  // Set the action for S&P 500
        }
      })
      .catch(error => console.error('Error sending data to model:', error));
  };

  return (
    <div>
      <h1>Stock Market Data</h1>

      {/* Nasdaq Data */}
      {nasdaqData ? (
        <div>
          <h2>Nasdaq</h2>
          <p>Latest Nasdaq Value: {nasdaqData.value}</p>
          <p>Recommended Action: {nasdaqAction}</p>
        </div>
      ) : (
        <p>Loading Nasdaq data...</p>
      )}

      {/* S&P 500 Data */}
      {sp500Data ? (
        <div>
          <h2>S&P 500</h2>
          <p>Latest S&P 500 Value: {sp500Data.value}</p>
          <p>Recommended Action: {sp500Action}</p>
        </div>
      ) : (
        <p>Loading S&P 500 data...</p>
      )}
    </div>
  );
};

export default StockMarketData;
