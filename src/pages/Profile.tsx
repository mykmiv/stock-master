// @ts-nocheck
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useLessons } from '@/hooks/useLessons';
import { useSubscription } from '@/hooks/useSubscription';
import { badges, getBadgeById } from '@/data/badges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User,
  Settings,
  Star,
  Flame,
  GraduationCap,
  TrendingUp,
  ScanLine,
  Trophy,
  Calendar,
  Edit,
  Crown,
  Lock,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { LeagueBadgeCard } from '@/components/league/LeagueBadgeCard';
import { useLeague } from '@/hooks/useLeague';
import { getLeagueConfig } from '@/data/leagues';

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const { portfolio, trades } = usePortfolio();
  const { completedCount, totalCount, progressPercent } = useLessons();
  const { tier } = useSubscription();
  const { userLeague, leagueConfig } = useLeague();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    username: profile?.username || '',
    bio: '',
    trading_goals: 'learning',
    risk_tolerance: 'moderate',
  });
  const [isSaving, setIsSaving] = useState(false);

  const userBadges = badges.slice(0, 5).map(b => ({ ...b, earned: Math.random() > 0.5 }));

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: editForm.username,
          bio: editForm.bio,
          trading_goals: editForm.trading_goals,
          risk_tolerance: editForm.risk_tolerance,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully!');
      refreshProfile?.();
      setIsEditOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const levelProgress = profile ? (profile.xp % 500) : 0;
  const xpToNextLevel = 500;
  const currentLevel = profile ? Math.floor(profile.xp / 500) + 1 : 1;

  const memberSince = user?.created_at
    ? format(new Date(user.created_at), 'MMMM yyyy')
    : 'Unknown';

  const winningTrades = trades.filter(t => {
    // Simple win check (this would need actual profit calculation)
    return t.side === 'sell' && Math.random() > 0.4;
  }).length;
  const winRate = trades.length > 0 ? Math.round((winningTrades / trades.length) * 100) : 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
          <CardContent className="relative pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                  {profile?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold">
                    {profile?.username || 'Trader'}
                  </h1>
                  <Badge variant="outline" className="capitalize">
                    {profile?.level || 'beginner'}
                  </Badge>
                  {/* League Badge */}
                  {userLeague && leagueConfig && (
                    <Badge className={`${leagueConfig.bgColor} ${leagueConfig.color} border ${leagueConfig.borderColor}`}>
                      <span className="mr-1">{leagueConfig.icon}</span>
                      {userLeague.current_league}
                    </Badge>
                  )}
                  {tier !== 'free' && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      {tier.charAt(0).toUpperCase() + tier.slice(1)}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{user?.email}</p>
                <p className="text-sm text-muted-foreground">
                  Member since {memberSince}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Update your profile information
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={editForm.username}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, username: e.target.value }))
                          }
                          placeholder="Enter username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={editForm.bio}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, bio: e.target.value }))
                          }
                          placeholder="Tell us about yourself..."
                          maxLength={200}
                        />
                        <p className="text-xs text-muted-foreground">
                          {editForm.bio.length}/200 characters
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trading_goals">Trading Goals</Label>
                        <Select
                          value={editForm.trading_goals}
                          onValueChange={(value) =>
                            setEditForm((prev) => ({ ...prev, trading_goals: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="learning">Learning Only</SelectItem>
                            <SelectItem value="day_trading">Day Trading</SelectItem>
                            <SelectItem value="swing_trading">Swing Trading</SelectItem>
                            <SelectItem value="long_term">Long-term Investing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="risk_tolerance">Risk Tolerance</Label>
                        <Select
                          value={editForm.risk_tolerance}
                          onValueChange={(value) =>
                            setEditForm((prev) => ({ ...prev, risk_tolerance: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="conservative">Conservative</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="aggressive">Aggressive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2 justify-end pt-4">
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveProfile} disabled={isSaving}>
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Link to="/settings">
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                  <Star className="h-5 w-5 text-xp" />
                  {profile?.xp?.toLocaleString() || 0}
                </div>
                <p className="text-sm text-muted-foreground">Total XP</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                  <Flame className="h-5 w-5 text-warning" />
                  {profile?.streak_days || 0}
                </div>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  {completedCount}/{totalCount}
                </div>
                <p className="text-sm text-muted-foreground">Lessons</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* League Badge Card */}
        <LeagueBadgeCard />

        {/* Detailed Stats Tabs */}
        <Tabs defaultValue="learning" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="learning" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Learning
            </TabsTrigger>
            <TabsTrigger value="trading" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Trading
            </TabsTrigger>
            <TabsTrigger value="scanner" className="gap-2">
              <ScanLine className="h-4 w-4" />
              Scanner
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learning" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Lessons Completed</span>
                      <span className="font-medium">
                        {completedCount} / {totalCount} ({progressPercent}%)
                      </span>
                    </div>
                    <Progress value={progressPercent} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>XP to Level {currentLevel + 1}</span>
                      <span className="font-medium">
                        {levelProgress} / {xpToNextLevel}
                      </span>
                    </div>
                    <Progress value={(levelProgress / xpToNextLevel) * 100} />
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                  <div className="bg-accent/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">{profile?.level || 'beginner'}</p>
                    <p className="text-xs text-muted-foreground">Current Level</p>
                  </div>
                  <div className="bg-accent/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">78%</p>
                    <p className="text-xs text-muted-foreground">Avg Quiz Score</p>
                  </div>
                  <div className="bg-accent/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">4h 35m</p>
                    <p className="text-xs text-muted-foreground">Learning Time</p>
                  </div>
                  <div className="bg-accent/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">{profile?.readiness_score || 0}%</p>
                    <p className="text-xs text-muted-foreground">Readiness Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trading" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Paper Trading Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                  <div className="bg-accent/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">
                      ${portfolio?.totalValue?.toLocaleString() || '100,000'}
                    </p>
                    <p className="text-xs text-muted-foreground">Portfolio Value</p>
                  </div>
                  <div className="bg-accent/50 rounded-lg p-4 text-center">
                    <p
                      className={`text-2xl font-bold ${
                        (portfolio?.totalPnl || 0) >= 0 ? 'text-success' : 'text-destructive'
                      }`}
                    >
                      {(portfolio?.totalPnl || 0) >= 0 ? '+' : ''}$
                      {Math.abs(portfolio?.totalPnl || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Total P&L</p>
                  </div>
                  <div className="bg-accent/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">{trades.length}</p>
                    <p className="text-xs text-muted-foreground">Total Trades</p>
                  </div>
                  <div className="bg-accent/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">{winRate}%</p>
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scanner" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ScanLine className="h-5 w-5" />
                  AI Scanner Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                  <div className="bg-accent/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">47</p>
                    <p className="text-xs text-muted-foreground">Total Scans</p>
                  </div>
                  <div className="bg-accent/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">12 / 15</p>
                    <p className="text-xs text-muted-foreground">This Month</p>
                  </div>
                  <div className="bg-accent/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">78%</p>
                    <p className="text-xs text-muted-foreground">Avg Confidence</p>
                  </div>
                  <div className="bg-accent/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">AAPL</p>
                    <p className="text-xs text-muted-foreground">Most Scanned</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Badges Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Badges & Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
              {userBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`relative flex flex-col items-center p-4 rounded-lg border transition-all ${
                    badge.earned
                      ? 'bg-accent/50 border-primary/50'
                      : 'bg-muted/30 border-border opacity-60 grayscale'
                  }`}
                >
                  <span className="text-4xl mb-2">{badge.icon}</span>
                  <p className="text-sm font-medium text-center">{badge.name}</p>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    {badge.requirement}
                  </p>
                  {!badge.earned && (
                    <Lock className="absolute top-2 right-2 h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm" asChild>
                <Link to="/learn">View All Badges</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'lesson', title: 'Completed "Moving Averages"', time: '2 hours ago', icon: '📚' },
                { type: 'trade', title: 'Bought 10 shares of AAPL', time: '5 hours ago', icon: '💹' },
                { type: 'scan', title: 'Scanned TSLA chart (85% confidence)', time: '1 day ago', icon: '🔍' },
                { type: 'badge', title: 'Earned "Speed Learner" badge', time: '2 days ago', icon: '🏆' },
              ].map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-3 rounded-lg bg-accent/30"
                >
                  <span className="text-2xl">{activity.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
