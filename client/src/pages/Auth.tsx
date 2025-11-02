import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function Auth() {
  const { login, signup } = useAuth();
  const [, navigate] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'client' | 'provider'>('client');
  const [formData, setFormData] = useState({
    email: userType === 'client' ? 'marie@example.com' : 'sophie@salonelegance.com',
    password: 'password123',
    name: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      const success = login(formData.email, formData.password, userType);
      if (success) {
        toast.success('Connexion réussie!');
        navigate(userType === 'client' ? '/client/services' : '/provider/dashboard');
      } else {
        toast.error('Email ou mot de passe incorrect');
      }
    } else {
      if (!formData.name) {
        toast.error('Veuillez entrer votre nom');
        return;
      }
      const success = signup(formData.name, formData.email, formData.password, userType);
      if (success) {
        toast.success('Inscription réussie!');
        navigate(userType === 'client' ? '/client/services' : '/provider/dashboard');
      } else {
        toast.error('Erreur lors de l\'inscription');
      }
    }
  };

  const handleQuickLogin = (email: string, type: 'client' | 'provider') => {
    const success = login(email, 'password123', type);
    if (success) {
      toast.success('Connexion réussie!');
      navigate(type === 'client' ? '/client/services' : '/provider/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">BookingApp</h1>
          </div>
          <p className="text-gray-600">Gestion de rendez-vous pour services</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {isLogin ? 'Connexion' : 'Inscription'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* User Type Selection */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={userType === 'client' ? 'default' : 'outline'}
                onClick={() => setUserType('client')}
                className={userType === 'client' ? 'bg-blue-600' : ''}
              >
                Client
              </Button>
              <Button
                type="button"
                variant={userType === 'provider' ? 'default' : 'outline'}
                onClick={() => setUserType('provider')}
                className={userType === 'provider' ? 'bg-blue-600' : ''}
              >
                Prestataire
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                {isLogin ? 'Se connecter' : 'S\'inscrire'}
              </Button>
            </form>

            {isLogin && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">ou essayer rapidement</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full text-sm"
                    onClick={() => handleQuickLogin('marie@example.com', 'client')}
                  >
                    Client: Marie Dupont
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full text-sm"
                    onClick={() => handleQuickLogin('sophie@salonelegance.com', 'provider')}
                  >
                    Prestataire: Sophie Bernard
                  </Button>
                </div>
              </>
            )}

            <div className="text-center text-sm text-gray-600">
              {isLogin ? "Pas de compte? " : "Déjà inscrit? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:underline font-medium"
              >
                {isLogin ? 'S\'inscrire' : 'Se connecter'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
