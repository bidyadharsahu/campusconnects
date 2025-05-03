
import { User, Session } from '@supabase/supabase-js';
import { Note } from '../types';

export interface Profile {
  id: string;
  name: string;
  email: string;
  semester: number;
  department?: string;
  avatar_url?: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, semester?: number) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
}

export interface NoteActions {
  userNotes: Note[];
  addNote: (note: Omit<Note, 'id' | 'userId' | 'createdAt' | 'completed'>) => Promise<boolean>;
  updateNote: (note: Note) => Promise<boolean>;
  deleteNote: (noteId: string) => Promise<boolean>;
}

export interface AuthContextType extends AuthState, AuthActions, NoteActions {}
