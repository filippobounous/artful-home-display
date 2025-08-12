
import { useState, useEffect } from 'react';

export function useDashboardApiHealth() {
  const [showApiHealth, setShowApiHealth] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('showDashboardApiHealth') === 'true';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('showDashboardApiHealth', showApiHealth.toString());
    }
  }, [showApiHealth]);

  return { showApiHealth, setShowApiHealth };
}
