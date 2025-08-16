import { supabase } from './supabase'

export type UserRole = 'citizen' | 'official'

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: UserRole
  is_verified: boolean
  bio?: string
  location?: string
  created_at: string
  updated_at: string
}

export interface CreateProfileData {
  full_name?: string
  role?: UserRole
  bio?: string
  location?: string
}

export interface UpdateProfileData {
  full_name?: string
  avatar_url?: string
  bio?: string
  location?: string
}

export class ProfileService {
  // Get current user's profile
  static async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return null

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error getting current user profile:', error)
      return null
    }
  }

  // Get profile by user ID
  static async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error getting profile:', error)
      return null
    }
  }

  // Update current user's profile
  static async updateProfile(updates: UpdateProfileData): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('No authenticated user')

      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error updating profile:', error)
      return null
    }
  }

  // Create profile (usually called automatically via trigger)
  static async createProfile(profileData: CreateProfileData): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('No authenticated user')

      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          email: user.email!,
          ...profileData
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error creating profile:', error)
      return null
    }
  }

  // Check if user has specific role
  static async hasRole(role: UserRole): Promise<boolean> {
    try {
      const profile = await this.getCurrentUserProfile()
      return profile?.role === role || false
    } catch (error) {
      console.error('Error checking user role:', error)
      return false
    }
  }

  // Check if user is official
  static async isOfficial(): Promise<boolean> {
    return this.hasRole('official')
  }

  // Check if user is citizen
  static async isCitizen(): Promise<boolean> {
    return this.hasRole('citizen')
  }
}

// Export for convenience
export const {
  getCurrentUserProfile,
  getProfile,
  updateProfile,
  createProfile,
  hasRole,
  isOfficial,
  isCitizen
} = ProfileService
