import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';


import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
    getDefaultTargetDate,
    generateChartData,
    formatDateForDisplay,
    getWeeklyContribution
} from './PlanningUtils';
import './Planning.css';

function Planning() {
    const [goalAmount, setGoalAmount] = useState(10000);
    const [targetDate, setTargetDate] = useState(getDefaultTargetDate());
    const [investmentType, setInvestmentType] = useState('savings');
    const [calculationType, setCalculationType] = useState('goal');
    const [currentSavings, setCurrentSavings] = useState(0);
    const [yearsToSave, setYearsToSave] = useState(1);
    const [customReturn, setCustomReturn] = useState('');
    const [contributionAmount, setContributionAmount] = useState(100);
    const [contributionFrequency, setContributionFrequency] = useState('weekly');
    const [chartData, setChartData] = useState([]);

    // Update target date when years to save changes
    useEffect(() => {
        const date = new Date();
        date.setFullYear(date.getFullYear() + yearsToSave);
        setTargetDate(date.toISOString().split('T')[0]);
    }, [yearsToSave]);

    useEffect(() => {
        const weeklyAmount = getWeeklyContribution(contributionAmount, contributionFrequency);
        const data = generateChartData(
            targetDate,
            calculationType,
            goalAmount,
            weeklyAmount,
            investmentType,
            customReturn,
            currentSavings,
            setContributionAmount
        );
        setChartData(data);
    }, [goalAmount, targetDate, investmentType, calculationType, contributionAmount, 
        contributionFrequency, currentSavings, customReturn]);

    // Helper function to handle input changes and remove leading zeros
    const handleInputChange = (setter) => (e) => {
        const value = e.target.value;
        if (value === "0") {
            setter(""); // Clear the input if the value is just "0"
        } else {
            setter(value); // Otherwise, set the value
        }
    };

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="planning-container">
            <div>
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            </div>
            <div className={`content ${sidebarOpen ?   'expand' : 'collapse'}`}>
                <h1 className="planning-title">Investment Calculator</h1>
                <div className="planning-card">
                    <div className="planning-grid">
                        <div className="top-section">
                            <div className="input-section">
                                <h3 className="section-title">Investment Settings</h3>
                                
                                <div className="input-group">
                                    <label htmlFor="currentSavings">How much do you have saved currently? ($)</label>
                                    <input
                                        id="currentSavings"
                                        type="number"
                                        value={currentSavings === 0 ? "" : currentSavings} // Show empty string if value is 0
                                        onChange={(e) => setCurrentSavings(Number(e.target.value))}
                                        min="0"
                                        className="form-input"
                                        placeholder="Enter current savings"
                                    />
                                </div>

                                <div className="input-group">
                                    <label htmlFor="yearsToSave">How many years will you save for?</label>
                                    <select
                                        id="yearsToSave"
                                        value={yearsToSave}
                                        onChange={(e) => setYearsToSave(Number(e.target.value))}
                                        className="form-input"
                                    >
                                        {[...Array(30)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1} {i === 0 ? 'year' : 'years'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="investmentType">What are you investing in?</label>
                                    <select
                                        id="investmentType"
                                        value={investmentType}
                                        onChange={(e) => {
                                            setInvestmentType(e.target.value);
                                            setCustomReturn('');
                                        }}
                                        className="form-input"
                                    >
                                        <option value="normal">Normal Savings (1% APY)</option>
                                        <option value="savings">High-Yield Savings (4% APY)</option>
                                        <option value="stocks">S&P 500 (10% avg. return)</option>
                                        <option value="custom">Custom Return Rate</option>
                                    </select>
                                    {investmentType === 'custom' && (
                                        <input
                                            type="number"
                                            value={customReturn === 0 ? "" : customReturn} // Show empty string if value is 0
                                            onChange={(e) => setCustomReturn(e.target.value)}
                                            placeholder="Enter return rate (%)"
                                            className="form-input mt-2"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="chart-section">
                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis 
                                                dataKey="date"
                                                tickFormatter={(date) => formatDateForDisplay(date)}
                                                ticks={chartData.filter(point => point.isMainPoint).map(point => point.date)}
                                            />
                                            <YAxis 
                                                tickFormatter={(value) => `${value.toLocaleString()}`}
                                            />
                                            <Tooltip 
                                                formatter={(value) => [`${value.toLocaleString()}`, 'Projected Value']}
                                                labelFormatter={(date) => formatDateForDisplay(date)}
                                            />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="value"
                                                name="Projected Value"
                                                stroke="#2563eb"
                                                strokeWidth={2}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="bottom-section">
                            <div className="contribution-section">
                                <h3 className="section-title">Contribution Settings</h3>
                                <div className="radio-group">
                                    <div className="radio-option">
                                        <input
                                            type="radio"
                                            id="goal"
                                            name="calculationType"
                                            value="goal"
                                            checked={calculationType === 'goal'}
                                            onChange={(e) => setCalculationType(e.target.value)}
                                        />
                                        <label htmlFor="goal">Calculate by Goal Amount</label>
                                    </div>
                                    <div className="radio-option">
                                        <input
                                            type="radio"
                                            id="contribution"
                                            name="calculationType"
                                            value="contribution"
                                            checked={calculationType === 'contribution'}
                                            onChange={(e) => setCalculationType(e.target.value)}
                                        />
                                        <label htmlFor="contribution">Calculate by Contribution</label>
                                    </div>
                                </div>

                                {calculationType === 'goal' ? (
                                    <div className="input-group">
                                        <label htmlFor="goalAmount">Goal Amount ($)</label>
                                        <input
                                            id="goalAmount"
                                            type="number"
                                            value={goalAmount === 0 ? "" : goalAmount} // Show empty string if value is 0
                                            onChange={(e) => setGoalAmount(Number(e.target.value))}
                                            min="0"
                                            className="form-input"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div className="input-group">
                                            <label htmlFor="contributionAmount">Contribution Amount ($)</label>
                                            <input
                                                id="contributionAmount"
                                                type="number"
                                                value={contributionAmount === 0 ? "" : contributionAmount} // Show empty string if value is 0
                                                onChange={(e) => setContributionAmount(Number(e.target.value))}
                                                min="0"
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="frequency">Contribution Frequency</label>
                                            <select
                                                id="frequency"
                                                value={contributionFrequency}
                                                onChange={(e) => setContributionFrequency(e.target.value)}
                                                className="form-input"
                                            >
                                                <option value="daily">Daily</option>
                                                <option value="weekly">Weekly</option>
                                                <option value="biweekly">Bi-weekly</option>
                                                <option value="monthly">Monthly</option>
                                                <option value="quarterly">Quarterly</option>
                                                <option value="annually">Annually</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="summary-section">
                                {calculationType === 'goal' ? (
                                    <p className="summary-text">
                                        Required {contributionFrequency} Contribution: 
                                        <strong>${contributionAmount.toLocaleString()}</strong>
                                    </p>
                                ) : (
                                    <p className="summary-text">
                                        Expected Total by {new Date(targetDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}: 
                                        <strong>${chartData[chartData.length - 1]?.value.toLocaleString()}</strong>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Planning;