
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { calculateCGPA } from '@/lib/calculationUtils';

const CGPACalculator = () => {
  const [semesters, setSemesters] = useState([
    { sgpa: 0, credits: 20 },
  ]);
  const [cgpa, setCgpa] = useState(0);
  
  const addSemester = () => {
    setSemesters([...semesters, { sgpa: 0, credits: 20 }]);
  };
  
  const removeSemester = (index: number) => {
    const updatedSemesters = [...semesters];
    updatedSemesters.splice(index, 1);
    setSemesters(updatedSemesters.length ? updatedSemesters : [{ sgpa: 0, credits: 20 }]);
  };
  
  const handleSGPAChange = (index: number, value: string) => {
    const sgpa = parseFloat(value);
    if (isNaN(sgpa) || sgpa < 0 || sgpa > 10) return;
    
    const updatedSemesters = [...semesters];
    updatedSemesters[index].sgpa = sgpa;
    setSemesters(updatedSemesters);
  };
  
  const handleCreditsChange = (index: number, value: string) => {
    const credits = parseInt(value);
    if (isNaN(credits) || credits <= 0) return;
    
    const updatedSemesters = [...semesters];
    updatedSemesters[index].credits = credits;
    setSemesters(updatedSemesters);
  };
  
  const calculate = () => {
    const result = calculateCGPA(semesters);
    setCgpa(result);
  };
  
  const reset = () => {
    setSemesters([{ sgpa: 0, credits: 20 }]);
    setCgpa(0);
  };
  
  return (
    <div className="space-y-6">
      <Card className="p-6 glass-card">
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 items-center font-medium text-white">
            <div className="col-span-4">Semester</div>
            <div className="col-span-4 md:col-span-5">SGPA</div>
            <div className="col-span-3 md:col-span-2">Credits</div>
            <div className="col-span-1"></div>
          </div>
          
          {semesters.map((semester, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-4 text-white/80">
                Semester {index + 1}
              </div>
              
              <div className="col-span-4 md:col-span-5">
                <Input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  max="10"
                  step="0.01"
                  value={semester.sgpa || ''}
                  onChange={(e) => handleSGPAChange(index, e.target.value)}
                />
              </div>
              
              <div className="col-span-3 md:col-span-2">
                <Input
                  type="number"
                  placeholder="20"
                  min="1"
                  value={semester.credits || ''}
                  onChange={(e) => handleCreditsChange(index, e.target.value)}
                />
              </div>
              
              <div className="col-span-1 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeSemester(index)}
                  disabled={semesters.length === 1}
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
              onClick={addSemester}
              disabled={semesters.length >= 8}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Semester
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
          <Label className="text-lg text-white/80">Your CGPA</Label>
          <div className="text-5xl font-bold mt-2 text-white">
            {cgpa.toFixed(2)}
          </div>
          {cgpa > 0 && (
            <div className="mt-4 text-sm text-white/60">
              Total semesters: {semesters.filter(s => s.sgpa > 0).length}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CGPACalculator;
