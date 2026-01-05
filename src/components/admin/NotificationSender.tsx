// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Bell, 
  Send,
  Loader2,
  Users,
  User
} from 'lucide-react';

export function NotificationSender() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    target: 'all' // 'all' or specific user_id
  });

  const handleSend = async () => {
    if (!formData.title || !formData.message) {
      toast({
        title: 'Erreur',
        description: 'Titre et message requis',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      if (formData.target === 'all') {
        // Get all user IDs
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id');

        if (profilesError) throw profilesError;

        if (profiles && profiles.length > 0) {
          const notifications = profiles.map(p => ({
            user_id: p.user_id,
            title: formData.title,
            message: formData.message,
            type: formData.type,
            read: false
          }));

          const { error } = await supabase
            .from('notifications')
            .insert(notifications);

          if (error) throw error;

          toast({
            title: 'Notifications envoyées!',
            description: `${profiles.length} utilisateurs notifiés.`
          });
        }
      } else {
        // Single user notification
        const { error } = await supabase
          .from('notifications')
          .insert([{
            user_id: formData.target,
            title: formData.title,
            message: formData.message,
            type: formData.type,
            read: false
          }]);

        if (error) throw error;

        toast({
          title: 'Notification envoyée!',
          description: 'L\'utilisateur a été notifié.'
        });
      }

      setFormData({
        title: '',
        message: '',
        type: 'info',
        target: 'all'
      });
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Envoyer des Notifications</h2>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Nouvelle Notification
          </CardTitle>
          <CardDescription>
            Envoyez une notification in-app à tous les utilisateurs ou un utilisateur spécifique
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nouvelle fonctionnalité!"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Succès</SelectItem>
                  <SelectItem value="warning">Attention</SelectItem>
                  <SelectItem value="alert">Alerte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Contenu de la notification..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Destinataires</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.target === 'all' ? 'default' : 'outline'}
                onClick={() => setFormData({ ...formData, target: 'all' })}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Tous les utilisateurs
              </Button>
            </div>
          </div>

          <Button onClick={handleSend} disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Envoyer la Notification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
