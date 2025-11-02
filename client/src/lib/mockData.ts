// Mock data for the appointment booking app

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number; // in minutes
  description: string;
  providerId: string;
  providerName: string;
  image: string;
  rating: number;
  reviews: number;
}

export interface TimeSlot {
  id: string;
  providerId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  clientId: string;
  serviceId: string;
  providerId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending';
  notes?: string;
  rating?: number;
  review?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  userType: 'client' | 'provider';
  address?: string;
  bio?: string;
}

export interface Provider extends User {
  userType: 'provider';
  businessName: string;
  specialties: string[];
  bio: string;
}

// Mock Services
export const mockServices: Service[] = [
  {
    id: 's1',
    name: 'Coupe et Coiffage',
    category: 'Beauté',
    price: 45,
    duration: 60,
    description: 'Coupe professionnelle avec coiffage et finitions',
    providerId: 'p1',
    providerName: 'Salon Élégance',
    image: 'public/images/1.png',
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 's2',
    name: 'Manucure Gel',
    category: 'Beauté',
    price: 35,
    duration: 45,
    description: 'Manucure gel avec design personnalisé',
    providerId: 'p1',
    providerName: 'Salon Élégance',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop',
    rating: 4.9,
    reviews: 98,
  },
  {
    id: 's3',
    name: 'Relaxant',
    category: 'Santé',
    price: 60,
    duration: 60,
    description: 'Massage complet du corps pour la détente',
    providerId: 'p2',
    providerName: 'Wellness Center',
    image: 'public/images/2.png',
    rating: 4.7,
    reviews: 156,
  },
  {
    id: 's4',
    name: 'Soin du Visage',
    category: 'Soins',
    price: 55,
    duration: 50,
    description: 'Soin facial complet avec produits naturels',
    providerId: 'p2',
    providerName: 'Wellness Center',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop',
    rating: 4.6,
    reviews: 87,
  },
  {
    id: 's5',
    name: 'Épilation Laser',
    category: 'Beauté',
    price: 80,
    duration: 45,
    description: 'Épilation laser professionnelle et indolore',
    providerId: 'p3',
    providerName: 'Clinic Beauty',
    image: "https://i.pinimg.com/1200x/79/5b/39/795b395a85691faf61db06e2b8cc29c7.jpg",
    rating: 4.9,
    reviews: 203,
  },
  {
    id: 's6',
    name: 'Consultation Nutritionniste',
    category: 'Santé',
    price: 70,
    duration: 45,
    description: 'Consultation personnalisée avec plan nutritionnel',
    providerId: 'p4',
    providerName: 'Health Plus',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    rating: 4.8,
    reviews: 112,
  },
];

// Mock Time Slots
export const mockTimeSlots: TimeSlot[] = [
  // Provider 1 - Monday to Friday
  { id: 'ts1', providerId: 'p1', dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isAvailable: true },
  { id: 'ts2', providerId: 'p1', dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isAvailable: true },
  { id: 'ts3', providerId: 'p1', dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isAvailable: true },
  { id: 'ts4', providerId: 'p1', dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isAvailable: true },
  { id: 'ts5', providerId: 'p1', dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isAvailable: true },
  // Provider 2 - Tuesday to Saturday
  { id: 'ts6', providerId: 'p2', dayOfWeek: 2, startTime: '10:00', endTime: '18:00', isAvailable: true },
  { id: 'ts7', providerId: 'p2', dayOfWeek: 3, startTime: '10:00', endTime: '18:00', isAvailable: true },
  { id: 'ts8', providerId: 'p2', dayOfWeek: 4, startTime: '10:00', endTime: '18:00', isAvailable: true },
  { id: 'ts9', providerId: 'p2', dayOfWeek: 5, startTime: '10:00', endTime: '18:00', isAvailable: true },
  { id: 'ts10', providerId: 'p2', dayOfWeek: 6, startTime: '10:00', endTime: '18:00', isAvailable: true },
  // Provider 3 - Monday, Wednesday, Friday
  { id: 'ts11', providerId: 'p3', dayOfWeek: 1, startTime: '08:00', endTime: '16:00', isAvailable: true },
  { id: 'ts12', providerId: 'p3', dayOfWeek: 3, startTime: '08:00', endTime: '16:00', isAvailable: true },
  { id: 'ts13', providerId: 'p3', dayOfWeek: 5, startTime: '08:00', endTime: '16:00', isAvailable: true },
  // Provider 4 - Monday to Friday
  { id: 'ts14', providerId: 'p4', dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isAvailable: true },
  { id: 'ts15', providerId: 'p4', dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isAvailable: true },
  { id: 'ts16', providerId: 'p4', dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isAvailable: true },
  { id: 'ts17', providerId: 'p4', dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isAvailable: true },
  { id: 'ts18', providerId: 'p4', dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isAvailable: true },
];

