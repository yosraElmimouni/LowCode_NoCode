import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useServices } from '@/contexts/ServicesContext';
import { useLocation } from 'wouter';
import { Navigation } from '@/components/Navigation';
import { ServiceCard } from '@/components/ServiceCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function ClientServices() {
  const { user } = useAuth();
  const { services } = useServices();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!user || user.userType !== 'client') {
    navigate('/');
    return null;
  }

  const categories = Array.from(new Set(services.map(s => s.category)));

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [services, searchQuery, selectedCategory]);

  const handleServiceSelect = (serviceId: string) => {
    navigate(`/client/booking/${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nos Services</h1>
          <p className="text-gray-600">Découvrez tous nos services de beauté, santé et soins</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher un service..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-gray-600" />
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? 'bg-blue-600' : ''}
            >
              Tous les services
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-blue-600' : ''}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={() => handleServiceSelect(service.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun service trouvé</p>
            <p className="text-gray-400 text-sm mt-2">Essayez une autre recherche ou catégorie</p>
          </div>
        )}
      </main>
    </div>
  );
}
