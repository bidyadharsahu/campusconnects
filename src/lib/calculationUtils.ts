
/**
 * Calculate SGPA based on courses and grades
 * @param courses Array of courses with credits and grades
 * @returns The calculated SGPA
 */
export function calculateSGPA(courses: { credits: number; gradePoint?: number }[]): number {
  // Filter courses that have a grade point
  const validCourses = courses.filter(course => typeof course.gradePoint === 'number');
  
  if (validCourses.length === 0) return 0;
  
  // Calculate total credit points and credits
  let totalCreditPoints = 0;
  let totalCredits = 0;
  
  for (const course of validCourses) {
    totalCreditPoints += course.credits * (course.gradePoint as number);
    totalCredits += course.credits;
  }
  
  // Calculate SGPA
  return totalCredits > 0 ? Number((totalCreditPoints / totalCredits).toFixed(2)) : 0;
}

/**
 * Calculate CGPA based on semester SGPAs and credits
 * @param semesters Array of semesters with SGPA and total credits
 * @returns The calculated CGPA
 */
export function calculateCGPA(semesters: { sgpa: number; credits: number }[]): number {
  // Filter semesters with valid SGPA
  const validSemesters = semesters.filter(sem => sem.sgpa > 0);
  
  if (validSemesters.length === 0) return 0;
  
  // Calculate total weighted SGPA and total credits
  let totalWeightedSGPA = 0;
  let totalCredits = 0;
  
  for (const semester of validSemesters) {
    totalWeightedSGPA += semester.sgpa * semester.credits;
    totalCredits += semester.credits;
  }
  
  // Calculate CGPA
  return totalCredits > 0 ? Number((totalWeightedSGPA / totalCredits).toFixed(2)) : 0;
}

/**
 * Convert grade to grade point
 * @param grade Letter grade
 * @returns The corresponding grade point
 */
export function getGradePoint(grade: string): number {
  const gradeMap: { [key: string]: number } = {
    'A+': 10.0,
    'A': 9.0,
    'B+': 8.0,
    'B': 7.0,
    'C+': 6.0,
    'C': 5.0,
    'D': 4.0,
    'F': 0.0
  };
  
  return gradeMap[grade] || 0;
}

/**
 * Calculate the time remaining until an exam
 * @param examDate Date of the exam
 * @returns Object containing days, hours, minutes remaining
 */
export function getTimeUntilExam(examDate: string): {
  days: number;
  hours: number;
  minutes: number;
  isToday: boolean;
} {
  const now = new Date();
  const examDateTime = new Date(examDate);
  const diffMs = examDateTime.getTime() - now.getTime();
  
  // If exam has passed, return zeros
  if (diffMs < 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      isToday: false
    };
  }
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  // Check if the exam is today
  const isToday = now.toDateString() === examDateTime.toDateString();
  
  return {
    days,
    hours,
    minutes,
    isToday
  };
}

/**
 * Format the date to display in a readable format
 * @param dateString Date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Format time for display
 * @param timeString Time string
 * @returns Formatted time string
 */
export function formatTime(timeString: string): string {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}
