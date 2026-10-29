# 🚀 ApplyFlow — Job Application Tracker

ApplyFlow is a full-stack web application designed for job seekers to organize, track, and analyze their job search pipeline. Built with **React + Vite** on the frontend, **Node.js + Express** on the backend, and **MongoDB Atlas** for the database.

---

## 🌟 Key Features

1. **Interactive Metrics Dashboard**: View key stats at a glance — Total Applications, Active Pipeline, Interviews, and Offers Received.
2. **Comprehensive Job Tracking**: Track Company Name, Job Title, Location, Application Date, Status, Job Type, Job Posting URL, and Notes.
3. **Smart Search & Filters**: Search in real-time across company names, roles, locations, and notes. Filter by status (*Applied, Reviewing, Interview, Offer, Rejected*) or job type (*Full-time, Part-time, Contract, Internship, Remote*).
4. **CSV Export**: Export your entire application pipeline into a spreadsheet with one click.
5. **Sample Demo Data**: Includes a one-click seed feature that populates realistic applications for immediate testing.
6. **Modern Light-Theme UI**: Responsive layout featuring a sidebar, summary cards, status badges, and an applications table.
7. **Production Security**: Protected with Helmet security headers, rate limiting, request size restrictions, strict CORS, and server-side input validation.
8. **Automated CI/CD**: Pre-configured GitHub Actions pipeline that verifies backend syntax and compiles frontend assets.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | Fast, responsive Single Page Application (SPA) |
| **Icons** | Lucide React | Clean icons |
| **Backend** | Node.js + Express.js | RESTful API server with rate limiting & validation |
| **Database** | MongoDB Atlas / Mongoose | Cloud NoSQL database with fallback in-memory store |
| **CI/CD** | GitHub Actions | Automated build and test workflow |
| **Frontend Hosting** | Netlify | Static site hosting with SPA redirects |
| **Backend Hosting** | Render | Managed cloud web service |

---

## 📁 Project Structure

```text
applyflow/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI pipeline
├── client/                      # React + Vite frontend
│   ├── public/
│   │   ├── favicon.svg          # App logo favicon
│   │   └── _redirects           # Netlify SPA routing fallback
│   ├── src/
│   │   ├── components/
│   │   │   ├── ApplicationModal.jsx    # Add / Edit modal
│   │   │   ├── ApplicationTable.jsx    # Table with status tabs & filters
│   │   │   ├── DeleteConfirmModal.jsx  # Deletion confirmation
│   │   │   ├── Header.jsx              # Search, stats & actions
│   │   │   ├── Sidebar.jsx             # Navigation & metrics widget
│   │   │   ├── SummaryCards.jsx        # 4 dashboard metric cards
│   │   │   └── ViewModal.jsx           # Application details view
│   │   ├── services/
│   │   │   └── api.js                  # Frontend API client
│   │   ├── utils/
│   │   │   ├── exportCsv.js            # CSV export utility
│   │   │   └── formatters.js           # Date and status badge formatters
│   │   ├── App.jsx                     # Main component state & orchestration
│   │   ├── App.css                     # Custom light theme design system
│   │   ├── index.css                   # Global resets
│   │   └── main.jsx                    # React DOM entry
│   ├── .env.example                    # Client env variables template
│   ├── index.html                      # HTML template
│   ├── netlify.toml                    # Netlify deployment configuration
│   ├── package.json                    # Frontend dependencies & scripts
│   └── vite.config.js                  # Vite dev server & proxy settings
├── server/                      # Node.js + Express backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                   # MongoDB Atlas connection & status
│   │   ├── controllers/
│   │   │   └── applicationController.js# CRUD + stats logic
│   │   ├── middleware/
│   │   │   ├── errorHandler.js         # Centralized error handler
│   │   │   ├── rateLimiter.js          # Express rate limiting
│   │   │   └── validator.js            # Input validation with express-validator
│   │   ├── models/
│   │   │   └── Application.js          # Mongoose application schema
│   │   ├── routes/
│   │   │   ├── applicationRoutes.js    # /api/applications endpoints
│   │   │   └── healthRoutes.js         # /api/health endpoint
│   │   └── seed/
│   │       └── seedData.js             # Realistic sample data & seed script
│   ├── .env.example                    # Server env variables template
│   ├── package.json                    # Server dependencies & scripts
│   └── server.js                       # HTTP server entry point
├── .gitignore                   # Excludes .env, node_modules, dist
├── package.json                 # Root convenience scripts
├── render.yaml                  # Render deployment blueprint
└── README.md                    # Beginner-friendly documentation
```

