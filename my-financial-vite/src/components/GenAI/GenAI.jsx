import { Button, TextField, Box } from '@mui/material';
import React from 'react'
import Sidebar from '../Sidebar/Sidebar';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useState } from 'react';
import './GenAI.css'

const GenAI = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        /*
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Explain how AI works";

    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    */
    console.log(event.target.WeeklyBudgetInput.value)
    console.log(event.target.HomecookedMealsInput.value)
    console.log(event.target.DietaryRestrictionsInput.value)
    console.log(event.target.MaxTimePerMealInput.value)


    }
// Budget, Homecooked Meals, Dietary Restrictions, Max time per meal,  
    return (
        <div>
            <div>
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                <Sidebar />
            </div>
            <div>
            </div>
            <div className={`content ${sidebarOpen ?   'expand' : 'collapse'}`}>
                <Box component="form" noValidate sx={{ mt: 1}} onSubmit={handleSubmit}>
                    <div>
                        <p style={{color: "black"}}>Weekly Budget</p>
                    </div>
                    <div className="WeeklybudgetInput">
                        <TextField name="WeeklyBudgetInput"></TextField>
                    </div>
                    <div>
                        <p style={{color: "black"}}>Number of Homecooked Meals</p>
                    </div>
                    <div className="HomecookedMealsInput">
                        <TextField name="HomecookedMealsInput"></TextField>
                    </div>
                    <div>
                        <p style={{color: "black"}}>Dietary Restrictions</p>
                    </div>
                    <div className="DietaryRestrictionsInput">
                        <TextField name="DietaryRestrictionsInput"></TextField>
                    </div>
                    <div>
                        <p style={{color: "black"}}>Max time to cook meal(minutes)</p>
                    </div>
                    <div className="MaxTimePerMeal">
                        <TextField name="MaxTimePerMealInput"></TextField>
                    </div>
                    <div className="GenButton" style={{margin: 20}}>
                        <Button type="submit" style={{color: "black"}} variant='contained'>Generate GenAI</Button>
                    </div>
                </Box>
            </div>
        </div>
    )
}

export default GenAI