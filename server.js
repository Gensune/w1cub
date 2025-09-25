import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import * as crypto from 'node:crypto'
import { config } from './config.js'
import { connectDB } from './db/mongoose.js'
import { promises as fs } from 'fs'
import apiRoutes from './routes/api.js'
import todoRoutes from './routes/todos.js'
import { renderLinkTags, renderScriptTags } from './components/genTags.js'

// Fix __dirname (not available in ES modules by default)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Set Content Security Policies
app.use((_req, res, next) => {
  // Asynchronously generate a unique nonce for each request.
  crypto.randomBytes(32, (err, randomBytes) => {
    if (err) {
      // If there was a problem, bail.
      next(err)
    } else {
      // Save the nonce, as a hex string, to `res.locals` for later.
      res.locals.cspNonce = randomBytes.toString('hex')
      next()
    }
  })
})

const scriptSources = [
  "'self'",
  "'strict-dynamic'",
  (_req, res) => `'nonce-${res.locals.cspNonce}'`,
  "'unsafe-inline'",
  "'unsafe-eval'"
]
const styleSources = [
  "'self'",
  'https://fonts.googleapis.com',
  'https://cdnjs.cloudflare.com',
  'https://cdn.jsdelivr.net',
  'https://jenil.github.io'
]
const connectSources = ["'self'", 'jenil.github.io', 'unpkg.com']
const fontSources = [
  "'self'",
  'https://fonts.gstatic.com',
  'https://cdnjs.cloudflare.com'
]

// Middleware
app.use(express.json()) // Parse JSON request bodies
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'))
app.use(
  cors({
    origin: 'https://w1cub.com', // only allow your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
)
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      'default-src': ["'self'"],
      'script-src': scriptSources,
      'style-src': styleSources,
      'font-src': fontSources,
      'img-src': ["'self'", 'data:'],
      'connect-src': connectSources,
      'object-src': ["'none'"],
      'upgrade-insecure-requests': []
    }
  })
)

// API routes
app.use('/api', apiRoutes)
app.use('/api/todos', todoRoutes)

// Inject scripts/links into ./public/index.html
app.get('/', async (_req, res, next) => {
  try {
    const indexPath = path.join(__dirname, 'public', 'index.html')
    let indexHtml = await fs.readFile(indexPath, 'utf-8')

    const links = [
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800&family=Inter:wght@300;400;600;700&display=swap'
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css'
      },
      {
        rel: 'stylesheet',
        href: 'https://jenil.github.io/bulmaswatch/nuclear/bulmaswatch.min.css'
      },
      {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
        crossorigin: 'anonymous',
        referrerpolicy: 'no-referrer'
      },
      {
        rel: 'stylesheet',
        href: './css/style.css'
      }
    ]

    const scripts = [
      {
        src: 'https://unpkg.com/react@18/umd/react.production.min.js',
        crossorigin: ''
      },
      {
        src: 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
        crossorigin: ''
      },
      {
        src: 'https://unpkg.com/@babel/standalone/babel.min.js'
      },
      {
        type: 'text/babel',
        src: './src/main.js'
      }
    ]

    const headLinks = renderLinkTags(links)
    const bodyScripts = renderScriptTags(scripts, res.locals.cspNonce)
    indexHtml = indexHtml.replace('</head>', `${headLinks}\n</head>`)
    indexHtml = indexHtml.replace('</body>', `${bodyScripts}</body>`)

    res.send(indexHtml)
  } catch (error) {
    next(error)
  }
})

// Serve css folder for JSX
app.use('/css', express.static(path.join(__dirname, 'css')))

// Serve src folder for JSX
app.use('/src', express.static(path.join(__dirname, 'src')))

// Serve static files (frontend build goes in ./public)
app.use(express.static('./public'))

// Catch-all (SPA frontend routing support)
app.use((req, res) => {
  res.redirect('https://w1cub.com/')
})

// Error handler (last middleware)
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// Boot sequence
connectDB(config.mongoUri)
  .then(() => {
    app.listen(config.port, () => {
      console.log(`✅ Running in ${config.env} mode on port ${config.port}`)
    })
  })
  .catch(err => {
    console.error('Failed to start server:', err)
    process.exit(1)
  })
