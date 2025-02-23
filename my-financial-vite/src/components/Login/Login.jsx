import React from 'react';
import './Login.css';
import { Box, Container, TextField, Typography } from '@mui/material';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../../../common/firebase";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import GoogleLogo from '../../images/google-logo.png';

const Login = () => {
    const navigate = useNavigate();
    const [signInWithEmailAndPassword, user] = useSignInWithEmailAndPassword(auth);
    const [signInWithGoogle, gUser] = useSignInWithGoogle(auth)

    const handleSubmit = (event) => {
        event.preventDefault();
        const email =  event.target.email.value;
        const password = event.target.password.value;

        signInWithEmailAndPassword(email, password);
    }

    useEffect(()=>{
            if (user || gUser) {
                navigate("/budget")
            }
        }, [user, navigate, gUser]);

    return (
        <div className="login">
            <Navbar />
            <div className="login-container">
                <Container maxWidth="xs">
                    <Typography component="h1" variant="h5" color="common.black">
                        Login
                    </Typography>

                    <Box component="form" noValidate sx={{ mt: 1}} onSubmit={handleSubmit}>
                        <div className="login-form">
                            <TextField className="email" name="email" label="Email Address"/>
                            <TextField className="password" name="password" label="Password"/>
                            <button className="submit-btn" type="submit">Login</button>
                            <button className="google-btn" type="submit" onClick={() => signInWithGoogle()}>
                                <img src={GoogleLogo} alt="Google Logo" className="google-logo"/>
                                Login with Google
                            </button>
                        </div>
                    </Box>
                </Container>
            </div>
        </div>
    )
}

export default Login;