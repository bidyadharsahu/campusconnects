
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Profile, AuthState, AuthActions } from '@/types/auth';

export const useAuthService = (): AuthState & AuthActions => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Determine if user is admin based on email domain and profile department
  const isAdmin = user?.email?.endsWith('@nist.edu') || profile?.department === 'admin';

  // Initialize auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (currentSession?.user) {
          setUser(currentSession.user);
          setSession(currentSession);
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setUser(null);
          setSession(null);
          setProfile(null);
        }
        console.log('Auth state changed:', event);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (currentSession?.user) {
        setUser(currentSession.user);
        setSession(currentSession);
        fetchUserProfile(currentSession.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      setProfile(data as Profile);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Admin login handling
      const isAdminEmail = email.endsWith('@nist.edu');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
          duration: 3000,
        });
        return false;
      }
      
      if (data.user) {
        const message = isAdminEmail ? "Welcome to the admin dashboard!" : "Welcome back!";
        toast({
          title: "Login Successful",
          description: message,
          duration: 3000,
        });
        
        // If admin, direct to admin dashboard
        if (isAdminEmail) {
          navigate('/admin');
        }
        // Regular users will be redirected via the useEffect in Login component
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    semester: number = 1
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Prevent admin registration through normal flow
      if (email.endsWith('@nist.edu')) {
        toast({
          title: "Registration Failed",
          description: "Admin accounts cannot be registered this way",
          variant: "destructive",
          duration: 3000,
        });
        return false;
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            semester
          },
        },
      });
      
      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
          duration: 3000,
        });
        return false;
      }
      
      if (data.user) {
        toast({
          title: "Registration Successful",
          description: "Your account has been created. Please check your email for verification.",
          duration: 3000,
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      navigate('/login');
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const updateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        toast({
          title: "Update Failed",
          description: error.message,
          variant: "destructive",
          duration: 3000,
        });
        return false;
      }
      
      setProfile(prev => prev ? {...prev, ...updates} : null);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
        duration: 3000,
      });
      
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  return {
    user,
    session,
    profile,
    isLoading,
    isAdmin,
    login,
    register,
    logout,
    updateProfile,
  };
};
