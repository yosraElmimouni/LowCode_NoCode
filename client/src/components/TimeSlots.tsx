import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface TimeSlotsProps {
  slots: string[];
  selectedSlot?: string;
  onSlotSelect: (slot: string) => void;
  isLoading?: boolean;
}

export const TimeSlots: React.FC<TimeSlotsProps> = ({
  slots,
  selectedSlot,
  onSlotSelect,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Créneaux disponibles</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Créneaux disponibles</h3>
        </div>
        <p className="text-center text-gray-500 py-4">Aucun créneau disponible pour cette date</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Créneaux disponibles</h3>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {slots.map(slot => (
          <Button
            key={slot}
            variant={selectedSlot === slot ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSlotSelect(slot)}
            className={selectedSlot === slot ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            {slot}
          </Button>
        ))}
      </div>
    </div>
  );
};
