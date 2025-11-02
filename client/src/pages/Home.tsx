import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';

export default function Home() {
  const { isLoggedIn, userType } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(userType === 'client' ? '/client/services' : '/provider/dashboard');
    } else {
      navigate('/auth');
    }
  }, [isLoggedIn, userType, navigate]);

  return null;
}
