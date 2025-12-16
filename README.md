# Mini proyecto full-stack

Stack: frontend con React + Vite + TypeScript, backend con Node.js + Express + TypeScript, base de datos SQLite usando Prisma.

## Requisitos
- Node.js 18+
- npm

## Configuración rápida
1) Instala dependencias en ambos paquetes:
```bash
npm install
```

2) Copia variables de entorno:
```bash
cd backend && cp .env.example .env && cd ..
cd frontend && cp .env.example .env && cd ..
```
(En Windows sin `cp`, copia manualmente los archivos .env.example a .env.)

3) Genera Prisma y base de datos inicial:
```bash
cd backend
npx prisma migrate dev --name init
```

4) Inicia front y back en paralelo desde la raíz:
```bash
npm run dev
```
- API: http://localhost:4000
- Frontend: http://localhost:5173

## Scripts útiles
- Desde la raíz: `npm run dev` levanta frontend y backend.
- Backend:
  - `npm run dev` (hot reload con ts-node-dev)
  - `npm run build` / `npm start`
  - `npm run prisma:migrate` / `npm run prisma:generate`
- Frontend:
  - `npm run dev`
  - `npm run build`
  - `npm run preview`

## Docker
- Requisitos: Docker y Docker Compose.
- Arrancar todo: `docker compose up --build` desde la raíz.
  - Frontend: http://localhost:5173
  - Backend: http://localhost:4000
- Datos: SQLite se guarda en el volumen `db-data` en `/data/dev.db` dentro del contenedor.

## Endpoints principales
- `GET /health`
- `GET /api/items`
- `POST /api/items` body: `{ "title": "texto" }`
- `PATCH /api/items/:id` body: `{ "done": true|false }`
- `DELETE /api/items/:id`

## Notas
- Usa SQLite en `backend/dev.db` (definido en `.env`).
- Ajusta `VITE_API_URL` en `frontend/.env` si cambias el puerto del backend.
