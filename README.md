# Notes App

A full-stack notes management web application built with Node.js, Express, PostgreSQL, and React. It supports secure user authentication, rich text editing, note organization (pinning, archiving, soft deletion), Pino logging, global error handling, automated testing, and SonarQube quality analysis.

---

## Tech Stack

- **Backend:** Node.js, Express 5, PostgreSQL (`pg`), JWT (`jsonwebtoken`), bcryptjs, Pino logger, Swagger UI
- **Frontend:** React 19, TypeScript, Vite, TipTap Rich Text Editor, Lucide Icons, Axios
- **Testing:** Mocha, Chai, Sinon, Supertest (Backend) | Jest, React Testing Library (Frontend)
- **Code Quality:** SonarQube / SonarCloud configuration, ESLint

---

## Key Features

- **Authentication & Authorization:** Secure signup and login with JWT access and refresh tokens, cookie-based session management, and protected routes.
- **Rich Text Notes:** Create and update notes with formatted text (headings, bold, italics, lists, code blocks) using TipTap editor.
- **Note Management:** Categorize notes with color accents, pin important notes, archive completed notes, and soft-delete/restore notes from trash.
- **Search & Filtering:** Fast client-side note searching across title and content with dedicated tabs (*All*, *Pinned*, *Archived*, *Trash*).
- **Application Logging:** Structured JSON logging with `pino` and `pino-http` tracking requests, status codes, and error events.
- **API Documentation:** Interactive Swagger documentation available at `/api/docs`.

---

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # DB pool, schema, Swagger configuration
│   │   ├── controllers/     # Auth and Note controller handlers
│   │   ├── middleware/      # Auth, validation, and error middlewares
│   │   ├── models/          # PostgreSQL query layers
│   │   ├── routes/          # Express route definitions
│   │   ├── utils/           # JWT, password, and Pino logger utilities
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   └── tests/               # Mocha / Chai backend tests
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, NoteCard, Modal, RichTextEditor
│   │   ├── pages/           # Login, SignUp, Dashboard, NoteDetail
│   │   ├── lib/             # Axios instance & TypeScript types
│   │   └── __tests__/       # Jest component tests
├── sonar-project.properties  # SonarQube analysis configuration
└── .github/workflows/       # CI workflows (SonarQube scan)
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database instance

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/notes_db
DB_SSL_REJECT_UNAUTHORIZED=false
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
LOG_LEVEL=info
```

Run the backend:
```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```
*The database schema tables and triggers are automatically initialized on server startup.*

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

---

## Running Tests

### Backend Tests (Mocha + Chai)
```bash
cd backend
npm test
```

### Frontend Tests (Jest)
```bash
cd frontend
npm test
```

---

## API Documentation

Once the backend is running, open your browser and navigate to:
```
http://localhost:5000/api/docs
```
This serves the interactive Swagger UI covering all authentication and notes endpoints.

---

## SonarQube Integration

Code quality scanning is configured using `sonar-project.properties` at the repository root and automated through GitHub Actions (`.github/workflows/sonar.yml`).


