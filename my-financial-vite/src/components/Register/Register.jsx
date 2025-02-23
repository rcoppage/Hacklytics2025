import React from 'react';
import './Register.css';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useCreateUserWithEmailAndPassword, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../../../common/firebase";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import GoogleLogo from '../../images/google-logo.png';

const Register = () => {
    const navigate = useNavigate();
    const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
    const [signInWithGoogle, gUser] = useSignInWithGoogle(auth)
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const email =  event.target.email.value;
        const password = event.target.password.value;

        createUserWithEmailAndPassword(email, password)
    }

    useEffect(()=>{
        if (user) {
            navigate("/RegisterForm");
        }
    }, [user, navigate]);

    return (
        <div className="register">
            <Navbar/>
            <div className="register-container">
                <Typography component="h1" variant="h5" color="common.black">
                    Register
                </Typography>

                <Box component="form" noValidate sx={{ mt: 1}} onSubmit={handleSubmit}>
                    <div className="register-form">
                        <TextField className="email" name="email" label="Email Address"/>
                        <TextField className="password" name="password" label="Password"/>
                        <button className="submit-btn" type="submit" >Register</button>
                        <button className="google-btn" type="submit" onClick={() => signInWithGoogle()}>
                            <img src={GoogleLogo} alt="Google Logo" className="google-logo"/>
                            Register with Google
                        </button>
                    </div>
                </Box>
            </div>
        </div>
    )
}

export default Register;