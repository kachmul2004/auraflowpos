import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { useStore } from '../lib/store';
import { Shield, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AdminLoginProps {
  onLogin: () => void;
  onBackToPOS: () => void;
  onNavigateToCashier?: () => void;
}

export function AdminLogin({ onLogin, onBackToPOS, onNavigateToCashier }: AdminLoginProps) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      // For demo: admin/admin123
      if (username === 'admin' && password === 'admin123') {
        toast.success('Admin login successful');
        onLogin();
      } else {
        toast.error('Invalid credentials');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Button
          variant="ghost"
          onClick={onBackToPOS}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to POS
        </Button>

        <Card>
          <CardHeader className="space-y-3">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-center">Admin Dashboard</CardTitle>
            <CardDescription className="text-center">
              Sign in with your administrator credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              {onNavigateToCashier && (
                <>
                  <div className="relative mt-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={onNavigateToCashier}
                    className="w-full mt-4"
                  >
                    Cashier Login
                  </Button>
                </>
              )}
            </form>
            
            <div className="mt-6 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
              <p className="font-medium mb-1">Demo Credentials:</p>
              <p>Username: admin</p>
              <p>Password: admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
