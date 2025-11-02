import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking, mockBookings } from '@/lib/mockData';

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  cancelBooking: (id: string) => void;
  getBookingById: (id: string) => Booking | undefined;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Load bookings from localStorage on mount
  useEffect(() => {
    const savedBookings = localStorage.getItem('bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    } else {
      setBookings(mockBookings);
      localStorage.setItem('bookings', JSON.stringify(mockBookings));
    }
  }, []);

  const addBooking = (booking: Booking) => {
    const newBookings = [...bookings, booking];
    setBookings(newBookings);
    localStorage.setItem('bookings', JSON.stringify(newBookings));
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    const newBookings = bookings.map(b => (b.id === id ? { ...b, ...updates } : b));
    setBookings(newBookings);
    localStorage.setItem('bookings', JSON.stringify(newBookings));
  };

  const cancelBooking = (id: string) => {
    const newBookings = bookings.map(b =>
      b.id === id ? { ...b, status: 'cancelled' as const } : b
    );
    setBookings(newBookings);
    localStorage.setItem('bookings', JSON.stringify(newBookings));
  };

  const getBookingById = (id: string): Booking | undefined => {
    return bookings.find(b => b.id === id);
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, updateBooking, cancelBooking, getBookingById }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};
