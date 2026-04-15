# 🌱 NurseryPulse AI Chatbot

A Gemini-powered crop intelligence chatbot widget that queries your agriculture sensor data.
Floats in the **bottom-right corner** of any React website.

---

## 📁 Folder Structure

```
nurserypulse-chatbot/
├── backend/
│   ├── data/
│   │   └── crop_data.csv          ← Your agriculture dataset
│   ├── routes/
│   │   └── chat.js                ← Gemini API + data query logic
│   ├── utils/
│   │   └── dataLoader.js          ← CSV loader + statistics engine
│   ├── .env                       ← Your API key (create from .env.example)
│   ├── .env.example
│   ├── package.json
│   └── server.js                  ← Express server (port 5000)
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWidget.jsx     ← 🔑 The floating chatbot widget
│   │   │   └── ChatMessage.jsx    ← Individual chat bubble
│   │   ├── App.jsx                ← Demo page
│   │   └── index.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Setup & Run

### Step 1 — Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env

# Open .env and add your Gemini API key:
# GEMINI_API_KEY=your_actual_key_here
# PORT=5000

# Start the backend
npm run dev        # development (auto-restarts)
# or
npm start          # production
```

Backend will start at: **http://localhost:5000**

---

### Step 2 — Frontend

```bash
# In a NEW terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the React app
npm start
```

Frontend will start at: **http://localhost:3000**

> The `"proxy": "http://localhost:5000"` in `package.json` forwards `/api/*` calls to your backend automatically.

---

### Step 3 — Get your Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click **Create API Key**
3. Paste it into `backend/.env` as `GEMINI_API_KEY=...`

---

## 🔗 Integrating into Your Existing Website

To add the chatbot to **any page** in your React app, just:

```jsx
// 1. Copy the components folder into your project
// src/components/ChatWidget.jsx
// src/components/ChatMessage.jsx

// 2. Import and drop it anywhere (it positions itself fixed bottom-right)
import ChatWidget from "./components/ChatWidget";

export default function YourPage() {
  return (
    <div>
      {/* ... your existing page content ... */}

      <ChatWidget />   {/* ← That's it! */}
    </div>
  );
}
```

---

## ⚙️ API Endpoint

```
POST /api/chat
Content-Type: application/json

{
  "message": "Which crops have Critical health status?",
  "history": []   // array of {role, content} for multi-turn chat
}

Response:
{
  "reply": "Based on the dataset, 548 records (5.5%) show Critical crop health..."
}
```

---

## 🎨 Customization

### Change widget colors
Edit the `S` styles object in `ChatWidget.jsx`:
- Primary green: `#4ade80`
- Background: `#111a14`
- Border: `#1e3a22`

### Change suggestion chips
Edit the `SUGGESTIONS` array in `ChatWidget.jsx`.

### Change AI behavior
Edit `SYSTEM_INSTRUCTION` in `backend/routes/chat.js`.

### Update dataset
Replace `backend/data/crop_data.csv` with your new file.
Restart the backend — it reloads on startup.

---

## 🐞 Troubleshooting

| Problem | Fix |
|---|---|
| `Error: GEMINI_API_KEY not set` | Add key to `backend/.env` |
| `CORS error` | Make sure backend is running on port 5000 |
| `Failed to fetch` | Check backend terminal for errors |
| Blank responses | Check Gemini API quota at aistudio.google.com |
| Port conflict | Change `PORT=5001` in `.env` and update proxy in `frontend/package.json` |

---

## 📦 Dependencies

**Backend:** express, cors, dotenv, @google/generative-ai, csv-parse, nodemon

**Frontend:** react, react-dom, react-scripts (no extra UI libraries needed)
