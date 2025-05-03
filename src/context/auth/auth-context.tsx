
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { AuthContextType, Profile } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  isLoading: true,
  isAdmin: false,
  updateProfile: async () => false,
  userNotes: [],
  addNote: async () => false,
  updateNote: async () => false,
  deleteNote: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userNotes, setUserNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Determine if user is admin based on email domain
  const isAdmin = user?.email?.endsWith('@nist.edu') || profile?.department === 'admin';

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // If we have a user, fetch their profile
        if (currentSession?.user) {
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
      
      // Only set isLoading to false after checking for an existing session
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
      
      // Also fetch user notes
      fetchUserNotes(userId);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };
  
  const fetchUserNotes = async (userId: string) => {
    try {
      const storedNotes = localStorage.getItem(`notes_${userId}`);
      if (storedNotes) {
        setUserNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
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
      
      // Auth state listener will handle setting user and session
      toast({
        title: "Login Successful",
        description: email.endsWith('@nist.edu') ? "Welcome to the admin dashboard!" : "Welcome back!",
        duration: 3000,
      });
      
      return true;
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
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Please check your email for verification.",
        duration: 3000,
      });
      return true;
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
      // Auth state listener will handle clearing user and session
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: "An error occurred while logging out",
        variant: "destructive",
        duration: 3000,
      });
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
  
  const addNote = async (noteData: any): Promise<boolean> => {
    if (!user) return false;
    
    const newNote = {
      id: `note-${Date.now()}`,
      userId: user.id,
      ...noteData,
      createdAt: new Date().toISOString(),
      completed: false
    };
    
    const updatedNotes = [...userNotes, newNote];
    setUserNotes(updatedNotes);
    
    localStorage.setItem(`notes_${user.id}`, JSON.stringify(updatedNotes));
    
    toast({
      title: "Note Created",
      description: "Your note has been saved successfully.",
      duration: 3000,
    });
    
    return true;
  };
  
  const updateNote = async (updatedNote: any): Promise<boolean> => {
    if (!user) return false;
    
    const noteIndex = userNotes.findIndex((note: any) => note.id === updatedNote.id);
    if (noteIndex === -1) return false;
    
    const updatedNotes = [...userNotes];
    updatedNotes[noteIndex] = updatedNote;
    
    setUserNotes(updatedNotes);
    
    localStorage.setItem(`notes_${user.id}`, JSON.stringify(updatedNotes));
    
    toast({
      title: "Note Updated",
      description: "Your note has been updated successfully.",
      duration: 3000,
    });
    
    return true;
  };
  
  const deleteNote = async (noteId: string): Promise<boolean> => {
    if (!user) return false;
    
    const updatedNotes = userNotes.filter((note: any) => note.id !== noteId);
    setUserNotes(updatedNotes);
    
    localStorage.setItem(`notes_${user.id}`, JSON.stringify(updatedNotes));
    
    toast({
      title: "Note Deleted",
      description: "Your note has been deleted.",
      duration: 3000,
    });
    
    return true;
  };

  // Combine all functionality into a single context value
  const contextValue: AuthContextType = {
    user,
    session,
    profile,
    isLoading,
    isAdmin,
    login,
    register,
    logout,
    updateProfile,
    userNotes,
    addNote,
    updateNote,
    deleteNote
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
