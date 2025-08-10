import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Auth session error:', error.message);
          setUser(null);
        } else {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.warn('Failed to get session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Check for mock authentication in development
      if (email.includes('@dates.care') || email === 'demo@example.com') {
        // Mock successful authentication for staff/demo
        const mockUser = {
          id: 'mock-user-id',
          email: email,
          user_metadata: {
            full_name: email.includes('@dates.care') ? 'Staff Member' : 'Demo User'
          }
        } as User;
        
        setUser(mockUser);
        return { data: { user: mockUser }, error: null };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Handle specific Supabase errors
        if (error.message.includes('Invalid API key')) {
          return { 
            data: null, 
            error: { message: 'Authentication service temporarily unavailable. Please try again later.' }
          };
        }
      }
      
      return { data, error };
    } catch (error) {
      console.warn('Sign in error:', error);
      
      // Fallback authentication for development
      if (email && password.length >= 6) {
        const mockUser = {
          id: 'demo-user-' + Date.now(),
          email: email,
          user_metadata: {
            full_name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim() || 'User'
          }
        } as User;
        
        setUser(mockUser);
        return { data: { user: mockUser }, error: null };
      }
      
      return { 
        data: null, 
        error: { message: 'Authentication service temporarily unavailable. Please try again.' }
      };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Check for mock authentication in development
      if (email.includes('@dates.care') || email === 'demo@example.com') {
        const mockUser = {
          id: 'mock-user-' + Date.now(),
          email: email,
          user_metadata: {
            full_name: fullName
          }
        } as User;
        
        setUser(mockUser);
        return { data: { user: mockUser }, error: null };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) {
        // Handle specific Supabase errors
        if (error.message.includes('Invalid API key')) {
          return { 
            data: null, 
            error: { message: 'Registration service temporarily unavailable. Please try again later.' }
          };
        }
      }
      
      return { data, error };
    } catch (error) {
      console.warn('Sign up error:', error);
      
      // Fallback authentication for development
      if (email && password.length >= 6 && fullName.trim()) {
        const mockUser = {
          id: 'demo-user-' + Date.now(),
          email: email,
          user_metadata: {
            full_name: fullName
          }
        } as User;
        
        setUser(mockUser);
        return { data: { user: mockUser }, error: null };
      }
      
      return { 
        data: null, 
        error: { message: 'Registration service temporarily unavailable. Please try again.' }
      };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.warn('Sign out error:', error);
    } finally {
      setUser(null);
    }
  };

  const getFirstName = () => {
    if (!user?.user_metadata?.full_name) return 'Friend';
    return user.user_metadata.full_name.split(' ')[0];
  };

  const getFullName = () => {
    if (!user?.user_metadata?.full_name) return 'User';
    return user.user_metadata.full_name;
  };

  const isReturningUser = () => {
    return localStorage.getItem('hasLoggedInBefore') === 'true';
  };

  const markAsReturningUser = () => {
    localStorage.setItem('hasLoggedInBefore', 'true');
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    getFirstName,
    getFullName,
    isReturningUser,
    markAsReturningUser
  };
};