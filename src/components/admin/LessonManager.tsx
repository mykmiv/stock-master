// @ts-nocheck
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, 
  Trash2, 
  Edit, 
  Plus,
  Loader2
} from 'lucide-react';

interface LessonData {
  id?: string;
  title: string;
  description: string | null;
  content: string | null;
  level: 'beginner' | 'intermediate' | 'advanced';
  order_index: number;
  duration_minutes: number | null;
  xp_reward: number | null;
}

const emptyFormData: LessonData = {
  title: '',
  description: '',
  content: '',
  level: 'beginner',
  order_index: 0,
  duration_minutes: 5,
  xp_reward: 10
};

export function LessonManager() {
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editing, setEditing] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [formData, setFormData] = useState<LessonData>(emptyFormData);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    setLoadingLessons(true);
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les leçons',
        variant: 'destructive'
      });
    } else {
      setLessons(data || []);
    }
    setLoadingLessons(false);
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      toast({
        title: 'Erreur',
        description: 'Titre requis',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        level: formData.level,
        order_index: formData.order_index,
        duration_minutes: formData.duration_minutes,
        xp_reward: formData.xp_reward
      };

      if (editing?.id) {
        const { error } = await supabase
          .from('lessons')
          .update(dataToSend)
          .eq('id', editing.id);

        if (error) throw error;

        toast({
          title: 'Leçon mise à jour!',
          description: 'Les changements ont été sauvegardés.'
        });
      } else {
        const { error } = await supabase
          .from('lessons')
          .insert([dataToSend]);

        if (error) throw error;

        toast({
          title: 'Leçon ajoutée!',
          description: 'La nouvelle leçon a été créée.'
        });
      }

      setFormData(emptyFormData);
      setIsAdding(false);
      setEditing(null);
      loadLessons();
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
    if (!confirm('Supprimer cette leçon?')) return;

    const { error } = await supabase
      .from('lessons')
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
        title: 'Leçon supprimée'
      });
      loadLessons();
    }
  };

  const handleEdit = (lesson: LessonData) => {
    setFormData(lesson);
    setEditing(lesson);
    setIsAdding(true);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-emerald-500/10 text-emerald-500';
      case 'intermediate': return 'bg-amber-500/10 text-amber-500';
      case 'advanced': return 'bg-red-500/10 text-red-500';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gérer les Leçons</h2>
        <Button onClick={() => { setIsAdding(true); setEditing(null); setFormData(emptyFormData); }}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Leçon
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>{editing ? 'Modifier la Leçon' : 'Ajouter une Leçon'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Introduction au Marché"
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description courte de la leçon..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenu (Markdown supporté)</Label>
              <Textarea
                id="content"
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="# Titre&#10;&#10;Contenu de la leçon..."
                rows={10}
                className="font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order_index">Ordre</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Durée (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration_minutes || 5}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 5 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="xp">XP Reward</Label>
                <Input
                  id="xp"
                  type="number"
                  value={formData.xp_reward || 10}
                  onChange={(e) => setFormData({ ...formData, xp_reward: parseInt(e.target.value) || 10 })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editing ? 'Mettre à jour' : 'Ajouter'}
              </Button>
              <Button variant="outline" onClick={() => { setIsAdding(false); setEditing(null); }}>
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Leçons ({lessons.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingLessons ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : lessons.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucune leçon pour le moment</p>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <BookOpen className="h-10 w-10 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">#{lesson.order_index}</span>
                        <h4 className="font-medium">{lesson.title}</h4>
                        <Badge className={getLevelColor(lesson.level)}>{lesson.level}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {lesson.duration_minutes} min • {lesson.xp_reward} XP
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(lesson)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => lesson.id && handleDelete(lesson.id)}>
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
