
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/auth/auth-context";

// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import CalculatorPage from "./pages/CalculatorPage";
import ExamsPage from "./pages/ExamsPage";
import ClassesPage from "./pages/ClassesPage";
import TeachersPage from "./pages/TeachersPage";
import BusSchedulePage from "./pages/BusSchedulePage";
import NotificationsPage from "./pages/NotificationsPage";
import NotesPage from "./pages/NotesPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCoursesPage from "./pages/AdminCoursesPage";
import ProfilePage from "./pages/ProfilePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/calculator" element={<PrivateRoute><CalculatorPage /></PrivateRoute>} />
            <Route path="/exams" element={<PrivateRoute><ExamsPage /></PrivateRoute>} />
            <Route path="/classes" element={<PrivateRoute><ClassesPage /></PrivateRoute>} />
            <Route path="/teachers" element={<PrivateRoute><TeachersPage /></PrivateRoute>} />
            <Route path="/bus-schedule" element={<PrivateRoute><BusSchedulePage /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
            <Route path="/notes" element={<PrivateRoute><NotesPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/courses" element={<PrivateRoute adminOnly={true}><AdminCoursesPage /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