---

## ⚡ Quick Start (Local Setup for Beginners)

Follow these steps to run ApplyFlow on your computer.

### Step 1: Prerequisites
Make sure you have installed:
- **Node.js** (v18.0 or newer) — verify with `node -v`
- **Git** — verify with `git --version`

---

### Step 2: Configure the Backend Environment
1. In the `server` folder, create your `.env` file from the provided `.env.example`:
   ```bash
   cd server
   cp .env.example .env
   ```
   *(On Windows PowerShell, run: `Copy-Item .env.example .env`)*

2. Open `server/.env` and review the contents:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/applyflow?retryWrites=true&w=majority
   CORS_ORIGIN=http://localhost:5173
   ```
   > 💡 **Tip for quick testing**: If you don't have a MongoDB Atlas account yet, the backend includes an **intelligent fallback mode** that lets you immediately interact with sample data in memory while you set up Atlas!

---

### Step 3: Install Dependencies
Open two terminal windows (or run these sequentially from the project root):

**Backend Dependencies:**
```bash
cd server
npm install
```

**Frontend Dependencies:**
```bash
cd client
npm install
```

---

### Step 4: Start the Servers

**Terminal 1 — Start the Backend:**
```bash
cd server
npm run dev
# or: npm start
```
*Your backend will start at `http://localhost:5000`.*
*Health check endpoint: `http://localhost:5000/api/health`.*

**Terminal 2 — Start the Frontend:**
```bash
cd client
npm run dev
```
*Vite will start the client at `http://localhost:5173`.*

---

### Step 5: Explore the Application
Open **`http://localhost:5173`** in your browser. You can:
1. Click **"Sample Data"** in the top navigation bar to populate realistic applications.
2. Filter applications using the summary cards or the status tabs (*Applied, Reviewing, Interview, Offer, Rejected*).
3. Search by company, role, or notes.
4. Click **"New Application"** to record an application.
5. Click **"Export CSV"** to download your pipeline as a spreadsheet.

---

## 🔒 Security Best Practices Implemented

- **Helmet**: Adds security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options) to protect against XSS, clickjacking, and MIME-sniffing.
- **Strict CORS**: Server accepts requests only from explicitly approved origins defined in `CORS_ORIGIN`.
- **Rate Limiting**: `express-rate-limit` prevents brute force and DoS attacks by capping requests per IP (200 requests/15 mins for reads, 100 requests/15 mins for writes).
- **Request Size Limiting**: `express.json({ limit: '10kb' })` blocks payload stuffing attacks.
- **Server-Side Validation**: `express-validator` validates required fields, dates, URL formats, and enum choices before saving.
- **Environment Isolation**: Database credentials and secrets are kept in `.env` files which are excluded from Git via `.gitignore`.
- **Zero Frontend Secrets**: No backend credentials or database keys are ever packaged into frontend code.

---

## 📡 API Reference

### Health Check
- **`GET /api/health`**
  Returns server uptime, environment, and MongoDB connection status.
  ```json
  {
    "status": "healthy",
    "service": "ApplyFlow Backend API",
    "uptime": "120s",
    "timestamp": "2026-10-29T17:30:00.000Z",
    "database": {
      "provider": "MongoDB Atlas",
      "status": "connected",
      "connected": true
    }
  }
  ```

### Applications
- **`GET /api/applications`**
  Fetch applications. Supports optional query parameters:
  - `?search=<term>` — Search by company, title, location, or notes
  - `?status=<status>` — Filter by *Applied*, *Reviewing*, *Interview*, *Offer*, *Rejected*
  - `?jobType=<type>` — Filter by *Full-time*, *Part-time*, *Contract*, *Internship*, *Remote*
  - `?sort=date_desc|date_asc|company_asc|company_desc` — Sort order

