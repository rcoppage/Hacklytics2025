import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Planning.css';

function Planning() {
    const [goalAmount, setGoalAmount] = useState(10000);
    const [targetDate, setTargetDate] = useState(getDefaultTargetDate());
    const [investmentType, setInvestmentType] = useState('savings');
    const [calculationType, setCalculationType] = useState('goal');
    const [weeklyContribution, setWeeklyContribution] = useState(100);
    const [chartData, setChartData] = useState([]);

    function getDefaultTargetDate() {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        return date.toISOString().split('T')[0];
    }

    const getAnnualReturn = () => {
        return investmentType === 'savings' ? 0.04 : 0.10;
    };

    const calculateWeeklyContribution = (goal, weeks, rate) => {
        const r = rate / 52;
        return goal * r / (Math.pow(1 + r, weeks) - 1);
    };

    const calculateFutureValue = (contribution, weeks, rate) => {
        const r = rate / 52;
        return contribution * (Math.pow(1 + r, weeks) - 1) / r;
    };

    const generateChartData = () => {
        const today = new Date();
        const target = new Date(targetDate);
        const weeks = Math.ceil((target - today) / (1000 * 60 * 60 * 24 * 7));
        const annualRate = getAnnualReturn();
        
        let data = [];
        let contribution = 0;
        
        if (calculationType === 'goal') {
            contribution = calculateWeeklyContribution(goalAmount, weeks, annualRate);
            setWeeklyContribution(Math.round(contribution * 100) / 100);
        } else {
            contribution = weeklyContribution;
        }

        for (let week = 0; week <= weeks; week++) {
            const date = new Date(today);
            date.setDate(date.getDate() + week * 7);
            
            const value = calculateFutureValue(contribution, week, annualRate);
            
            data.push({
                date: date.toLocaleDateString(),
                value: Math.round(value * 100) / 100
            });
        }

        setChartData(data);
    };

    useEffect(() => {
        generateChartData();
    }, [goalAmount, targetDate, investmentType, calculationType, weeklyContribution]);

    return (
        <div className="planning-container">            
            <div className="planning-card">
                <div className="card-header">
                    <h2 className="card-title">Investment Calculator</h2>
                </div>
                <div className="planning-grid">
                    <div className="top-section">
                        <div className="input-section">
                            <h3 className="section-title">Investment Settings</h3>
                            <div className="input-group">
                                <label htmlFor="targetDate">Target Date</label>
                                <input
                                    id="targetDate"
                                    type="date"
                                    value={targetDate}
                                    onChange={(e) => setTargetDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="form-input"
                                />
                            </div>

                            <div className="radio-group">
                                <div className="radio-option">
                                    <input
                                        type="radio"
                                        id="savings"
                                        name="investmentType"
                                        value="savings"
                                        checked={investmentType === 'savings'}
                                        onChange={(e) => setInvestmentType(e.target.value)}
                                    />
                                    <label htmlFor="savings">High-Yield Savings (4% APY)</label>
                                </div>
                                <div className="radio-option">
                                    <input
                                        type="radio"
                                        id="stocks"
                                        name="investmentType"
                                        value="stocks"
                                        checked={investmentType === 'stocks'}
                                        onChange={(e) => setInvestmentType(e.target.value)}
                                    />
                                    <label htmlFor="stocks">S&P 500 (10% avg. return)</label>
                                </div>
                            </div>
                        </div>

                        <div className="chart-section">
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis 
                                            dataKey="date"
                                            tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
                                            interval={Math.floor(chartData.length / 6)}
                                        />
                                        <YAxis 
                                            tickFormatter={(value) => `$${value.toLocaleString()}`}
                                        />
                                        <Tooltip 
                                            formatter={(value) => [`$${value.toLocaleString()}`, 'Projected Value']}
                                            labelFormatter={(label) => new Date(label).toLocaleDateString()}
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
                            <h3 className="section-title">Contribution Calculator</h3>
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
                                    <label htmlFor="contribution">Calculate by Weekly Contribution</label>
                                </div>
                            </div>

                            {calculationType === 'goal' ? (
                                <div className="input-group">
                                    <label htmlFor="goalAmount">Goal Amount ($)</label>
                                    <input
                                        id="goalAmount"
                                        type="number"
                                        value={goalAmount}
                                        onChange={(e) => setGoalAmount(Number(e.target.value))}
                                        min="0"
                                        className="form-input"
                                    />
                                </div>
                            ) : (
                                <div className="input-group">
                                    <label htmlFor="weeklyContribution">Weekly Contribution ($)</label>
                                    <input
                                        id="weeklyContribution"
                                        type="number"
                                        value={weeklyContribution}
                                        onChange={(e) => setWeeklyContribution(Number(e.target.value))}
                                        min="0"
                                        className="form-input"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="summary-section">
                            {calculationType === 'goal' ? (
                                <p className="summary-text">
                                    Required Weekly Contribution: <strong>${weeklyContribution.toLocaleString()}</strong>
                                </p>
                            ) : (
                                <p className="summary-text">
                                    Expected Total by {new Date(targetDate).toLocaleDateString()}: 
                                    <strong>${chartData[chartData.length - 1]?.value.toLocaleString()}</strong>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Planning;