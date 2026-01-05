// @ts-nocheck
// Example lesson content for StockMaster AI Learning System
// Module 1: Trading Fundamentals - Day 1

import { LessonContent } from '@/types/lesson.types';

export const module1Day1Lessons: Record<string, LessonContent[]> = {
  'lesson_1_1': [
    {
      type: 'intro',
      stockyEmotion: 'happy',
      speechBubble: "Salut! Je suis Stocky! Prêt à apprendre le trading? C'est parti! 🚀",
      continueButtonText: "C'est parti!"
    },
    {
      type: 'explanation',
      stockyEmotion: 'teaching',
      title: 'Qu\'est-ce que le Trading?',
      speechBubbleText: 'Le trading, c\'est comme acheter et vendre des parts de sociétés. Quand tu achètes une action, tu deviens propriétaire d\'une petite partie de cette entreprise!',
      keyPoints: [
        'Les actions représentent une part de propriété dans une entreprise',
        'Tu peux acheter et vendre des actions sur les bourses',
        'Les prix changent selon l\'offre et la demande'
      ],
      continueButtonText: 'Continuer'
    },
    {
      type: 'multiple_choice',
      question: 'Quand tu achètes une action, que deviens-tu?',
      options: [
        { id: 'a', text: 'Un employé de l\'entreprise', isCorrect: false },
        { id: 'b', text: 'Un propriétaire partiel de l\'entreprise', isCorrect: true },
        { id: 'c', text: 'Un client de l\'entreprise', isCorrect: false },
        { id: 'd', text: 'Un manager de l\'entreprise', isCorrect: false }
      ],
      explanation: 'Quand tu achètes une action, tu deviens actionnaire - un propriétaire partiel de l\'entreprise.',
      correctFeedback: 'Exactement! Tu deviens actionnaire - un propriétaire partiel! 🎉',
      incorrectFeedback: 'Pas tout à fait. Acheter une action fait de toi un propriétaire partiel, appelé actionnaire.'
    },
    {
      type: 'drag_drop',
      instruction: 'Associe ces entreprises célèbres avec leurs symboles boursiers',
      items: [
        { id: '1', content: 'Apple', correctMatchId: 'AAPL' },
        { id: '2', content: 'Microsoft', correctMatchId: 'MSFT' },
        { id: '3', content: 'Tesla', correctMatchId: 'TSLA' }
      ],
      targets: [
        { id: 'AAPL', label: 'AAPL' },
        { id: 'MSFT', label: 'MSFT' },
        { id: 'TSLA', label: 'TSLA' }
      ]
    },
    {
      type: 'completion',
      stockyEmotion: 'celebrating',
      speechBubble: 'Travail incroyable! Tu viens de terminer ta première leçon! 🎊',
      summary: {
        correctAnswers: 2,
        totalQuestions: 2,
        xpEarned: 10,
        coinsEarned: 5
      },
      nextLesson: 'lesson_1_2'
    }
  ],
  'lesson_1_2': [
    {
      type: 'intro',
      stockyEmotion: 'happy',
      speechBubble: 'Super! Continuons avec la compréhension des actions! 📈',
      continueButtonText: 'Allons-y!'
    },
    {
      type: 'explanation',
      stockyEmotion: 'teaching',
      title: 'Comprendre les Actions',
      speechBubbleText: 'Une action représente une petite part d\'une entreprise. Plus tu en achètes, plus tu possèdes de l\'entreprise!',
      keyPoints: [
        'Une action = une part de propriété',
        'Les entreprises vendent des actions pour lever des fonds',
        'Les actionnaires peuvent recevoir des dividendes'
      ],
      continueButtonText: 'Continuer'
    },
    {
      type: 'true_false',
      statements: [
        {
          id: '1',
          text: 'Acheter une action te donne le droit de vote dans certaines décisions de l\'entreprise',
          isTrue: true,
          explanation: 'Oui! En tant qu\'actionnaire, tu as souvent le droit de vote lors des assemblées générales.'
        },
        {
          id: '2',
          text: 'Toutes les entreprises sont cotées en bourse',
          isTrue: false,
          explanation: 'Non, seules les entreprises publiques sont cotées en bourse. Beaucoup d\'entreprises restent privées.'
        },
        {
          id: '3',
          text: 'Le prix d\'une action peut monter ou descendre',
          isTrue: true,
          explanation: 'Oui! Les prix des actions fluctuent constamment selon l\'offre et la demande.'
        }
      ]
    },
    {
      type: 'completion',
      stockyEmotion: 'celebrating',
      speechBubble: 'Excellent travail! Tu comprends maintenant les bases des actions! 🎉',
      summary: {
        correctAnswers: 3,
        totalQuestions: 3,
        xpEarned: 10,
        coinsEarned: 5
      }
    }
  ],
  'lesson_1_3': [
    {
      type: 'intro',
      stockyEmotion: 'happy',
      speechBubble: 'Maintenant, découvrons comment fonctionnent les marchés! 💹',
      continueButtonText: 'Commençons!'
    },
    {
      type: 'explanation',
      stockyEmotion: 'teaching',
      title: 'Comment Fonctionnent les Marchés',
      speechBubbleText: 'Les marchés boursiers sont comme des marchés où les gens achètent et vendent des actions. Le prix change selon combien de gens veulent acheter ou vendre!',
      keyPoints: [
        'Les bourses sont des places de marché pour les actions',
        'Le prix augmente quand plus de gens veulent acheter',
        'Le prix baisse quand plus de gens veulent vendre',
        'Les heures de marché sont généralement 9h30-16h00 (heure locale)'
      ],
      continueButtonText: 'Continuer'
    },
    {
      type: 'multiple_choice',
      question: 'Que se passe-t-il quand beaucoup de gens veulent acheter une action?',
      options: [
        { id: 'a', text: 'Le prix baisse', isCorrect: false },
        { id: 'b', text: 'Le prix monte', isCorrect: true },
        { id: 'c', text: 'Le prix reste le même', isCorrect: false },
        { id: 'd', text: 'L\'action disparaît', isCorrect: false }
      ],
      explanation: 'Quand la demande (acheteurs) dépasse l\'offre (vendeurs), le prix monte. C\'est la loi de l\'offre et de la demande!',
      correctFeedback: 'Parfait! Plus de demande = prix plus élevé! 📈',
      incorrectFeedback: 'En fait, quand beaucoup de gens veulent acheter, le prix monte à cause de la demande élevée.'
    },
    {
      type: 'completion',
      stockyEmotion: 'encouraging',
      speechBubble: 'Génial! Tu comprends maintenant comment les marchés fonctionnent! 🎯',
      summary: {
        correctAnswers: 1,
        totalQuestions: 1,
        xpEarned: 10,
        coinsEarned: 5
      }
    }
  ],
  'lesson_1_4': [
    {
      type: 'intro',
      stockyEmotion: 'excited',
      speechBubble: 'Prêt pour ton premier trade simulé? C\'est excitant! 🎮',
      continueButtonText: 'Oui, allons-y!'
    },
    {
      type: 'explanation',
      stockyEmotion: 'teaching',
      title: 'Ton Premier Trade',
      speechBubbleText: 'Dans cette simulation, tu vas acheter 1 action d\'une entreprise populaire. C\'est comme un vrai trade, mais sans risque!',
      keyPoints: [
        'Choisis une action que tu veux acheter',
        'Clique sur "Acheter" pour exécuter le trade',
        'Observe comment le prix change après ton achat'
      ],
      continueButtonText: 'Commencer la simulation'
    },
    {
      type: 'multiple_choice',
      question: 'Dans cette simulation, que dois-tu faire?',
      options: [
        { id: 'a', text: 'Vendre toutes tes actions', isCorrect: false },
        { id: 'b', text: 'Acheter 1 action d\'une entreprise', isCorrect: true },
        { id: 'c', text: 'Attendre sans rien faire', isCorrect: false },
        { id: 'd', text: 'Fermer l\'application', isCorrect: false }
      ],
      explanation: 'Tu dois acheter 1 action pour compléter cette leçon. C\'est une simulation, donc pas de risque réel!',
      correctFeedback: 'Exactement! Achete 1 action pour continuer! 💪',
      incorrectFeedback: 'Tu dois acheter 1 action pour compléter cette leçon de simulation.'
    },
    {
      type: 'completion',
      stockyEmotion: 'celebrating',
      speechBubble: 'Félicitations! Tu as fait ton premier trade! Tu es maintenant un trader! 🎊',
      summary: {
        correctAnswers: 1,
        totalQuestions: 1,
        xpEarned: 15,
        coinsEarned: 10
      }
    }
  ]
};

// Helper function to convert lesson content to JSONB format for database
export function lessonContentToJSONB(content: LessonContent[]): any {
  return content;
}