// Mock Users (Clients)
export const mockClients: User[] = [
  {
    id: 'c1',
    name: 'Marie Dupont',
    email: 'marie@example.com',
    phone: '06 12 34 56 78',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    userType: 'client',
    address: '123 Rue de Paris, 75001 Paris',
  },
  {
    id: 'c2',
    name: 'Jean Martin',
    email: 'jean@example.com',
    phone: '06 98 76 54 32',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    userType: 'client',
    address: '456 Avenue de Lyon, 75012 Paris',
  },
];

// Mock Providers
export const mockProviders: Provider[] = [
  {
    id: 'p1',
    name: 'Sophie Bernard',
    email: 'sophie@salonelegance.com',
    phone: '06 11 22 33 44',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    userType: 'provider',
    businessName: 'Salon Élégance',
    specialties: ['Coiffure', 'Manucure', 'Beauté'],
    bio: 'Salon de beauté haut de gamme avec 10 ans d\'expérience',
    address: '789 Boulevard Saint-Germain, 75006 Paris',
  },
  {
    id: 'p2',
    name: 'Luc Moreau',
    email: 'luc@wellnesscenter.com',
    phone: '06 44 55 66 77',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    userType: 'provider',
    businessName: 'Wellness Center',
    specialties: ['Massage', 'Soins du visage', 'Bien-être'],
    bio: 'Centre de bien-être spécialisé dans les soins naturels',
    address: '321 Rue de Rivoli, 75004 Paris',
  },
  {
    id: 'p3',
    name: 'Isabelle Leclerc',
    email: 'isabelle@clinicbeauty.com',
    phone: '06 77 88 99 00',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    userType: 'provider',
    businessName: 'Clinic Beauty',
    specialties: ['Épilation laser', 'Dermatologie', 'Beauté'],
    bio: 'Clinique esthétique avec équipements dernière génération',
    address: '654 Avenue Montaigne, 75008 Paris',
  },
  {
    id: 'p4',
    name: 'Dr. Pierre Rousseau',
    email: 'pierre@healthplus.com',
    phone: '06 33 44 55 66',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    userType: 'provider',
    businessName: 'Health Plus',
    specialties: ['Nutrition', 'Santé', 'Bien-être'],
    bio: 'Nutritionniste diplômé avec 15 ans d\'expérience',
    address: '987 Rue Saint-Antoine, 75011 Paris',
  },
];

// Mock Bookings
export const mockBookings: Booking[] = [
  {
    id: 'b1',
    clientId: 'c1',
    serviceId: 's1',
    providerId: 'p1',
    date: '2025-11-15',
    time: '10:00',
    status: 'confirmed',
    notes: 'Coupe courte avec dégradé',
  },
  {
    id: 'b2',
    clientId: 'c1',
    serviceId: 's2',
    providerId: 'p1',
    date: '2025-11-20',
    time: '14:00',
    status: 'confirmed',
    notes: 'Manucure rouge classique',
  },
  {
    id: 'b3',
    clientId: 'c1',
    serviceId: 's3',
    providerId: 'p2',
    date: '2025-10-25',
    time: '15:00',
    status: 'completed',
    rating: 5,
    review: 'Excellent massage, très relaxant!',
  },
  {
    id: 'b4',
    clientId: 'c2',
    serviceId: 's4',
    providerId: 'p2',
    date: '2025-11-18',
    time: '11:00',
    status: 'confirmed',
  },
];

// Helper functions
export const getServicesByCategory = (category: string): Service[] => {
  return mockServices.filter(s => s.category === category);
};

export const getServicesByProvider = (providerId: string): Service[] => {
  return mockServices.filter(s => s.providerId === providerId);
};

export const getProviderById = (providerId: string): Provider | undefined => {
  return mockProviders.find(p => p.id === providerId);
};

export const getServiceById = (serviceId: string): Service | undefined => {
  return mockServices.find(s => s.id === serviceId);
};

export const getClientById = (clientId: string): User | undefined => {
  return mockClients.find(c => c.id === clientId);
};

export const getBookingsByClient = (clientId: string): Booking[] => {
  return mockBookings.filter(b => b.clientId === clientId);
};

export const getBookingsByProvider = (providerId: string): Booking[] => {
  return mockBookings.filter(b => b.providerId === providerId);
};

export const getAvailableSlots = (providerId: string, date: Date): string[] => {
  const dayOfWeek = date.getDay();
  const slots = mockTimeSlots.filter(
    ts => ts.providerId === providerId && ts.dayOfWeek === dayOfWeek && ts.isAvailable
  );
  
  if (slots.length === 0) return [];
  
  const slot = slots[0];
  const times: string[] = [];
  const [startHour, startMin] = slot.startTime.split(':').map(Number);
  const [endHour, endMin] = slot.endTime.split(':').map(Number);
  
  let current = new Date();
  current.setHours(startHour, startMin, 0);
  const end = new Date();
  end.setHours(endHour, endMin, 0);
  
  while (current < end) {
    times.push(current.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    current.setMinutes(current.getMinutes() + 30);
  }
  
  return times;
};
