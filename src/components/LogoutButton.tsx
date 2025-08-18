
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { logout } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export function LogoutButton() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await logout();
      
      // Clear all auth/session artifacts
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear all React Query cache
      queryClient.clear();
      
      // Show success toast
      toast({
        title: 'Logged out successfully',
        description: 'You have been signed out of your account.',
      });
      
      // Navigate and replace history to prevent back navigation
      navigate('/login', { replace: true });
      
      // Additional cleanup - clear any remaining auth state
      window.history.replaceState(null, '', '/login');
      
    } catch (error) {
      toast({
        title: 'Logout error',
        description: 'There was an issue signing you out.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout} className="w-full justify-start">
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  );
}
