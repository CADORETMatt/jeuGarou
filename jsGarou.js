// OpenAI API Key
const OPENAI_API_KEY = "VOTRE_CLE_API_ICI";

// Objet Partie contenant ADN et historique
let partie = {
    adn: {
        Lieu: "Émission TV « Tralala »",
        Buzz: "inactif",
        SallePublic: "Pupitre TV",
        J1: { sallePerso: 1, scene: "Epreuve", nom: "Toi", role: "Justicier", perso: "Animateur", vivant: true, type: "Humain" },
        J2: { sallePerso: 2, scene: "Loge", nom: "Robert", role: "Acolyte", perso: "Candidat", vivant: true, type: "Gpt" },
        J3: { sallePerso: 3, scene: "Coulisses", nom: "Michel", role: "Meurtrier", perso: "Producteur", vivant: true, type: "Gpt" },
        currentSalle: "SallePublic",
        buzzActive: false
    },
    history: [] // {sender: 'salleKey', message: 'texte', target: 'salleKey'}
};

const display = document.getElementById('display');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const buzz = document.getElementById('buzz');
const buzzInfo = document.getElementById('buzz-info');
const playerParams = document.getElementById('player-params');
const paramName = document.getElementById('param-name');
const paramRole = document.getElementById('param-role');
const paramPerso = document.getElementById('param-perso');
const paramType = document.getElementById('param-type');
const paramScene = document.getElementById('param-scene');
const paramVivant = document.getElementById('param-vivant');
const saveParams = document.getElementById('save-params');
////////Abandon//////////////////////////////////////
const overlay = document.getElementById('modal-overlay');
const modal = document.getElementById('abandon-modal');
//////Salles//////////////////
const salles = ['SallePublic', 'J1', 'J2', 'J3'];
const salleOrder = ['SallePublic', 'J1', 'J2', 'J3'];
let mode = 'joueur'; // ou 'mj'
let currentSalle = 'SallePublic'; // Par défaut, salle du joueur
///////View des joueur////////////////
const viewUser = ['MJ', 'joueur'];
const playerKeys = ['J1', 'J2', 'J3'];
//let ViewedPlayer = playerKeys[0]; // J1 par défaut (source de vérité : playerKeys)
let ViewedPlayer = 'J1';
let User1is = 'J1'; // joueur local (ou vue MJ)

const toggleUserBtn = document.getElementById('toggle-user');
toggleUserBtn.addEventListener('click', () => {
    if (mode !== 'mj') return;

    const index = playerKeys.indexOf(User1is);
    User1is = playerKeys[(index + 1) % playerKeys.length];

    toggleUserBtn.textContent = `Vue : ${User1is}`;
    updateCardPlayer();
});
/*toggleUserBtn.addEventListener('click', () => {
    const index = playerKeys.indexOf(ViewedPlayer);
    const newIndex = (index + 1) % playerKeys.length;
    ViewedPlayer = playerKeys[newIndex];
    toggleUserBtn.textContent = `Vue : ${ViewedPlayer}`;
    updateViewPlayer();
});*/
//////////// Btn MJ  ////////////////////////
const toggleMJBtn = document.getElementById('toggle-mj');
const mjPanel = document.getElementById('mj-panel');
const adnEditor = document.getElementById('adn-editor');
toggleMJBtn.addEventListener('click', () => {
    if (mode === 'joueur') {
        mode = 'mj';
        toggleMJBtn.textContent = "Mode: MJ";
        mjPanel.style.display = 'block';
        adnEditor.value = JSON.stringify(partie.adn, null, 2);
    } else {
        mode = 'joueur';
        toggleMJBtn.textContent = "Mode: Joueur";
        mjPanel.style.display = 'none';
        ViewedPlayer = 'J1';
        loadPlayerParams();

    }

    applyPermissions();
});
//////////////  Inject ADN /////////////////
/*function applyAdnChange(newAdn, origin = 'MJ') {
    partie.adn = newAdn;

    partie.history.push({
        sender: 'System',
        message:
            origin === 'MJ'
                ? '🔄 L’ADN du scénario a été modifié par le MJ.'
                : `✏️ ${partie.adn[origin]?.nom ?? origin} a modifié ses paramètres.`,
        target: null
    });
    updateCardPlayer(); showMessages();
}*/

function applyAdnChange(origin = 'MJ') {
    try {
        const parsedAdn = JSON.parse(adnEditor.value);
        partie.adn = parsedAdn;

        partie.history.push({
            sender: 'System',
            message:
                origin === 'MJ'
                    ? '🔄 L’ADN du scénario a été modifié par le MJ.'
                    : `✏️ ${partie.adn[origin]?.nom ?? origin} a modifié ses paramètres.`,
            target: null
        });
        updateCardPlayer(); showMessages();
        updateSalle(); // Ajouté pour rafraîchir les dots après modification ADN
    } catch (e) {
        alert("ADN invalide (JSON incorrect)");
    }
}

