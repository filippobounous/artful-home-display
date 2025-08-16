
import { useState, useEffect, useId } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface DemoCredentialsToggleProps {
  isVisible: boolean;
  onToggle: (visible: boolean) => void;
}

const DemoCredentialsToggle = ({ isVisible, onToggle }: DemoCredentialsToggleProps) => {
  const toggleId = useId();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="fixed bottom-4 right-4 z-40 bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-accent"
      onClick={() => onToggle(!isVisible)}
      aria-expanded={isVisible}
      aria-controls={`${toggleId}-panel`}
      aria-label={isVisible ? 'Hide demo credentials' : 'Show demo credentials'}
      id={toggleId}
    >
      {isVisible ? (
        <EyeOff className="w-4 h-4 mr-2" />
      ) : (
        <Eye className="w-4 h-4 mr-2" />
      )}
      <span className="text-xs">
        {isVisible ? 'Hide' : 'Show'} demo credentials
      </span>
    </Button>
  );
};

export default DemoCredentialsToggle;
