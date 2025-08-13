import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { logout } from '@/lib/api';

export function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  );
}
