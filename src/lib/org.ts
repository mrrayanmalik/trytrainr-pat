import { CheckCircle, X } from 'lucide-react'
import { supabase } from './supabase'

export interface Organization {
  id: string
  subdomain: string
  name: string
  logo_url: string | null
  color: string | null
  created_at: string
}

// Fetch organization by subdomain
export async function getOrganizationBySubdomain(subdomain: string): Promise<Organization | null> {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('subdomain', subdomain)
      .single()
    
    if (error) {
      console.error('Error fetching organization:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error in getOrganizationBySubdomain:', error)
    return null
  }
}

// Create organization
export async function createOrganization(data: {
  subdomain: string
  name: string
  logo_url?: string
  color?: string
}): Promise<Organization | null> {
  try {

    const { data: org, error } = await supabase
      .from('organizations')
      .insert([data])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating organization:', error)
      
      // Provide more specific error handling
      if (error.code === '23505') {
        throw new Error('This subdomain is already taken. Please choose a different one.')
      } else if (error.message.includes('relation "organizations" does not exist')) {
        throw new Error('Database tables not set up. Please contact support.')
      } else {
        throw new Error(`Failed to create organization: ${error.message}`)
      }
    }
    
    return org
  } catch (error) {
    console.error('Error in createOrganization:', error)
    throw error
  }
}

// Update organization
export async function updateOrganization(id: string, updates: Partial<Organization>): Promise<Organization | null> {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating organization:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error in updateOrganization:', error)
    return null
  }
}

// Check subdomain availability
export async function checkSubdomainAvailability(subdomain: string): Promise<boolean> {
  try {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      // Supabase not configured - use mock availability check
      const takenSubdomains = ['admin', 'api', 'www', 'mail', 'support', 'help', 'blog', 'app', 'test', 'demo']
      return !takenSubdomains.includes(subdomain.toLowerCase())
    }
    
    const { data, error } = await supabase
      .from('organizations')
      .select('id')
      .eq('subdomain', subdomain)
      .single()
    
    // If no data found, subdomain is available
    return !data
  } catch (error) {
    console.error('Error checking subdomain availability:', error)
    // On error, assume available for better UX
    return true
  }
}

// Get subdomain from current hostname
export function getSubdirectory(): string | null {
  if (typeof window === 'undefined') return null
  
  const pathname = window.location.pathname
  const parts = pathname.split('/').filter(part => part.length > 0)
  
  // Check if we're on a subdirectory (first path segment)
  if (parts.length >= 1) {
    const subdirectory = parts[0]
    // Exclude common paths that aren't educator portals
    if (!['login', 'signup', 'api', 'admin', 'studio', 'library', 'courses', 'dashboard', 'settings', 'profile'].includes(subdirectory)) {
      return subdirectory
    }
  }
  
  return null
}

// Check if current path is a subdirectory
export function isSubdirectory(): boolean {
  return getSubdirectory() !== null
}

// Get main domain
export function getMainDomain(): string {
  if (typeof window === 'undefined') return 'trytrainr.com'
  
  const hostname = window.location.hostname
  const parts = hostname.split('.')
  
  // Return the main domain (last two parts for .com)
  if (parts.length >= 2) {
    return parts.slice(-2).join('.')
  }
  
  return 'trytrainr.com'
}

// Build canonical login URL with org and redirect params  
export function buildCanonicalLoginUrl(subdirectory?: string, redirectTo?: string): string {
  const mainDomain = getMainDomain()
  const protocol = window.location.protocol
  
  let url = `${protocol}//${mainDomain}/login`
  const params = new URLSearchParams()
  
  if (subdirectory) {
    params.set('org', subdirectory)
  }
  
  if (redirectTo) {
    params.set('redirect_to', redirectTo)
  }
  
  if (params.toString()) {
    url += `?${params.toString()}`
  }
  
  return url
}