
import { User, Course, Teacher, Exam, ClassDetails, BusSchedule } from '../types';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    semester: 3
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    semester: 5
  }
];

// Mock Courses
export const courses: Course[] = [
  { id: '1', code: 'CS101', name: 'Introduction to Computer Science', credits: 4 },
  { id: '2', code: 'CS102', name: 'Data Structures', credits: 4 },
  { id: '3', code: 'CS103', name: 'Algorithms', credits: 3 },
  { id: '4', code: 'MATH101', name: 'Calculus', credits: 4 },
  { id: '5', code: 'PHY101', name: 'Physics', credits: 3 },
  { id: '6', code: 'ENG101', name: 'English', credits: 2 },
  { id: '7', code: 'CS201', name: 'Database Management', credits: 4 },
  { id: '8', code: 'CS202', name: 'Operating Systems', credits: 4 }
];

// Mock Teachers
export const teachers: Teacher[] = [
  {
    id: '1',
    name: 'Dr. Robert Smith',
    department: 'Computer Science',
    email: 'robert.smith@example.com',
    subjects: ['CS101', 'CS201'],
    avatar: '👨‍🏫'
  },
  {
    id: '2',
    name: 'Dr. Emma Johnson',
    department: 'Computer Science',
    email: 'emma.johnson@example.com',
    subjects: ['CS102', 'CS103'],
    avatar: '👩‍🏫'
  },
  {
    id: '3',
    name: 'Prof. Michael Brown',
    department: 'Mathematics',
    email: 'michael.brown@example.com',
    subjects: ['MATH101'],
    avatar: '👨‍🏫'
  },
  {
    id: '4',
    name: 'Dr. Sarah Wilson',
    department: 'Physics',
    email: 'sarah.wilson@example.com',
    subjects: ['PHY101'],
    avatar: '👩‍🏫'
  }
];

// Generate dates for exams
const getExamDates = () => {
  const dates = [];
  const today = new Date();
  
  // Generate a date 1 day from now
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  dates.push(tomorrow.toISOString().split('T')[0]);
  
  // Generate a date 3 days from now
  const threeDaysLater = new Date();
  threeDaysLater.setDate(today.getDate() + 3);
  dates.push(threeDaysLater.toISOString().split('T')[0]);
  
  // Generate a date 5 days from now
  const fiveDaysLater = new Date();
  fiveDaysLater.setDate(today.getDate() + 5);
  dates.push(fiveDaysLater.toISOString().split('T')[0]);
  
  // Generate today's date for testing notification
  dates.push(today.toISOString().split('T')[0]);
  
  return dates;
};

const examDates = getExamDates();

// Mock Exams
export const exams: Exam[] = [
  {
    id: '1',
    courseCode: 'CS101',
    courseName: 'Introduction to Computer Science',
    date: examDates[0],
    startTime: '09:00:00',
    endTime: '11:00:00',
    venue: 'Room 101'
  },
  {
    id: '2',
    courseCode: 'CS102',
    courseName: 'Data Structures',
    date: examDates[1],
    startTime: '13:00:00',
    endTime: '15:00:00',
    venue: 'Room 102'
  },
  {
    id: '3',
    courseCode: 'MATH101',
    courseName: 'Calculus',
    date: examDates[2],
    startTime: '10:00:00',
    endTime: '12:00:00',
    venue: 'Room 201'
  },
  {
    id: '4',
    courseCode: 'PHY101',
    courseName: 'Physics',
    date: examDates[3], // Today's exam for testing notification
    startTime: '14:00:00',
    endTime: '16:00:00',
    venue: 'Room 301'
  }
];

// Mock Class Details
export const classDetails: ClassDetails[] = [
  {
    id: '1',
    courseCode: 'CS101',
    courseName: 'Introduction to Computer Science',
    teacher: 'Dr. Robert Smith',
    day: 'Monday',
    startTime: '09:00:00',
    endTime: '10:30:00',
    room: 'Room 101'
  },
  {
    id: '2',
    courseCode: 'CS102',
    courseName: 'Data Structures',
    teacher: 'Dr. Emma Johnson',
    day: 'Tuesday',
    startTime: '11:00:00',
    endTime: '12:30:00',
    room: 'Room 102'
  },
  {
    id: '3',
    courseCode: 'MATH101',
    courseName: 'Calculus',
    teacher: 'Prof. Michael Brown',
    day: 'Wednesday',
    startTime: '14:00:00',
    endTime: '15:30:00',
    room: 'Room 201'
  },
  {
    id: '4',
    courseCode: 'PHY101',
    courseName: 'Physics',
    teacher: 'Dr. Sarah Wilson',
    day: 'Thursday',
    startTime: '16:00:00',
    endTime: '17:30:00',
    room: 'Room 301'
  }
];

// Mock Bus Schedules
export const busSchedules: BusSchedule[] = [
  {
    id: '1',
    routeNumber: 'R1',
    departureTime: '08:00:00',
    arrivalTime: '08:30:00',
    from: 'City Center',
    to: 'Campus',
    stops: ['Stop 1', 'Stop 2', 'Stop 3']
  },
  {
    id: '2',
    routeNumber: 'R1',
    departureTime: '12:00:00',
    arrivalTime: '12:30:00',
    from: 'City Center',
    to: 'Campus',
    stops: ['Stop 1', 'Stop 2', 'Stop 3']
  },
  {
    id: '3',
    routeNumber: 'R1',
    departureTime: '17:00:00',
    arrivalTime: '17:30:00',
    from: 'Campus',
    to: 'City Center',
    stops: ['Stop 3', 'Stop 2', 'Stop 1']
  },
  {
    id: '4',
    routeNumber: 'R2',
    departureTime: '07:30:00',
    arrivalTime: '08:15:00',
    from: 'Suburb',
    to: 'Campus',
    stops: ['Stop 4', 'Stop 5', 'Stop 6']
  },
  {
    id: '5',
    routeNumber: 'R2',
    departureTime: '17:30:00',
    arrivalTime: '18:15:00',
    from: 'Campus',
    to: 'Suburb',
    stops: ['Stop 6', 'Stop 5', 'Stop 4']
  }
];
