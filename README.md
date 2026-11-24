# 🎮 GameArena – Gaming Tournament Management Platform

A full-stack web application for organizing gaming tournaments, managing player
registrations, scheduling matches, and publishing results and leaderboards.

Built as a college-level full-stack web development project using the
**MongoDB, Express, Node.js** stack with a **Bootstrap 5** frontend.

---

## 📌 Project Objectives

- Organize gaming tournaments
- Manage player registrations
- Schedule tournament matches
- Maintain live leaderboards
- Publish tournament results

---

## 🧰 Tech Stack

| Layer          | Technology                     |
|----------------|---------------------------------|
| Frontend       | HTML5, CSS3, JavaScript, Bootstrap 5 |
| Backend        | Node.js, Express.js            |
| Database       | MongoDB Atlas, Mongoose         |
| Authentication | JWT, bcrypt.js                  |
| Tools          | VS Code, Git & GitHub, Postman  |

---

## 📁 Folder Structure

```
gamearena/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/                # Business logic
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── tournamentController.js
│   │   ├── registrationController.js
│   │   ├── matchController.js
│   │   ├── leaderboardController.js
│   │   ├── resultController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── auth.js                # JWT protect + role authorize
│   │   └── errorHandler.js
│   ├── models/                    # Mongoose schemas
│   │   ├── User.js
│   │   ├── Tournament.js
│   │   ├── Registration.js
│   │   ├── Match.js
│   │   ├── Leaderboard.js
│   │   └── Result.js
│   ├── routes/                    # Express routers
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── tournamentRoutes.js
│   │   ├── registrationRoutes.js
│   │   ├── matchRoutes.js
│   │   ├── leaderboardRoutes.js
│   │   ├── resultRoutes.js
│   │   └── dashboardRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # App entry point
│
├── frontend/
│   ├── css/style.css
│   ├── js/
│   │   ├── api.js                 # All fetch() calls to the backend
│   │   └── auth.js                # Session, navbar, toast helpers
│   ├── index.html                 # Home page
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html             # Role-based (organizer / player)
│   ├── tournaments.html           # List + search + filter + pagination
│   ├── tournament-details.html
│   ├── create-tournament.html
│   ├── edit-tournament.html
│   ├── registrations.html         # Approve/reject players
│   ├── matches.html               # Schedule matches + update results
│   ├── leaderboard.html
│   ├── results.html
│   └── profile.html
│
├── docs/
│   ├── database-setup.md
│   └── deployment-guide.md
│
└── README.md
```

This follows the **MVC (Model–View–Controller)** pattern on the backend:
**Models** (data/schema) → **Controllers** (logic) → **Routes** (endpoints),
with **Middleware** handling authentication and error formatting.

---

## 🗄️ Database Collections

| Collection      | Purpose                                                |
|------------------|--------------------------------------------------------|
| `users`          | Organizer & Player accounts                            |
| `tournaments`    | Tournament details created by organizers                |
| `registrations`  | Links players to tournaments, with approval status      |
| `matches`        | Scheduled matches, scores, and winners                  |
| `leaderboards`   | Per-tournament player stats (auto-updated after matches)|
| `results`        | Final champion / runner-up / rankings per tournament     |

See [`docs/database-setup.md`](docs/database-setup.md) for schema details.

---

## 🔐 User Roles

### Organizer
- Create / Edit / Delete tournaments
- View registered players & approve/reject registrations
- Schedule matches & assign players
- Update match scores and winners
- Publish final tournament results
- View Organizer Dashboard (tournaments, players, registrations, upcoming matches)

### Player
- Register / Login
- Browse & search tournaments
- Register for a tournament (join / cancel)
- View match schedule
- View live leaderboard
- View tournament results
- View Player Dashboard (registered tournaments, upcoming matches, results)

---

## 🔌 REST API Reference

Base URL: `http://localhost:5000/api`

### Auth
| Method | Endpoint         | Access  | Description            |
|--------|------------------|---------|-------------------------|
| POST   | `/auth/register` | Public  | Create a new account     |
| POST   | `/auth/login`     | Public  | Login and receive JWT    |
| POST   | `/auth/logout`    | Private | Stateless logout notice  |
| GET    | `/auth/me`        | Private | Get logged-in user       |

### Users
| Method | Endpoint            | Access  | Description        |
|--------|---------------------|---------|---------------------|
| PUT    | `/users/profile`     | Private | Update own profile   |
| GET    | `/users/:id`         | Private | Get a user by id     |

### Tournaments
| Method | Endpoint                     | Access             | Description                        |
|--------|-------------------------------|--------------------|--------------------------------------|
| GET    | `/tournaments`                | Public             | List, with `search`, `game`, `status`, `page`, `limit` query params |
| GET    | `/tournaments/:id`             | Public             | Tournament details                    |
| POST   | `/tournaments`                 | Organizer          | Create tournament                     |
| PUT    | `/tournaments/:id`              | Organizer (owner)  | Update tournament                     |
| DELETE | `/tournaments/:id`              | Organizer (owner)  | Delete tournament                     |
| GET    | `/tournaments/organizer/mine`   | Organizer          | List my tournaments                   |

