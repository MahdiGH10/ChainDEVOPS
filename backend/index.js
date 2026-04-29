const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
// 1. ACTION : Importation de prom-client
const client = require('prom-client')

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app = express()
const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'

// 2. ACTION : Configuration de la collecte automatique (CPU, RAM)
const collectDefaultMetrics = client.collectDefaultMetrics
collectDefaultMetrics({ register: client.register })

// 3. ACTION : Création d'une métrique personnalisée pour compter les requêtes
const httpRequestCounter = new client.Counter({
  name: 'backend_http_requests_total',
  help: 'Nombre total de requêtes HTTP reçues',
  labelNames: ['method', 'route', 'status']
})

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logging middleware + Incrémentation du compteur
app.use((req, res, next) => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${req.method} ${req.path}`)
  
  // On incrémente le compteur Prometheus à chaque appel
  res.on('finish', () => {
    httpRequestCounter.labels(req.method, req.path, res.statusCode).inc()
  })
  next()
})

// 4. ACTION : L'exigence critique - L'endpoint /metrics pour Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType)
  res.end(await client.register.metrics())
})

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API backend opérationnelle ✅',
    time: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime(),
  })
})

// --- Ton In-memory store (inchangé) ---
let items = [
  { id: 1, title: 'Task 1', completed: false },
  { id: 2, title: 'Task 2', completed: true },
]
let nextId = 3;

app.get('/api/data', (req, res) => {
  res.json({ items })
})

app.post('/api/data', (req, res) => {
  const { title } = req.body
  if (!title) return res.status(400).json({ error: 'Title is required' })
  const newItem = { id: nextId++, title, completed: false }
  items.push(newItem)
  res.status(201).json(newItem)
})

app.put('/api/data/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const item = items.find((i) => i.id === id)
  if (!item) return res.status(404).json({ error: 'Item not found' })
  item.completed = !item.completed
  res.json(item)
})

app.delete('/api/data/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const idx = items.findIndex((i) => i.id === id)
  if (idx === -1) return res.status(404).json({ error: 'Item not found' })
  const deleted = items.splice(idx, 1)[0]
  res.json(deleted)
})

// Handlers
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Backend running on http://localhost:${PORT}`)
  console.log(`📊 Metrics available on http://localhost:${PORT}/metrics`)
})

process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0)
  })
})