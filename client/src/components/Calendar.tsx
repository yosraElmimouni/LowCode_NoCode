import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
  minDate?: Date;
}

export const Calendar: React.FC<CalendarProps> = ({
  onDateSelect,
  selectedDate,
  minDate = new Date(),
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date < minDate;
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleDateClick = (day: number) => {
    if (!isDateDisabled(day)) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      onDateSelect(date);
    }
  };

  const monthName = currentMonth.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{monthName}</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={previousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map(i => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {days.map(day => (
          <button
            key={day}
            onClick={() => handleDateClick(day)}
            disabled={isDateDisabled(day)}
            className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
              isDateSelected(day)
                ? 'bg-blue-600 text-white'
                : isDateDisabled(day)
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'hover:bg-gray-100 text-gray-900'
            }`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};
