# SRMT - Smart Research Management Tool

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/AI-Groq%20Llama%203.3-purple?style=for-the-badge" alt="Groq AI">
</p>

## 📋 Overview

**SRMT (Smart Research Management Tool)** is a comprehensive, AI-powered platform designed for researchers, academics, and research guides to manage their research projects, collaborate with team members, and leverage AI for paper analysis and integrity checks.

## ✨ Features

### 🔬 Research Project Management
- Create and manage research projects with detailed metadata
- Track project progress through research phases (Abstract → Literature Review → Methodology → Results → Conclusion)
- Assign collaborators with roles (Researcher, Guide, Reviewer)
- Link Google Docs for paper drafts

### 🤖 AI Paper Analyzer
- Powered by **Llama 3.3 70B** via Groq API
- Upload PDF files or paste text directly
- Get comprehensive analysis including:
  - Executive Summary
  - Research Objectives
  - Methodology breakdown
  - Key Findings
  - Technical Contributions
  - Limitations & Future Directions

### 🔍 Plagiarism & AI Content Checker
- AI-powered originality assessment
- AI content detection with percentage likelihood
- Citation quality analysis
- Actionable recommendations for improvement

### 👥 Collaboration Management
- View all collaborators across projects
- Filter by role, status, and organization
- Invite new collaborators via email

### 📊 Dashboard & Analytics
- Overview of all projects and their status
- Quick access to recent activities
- Project statistics and progress tracking

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, React 18, TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB Atlas |
| **AI/ML** | Groq API (Llama 3.3 70B) |
| **Authentication** | JWT (JSON Web Tokens) |
| **File Processing** | pdf-parse, Multer |

## 📁 Project Structure

```
research_management-main/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/              # App router pages
│   │   │   ├── (auth)/       # Authentication pages (login, signup)
│   │   │   └── (dashboard)/  # Dashboard pages
│   │   ├── components/       # Reusable UI components
│   │   └── services/         # API service layer
│   └── package.json
│
├── backend/                  # Express.js backend API
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Auth & validation middleware
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic (Groq AI)
│   │   └── server.ts         # Entry point
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Groq API key ([Get one free](https://console.groq.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AryanDayalani/SRMT.git
   cd SRMT
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

   Create `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GROQ_API_KEY=your_groq_api_key
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

   Create `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Run the application**

   Terminal 1 (Backend):
   ```bash
   cd backend
   npm run dev
   ```

   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get project by ID |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### AI Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analysis` | Analyze paper (text/PDF) |
| POST | `/api/analysis/plagiarism` | Check plagiarism & AI content |

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_key
GROQ_API_KEY=gsk_...
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 👨‍💻 Author

**Lucky Gupta**
- GitHub: [@LuckyGupta1712](https://github.com/LuckyGupta1712)

**Aryan Dayalani**
- GitHub: [@AryanDayalani](https://github.com/AryanDayalani)

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Made with ❤️ for researchers and academics
</p>
