import React, { useState, useEffect } from 'react';
import './BondMarket.css'
const BondMarketData = () => {
  const [marketData, setMarketData] = useState({
    twoYear: null,
    fiveYear: null,
    tenYear: null,
  });
  const [actions, setActions] = useState({
    twoYear: null,
    fiveYear: null,
    tenYear: null,
  });

  // Fetch 2-year Treasury data
  useEffect(() => {
    fetch('https://api.stlouisfed.org/fred/series/observations?series_id=DGS2&api_key=YOUR_FRED_API_KEY&file_type=json')
      .then(response => response.json())
      .then(data => {
        const latestData = data.observations[data.observations.length - 1];
        setMarketData(prevData => ({ ...prevData, twoYear: latestData }));
        sendMarketDataToModel(latestData, 'twoYear');
      })
      .catch(error => console.error('Error fetching 2-year market data:', error));
  }, []);

  // Fetch 5-year Treasury data
  useEffect(() => {
    fetch('https://api.stlouisfed.org/fred/series/observations?series_id=DGS5&api_key=YOUR_FRED_API_KEY&file_type=json')
      .then(response => response.json())
      .then(data => {
        const latestData = data.observations[data.observations.length - 1];
        setMarketData(prevData => ({ ...prevData, fiveYear: latestData }));
        sendMarketDataToModel(latestData, 'fiveYear');
      })
      .catch(error => console.error('Error fetching 5-year market data:', error));
  }, []);

  // Fetch 10-year Treasury data
  useEffect(() => {
    fetch('https://api.stlouisfed.org/fred/series/observations?series_id=DGS10&api_key=YOUR_FRED_API_KEY&file_type=json')
      .then(response => response.json())
      .then(data => {
        const latestData = data.observations[data.observations.length - 1];
        setMarketData(prevData => ({ ...prevData, tenYear: latestData }));
        sendMarketDataToModel(latestData, 'tenYear');
      })
      .catch(error => console.error('Error fetching 10-year market data:', error));
  }, []);

  const sendMarketDataToModel = (data, bondType) => {
    const dataToSend = {
      bond_type: bondType, // Send the bond type as part of the data
      cash_balance: 10000, // Example cash balance, adjust as needed
      bonds_owned: 0, // Example bonds owned, adjust as needed
      price: parseFloat(data.value), // Latest bond yield
      yield: parseFloat(data.value), // Assuming yield as bond value
      coupon_rate: 0.03, // Example coupon rate, adjust as needed
    };
  
    // Send the data to the Flask API
    fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    })
      .then(response => response.json())
      .then(result => {
        setActions(prevActions => ({ ...prevActions, [bondType]: result.action })); // Set action based on bond type
      })
      .catch(error => console.error('Error sending data to model:', error));
  };
  

  return (
    <div>
      <h1>Bond Market Data</h1>
      <div className="bond-container">
        {marketData.twoYear && (
          <div className="bond-card">
            <h2>2-Year Treasury Yield</h2>
            <p>Latest Yield: {marketData.twoYear.value}%</p>
            <p>Recommended Action: {actions.twoYear}</p>
          </div>
        )}
        {marketData.fiveYear && (
          <div className="bond-card">
            <h2>5-Year Treasury Yield</h2>
            <p>Latest Yield: {marketData.fiveYear.value}%</p>
            <p>Recommended Action: {actions.fiveYear}</p>
          </div>
        )}
        {marketData.tenYear && (
          <div className="bond-card">
            <h2>10-Year Treasury Yield</h2>
            <p>Latest Yield: {marketData.tenYear.value}%</p>
            <p>Recommended Action: {actions.tenYear}</p>
          </div>
        )}
      </div>
      {(!marketData.twoYear || !marketData.fiveYear || !marketData.tenYear) && <p>Loading market data...</p>}
    </div>
  );
  
};

export default BondMarketData;
