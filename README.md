# LinguaShop - Shopify Translation App

AI-powered language translation app for Shopify stores using Lingva Translate (Google Translate wrapper).

## Features

- Translate Shopify stores into 100+ languages
- Floating language switcher widget
- Real-time translation
- No API key required (uses free Lingva Translate)
- Demo mode available

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Vercel Serverless Functions
- **Translation**: Lingva Translate API (free)

## Vercel Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/linguashop.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect settings from `vercel.json`

3. **Environment Variables** (Optional)
   ```
   LINGVA_URL=https://lingva.ml/api/v1
   APP_URL=https://your-app.vercel.app
   ```

4. **Configure Shopify**
   - Add App URL and Redirect URL in Shopify Partner Dashboard
   - App URL: `https://your-app.vercel.app`
   - Redirect URL: `https://your-app.vercel.app/api/auth/callback`

## Local Development

```bash
# Install dependencies
cd frontend
npm install

# Start frontend
npm run dev

# Build for production
npm run build
```

## API Endpoints

- `POST /api/translate` - Translate text
- `GET /api/settings` - Get app settings
- `GET /api/settings/languages` - Get supported languages
- `GET /api/usage` - Get usage statistics
- `GET /api/widget` - Get widget status

## Project Structure

```
linguashop/
├── api/              # Vercel serverless functions
│   ├── translate.js
│   ├── settings.js
│   ├── usage.js
│   ├── widget.js
│   └── auth.js
├── frontend/         # React frontend
│   ├── src/
│   │   ├── pages/
│   │   └── utils/
│   └── dist/         # Built output
├── vercel.json       # Vercel configuration
└── package.json
```

## License

MIT
