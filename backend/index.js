import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
dotenv.config()

const app = express()

// Supabase setup
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

let supabase = null
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
  console.log('✅ Supabase connected successfully')
} else {
  console.log('⚠️  Supabase credentials not found. Some features may not work.')
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'https://localhost:3000'],
  credentials: true
}))
app.use(express.json())

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'TRAINR-PAT Backend running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'API is healthy!',
    database: supabase ? 'connected' : 'not configured',
    timestamp: new Date().toISOString()
  })
})

// Test database connection
app.get('/api/test-db', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Database not configured' })
  }

  try {
    // Simple test query - this will work even without tables
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Database test error:', error)
      return res.status(500).json({ error: 'Database connection failed', details: error.message })
    }

    res.json({ 
      message: 'Database connection successful!',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database test error:', error)
    res.status(500).json({ error: 'Database connection failed', details: error.message })
  }
})

// Test auth routes
app.post('/api/auth/login', (req, res) => {
  res.json({ message: 'Login endpoint ready' })
})

app.post('/api/auth/signup', (req, res) => {
  res.json({ message: 'Signup endpoint ready' })
})

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error)
  res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  if (supabaseUrl) {
    console.log(`📊 Database: ${supabaseUrl}`)
  }
})