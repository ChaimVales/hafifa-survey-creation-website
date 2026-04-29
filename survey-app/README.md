# 📋 Survey Builder

> **Mini Google-Forms** — Create, share and analyze surveys.
>
> Fullstack project: React + TypeScript + MongoDB + Docker + nginx.

---

## 🌐 Live Demo

```
http://localhost
```

(After running `docker compose up`)

---

## 🛠 Tech Stack

### Frontend
- **React 18** + **TypeScript** — UI library with type safety
- **Vite** — Fast dev server & build tool
- **MUI v6** — Material UI components with **RTL support** (Hebrew)
- **React Router v6** — Client-side routing
- **Axios** — HTTP client with interceptors

### Backend
- **Node.js 20** + **Express** — Server framework
- **TypeScript** — Type-safe development
- **Mongoose** — MongoDB ODM
- **bcrypt** — Password hashing
- **jsonwebtoken** — JWT authentication
- **nanoid** — Unique slug generation

### Database
- **MongoDB 7** (via Docker) — Primary database
- **MongoDB Atlas** (optional) — Cloud-managed alternative

### Infrastructure
- **Docker** + **docker-compose** — Containerization
- **nginx** (Alpine) — Reverse proxy + static file serving
- **Multi-stage Dockerfile** — Optimized image size (~25MB for client)

### Testing
- **Jest** + **Supertest** — Server-side tests
- **mongodb-memory-server** — In-memory DB for tests

---

## 📁 Project Structure

```
survey-app/
├── client/                          # React frontend
│   ├── src/
│   │   ├── api/client.ts           # Axios instance with interceptors
│   │   ├── components/             # Reusable components
│   │   ├── context/AuthContext.tsx # Auth state management
│   │   ├── pages/                  # Page-level components
│   │   ├── types/                  # Shared TypeScript types
│   │   ├── App.tsx                 # Routes
│   │   └── main.tsx                # MUI Theme + RTL setup
│   ├── Dockerfile                  # Multi-stage (Node → nginx)
│   └── nginx.conf                  # nginx config (proxy /api/*)
│
├── server/                          # Express backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts              # Environment variables
│   │   │   └── db.ts               # MongoDB connection
│   │   ├── models/                 # Mongoose schemas
│   │   ├── routes/                 # Express routers
│   │   ├── controllers/            # HTTP handlers
│   │   ├── services/               # Business logic
│   │   ├── middleware/             # auth + errorHandler
│   │   ├── validators/             # Request validation
│   │   ├── app.ts                  # Express setup
│   │   └── index.ts                # Entry point
│   ├── tests/                       # Jest tests
│   └── Dockerfile
│
└── docker-compose.yml               # 3 services: mongo + server + client
```

---

## 🚀 Quick Start

### Prerequisites
- **Docker Desktop** installed and running
- **Git** (to clone)

### Run with Docker (Recommended)

```bash
# 1. Clone the repo
git clone <repo-url>
cd survey-app

# 2. Create .env file (in project root)
cp .env.example .env
# Edit .env if needed (especially JWT_SECRET)

# 3. Start everything
docker compose up --build
```

### Access
- 🌐 **Web app:** http://localhost
- 🔗 **API:** http://localhost/api/health

That's it! 🎉

---

## 🔑 Environment Variables

Create `.env` in project root:

```env
# JWT Secret (REQUIRED)
JWT_SECRET=your-random-secret-string-min-20-chars

# MongoDB URI (OPTIONAL - if not set, uses Docker mongo)
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

### Using MongoDB Atlas (Cloud) Instead of Local

If you want to use MongoDB Atlas instead of the Docker mongo container:

1. Create cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Get connection string
3. Add to `.env`:
```env
   MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/surveys
```

The app will automatically use Atlas instead of the Docker mongo.

---

## 📚 API Documentation

Base URL: `http://localhost/api`

### Auth

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/auth/register` | ❌ | `{email, name, password}` | `201 {token, user}` |
| POST | `/auth/login` | ❌ | `{email, password}` | `200 {token, user}` |
| GET | `/auth/me` | ✅ | - | `200 user` |

### Surveys

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/surveys` | ✅ | Create new survey |
| GET | `/surveys` | ✅ | List my surveys |
| GET | `/surveys/browse` | ❌ | Public list (search/sort) |
| GET | `/surveys/:slug` | ❌ | View survey (public) |
| DELETE | `/surveys/:id` | ✅ + Owner | Delete survey |

