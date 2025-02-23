import "./RegisterForm.css"
import { Box, Button, Container, TextField, Typography, Snackbar, Alert, CircularProgress } from '@mui/material';
import Navbar from "../Navbar/Navbar";
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        salary: '',
        monthlyRent: '',
        grocerySpending: '',  
        transportationCost: '',
        insuranceCost: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: 'success', open: false });

    useEffect(() => {
        // Check if user is authenticated
        const auth = getAuth();
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (!user) {
                setMessage({
                    text: 'Please log in first',
                    type: 'error',
                    open: true
                });
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleInputChange = (e, field) => {
        const value = e.target.value;
        if (value === '' || value >= 0) {  // Allow empty or non-negative numbers
            setFormData({
                ...formData,
                [field]: value
            });
        }
    };

    const skipPressed = () => {
        navigate('/Budget'); 
    };

    const nextPressed = async () => {
        // Validate inputs
        const numericFields = ['salary', 'monthlyRent', 'grocerySpending', 'transportationCost', 'insuranceCost'];
        const hasInvalidFields = numericFields.some(field => {
            const value = Number(formData[field]);
            return formData[field] !== '' && (isNaN(value) || value < 0);
        });

        if (hasInvalidFields) {
            setMessage({
                text: 'Please enter valid non-negative numbers',
                type: 'error',
                open: true
            });
            return;
        }

        setLoading(true);
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            
            if (!user) {
                setMessage({
                    text: 'Please log in first',
                    type: 'error',
                    open: true
                });
                return;
            }

            const response = await fetch('http://localhost:5000/store-financial-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.uid,
                    username: user.email,
                    ...formData
                })
            });

            const data = await response.json();
            if (data.success) {
                setMessage({
                    text: 'Data saved successfully!',
                    type: 'success',
                    open: true
                });
                navigate('/Budget'); 
            } else {
                throw new Error(data.error || 'Failed to save data');
            }
        } catch (error) {
            setMessage({
                text: error.message || 'Error saving data. Please try again.',
                type: 'error',
                open: true
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="RegisterForm">
            <Navbar />
            <h1>Enter Information</h1>
            <div className="inputContainer">
                <div className="mainInput">
                    <div className="inputSection">
                        <div className="inputLabel">
                            <p>Salary</p>
                        </div>
                    <div className="textInput">
                        <TextField 
                            type="number"
                            value={formData.salary}
                            onChange={(e) => handleInputChange(e, 'salary')}
                            placeholder="Enter your salary"
                            disabled={loading}
                        />
                    </div>
                </div>
                <div className="inputSection">
                    <div className="inputLabel">
                        <p>Monthly Rent</p>
                    </div>
                    <div className="textInput">
                        <TextField 
                            type="number"
                            value={formData.monthlyRent}
                            onChange={(e) => handleInputChange(e, 'monthlyRent')}
                            placeholder="Enter monthly rent"
                            disabled={loading}
                        />
                    </div>
                </div>
                <div className="inputSection">
                    <div className="inputLabel">
                        <p>Monthly Grocery Spending</p>
                    </div>
                    <div className="textInput">
                        <TextField 
                            type="number"
                            value={formData.grocerySpending}
                            onChange={(e) => handleInputChange(e, 'grocerySpending')}
                            placeholder="Enter spending"
                            disabled={loading}
                        />
                    </div>
                </div>
                <div className="inputSection">
                    <div className="inputLabel">
                        <p>Monthly Transportation Cost</p>
                    </div>
                    <div className="textInput">
                        <TextField 
                            type="number"
                            value={formData.transportationCost}
                            onChange={(e) => handleInputChange(e, 'transportationCost')}
                            placeholder="Enter spending"
                            disabled={loading}
                        />
                    </div>
                </div>
                <div className="inputSection">
                    <div className="inputLabel">
                        <p>Monthly Insurance Cost</p>
                    </div>
                    <div className="textInput">
                        <TextField 
                            type="number"
                            value={formData.insuranceCost}
                            onChange={(e) => handleInputChange(e, 'insuranceCost')}
                            placeholder="Enter cost"
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>
            <div className="nextButtons">
                <button 
                    className="skip-btn"
                    onClick={skipPressed} 
                    disabled={loading}
                >
                    Skip
                </button>
                <button 
                    className="next-btn"
                    onClick={nextPressed}
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Next'}
                </button>
            </div>
        </div>
        <Snackbar 
            open={message.open} 
            autoHideDuration={6000} 
            onClose={() => setMessage(prev => ({ ...prev, open: false }))}
        >
            <Alert severity={message.type} sx={{ width: '100%' }}>
                {message.text}
            </Alert>
        </Snackbar>
    </div>
    );
};

export default RegisterForm;