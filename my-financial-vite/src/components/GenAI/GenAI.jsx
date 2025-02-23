import { Button, TextField, Box } from '@mui/material';
import React from 'react'
import Sidebar from '../Sidebar/Sidebar';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useState } from 'react';
import './GenAI.css'

const GenAI = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [response, setResponse] = useState("");
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
        document.getElementById("APIResponse").style.color = "black";
        const response2 = formatLines(result.response.text().split("\n"));
        setResponse(response2)

    }
    const formatLines = (lines) => {
        return lines.map((line, index) => {
            let className = '';
            if (line.substring(0,3) === '## ') {
                className = 'bold';
                line = line.replaceAll('#','');
                return (
                    <h1 key={index} className={className}>
                    {line}
                    </h1>
                );
            } else if (line.substring(0,2) === '**') {
                className = 'italic';
                line = line.substring(2);
                line = line.replaceAll('*','');
                return (
                    <h2 key={index} className={className}>
                    {line}
                    </h2>
                );
            } else if (line.substring(0,4) === '* **') {
                className = 'underline';
                line = line.substring(3);
                line = line.replaceAll('*','');
                return (
                    <h3 key={index} className={className}>
                    {line}
                    </h3>
                );
            } else {
                className = 'normal';
                line = line.replaceAll('*','');
            }

            return (
                <div key={index} className={className}>
                {line}
                </div>
            );
        });
      };
// Budget, Homecooked Meals, Dietary Restrictions, Max time per meal,  
    return (
        <div className="genAI">
            <div>
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} labelSelected={4}/>
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
                    <div className="Response">{response}</div>
                </div>
            </div>
        </div>
    )
}

export default GenAI