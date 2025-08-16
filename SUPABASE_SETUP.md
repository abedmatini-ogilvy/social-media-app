# Supabase Integration Guide

This document outlines the step-by-step integration of Supabase into the CivicConnect social media app.

## Overview

We're integrating Supabase as our backend database and authentication provider while maintaining the existing frontend architecture as much as possible.

## Integration Strategy

We'll follow a **step-by-step approach**, implementing and testing one feature at a time:

### Phase 1: Setup & Authentication 🔐
- [ ] Install Supabase client
- [ ] Configure environment variables
- [ ] Set up Supabase project
- [ ] Implement basic authentication (signup/login)
- [ ] Test auth flow

### Phase 2: User Management 👤
- [ ] Create Users table
- [ ] Implement user profiles
- [ ] Add role-based access (citizen/official)
- [ ] Test user operations

### Phase 3: Posts & Social Feed 📱
- [ ] Create Posts table
- [ ] Implement post creation
- [ ] Implement feed retrieval
- [ ] Add real-time updates
- [ ] Test social feed functionality

### Phase 4: Civic Features 🏛️
- [ ] Create Schemes table
- [ ] Implement scheme management
- [ ] Create Jobs table
- [ ] Implement job postings
- [ ] Test civic features

### Phase 5: Engagement Features 💬
- [ ] Create Notifications table
- [ ] Implement notification system
- [ ] Add likes/comments to posts
- [ ] Create Events table
- [ ] Test engagement features

### Phase 6: Advanced Features ⚡
- [ ] File storage for images
- [ ] Search functionality
- [ ] Analytics tracking
- [ ] Performance optimization

## Current Status: Phase 1 - Setup & Authentication ✅ COMPLETED

### What We've Accomplished ✅
- ✅ Supabase project setup and configuration
- ✅ Environment variables configured
- ✅ Authentication service with Supabase integration
- ✅ User profiles table with role system (citizen/official)
- ✅ Automatic profile creation via database triggers
- ✅ Enhanced auth test page with profile display
- ✅ Fixed HTML validation and hydration issues
- ✅ Database constraints and cascade deletion setup

### Phase 1 Results 🎯
- **Authentication**: Sign up, sign in, sign out working
- **User Roles**: Citizen vs Official role system implemented
- **Profile Management**: Automatic profile creation with metadata
- **Database**: Proper foreign key constraints with cascade deletion
- **UI**: Clean test interface showing auth + profile data

---

## Next: Phase 2 - Posts & Social Feed 📱

Now that we have solid authentication and user management, let's build the core social media features:

### Phase 2.1: Posts Database & Basic Operations
- [ ] Create Posts table
- [ ] Implement post creation
- [ ] Implement post retrieval
- [ ] Test basic CRUD operations

### Phase 2.2: Social Feed
- [ ] Create feed service
- [ ] Implement chronological feed
- [ ] Add real-time updates
- [ ] Test feed functionality

### Phase 2.3: Post Engagement
- [ ] Add likes system
- [ ] Add comments system
- [ ] Implement post sharing
- [ ] Test engagement features

### Environment Variables Needed
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Files to Modify/Create
1. `lib/supabase.ts` - Supabase client configuration
2. `lib/auth-service.ts` - Adapt to use Supabase auth
3. `.env.local` - Environment variables
4. Update existing components to use new auth service

---

## Phase 1 Implementation Plan

### Step 1.1: Install Dependencies & Setup Configuration
- Install Supabase client library
- Create Supabase client configuration
- Set up environment variables

### Step 1.2: Authentication Setup
- Create Supabase project and get credentials
- Set up authentication providers (email/password)
- Configure auth settings in Supabase dashboard

### Step 1.3: Adapt Auth Service
- Modify `lib/auth-service.ts` to use Supabase
- Implement signup, login, logout functions
- Handle token management with Supabase session

### Step 1.4: Test Authentication
- Test signup flow
- Test login flow
- Test session persistence
- Test logout functionality

---

## Questions & Decisions Needed

1. **Authentication Method**: 
   - Email/password only or include social logins?
   - Email verification required?

2. **User Roles**:
   - Should roles be stored in Supabase auth metadata or separate table?
   - How to handle role verification for officials?

3. **Real-time Features**:
   - Which features need real-time updates?
   - Should we implement real-time from the start or add later?

4. **File Storage**:
   - Use Supabase Storage or external service (Cloudinary)?

---

## Notes

- We'll maintain the existing API service structure as much as possible
- Each phase will be thoroughly tested before moving to the next
- We'll document any breaking changes and migration steps
- Performance and security will be tested at each phase
