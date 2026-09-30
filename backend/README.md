# ForgeCV Backend

## Setup
```bash
cp .env.example .env   # fill in secrets
npm install
npm run dev
```

## Environment Variables
See `.env.example` for all variables. Required: `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `SMTP_USER`, `SMTP_PASS`. AWS vars are optional (S3 upload disabled if empty).

## Scripts
| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon (hot-reload) |
| `npm start` | Start in production mode |

## Endpoints
```
POST   /api/auth/register
POST   /api/auth/verify-otp
POST   /api/auth/resend-otp
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
PATCH  /api/auth/profile
PATCH  /api/auth/password

GET    /api/resumes
POST   /api/resumes
GET    /api/resumes/:id
DELETE /api/resumes/:id
POST   /api/resumes/:id/analyze
POST   /api/resumes/:id/rewrite
GET    /api/resumes/:id/diff

GET    /api/dashboard
GET    /api/insights
GET    /api/versions
GET    /api/history
```
