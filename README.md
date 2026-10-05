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

- [🌐 Live Demo](#-live-demo)
- [🛡️ Security Highlights](#️-security-highlights)
- [🛠️ Tech Stack](#️-tech-stack)
- [✅ Completed Features](#-completed-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start-local-development)
- [📊 Project Milestones](#-project-milestones)
- [🚧 Roadmap](#-roadmap)
- [⚠️ Known Limitations](#️-known-limitations)
- [📄 License](#-license)
- [🔗 Connect](#-connect)

---

## 🌐 Live Demo

| Page | Link |
|---|---|
| App | [vylink.duckdns.org](https://vylink.duckdns.org) |
| Register | [/register](https://vylink.duckdns.org/register) |
| Login | [/login](https://vylink.duckdns.org/login) |

**Try it:** register → log in → upload an image from the dashboard → create a share link with an expiry.

---

## 🛡️ Security Highlights

> The features that matter most for a project built around secure file delivery.

- 🔐 **JWT auth via `httpOnly` cookies** — no tokens exposed to - 🔐 **JWT auth via `httpOnly` cookies**: no tokens exposed to client-side JS
- 🔑 **Google OAuth**: reduces password-based attack surface
- 🔒 **HTTPS everywhere**: Let's Encrypt certificate served through Nginx, with HSTS
- 🧹 **Bleach input sanitization**: blocks stored/reflected XSS
- 🛡️ **Full OWASP security header set**: CSP, HSTS, X-Frame-Options, nosniff
- ⏱️ **60-second expiring pre-signed S3 URLs**: private bucket, no public file exposure
- ⚡ **Rate limiting** on uploads and shares: throttles abuse and scraping
- 🚫 **Access control**: users can only see and manage their own files
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
![Nginx](https://img.shields.io/badge/Nginx-0C4B33?style=for-the-badge&logo=nginx&logoColor=00FF9C)

</div>

| Category   | Technology |
|------------|------------|
| Frontend   | React, TypeScript, Tailwind CSS, React Router |
| Backend    | Python, Django REST Framework |
| Database   | PostgreSQL  |
| Cache      | Redis  |
| Storage    | AWS S3 (pre-signed URLs) |
| Auth       | JWT (httpOnly cookies), Google OAuth |
| Tooling    | Docker, Docker Compose |
| Server     | AWS EC2 (Ubuntu), Nginx reverse proxy |
| SSL        | Let's Encrypt (Certbot) |
| Domain     | DuckDNS (`vylink.duckdns.org`) |

---

## ✅ Completed Features

| Feature | Description |
|---|---|
| **JWT Authentication** | Secure login using `httpOnly` cookies to prevent XSS-based token theft |
| **Google OAuth** | Social login for quick, low-friction access |
| **Image Upload** | Drag-and-drop upload with real-time preview |
| **Shareable Links** | Unique links with configurable expiry (1 day, 7 days, never) |
| **Dashboard** | File statistics: total files, views, active links |
| **My Files** | Full file management: grid/list view, search, filter |
| **Analytics** | View and engagement tracking per shared file |
| **Security Headers** | CSP, X-Frame-Options, nosniff, HSTS |
| **Input Sanitization** | Bleach-based sanitization to prevent XSS |
| **S3 Pre-signed URLs** | Private bucket with temporary URLs (60-second expiry) |
| **Rate Limiting** | 10 uploads/min, 20 shares/min to prevent abuse |
| **Docker Containerization** | Dockerfiles and Docker Compose for the backend, PostgreSQL, Redis, and frontend |
| **AWS EC2 Deployment** | Full stack deployed on EC2 behind an Nginx reverse proxy |
| **HTTPS + Custom Domain** | Let's Encrypt certificate on a DuckDNS domain |

---

## 🏗️ Architecture

```
Browser ──HTTPS──► Nginx (EC2) ──► React UI
                       │
                       └──► Django API ──► PostgreSQL + Redis
                                │
                                └──► S3 (pre-signed URLs)
```

| Component | Role |
|---|---|
| [Nginx](https://nginx.org/) + [Let's Encrypt](https://letsencrypt.org/) | HTTPS entry point and reverse proxy on EC2 |
| [React](https://react.dev/) | Frontend UI |
| [Django REST Framework](https://www.django-rest-framework.org/) | API, JWT auth, rate limiting |
| [PostgreSQL](https://www.postgresql.org/) / [Redis](https://redis.io/) | Data storage / caching and throttling |
| [S3 pre-signed URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html) | Private bucket, temporary file access |
| [Docker Compose](https://docs.docker.com/compose/) | Runs the backend, database, and cache as containers |

---

## 🚀 Getting Started

**Just want to try it?** Use the live app: [vylink.duckdns.org](https://vylink.duckdns.org)

**Want to run it locally?** You need [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/).

```bash
# 1. Clone the repo
git clone https://github.com/Ruchika402/Vylink.git
cd Vylink

# 2. Create your env file from the template
cp backend/config/.env.example backend/config/.env

# 3. Build and start all containers
docker compose up -d --build

# 4. Set up the database
docker compose exec backend python manage.py migrate

# 5. Create an admin user
docker compose exec backend python manage.py createsuperuser
```

Fill in your values in `backend/config/.env` before step 3. See [`.env.example`](https://github.com/Ruchika402/Vylink/blob/main/backend/config/.env.example) for every variable you need (Django, database, Redis, AWS S3). Never commit your real `.env`.

Open **http://localhost:3000** and you're in.

<details>
<summary><strong>⚙️ Run without Docker</strong></summary>

Requires Python 3.11+, Node.js 18+, PostgreSQL, and Redis. In your `.env`, set the database and Redis hosts to `localhost`.

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend (new terminal)
cd frontend
pnpm install
pnpm start
```

</details>

**First steps in the app:** register → log in → upload an image → create a share link with an expiry.

---

## 📊 Project Milestones

| Phase | Status |
|---|---|
| Backend API (Django + DRF) | ✅ Complete |
| Frontend UI (React + Tailwind) | ✅ Complete |
| Core Security | ✅ Complete |
| Cloud Storage (S3 pre-signed URLs) | ✅ Complete |
| Docker Containerization | ✅ Complete |
| AWS EC2 Deployment | ✅ Complete |
| HTTPS + Domain | ✅ Complete |
| Logging & Monitoring | 📝 Planned |
| CI/CD (GitHub Actions) | 📝 Planned |

---

## 🚧 Roadmap

- [ ] Google OAuth redirect URI update for the production domain
- [ ] Fix login rate limiting (5 attempts/min)
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Structured logging and Sentry error tracking
- [ ] More unit and integration tests
- [ ] API documentation with Swagger/OpenAPI
- [ ] Custom domain to replace DuckDNS

---

## ⚠️ Known Limitations

- Login rate limiting has a bug (upload/share limits work)
- Automated tests are in progress (4 security tests implemented)
- CI/CD pipeline not yet set up

---

## 📄 License

MIT © 2026 Ruchika Adak

---

## 🔗 Connect

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live_Demo-vylink.duckdns.org-00FF9C?style=for-the-badge&labelColor=0F2027)](https://vylink.duckdns.org)
[![GitHub](https://img.shields.io/badge/GitHub-Ruchika402-0F2027?style=for-the-badge&logo=github&logoColor=00FF9C)](https://github.com/Ruchika402)

*Built with security-first principles.*

</div>
