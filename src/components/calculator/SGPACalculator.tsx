
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Course } from '@/types';
import { courses as allCourses } from '@/lib/mockData';
import { calculateSGPA, getGradePoint } from '@/lib/calculationUtils';
import { Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/auth/auth-context';
import { supabase } from '@/integrations/supabase/client';

const SGPACalculator = () => {
  const [courses, setCourses] = useState<(Course & { gradePoint?: number })[]>([
    { ...allCourses[0], grade: undefined, gradePoint: undefined }
  ]);
  const [sgpa, setSgpa] = useState<number>(0);
  const [semesterCourses, setSemesterCourses] = useState<Course[]>([]);
  const { profile, isAdmin } = useAuth();
  
  const grades = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'];
  const creditOptions = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  
  // Fetch courses from the database
  useEffect(() => {
    const fetchCourses = async () => {
      if (profile) {
        try {
          const { data, error } = await supabase
            .from('semester_courses')
            .select('*')
            .eq('semester', profile.semester);
            
          if (error) {
            console.error('Error fetching courses:', error);
          } else if (data && data.length > 0) {
            const dbCourses = data.map(item => ({
              id: item.id,
              code: item.code,
              name: item.name,
              credits: Number(item.credits),
            }));
            setSemesterCourses(dbCourses);
            // Initialize with first course from DB if available
            if (dbCourses.length > 0 && courses.length === 1 && !courses[0].grade) {
              setCourses([{ ...dbCourses[0], grade: undefined, gradePoint: undefined }]);
            }
          }
        } catch (error) {
          console.error('Error in fetchCourses:', error);
        }
      }
    };
    
    fetchCourses();
  }, [profile]);
  
  // Use DB courses if available, otherwise use mock data
  const availableCourses = semesterCourses.length > 0 ? semesterCourses : allCourses;
  
  const addCourse = () => {
    // Find a course that hasn't been added yet
    const unusedCourses = availableCourses.filter(
      availableCourse => !courses.some(c => c.id === availableCourse.id)
    );
    
    if (unusedCourses.length > 0) {
      setCourses([...courses, { ...unusedCourses[0], grade: undefined, gradePoint: undefined }]);
    }
  };
  
  const removeCourse = (index: number) => {
    const updatedCourses = [...courses];
    updatedCourses.splice(index, 1);
    setCourses(updatedCourses.length ? updatedCourses : [{ ...availableCourses[0], grade: undefined, gradePoint: undefined }]);
  };
  
  const handleCourseChange = (index: number, courseId: string) => {
    const selectedCourse = availableCourses.find(c => c.id === courseId);
    if (!selectedCourse) return;
    
    const updatedCourses = [...courses];
    updatedCourses[index] = { ...selectedCourse, grade: updatedCourses[index]?.grade, gradePoint: updatedCourses[index]?.gradePoint };
    setCourses(updatedCourses);
  };
  
  const handleGradeChange = (index: number, grade: string) => {
    const updatedCourses = [...courses];
    updatedCourses[index].grade = grade;
    updatedCourses[index].gradePoint = getGradePoint(grade);
    setCourses(updatedCourses);
  };
  
  const handleCreditsChange = (index: number, credits: string) => {
    const creditsNum = parseFloat(credits);
    if (isNaN(creditsNum) || creditsNum <= 0) return;
    
    const updatedCourses = [...courses];
    updatedCourses[index].credits = creditsNum;
    setCourses(updatedCourses);
  };
  
  const calculate = () => {
    // Only consider courses that have a valid grade and gradePoint
    const coursesWithGrades = courses.filter(course => course.grade && typeof course.gradePoint === 'number');
    const result = calculateSGPA(coursesWithGrades);
    setSgpa(result);
  };
  
  const reset = () => {
    setCourses([{ ...availableCourses[0], grade: undefined, gradePoint: undefined }]);
    setSgpa(0);
  };
  
  return (
    <div className="space-y-6">
      <Card className="p-6 glass-card">
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 items-center font-medium text-white">
            <div className="col-span-5 md:col-span-5">Course</div>
            <div className="col-span-3 md:col-span-2">Credits</div>
            <div className="col-span-3 md:col-span-3">Grade</div>
            <div className="col-span-1 md:col-span-2"></div>
          </div>
          
          {courses.map((course, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-5 md:col-span-5">
                <Select
                  value={course.id}
                  onValueChange={(value) => handleCourseChange(index, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCourses.map((c) => (
                      <SelectItem 
                        key={c.id} 
                        value={c.id}
                        disabled={courses.some(selected => selected.id === c.id && selected !== course)}
                      >
                        {c.code} - {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-3 md:col-span-2">
                <Select
                  value={course.credits.toString()}
                  onValueChange={(value) => handleCreditsChange(index, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Credits" />
                  </SelectTrigger>
                  <SelectContent>
                    {creditOptions.map((credit) => (
                      <SelectItem key={credit} value={credit.toString()}>
                        {credit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-3 md:col-span-3">
                <Select
                  value={course.grade}
                  onValueChange={(value) => handleGradeChange(index, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade} {grade !== 'F' && `(${getGradePoint(grade)})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-1 md:col-span-2 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeCourse(index)}
                  disabled={courses.length === 1}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
          
          <div className="flex justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={addCourse}
              disabled={courses.length >= availableCourses.length}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Course
            </Button>
            
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={reset}
              >
                Reset
              </Button>
              
              <Button
                onClick={calculate}
                size="sm"
                className="bg-campus-purple hover:bg-campus-purple/80"
              >
                Calculate
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 glass-card">
        <div className="text-center">
          <Label className="text-lg text-white/80">Your SGPA</Label>
          <div className="text-5xl font-bold mt-2 text-white">
            {sgpa.toFixed(2)}
          </div>
          {sgpa > 0 && (
            <div className="mt-4 text-sm text-white/60">
              Total credits: {courses.reduce((acc, course) => acc + (course.grade ? course.credits : 0), 0)}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SGPACalculator;