### Responses

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/surveys/:slug/responses` | ❌ | Submit answer (public!) |
| GET | `/surveys/:id/responses` | ✅ + Owner | View results |

### Authentication

Include JWT in `Authorization` header:
```
Authorization: Bearer <token>
```

Token expires after 7 days.

---

## 💾 Database Choice — Why MongoDB?

We chose **MongoDB** for this project because:

1. **Hierarchical data** — A survey contains nested questions, each question may have nested options. This maps naturally to MongoDB documents.

2. **Flexible schema** — Different question types have different fields (`options` only for choice questions). MongoDB's schema flexibility handles this elegantly.

3. **No JOINs needed** — All survey data fits in a single document; we read it in one query.

4. **JavaScript-native** — Documents are JSON-like, perfectly matching our Node.js stack.

5. **Mongoose ODM** — Adds the structure we'd lose without (validation, indexes, types) while keeping flexibility.

### Data Models

- **User** (`users` collection) — email, name, passwordHash
- **Survey** (`surveys` collection) — ownerId, slug, title, questions[]
- **Response** (`responses` collection) — surveyId, answers[]

---

## 🧪 Running Tests

```bash
cd server
npm install
npm test
```

Tests cover:
1. ✅ User registration (happy path)
2. ✅ Duplicate email rejection (409)
3. ✅ Login with wrong password (401)
4. ✅ Protected route without token (401)
5. ✅ End-to-end flow (register → create → respond → results)

Tests use `mongodb-memory-server` — no real database needed.

---

## 💻 Development (without Docker)

### Run Backend
```bash
cd server
npm install
npm run dev    # Watches for changes
```

### Run Frontend
```bash
cd client
npm install
npm run dev    # Vite dev server on port 5173
```

> Note: When running locally, set `MONGO_URI=mongodb://localhost:27017/surveys` if you have local MongoDB, or use Atlas.

---

## 🏗 Architecture

```
Browser
   │
   ▼
http://localhost (port 80)
   │
   ▼
┌──────────────────────────────────────────┐
│  Client Container (nginx + React build)  │
│  ┌────────────────────────────────────┐  │
│  │ /api/*  →  proxy_pass server:3000  │  │
│  │ /       →  serve React SPA         │  │
│  └────────────────────────────────────┘  │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│         Server Container                 │
│   Express + TypeScript                   │
│   ┌─ Routes                              │
│   ├─ Validators (middleware)             │
│   ├─ Controllers                         │
│   ├─ Services (business logic)           │
│   └─ Models (Mongoose)                   │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│        MongoDB Container                 │
│        (or MongoDB Atlas)                │
└──────────────────────────────────────────┘
```

---

## 🎯 Features

### For Users
- 🔐 **Authentication** — Register/Login with JWT
- 📋 **Survey Creation** — Dynamic form builder with 4 question types:
  - Short text
  - Long text (textarea)
  - Single choice (radio)
  - Multi choice (checkboxes)
- 🔗 **Share by URL** — Each survey has a unique short URL (`/s/abc12345`)
- 📊 **Results Dashboard** — View aggregated results with bar charts
- 🗑 **Delete Surveys** — Cascade deletes all responses too

### For Guests
- 👤 **No registration needed** to answer surveys
- 🔍 **Browse surveys** — Public list with search and sort
- ✍️ **Submit responses** — Anonymous answering

### Security
- 🔐 Passwords hashed with **bcrypt** (10 rounds)
- 🎫 **JWT tokens** — 7-day expiration
- 🚫 `passwordHash` never returned in responses (`select: false`)
- ✅ Server-side validation (validators middleware)
- 🛡 Owner-only access to results (`ownerId` check)
- 🌐 Server not exposed externally — only nginx (port 80)

---

## 🐳 Docker Details

### Services

```yaml
services:
  mongo:    # MongoDB 7 (data persisted via volume)
  server:   # Node + Express (no exposed ports)
  client:   # nginx + React build (port 80)
```

### Multi-stage Dockerfile (client)

The client's Dockerfile uses **2 stages**:
1. **builder** (Node 20) — Runs `vite build`
2. **production** (nginx alpine) — Serves static files only

Result: ~25MB final image instead of ~300MB.

### Useful Commands

```bash
# Start (foreground, see logs)
docker compose up

# Start (background)
docker compose up -d

# Rebuild images
docker compose up --build

# View logs
docker compose logs -f server

# Stop and remove containers
docker compose down

# Stop + remove volumes (clean DB!)
docker compose down -v

# Check status
docker compose ps
```

---

## 📝 License

MIT

---

## 👤 Author

**Haim Vales**



































# 📋 Survey Builder | בונה סקרים

> **Mini Google-Forms** — Create, share and analyze surveys.<br>
> **מערכת סקרים מינימלית** — צור, שתף ונתח תשובות.
>
> Fullstack project: React + TypeScript + MongoDB + Docker + nginx.

---

## 🚀 הרצה מהירה / Quick Start

### דרישות מקדימות / Prerequisites
- **Docker Desktop** מותקן ופועל
- **Git**