document.getElementById('apply-adn').addEventListener('click', () => {
    const origin = mode === 'mj' ? 'MJ' : ViewedPlayer;
    applyAdnChange(origin);
});
////////////Next Salle /////////////////
const buzzNext = document.getElementById('buzz-next');

buzzNext.addEventListener('click', (e) => {
    if (e.shiftKey) {
        //toggleSalle();
    } else {
        nextSalle(); updateCardPlayer();
    }
});
/////////////////Sauvegarder////////////////////////
document.getElementById('save-partie').addEventListener('click', () => {
    const data = JSON.stringify(partie, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'partie.json';
    a.click();

    URL.revokeObjectURL(url);
});
///////////OUVRIR //////////////////////////////
document.getElementById('load-partie').addEventListener('click', () => {
    document.getElementById('load-file').click();
});

document.getElementById('load-file').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        try {
            const loaded = JSON.parse(reader.result);
            partie = loaded;

            updateCardPlayer();
            updateSalle();
            //updateMJAdnView();
            showMessages();
        } catch {
            alert('Chargé mais fichier JSON peut-être invalide');
        }
    };
    reader.readAsText(file);
    closeAbandonModal(); // Fermer modal après load
    updateRoomInfo(); // Actualiser affichage
});
///////////Abandon///////////////////////////////////
document.getElementById('cancel-abandon').onclick = closeAbandonModal;

document.getElementById('confirm-abandon').onclick = async () => {
    console.log("Abandon. Relance gpt");
    alert("Prochainnement relié à Gpt !");
    const name = document.getElementById('abandon-name').value || 'Un joueur';

    closeAbandonModal();

    const newAdn = await askGPT(
        'Tu es un maître du jeu.',
        `Le joueur ${name} abandonne. Réécris un ADN cohérent.`
    );

    applyAdnChange(JSON.parse(newAdn), 'System');
};
///////////Mes params/////////////////
const title = document.getElementById('params-title');

if (mode === 'mj') {
    title.textContent = `Paramètres – ${User1is}`;
} else {
    title.textContent = 'Mes paramètres';
}
/////////////////////////////        // Fonction pour afficher les messages
function showMessages() {
    display.innerHTML = '';
    partie.history.forEach(msg => {
        const isRelevant = (msg.sender === 'J1' && msg.target === currentSalle) ||
            (msg.sender === currentSalle && msg.target === 'J1') ||
            ((currentSalle === 'J1' || currentSalle === 'SallePublic') && !msg.target); // Publique

        if (isRelevant) {
            const p = document.createElement('p');
            const senderName =
                msg.sender === 'System'
                    ? '🕯️ Système'
                    : partie.adn[msg.sender]?.nom ?? msg.sender;
            p.textContent = `${senderName}: ${msg.message}`;
            p.classList.add('visible'); // Toujours visible si relevant
            if (partie.adn[currentSalle] && typeof partie.adn[currentSalle] === 'object' && !partie.adn[currentSalle].vivant) {
                p.style.display = 'none'; // Invisible si absent
            }
            display.appendChild(p);
        }
    });
    display.scrollTop = display.scrollHeight;
}

// Appel à l'API OpenAI
async function askGPT(systemPrompt, userPrompt) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.9
        })
    });
    const data = await res.json();
    return data.choices[0].message.content;
}

// Réponse d'un joueur IA
async function getIAResponse(salleKey) {
    const player = partie.adn[salleKey];
    if (player.type !== 'Gpt' || !player.vivant) return null;

    const systemPrompt = `
Tu es ${player.nom} (${player.perso}), rôle secret: ${player.role}.
Tu joues UNIQUEMENT ton personnage.
Tu n'écris QUE tes dialogues ou actions (1-2 phrases max).
Si tu es le meurtrier, tu te fais passer pour bienveillant.
Respecte l'ADN comme carnet de bord.
`;

    const userPrompt = `
ADN{
${JSON.stringify(partie.adn, null, 2)}
}

Réagis à la dernière interaction dans la scène avec Toi.
`;

    return await askGPT(systemPrompt, userPrompt);
}

// Activation du buzz
function activateBuzz() {
    partie.adn.Buzz = "actif";
    partie.adn.buzzActive = true;
    buzz.classList.add('active');
    buzzInfo.textContent = "Le buzz est ACTIF. Un choix peut tuer.";
}

