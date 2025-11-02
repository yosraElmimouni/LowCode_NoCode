import { Service } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Clock, DollarSign, User } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onSelect?: (service: Service) => void;
  onEdit?: (service: Service) => void;
  onDelete?: (serviceId: string) => void;
  isProvider?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onSelect,
  onEdit,
  onDelete,
  isProvider = false,
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="relative h-48 bg-gray-200 overflow-hidden rounded-t-lg">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
        <div className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold">{service.rating}</span>
        </div>
      </div>

      <CardHeader className="flex-1">
        <CardTitle className="text-lg">{service.name}</CardTitle>
        <CardDescription className="text-sm text-gray-600">{service.category}</CardDescription>
        <p className="text-xs text-gray-500 mt-2">{service.providerName}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <DollarSign className="w-4 h-4" />
            <span>{service.price}€</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-4 h-4" />
            <span>{service.duration}min</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <User className="w-3 h-3" />
          <span>{service.reviews} avis</span>
        </div>

        <div className="flex gap-2 pt-2">
          {isProvider ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit?.(service)}
                className="flex-1"
              >
                Modifier
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete?.(service.id)}
                className="flex-1"
              >
                Supprimer
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => onSelect?.(service)}
            >
              Réserver
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
