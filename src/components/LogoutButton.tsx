import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { logout } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface LogoutButtonProps {
  collapsed?: boolean;
  className?: string;
}

export function LogoutButton({
  collapsed = false,
  className,
}: LogoutButtonProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
    <button
      onClick={handleLogout}
      aria-label="Logout"
      className={cn(
        'w-full flex items-center text-sm',
        collapsed ? 'justify-center gap-0' : 'justify-start gap-2',
        className,
      )}
    >
      <LogOut className="w-4 h-4" />
      {!collapsed && <span>Logout</span>}
    </button>
  );
}