// Gestion des boutons joueurs (limiter la sélection aux boutons joueurs)
const playerButtons = document.querySelectorAll('#player-buttons button');
playerButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        playerButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const raw = btn.id.replace('btn-', '');
        /*ViewedPlayer = raw.charAt(0).toUpperCase() + raw.slice(1);
        loadPlayerParams();*/
        if (mode !== 'mj') return;
        User1is = raw.charAt(0).toUpperCase() + raw.slice(1);
        loadPlayerParams(User1is);
        updateCardPlayer();
    });
});
// Charger les params du joueur
function loadPlayerParams(playerKey = User1is) {
    const player = partie.adn[playerKey];
    if (!player || typeof player !== 'object') return;

    paramName.value = player.nom;
    paramRole.value = player.role;
    paramPerso.value = player.perso;
    paramType.value = player.type;
    paramScene.value = player.scene;
    paramVivant.checked = player.vivant;
}

// Sauvegarder les params
saveParams.addEventListener('click', () => {
    const player = partie.adn[ViewedPlayer];
    player.nom = paramName.value;
    player.perso = paramPerso.value;
    player.type = paramType.value;
    player.scene = paramScene.value;
    player.vivant = paramVivant.checked;
    // Mise à jour des boutons si nom change
    const btnEl = document.getElementById(`btn-${ViewedPlayer.toLowerCase()}`);
    if (btnEl) btnEl.textContent = `Joueur ${ViewedPlayer.replace('J', '')} (#${player.nom})`;

    // Enregistrer modification dans l'historique et mettre à jour l'UI
    partie.history.push({
        sender: 'System',
        message: `✏️ ${partie.adn[ViewedPlayer]?.nom ?? ViewedPlayer} a modifié ses paramètres.`,
        target: null
    });
    updateCardPlayer();
    showMessages();
});

// Envoi de message
sendBtn.addEventListener('click', async () => {
    const message = messageInput.value.trim();
    if (!message) return;

    const target = (currentSalle !== 'J1' && currentSalle !== 'SallePublic') ? currentSalle : null;
    partie.history.push({ sender: 'J1', message, target });
    showMessages();
    messageInput.value = '';

    if (target) {
        // Conversation privée
        const response = await getIAResponse(target);
        if (response) {
            partie.history.push({ sender: target, message: response, target: 'J1' });
            showMessages();
        }
    } else {
        // Publique, répondre les autres si GPT et vivants
        for (let salle of ['J2', 'J3']) {
            const response = await getIAResponse(salle);
            if (response) {
                partie.history.push({ sender: salle, message: response, target: null });
            }
        }
        showMessages();
    }
});

// Gestion du buzz
buzz.addEventListener('click', () => {
    if (!partie.adn.buzzActive) return;
    const msg = "👉 Tu appuies sur le buzz.";
    partie.history.push({ sender: 'System', message: msg, target: null });
    if (partie.adn.J3.vivant) {
        const killMsg = "💥 PAN ! Michel est démasqué comme meurtrier.";
        partie.history.push({ sender: 'System', message: killMsg, target: null });
        partie.adn.J3.vivant = false;
    }
    buzz.disabled = true;
    showMessages();
});

///////////Toujours visible Salle/Perso/////////
function renderPlayerPresentation() {
    const presentation = document.getElementById('player-presentation');

    const players = Object.entries(partie.adn)
        .filter(([k, v]) => v.nom)
        .map(([k, v], i) => `
      <p>
        <strong>J${i + 1} – ${v.nom}</strong><br>
        ${v.perso}<br>
        ${v.vivant ? '🫀 Vivant' : '☠️ Mort'}
      </p>
    `)
        .join('');

    presentation.innerHTML = `<h3>Personnages</h3>${players}`;
}

/////////////////// Autorisations   //////////////////////////////
function applyPermissions() {
    const isMJ = mode === 'mj';

    // Écriture
    messageInput.disabled = !isMJ && currentSalle !== 'J1' && currentSalle !== 'SallePublic';

    // Buzz = gameplay → jamais caché
    buzz.style.display = 'block';
    buzzNext.style.display = 'block';
    // Paramètres joueurs
    // playerParams.style.display = isMJ ? 'block' : 'none';
    // Boutons TB visibles en MJ seulement
    // document.getElementById('player-buttons').style.display = isMJ ? 'flex' : 'none';
    document.getElementById('player-buttons').style.display =
        mode === 'mj' ? 'flex' : 'none';
    // Bouton Vue J# uniquement MJ
    toggleUserBtn.style.display =
        mode === 'mj' ? 'inline-block' : 'none';

}
async function NewPartie(nom) {
    const prompt = `
Voici l'ADN actuel :
${JSON.stringify(partie.adn, null, 2)}

Le joueur ${nom} abandonne.
Redéfinis un nouveau scénario cohérent.
Renvoie UNIQUEMENT un nouvel ADN JSON.
`;

    const newAdn = await askGPT(
        "Tu es un maître du jeu narratif.",
        prompt
    );

    partie.adn = JSON.parse(newAdn);
    partie.history = [];
    updateCardPlayer();
    updateSalle(); // Ajouté pour rafraîchir les dots après nouvelle partie
    showMessages();
}
function toggleSalle() {
    // mode = mode === 'joueur' ? 'mj' : 'joueur';
    //buzzNext.textContent = mode === 'mj' ? 'MJ' : 'Joueur';
}
////////////////Gestion Salle ///////////////////////////////////
function nextSalle() {
    const index = salleOrder.indexOf(currentSalle);
    currentSalle = salleOrder[(index + 1) % salleOrder.length];
    partie.adn.currentSalle = currentSalle;
    /*if (playerKeys.includes(currentSalle)) {
        //ViewedPlayer = currentSalle;
        loadPlayerParams();
        playerButtons.forEach(b => b.classList.remove('active'));
        const el = document.getElementById(`btn-${currentSalle.toLowerCase()}`);
        if (el) el.classList.add('active');
    } else {
        playerButtons.forEach(b => b.classList.remove('active'));
    }*/
    updateRoomInfo();
    updateSalle(); // Ajouté pour rafraîchir les dots lors du changement de salle
    showMessages();
}

