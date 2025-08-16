'use client'

import { useState, useEffect } from 'react'
import { AuthService, SignUpData } from '@/lib/auth-service'
import { ProfileService, UserProfile } from '@/lib/profile-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

export default function AuthTestPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'citizen' | 'official'>('citizen')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [message, setMessage] = useState('')

  // Check if user is already logged in and fetch profile
  const checkUserAndProfile = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser()
      setUser(currentUser)
      
      if (currentUser) {
        const userProfile = await ProfileService.getCurrentUserProfile()
        setProfile(userProfile)
      }
    } catch (error) {
      console.error('Error checking user:', error)
    }
  }

  useEffect(() => {
    checkUserAndProfile()
  }, [])

  // Sign up function with profile
  const handleSignUp = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const signUpData: SignUpData = {
        email,
        password,
        full_name: fullName,
        role
      }
      
      const { data, error } = await AuthService.signUp(signUpData)
      
      if (error) {
        setMessage(`Error: ${(error as any)?.message || error}`)
      } else {
        setMessage('Sign up successful! Check your email for verification.')
        await checkUserAndProfile()
      }
    } catch (error) {
      setMessage(`Error: ${error}`)
    }
    
    setLoading(false)
  }

  // Sign in function
  const handleSignIn = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const { data, error } = await AuthService.signIn({
        email,
        password,
      })
      
      if (error) {
        setMessage(`Error: ${(error as any)?.message || error}`)
      } else {
        setMessage('Sign in successful!')
        await checkUserAndProfile()
      }
    } catch (error) {
      setMessage(`Error: ${error}`)
    }
    
    setLoading(false)
  }

  // Sign out function
  const handleSignOut = async () => {
    setLoading(true)
    
    try {
      const { error } = await AuthService.signOut()
      
      if (error) {
        setMessage(`Error: ${(error as any)?.message || error}`)
      } else {
        setMessage('Signed out successfully!')
        setUser(null)
        setProfile(null)
      }
    } catch (error) {
      setMessage(`Error: ${error}`)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Supabase Auth & Profile Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!user ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name (for signup)</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role (for signup)</Label>
                <Select value={role} onValueChange={(value: 'citizen' | 'official') => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="citizen">Citizen</SelectItem>
                    <SelectItem value="official">Official</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handleSignUp} 
                  disabled={loading || !email || !password}
                  className="flex-1"
                >
                  {loading ? 'Loading...' : 'Sign Up'}
                </Button>
                <Button 
                  onClick={handleSignIn} 
                  disabled={loading || !email || !password}
                  variant="outline"
                  className="flex-1"
                >
                  {loading ? 'Loading...' : 'Sign In'}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <h3 className="font-semibold text-green-800 mb-2">Authentication Info</h3>
                <p className="text-sm text-green-700">Email: {user.email}</p>
                <p className="text-sm text-green-700">ID: {user.id}</p>
                <p className="text-sm text-green-700">
                  Email Verified: {user.email_confirmed_at ? 'Yes' : 'No'}
                </p>
              </div>
              
              {profile ? (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <h3 className="font-semibold text-blue-800 mb-2">Profile Info</h3>
                  <p className="text-sm text-blue-700">
                    Name: {profile.full_name || 'Not set'}
                  </p>
                  <div className="text-sm text-blue-700">
                    Role: <Badge variant={profile.role === 'official' ? 'default' : 'secondary'}>
                      {profile.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-700">
                    Verified: {profile.is_verified ? 'Yes' : 'No'}
                  </p>
                  <p className="text-sm text-blue-700">
                    Bio: {profile.bio || 'Not set'}
                  </p>
                  <p className="text-sm text-blue-700">
                    Location: {profile.location || 'Not set'}
                  </p>
                  <p className="text-sm text-blue-700">
                    Created: {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-700">Profile not found or loading...</p>
                </div>
              )}
              
              <Button onClick={handleSignOut} disabled={loading} className="w-full">
                {loading ? 'Loading...' : 'Sign Out'}
              </Button>
            </div>
          )}
          
          <Button onClick={checkUserAndProfile} variant="outline" className="w-full">
            Refresh User & Profile
          </Button>
          
          {message && (
            <div className={`p-3 rounded text-sm ${
              message.includes('Error') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
