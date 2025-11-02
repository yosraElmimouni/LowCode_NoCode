import { Booking, Service, getServiceById, getProviderById } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User, Star, Trash2, Edit2 } from 'lucide-react';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
  onEdit?: (booking: Booking) => void;
  onReview?: (booking: Booking) => void;
  isProvider?: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onCancel,
  onEdit,
  onReview,
  isProvider = false,
}) => {
  const service = getServiceById(booking.serviceId);
  const provider = getProviderById(booking.providerId);

  if (!service) return null;

  const bookingDate = new Date(booking.date);
  const formattedDate = bookingDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const statusColors = {
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  const statusLabels = {
    confirmed: 'Confirmé',
    completed: 'Terminé',
    cancelled: 'Annulé',
    pending: 'En attente',
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{service.name}</CardTitle>
            {!isProvider && <p className="text-sm text-gray-600 mt-1">{provider?.businessName}</p>}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[booking.status]}`}>
            {statusLabels[booking.status]}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-4 h-4" />
            <span>{booking.time}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <User className="w-4 h-4" />
            <span>{service.duration} minutes</span>
          </div>
          <div className="text-gray-700 font-semibold">{service.price}€</div>
        </div>

        {booking.notes && (
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-600">
              <span className="font-semibold">Notes:</span> {booking.notes}
            </p>
          </div>
        )}

        {booking.review && (
          <div className="bg-blue-50 rounded-lg p-2">
            <div className="flex items-center gap-1 mb-1">
              {[...Array(booking.rating || 0)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-xs text-gray-700">{booking.review}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {booking.status === 'confirmed' && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit?.(booking)}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Edit2 className="w-3 h-3" />
                Modifier
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onCancel?.(booking.id)}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-3 h-3" />
                Annuler
              </Button>
            </>
          )}
          {booking.status === 'completed' && !booking.review && (
            <Button
              size="sm"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={() => onReview?.(booking)}
            >
              <Star className="w-4 h-4" />
              Laisser un avis
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
