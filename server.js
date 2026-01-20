const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Page HTML
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "garou2.html"));
});

// API Chat
app.post("/chat", async (req, res) => {
    try {
        const { promptSystem, promptUser } = req.body;
        console.log("promptUser type:", typeof promptUser, promptUser);
        console.log("promptSystem type:", typeof promptSystem, promptSystem);

        console.log("POST /chat reçu");
        console.log("NODE_ENV :", process.env.NODE_ENV);
        console.log("API KEY OK :", !!process.env.OPENAI_API_KEY);

        const response = await client.responses.create({
            model: "gpt-4o",
            instructions: promptSystem,
            input: promptUser,
        });

        res.json({
            answer: response.output_text
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur OpenAI" });
    }
});

app.listen(3000, () => {
    console.log("Serveur OK → http://localhost:3000");
});
