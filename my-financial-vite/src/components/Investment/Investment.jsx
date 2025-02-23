import React from 'react';
import './Investment.css';
import StockMarketData from './StockMarket'
import CurrencyExchangeData from './Currency'
import BondMarketData from './BondMarket'

function Investment() {
    return (
        <div className = "investment-container">
            <CurrencyExchangeData/>
            <BondMarketData/>
            <StockMarketData/>
        </div>
    )
}

export default Investment;