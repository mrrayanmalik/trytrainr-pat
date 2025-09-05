import express from 'express'
import cors from 'cors'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'TRAINR-PAT Backend running!' })
})

app.get('/api/health', (req, res) => {
  res.json({ message: 'API is healthy!' })
})

// Test auth routes
app.post('/api/auth/login', (req, res) => {
  res.json({ message: 'Login endpoint ready' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})