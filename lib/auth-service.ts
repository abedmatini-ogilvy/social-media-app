/**
 * Authentication Service for CivicConnect
 * Handles user authentication with Supabase integration
 */

import { supabase } from './supabase'
import { ProfileService, UserProfile, UserRole } from './profile-service'
import type { User } from '@supabase/supabase-js'

// Enhanced User type that includes profile data
export interface AuthUser extends User {
  profile?: UserProfile | null
}

export interface SignUpData {
  email: string
  password: string
  full_name?: string
  role?: UserRole
}

export interface SignInData {
  email: string
  password: string
}

export class AuthService {
  // Sign up with profile creation
  static async signUp(data: SignUpData) {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name || '',
            role: data.role || 'citizen'
          }
        }
      })

      if (error) {
        throw error
      }

      // Profile will be created automatically by the database trigger
      // No need to manually update here
      return { data: authData, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error }
    }
  }

  // Sign in
  static async signIn(data: SignInData) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        throw error
      }

      return { data: authData, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    }
  }

  // Sign out
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }

      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error }
    }
  }

  // Get current user with profile
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        return null
      }

      // Get user profile
      const profile = await ProfileService.getCurrentUserProfile()
      
      return {
        ...user,
        profile
      }
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  // Get current session
  static async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        throw error
      }

      return session
    } catch (error) {
      console.error('Error getting session:', error)
      return null
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await ProfileService.getCurrentUserProfile()
        callback({
          ...session.user,
          profile
        })
      } else {
        callback(null)
      }
    })
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession()
    return !!session?.user
  }

  // Get access token for API requests
  static async getAccessToken(): Promise<string | null> {
    const session = await this.getSession()
    return session?.access_token || null
  }
}

// Export convenience functions
export const {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getSession,
  onAuthStateChange,
  isAuthenticated,
  getAccessToken
} = AuthService
