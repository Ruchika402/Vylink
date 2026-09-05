<div align="center">

![Header](https://capsule-render.vercel.app/api?type=waving&color=0:0F2027,50:203A43,100:2C5364&height=220&section=header&text=Vylink&fontSize=65&fontColor=00FF9C&fontAlignY=35&animation=twinkling&desc=Secure%20Image-Sharing%20Platform&descAlignY=58&descAlign=50&descSize=18&fontColor2=ffffff)

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=20&pause=1000&color=00FF9C&center=true&vCenter=true&width=600&lines=OWASP+Top+10+Compliant;JWT+%2B+Google+OAuth+Authentication;Pre-signed+S3+URLs+%7C+Rate+Limited+%7C+Encrypted)](https://git.io/typing-svg)

![License](https://img.shields.io/badge/license-MIT-00FF9C?style=flat-square)
![Status](https://img.shields.io/badge/status-in%20development-203A43?style=flat-square&labelColor=0F2027)
![OWASP](https://img.shields.io/badge/OWASP-Top%2010-2C5364?style=flat-square&labelColor=0F2027)

</div>

Vylink is a full-stack portfolio project demonstrating secure file sharing, authentication, and cloud storage integration — built to **OWASP Top 10** standards, with **pre-signed S3 URLs** for safe, time-limited file delivery.

---

## 📑 Table of Contents

- [🛡️ Security Highlights](#️-security-highlights)
- [🛠️ Tech Stack](#️-tech-stack)
- [✅ Completed Features](#-completed-features)
- [🚧 Under Construction](#-under-construction)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start-local-development)
- [📊 Project Milestones](#-project-milestones)
- [📄 License](#-license)
- [🔗 Connect](#-connect)

---

## 🛡️ Security Highlights

> The features that matter most for a project built around secure file delivery.

- 🔐 **JWT auth via `httpOnly` cookies** — no tokens exposed to client-side JS
- 🔑 **Google OAuth** — reduces password-based attack surface
- 🧹 **Bleach input sanitization** — blocks stored/reflected XSS
- 🛡️ **Full OWASP security header set** — CSP, HSTS, X-Frame-Options, nosniff
- ⏱️ **60-second expiring pre-signed S3 URLs** — no public bucket exposure, ever
- ⚡ **Rate limiting** on uploads and shares — throttles abuse and scraping

---

## 🛠️ Tech Stack

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-0F2027?style=for-the-badge&logo=tailwind-css&logoColor=00FF9C)
![Django](https://img.shields.io/badge/Django-0C4B33?style=for-the-badge&logo=django&logoColor=00FF9C)
![Python](https://img.shields.io/badge/Python-2C5364?style=for-the-badge&logo=python&logoColor=00FF9C)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-0F2027?style=for-the-badge&logo=postgresql&logoColor=00FF9C)
![Redis](https://img.shields.io/badge/Redis-203A43?style=for-the-badge&logo=redis&logoColor=00FF9C)
![AWS](https://img.shields.io/badge/AWS_S3-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=00FF9C)
![Docker](https://img.shields.io/badge/Docker-0F2027?style=for-the-badge&logo=docker&logoColor=00FF9C)

</div>

| Category   | Technology |
|------------|------------|
| Frontend   | React, TypeScript, Tailwind CSS, React Router |
| Backend    | Python, Django REST Framework |
| Database   | PostgreSQL 15 |
| Cache      | Redis 7 |
| Storage    | AWS S3 (pre-signed URLs) |
| Auth       | JWT (httpOnly cookies), Google OAuth |
| Tooling    | Docker, Docker Compose *(in progress)* |

---

## ✅ Completed Features

| Feature | Description |
|---|---|
| **JWT Authentication** | Secure login using `httpOnly` cookies to prevent XSS-based token theft |
| **Google OAuth** | Social login for quick, low-friction access |
| **Image Upload** | Drag-and-drop upload with real-time preview |
| **Shareable Links** | Unique links with configurable expiry (1 day, 7 days, never) |
| **Dashboard** | File statistics — total files, views, active links |
| **My Files** | Full file management: grid/list view, search, filter |
| **Analytics** | View and engagement tracking per shared file |
| **Security Headers** | CSP, X-Frame-Options, nosniff, HSTS for OWASP compliance |
| **Input Sanitization** | Bleach-based sanitization to prevent XSS |
| **S3 Pre-signed URLs** | Private bucket with temporary URLs (60-second expiry) |
| **Rate Limiting** | 10 uploads/min, 20 shares/min to prevent abuse |

---

## 🚧 Under Construction

| Feature | Description | Why It Matters |
|---|---|---|
| **Docker Containerization** | Dockerfiles + `docker-compose.yml` for Django, PostgreSQL, Redis, and React | Consistent local dev, simpler deployment |
| **AWS EC2 Deployment** | Deploy the full containerized stack to EC2 | Makes the app publicly accessible; demonstrates cloud skills |
| **HTTPS + SSL** | Let's Encrypt certificate, Nginx as reverse proxy | Encrypts traffic — mandatory for production |
| **Login Rate Limiting** | Fix the 5-attempts/min login limit (upload/share limits already work) | Completes brute-force protection |
| **Logging & Monitoring** | Structured logging and error tracking | Visibility into app health and user activity |
| **CI/CD Pipeline** | Automated testing and deployment via GitHub Actions | Code quality and faster releases |

---

## 🏗️ Architecture

\```
User Browser (React)
        │
        ▼  HTTPS
AWS EC2 — Nginx Reverse Proxy        ← planned
        │
        ▼  HTTP
Django REST API (Container)          ← planned
        │
        ▼
PostgreSQL & Redis (Containers)      ← planned
        │
        ▼
AWS S3 (pre-signed URLs for file access)
\```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

<details>
<summary><strong>⚙️ Backend Setup</strong></summary>

\```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
\```

</details>

<details>
<summary><strong>🎨 Frontend Setup</strong></summary>

\```bash
cd frontend
pnpm install
pnpm start
\```

</details>

<details>
<summary><strong>🔑 Environment Variables</strong></summary>

Create a `.env` file in `backend/config/`:

\```env
DJANGO_SECRET_KEY=your-secret-key
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_STORAGE_BUCKET_NAME=your-bucket-name
\```

</details>

---

## 📊 Project Milestones

| Phase | Status |
|---|---|
| Backend API (Days 1–3) | ✅ Complete |
| Frontend UI (Days 4–6) | ✅ Complete |
| Core Security (Days 7–8) | ✅ Complete |
| Cloud Storage (Day 9) | ✅ Complete |
| Docker & AWS Deployment (Days 10–11) | 📝 In Progress |
| Production Polish | 📝 Planned |

---

## 📄 License

MIT © 2026 Ruchika Adak

---

## 🔗 Connect

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-Ruchika402%2FVylink-0F2027?style=for-the-badge&logo=github&logoColor=00FF9C)](https://github.com/Ruchika402/Vylink)
![Live Demo](https://img.shields.io/badge/Live_Demo-Coming_Soon-203A43?style=for-the-badge&labelColor=0F2027)

*Built with security-first principles.*

</div>
