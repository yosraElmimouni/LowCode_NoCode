import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { useLocation } from 'wouter';
import { Navigation } from '@/components/Navigation';
import { BookingCard } from '@/components/BookingCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Booking } from '@/lib/mockData';

export default function ClientBookings() {
  const { user } = useAuth();
  const { bookings, updateBooking, cancelBooking } = useBooking();
  const [, navigate] = useLocation();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);
  const [reviewData, setReviewData] = useState({ rating: 5, review: '' });

  if (!user || user.userType !== 'client') {
    navigate('/');
    return null;
  }

  const userBookings = bookings.filter(b => b.clientId === user.id);

  const filteredBookings = userBookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    const isUpcoming = bookingDate > new Date();

    switch (filter) {
      case 'upcoming':
        return isUpcoming && booking.status === 'confirmed';
      case 'completed':
        return booking.status === 'completed';
      default:
        return true;
    }
  });

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation?')) {
      cancelBooking(bookingId);
      toast.success('Réservation annulée');
    }
  };

  const handleReviewSubmit = () => {
    if (!reviewingBooking) return;

    updateBooking(reviewingBooking.id, {
      rating: reviewData.rating,
      review: reviewData.review,
      status: 'completed',
    });

    toast.success('Avis publié!');
    setReviewingBooking(null);
    setReviewData({ rating: 5, review: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Rendez-vous</h1>
          <p className="text-gray-600">Gérez vos réservations et consultations</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-blue-600' : ''}
          >
            Tous ({userBookings.length})
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'default' : 'outline'}
            onClick={() => setFilter('upcoming')}
            className={filter === 'upcoming' ? 'bg-blue-600' : ''}
          >
            À venir ({userBookings.filter(b => new Date(b.date) > new Date() && b.status === 'confirmed').length})
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
            className={filter === 'completed' ? 'bg-blue-600' : ''}
          >
            Terminés ({userBookings.filter(b => b.status === 'completed').length})
          </Button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBookings.map(booking => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancelBooking}
                onReview={setReviewingBooking}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Aucun rendez-vous trouvé</p>
              <p className="text-gray-400 text-sm mt-2">Commencez par réserver un service</p>
              <Button
                onClick={() => navigate('/client/services')}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                Voir les services
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Review Dialog */}
      <Dialog open={!!reviewingBooking} onOpenChange={() => setReviewingBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Laisser un avis</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setReviewData(prev => ({ ...prev, rating }))}
                    className="text-2xl transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        rating <= reviewData.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
              <Textarea
                placeholder="Partagez votre expérience..."
                value={reviewData.review}
                onChange={e => setReviewData(prev => ({ ...prev, review: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setReviewingBooking(null)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleReviewSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Publier l'avis
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
