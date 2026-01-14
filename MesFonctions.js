/////////sidebar////////////////////////////
#sidebar {
    position: fixed;
    left: 0;
    top: 0;
    background: var(--sidebar - bg);
    padding: 20px;
    display: flex;
    flex - direction: column;
    box - shadow: 0 10px 25px var(--box - shadow - color);
    /*z-index: 10;*/
}
@media(min - width: 600px) {
    #sidebar {
        bottom: 0;
        width: 320px;
        gap: 20px;
        overflow - y: auto;
    }
}
@media(max - width: 600px) {
    #sidebar {
        display: block;
        grid - template - columns: 1fr 1fr 1fr;
        right: 0;
        height: 190px;
        gap: 5px;
        /*scroll-horizontal*/
        overflow - y: auto;
        /*white-space: nowrap;*/
    }
}
///////////CSS départ /////////////////////////////////////////////
        body {
    text - align: center;
    font - family: Arial, sans - serif;
    padding - left: 0.2 %;
    padding - right: 0.2 %;
    padding - bottom: 10px;
    padding - top: 10px;
}

        p {
    margin: 100px;
}
/////////Panneau CSS ///////////////////////////
#main {
    position: relative;
}
#mj - panel {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 320px;
    max - height: 40vh;
    overflow: auto;

    background: #0b0b0b;
    border: 1px solid #333;
    border - radius: 8px;
    padding: 10px;

    font - size: 0.75rem;
    white - space: pre - wrap;
    display: none;
    z - index: 5;
}
/////////Api Gpt //////////////////////////////////////////
<html>
    <body>
        <div id="chat">
            <h2>🧙 Mini JDR - MJ IA (GPT)</h2>
            <input type="password" id="apiKey" placeholder="Clé API OpenAI..." style="width:100%;padding:8px;">
                <div id="messages"></div>
                <textarea id="userInput" placeholder="Que fait ton personnage ?"></textarea>
                <button onclick="sendMessage()">Envoyer</button>
        </div>
        <script>
            const messagesDiv = document.getElementById('messages');
            const systemPrompt = `
            Tu es un Maître du Jeu de Donjons et Dragons.
            Décris les scènes de manière immersive et fais interagir le joueur avec des PNJ.
            Il y a deux PNJ compagnons : Lyria (elfe mage prudente) et Bragor (barbare impulsif).
            Laisse parfois ces PNJ parler ou réagir.
            Le joueur contrôle un aventurier libre, tu gères tout le reste.
            `;
            let chatHistory = [{role: "system", content: systemPrompt }];
            async function sendMessage() {
            const apiKey = document.getElementById('apiKey').value.trim();
            const userText = document.getElementById('userInput').value.trim();
            if (!apiKey) return alert("Entre ta clé API OpenAI d'abord !");
            if (!userText) return;
            addMessage("user", userText);
            document.getElementById('userInput').value = "";
            chatHistory.push({role: "user", content: userText });
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
            headers: {
                "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
                },
            body: JSON.stringify({
                model: "gpt-4o-mini",
            messages: chatHistory,
            temperature: 0.9
                })
            });
            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content || "Erreur de réponse du MJ.";
            addMessage("mj", reply);
            chatHistory.push({role: "assistant", content: reply });
        }
            function addMessage(role, text) {
            const div = document.createElement("div");
            div.className = "msg " + (role === "user" ? "user" : role === "mj" ? "mj" : "npc");
            div.innerHTML = `<b>${role === "user" ? "🧝 Toi" : "🧙 MJ"} :</b> ${text}`;
            messagesDiv.appendChild(div);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
        </script>
    </body>
</html >
///////////Supabase/////////////////////////////////
/*    <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
    <script>
        // 1️⃣ Connexion Supabase (clé publique uniquement)
const supabaseUrl = "https://TON-PROJET.supabase.co";
const supabaseAnonKey = "TA_CLE_ANON_PUBLIQUE";
 
const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseAnonKey
);
*/
////////////REQUETE FETCH AVEC ERROR/////////////////////////////////
fetch("http://127.0.0.1:8000/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        video_path: project.video.finalMixPath,
        title: project.text.title,
        description: project.text.description,
        tags: project.text.tags
    })
}
).then(response => response.json()
).then(data => {
    console.log("Réponse publish :", data);
    if (data.status === "ok") {
        alert("Vidéo publiée sur YouTube avec succès !");
    } else {
        alert("Erreur lors de la publication : " + data.message);
    }
}).catch(error => {
    console.error("Erreur fetch publish :", error);
    alert("Erreur lors de la publication : " + error.message);
});

//////////////requete serveur FastApi///////////////
async () => {
    const image_base64 = await fileToBase64(imgFileMix);
    const audio_base64 = await fileToBase64(audioFileMix);

    const payload = {
        image_base64,
        audio_base64,
        project
    };

    const res = await fetch("http://127.0.0.1:8000/Python/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("🎬 Réponse serveur :", data);
};

/////////////////////////transmet html-js ?///////////////////
//scriptA.js
const idButton = 'generateThumbnail';
const stringCommun = 'generateThumbnailEvent';
EnvoiVarJSJSavButton(idButton, stringCommun);

function EnvoiVarJSJSavButton(btt, sCom) {
    document.getElementById(btt).addEventListener('click', () => {
        const payload = {
            fileCharged: imgOk !== null, //booléen à transférer
            imageElement: imgOk          //image à transférer
        };
        const event = new CustomEvent(sCom, { detail: payload });
        document.dispatchEvent(event);
    });
}
//scriptB.js
const stringCommun = 'generateThumbnailEvent';
let imgPerso = null;
function RecevoirVarJSJSavButton(sCom, callback) {
    varLect();
    function varLect() {
        document.addEventListener(sCom, (e) => {
            const { fileCharged, imageElement } = e.detail;
            callback(fileCharged, imageElement);
        });
    }
}
RecevoirVarJSJSavButton(stringCommun, (fileCharged) => {
    imgPerso = fileCharged; console.log('📦 Image Perso :', fileCharged, imageElement); return fileCharged;
    //if (fileCharged) {/* image locale*/} else {/* image IA*/}
});




//Ce transfert de variables entre le script A et B est - il fonctionnel ?