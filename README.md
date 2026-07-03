# CỔ ĐẠO — Gu World RPG

Game RPG Web lấy cảm hứng từ Cổ Chân Nhân.  
Monorepo: shared types → backend API (Express) → frontend (React + PhaserJS).

---

## 🚀 Deploy lên Render (không cần Docker)

### 1. Push repo lên GitHub

### 2. Render Dashboard → Blueprints → New Blueprint

- Kết nối GitHub repo của bạn
- Chọn file `render.yaml` (đã có sẵn)
- Render tự động tạo:
  - **co-dao-backend** — Web Service (API + phục vụ Frontend)
  - **co-dao-postgres** — PostgreSQL 17 (managed)

### 3. Push database schema

Sau khi deploy thành công, mở Shell trên Render Dashboard và chạy:

```bash
npm run db:push -w backend
```

### 4. Truy cập

- **App:** `https://co-dao-backend.onrender.com`
- **API Health:** `https://co-dao-backend.onrender.com/api/health`

### Kiến trúc

```
Trình duyệt ──► co-dao-backend (Render Web Service)
                    │
                    ├── /api/*     → Express API
                    ├── /          → React SPA (frontend/dist)
                    └── Socket.IO  → Real-time gameplay
                    
                co-dao-postgres (Render Managed PG)
```

Backend tự động phục vụ frontend trong production — **không cần static site riêng**, không cần CORS config.

---

## 💻 Local Development (không cần Docker)

### Yêu cầu

- Node.js 22+
- PostgreSQL 17 (cài local hoặc dùng [Neon](https://neon.tech) free)
- Redis 7 (optional — app chạy được nếu không có)

### Cài đặt

```bash
# 1. Clone repo
git clone <repo-url>
cd co-dao

# 2. Install dependencies
npm install

# 3. Copy env file
cp backend/.env.example backend/.env

# 4. Sửa DATABASE_URL trong backend/.env
#    Trỏ đến PostgreSQL của bạn

# 5. Push database schema
npm run db:push -w backend

# 6. Chạy development
npm run dev
# → Backend:  http://localhost:3000
# → Frontend: http://localhost:5173 (có proxy /api → backend)
```

### Scripts

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy backend + frontend cùng lúc (dev mode) |
| `npm run dev:backend` | Chỉ backend (port 3000) |
| `npm run dev:frontend` | Chỉ frontend (port 5173, proxy tới backend) |
| `npm run build` | Build backend + frontend cho production |
| `npm run start:backend` | Chạy backend production (sau khi build) |
| `npm run typecheck` | Kiểm tra TypeScript toàn bộ |
| `npm run lint` | Kiểm tra ESLint |
| `npm run db:push` | Push Drizzle schema lên DB |

### Không dùng Docker?

Dự án **không yêu cầu Docker hay WSL**. Chỉ cần:

1. Node.js 22+
2. PostgreSQL (local hoặc cloud — [Neon](https://neon.tech) free tier)

Chạy `npm run dev` là xong.

> `docker-compose.yml` được giữ lại cho ai thích dùng Docker — xem file để biết thêm.

---

## 📁 Cấu trúc dự án

```
co-dao/
├── render.yaml                  # Render Blueprint (1-click deploy)
├── docker-compose.yml           # Docker Compose (legacy, optional)
├── package.json                 # npm workspaces root
│
├── shared/                      # Shared types — @co-dao/shared
│   └── src/index.ts
│
├── backend/                     # Express API — @co-dao/backend
│   ├── .env.example             # Mẫu biến môi trường
│   └── src/
│       ├── index.ts             # Entry point
│       ├── app.ts               # Express app + Socket.IO + static serve
│       ├── config/index.ts      # Config từ environment
│       ├── database/            # Drizzle ORM + Redis
│       ├── middleware/          # Auth, Error handling
│       ├── auth/                # Register, Login, JWT
│       ├── player/              # Player CRUD + Stats
│       ├── world/               # Map, Portal
│       ├── npc/                 # NPC + Dialogue
│       ├── quest/               # Quest system
│       └── inventory/           # Inventory system
│
└── frontend/                    # React + PhaserJS — @co-dao/frontend
    └── src/
        ├── api/                 # API client (relative URLs)
        ├── store/               # Zustand stores
        ├── game/                # PhaserJS scenes
        └── pages/               # React pages
```

---

## 🛠 Tech Stack

| Tầng | Công nghệ |
|------|-----------|
| Frontend | React 19, Vite 6, TailwindCSS 3, PhaserJS 3.80 |
| State | Zustand 5, TanStack Query 5 |
| Backend | Express 4.21, Socket.IO 4.8 |
| Database | PostgreSQL 17, Drizzle ORM 0.38 |
| Cache | Redis 7 (optional) |
| Auth | JWT + bcryptjs |
| Validation | Zod 3.24 |
| Deploy | Render (Blueprint — single Web Service) |
