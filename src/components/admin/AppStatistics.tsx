// @ts-nocheck
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  BookOpen, 
  TrendingUp,
  Video,
  Loader2,
  Activity
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalLessons: number;
  totalTrades: number;
  totalVideos: number;
  completedLessons: number;
  activeToday: number;
}

export function AppStatistics() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [
        { count: totalUsers },
        { count: totalLessons },
        { count: totalTrades },
        { count: totalVideos },
        { count: completedLessons }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('lessons').select('*', { count: 'exact', head: true }),
        supabase.from('trades').select('*', { count: 'exact', head: true }),
        supabase.from('educational_videos').select('*', { count: 'exact', head: true }),
        supabase.from('user_lesson_progress').select('*', { count: 'exact', head: true }).eq('completed', true)
      ]);

      // Active today (users with activity in last 24h)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const { count: activeToday } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_activity_date', yesterday.toISOString().split('T')[0]);

      setStats({
        totalUsers: totalUsers || 0,
        totalLessons: totalLessons || 0,
        totalTrades: totalTrades || 0,
        totalVideos: totalVideos || 0,
        completedLessons: completedLessons || 0,
        activeToday: activeToday || 0
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les statistiques',
        variant: 'destructive'
      });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { label: 'Total Utilisateurs', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
    { label: 'Actifs Aujourd\'hui', value: stats.activeToday, icon: Activity, color: 'text-green-500' },
    { label: 'Leçons Créées', value: stats.totalLessons, icon: BookOpen, color: 'text-purple-500' },
    { label: 'Leçons Complétées', value: stats.completedLessons, icon: BookOpen, color: 'text-emerald-500' },
    { label: 'Trades Exécutés', value: stats.totalTrades, icon: TrendingUp, color: 'text-amber-500' },
    { label: 'Vidéos Publiées', value: stats.totalVideos, icon: Video, color: 'text-red-500' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Statistiques de l'Application</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value.toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
