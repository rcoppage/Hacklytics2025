import "./RegisterForm.css"
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import Navbar from "../Navbar/Navbar";

import React from 'react'

function skipPressed(){
    console.log("HOLY SKIP")    
}

function nextPressed(){
    console.log("HOLY NEXT")
}

const RegisterForm = () => {
    
    return (
        <div className="RegisterForm">
            <Navbar />
            <div className="mainInput">
                <div className="inputLabel">
                    <p style={{color: "black"}}>Salary</p>
                </div>
                <div className="textInput">
                    <TextField></TextField>
                </div>
                <div className="inputLabel">
                    <p style={{color: "black"}}>Monthly Rent</p>
                </div>
                <div className="textInput">
                    <TextField>Monthly Debt Payments</TextField>
                </div>
                <div className="nextButtons">
                    <Button variant="contained" onClick={() => skipPressed()}>Skip</Button>
                    <Button variant="contained" onClick={() => nextPressed()}>Next</Button>
                </div>
            </div>
        </div>
    )
}

export default RegisterForm