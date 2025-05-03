
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/components/layout/AppLayout';
import { classDetails } from '@/lib/mockData';
import { formatTime } from '@/lib/calculationUtils';
import { Clock } from 'lucide-react';

const ClassesPage = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Group classes by day
  const classesByDay = days.map(day => ({
    day,
    classes: classDetails.filter(cls => cls.day === day)
  }));
  
  // Highlight current day
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Class Schedule
        </h1>
        <p className="text-white/70 mb-8">
          Your weekly class timetable
        </p>
        
        <div className="space-y-6">
          {classesByDay.map(({ day, classes }) => (
            <Card 
              key={day} 
              className={`glass-card ${day === currentDay ? 'border-campus-purple' : ''}`}
            >
              <CardHeader className={`pb-2 ${day === currentDay ? 'bg-campus-purple/10' : ''}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {day}
                      {day === currentDay && (
                        <span className="text-xs bg-campus-purple text-white px-2 py-0.5 rounded-full">
                          Today
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {classes.length} classes scheduled
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-4">
                {classes.length > 0 ? (
                  <div className="space-y-4">
                    {classes.map((cls) => (
                      <div key={cls.id} className="flex border-b border-white/10 pb-4 last:border-0 last:pb-0">
                        <div className="w-24 text-center border-r border-white/10 pr-4 mr-4 flex flex-col items-center justify-center">
                          <Clock className="h-4 w-4 mb-1 text-white/60" />
                          <div className="text-sm font-medium text-white">
                            {formatTime(cls.startTime)}
                          </div>
                          <div className="text-xs text-white/60">
                            {formatTime(cls.endTime)}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-white">
                            {cls.courseName}
                          </h4>
                          <div className="text-sm text-white/70 mt-1">
                            {cls.courseCode} • {cls.room}
                          </div>
                          <div className="text-sm text-white/60 mt-1">
                            {cls.teacher}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-white/60">
                    <p>No classes scheduled for {day}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default ClassesPage;
