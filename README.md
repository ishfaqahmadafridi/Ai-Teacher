# 🧠 NEUROLEARN — Next-Gen Multi-Discipline AI Education & Learning Platform

An enterprise-grade, hybrid monorepo platform delivering intelligent, real-time adaptive education, voice-guided AI tutoring, interactive visual studio, and automated step-by-step problem solving across 26+ academic disciplines.

---

## 🌟 Architecture & Highlights

### ⚡ Hybrid Microservice Backend
* **Django REST Engine (`backend/django_app/`)**: Source of truth for PostgreSQL ORM, JWT authentication, student profiles, academic course registrations, and admin portals.
* **FastAPI Async Engine (`backend/fastapi_app/`)**: Ultra-fast ASGI service for real-time Server-Sent Events (SSE), sub-200ms token streaming, interactive canvas rendering, and AI model inference.
* **Shared Modules (`backend/shared/`)**: Domain contracts, constants, and enums shared seamlessly across services.
* **Nginx Reverse Proxy (`infra/nginx/`)**: Enterprise gateway routing `/api/*` to Django REST, `/ai/*` to FastAPI, and `/` to Next.js.

### 🎨 Modular Five-Folder Frontend (`frontend/src/`)
* **Next.js 15 & React 19**: App Router architecture with Turbopack compilation.
* **Five-Folder Rule**: Strict decoupled separation of concerns across features (`intro`, `dashboard`, `classroom`, `ask`, `auth`, `onboarding`):
  - `components/` — Pure UI presentation templates with `memo()` and `displayName`
  - `hooks/` — Encapsulated state, handlers, and side-effects
  - `utilities/` — Pure helper functions and math engines
  - `constants/` — Static mock data and configuration objects
  - `types/` — Canonical TypeScript interface contracts
* **Lumina Dark Mode Theme**: High-aesthetic dark UI featuring neon cyan & purple glow effects, glassmorphism, floating formula canvases, and particle networks.

### 📚 Comprehensive Academic Coverage (26+ Disciplines)
* **Computer Science & AI**: Programming, Software Engineering, Algorithms, Machine Learning.
* **Medical & Healthcare**: Anatomy, Genetics, Biology, Clinical Studies.
* **Pure & Applied Sciences**: Mathematics, Physics, Chemistry, Molecular Dynamics.
* **Humanities & Social Sciences**: Economics, World History, Legal Studies, Global Languages.
* **Business & Professional**: Finance, Accounting, Career Acceleration, Exam & SAT Prep.

---

## 🛠️ Technology Stack

| Domain | Technologies Used |
| :--- | :--- |
| **Frontend Core** | Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS |
| **State & Hooks** | Custom React Hooks · Redux Toolkit (RTK) · Context API |
| **Design System** | Lumina Dark Mode · Glassmorphism · Custom CSS Keyframes |
| **Primary Backend** | Python 3.12 · Django REST Framework (DRF) · PostgreSQL · SQLite |
| **AI Inference Backend**| FastAPI · Uvicorn (ASGI) · LangChain · Google Gemini 2.5 API |
| **Vector DB & RAG** | ChromaDB · pgvector · HuggingFace Embeddings |
| **Infrastructure** | Docker · Docker Compose · Nginx Reverse Proxy |

---

## 📐 System Architecture

```
                  ┌─────────────────────────────────────┐
                  │          Client Browser             │
                  │   (Next.js 15 App Router Frontend)  │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │        Nginx Gateway (:8080)        │
                  └──────────┬──────────────────┬───────┘
                             │                  │
               /api/*        │                  │ /ai/*
                             ▼                  ▼
             ┌───────────────────────┐  ┌───────────────────────┐
             │   Django REST Engine  │  │ FastAPI Async Engine  │
             │       (:8000)         │  │       (:8001)         │
             └───────────┬───────────┘  └───────────┬───────────┘
                         │                          │
                         ▼                          ▼
             ┌───────────────────────┐  ┌───────────────────────┐
             │  PostgreSQL / SQLite  │  │ Vector DB (ChromaDB)  │
             └───────────────────────┘  └───────────────────────┘
```

---

## 📂 Repository Directory Layout

```
Ai-Teacher/
├── backend/
│   ├── django_app/          # Django REST API, Auth & Database ORM
│   │   ├── config/          # Django settings (local, base, production)
│   │   └── teacher/         # Modular 3-layer teacher domain package
│   ├── fastapi_app/         # Asynchronous AI Streaming & Inference API
│   │   └── app/             # FastAPI routers, core config & endpoints
│   ├── shared/              # Common Python constants and enums
│   └── docs/                # Backend API contracts & setup documentation
├── frontend/
│   └── src/
│       ├── app/             # Next.js 15 App Router pages
│       ├── features/        # Feature domains (intro, dashboard, classroom, ask, auth, onboarding)
│       │   └── <feature>/   # Enforced Five-Folder Architecture
│       │       ├── components/
│       │       ├── hooks/
│       │       ├── utilities/
│       │       ├── constants/
│       │       └── types/
│       ├── shared/          # Global UI providers and shared context
│       └── styles/          # Base, theme, animations, and glassmorphism CSS
├── infra/
│   ├── docker-compose.yml   # Multi-container deployment config
│   └── nginx/               # Reverse proxy route configuration
└── README.md
```

---

## 🚀 Quick Start Guide

### Option 1: Full-Stack Docker Deployment (Recommended)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ishfaqahmadafridi/Ai-Teacher.git
   cd Ai-Teacher
   ```

2. **Launch with Docker Compose**:
   ```bash
   cd infra
   docker compose up --build
   ```

3. **Access Services**:
   - **Frontend Application**: `http://localhost:3000`
   - **Nginx Gateway**: `http://localhost:8080`
   - **Django REST API**: `http://localhost:8000/api/`
   - **FastAPI AI Docs**: `http://localhost:8001/docs`

---

### Option 2: Local Development Setup (Manual)

#### 1. Django REST Backend (`backend/django_app`)
```bash
cd backend/django_app
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements/local.txt
python manage.py migrate
python manage.py runserver 8000
```

#### 2. FastAPI AI Inference Service (`backend/fastapi_app`)
```bash
cd backend/fastapi_app
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --port 8001 --reload
```

#### 3. Next.js 15 Frontend (`frontend`)
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 📏 Engineering Standards & Guidelines

* **Component Memoization**: Every React UI component must be wrapped with `memo()` and explicitly set a `displayName`.
* **Zero Component State**: `useState`, `useSelector`, and route navigation are strictly encapsulated within custom hooks inside `hooks/`.
* **Canonical Type Imports**: All TypeScript interfaces must be imported with `import type` directly from canonical `types/` files.
* **Pure Utilities**: Helper functions in `utilities/` must remain pure with zero React/Redux side-effects.

---

## 📜 License & Copyright

© {new Date().getFullYear()} NEUROLEARN Project. Built for high-performance multi-discipline AI education.
