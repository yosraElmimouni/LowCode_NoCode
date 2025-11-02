import React, { createContext, useContext, useState, useEffect } from 'react';
import { Service, mockServices } from '@/lib/mockData';

interface ServicesContextType {
  services: Service[];
  addService: (service: Service) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;
  getServiceById: (id: string) => Service | undefined;
  getServicesByProvider: (providerId: string) => Service[];
  getServicesByCategory: (category: string) => Service[];
  searchServices: (query: string) => Service[];
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export const ServicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);

  // Load services from localStorage on mount
  useEffect(() => {
    const savedServices = localStorage.getItem('services');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    } else {
      setServices(mockServices);
      localStorage.setItem('services', JSON.stringify(mockServices));
    }
  }, []);

  const addService = (service: Service) => {
    const newServices = [...services, service];
    setServices(newServices);
    localStorage.setItem('services', JSON.stringify(newServices));
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    const newServices = services.map(s => (s.id === id ? { ...s, ...updates } : s));
    setServices(newServices);
    localStorage.setItem('services', JSON.stringify(newServices));
  };

  const deleteService = (id: string) => {
    const newServices = services.filter(s => s.id !== id);
    setServices(newServices);
    localStorage.setItem('services', JSON.stringify(newServices));
  };

  const getServiceById = (id: string): Service | undefined => {
    return services.find(s => s.id === id);
  };

  const getServicesByProvider = (providerId: string): Service[] => {
    return services.filter(s => s.providerId === providerId);
  };

  const getServicesByCategory = (category: string): Service[] => {
    return services.filter(s => s.category === category);
  };

  const searchServices = (query: string): Service[] => {
    const lowerQuery = query.toLowerCase();
    return services.filter(
      s =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery) ||
        s.category.toLowerCase().includes(lowerQuery)
    );
  };

  return (
    <ServicesContext.Provider
      value={{
        services,
        addService,
        updateService,
        deleteService,
        getServiceById,
        getServicesByProvider,
        getServicesByCategory,
        searchServices,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices must be used within ServicesProvider');
  }
  return context;
};