- **`GET /api/applications/stats`**
  Returns total applications, active count, interview count, and offer count for the dashboard.

- **`GET /api/applications/:id`**
  Get details for a single application by ID.

- **`POST /api/applications`**
  Create a new job application.
  ```json
  {
    "company": "Stripe",
    "jobTitle": "Full Stack Engineer",
    "location": "Remote",
    "applicationDate": "2026-10-29",
    "status": "Applied",
    "jobType": "Full-time",
    "jobPostingUrl": "https://stripe.com/jobs/123",
    "notes": "Referred by John Doe."
  }
  ```

- **`PUT /api/applications/:id`**
  Update an existing job application by ID.

- **`DELETE /api/applications/:id`**
  Delete a job application by ID.

- **`POST /api/applications/seed`**
  Seed or reset the database with realistic sample applications.

---

## 🌐 Step-by-Step Production Deployment Guide

Follow this beginner-friendly guide to deploy your full-stack app live to the internet.

### Part 1: Set Up Free MongoDB Atlas Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Click **Create a Cluster** and choose the **M0 Free Tier**.
3. Under **Database Access**, create a database user:
   - Username: `applyflow_user`
   - Password: `<a_strong_password>`
   - Role: **Read and write to any database**
4. Under **Network Access**, click **Add IP Address**:
   - Choose **Allow Access from Anywhere** (`0.0.0.0/0`) so Render's cloud servers can connect.
5. In your cluster dashboard, click **Connect** -> **Drivers** -> **Node.js**:
   - Copy the connection string. It looks like:
     `mongodb+srv://applyflow_user:<password>@cluster0.xxxxx.mongodb.net/applyflow?retryWrites=true&w=majority`
   - Replace `<password>` with your database user password.

---

### Part 2: Deploy Backend on Render
1. Push your project to a GitHub repository.
2. Sign in to [Render](https://render.com).
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. Configure the service:
   - **Name**: `applyflow-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
6. Click **Advanced** -> **Add Environment Variable**:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `MONGODB_URI` = *(paste your MongoDB Atlas connection string from Part 1)*
   - `CORS_ORIGIN` = `http://localhost:5173` *(we will add the Netlify URL once deployed)*
7. Click **Create Web Service**.
8. Once the build finishes, Render gives you a live URL like:
   `https://applyflow-api.onrender.com`
9. Verify the deployment by visiting:
   `https://applyflow-api.onrender.com/api/health`
   You should see `"status": "healthy"` and `"connected": true`!

---

### Part 3: Deploy Frontend on Netlify
1. Sign in to [Netlify](https://www.netlify.com).
2. Click **Add new site** -> **Import an existing project** -> **GitHub**.
3. Select your repository.
4. Set the build configurations:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
5. Click **Environment variables** -> **Add a variable**:
   - Key: `VITE_API_URL`
   - Value: `https://applyflow-api.onrender.com/api` *(your Render backend URL with `/api`)*
6. Click **Deploy ApplyFlow**.
7. Netlify will build your site and give you a live URL (e.g. `https://applyflow-tracker.netlify.app`).

---

### Part 4: Connect Backend CORS with Netlify
1. Go back to your **Render** dashboard -> `applyflow-api` -> **Environment**.
2. Update the `CORS_ORIGIN` variable to include your Netlify site URL:
   `CORS_ORIGIN=https://applyflow-tracker.netlify.app,http://localhost:5173`
3. Click **Save Changes**. Render will automatically re-deploy with your approved frontend domain.
4. Open your Netlify site in your browser — your full-stack job application tracker is now live!

---

## 🤖 Continuous Integration (GitHub Actions)

A GitHub Actions workflow is pre-configured at `.github/workflows/ci.yml`.

Whenever you push code or open a pull request to `main`, GitHub Actions will automatically:
1. Spin up a clean Ubuntu virtual machine.
2. Install Node.js 20 & 22.
3. Install backend dependencies and perform syntax integrity checks (`npm test`).
4. Install frontend dependencies and build the production Vite bundle (`npm run build`).
5. Ensure zero compilation or syntax errors occur before merging.

---

## 📄 License
MIT License. Open source and free for personal and educational use.
