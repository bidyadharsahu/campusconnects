import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/auth/auth-context';
import { Exam } from '@/types';
import { exams, classDetails, teachers } from '@/lib/mockData';
import { formatDate, getTimeUntilExam } from '@/lib/calculationUtils';
import { Bell, Calendar, Calculator, Users, Book, ArrowRight, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [todaysClasses, setTodaysClasses] = useState<typeof classDetails>([]);
  
  useEffect(() => {
    // Get upcoming exams (next 7 days)
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    
    const upcoming = exams
      .filter(exam => {
        const examDate = new Date(exam.date);
        return examDate >= now && examDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setUpcomingExams(upcoming.slice(0, 3)); // Show only the next 3 exams
    
    // Get today's classes
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    setTodaysClasses(classDetails.filter(cls => cls.day === today));
  }, []);
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome, {profile?.name || 'Student'}!
        </h1>
        <p className="text-white/70 mb-8">
          Semester {profile?.semester || '1'} • Here's your academic overview
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Upcoming Exams Card */}
          <Card className="col-span-1 md:col-span-2 glass-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-campus-purple" />
                    <span>Upcoming Exams</span>
                  </CardTitle>
                  <CardDescription>Your scheduled examinations</CardDescription>
                </div>
                <Link to="/exams">
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-white">
                    View all <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingExams.length > 0 ? (
                <div className="space-y-4">
                  {upcomingExams.map((exam) => {
                    const timeUntil = getTimeUntilExam(`${exam.date}T${exam.startTime}`);
                    return (
                      <div key={exam.id} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0">
                        <div className="space-y-1">
                          <p className="font-medium text-white">{exam.courseName}</p>
                          <div className="text-sm text-white/70 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(exam.date)} • {exam.startTime.substring(0, 5)} - {exam.endTime.substring(0, 5)}
                          </div>
                          <p className="text-xs text-white/60">{exam.venue}</p>
                        </div>
                        
                        <div className="text-sm text-white/70">
                          {timeUntil.isToday ? (
                            <span className="bg-campus-purple/20 text-campus-purple px-2 py-1 rounded-md font-medium">
                              Today
                            </span>
                          ) : (
                            <span>
                              {timeUntil.days} days
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-white/60">
                  <p>No upcoming exams in the next 7 days</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Today's Classes Card */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-campus-purple" />
                <span>Today's Classes</span>
              </CardTitle>
              <CardDescription>Your schedule for today</CardDescription>
            </CardHeader>
            <CardContent>
              {todaysClasses.length > 0 ? (
                <div className="space-y-4">
                  {todaysClasses.map((cls) => (
                    <div key={cls.id} className="border-b border-white/10 pb-3 last:border-0">
                      <p className="font-medium text-white">{cls.courseName}</p>
                      <div className="text-sm text-white/70 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {cls.startTime.substring(0, 5)} - {cls.endTime.substring(0, 5)}
                      </div>
                      <p className="text-xs text-white/60">{cls.room} • {cls.teacher}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-white/60">
                  <p>No classes scheduled for today</p>
                </div>
              )}
              
              <Link to="/classes" className="block mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  View Weekly Schedule
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          {/* Quick Access Card - IMPROVED LAYOUT */}
          <Card className="col-span-1 md:col-span-3 glass-card">
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>Frequently used tools and resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Link to="/calculator">
                  <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2 px-2 text-center">
                    <Calculator className="h-6 w-6 text-campus-purple mb-1" />
                    <span className="text-xs md:text-sm">SGPA/CGPA Calculator</span>
                  </Button>
                </Link>
                
                <Link to="/exams">
                  <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2 px-2 text-center">
                    <Calendar className="h-6 w-6 text-campus-purple mb-1" />
                    <span className="text-xs md:text-sm">Exam Schedule</span>
                  </Button>
                </Link>
                
                <Link to="/teachers">
                  <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2 px-2 text-center">
                    <Users className="h-6 w-6 text-campus-purple mb-1" />
                    <span className="text-xs md:text-sm">Teacher Details</span>
                  </Button>
                </Link>
                
                <Link to="/notifications">
                  <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2 px-2 text-center">
                    <Bell className="h-6 w-6 text-campus-purple mb-1" />
                    <span className="text-xs md:text-sm">Notifications</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
