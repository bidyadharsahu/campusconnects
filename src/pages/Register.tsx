
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/auth/auth-context';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [semester, setSemester] = useState<string>('1');
  const [branch, setBranch] = useState('Computer Science');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateForm = () => {
    // Reset errors
    setPasswordError('');
    setFormError('');
    
    // Validate basic required fields
    if (!name || !email || !password || !confirmPassword) {
      setFormError('Please fill in all required fields');
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    
    // Check if it's an admin email
    if (email.endsWith('@nist.edu')) {
      setFormError('Admin accounts cannot be registered here');
      return false;
    }
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return false;
    }
    
    // Validate password strength
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await register(
        name, 
        email, 
        password,
        parseInt(semester, 10)
      );
      
      if (success) {
        toast({
          title: "Registration Successful",
          description: "Your account has been created. Please verify your email before logging in.",
          duration: 5000,
        });
        navigate('/login', { state: { registrationSuccess: true } });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setFormError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const branches = [
    'Computer Science',
    'Information Technology',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electronics & Communication'
  ];
  
  const semesters = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4 py-10">
      <div className="w-full max-w-md mb-10">
        <div className="flex items-center justify-center mb-8">
          <GraduationCap className="h-12 w-12 text-white mr-3" />
          <h1 className="text-4xl font-bold text-high-contrast">
            Campus<span className="text-campus-purple">Connect</span>
          </h1>
        </div>
        
        <Card className="border-white/20 backdrop-blur-sm bg-white/5">
          <CardHeader>
            <CardTitle className="text-foreground text-2xl">Create an account</CardTitle>
            <CardDescription className="text-foreground/70 text-base">
              Register to access all campus features and resources
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {formError && (
              <div className="bg-destructive/20 border border-destructive/50 text-destructive rounded-lg p-3 flex items-start mb-4">
                <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
                <div className="text-sm">{formError}</div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-foreground h-11 text-base"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-foreground h-11 text-base"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="semester" className="text-base">Semester</Label>
                  <Select 
                    value={semester} 
                    onValueChange={setSemester}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-foreground h-11 text-base">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="branch" className="text-base">Branch</Label>
                  <Select
                    value={branch}
                    onValueChange={setBranch}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-foreground h-11 text-base">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base">Phone Number (Optional)</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="+91 9876543210" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white/10 border-white/20 text-foreground h-11 text-base"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-foreground h-11 text-base"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-base">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-foreground h-11 text-base"
                />
                {passwordError && (
                  <p className="text-sm text-destructive mt-1">{passwordError}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-campus-purple hover:bg-campus-purple/80 h-11 text-base font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter>
            <p className="text-base text-center w-full text-foreground/70">
              Already have an account?{' '}
              <Link to="/login" className="text-campus-purple hover:underline font-medium">
                Login here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
