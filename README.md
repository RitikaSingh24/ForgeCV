# ForgeCV

AI-powered resume checker that scores resumes against ATS systems, surfaces actionable issues and strengths, extracts keywords, rewrites bullet points with Gemini AI, tracks version diffs, exports polished PDFs, and provides history & insights — all in a clean, modern web interface.

## Local Setup

```bash
# Backend
cd backend
cp .env.example .env   # fill in secrets
npm install
npm run dev            # http://localhost:5000

# Frontend
cd frontend
cp .env.example .env
npm install
npm run dev            # http://localhost:5173
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| PORT | 5000 | Express server port |
| MONGO_URI | — | MongoDB connection string |
| JWT_SECRET | — | Secret for signing JWTs |
| JWT_EXPIRES_IN | 7d | JWT lifetime |
| CLIENT_URL | http://localhost:5173 | CORS allowed origin |
| GEMINI_API_KEY | — | Google Generative AI key |
| GEMINI_MODEL | gemini-2.5-flash | Gemini model ID |
| AWS_REGION | — | S3 region (optional) |
| AWS_ACCESS_KEY_ID | — | S3 key (optional) |
| AWS_SECRET_ACCESS_KEY | — | S3 secret (optional) |
| S3_BUCKET | — | S3 bucket name (optional) |
| SMTP_HOST | smtp.gmail.com | Outbound mail host |
| SMTP_PORT | 587 | Outbound mail port |
| SMTP_USER | — | SMTP username |
| SMTP_PASS | — | SMTP password |
| MAIL_FROM | ForgeCV <no-reply@forgecv.app> | From address |

## Deploy

- **Frontend** → Vercel (root: `forgecv/frontend`, framework: Vite). Set `VITE_API_BASE_URL` to your backend URL.
- **Backend** → Render or Railway (root: `forgecv/backend`, start: `npm start`). Add all env vars in the service dashboard.
