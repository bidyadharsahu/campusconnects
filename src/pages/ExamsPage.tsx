
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import AppLayout from '@/components/layout/AppLayout';
import { exams } from '@/lib/mockData';
import { Exam } from '@/types';
import { formatDate, getTimeUntilExam } from '@/lib/calculationUtils';
import { Bell, Calendar, Clock, Search } from 'lucide-react';

const ExamsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Group exams by upcoming vs past
  const upcomingExams = exams.filter(exam => exam.date >= todayStr);
  const pastExams = exams.filter(exam => exam.date < todayStr);
  
  // Filter exams based on search term
  const filteredUpcoming = upcomingExams.filter(
    exam => exam.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           exam.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredPast = pastExams.filter(
    exam => exam.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           exam.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Exam Schedule
        </h1>
        <p className="text-white/70 mb-8">
          View your upcoming and past examinations
        </p>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search exams by name or code..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6 bg-secondary/40">
            <TabsTrigger value="upcoming">
              Upcoming Exams ({filteredUpcoming.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past Exams ({filteredPast.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            {filteredUpcoming.length > 0 ? (
              filteredUpcoming.map((exam) => (
                <ExamCard key={exam.id} exam={exam} isPast={false} />
              ))
            ) : (
              <div className="text-center py-8 text-white/70">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <h3 className="text-lg font-medium">No upcoming exams found</h3>
                {searchTerm ? (
                  <p>No exams match your search criteria</p>
                ) : (
                  <p>You don't have any scheduled exams at the moment</p>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            {filteredPast.length > 0 ? (
              filteredPast.map((exam) => (
                <ExamCard key={exam.id} exam={exam} isPast={true} />
              ))
            ) : (
              <div className="text-center py-8 text-white/70">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <h3 className="text-lg font-medium">No past exams found</h3>
                {searchTerm ? (
                  <p>No exams match your search criteria</p>
                ) : (
                  <p>You don't have any past exams in the system</p>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

const ExamCard = ({ exam, isPast }: { exam: Exam, isPast: boolean }) => {
  const timeUntil = getTimeUntilExam(`${exam.date}T${exam.startTime}`);
  const isToday = timeUntil.isToday;
  
  return (
    <Card className={`glass-card ${isToday ? 'border-campus-purple' : ''}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-medium text-white flex items-center gap-2">
              {isToday && <Bell className="h-4 w-4 text-campus-purple animate-pulse" />}
              {exam.courseCode} - {exam.courseName}
            </h3>
            <div className="text-sm text-white/70 mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(exam.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{exam.startTime.substring(0, 5)} - {exam.endTime.substring(0, 5)}</span>
              </div>
              <div className="text-white/60 mt-1">
                Venue: {exam.venue}
              </div>
            </div>
          </div>
          
          <div>
            {isPast ? (
              <div className="px-3 py-1 bg-muted/30 text-muted-foreground rounded-full text-sm">
                Completed
              </div>
            ) : isToday ? (
              <div className="px-3 py-1 bg-campus-purple/20 text-campus-purple rounded-full text-sm font-medium">
                Today
              </div>
            ) : (
              <div className="px-3 py-1 bg-secondary/30 text-white/70 rounded-full text-sm">
                {timeUntil.days} days remaining
              </div>
            )}
          </div>
        </div>
        
        {isToday && !isPast && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex justify-between items-center">
              <div className="text-sm text-white/80">
                Time until exam:
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="text-xl font-bold text-campus-purple">{timeUntil.hours}</div>
                  <div className="text-xs text-white/60">hours</div>
                </div>
                <div className="text-white/40">:</div>
                <div className="text-center">
                  <div className="text-xl font-bold text-campus-purple">{timeUntil.minutes}</div>
                  <div className="text-xs text-white/60">minutes</div>
                </div>
              </div>
            </div>
            <Button className="w-full mt-3 bg-campus-purple hover:bg-campus-purple/80">
              Set Reminder
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamsPage;
