// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Lightbulb, AlertCircle, Trophy } from 'lucide-react';
import { OnboardingData } from '@/types/onboarding';
import { supabase } from '@/integrations/supabase/client';
import { createUserLearningPath } from '@/lib/createUserLearningPath';
import { getPathIcon, getPathDisplayName, LearningPathType } from '@/lib/learningPathLogic';

interface Props {
  data: OnboardingData;
  userId: string;
  selectedPath: LearningPathType;
  onComplete: () => void;
}

interface LoadingStep {
  name: string;
  icon: string;
  progress: number;
  action: () => Promise<void>;
}

interface PathResult {
  pathType: LearningPathType;
  pathName: string;
  totalLessons: number;
  estimatedDays: number | null;
}

const tradingFacts = [
  "Le S&P 500 a généré un rendement annuel moyen de 10% depuis 1926.",
  "Warren Buffett a fait 99% de sa fortune après l'âge de 50 ans.",
  "90% des traders qui échouent n'avaient pas de plan de trading.",
  "Le meilleur moment pour planter un arbre était il y a 20 ans. Le deuxième meilleur moment est maintenant.",
  "Les émotions sont le plus grand ennemi du trader. La discipline est son meilleur ami.",
  "La patience est la clé : un bon trade peut prendre des jours à se développer.",
];

