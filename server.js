//Ouvrir avec "node server.js" dans terminal et "http://localhost:3000/" dans nav

const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

app.use(express.json());

// 🔥 ON SERT EXPLICITEMENT LA RACINE
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "garou2.html"));//__dirname = dossier courant
});

app.post("/chat", (req, res) => {
    console.log("POST /chat reçu");
    console.log(req.body);
    res.json({ status: "ok" });
});

app.listen(3000, () => {
    console.log("Serveur OK → http://localhost:3000");
});
