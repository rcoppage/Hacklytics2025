import "./RegisterForm.css"
import { Box, Button, Container, TextField, Typography, Snackbar, Alert } from '@mui/material';
import Navbar from "../Navbar/Navbar";
import { useState } from 'react';
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

    const handleInputChange = (e, field) => {
        setFormData({
            ...formData,
            [field]: e.target.value
        });
    };

    const skipPressed = () => {
        navigate('/Budget'); 
    };

    const nextPressed = async () => {
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
            }
        } catch (error) {
            setMessage({
                text: 'Error saving data. Please try again.',
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
            <div className="mainInput">
                <div className="inputLabel">
                    <p style={{color: "black"}}>Salary</p>
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
                <div className="inputLabel">
                    <p style={{color: "black"}}>Monthly Rent</p>
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
                <div className="inputLabel">
                    <p style={{color: "black"}}>Monthly Grocery Spending</p>
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
                <div className="inputLabel">
                    <p style={{color: "black"}}>Monthly Transportation Cost</p>
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
                <div className="inputLabel">
                    <p style={{color: "black"}}>Monthly Insurance Cost</p>
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
                <div className="nextButtons">
                    <Button 
                        variant="contained" 
                        onClick={skipPressed} 
                        disabled={loading}
                    >
                        Skip
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={nextPressed}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Next'}
                    </Button>
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