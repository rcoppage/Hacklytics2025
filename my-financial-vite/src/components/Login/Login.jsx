import React from 'react';
import './Login.css';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../../../common/firebase";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';



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
        <div>
            <Navbar />
            <Container maxWidth="xs">
                <Box sx={{marginTop: 8, display: 'flex', justifyContent: 'center', alignItems: 'center',flexDirection:'column'}}>
                    <Typography component="h1" variant="h5" color="common.black">
                        Login
                    </Typography>

                    <Box component="form" noValidate sx={{ mt: 1}} onSubmit={handleSubmit}>
                        <TextField margin="normal" fullWidth name="email" label="Email Address"/>
                        <TextField margin="normal" fullWidth name="password" label="Password"/>
                        <Button type="submit" fullWidth variant='contained' sx={{mt: 3 ,mb: 2}}>
                            Login
                        </Button>
                        <Button type="submit" fullWidth variant='outlined' sx={{mt:3, mb:2}}  onClick={() => signInWithGoogle()}>
                            Login with Google
                        </Button>
                    </Box>
                </Box>
            </Container>
        </div>
    )
}

export default Login;