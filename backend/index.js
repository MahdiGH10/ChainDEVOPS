const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
// --- ÉTAPE 10 : Import de prom-client ---
const client = require('prom-client')

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app = express()
const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'

// --- ÉTAPE 10 : Configuration des métriques ---
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

// Exemple de métrique personnalisée (compteur de requêtes sur /api/data)
const dataRequestsCounter = new client.Counter({
  name: 'backend_data_requests_total',
  help: 'Nombre total de requêtes vers /api/data'
});

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${req.method} ${req.path}`)
  next()
})

// --- ÉTAPE 10 : Création de l'endpoint /metrics ---
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

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

// Get all items
app.get('/api/data', (req, res) => {
  dataRequestsCounter.inc(); // Incrémente le compteur à chaque appel
  res.json({ items: [/* ... tes items ... */] })
})

// ... Reste de tes routes (POST, PUT, DELETE) inchangé ...

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Backend running on http://localhost:${PORT}`)
  console.log(`📊 Metrics available on http://localhost:${PORT}/metrics`)
})