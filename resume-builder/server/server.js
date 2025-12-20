const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/enhance', async (req, res) => {
    try {
        const { skills, softSkills } = req.body;
        
        if (!skills) {
            return res.status(400).json({ success: false, error: "Skills are required" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            I am a student. 
            Raw Tech Skills: "${skills}"
            Raw Soft Skills: "${softSkills}"

            1. **TechSkills**: Professional list.
            2. **Experience**: One 40-word project bullet point.
            3. **SoftSkills**: Professional HR terms.

            Format EXACTLY like this:
            TechSkills: [List]
            Experience: [Text]
            SoftSkills: [List]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ success: true, data: text });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));