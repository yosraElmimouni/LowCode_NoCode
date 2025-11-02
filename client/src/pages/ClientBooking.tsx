import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useServices } from '@/contexts/ServicesContext';
import { useBooking } from '@/contexts/BookingContext';
import { useLocation } from 'wouter';
import { Navigation } from '@/components/Navigation';
import { Calendar } from '@/components/Calendar';
import { TimeSlots } from '@/components/TimeSlots';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export default function ClientBooking({ params }: { params: { serviceId: string } }) {
  const { user } = useAuth();
  const { getServiceById } = useServices();
  const { addBooking } = useBooking();
  const [, navigate] = useLocation();

  const serviceId = window.location.pathname.split('/').pop();
  const service = serviceId ? getServiceById(serviceId) : null;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user || user.userType !== 'client' || !service) {
    return null;
  }

  const availableSlots = selectedDate
    ? [
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
      ]
    : [];

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Veuillez sélectionner une date et un créneau');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newBooking = {
      id: `b${Date.now()}`,
      clientId: user.id,
      serviceId: service.id,
      providerId: service.providerId,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      status: 'confirmed' as const,
      notes: notes || undefined,
    };

    addBooking(newBooking);
    toast.success('Réservation confirmée!');
    navigate('/client/bookings');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/client/services')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux services
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Service Details */}
          <div className="lg:col-span-1">
            <Card>
              <div className="h-48 bg-gray-200 overflow-hidden rounded-t-lg">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
                <p className="text-sm text-gray-600">{service.providerName}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{service.description}</p>

                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Durée:</span>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-semibold">{service.duration} min</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Prix:</span>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold text-lg text-blue-600">{service.price}€</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sélectionner une date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar onDateSelect={setSelectedDate} selectedDate={selectedDate} />
              </CardContent>
            </Card>

            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle>Sélectionner un créneau</CardTitle>
                </CardHeader>
                <CardContent>
                  <TimeSlots
                    slots={availableSlots}
                    selectedSlot={selectedTime}
                    onSlotSelect={setSelectedTime}
                  />
                </CardContent>
              </Card>
            )}

            {selectedDate && selectedTime && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes supplémentaires (optionnel)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Ajoutez des notes pour le prestataire..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={4}
                  />
                </CardContent>
              </Card>
            )}

            {selectedDate && selectedTime && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">Résumé de votre réservation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-semibold">{service.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">
                      {selectedDate.toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Heure:</span>
                    <span className="font-semibold">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-200">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-lg text-blue-600">{service.price}€</span>
                  </div>

                  <Button
                    onClick={handleConfirmBooking}
                    disabled={isSubmitting}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSubmitting ? 'Confirmation en cours...' : 'Confirmer la réservation'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
