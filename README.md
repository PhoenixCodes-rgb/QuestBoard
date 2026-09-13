# 🌿 QuestBoard

> **Level up your productivity with distraction-free quest management, Pomodoro focus cycles, and deep work analytics.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://quest-board-zeta.vercel.app)
[![Backend API](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render)](https://questboard-backend-nxei.onrender.com)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/cloud/atlas)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

---

## 🌟 Live Demo

* **Web Application**: [https://quest-board-zeta.vercel.app](https://quest-board-zeta.vercel.app)
* **Backend API**: [https://questboard-backend-nxei.onrender.com](https://questboard-backend-nxei.onrender.com)

---

## ✨ Features

### 📋 Intelligent Task & Quest Management
* **Full CRUD Operations**: Create, view, edit, duplicate, and delete tasks with instant optimistic UI updates.
* **Priority Classification**: Categorize quests into **High**, **Medium**, and **Low** priority with dynamic color tags.
* **Interactive Date Filtering**: Navigate day-by-day with a single click or jump straight to "Today".
* **Live Search**: Instant real-time filtering across titles and descriptions.

### ⏱️ Pomodoro Focus Timer & Zen Mode
* **Flexible Timer Intervals**: Switch effortlessly between **Focus (25m)**, **Short Break (5m)**, **Long Break (15m)**, or set custom minute durations.
* **Harmonic Meditation Bell Chime**: Synthesized 4-tone crystal bell chime (**C5 → E5 → G5 → C6**) built with native Web Audio API (zero external audio dependencies).
* **"Focus on a Task" Integration**: Bind an active quest directly to your timer and tick it off with a 1-click **"Mark Done"** action upon session completion.
* **Zen Fullscreen Mode**: Expand to an uninterrupted, distraction-free focus workspace with full keyboard support (**`Esc`** to exit).
* **Daily Stats Tracker**: Automatically logs focus sessions and deep-work minutes to celebrate your streaks.

### 📅 Interactive Calendar View
* Month-by-month interactive calendar overview.
* Scheduled task indicator badges and day-specific status counts.
* Click any date to view and manage that day's scheduled quests.
* One-click **"+ Add task for this day"** shortcut pre-filling the selected date.

### 🏆 Accomplishment Hub (Completed Tasks)
* Dedicated review space celebrating your completed tasks.
* Visual completion score progress meters.
* Reactivate tasks back into your active list or permanently clear them in bulk.

### 📊 Productivity Analytics & Statistics
* **Key Performance Metrics**: Real-time KPI cards for *Total Created*, *Completed*, *In Progress*, and *Overdue*.
* **Completion Score Gauge**: Evaluates your efficiency rating with motivational productivity badges (*Master Achiever*, *Consistent Planner*, *Rising Producer*).
* **Priority Breakdown Meters**: Progress bars measuring completion ratios across High, Medium, and Low priority quests.

### 🌓 System-Wide Dark & Light Themes
* Designed around a signature **Forest Charcoal** palette (`#0f1712`, `#17231c`, `#233428`) complementing QuestBoard's brand accents (`#193b27`, `#3f8f5f`).
* Instant toggle buttons available in the Header, on the Auth page, and inside Settings.
* Respects system color preferences and persists your choice to `localStorage`.
* High-contrast inputs and browser autofill dark mode styling.

### 🔐 Secure Multi-User Authentication
* User registration and authentication powered by **JWT** (JSON Web Tokens) and **bcrypt** password encryption.
* **Complete User Isolation**: Every user account operates in a private workspace—tasks are strictly scoped to the authenticated user.
* Server connection health diagnostics with auto-retry and clear feedback banners.

---

## 🛠️ Architecture & Tech Stack

```
                     +---------------------------------------+
                     |             MongoDB Atlas             |
                     |       (Cloud Database - 24/7/365)     |
                     +-------------------+-------------------+
                                         ^
                                         | Mongoose ODM
                                         v
+------------------------+      +------------------------+
|      Vercel (CDN)      |      |     Render Web Service |
|    Frontend (React 19) | ---> |     Backend (Express)  |
|    Vite + Tailwind v4  | HTTP |     Node.js + REST API |
+------------------------+      +------------------------+
            ^
            | HTTPS
      Desktop & Mobile Users
```

### Frontend
* **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **Icons**: [React Icons (Feather Icons)](https://react-icons.github.io/react-icons/)
* **HTTP Client**: [Axios](https://axios-http.com/)
* **Sound Engine**: Web Audio API (Multi-oscillator harmonic chime)

### Backend
* **Runtime**: [Node.js](https://nodejs.org/)
* **Server Framework**: [Express 5](https://expressjs.com/)
* **Database & ODM**: [MongoDB Atlas](https://www.mongodb.com/atlas) + [Mongoose](https://mongoosejs.com/)
* **Security**: [bcryptjs](https://www.npmjs.com/package/bcryptjs) + [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) + [CORS](https://www.npmjs.com/package/cors)

---

## 🚀 Getting Started (Local Development)

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/)
* A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster connection URI or local MongoDB instance

---

### 1. Clone the Repository
```bash
git clone https://github.com/PhoenixCodes-rgb/QuestBoard.git
cd QuestBoard
```

---

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend development server:
```bash
npm run dev
```
The API server will run at `http://localhost:5000`.

---

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📡 API Endpoints

### Authentication (`/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new user account | No |
| `POST` | `/auth/login` | Authenticate user & return JWT token | No |
| `PUT` | `/auth/profile` | Update user display name or password | Yes |

### Tasks (`/tasks`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/tasks` | Fetch tasks (supports `date`, `search`, `priority` filters) | Yes |
| `POST` | `/tasks` | Create a new task | Yes |
| `PUT` | `/tasks/:id` | Update an existing task | Yes |
| `DELETE` | `/tasks/:id` | Delete a task | Yes |
| `DELETE` | `/tasks/completed/clear` | Bulk clear all completed tasks | Yes |

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
