
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Eye, EyeOff } from 'lucide-react';
import { login } from '@/lib/api';
import DemoCredentialsToggle from '@/components/DemoCredentialsToggle';
import DemoCredentialsPanel from '@/components/DemoCredentialsPanel';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  // Load demo credentials visibility from sessionStorage
  useEffect(() => {
    const savedState = sessionStorage.getItem('showDemoCredentials');
    if (savedState === 'true') {
      setShowDemoCredentials(true);
    }
  }, []);

  // Save demo credentials visibility to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('showDemoCredentials', showDemoCredentials.toString());
  }, [showDemoCredentials]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(username, password);
      navigate('/');
    } catch {
      setError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoFill = (demoUsername: string, demoPassword: string) => {
    setUsername(demoUsername);
    setPassword(demoPassword);
    setError('');
    
    // Auto-submit the form
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.requestSubmit();
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Murgenere</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              {error && (
                <div className="text-sm text-[hsl(var(--destructive-foreground))] bg-[hsl(var(--destructive))] p-2 rounded">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Demo Credentials Toggle - only on login page */}
      <DemoCredentialsToggle
        isVisible={showDemoCredentials}
        onToggle={setShowDemoCredentials}
      />

      {/* Demo Credentials Panel */}
      <DemoCredentialsPanel
        isVisible={showDemoCredentials}
        onAutoFill={handleAutoFill}
        toggleId="demo-credentials-toggle"
      />
    </div>
  );
};

export default Login;
