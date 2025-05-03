
import { useState } from 'react';
import { Note } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useNotesService = (userId: string | null) => {
  const [userNotes, setUserNotes] = useState<Note[]>([]);
  const { toast } = useToast();

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

  const addNote = async (noteData: Omit<Note, 'id' | 'userId' | 'createdAt' | 'completed'>): Promise<boolean> => {
    if (!userId) return false;
    
    const newNote: Note = {
      id: `note-${Date.now()}`,
      userId: userId,
      ...noteData,
      createdAt: new Date().toISOString(),
      completed: false
    };
    
    const updatedNotes = [...userNotes, newNote];
    setUserNotes(updatedNotes);
    
    localStorage.setItem(`notes_${userId}`, JSON.stringify(updatedNotes));
    
    toast({
      title: "Note Created",
      description: "Your note has been saved successfully.",
      duration: 3000,
    });
    
    return true;
  };
  
  const updateNote = async (updatedNote: Note): Promise<boolean> => {
    if (!userId) return false;
    
    const noteIndex = userNotes.findIndex(note => note.id === updatedNote.id);
    if (noteIndex === -1) return false;
    
    const updatedNotes = [...userNotes];
    updatedNotes[noteIndex] = updatedNote;
    
    setUserNotes(updatedNotes);
    
    localStorage.setItem(`notes_${userId}`, JSON.stringify(updatedNotes));
    
    toast({
      title: "Note Updated",
      description: "Your note has been updated successfully.",
      duration: 3000,
    });
    
    return true;
  };
  
  const deleteNote = async (noteId: string): Promise<boolean> => {
    if (!userId) return false;
    
    const updatedNotes = userNotes.filter(note => note.id !== noteId);
    setUserNotes(updatedNotes);
    
    localStorage.setItem(`notes_${userId}`, JSON.stringify(updatedNotes));
    
    toast({
      title: "Note Deleted",
      description: "Your note has been deleted.",
      duration: 3000,
    });
    
    return true;
  };

  return {
    userNotes,
    fetchUserNotes,
    addNote,
    updateNote,
    deleteNote
  };
};
