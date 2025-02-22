import React from 'react';
import './Register.css';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../../common/firebase";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
    const handleSubmit = (event) => {
        event.preventDefault();
        const email =  event.target.email.value;
        const password = event.target.password.value;

        console.log(email)
        console.log(password)

        createUserWithEmailAndPassword(email, password)
    }

    useEffect(()=>{
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <Container maxWidth="xs">
            <Box sx={{marginTop: 8, display: 'flex', justifyContent: 'center', alignItems: 'center',flexDirection:'column'}}>
                <Typography component="h1" variant="h5" color="common.black">
                    Register
                </Typography>

                <Box component="form" noValidate sx={{ mt: 1}} onSubmit={handleSubmit}>
                    <TextField margin="normal" fullWidth name="email" label="Email Address"/>
                    <TextField margin="normal" fullWidth name="password" label="Password"/>
                    <Button type="submit" fullWidth variant='contained'>
                        Register
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}

export default Register;