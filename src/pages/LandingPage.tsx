
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Calendar, Users, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/auth/auth-context';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    // Redirect to dashboard if already logged in
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-campus-purple" />
            <h1 className="text-2xl font-bold text-gray-800">
              Campus<span className="text-campus-purple">Connect</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="outline" className="border-campus-purple text-campus-purple hover:text-campus-purple/90 hover:bg-campus-purple/10">
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-campus-purple hover:bg-campus-purple/90">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero section with dynamic gradient background */}
      <section className="bg-dynamic-gradient animate-gradient-shift bg-[length:400%_400%] py-20 flex-grow">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in drop-shadow-md">
                Your Digital Campus Companion
              </h1>
              <p className="text-xl text-gray-800 mb-8 animate-fade-in drop-shadow-sm" style={{ animationDelay: "0.1s" }}>
                Manage your academic journey with ease. Track exams, classes, 
                grades and more in one convenient platform.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <Link to="/register">
                  <Button size="lg" className="bg-campus-purple text-white hover:bg-campus-purple/90 shadow-lg">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="text-gray-900 border-gray-900 hover:bg-gray-900/10 shadow">
                    Log In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-10 animate-float">
              <div className="glass-morphism rounded-lg p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-campus-purple via-campus-softBlue to-campus-softGreen opacity-30 blur"></div>
                <div className="relative p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-inner">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="flex-grow h-6 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="h-6 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded-md animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded-md w-5/6 animate-pulse"></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-12 bg-campus-purple/20 rounded-md animate-pulse"></div>
                        <div className="h-12 bg-campus-softBlue/30 rounded-md animate-pulse"></div>
                        <div className="h-12 bg-campus-yellow/30 rounded-md animate-pulse"></div>
                        <div className="h-12 bg-campus-softGreen/30 rounded-md animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* About section */}
      <section className="py-16 bg-campus-softGray">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">About CampusConnect</h2>
          <p className="text-lg text-gray-700 text-center mb-10 max-w-3xl mx-auto">
            CampusConnect is designed to streamline your academic experience by providing a centralized 
            platform for all your campus needs. We believe in making education management simple and efficient.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-campus-purple">Our Mission</h3>
              <p className="text-gray-700">
                To empower students with intuitive tools that enhance their academic journey 
                and help them achieve their educational goals with minimal stress.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-campus-purple">Our Vision</h3>
              <p className="text-gray-700">
                To become the go-to platform for academic management, connecting students, 
                educators, and academic institutions in a seamless digital environment.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section with updated colors */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Calendar className="h-8 w-8 text-campus-purple" />}
              title="Exam Schedule"
              description="Never miss an important exam with our comprehensive scheduler and reminders."
              bgColor="bg-campus-yellow/20"
            />
            <FeatureCard 
              icon={<BookOpen className="h-8 w-8 text-campus-purple" />}
              title="SGPA/CGPA Calculator"
              description="Calculate your semester and cumulative GPA with our easy-to-use tool."
              bgColor="bg-campus-softBlue/30"
            />
            <FeatureCard 
              icon={<Users className="h-8 w-8 text-campus-purple" />}
              title="Teacher Details"
              description="Access information about your professors, including office hours and contact details."
              bgColor="bg-campus-softGreen/30"
            />
            <FeatureCard 
              icon={<CheckCircle className="h-8 w-8 text-campus-purple" />}
              title="Class Schedule"
              description="Keep track of your weekly classes and receive timely notifications."
              bgColor="bg-campus-purple/20"
            />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <GraduationCap className="h-6 w-6 text-campus-purple" />
              <h2 className="text-xl font-bold">
                Campus<span className="text-campus-purple">Connect</span>
              </h2>
            </div>
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} CampusConnect. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  bgColor = "bg-white" 
}: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  bgColor?: string
}) => (
  <div className={`${bgColor} rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow`}>
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-700">{description}</p>
  </div>
);

export default LandingPage;