export function OnboardingLoading({ data, userId, selectedPath, onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentFact, setCurrentFact] = useState(tradingFacts[0]);
  const [pathResult, setPathResult] = useState<PathResult | null>(null);
  const [showPathReveal, setShowPathReveal] = useState(false);
  const pathResultRef = useRef<PathResult | null>(null);

  const getStepDescription = (step: number): string => {
    const descriptions: Record<number, string> = {
      0: 'On enregistre tout ce que tu nous as dit...',
      1: `Configuration pour niveau ${data.currentKnowledge || 'débutant'}...`,
      2: 'Génération de ton parcours personnalisé...',
      3: 'Initialisation de ton compte simulateur avec $100,000 virtuels...',
      4: `Ajout de ${data.sectors?.length || 3} secteurs à ta watchlist...`,
      5: `Personnalisation basée sur ton objectif: ${getMotivationLabel(data.mainMotivation)}...`,
      6: 'Derniers ajustements...',
    };
    return descriptions[step] || 'Chargement...';
  };

  const steps: LoadingStep[] = [
    {
      name: 'Sauvegarde de tes réponses',
      icon: '💾',
      progress: 15,
      action: async () => {
        await supabase.from('onboarding_data').upsert({
          user_id: userId,
          answers: {
            whyTrading: data.whyTrading,
            riskTolerance: data.riskTolerance,
            tradingStyle: data.tradingStyle,
            screenTime: data.screenTime,
            startingCapital: data.startingCapital,
            mainInterests: data.mainInterests,
            stockTypes: data.stockTypes,
            biggestChallenge: data.biggestChallenge,
            currentKnowledge: data.currentKnowledge,
            tradingExperience: data.tradingExperience,
            sectors: data.sectors,
            toolsUsed: data.toolsUsed,
            tradeTimeline: data.tradeTimeline,
            mainMotivation: data.mainMotivation,
            notificationPrefs: data.notificationPrefs,
            preparationScore: data.preparationScore || 0,
          },
          recommended_path: selectedPath,
        }, { onConflict: 'user_id' });
        await delay(1000);
      },
    },
    {
      name: 'Création de ton profil personnalisé',
      icon: '👤',
      progress: 25,
      action: async () => {
        const levelMap: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
          zero: 'beginner',
          basic: 'beginner',
          intermediate: 'intermediate',
          advanced: 'advanced',
        };
        await supabase.from('profiles').update({
          level: levelMap[data.currentKnowledge] || 'beginner',
          risk_tolerance: data.riskTolerance,
          trading_goals: data.mainMotivation,
        }).eq('id', userId);
        await delay(1000);
      },
    },
    {
      name: "🎯 Génération de ton parcours personnalisé",
      icon: '📚',
      progress: 55,
      action: async () => {
        try {
          // Create personalized learning path using the user-selected path
          const result = await createUserLearningPath(userId, data, 'standard', selectedPath);
          pathResultRef.current = result;
          setPathResult(result);
          console.log('✅ Learning path created:', result);
          await delay(1500);
        } catch (err) {
          console.error('Error creating learning path:', err);
          // Continue anyway - path creation is not critical
          await delay(1000);
        }
      },
    },
    {
      name: 'Configuration du simulateur',
      icon: '🎮',
      progress: 70,
      action: async () => {
        await delay(1200);
      },
    },
    {
      name: 'Préparation de ta watchlist personnalisée',
      icon: '📊',
      progress: 85,
      action: async () => {
        const sectorStocks: Record<string, string[]> = {
          tech: ['AAPL', 'MSFT', 'GOOGL', 'NVDA'],
          finance: ['JPM', 'BAC', 'GS', 'V'],
          healthcare: ['JNJ', 'PFE', 'UNH', 'ABBV'],
          energy: ['XOM', 'CVX', 'NEE', 'SLB'],
          consumer: ['AMZN', 'WMT', 'NKE', 'SBUX'],
        };
        
        const stocksToAdd = new Set<string>();
        for (const sector of data.sectors || []) {
          const stocks = sectorStocks[sector] || [];
          stocks.forEach(s => stocksToAdd.add(s));
        }
        
        // Get user's watchlist
        const { data: watchlists } = await supabase
          .from('watchlists')
          .select('id')
          .eq('user_id', userId)
          .limit(1)
          .single();
        
        if (watchlists?.id && stocksToAdd.size > 0) {
          const items = Array.from(stocksToAdd).slice(0, 6).map(symbol => ({
            watchlist_id: watchlists.id,
            symbol,
          }));
          
          // Insert items one by one to avoid duplicates
          for (const item of items) {
            await supabase.from('watchlist_items').upsert(item, { 
              onConflict: 'watchlist_id,symbol',
              ignoreDuplicates: true
            }).select().maybeSingle();
          }
        }
        
        await delay(1500);
      },
    },
    {
      name: 'Optimisation de ton dashboard',
      icon: '🎯',
      progress: 95,
      action: async () => {
        // Mark onboarding as complete
        await supabase.from('profiles').update({
          onboarding_completed: true,
        }).eq('id', userId);
        await delay(800);
      },
    },
    {
      name: 'Finalisation...',
      icon: '✨',
      progress: 100,
      action: async () => {
        // Show path reveal if we have a result
        if (pathResultRef.current) {
          setShowPathReveal(true);
          await delay(3000); // Show the reveal for 3 seconds
        } else {
          await delay(500);
        }
      },
    },
  ];
  useEffect(() => {
    configureUserExperience();
    // Rotate facts
    const factInterval = setInterval(() => {
      setCurrentFact(tradingFacts[Math.floor(Math.random() * tradingFacts.length)]);
    }, 4000);
    return () => clearInterval(factInterval);
  }, []);

  const configureUserExperience = async () => {
    try {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        await steps[i].action();
        setProgress(steps[i].progress);
      }
      // Complete after a short delay
      setTimeout(onComplete, 500);
    } catch (err) {
      console.error('Configuration error:', err);
      setError('Une erreur est survenue. Réessaie dans un instant.');
    }
  };

  const handleRetry = () => {
    setError(null);
    setProgress(0);
    setCurrentStep(0);
    setPathResult(null);
    setShowPathReveal(false);
    configureUserExperience();
  };

  const currentStepData = steps[currentStep];

  // Show path reveal screen
  if (showPathReveal && pathResult) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-background via-muted to-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-lg text-center space-y-8"
        >
          {/* Trophy icon */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: 'easeInOut'
            }}
          >
            <div className="mx-auto w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-7xl">{getPathIcon(pathResult.pathType)}</span>
            </div>
          </motion.div>

          {/* Path name */}
          <div className="space-y-2">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm font-medium text-muted-foreground uppercase tracking-wider"
            >
              Ton parcours personnalisé
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-black text-foreground"
            >
              {pathResult.pathName}
            </motion.h1>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center gap-6"
          >
            <div className="text-center">
              <p className="text-3xl font-black text-primary">{pathResult.totalLessons}</p>
              <p className="text-sm text-muted-foreground">leçons</p>
            </div>
            {pathResult.estimatedDays && (
              <div className="text-center">
                <p className="text-3xl font-black text-primary">{pathResult.estimatedDays}</p>
                <p className="text-sm text-muted-foreground">jours estimés</p>
              </div>
            )}
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Badge variant="secondary" className="text-base px-4 py-2">
              <Trophy className="h-4 w-4 mr-2" />
              Parcours créé sur mesure
            </Badge>
          </motion.div>

          {/* Sparkles */}
          <div className="flex justify-center gap-4">
            <Sparkles className="h-6 w-6 text-warning animate-pulse" />
            <Sparkles className="h-8 w-8 text-primary animate-pulse" style={{ animationDelay: '0.3s' }} />
            <Sparkles className="h-6 w-6 text-success animate-pulse" style={{ animationDelay: '0.6s' }} />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-background via-muted to-background">
      <div className="w-full max-w-2xl space-y-8">
        {/* Error state */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button onClick={handleRetry} className="mt-4" variant="outline">
              Réessayer
            </Button>
          </Alert>
        )}

        {!error && (
          <>
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-muted-foreground">
                  Configuration en cours...
                </p>
                <p className="text-lg font-black text-primary">
                  {progress}%
                </p>
              </div>
              <Progress value={progress} className="h-4" />
            </div>

            {/* Current step */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-6"
              >
                {/* Icon */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2,
                    ease: 'easeInOut'
                  }}
                  className="text-8xl"
                >
                  {currentStepData?.icon || '⏳'}
                </motion.div>

                {/* Title */}
                <h2 className="text-3xl font-black">
                  {currentStepData?.name || 'Chargement...'}
                </h2>

                {/* Description */}
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  {getStepDescription(currentStep)}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Fun facts */}
            <Card className="p-6 bg-muted/50">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-warning flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">Le savais-tu?</p>
                  <p className="text-sm text-muted-foreground">
                    {currentFact}
                  </p>
                </div>
              </div>
            </Card>

            {/* Skip button */}
            {progress < 100 && (
              <div className="text-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onComplete}
                  className="text-muted-foreground"
                >
                  Passer cette étape →
                </Button>
              </div>
            )}

            {/* Sparkles decoration */}
            <div className="flex justify-center gap-4 opacity-50">
              <Sparkles className="h-6 w-6 text-warning animate-pulse" />
              <Sparkles
                className="h-8 w-8 text-primary animate-pulse"
                style={{ animationDelay: '0.3s' }}
              />
              <Sparkles
                className="h-6 w-6 text-success animate-pulse"
                style={{ animationDelay: '0.6s' }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getMotivationLabel(motivation: string): string {
  const labels: Record<string, string> = {
    financial_freedom: 'liberté financière',
    master_skill: 'maîtrise des compétences',
    help_family: 'sécurité familiale',
    prove_myself: 'réussite personnelle',
    fun_challenge: 'challenge intellectuel',
  };
  return labels[motivation] || 'tes objectifs';
}
