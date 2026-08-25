# ⚡ Aether Portfolio - Cinematic Angular & Firebase Portfolio Engine

A high-performance, responsive cinematic portfolio web application engineered with **Angular 18**, **TypeScript**, **RxJS**, and **Firebase Authentication / Firestore**.

---

## 🌟 Key Features & Capabilities

- **Cinematic Dark UI & Aesthetics**: Glassmorphic cards, dynamic gradient typography, ambient background mesh canvas, and smooth interactive states.
- **Public Portfolio Sections**:
  - **Hero & Interactive Stats**: Overview of deliverables, core capabilities, and live statistics.
  - **Blogs & Insights**: Searchable, tag-filterable blog listing with reading view and persistent **"Mark as Read / Seen"** tracking per visitor.
  - **Projects Showcase**: Interactive project grid with technology tags, live demo links, and GitHub repository links.
  - **Achievements & Awards**: Recognitions, hackathon victories, and milestones.
  - **Certificates & Credentials**: Verified professional certifications with direct credential validation links.
  - **Technical Skills Matrix**: Visual proficiency indicators and category filtering.
- **Role-Based Admin Access & Security**:
  - **Firebase OAuth Login**: Seamless Google OAuth & Admin password login integration.
  - **Protected Admin Dashboard**: Restricted route guards (`adminGuard`) permitting only authenticated site owners to **Create, Read, Update, and Delete (CRUD)** blogs, projects, achievements, certificates, and skills.
  - **Backend Security Rules**: Declarative `firestore.rules` enforcing public read and admin-only write permissions.

---

## 🏗️ Clean Architecture & Directory Structure

The application follows Angular's modular standalone component architecture:

```
src/
├── app/
│   ├── core/                       # Singleton Services, Guards & Configuration
│   │   ├── config/
│   │   │   └── firebase.config.ts  # Firebase initialization & SDK providers
│   │   ├── guards/
│   │   │   └── admin.guard.ts     # Route guard restricting /admin routes
│   │   ├── models/
│   │   │   └── portfolio.model.ts # TypeScript interfaces (Blog, Project, etc.)
│   │   └── services/
│   │       ├── auth.service.ts    # Firebase OAuth & Email session manager
│   │       └── content.service.ts # Portfolio CRUD state & local storage sync
│   ├── features/                   # Core Feature Views
│   │   ├── admin/                 # Admin Login & CRUD Management Dashboard
│   │   ├── blogs/                 # Public Blog Reader & "Mark as Read" feature
│   │   ├── home/                  # Cinematic Hero, Stats & Featured sections
│   │   ├── projects/              # Projects Showcase
│   │   ├── achievements/          # Achievements & Awards
│   │   └── certificates/          # Verified Credentials
│   └── shared/                    # Reusable Layout Components
│       └── components/            # Ambient BG, Responsive Navbar, Footer
└── styles.scss                    # Global Cinematic CSS Variables & Mixins
```

---

## 🔒 Security Model & Firestore Security Rules

To ensure strict data integrity, Firestore rules (`firestore.rules`) enforce role-based authorization:

1. **Unauthenticated Public Users**:
   - Granted **Read-only** access to blogs, projects, achievements, certificates, and skills.
2. **Authenticated Admins**:
   - Granted full **Write privileges** (Create, Update, Delete) across all collections.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v22.x` or later
- **npm**: `v11.x` or later

### 2. Installation
```bash
npm install
```

### 3. Development Server
```bash
npm start
# App will launch on http://localhost:4200
```

### 4. Running Tests
```bash
npx ng test --watch=false --browsers=ChromeHeadless
```

### 5. Production Build
```bash
npm run build
```

---

## 🔑 Demo Admin Credentials

For fast demonstration and sandbox evaluations:
- **Admin Email**: `admin@cinematic-portfolio.com`
- **Password**: `admin`
- Alternatively, click the **"⚡ One-Click Demo Admin Login"** button on the `/admin/login` page or sign in via **Google OAuth**.
