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

  const API_KEY_FRED = '2a894c54f8a4e85b549ff9a69d722528';  // Replace with your actual FRED API key
const FRED_BASE_URL = 'https://cors-anywhere.herokuapp.com/https://api.stlouisfed.org/fred/series/observations';

const fetchExchangeData = (currency) => {
  let seriesId;

  // Map currency pair to FRED series ID
  if (currency === 'EUR_USD') {
    seriesId = 'DEXUSEU';  // EUR/USD FRED series ID
  } else if (currency === 'JPY_USD') {
    seriesId = 'DEXJPUS';  // JPY/USD FRED series ID
  } else if (currency === 'AUD_USD') {
    seriesId = 'DEXUSAL';  // AUD/USD FRED series ID
  } else {
    console.error('Invalid currency pair');
    return;
  }

  const url = `${FRED_BASE_URL}?series_id=${seriesId}&api_key=${API_KEY_FRED}&file_type=json`;

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      const latestData = data.observations[data.observations.length - 1];  // Get the most recent data
      return {
        currencyPair: currency,
        exchangeRate: latestData.value,
        date: latestData.date,
      };
    })
    .catch(error => {
      console.error(`Error fetching data for ${currency}:`, error);
      return null;
    });
};

// Fetch EUR/USD data
useEffect(() => {
  fetchExchangeData('EUR_USD')
    .then(data => {
      if (data) {
        setMarketData(prevData => ({ ...prevData, eurUsd: data }));
        sendMarketDataToModel(data, 'eurUsd');
      }
    })
    .catch(error => console.error('Error fetching EUR/USD data:', error));
}, []);

// Fetch JPY/USD data
useEffect(() => {
  fetchExchangeData('JPY_USD')
    .then(data => {
      if (data) {
        setMarketData(prevData => ({ ...prevData, jpyUsd: data }));
        sendMarketDataToModel(data, 'jpyUsd');
      }
    })
    .catch(error => console.error('Error fetching JPY/USD data:', error));
}, []);

// Fetch AUD/USD data
useEffect(() => {
  fetchExchangeData('AUD_USD')
    .then(data => {
      if (data) {
        setMarketData(prevData => ({ ...prevData, audUsd: data }));
        sendMarketDataToModel(data, 'audUsd');
      }
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
    fetch('http://localhost:5000/predict_exchange', {
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