function updateViewPlayer() {
    loadPlayerParams();
}
function updateCardPlayer() {
    renderPlayerPresentation();

    const canEdit = mode === 'mj' || mode === 'joueur';

    playerParams.style.display = canEdit ? 'block' : 'none';

    if (canEdit) {
        loadPlayerParams(User1is);
    }

    const title = document.getElementById('params-title');
    title.textContent =
        mode === 'mj'
            ? `Paramètres – ${User1is}`
            : 'Mes paramètres';
}
//////////////Présentation Joueur///////////////////
function canEditPlayer(playerKey) {
    if (mode === 'mj') return true;
    return playerKey === 'J1'; // joueur local
}
function updateCardPlayerButtons() {
    playerKeys.forEach((key, i) => {
        const btn = document.getElementById(`btn-${key.toLowerCase()}`);
        const p = partie.adn[key];
        if (!btn || !p) return;

        btn.textContent = `Joueur ${i + 1} (#${p.nom})`;
    });
}
////////////Joueur local Supabase /////////////////
/*function getLocalPlayer() {
    return 'J1'; // pour l’instant navigateur = J1
}*/
function updateRoomInfo() {
    const info = document.getElementById('room-info');
    let title = '';
    let scene = '';
    if (currentSalle === 'SallePublic') {
        title = 'Salle Publique';
        scene = partie.adn.SallePublic;
    } else {
        const player = partie.adn[currentSalle];
        title = `${currentSalle} (${player.nom})`;
        scene = player.scene;
    }
    info.innerHTML = `<h2>${title} – ${scene}</h2>`;
    const joueurs = Object.entries(partie.adn)
        .filter(([k, v]) => playerKeys.includes(k) && typeof v === 'object' && v.scene === scene && v.vivant)
        .map(([k, v]) => v.nom)
        .join(', ');
    info.innerHTML += `<p>👥 ${joueurs || 'Tout le monde'}</p>`;
}
////////Aff. Salle en couurs /////////////////////////////
function updateSalle() {
    const title = document.getElementById('room-title');
    const dots = document.getElementById('room-dots');

    /*title.textContent =
        currentSalle === 'SallePublic'
            ? `Salle commune – ${partie.adn.SallePublic}`
            : `Salle ${currentSalle.replace('J', '')}`;*/

    dots.innerHTML = '';

    salles.forEach(salle => {
        const dot = document.createElement('span');
        dot.className = 'room-dot';
        dot.textContent = salle === 'SallePublic' ? 'Salle commune' : `Salle ${salle.replace('J', '')}`;
        if (salle === currentSalle) dot.classList.add('active');

        dots.appendChild(dot);
    });
}
////////Abandon//////////////////////////////////////
function openAbandonModal() {
    overlay.style.display = 'block';
    modal.style.display = 'block';
}

function closeAbandonModal() {
    overlay.style.display = 'none';
    modal.style.display = 'none';
}

// Initialisation
function init() {
    const welcome = "🎬 Bienvenue dans Tralala. Tu es l’Animateur (Justicier). Sélectionne une salle ou reste en public.";
    partie.history.push({ sender: 'System', message: welcome, target: null });
    showMessages();
    loadPlayerParams();
    updateCardPlayerButtons();
    updateCardPlayer();
    applyPermissions();
    updateRoomInfo();
    updateSalle(); // Ajouté pour générer les dots au démarrage
    setTimeout(activateBuzz, 5000);
}
document.getElementById('abandon-btn').addEventListener('click', //async () => { await abandonnerPartie(partie.adn.J1.nom); }
    () => openAbandonModal());
init();
