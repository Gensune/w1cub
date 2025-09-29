# Webserver Backend

A production-ready **Node.js + Express + MongoDB** server.
Includes API routes, static file serving, environment-based config, and PM2 + Nginx deployment instructions for Ubuntu 24.04.

---

## Features

- **Express.js** server with middleware for logging, CORS, JSON, and security
- **MongoDB** integration via Mongoose with multi-database support
- **API routes** (example: `GET /api/hello`, `CRUD /api/todos`, `POST /api/shortener`)
- **URL Shortener** feature
- **Environment config** using `.env` + central `config.js` loader
- **PM2** for process management
- **Nginx** reverse proxy (optional)
- **SPA-ready fallback** (serves `index.html` for unknown routes)

---

## Project Structure

```
├── components/          # Reusable modules/helpers (utility code you want to share)
│  └── genTags.js
├── css/                 # Stylesheets (served as static assets if referenced)
│  └── style.css
├── db/                  # Database connection logic
│  ├── connectionManager.js
│  └── mongoose.js
├── models/              # Mongoose schemas & models
│  ├── todo.js
│  └── uri.js
├── public/              # Static assets served by Express (e.g., index.html, images)
│  └── index.html
├── routes/              # Express route handlers (API endpoints)
│  ├── api.js
│  ├── shortener.js
│  └── todos.js
├── services/            # Business logic
│  └── links.js
├── src/                 # Source scripts/utilities (non-route code, e.g., helpers)
│  ├── main.jsx
│  └── portfolio.jsx
├── .gitattributes       # Line-ending & diff rules
├── .gitignore           # Ignore node_modules, .env, logs, builds, etc.
├── README.md            # This documentation
├── config.js            # Centralized config loader (dotenv + validation)
├── package-lock.json    # Locked dependency graph (generated)
├── package.json         # App metadata, scripts, dependencies
└── server.js            # Main Express server entry point
```

---

## Requirements

- Ubuntu 24.04 (or similar Linux server)
- Node.js 20+
- npm 10+
- MongoDB 8.0+ (running locally or external)
- Nginx (for reverse proxy & TLS, optional but recommended)

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/Gensune/w1cub.git
cd w1cub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment configuration

Create a `.env` file in the project root:

```env
NODE_ENV=production
PORT=3000
MONGODB_ADM=mongodb://<user>:<password>@127.0.0.1:27017/todo_app?authSource=admin
MONGODB_SHORT=mongodb://<user>:<password>@127.0.0.1:27017/shortener_app?authSource=admin
```

### 4. Run locally

```bash
node server.js
```

Visit:

- API: [http://127.0.0.1:3000/api/hello](http://127.0.0.1:3000/api/hello)

---

## MongoDB Setup

Inside the Mongo shell (`mongosh`):

```js
use todo_app
db.createUser({
  user: "app_user",
  pwd:  passwordPrompt(),
  roles: [{ role: "readWrite", db: "todo_app" }]
})

use shortener_app
db.createUser({
  user: "app_user",
  pwd:  passwordPrompt(),
  roles: [{ role: "readWrite", db: "shortener_app" }]
})
```

Update your `.env` with these credentials.

---

## Deployment

### 1. Start with PM2

```bash
sudo npm install -g pm2
pm2 start server.js --name webserver
pm2 save
pm2 startup systemd
```

### 2. Nginx Reverse Proxy (optional)

`/etc/nginx/sites-available/webserver`

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable & restart:

```bash
sudo ln -s /etc/nginx/sites-available/webserver /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. TLS with Let’s Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## API Examples

### GET `/api/hello`

```json
{
  "message": "Hello from API 🚀",
  "time": "2025-09-03T18:00:00.000Z"
}
```

### CRUD `/api/todos`

- `GET /api/todos` → list todos
- `POST /api/todos` → create todo `{ "title": "task" }`
- `PUT /api/todos/:id` → update todo
- `DELETE /api/todos/:id` → delete todo

### POST `/api/shortener`

Create a short URL.

**Request Body:**

```json
{
  "url": "https://example.com/very/long/url/to/shorten",
  "slug": "custom-slug"
}
```

**Response:**

```json
{
  "slug": "custom-slug",
  "url": "https://example.com/very/long/url/to/shorten",
  "_id": "63f8c9b8e4b3f8e4b3f8e4b3"
}
```

### GET `/:short`

Redirects to the original URL.

---

## Development Notes

- Keep `.env` out of Git (`.gitignore` it!)
- Logs via PM2: `pm2 logs webserver`
- Mongo dumps:

  ```bash
  mongodump --uri="$MONGODB_ADM" --out=./backups/$(date +%F)
  mongodump --uri="$MONGODB_SHORT" --out=./backups/$(date +%F)
  ```
