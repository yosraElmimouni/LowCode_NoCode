import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Navigation } from '@/components/Navigation';
import { ProfileForm } from '@/components/ProfileForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from '@/lib/mockData';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function ProviderProfile() {
  const { user, updateProfile, logout } = useAuth();
  const [, navigate] = useLocation();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  if (!user || user.userType !== 'provider') {
    navigate('/');
    return null;
  }

  const handleProfileUpdate = (updates: Partial<User>) => {
    updateProfile(updates);
    toast.success('Profil mis à jour!');
  };

  const handlePasswordChange = () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.new.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    toast.success('Mot de passe changé avec succès!');
    setShowPasswordDialog(false);
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Profil</h1>
          <p className="text-gray-600">Gérez vos informations professionnelles</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-blue-200"
                  />
                  <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-600 text-sm mt-1">{(user as any).businessName}</p>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                  <p className="text-gray-600 text-sm">{user.phone}</p>
                  {user.address && <p className="text-gray-600 text-sm mt-2">{user.address}</p>}
                </div>

                {(user as any).specialties && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Spécialités</p>
                    <div className="flex flex-wrap gap-2">
                      {(user as any).specialties.map((specialty: string) => (
                        <span
                          key={specialty}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => setShowPasswordDialog(true)}
                  >
                    <Lock className="w-4 h-4" />
                    Changer le mot de passe
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Se déconnecter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <ProfileForm user={user} onSave={handleProfileUpdate} isProvider={true} />
          </div>
        </div>
      </main>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Changer le mot de passe</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe actuel
              </label>
              <Input
                type="password"
                value={passwordData.current}
                onChange={e => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nouveau mot de passe
              </label>
              <Input
                type="password"
                value={passwordData.new}
                onChange={e => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <Input
                type="password"
                value={passwordData.confirm}
                onChange={e => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                placeholder="••••••••"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowPasswordDialog(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handlePasswordChange}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Changer le mot de passe
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
