const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- YOUR GOOGLE API KEY ---
const GEN_AI_KEY = "AIzaSyDWI3JEbbzdSyTMRwYRXdMkglNNHNPWNjk"; 
const genAI = new GoogleGenerativeAI(GEN_AI_KEY);

app.post('/api/enhance', async (req, res) => {
    try {
        const { skills, softSkills } = req.body;
        console.log("Processing Request for:", skills); 

        // Use the Flash model for speed
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            I am a student. 
            Raw Tech Skills: "${skills}"
            Raw Soft Skills: "${softSkills}"

            1. **TechSkills**: Expand into a professional list (e.g. "java" -> "Core Java, Spring Boot").
            2. **Experience**: Write a professional 40-word project bullet point.
            3. **SoftSkills**: Polish into professional terms.

            Format EXACTLY like this:
            TechSkills: [Enhanced list]
            Experience: [Text]
            SoftSkills: [Enhanced list]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Success! Sending data back to frontend.");
        res.json({ success: true, data: text });

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));