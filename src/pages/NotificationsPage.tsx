
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/components/layout/AppLayout';
import { exams } from '@/lib/mockData';
import { formatDate } from '@/lib/calculationUtils';
import { AlertCircle, Bell, Calendar, Info } from 'lucide-react';

const NotificationsPage = () => {
  // Generate notifications based on exams
  const examNotifications = exams.map(exam => ({
    id: `exam-${exam.id}`,
    title: `Upcoming Exam: ${exam.courseName}`,
    description: `You have an exam scheduled on ${formatDate(exam.date)} at ${exam.startTime.substring(0, 5)} in ${exam.venue}`,
    date: new Date(`${exam.date}T${exam.startTime}`),
    type: 'exam'
  }));
  
  // Add some general notifications
  const generalNotifications = [
    {
      id: 'notice-1',
      title: 'Semester Registration Deadline',
      description: 'Registration for the next semester closes in 1 week. Please ensure you complete your course selection.',
      date: new Date(),
      type: 'info'
    },
    {
      id: 'notice-2',
      title: 'Library Hours Extended',
      description: 'The university library will remain open until midnight during the exam period.',
      date: new Date(Date.now() - 86400000), // 1 day ago
      type: 'info'
    },
    {
      id: 'notice-3',
      title: 'Campus Maintenance Notice',
      description: 'The East Wing will be closed for maintenance work on Sunday.',
      date: new Date(Date.now() - 172800000), // 2 days ago
      type: 'alert'
    }
  ];
  
  // Combine and sort all notifications by date (newest first)
  const allNotifications = [...examNotifications, ...generalNotifications]
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Notifications
        </h1>
        <p className="text-white/70 mb-8">
          Important updates and reminders
        </p>
        
        <div className="space-y-4">
          {allNotifications.map((notification) => (
            <Card key={notification.id} className="glass-card">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="mt-1">
                  {notification.type === 'exam' ? (
                    <div className="w-10 h-10 rounded-full bg-campus-purple/20 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-campus-purple" />
                    </div>
                  ) : notification.type === 'alert' ? (
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Info className="h-5 w-5 text-blue-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-white">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-white/70 mt-1">
                    {notification.description}
                  </p>
                  <div className="text-xs text-white/50 mt-2">
                    {notification.date.toLocaleDateString()} • {notification.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <Bell className="h-4 w-4 text-white/40 hover:text-white cursor-pointer" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default NotificationsPage;
