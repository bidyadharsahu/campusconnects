
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/components/layout/AppLayout';
import { teachers } from '@/lib/mockData';
import { Mail, Search, User } from 'lucide-react';

const TeachersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter teachers based on search term
  const filteredTeachers = teachers.filter(
    teacher => 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Teachers Directory
        </h1>
        <p className="text-white/70 mb-8">
          Contact information for faculty members
        </p>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search teachers by name, department or subject..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <Card key={teacher.id} className="glass-card overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-campus-dark to-campus-dark/80 pb-12">
                  <CardTitle className="text-center relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-campus-purple/20 flex items-center justify-center text-4xl">
                      {teacher.avatar || <User size={40} />}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="-mt-10 relative">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-1">{teacher.name}</h3>
                    <p className="text-white/70 mb-4">{teacher.department}</p>
                    
                    <div className="flex items-center justify-center gap-2 text-white/60 mb-4">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${teacher.email}`} className="text-sm hover:underline hover:text-campus-purple transition-colors">
                        {teacher.email}
                      </a>
                    </div>
                    
                    <div className="border-t border-white/10 pt-4">
                      <h4 className="text-sm font-medium text-white/80 mb-2">Courses</h4>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {teacher.subjects.map((subject, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-medium text-white">No teachers found</h2>
              <p className="text-white/70 mt-2">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default TeachersPage;
