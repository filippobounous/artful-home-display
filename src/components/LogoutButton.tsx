
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { logout } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function LogoutButton() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      
      // Clear all auth/session artifacts
      localStorage.removeItem('useTestData');
      localStorage.removeItem('isDemoUser');
      localStorage.removeItem('showDashboardApiHealth');
      sessionStorage.clear();
      
      // Show success toast
      toast({
        title: 'Logged out successfully',
        description: 'You have been signed out of your account.',
      });
      
      navigate('/login', { replace: true });
    } catch (error) {
      toast({
        title: 'Logout error',
        description: 'There was an issue signing you out.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  );
}
