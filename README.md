# ForgeCV — AI Resume Roaster & ATS Optimization Platform

AI-powered resume checker that scores resumes against ATS criteria, surfaces actionable issues and strengths, extracts keyword gaps, generates bullet point rewrites with Gemini AI, tracks version diffs, exports polished PDFs, and provides full history & analytics — built with Express, MongoDB, React 19, and Tailwind CSS v4.

---

## Local Setup

### 1. Backend Setup
```bash
cd backend
cp .env.example .env   # Fill in MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm install
npm run dev            # Server runs at http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
cp .env.example .env   # Sets VITE_API_BASE_URL=http://localhost:5000/api
npm install --legacy-peer-deps
npm run dev            # Client runs at http://localhost:5173
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Express backend server port |
| `MONGO_URI` | — | MongoDB Atlas connection string |
| `JWT_SECRET` | — | Secret string for signing JWT tokens |
| `JWT_EXPIRES_IN` | `7d` | Access token expiration period |
| `CLIENT_URL` | `http://localhost:5173` | Allowed origin for CORS & cookies |
| `GEMINI_API_KEY` | — | Google Generative AI API key |
| `GEMINI_MODEL` | `gemini-2.5-flash` | Gemini model ID |
| `AWS_REGION` | — | S3 bucket region (optional) |
| `AWS_ACCESS_KEY_ID` | — | AWS Access Key ID (optional) |
| `AWS_SECRET_ACCESS_KEY` | — | AWS Secret Access Key (optional) |
| `S3_BUCKET` | — | S3 Bucket name (optional) |
| `SMTP_HOST` | `smtp.gmail.com` | SMTP host for OTP emails |
| `SMTP_PORT` | `587` | SMTP port |
| `SMTP_USER` | — | SMTP username (console logs OTP if empty) |
| `SMTP_PASS` | — | SMTP password |
| `MAIL_FROM` | `ForgeCV <no-reply@forgecv.app>` | Outbound email sender header |

---

## Deployment Notes

### Frontend Deployment (Vercel)
- Root Directory: `frontend`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables: Set `VITE_API_BASE_URL` to your production backend URL (e.g. `https://api.forgecv.app/api`).
- SPA Routing: Handled automatically via `frontend/vercel.json` SPA rewrite rules.

### Backend Deployment (Render / Railway)
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables: Configure all required backend environment variables in the host dashboard.
- **Cross-Site Cookies Note**: Set `CLIENT_URL` to your Vercel frontend domain (e.g. `https://forgecv.vercel.app`). In production (`NODE_ENV=production`), cookies are set with `sameSite: "none"` and `secure: true` for HTTPS cookie delivery.

---

## License
MIT License © 2026 ForgeCV
