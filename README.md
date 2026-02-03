# 🐺 jeuGarou  
Démarrage d'un projet de jeu en ligne solo/multi assisté par mailing et IA (avec multi-screen ? écrans de jeu et perso). #TvShow #Youtube-Divertissement  

## ✨ Fonctionnalités  

- ✅ **Jeu du Loup Garou** - Mécanique multi-joueurs inspirée du jeu du Loup-Garou  
- ✅ **Mode MJ vs Joueur** - Interface adaptée pour le maître de jeu ou les joueurs  
- ✅ **Personnages IA** - Joueurs virtuels contrôlés par GPT-4o-mini  
- ✅ **Système de salles** - Salle publique + salles privées par joueur  
- ✅ **Chat multi-canal** - 💬 Communication entre joueurs et IA  
- ✅ **Système de buzz** - 🔔 Mécanisme d'interruption de jeu  
- ✅ **Gestion des rôles** - 🎭 Assignation de rôles (Justicier, Acolyte, Meurtrier, etc.)  
- ✅ **Paramètres joueurs** - ⚙️ Modification des stats en temps réel  
- ✅ **Historique de partie** - 📜 Suivi des messages et actions  
- 🔄 **Multi-écrans** - 🖥️ Support pour affichage simultané de plusieurs perspectives (en développement)  

## 🛠️ Stack Technique  
- **Frontend** : HTML, CSS, JavaScript (vanilla)  
- **Backend** : Node.js avec Express (JavaScript) + FastAPI (Python)  
- **IA** : OpenAI API (GPT-4o-mini)  
- **BDD** : Supabase  
- **Package Manager** : npm  

## 🚀 Installation  

### 📋 Prérequis  
- Node.js (v16+)  
- Python 3.8+  
- Une clé API OpenAI  

### ⚙️ Configuration  

1. **Cloner le projet**  
```bash
git clone https://github.com/CADORETMatt/jeuGarou.git
cd jeuGarou
```  

2. **Installer les dépendances Node**  
```bash
npm install
```  

3. **Configurer les variables d'environnement**  
Créez un fichier `.env` à la racine avec :  
```
OPENAI_API_KEY=votre_clé_api_openai
NODE_ENV=development
```  

4. **Installer les dépendances Python (optionnel)**  
```bash
pip install fastapi uvicorn openai python-dotenv
```  

## ▶️ Démarrage  

### Option 1 : Serveur Express (Node.js)  
```bash
npm start
# ou
node env.js
```  
Le jeu sera accessible sur `http://localhost:3000` (ou le port configuré)  

### Option 2 : Serveur FastAPI (Python)  
```bash
python -m uvicorn main:app --reload
```  
L'API sera accessible sur `http://localhost:8000`  

## 🏗️ Architecture  

- `garou2.html` - Page principale du jeu  
- `jsGarou.js` - Logique principale du jeu  
- `MesFonctions.js` - Fonctions utilitaires  
- `cssGarou.css` - Styles du jeu  
- `server.js` - Serveur Express avec API chat  
- `main.py` - Serveur FastAPI alternatif  
- `Supabase.html` - Configuration Supabase  

## 🤖 Intégration GPT-4o-mini  

### 🔧 Configuration API OpenAI  
1. Créer un compte sur [OpenAI](https://platform.openai.com)  
2. Générer une clé API dans les paramètres  
3. Ajouter la clé au fichier `.env` : `OPENAI_API_KEY=sk-xxx...`  

### 🧠 Utilisation de l'IA dans le jeu  
- **Joueurs IA** : Contrôlés par GPT-4o-mini (J2, J3)  
- **Génération de scénarios** : L'IA crée des ADN cohérents au démarrage  
- **Réponses contextuelles** : Les personnages GPT réagissent aux dialogues des joueurs  
- **Chat API** : Endpoint `/chat` pour les interactions personnalisées  

## 🕹️ Utilisation  

1. Lancer le serveur (Express ou FastAPI)  
2. Ouvrir le navigateur sur `http://localhost:3000`  
3. Créer/charger une partie  
4. Le jeu communique automatiquement avec GPT pour les réponses des joueurs IA  
5. Les personnages IA réagissent en temps réel aux actions du joueur  

## 🆕 Dernières modifications  

- ✨ Intégration de ChatGPT pour générer un scénario  

## 🔮 Futures modifications envisagées  

- 🛠️ Intégrer un input pour une clé API de OpenAI  

###### Texte généré le 03/02/26 à 17::55 #################