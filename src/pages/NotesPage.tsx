
import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import NotesManager from '@/components/notes/NotesManager';
import { useAuth } from '@/context/auth/auth-context';
import { useToast } from '@/hooks/use-toast';

const NotesPage = () => {
  const { userNotes } = useAuth();
  const { toast } = useToast();
  const [shownReminders, setShownReminders] = useState<string[]>([]);
  
  // Check for notes with reminders set for today, but only show each once
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    const todayReminders = userNotes.filter(note => {
      if (!note.reminderDate) return false;
      return note.reminderDate.startsWith(today) && !note.completed;
    });
    
    if (todayReminders.length > 0) {
      todayReminders.forEach(note => {
        // Only show notification if we haven't shown it already in this session
        if (!shownReminders.includes(note.id)) {
          toast({
            title: "Reminder",
            description: note.title,
            duration: 10000,
          });
          
          // Add to shown reminders
          setShownReminders(prev => [...prev, note.id]);
        }
      });
    }
  }, [userNotes, toast, shownReminders]);
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          My Notes
        </h1>
        <p className="text-white/70 mb-8">
          Create and manage your personal notes and reminders
        </p>
        
        <NotesManager />
      </div>
    </AppLayout>
  );
};

export default NotesPage;
