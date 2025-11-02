import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useServices } from '@/contexts/ServicesContext';
import { useLocation } from 'wouter';
import { Navigation } from '@/components/Navigation';
import { ServiceCard } from '@/components/ServiceCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Service } from '@/lib/mockData';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function ProviderServices() {
  const { user } = useAuth();
  const { services, addService, updateService, deleteService } = useServices();
  const [, navigate] = useLocation();
  const [showDialog, setShowDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Beauté',
    price: 0,
    duration: 30,
    description: '',
  });

  if (!user || user.userType !== 'provider') {
    navigate('/');
    return null;
  }

  const providerServices = services.filter(s => s.providerId === user.id);

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        category: service.category,
        price: service.price,
        duration: service.duration,
        description: service.description,
      });
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        category: 'Beauté',
        price: 0,
        duration: 30,
        description: '',
      });
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingService(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'duration' ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.description || formData.price <= 0 || formData.duration <= 0) {
      toast.error('Veuillez remplir tous les champs correctement');
      return;
    }

    if (editingService) {
      updateService(editingService.id, {
        ...formData,
        image: editingService.image,
      });
      toast.success('Service mis à jour!');
    } else {
      const newService: Service = {
        id: `s${Date.now()}`,
        ...formData,
        providerId: user.id,
        providerName: (user as any).businessName || user.name,
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
        rating: 0,
        reviews: 0,
      };
      addService(newService);
      toast.success('Service créé!');
    }

    handleCloseDialog();
  };

  const handleDeleteService = (serviceId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce service?')) {
      deleteService(serviceId);
      toast.success('Service supprimé');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Services</h1>
            <p className="text-gray-600">Gérez votre catalogue de services</p>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Ajouter un service
          </Button>
        </div>

        {/* Services Grid */}
        {providerServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providerServices.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={() => handleOpenDialog(service)}
                onDelete={handleDeleteService}
                isProvider={true}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 text-lg mb-4">Aucun service créé</p>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Créer votre premier service
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Service Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Modifier le service' : 'Créer un nouveau service'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du service</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Coupe et Coiffage"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Beauté</option>
                  <option>Santé</option>
                  <option>Soins</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durée (minutes)</label>
                <Input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="15"
                  step="15"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez votre service..."
                rows={4}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={handleCloseDialog}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {editingService ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
