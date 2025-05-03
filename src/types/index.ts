
// User types
export interface User {
  id: string;
  name: string;
  email: string;
  semester: number;
  branch?: string;
  role?: "user" | "admin";
  phone?: string;
}

// Course types for SGPA/CGPA calculation
export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  grade?: string;
  gradePoint?: number;
}

// Teacher details
export interface Teacher {
  id: string;
  name: string;
  department: string;
  email: string;
  subjects: string[];
  avatar?: string;
}

// Exam types
export interface Exam {
  id: string;
  courseCode: string;
  courseName: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  semester?: number;
}

// Class details
export interface ClassDetails {
  id: string;
  courseCode: string;
  courseName: string;
  teacher: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  semester?: number;
}

// Bus schedule
export interface BusSchedule {
  id: string;
  routeNumber: string;
  departureTime: string;
  arrivalTime: string;
  from: string;
  to: string;
  stops: string[];
}

// User notes
export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  reminderDate?: string;
  completed: boolean;
}
