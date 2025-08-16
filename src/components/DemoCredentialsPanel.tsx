
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Eye, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DemoCredentialsPanelProps {
  onAutoFill: (username: string, password: string) => void;
  isVisible: boolean;
  toggleId: string;
}

const DemoCredentialsPanel = ({ onAutoFill, isVisible, toggleId }: DemoCredentialsPanelProps) => {
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const demoUsername = import.meta.env.VITE_DEMO_EMAIL || import.meta.env.VITE_DEMO_USERNAME || 'demo';
  const demoPassword = import.meta.env.VITE_DEMO_PASSWORD || 'password123';

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleAutoFillAndSignIn = () => {
    onAutoFill(demoUsername, demoPassword);
  };

  const handleViewTestData = () => {
    // Try to navigate to demo data or open modal
    navigate('/');
  };

  if (!isVisible) return null;

  return (
    <Card 
      className="absolute bottom-16 right-4 w-80 max-w-[calc(100vw-2rem)] bg-card border shadow-lg z-50"
      role="region"
      aria-labelledby={toggleId}
      aria-live="polite"
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Eye className="w-4 h-4" />
          Demo Credentials
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <label className="text-xs text-muted-foreground">Username/Email</label>
              <div className="font-mono text-sm bg-muted px-2 py-1 rounded truncate">
                {demoUsername}
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => copyToClipboard(demoUsername, 'username')}
              aria-label="Copy username"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <label className="text-xs text-muted-foreground">Password</label>
              <div className="font-mono text-sm bg-muted px-2 py-1 rounded truncate">
                {demoPassword}
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => copyToClipboard(demoPassword, 'password')}
              aria-label="Copy password"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {copiedField && (
          <div className="text-xs text-green-600 text-center" role="status">
            {copiedField === 'username' ? 'Username' : 'Password'} copied!
          </div>
        )}

        <div className="flex flex-col gap-2 pt-2 border-t border-border">
          <Button 
            type="button"
            onClick={handleAutoFillAndSignIn}
            className="w-full"
            size="sm"
          >
            Auto-fill & Sign in
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            onClick={handleViewTestData}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            View test data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoCredentialsPanel;
