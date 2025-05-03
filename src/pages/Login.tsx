
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GraduationCap, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/auth/auth-context';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Check for various messages in location state
  const confirmationMessage = location.state?.confirmationMessage;
  const registrationSuccess = location.state?.registrationSuccess;
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (user) {
      // Redirect based on admin status
      if (email.endsWith('@nist.edu')) {
        navigate('/admin');
      } else {
        navigate(from);
      }
    }
    
    if (confirmationMessage) {
      toast({
        title: "Email Verified",
        description: "Your email has been successfully verified! You can now log in.",
        duration: 5000,
      });
    }

    if (registrationSuccess) {
      toast({
        title: "Registration Successful",
        description: "Your account has been created. You can now log in.",
        duration: 5000,
      });
    }
  }, [user, navigate, confirmationMessage, registrationSuccess, toast, from, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // Validate input
      if (!email || !password) {
        setErrorMessage('Please enter both email and password');
        setIsSubmitting(false);
        return;
      }
      
      const success = await login(email, password);
      if (!success) {
        // Login failed but error is already shown by the auth service
        console.log("Login failed");
      }
      // If successful, navigation will happen in the useEffect when user state changes
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAdminEmail = email.endsWith('@nist.edu');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        {confirmationMessage && (
          <div className="bg-green-100 border border-green-200 text-green-800 rounded-lg p-4 mb-6 flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Email Verified</p>
              <p className="text-sm text-green-700">Your account has been successfully verified. You can now log in.</p>
            </div>
          </div>
        )}
        
        {registrationSuccess && (
          <div className="bg-green-100 border border-green-200 text-green-800 rounded-lg p-4 mb-6 flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Registration Successful</p>
              <p className="text-sm text-green-700">Your account has been successfully created. You can now log in.</p>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-center mb-8">
          <GraduationCap className="h-12 w-12 text-white mr-3" />
          <h1 className="text-4xl font-bold text-high-contrast">
            Campus<span className="text-campus-purple">Connect</span>
          </h1>
        </div>
        
        <Card className="border-white/20 backdrop-blur-sm bg-white/5">
          <CardHeader>
            <CardTitle className="text-foreground text-2xl">Login to your account</CardTitle>
            <CardDescription className="text-foreground/70 text-base">
              Enter your credentials to access your campus dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="bg-destructive/20 border border-destructive/50 text-destructive rounded-lg p-3 flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
                <div className="text-sm">{errorMessage}</div>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground text-base">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-foreground h-11 text-base"
                  />
                  {isAdminEmail && (
                    <p className="text-sm text-campus-purple mt-1 font-medium">Admin account detected</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground text-base">Password</Label>
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
                
                <Button 
                  type="submit" 
                  className="w-full bg-campus-purple hover:bg-campus-purple/80 h-11 text-base font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-base text-center text-foreground/70 w-full">
              {!isAdminEmail && (
                <>
                  Don't have an account?{' '}
                  <Link to="/register" className="text-campus-purple hover:underline font-medium">
                    Register here
                  </Link>
                </>
              )}
              {isAdminEmail && (
                <p>Admin accounts require special authorization</p>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