### הרצה / Run

```bash
# 1. שכפל את הריפו / Clone the repo
git clone <repo-url>
cd survey-app

# 2. צור קובץ .env / Create .env
cp .env.example .env
# ערוך את JWT_SECRET / Edit JWT_SECRET

# 3. הרץ את הכל / Start everything
docker compose up --build
```

### גישה / Access
- 🌐 **האתר / Web app:** http://localhost
- 🔗 **API:** http://localhost/api/health

זהו! 🎉 / That's it!

---

## 🛠 סטאק טכנולוגי / Tech Stack

### פרונט / Frontend
- **React 18** + **TypeScript** — ספריית UI עם בטיחות טיפוסים
- **Vite** — שרת פיתוח מהיר וכלי build
- **MUI v6** — קומפוננטות Material UI עם **תמיכה ב-RTL** (עברית)
- **React Router v6** — ניהול נתיבים
- **Axios** — HTTP client עם interceptors

### שרת / Backend
- **Node.js 20** + **Express** — מסגרת השרת
- **TypeScript** — פיתוח עם טיפוסים
- **Mongoose** — ODM ל-MongoDB
- **bcrypt** — הצפנת סיסמאות
- **jsonwebtoken** — אימות JWT
- **nanoid** — יצירת slugs ייחודיים

### מסד נתונים / Database
- **MongoDB 7** (דרך Docker)
- **MongoDB Atlas** (אופציונלי) — חלופה בענן

### תשתית / Infrastructure
- **Docker** + **docker-compose** — קונטיינריזציה
- **nginx** (Alpine) — Reverse proxy
- **Multi-stage Dockerfile** — image מאופטם (~25MB ל-client)

### טסטים / Testing
- **Jest** + **Supertest**
- **mongodb-memory-server** — DB בזיכרון לטסטים

---

## 📁 מבנה תיקיות / Project Structure

```
survey-app/
├── client/                          # פרונט / Frontend
│   ├── src/
│   │   ├── api/client.ts           # axios + interceptors
│   │   ├── components/             # קומפוננטות / Components
│   │   ├── context/AuthContext.tsx # ניהול state של auth
│   │   ├── pages/                  # דפים / Pages
│   │   ├── types/                  # טיפוסים משותפים
│   │   ├── App.tsx                 # ניתובים / Routes
│   │   └── main.tsx                # MUI Theme + RTL
│   ├── Dockerfile                  # Multi-stage
│   └── nginx.conf
│
├── server/                          # שרת / Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts              # משתני סביבה
│   │   │   └── db.ts               # חיבור MongoDB
│   │   ├── models/                 # סכמות Mongoose
│   │   ├── routes/                 # ניתובי Express
│   │   ├── controllers/            # HTTP handlers
│   │   ├── services/               # לוגיקה עסקית
│   │   ├── middleware/             # auth + errorHandler
│   │   ├── validators/             # ולידציות
│   │   ├── app.ts
│   │   └── index.ts
│   ├── tests/                       # טסטים Jest
│   └── Dockerfile
│
├── docs/                            # מסמכים / Documentation
│   ├── screenshots/
│   ├── erd.png
│   └── mockup.png
│
└── docker-compose.yml               # 3 שירותים: mongo + server + client
```

---

## 🔑 משתני סביבה / Environment Variables

צור קובץ `.env` בשורש הפרויקט / Create `.env` in project root:

```env
# חובה / REQUIRED
JWT_SECRET=your-random-secret-string-min-20-chars

# אופציונלי / OPTIONAL - אם לא מוגדר, משתמש ב-Docker mongo
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

### שימוש ב-MongoDB Atlas (במקום Docker mongo)

אם רוצה להשתמש ב-Atlas:

1. צור cluster ב-[cloud.mongodb.com](https://cloud.mongodb.com)
2. קבל connection string
3. הוסף ל-`.env`:
```env
   MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/surveys
```

המערכת תזהה אוטומטית ותתחבר ל-Atlas.

---

## 📚 תיעוד API / API Documentation

Base URL: `http://localhost/api`

