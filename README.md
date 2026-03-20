# LinguaShop - Shopify Translation App

AI-powered language translation app for Shopify stores using Lingva Translate.

## Project Structure

```
linguashop/
├── frontend/           # React + Vite (Deploy on Vercel)
│   ├── src/
│   ├── dist/          # Built output
│   ├── package.json
│   └── vercel.json
│
├── backend/            # Node.js + Express (Deploy on Railway/Render)
│   ├── server.js
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── package.json
│
└── api/               # Vercel Serverless Functions (Optional)
    ├── translate.js
    └── settings.js
```

---

## Deployment Guide

### Option 1: Separate Deploy (Recommended)

#### Frontend → Vercel
```bash
cd frontend
vercel
vercel --prod
```

**Vercel Dashboard Settings:**
```
Root Directory:          frontend
Framework Preset:        Other
Build Command:           npm install && npm run build
Output Directory:        dist
```

#### Backend → Railway (Free)
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repo
3. Select `backend` folder
4. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://...
   APP_URL=https://your-frontend.vercel.app
   ```
5. Deploy!

#### Backend → Render
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `node server.js`

---

### Option 2: All on Vercel (Serverless)

#### Deploy Everything on Vercel

```bash
# Root directory me ye settings use karo:
vercel.json:
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1.js" },
    { "source": "/(.*)", "destination": "/frontend/dist/$1" }
  ]
}
```

---

## Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
cp .env.example .env  # Add your values
npm run dev
```

---

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
```

### Backend (.env)
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/linguashop
APP_URL=http://localhost:3000
LINGVA_URL=https://lingva.ml/api/v1
SHOPIFY_API_KEY=your_key
SHOPIFY_API_SECRET=your_secret
```

---

## API Endpoints

- `POST /api/translate` - Translate text
- `GET /api/settings` - Get settings
- `GET /api/settings/languages` - Get languages
- `GET /api/usage` - Get usage stats
- `GET /api/widget` - Widget status

---

## Shopify App Setup

1. Create app at [partners.shopify.com](https://partners.shopify.com)
2. Add credentials to backend `.env`
3. Configure App URLs:
   - App URL: `https://your-frontend.vercel.app`
   - Redirect URL: `https://your-backend.railway.app/auth/callback`

---

## License

MIT
