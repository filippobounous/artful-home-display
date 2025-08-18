
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { logout } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useSidebar } from '@/components/ui/sidebar';

export function LogoutButton() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const handleLogout = async () => {
    try {
      // Attempt server-side logout (best effort)
      await logout();
    } catch (error) {
      // Show non-blocking warning but continue with logout
      console.warn('Server logout failed:', error);
    } finally {
      // Always clear local state regardless of server response
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
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout} 
      className={`w-full justify-start ${isCollapsed ? 'px-2' : ''}`}
      aria-label={isCollapsed ? 'Logout' : undefined}
      title={isCollapsed ? 'Logout' : undefined}
    >
      <LogOut className="w-4 h-4" />
      {!isCollapsed && <span className="ml-2">Logout</span>}
    </Button>
  );
}