### אימות / Auth

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/auth/register` | ❌ | `{email, name, password}` | `201 {token, user}` |
| POST | `/auth/login` | ❌ | `{email, password}` | `200 {token, user}` |
| GET | `/auth/me` | ✅ | - | `200 user` |

### סקרים / Surveys

| Method | Endpoint | Auth | תיאור |
|--------|----------|------|-------|
| POST | `/surveys` | ✅ | יצירת סקר חדש |
| GET | `/surveys` | ✅ | רשימת הסקרים שלי |
| GET | `/surveys/browse` | ❌ | רשימה ציבורית (חיפוש/מיון) |
| GET | `/surveys/:slug` | ❌ | צפייה בסקר (ציבורי) |
| DELETE | `/surveys/:id` | ✅ + Owner | מחיקת סקר |

### תשובות / Responses

| Method | Endpoint | Auth | תיאור |
|--------|----------|------|-------|
| POST | `/surveys/:slug/responses` | ❌ | שליחת תשובה (ציבורי!) |
| GET | `/surveys/:id/responses` | ✅ + Owner | צפייה בתוצאות |

### Authentication Header

```
Authorization: Bearer <token>
```

הטוקן תקף ל-7 ימים / Token expires after 7 days.

---

## 💾 בחירת מסד הנתונים / Why MongoDB?

בחרנו ב-**MongoDB** מהסיבות הבאות:

1. **נתונים היררכיים** — סקר מכיל מערך של שאלות, ולכל שאלה יכול להיות מערך של אופציות. זה ממופה באופן טבעי למסמך MongoDB.

2. **סכמה גמישה** — סוגי שאלות שונים יש להם שדות שונים (לדוגמה, `options` רק לשאלות בחירה). הגמישות של MongoDB מתמודדת עם זה אלגנטית.

3. **אין צורך ב-JOINs** — כל נתוני הסקר נכנסים למסמך אחד. שליפה במשפט אחד.

4. **JavaScript-native** — מסמכים הם JSON, מתאים לסטאק Node.js.

5. **Mongoose** — מספק את המבנה (validation, indexes) תוך שמירה על גמישות.

### מודלי הנתונים

- **User** (collection `users`) — email, name, passwordHash
- **Survey** (collection `surveys`) — ownerId, slug, title, questions[]
- **Response** (collection `responses`) — surveyId, answers[]

---

## 🧪 הרצת טסטים / Running Tests

```bash
cd server
npm install
npm test
```

הטסטים מכסים / Tests cover:
1. ✅ הרשמת משתמש (happy path)
2. ✅ דחיית אימייל כפול (409)
3. ✅ התחברות עם סיסמה שגויה (401)
4. ✅ ניתוב מוגן ללא טוקן (401)
5. ✅ Flow מלא (register → create → respond → results)

---

## 💻 פיתוח (ללא Docker) / Development

### שרת / Backend
```bash
cd server
npm install
npm run dev    # עם hot-reload
```

### פרונט / Frontend
```bash
cd client
npm install
npm run dev    # Vite dev server על port 5173
```

---

## 🎯 פיצ'רים / Features

### למשתמשים רשומים / For Users
- 🔐 **אימות** — הרשמה והתחברות עם JWT
- 📋 **יצירת סקרים** — Form builder דינמי, 4 סוגי שאלות:
  - טקסט קצר / Short text
  - טקסט ארוך / Long text
  - בחירה בודדת / Single choice
  - בחירה מרובה / Multi choice
- 🔗 **שיתוף ע"י URL** — לכל סקר URL ייחודי קצר (`/s/abc12345`)
- 📊 **דשבורד תוצאות** — תצוגה אגרגטיבית עם גרפים
- 🗑 **מחיקה** — מוחק גם את כל התשובות (cascade)

### לאורחים / For Guests
- 👤 **בלי הרשמה** - לענות על סקרים
- 🔍 **דפדוף בסקרים** - חיפוש ומיון
- ✍️ **שליחת תשובות** - אנונימית

### אבטחה / Security
- 🔐 סיסמאות עם **bcrypt** (10 rounds)
- 🎫 **JWT** - תקף 7 ימים
- 🚫 `passwordHash` לעולם לא חוזר ב-API
- ✅ Server-side validation
- 🛡 בדיקת בעלות לפני מחיקה / צפייה בתוצאות
- 🌐 השרת לא חשוף - רק nginx (port 80)

---

## 🐳 פרטי Docker / Docker Details

### שירותים / Services

```yaml
services:
  mongo:    # MongoDB 7
  server:   # Node + Express
  client:   # nginx + React build
```

### Multi-stage Dockerfile של ה-client

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
RUN npm ci && npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

תוצאה: image סופי של ~25MB במקום ~300MB.

### פקודות שימושיות / Useful Commands

```bash
# הפעלה / Start (with logs)
docker compose up

# הפעלה ברקע / Start (background)
docker compose up -d

# בנייה מחדש / Rebuild
docker compose up --build

# לוגים / Logs
docker compose logs -f server

# עצירה / Stop
docker compose down

# עצירה + מחיקת DB / Stop + remove volumes
docker compose down -v

# סטטוס / Status
docker compose ps
```

---

## 📸 צילומי מסך / Screenshots

ראה תיקייה `docs/screenshots/` / See `docs/screenshots/` folder.

---

## 📝 רישיון / License

MIT

---

## 👤 מחבר / Author

**Haim Vales**