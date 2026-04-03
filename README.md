# Electra Trace — PCB BOM Management System

Electra Trace is a full-stack PCB Bill of Materials (BOM) management system.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MySQL 8

## Project Structure

- `backend/` — API server, SQL schema + seed scripts
- `frontend/` — React app UI

## Backend Setup

1. Configure environment using `backend/.env`.
2. Run `backend/schema.sql` in MySQL.
3. Run `backend/seed.sql` for sample data.
4. Start backend with `npm run dev` inside `backend`.

## Frontend Setup

1. Copy `frontend/.env.example` to `frontend/.env`.
2. Start frontend with `npm run dev` inside `frontend`.

## Troubleshooting

- Ensure MySQL is running and credentials in `backend/.env` are correct.
- Ensure `VITE_API_BASE_URL` points to backend API (default `http://localhost:5000/api`).
