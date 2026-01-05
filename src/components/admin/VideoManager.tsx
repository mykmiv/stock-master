// @ts-nocheck
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Video, 
  Trash2, 
  Edit, 
  Eye, 
  Plus,
  X,
  Loader2,
  ExternalLink
} from 'lucide-react';

interface VideoData {
  id?: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url?: string | null;
  duration_minutes: number | null;
  level: string;
  category: string | null;
  tags: string[] | null;
  order_index: number | null;
  is_premium: boolean | null;
  published: boolean | null;
  view_count?: number | null;
}

const emptyFormData: VideoData = {
  title: '',
  description: '',
  video_url: '',
  thumbnail_url: '',
  duration_minutes: 5,
  level: 'beginner',
  category: '',
  tags: [],
  order_index: 0,
  is_premium: false,
  published: false
};

type Level = 'beginner' | 'intermediate' | 'advanced';

export function VideoManager() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [formData, setFormData] = useState<VideoData>(emptyFormData);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoadingVideos(true);
    const { data, error } = await supabase
      .from('educational_videos')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les vidéos',
        variant: 'destructive'
      });
    } else {
      setVideos(data || []);
    }
    setLoadingVideos(false);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.video_url) {
      toast({
        title: 'Erreur',
        description: 'Titre et URL vidéo requis',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        title: formData.title,
        description: formData.description,
        video_url: formData.video_url,
        thumbnail_url: formData.thumbnail_url || null,
        duration_minutes: formData.duration_minutes,
        level: formData.level,
        category: formData.category,
        tags: formData.tags,
        order_index: formData.order_index,
        is_premium: formData.is_premium,
        published: formData.published
      };

      if (editingVideo?.id) {
        const { error } = await supabase
          .from('educational_videos')
          .update(dataToSend)
          .eq('id', editingVideo.id);

        if (error) throw error;

        toast({
          title: 'Vidéo mise à jour!',
          description: 'Les changements ont été sauvegardés.'
        });
      } else {
        const { error } = await supabase
          .from('educational_videos')
          .insert([dataToSend]);

        if (error) throw error;

        toast({
          title: 'Vidéo ajoutée!',
          description: 'La nouvelle vidéo a été publiée.'
        });
      }

      setFormData(emptyFormData);
      setIsAddingVideo(false);
      setEditingVideo(null);
      loadVideos();
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

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette vidéo?')) return;

    const { error } = await supabase
      .from('educational_videos')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Vidéo supprimée',
        description: 'La vidéo a été retirée.'
      });
      loadVideos();
    }
  };

  const handleEdit = (video: VideoData) => {
    setFormData(video);
    setEditingVideo(video);
    setIsAddingVideo(true);
  };

  const addTag = () => {
    if (newTag && !formData.tags?.includes(newTag)) {
      setFormData({ ...formData, tags: [...(formData.tags || []), newTag] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: (formData.tags || []).filter(t => t !== tag) });
  };

  const togglePublished = async (video: VideoData) => {
    const { error } = await supabase
      .from('educational_videos')
      .update({ published: !video.published })
      .eq('id', video.id);

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      loadVideos();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gérer les Vidéos Éducatives</h2>
        <Button onClick={() => { setIsAddingVideo(true); setEditingVideo(null); setFormData(emptyFormData); }}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Vidéo
        </Button>
      </div>

      {/* Add/Edit Form */}
      {isAddingVideo && (
        <Card>
          <CardHeader>
            <CardTitle>{editingVideo ? 'Modifier la Vidéo' : 'Ajouter une Vidéo'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Introduction au Trading"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="video_url">URL Vidéo (YouTube/Vimeo) *</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description de la vidéo..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="thumbnail_url">URL Thumbnail</Label>
                <Input
                  id="thumbnail_url"
                  value={formData.thumbnail_url || ''}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Durée (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration_minutes || 0}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Niveau</Label>
                <Select value={formData.level} onValueChange={(v) => setFormData({ ...formData, level: v as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Débutant</SelectItem>
                    <SelectItem value="intermediate">Intermédiaire</SelectItem>
                    <SelectItem value="advanced">Avancé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  id="category"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Technical Analysis"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Ajouter un tag"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>+</Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(formData.tags || []).map(tag => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="order_index">Ordre d'affichage</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index || 0}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_premium || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_premium: checked })}
                />
                <Label>Contenu Premium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.published || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                <Label>Publié</Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingVideo ? 'Mettre à jour' : 'Ajouter'}
              </Button>
              <Button variant="outline" onClick={() => { setIsAddingVideo(false); setEditingVideo(null); }}>
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Videos List */}
      <Card>
        <CardHeader>
          <CardTitle>Vidéos ({videos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingVideos ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : videos.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucune vidéo pour le moment</p>
          ) : (
            <div className="space-y-3">
              {videos.map((video) => (
                <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Video className="h-10 w-10 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{video.title}</h4>
                        {video.is_premium && <Badge variant="secondary">Premium</Badge>}
                        <Badge variant={video.published ? 'default' : 'outline'}>
                          {video.published ? 'Publié' : 'Brouillon'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {video.duration_minutes} min • {video.level} • {video.view_count || 0} vues
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => window.open(video.video_url, '_blank')}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => togglePublished(video)}>
                      <Eye className={`h-4 w-4 ${video.published ? 'text-success' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(video)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => video.id && handleDelete(video.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
