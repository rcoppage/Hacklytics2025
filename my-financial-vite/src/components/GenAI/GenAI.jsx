import { Button, TextField, Box } from '@mui/material';
import React from 'react'
import Sidebar from '../Sidebar/Sidebar';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useState } from 'react';
import './GenAI.css'

const GenAI = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    var response
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    async function handleSubmit(event){
        event.preventDefault();
        const WeeklyBudget = event.target.WeeklyBudgetInput.value;
        const HomecookedMeal = event.target.HomecookedMealsInput.value;
        const DietaryRestrictions = event.target.DietaryRestrictionsInput.value;
        const MaxTimePerMeal = event.target.MaxTimePerMealInput.value;

        prompt = "Generate a meal plan for the week based on the following criteria: My budget is [$"+WeeklyBudget+"] per week, and I need ["+ HomecookedMeal+"] meals. \
        I follow ["+DietaryRestrictions +"]. I also cannot spend more than ["+MaxTimePerMeal+"] minutes on a recipe. Ensure that the combined preparation and cook time are less than ["+MaxTimePerMeal+"]. Provide a variety of meals with simple recipes, ingredient lists, and estimated costs per meal. Prioritize affordability, nutrition, and ease of preparation. Ensure that the recipes are extremely detailed"

        console.log(prompt);

        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        document.getElementById("APIResponse").innerText = result.response.text();
        document.getElementById("APIResponse").style.color = "black";

    }
// Budget, Homecooked Meals, Dietary Restrictions, Max time per meal,  
    return (
        <div>
            <div>
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
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
                <div className="APIResponse" id="APIResponse">
                    <p style={{color: "black"}}>{response}</p>
                </div>
            </div>
        </div>
    )
}

export default GenAI