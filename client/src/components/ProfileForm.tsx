import { useState } from 'react';
import { User } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileFormProps {
  user: User;
  onSave: (updates: Partial<User>) => void;
  isProvider?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ user, onSave, isProvider = false }) => {
  const [formData, setFormData] = useState(user);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave(formData);
    setIsSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modifier le Profil</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="06 12 34 56 78"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <Input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              placeholder="Votre adresse"
            />
          </div>

          {isProvider && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Business</label>
                <Input
                  type="text"
                  name="businessName"
                  value={(formData as any).businessName || ''}
                  onChange={handleChange}
                  placeholder="Nom de votre entreprise"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <Textarea
                  name="bio"
                  value={(formData as any).bio || ''}
                  onChange={handleChange}
                  placeholder="Décrivez votre expérience et vos services"
                  rows={4}
                />
              </div>
            </>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
