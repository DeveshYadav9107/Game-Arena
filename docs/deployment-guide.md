# Deployment Guide

This guide covers deploying GameArena so it's accessible outside your local
machine. Two common free-tier options are described: **Render** (backend) with
**Netlify/Vercel or GitHub Pages** (frontend), and an **all-in-one Render Web
Service** approach (simplest, recommended for a college submission).

---

## Option A (Recommended for submission): Single Render Web Service

Since `backend/server.js` already serves the `frontend/` folder as static
files, you can deploy the entire project as **one** service.

### 1. Push the Project to GitHub
```bash
git init
git add .
git commit -m "Initial commit - GameArena"
git branch -M main
git remote add origin https://github.com/<your-username>/gamearena.git
git push -u origin main
```

### 2. Create a Render Web Service
1. Go to https://render.com and sign up / log in.
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. Add Environment Variables (from your `.env`):
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRE`
   - `PORT` → `10000` (Render provides its own PORT variable automatically;
     Express already reads `process.env.PORT`, so this is optional)
6. Click **Create Web Service**.

### 3. Update the Frontend's API URL
Because the frontend is now served from the same domain as the backend,
change the base URL in `frontend/js/api.js`:
```js
const API_BASE_URL = '/api'; // relative path instead of http://localhost:5000/api
```
Commit and push this change — Render will redeploy automatically.

### 4. Done
Your app will be live at a URL like:
```
https://gamearena.onrender.com
```

---

## Option B: Separate Frontend & Backend Hosting

### Backend → Render / Railway / Cyclic
Same as Option A steps 1–2, but keep **Root Directory** as `backend` and do
**not** serve the frontend folder (you can remove the
`express.static(...)` line in `server.js` if you want a pure API server).

### Frontend → Netlify / Vercel / GitHub Pages
1. In `frontend/js/api.js`, set:
   ```js
   const API_BASE_URL = 'https://your-backend-url.onrender.com/api';
   ```
2. Deploy the `frontend/` folder:
   - **Netlify:** drag-and-drop the `frontend` folder in the Netlify dashboard,
     or connect the GitHub repo and set **Publish Directory** to `frontend`.
   - **GitHub Pages:** push `frontend/` contents to a `gh-pages` branch, or
     enable Pages on a repo with `frontend` as the root.
3. Make sure CORS is enabled in the backend (`server.js` already uses `cors()`),
   so the frontend (on a different domain) can call the API successfully.

---

## Environment Variables Checklist

| Variable      | Example                                      | Notes                          |
|---------------|-----------------------------------------------|----------------------------------|
| `MONGO_URI`   | `mongodb+srv://user:pass@cluster.../gamearena`| From MongoDB Atlas               |
| `JWT_SECRET`  | any long random string                        | Keep this secret, never commit it|
| `JWT_EXPIRE`  | `7d`                                           | Token validity period            |
| `PORT`        | `5000` (local) / auto on Render               | Server port                      |

⚠️ **Never commit your real `.env` file to GitHub.** Only `.env.example`
(without real secrets) should be committed. Add `.env` to `.gitignore`.

---

## Post-Deployment Checklist

- [ ] Registering a new Organizer and Player works
- [ ] Creating a tournament works and appears in the tournament list
- [ ] A player can register, and the organizer can approve/reject
- [ ] Matches can be scheduled and results updated
- [ ] Leaderboard updates after a match result is saved
- [ ] Publishing results shows Champion/Runner-Up/Third Position correctly
- [ ] Dashboard stats load correctly for both roles
