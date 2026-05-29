# Cloud Master

A full-stack resource hub for IT, cloud, and DevOps professionals. Browse and discover courses, books, documentation, practice exams, and certification guides across major technology domains.

🌐 **[cloud-master.io](https://cloud-master.io)**

---

## Tech Stack

**Frontend** — React, Vite, Redux Toolkit, Axios  
**Backend** — Node.js, Express, Mongoose  
**Database** — MongoDB Atlas  
**Auth** — JWT  
**CI/CD** — Jenkins  
**Metrics** — Prometheus (prom-client)

---

## Project Structure

```
cloud-master-full-stack/
├── cloud-master-io/      # React/Vite frontend
└── node-backend/         # Node/Express REST API
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB instance)

### Backend

```bash
cd node-backend
npm install
```

Create a `.env` file (never commit this):

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=24h
PORT=5500
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

### Frontend

```bash
cd cloud-master-io
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5500
```

```bash
npm run dev
```

---

## Features

- Browse resources by category and topic
- Filter by type (course, book, documentation, practice exam, study guide, video, tool)
- Filter by difficulty (beginner, intermediate, advanced)
- Admin dashboard for adding, editing, and removing resources
- JWT-based authentication for admin access

## Categories

Foundations · Operating Systems · DevOps · Cloud · Web Development · Programming · Databases

---

## Roadmap

- [ ] Expanding resource content across all categories
- [ ] User accounts and saved resources
- [ ] Community contributions and ratings
- [ ] Search functionality

---

## License

MIT