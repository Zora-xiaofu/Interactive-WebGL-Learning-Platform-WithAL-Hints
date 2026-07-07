// Load environment variables from .env file
require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, "public")));

// OpenAI API proxy
app.post("/api/gpt", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "miss prompt" });
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4", 
                messages: [{ role: "user", content: prompt }], 
                max_tokens: 2000,
                temperature: 0.7
            })
        });

        const data = await response.json();
        console.log("OpenAI API response:", JSON.stringify(data, null, 2));

        if (data.error) {
            console.error("OpenAI API error:", data.error);
            return res.status(500).json({ error: "OpenAI API request failed.", details: data.error });
        }

        if (!data.choices || data.choices.length === 0) {
            console.error("OpenAI API returns invalid data:", data);
            return res.status(500).json({ error: "OpenAI API returns invalid data" });
        }

        res.json({ text: data.choices[0].message.content.trim() });

    } catch (error) {
        console.error("server error:", error);
        res.status(500).json({ error: "Server internal error.", details: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server: http://localhost:${PORT}`));
console.log("OpenAI API Key:", process.env.OPENAI_API_KEY ? "Loaded " : "Not Found ");
