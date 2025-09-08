import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import router from './router.js'

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

// Enhanced CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://localhost:3000',
  'https://trytrainr1.netlify.app', // Remove trailing slash and hardcode for production
  process.env.FRONTEND_URL?.replace(/\/$/, ''), // Remove trailing slash if present
].filter(Boolean)

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      console.log('CORS blocked origin:', origin)
      console.log('Allowed origins:', allowedOrigins)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'TRAINR-PAT Backend running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    allowedOrigins: allowedOrigins
  })
})

// Use your router for all /api routes
app.use('/api', router)

// Test database connection
app.get('/api/test-db', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Database not configured' })
  }

  try {
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

// Handle 404
app.use('/*', (req, res) => {
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
  console.log(`🔗 Allowed origins:`, allowedOrigins)
  if (supabaseUrl) {
    console.log(`📊 Database: ${supabaseUrl}`)
  }
})