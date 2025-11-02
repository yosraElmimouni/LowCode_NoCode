import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { LogOut, Home, Calendar, User, Settings } from 'lucide-react';

export const Navigation = () => {
  const { user, logout, userType } = useAuth();
  const [, navigate] = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900">BookingApp</span>
        </div>

        <div className="flex items-center gap-4">
          {userType === 'client' ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/client/services')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Services
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/client/bookings')}
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Mes Rendez-vous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/client/profile')}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Profil
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/provider/dashboard')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Tableau de Bord
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/provider/services')}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Mes Services
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/provider/profile')}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Profil
              </Button>
            </>
          )}

          <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
            <div className="text-sm">
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{userType === 'client' ? 'Client' : 'Prestataire'}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
