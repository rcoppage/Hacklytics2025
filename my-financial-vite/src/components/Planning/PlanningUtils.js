// PlanningUtils.js

export const getDefaultTargetDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
};

export const getAnnualReturn = (investmentType, customReturn) => {
    if (investmentType === 'custom' && customReturn && !isNaN(customReturn)) {
        return parseFloat(customReturn) / 100;
    }
    switch (investmentType) {
        case 'normal':
            return 0.01;
        case 'savings':
            return 0.04;
        case 'stocks':
            return 0.10;
        default:
            return 0.01;
    }
};

export const getWeeklyContribution = (amount, frequency) => {
    switch(frequency) {
        case 'daily':
            return amount * 7;
        case 'weekly':
            return amount;
        case 'biweekly':
            return amount / 2;
        case 'monthly':
            return amount / 4.33;
        case 'quarterly':
            return amount / 13;
        case 'annually':
            return amount / 52;
        default:
            return amount;
    }
};

export const calculateWeeklyContribution = (goal, weeks, rate) => {
    const r = rate / 52;
    return goal * r / (Math.pow(1 + r, weeks) - 1);
};

export const calculateFutureValue = (contribution, weeks, rate) => {
    const r = rate / 52;
    return contribution * (Math.pow(1 + r, weeks) - 1) / r;
};

export const formatDateForDisplay = (date) => {
    return new Date(date).getFullYear().toString();
};

export const calculateTotalYears = (targetDate) => {
    return (new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24 * 365.25);
};

export const generateChartData = (
    targetDate, 
    calculationType, 
    goalAmount, 
    weeklyContribution,
    investmentType,
    customReturn,
    currentSavings,
    setContributionAmount
) => {
    const today = new Date();
    const target = new Date(targetDate);
    const totalYears = calculateTotalYears(targetDate);
    const weeks = Math.ceil((target - today) / (1000 * 60 * 60 * 24 * 7));
    const annualRate = getAnnualReturn(investmentType, customReturn);
    
    let data = [];
    let contribution = 0;
    
    if (calculationType === 'goal') {
        contribution = calculateWeeklyContribution(goalAmount, weeks, annualRate);
        setContributionAmount(Math.round(contribution * 100) / 100);
    } else {
        contribution = weeklyContribution;
    }

    // First generate dense data points for smooth line (weekly points)
    let currentValue = currentSavings;
    for (let week = 0; week <= weeks; week++) {
        const date = new Date(today);
        date.setDate(date.getDate() + week * 7);
        
        // Add weekly contribution and calculate returns
        currentValue = currentValue * (1 + annualRate/52) + contribution;
        
        data.push({
            date: date,
            value: Math.round(currentValue * 100) / 100,
            isMainPoint: false
        });
    }

    // Then mark main points for labels
    const monthsBetween = weeks / 4.33;
    const numberOfMainPoints = monthsBetween < 6 ? Math.max(3, Math.ceil(monthsBetween)) : 6;

    for (let i = 0; i < numberOfMainPoints; i++) {
        const fraction = i / (numberOfMainPoints - 1);
        const pointIndex = Math.round((data.length - 1) * fraction);
        if (data[pointIndex]) {
            data[pointIndex].isMainPoint = true;
        }
    }

    return data;
};