
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, Save } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/auth/auth-context';
import { useNavigate } from 'react-router-dom';

interface Course {
  id?: string;
  semester: number;
  code: string;
  name: string;
  credits: number;
  isNew?: boolean;
}

const AdminCoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [semester, setSemester] = useState<string>("1");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    fetchCourses(parseInt(semester, 10));
  }, [semester, isAdmin, navigate]);
  
  const fetchCourses = async (semesterNum: number) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('semester_courses')
        .select('*')
        .eq('semester', semesterNum)
        .order('code');
        
      if (error) {
        throw error;
      }
      
      setCourses(data.map(course => ({
        ...course,
        credits: Number(course.credits)
      })));
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load courses',
        variant: 'destructive',
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const addNewCourse = () => {
    setCourses([
      ...courses, 
      {
        semester: parseInt(semester, 10),
        code: '',
        name: '',
        credits: 3,
        isNew: true
      }
    ]);
  };
  
  const removeCourse = async (index: number, id?: string) => {
    if (id) {
      try {
        const { error } = await supabase
          .from('semester_courses')
          .delete()
          .eq('id', id);
          
        if (error) {
          throw error;
        }
        
        toast({
          title: 'Success',
          description: 'Course removed successfully',
          duration: 3000
        });
      } catch (error) {
        console.error('Error removing course:', error);
        toast({
          title: 'Error',
          description: 'Failed to remove course',
          variant: 'destructive',
          duration: 3000
        });
        return;
      }
    }
    
    const updatedCourses = [...courses];
    updatedCourses.splice(index, 1);
    setCourses(updatedCourses);
  };
  
  const updateCourse = (index: number, field: string, value: string | number) => {
    const updatedCourses = [...courses];
    updatedCourses[index] = { ...updatedCourses[index], [field]: value };
    setCourses(updatedCourses);
  };
  
  const saveCourses = async () => {
    setIsSubmitting(true);
    
    try {
      // Validate all courses
      const invalidCourses = courses.filter(course => !course.code || !course.name);
      if (invalidCourses.length > 0) {
        toast({
          title: 'Validation Error',
          description: 'All courses must have a code and name',
          variant: 'destructive',
          duration: 3000
        });
        setIsSubmitting(false);
        return;
      }
      
      // Split courses into those to update and those to insert
      const coursesToUpdate = courses.filter(course => !!course.id);
      const coursesToInsert = courses.filter(course => !course.id);
      
      // Update existing courses
      for (const course of coursesToUpdate) {
        const { error } = await supabase
          .from('semester_courses')
          .update({
            code: course.code,
            name: course.name,
            credits: course.credits
          })
          .eq('id', course.id);
          
        if (error) throw error;
      }
      
      // Insert new courses
      if (coursesToInsert.length > 0) {
        const { error } = await supabase
          .from('semester_courses')
          .insert(coursesToInsert);
          
        if (error) throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Courses saved successfully',
        duration: 3000
      });
      
      // Refetch to get any new IDs
      fetchCourses(parseInt(semester, 10));
      
    } catch (error) {
      console.error('Error saving courses:', error);
      toast({
        title: 'Error',
        description: 'Failed to save courses',
        variant: 'destructive',
        duration: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const semesters = Array.from({ length: 8 }, (_, i) => i + 1);
  const creditOptions = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-white mb-2">Manage Courses</h1>
        <p className="text-white/70 mb-6">Add, edit or remove courses for each semester</p>
        
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Semester Courses</CardTitle>
                <CardDescription>Configure courses for each semester</CardDescription>
              </div>
              
              <Select
                value={semester}
                onValueChange={setSemester}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading courses...</div>
            ) : (
              <div className="space-y-6">
                {courses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No courses found for semester {semester}. Add courses using the button below.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courses.map((course, index) => (
                      <div key={index} className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-2">
                          <Label htmlFor={`code-${index}`} className="sr-only">Course Code</Label>
                          <Input
                            id={`code-${index}`}
                            value={course.code}
                            onChange={(e) => updateCourse(index, 'code', e.target.value)}
                            placeholder="Code"
                          />
                        </div>
                        
                        <div className="col-span-7">
                          <Label htmlFor={`name-${index}`} className="sr-only">Course Name</Label>
                          <Input
                            id={`name-${index}`}
                            value={course.name}
                            onChange={(e) => updateCourse(index, 'name', e.target.value)}
                            placeholder="Course name"
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <Label htmlFor={`credits-${index}`} className="sr-only">Credits</Label>
                          <Select
                            value={course.credits.toString()}
                            onValueChange={(value) => updateCourse(index, 'credits', parseFloat(value))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Credits" />
                            </SelectTrigger>
                            <SelectContent>
                              {creditOptions.map((credit) => (
                                <SelectItem key={credit} value={credit.toString()}>
                                  {credit} credits
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-span-1 flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCourse(index, course.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between pt-4 border-t border-white/10">
                  <Button
                    variant="outline"
                    onClick={addNewCourse}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add Course
                  </Button>
                  
                  <Button
                    onClick={saveCourses}
                    disabled={isSubmitting || courses.length === 0}
                    className="flex items-center gap-1 bg-campus-purple hover:bg-campus-purple/80"
                  >
                    <Save className="h-4 w-4" /> 
                    {isSubmitting ? 'Saving...' : 'Save Courses'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminCoursesPage;
