
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/auth/auth-context';
import { useNavigate } from 'react-router-dom';
import { users, exams, teachers } from '@/lib/mockData';
import { Users, Calendar, GraduationCap, Bus, BookOpen, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Teacher, Exam } from '@/types';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for managing dialogs
  const [isTeacherDialogOpen, setIsTeacherDialogOpen] = useState(false);
  const [isExamDialogOpen, setIsExamDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string }>({ type: '', id: '' });
  
  // State for form inputs
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({
    name: '',
    department: '',
    email: '',
    subjects: [],
  });
  
  const [newExam, setNewExam] = useState<Partial<Exam>>({
    courseCode: '',
    courseName: '',
    date: '',
    startTime: '',
    endTime: '',
    venue: '',
    semester: 1,
  });

  // Local state for mock data
  const [localTeachers, setLocalTeachers] = useState([...teachers]);
  const [localExams, setLocalExams] = useState([...exams]);
  
  // Redirect non-admin users
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);
  
  // Handler for adding a new teacher
  const handleAddTeacher = () => {
    const teacherId = `teacher-${Date.now()}`;
    const teacher = {
      id: teacherId,
      name: newTeacher.name || '',
      department: newTeacher.department || '',
      email: newTeacher.email || '',
      subjects: newTeacher.subjects || [],
    };
    
    setLocalTeachers([...localTeachers, teacher]);
    toast({
      title: "Teacher Added",
      description: `${teacher.name} has been added to the faculty.`,
    });
    
    setIsTeacherDialogOpen(false);
    setNewTeacher({
      name: '',
      department: '',
      email: '',
      subjects: [],
    });
  };
  
  // Handler for adding a new exam
  const handleAddExam = () => {
    const examId = `exam-${Date.now()}`;
    const exam = {
      id: examId,
      courseCode: newExam.courseCode || '',
      courseName: newExam.courseName || '',
      date: newExam.date || '',
      startTime: newExam.startTime || '',
      endTime: newExam.endTime || '',
      venue: newExam.venue || '',
      semester: newExam.semester || 1,
    };
    
    setLocalExams([...localExams, exam]);
    toast({
      title: "Exam Added",
      description: `${exam.courseName} exam has been scheduled.`,
    });
    
    setIsExamDialogOpen(false);
    setNewExam({
      courseCode: '',
      courseName: '',
      date: '',
      startTime: '',
      endTime: '',
      venue: '',
      semester: 1,
    });
  };
  
  // Handler for confirming deletion
  const handleDelete = () => {
    if (itemToDelete.type === 'teacher') {
      setLocalTeachers(localTeachers.filter(teacher => teacher.id !== itemToDelete.id));
      toast({
        title: "Teacher Removed",
        description: "Faculty member has been removed from the system.",
      });
    } else if (itemToDelete.type === 'exam') {
      setLocalExams(localExams.filter(exam => exam.id !== itemToDelete.id));
      toast({
        title: "Exam Removed",
        description: "Exam has been removed from the schedule.",
      });
    }
    
    setIsDeleteDialogOpen(false);
    setItemToDelete({ type: '', id: '' });
  };
  
  // Handler for confirming item deletion
  const confirmDelete = (type: string, id: string) => {
    setItemToDelete({ type, id });
    setIsDeleteDialogOpen(true);
  };
  
  if (!isAdmin) return null;
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Admin Dashboard
            </h1>
            <p className="text-white/70 mt-1">
              Manage campus resources and student information
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AdminStatsCard 
            title="Students" 
            value={users.filter(u => u.role !== 'admin').length} 
            icon={<Users className="h-6 w-6 text-campus-purple" />} 
          />
          
          <AdminStatsCard 
            title="Faculty Members" 
            value={localTeachers.length} 
            icon={<GraduationCap className="h-6 w-6 text-campus-purple" />} 
          />
          
          <AdminStatsCard 
            title="Courses" 
            value={15} 
            icon={<BookOpen className="h-6 w-6 text-campus-purple" />} 
          />
          
          <AdminStatsCard 
            title="Bus Routes" 
            value={4} 
            icon={<Bus className="h-6 w-6 text-campus-purple" />} 
          />
        </div>
        
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="bg-secondary/40">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            <TabsTrigger value="exams">Exams</TabsTrigger>
            <TabsTrigger value="routes">Bus Routes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="students" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-campus-purple" />
                  Student Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-white/80">
                  <p className="mb-4">Manage student accounts, view student details, and update student information.</p>
                  <div className="space-y-2">
                    {users.filter(u => u.role !== 'admin').slice(0, 5).map(user => (
                      <div key={user.id} className="flex justify-between p-2 border-b border-white/10 last:border-0">
                        <div>
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-sm text-white/60">
                            {user.email} • Semester {user.semester} • {user.branch || "Not specified"}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex justify-center">
                  <Button className="bg-campus-purple hover:bg-campus-purple/80">
                    Manage All Students
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="faculty" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-campus-purple" />
                    Faculty Management
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-campus-purple hover:bg-campus-purple/80 flex items-center gap-1"
                    onClick={() => setIsTeacherDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Add New
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-white/80">
                  <p className="mb-4">Add, edit, or remove faculty members.</p>
                  <div className="space-y-2">
                    {localTeachers.map(teacher => (
                      <div key={teacher.id} className="flex justify-between p-2 border-b border-white/10 last:border-0">
                        <div>
                          <div className="font-medium text-white">{teacher.name}</div>
                          <div className="text-sm text-white/60">
                            {teacher.department} • {teacher.email}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => confirmDelete('teacher', teacher.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="exams" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-campus-purple" />
                    Exam Schedule Management
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-campus-purple hover:bg-campus-purple/80 flex items-center gap-1"
                    onClick={() => setIsExamDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Add New
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-white/80">
                  <p className="mb-4">Update exam schedules and notify students.</p>
                  <div className="space-y-2">
                    {localExams.map(exam => (
                      <div key={exam.id} className="flex justify-between p-2 border-b border-white/10 last:border-0">
                        <div>
                          <div className="font-medium text-white">{exam.courseName}</div>
                          <div className="text-sm text-white/60">
                            {exam.date} • {exam.startTime.substring(0, 5)} to {exam.endTime.substring(0, 5)} • {exam.venue}
                            {exam.semester && <span> • Semester {exam.semester}</span>}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => confirmDelete('exam', exam.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="routes" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bus className="h-5 w-5 text-campus-purple" />
                    Bus Route Management
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-campus-purple hover:bg-campus-purple/80 flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add New
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-white/80">
                  <p className="mb-4">Manage bus routes, schedules, and stops.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Dialog for adding a new teacher */}
      <Dialog open={isTeacherDialogOpen} onOpenChange={setIsTeacherDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Faculty Member</DialogTitle>
            <DialogDescription>
              Enter the details of the new faculty member.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newTeacher.name}
                onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Input
                id="department"
                value={newTeacher.department}
                onChange={(e) => setNewTeacher({...newTeacher, department: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newTeacher.email}
                onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subjects" className="text-right">
                Subjects
              </Label>
              <Input
                id="subjects"
                placeholder="Comma separated list"
                value={newTeacher.subjects ? newTeacher.subjects.join(', ') : ''}
                onChange={(e) => setNewTeacher({...newTeacher, subjects: e.target.value.split(',').map(s => s.trim())})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTeacherDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddTeacher}>
              Add Faculty
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for adding a new exam */}
      <Dialog open={isExamDialogOpen} onOpenChange={setIsExamDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule New Exam</DialogTitle>
            <DialogDescription>
              Enter the exam details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="courseCode" className="text-right">
                Course Code
              </Label>
              <Input
                id="courseCode"
                value={newExam.courseCode}
                onChange={(e) => setNewExam({...newExam, courseCode: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="courseName" className="text-right">
                Course Name
              </Label>
              <Input
                id="courseName"
                value={newExam.courseName}
                onChange={(e) => setNewExam({...newExam, courseName: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={newExam.date}
                onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Start Time
              </Label>
              <Input
                id="startTime"
                type="time"
                value={newExam.startTime}
                onChange={(e) => setNewExam({...newExam, startTime: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                End Time
              </Label>
              <Input
                id="endTime"
                type="time"
                value={newExam.endTime}
                onChange={(e) => setNewExam({...newExam, endTime: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="venue" className="text-right">
                Venue
              </Label>
              <Input
                id="venue"
                value={newExam.venue}
                onChange={(e) => setNewExam({...newExam, venue: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="semester" className="text-right">
                Semester
              </Label>
              <Select 
                value={newExam.semester?.toString()} 
                onValueChange={(val) => setNewExam({...newExam, semester: parseInt(val)})}
              >
                <SelectTrigger id="semester" className="col-span-3">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExamDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddExam}>
              Schedule Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation dialog for deletion */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

const AdminStatsCard = ({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) => {
  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-white/70">{title}</p>
            <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
          </div>
          <div className="p-3 bg-white/5 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