### Registrations
| Method | Endpoint                             | Access             | Description                  |
|--------|----------------------------------------|--------------------|--------------------------------|
| POST   | `/registrations/:tournamentId`         | Player             | Join a tournament               |
| PUT    | `/registrations/cancel/:id`             | Player (owner)     | Cancel registration              |
| PUT    | `/registrations/:id/approve`            | Organizer          | Approve a player                 |
| PUT    | `/registrations/:id/reject`             | Organizer          | Reject a player                  |
| GET    | `/registrations/tournament/:tournamentId` | Organizer        | View registered players          |
| GET    | `/registrations/mine`                   | Player             | My registrations                 |

### Matches
| Method | Endpoint                        | Access    | Description               |
|--------|-----------------------------------|-----------|-----------------------------|
| POST   | `/matches`                        | Organizer | Create/schedule a match      |
| GET    | `/matches/tournament/:tournamentId`| Public   | Match schedule                |
| PUT    | `/matches/:id`                     | Organizer | Update schedule/players       |
| PUT    | `/matches/:id/result`               | Organizer | Update scores & winner (also updates leaderboard) |

### Leaderboard
| Method | Endpoint                     | Access | Description         |
|--------|-------------------------------|--------|-----------------------|
| GET    | `/leaderboard/:tournamentId`   | Public | Ranked leaderboard     |

### Results
| Method | Endpoint                         | Access    | Description                 |
|--------|------------------------------------|-----------|-------------------------------|
| POST   | `/results/:tournamentId/publish`   | Organizer | Publish final results          |
| GET    | `/results/:tournamentId`            | Public    | View published results         |

### Dashboard
| Method | Endpoint             | Access    | Description         |
|--------|-----------------------|-----------|-----------------------|
| GET    | `/dashboard/organizer` | Organizer | Organizer stats        |
| GET    | `/dashboard/player`    | Player    | Player stats            |

---

## ▶️ Getting Started (Local Setup)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later)
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)
- [Git](https://git-scm.com/) (optional, for version control)
- [Postman](https://www.postman.com/) (optional, for testing APIs)

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# then edit .env and paste your MongoDB Atlas connection string
npm run dev        # starts the server with nodemon (or: npm start)
```
The API will run at `http://localhost:5000`.

### 3. Frontend Setup
The frontend is plain HTML/CSS/JS — no build step needed.

**Option A (recommended): let Express serve it**
The backend already serves the `frontend/` folder as static files
(see `server.js`), so once the backend is running you can simply open:
```
http://localhost:5000
```

**Option B: open directly / use Live Server**
Open `frontend/index.html` with the VS Code "Live Server" extension
(or any static file server). Make sure the backend is running separately
on port 5000, since `frontend/js/api.js` calls `http://localhost:5000/api`.

### 4. Create Test Accounts
- Register once as an **Organizer** to create tournaments.
- Register again (different email) as a **Player** to join tournaments.

See [`docs/database-setup.md`](docs/database-setup.md) for full MongoDB Atlas setup steps,
and [`docs/deployment-guide.md`](docs/deployment-guide.md) for deploying online.

---

## ✨ Key Features Implemented

- JWT authentication with bcrypt password hashing
- Role-based access control (Organizer / Player) via middleware
- Full CRUD for tournaments (MVC architecture)
- Player registration workflow with organizer approval/rejection
- Match scheduling and score/winner updates
- Automatic leaderboard updates when match results are entered
- Automatic result publishing (Champion / Runner-Up / Third Position / Final Rankings)
- Organizer & Player dashboards with live stats
- Search tournaments by name/game, filter by game/status, and pagination
- Toast notifications, Bootstrap form validation, responsive Bootstrap 5 UI
- Centralized error handling middleware

---

## 🎓 Notes for Viva / Submission

- The project strictly follows **MVC architecture** on the backend: routes call
  controllers, controllers use models, and middleware guards access.
- Passwords are **never stored in plain text** — `bcrypt` hashes them before saving
  (see the `pre('save')` hook in `models/User.js`).
- Authentication uses **JWT** — the token is generated at login/register and must
  be sent as `Authorization: Bearer <token>` on protected routes (handled
  automatically by `frontend/js/api.js`).
- The **Leaderboard** collection is updated automatically inside
  `matchController.updateMatchResult()` — no manual step is needed.
- Every collection is linked by ObjectId references (e.g. a `Registration`
  references both a `Tournament` and a `User`), matching how relational foreign
  keys work, but using MongoDB's document model.

---

## 📷 Screenshots

Screenshot placeholders — replace with actual screenshots after running the app:

- `docs/screenshots/home.png` – Home page
- `docs/screenshots/tournaments.png` – Tournament listing with search/filter
- `docs/screenshots/dashboard-organizer.png` – Organizer dashboard
- `docs/screenshots/matches.png` – Match scheduling
- `docs/screenshots/leaderboard.png` – Leaderboard
- `docs/screenshots/results.png` – Tournament results

---

## 📄 License

This project was created for educational purposes as part of a college
full-stack web development submission. Free to use and modify.
