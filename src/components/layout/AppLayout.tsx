import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { useAuth } from '@/context/auth/auth-context';
import { exams } from '@/lib/mockData';
import { getTimeUntilExam } from '@/lib/calculationUtils';
import { Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [upcomingExam, setUpcomingExam] = useState<{
    name: string;
    timeRemaining: { days: number; hours: number; minutes: number; isToday: boolean };
  } | null>(null);
  const [shownExamNotifications, setShownExamNotifications] = useState<string[]>([]);
  
  // Check for today's exams and show notification only for regular users
  useEffect(() => {
    if (!user || isAdmin) return;
    
    const checkForTodaysExams = () => {
      const today = new Date().toISOString().split('T')[0];
      const todayExams = exams.filter(exam => {
        // Filter exams by today's date and user's semester if applicable
        if (exam.date !== today) return false;
        return !exam.semester || (profile && exam.semester === profile.semester);
      });
      
      if (todayExams.length > 0) {
        // Show notification for today's exams only once per session
        todayExams.forEach(exam => {
          if (!shownExamNotifications.includes(exam.id)) {
            toast({
              title: "Exam Today!",
              description: `${exam.courseName} at ${exam.startTime.substring(0, 5)} in ${exam.venue}`,
              duration: 5000,
            });
            setShownExamNotifications(prev => [...prev, exam.id]);
          }
        });
      }
    };
    
    checkForTodaysExams();
    
    // Set up a timer to check for upcoming exams
    const findUpcomingExam = () => {
      if (isAdmin) {
        setUpcomingExam(null);
        return;
      }
      
      const now = new Date();
      const futureExams = exams
        .filter(exam => {
          // Filter by user's semester if applicable
          if (exam.semester && profile && exam.semester !== profile.semester) return false;
          return new Date(`${exam.date}T${exam.startTime}`) > now;
        })
        .sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime());
      
      if (futureExams.length > 0) {
        const next = futureExams[0];
        const timeRemaining = getTimeUntilExam(`${next.date}T${next.startTime}`);
        setUpcomingExam({
          name: next.courseName,
          timeRemaining,
        });
      } else {
        setUpcomingExam(null);
      }
    };
    
    findUpcomingExam();
    const interval = setInterval(findUpcomingExam, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [user, toast, isAdmin, shownExamNotifications, profile]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, navigate, isLoading]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-campus-gradient">
        <div className="animate-pulse text-3xl text-white">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Top banner showing exam countdown - only for regular users */}
          {upcomingExam && !isAdmin && (
            <div className="bg-campus-purple/90 text-white py-2 px-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Bell size={16} className={upcomingExam.timeRemaining.isToday ? "animate-pulse-light" : ""} />
                <span>
                  {upcomingExam.timeRemaining.isToday ? (
                    <span className="font-bold">TODAY: </span>
                  ) : null}
                  <span className="font-medium">{upcomingExam.name} Exam</span>
                </span>
              </div>
              <div>
                {upcomingExam.timeRemaining.days > 0 && (
                  <span className="mr-2">{upcomingExam.timeRemaining.days}d</span>
                )}
                <span className="mr-2">{upcomingExam.timeRemaining.hours}h</span>
                <span>{upcomingExam.timeRemaining.minutes}m</span>
                <span className="ml-1">remaining</span>
              </div>
            </div>
          )}
          
          {/* Main content area */}
          <div className="flex-1 bg-campus-gradient overflow-y-auto">
            <div className="p-4 relative">
              <SidebarTrigger className="absolute top-4 left-4 md:hidden" />
              <div className="pt-10 md:pt-0">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
