import React, { useState, useEffect } from 'react';
import './Currency.css'
const CurrencyExchangeData = () => {
  const [marketData, setMarketData] = useState({
    eurUsd: null,
    jpyUsd: null,
    audUsd: null,
  });
  const [actions, setActions] = useState({
    eurUsd: null,
    jpyUsd: null,
    audUsd: null,
  });

  // Fetch EUR/USD data
  useEffect(() => {
    fetch('http://localhost:5000/getExchangeData?currency=EUR_USD') // Backend API endpoint for EUR/USD
      .then(response => response.json())
      .then(data => {
        setMarketData(prevData => ({ ...prevData, eurUsd: data }));
        sendMarketDataToModel(data, 'eurUsd');
      })
      .catch(error => console.error('Error fetching EUR/USD data:', error));
  }, []);

  // Fetch JPY/USD data
  useEffect(() => {
    fetch('http://localhost:5000/getExchangeData?currency=JPY_USD') // Backend API endpoint for JPY/USD
      .then(response => response.json())
      .then(data => {
        setMarketData(prevData => ({ ...prevData, jpyUsd: data }));
        sendMarketDataToModel(data, 'jpyUsd');
      })
      .catch(error => console.error('Error fetching JPY/USD data:', error));
  }, []);

  // Fetch AUD/USD data
  useEffect(() => {
    fetch('http://localhost:5000/getExchangeData?currency=AUD_USD') // Backend API endpoint for AUD/USD
      .then(response => response.json())
      .then(data => {
        setMarketData(prevData => ({ ...prevData, audUsd: data }));
        sendMarketDataToModel(data, 'audUsd');
      })
      .catch(error => console.error('Error fetching AUD/USD data:', error));
  }, []);

  const sendMarketDataToModel = (data, currencyPair) => {
    const dataToSend = {
      cash_balance: 10000, // Example cash balance
      currency_owned: 0, // Example currency owned
      price: parseFloat(data.exchangeRate), // Latest exchange rate
      yield: parseFloat(data.exchangeRate), // Assuming yield as exchange rate for simplicity
      coupon_rate: 0.03, // Example coupon rate, adjust as needed
    };

    // Send the data to the backend for prediction
    fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    })
      .then(response => response.json())
      .then(result => {
        setActions(prevActions => ({ ...prevActions, [currencyPair]: result.action })); // Set action based on currency pair
      })
      .catch(error => console.error('Error sending data to model:', error));
  };

  return (
    <div>
      <h1>Currency Exchange Data</h1>
      <div className="currency-container">
        {marketData.eurUsd && (
          <div className="currency-card">
            <h2>EUR/USD Exchange Rate</h2>
            <p>Latest Rate: {marketData.eurUsd.exchangeRate}</p>
            <p>Recommended Action: {actions.eurUsd}</p>
          </div>
        )}
        {marketData.jpyUsd && (
          <div className="currency-card">
            <h2>JPY/USD Exchange Rate</h2>
            <p>Latest Rate: {marketData.jpyUsd.exchangeRate}</p>
            <p>Recommended Action: {actions.jpyUsd}</p>
          </div>
        )}
        {marketData.audUsd && (
          <div className="currency-card">
            <h2>AUD/USD Exchange Rate</h2>
            <p>Latest Rate: {marketData.audUsd.exchangeRate}</p>
            <p>Recommended Action: {actions.audUsd}</p>
          </div>
        )}
      </div>
      {(!marketData.eurUsd || !marketData.jpyUsd || !marketData.audUsd) && <p>Loading market data...</p>}
    </div>
  );
};

export default CurrencyExchangeData;
