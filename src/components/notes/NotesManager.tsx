import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Note } from '@/types';
import { useAuth } from '@/context/auth/auth-context';
import { formatDate } from '@/lib/calculationUtils';
import { Plus, Pencil, Trash2, Check, Bell, Calendar } from 'lucide-react';

const NotesManager = () => {
  const { userNotes, addNote, updateNote, deleteNote } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingNote) {
      await updateNote({
        ...editingNote,
        title,
        content,
        reminderDate: reminderDate || undefined
      });
      
      resetForm();
    } else {
      await addNote({
        title,
        content,
        reminderDate: reminderDate || undefined
      });
      
      resetForm();
    }
  };
  
  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setReminderDate(note.reminderDate || '');
    setIsAdding(true);
  };
  
  const handleDelete = async (id: string) => {
    await deleteNote(id);
  };
  
  const handleToggleComplete = async (note: Note) => {
    await updateNote({
      ...note,
      completed: !note.completed
    });
  };
  
  const resetForm = () => {
    setTitle('');
    setContent('');
    setReminderDate('');
    setEditingNote(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {isAdding ? (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>{editingNote ? 'Edit Note' : 'Add New Note'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Note Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-transparent text-white"
                />
              </div>
              
              <div>
                <Textarea
                  placeholder="Note Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="bg-transparent text-white min-h-[100px]"
                />
              </div>
              
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Calendar className="h-4 w-4" />
                <span>Set Reminder (Optional)</span>
              </div>
              
              <Input
                type="datetime-local"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="bg-transparent text-white"
              />
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  className="bg-campus-purple hover:bg-campus-purple/80"
                >
                  {editingNote ? 'Update Note' : 'Save Note'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button 
          onClick={() => setIsAdding(true)}
          className="bg-campus-purple hover:bg-campus-purple/80 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Note
        </Button>
      )}
      
      {userNotes.length > 0 ? (
        <div className="space-y-4">
          {userNotes.map((note) => (
            <Card 
              key={note.id} 
              className={`glass-card ${note.completed ? 'opacity-60' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => handleToggleComplete(note)}
                      >
                        <div className={`w-4 h-4 rounded-sm border ${
                          note.completed 
                            ? 'bg-campus-purple border-campus-purple flex items-center justify-center' 
                            : 'border-white/30'
                        }`}>
                          {note.completed && <Check className="h-3 w-3 text-white" />}
                        </div>
                      </Button>
                      
                      <h3 className={`font-medium text-white ${
                        note.completed ? 'line-through text-white/50' : ''
                      }`}>
                        {note.title}
                      </h3>
                    </div>
                    
                    <div className={`mt-2 text-sm text-white/70 ${
                      note.completed ? 'text-white/40' : ''
                    }`}>
                      {note.content}
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 text-xs text-white/50">
                      <div>Created: {formatDate(note.createdAt)}</div>
                      
                      {note.reminderDate && (
                        <div className="flex items-center gap-1">
                          <Bell className="h-3 w-3 text-campus-purple" />
                          <span className="text-campus-purple/80">
                            Reminder: {formatDate(note.reminderDate)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-1 ml-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleEdit(note)}
                    >
                      <Pencil className="h-4 w-4 text-white/70" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleDelete(note.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500/70" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-white/50">
          <p>No notes yet. Create your first note!</p>
        </div>
      )}
    </div>
  );
};

export default NotesManager;
