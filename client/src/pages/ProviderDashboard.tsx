import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { useServices } from '@/contexts/ServicesContext';
import { useLocation } from 'wouter';
import { Navigation } from '@/components/Navigation';
import { BookingCard } from '@/components/BookingCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, TrendingUp, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const { bookings, updateBooking } = useBooking();
  const { services } = useServices();
  const [, navigate] = useLocation();

  if (!user || user.userType !== 'provider') {
    navigate('/');
    return null;
  }

  const providerBookings = bookings.filter(b => b.providerId === user.id);
  const providerServices = services.filter(s => s.providerId === user.id);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayBookings = providerBookings.filter(b => new Date(b.date) >= today);
    const confirmedBookings = providerBookings.filter(b => b.status === 'confirmed');
    const completedBookings = providerBookings.filter(b => b.status === 'completed');

    return {
      totalServices: providerServices.length,
      totalBookings: providerBookings.length,
      todayBookings: todayBookings.length,
      confirmedBookings: confirmedBookings.length,
      completedBookings: completedBookings.length,
      averageRating:
        completedBookings.length > 0
          ? (
              completedBookings.reduce((sum, b) => sum + (b.rating || 0), 0) /
              completedBookings.length
            ).toFixed(1)
          : 'N/A',
    };
  }, [providerBookings, providerServices]);

  const upcomingBookings = providerBookings
    .filter(b => new Date(b.date) >= new Date() && b.status === 'confirmed')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const handleConfirmBooking = (bookingId: string) => {
    updateBooking(bookingId, { status: 'confirmed' });
    toast.success('Réservation confirmée');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord</h1>
          <p className="text-gray-600">Gérez vos services et réservations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Services</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalServices}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Réservations</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aujourd'hui</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.todayBookings}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Confirmées</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.confirmedBookings}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Note moyenne</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.averageRating}</p>
                </div>
                <div className="text-2xl">⭐</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <Button
            onClick={() => navigate('/provider/services')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Gérer mes services
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/provider/profile')}
          >
            Mon profil
          </Button>
        </div>

        {/* Upcoming Bookings */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Prochains rendez-vous</h2>
          {upcomingBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} isProvider={true} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">Aucun rendez-vous prévu</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
