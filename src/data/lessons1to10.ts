// @ts-nocheck
// Complete content for Lessons 1-10: Zero to Hero Trading Course
// Full interactive content with quizzes, explanations, and gamification

import { LessonContent } from '@/types/lesson.types';

export const lesson1Content: LessonContent[] = [
  {
    type: 'intro',
    stockyEmotion: 'happy',
    speechBubble: "Salut! Je suis Stocky! 🎉 Prêt à devenir trader?",
    continueButtonText: "Commençons!"
  },
  {
    type: 'explanation',
    stockyEmotion: 'teaching',
    title: 'Qu\'est-ce que le Trading d\'Actions?',
    speechBubbleText: 'Le trading, c\'est simple: acheter des parts de sociétés quand les prix sont bas, vendre quand ils sont hauts! 📈',
    keyPoints: [
      '💼 Les actions = Propriété dans des entreprises',
      '📊 Les prix changent selon la demande',
      '💰 Acheter bas, vendre haut = Profit',
      '⏰ Les marchés ouvrent en semaine'
    ],
    continueButtonText: 'Continuer'
  },
  {
    type: 'multiple_choice',
    question: 'Quand tu achètes une action, que deviens-tu?',
    options: [
      {
        id: 'a',
        text: 'Un employé de l\'entreprise',
        isCorrect: false
      },
      {
        id: 'b',
        text: 'Un propriétaire partiel de l\'entreprise',
        isCorrect: true
      },
      {
        id: 'c',
        text: 'Un client de l\'entreprise',
        isCorrect: false
      },
      {
        id: 'd',
        text: 'Un manager de l\'entreprise',
        isCorrect: false
      }
    ],
    explanation: 'Acheter une action fait de toi un propriétaire partiel (actionnaire) de l\'entreprise.',
    correctFeedback: 'Exactement! 🎉 Tu deviens actionnaire!',
    incorrectFeedback: 'Pas tout à fait. Acheter une action fait de toi un propriétaire partiel, appelé actionnaire.'
  },
  {
    type: 'multiple_choice',
    question: 'Quelle est la règle d\'or du trading?',
    options: [
      {
        id: 'a',
        text: 'Acheter haut, vendre bas',
        isCorrect: false
      },
      {
        id: 'b',
        text: 'Acheter bas, vendre haut',
        isCorrect: true
      },
      {
        id: 'c',
        text: 'Acheter et garder toujours',
        isCorrect: false
      },
      {
        id: 'd',
        text: 'Vendre immédiatement après achat',
        isCorrect: false
      }
    ],
    explanation: 'Le principe de base est d\'acheter quand le prix est bas et de vendre quand il est haut pour faire un profit.',
    correctFeedback: 'Parfait! C\'est exactement ça! 💰',
    incorrectFeedback: 'En fait, tu veux acheter quand c\'est bas et vendre quand c\'est haut pour faire un profit.'
  },
  {
    type: 'completion',
    stockyEmotion: 'celebrating',
    speechBubble: 'Incroyable! Tu viens d\'apprendre ce qu\'est le trading! 🎊',
    summary: {
      correctAnswers: 2,
      totalQuestions: 2,
      xpEarned: 10,
      coinsEarned: 5
    }
  }
];

export const lesson2Content: LessonContent[] = [
  {
    type: 'intro',
    stockyEmotion: 'happy',
    speechBubble: 'Super! Maintenant, comprenons ce que sont vraiment les actions! 📈',
    continueButtonText: 'Allons-y!'
  },
  {
    type: 'explanation',
    stockyEmotion: 'teaching',
    title: 'Comprendre les Actions',
    speechBubbleText: 'Imagine une pizza 🍕. Si tu achètes une part, tu possèdes une partie de la pizza. C\'est pareil avec les actions - tu possèdes une part de l\'entreprise!',
    keyPoints: [
      'Une action = une part de propriété',
      'Plus tu achètes d\'actions, plus tu possèdes',
      'Les entreprises vendent des actions pour lever des fonds',
      'C\'est ce qu\'on appelle une IPO (Introduction en Bourse)'
    ],
    continueButtonText: 'Continuer'
  },
  {
    type: 'drag_drop',
    instruction: 'Associe ces entreprises célèbres avec leurs symboles boursiers',
    items: [
      { id: '1', content: 'Apple', correctMatchId: 'AAPL' },
      { id: '2', content: 'Tesla', correctMatchId: 'TSLA' },
      { id: '3', content: 'Microsoft', correctMatchId: 'MSFT' },
      { id: '4', content: 'Amazon', correctMatchId: 'AMZN' }
    ],
    targets: [
      { id: 'AAPL', label: 'AAPL' },
      { id: 'TSLA', label: 'TSLA' },
      { id: 'MSFT', label: 'MSFT' },
      { id: 'AMZN', label: 'AMZN' }
    ]
  },
  {
    type: 'multiple_choice',
    question: 'Qu\'est-ce qu\'une IPO?',
    options: [
      {
        id: 'a',
        text: 'Une entreprise privée qui devient publique',
        isCorrect: true
      },
      {
        id: 'b',
        text: 'Une entreprise qui ferme',
        isCorrect: false
      },
      {
        id: 'c',
        text: 'Un type d\'ordre de trading',
        isCorrect: false
      },
      {
        id: 'd',
        text: 'Une stratégie d\'investissement',
        isCorrect: false
      }
    ],
    explanation: 'IPO signifie "Initial Public Offering" - c\'est quand une entreprise privée vend ses actions au public pour la première fois.',
    correctFeedback: 'Exactement! Une IPO rend une entreprise publique! 🎉',
    incorrectFeedback: 'Une IPO (Introduction en Bourse) est quand une entreprise privée devient publique en vendant des actions.'
  },
  {
    type: 'completion',
    stockyEmotion: 'encouraging',
    speechBubble: 'Excellent travail! Tu comprends maintenant ce que sont les actions! 🎯',
    summary: {
      correctAnswers: 2,
      totalQuestions: 2,
      xpEarned: 10,
      coinsEarned: 5
    }
  }
];

export const lesson3Content: LessonContent[] = [
  {
    type: 'intro',
    stockyEmotion: 'excited',
    speechBubble: 'Maintenant, découvrons comment fonctionnent les marchés boursiers! 💹',
    continueButtonText: 'Commençons!'
  },
  {
    type: 'explanation',
    stockyEmotion: 'teaching',
    title: 'Comment Fonctionnent les Marchés Boursiers',
    speechBubbleText: 'Les bourses comme NYSE et NASDAQ sont comme des marchés géants où tout le monde peut acheter et vendre des actions!',
    keyPoints: [
      'NYSE et NASDAQ sont les principales bourses',
      'Le trading se fait électroniquement maintenant',
      'Les heures de marché: 9h30 - 16h00 (EST)',
      'Il y a aussi le pre-market et after-hours'
    ],
    continueButtonText: 'Continuer'
  },
  {
    type: 'multiple_choice',
    question: 'Quelles sont les heures normales de trading aux États-Unis?',
    options: [
      {
        id: 'a',
        text: '8h00 - 17h00',
        isCorrect: false
      },
      {
        id: 'b',
        text: '9h30 - 16h00 (EST)',
        isCorrect: true
      },
      {
        id: 'c',
        text: '24h/24',
        isCorrect: false
      },
      {
        id: 'd',
        text: '10h00 - 15h00',
        isCorrect: false
      }
    ],
    explanation: 'Les heures normales de trading sont de 9h30 à 16h00 heure de l\'Est (EST), du lundi au vendredi.',
    correctFeedback: 'Parfait! 9h30 - 16h00 EST! ⏰',
    incorrectFeedback: 'Les heures normales sont de 9h30 à 16h00 heure de l\'Est, du lundi au vendredi.'
  },
  {
    type: 'multiple_choice',
    question: 'Que signifie "pre-market"?',
    options: [
      {
        id: 'a',
        text: 'Le marché avant l\'ouverture officielle',
        isCorrect: true
      },
      {
        id: 'b',
        text: 'Un marché différent',
        isCorrect: false
      },
      {
        id: 'c',
        text: 'Le marché du week-end',
        isCorrect: false
      },
      {
        id: 'd',
        text: 'Un type d\'ordre',
        isCorrect: false
      }
    ],
    explanation: 'Le pre-market est la période avant l\'ouverture officielle (4h00 - 9h30 EST) où certains traders peuvent déjà trader.',
    correctFeedback: 'Oui! C\'est la période avant l\'ouverture! 🌅',
    incorrectFeedback: 'Le pre-market est la période avant l\'ouverture officielle du marché.'
  },
  {
    type: 'completion',
    stockyEmotion: 'happy',
    speechBubble: 'Génial! Tu comprends maintenant comment fonctionnent les marchés! 🎉',
    summary: {
      correctAnswers: 2,
      totalQuestions: 2,
      xpEarned: 10,
      coinsEarned: 5
    }
  }
];

export const lesson4Content: LessonContent[] = [
  {
    type: 'intro',
    stockyEmotion: 'teaching',
    speechBubble: 'Apprenons à lire les prix des actions! C\'est essentiel! 📊',
    continueButtonText: 'Commençons!'
  },
  {
    type: 'explanation',
    stockyEmotion: 'teaching',
    title: 'Lire les Prix des Actions',
    speechBubbleText: 'Un "stock quote" te montre tout ce que tu dois savoir: le prix actuel, le changement, le volume, et plus encore!',
    keyPoints: [
      'Prix actuel: le dernier prix d\'échange',
      'Changement: combien le prix a bougé',
      'Volume: combien d\'actions ont été échangées',
      'Market Cap: la valeur totale de l\'entreprise'
    ],
    continueButtonText: 'Continuer'
  },
  {
    type: 'multiple_choice',
    question: 'Que montre le "volume" dans un stock quote?',
    options: [
      {
        id: 'a',
        text: 'Le nombre d\'actions échangées',
        isCorrect: true
      },
      {
        id: 'b',
        text: 'Le prix de l\'action',
        isCorrect: false
      },
      {
        id: 'c',
        text: 'Le nombre d\'actionnaires',
        isCorrect: false
      },
      {
        id: 'd',
        text: 'La valeur totale',
        isCorrect: false
      }
    ],
    explanation: 'Le volume représente le nombre total d\'actions échangées pendant une période donnée.',
    correctFeedback: 'Exactement! Le volume = nombre d\'actions échangées! 📈',
    incorrectFeedback: 'Le volume représente le nombre d\'actions échangées, pas le prix ou autre chose.'
  },
  {
    type: 'multiple_choice',
    question: 'Pourquoi les prix des actions changent-ils?',
    options: [
      {
        id: 'a',
        text: 'L\'offre et la demande',
        isCorrect: true
      },
      {
        id: 'b',
        text: 'Le jour de la semaine',
        isCorrect: false
      },
      {
        id: 'c',
        text: 'La météo',
        isCorrect: false
      },
      {
        id: 'd',
        text: 'L\'heure de la journée',
        isCorrect: false
      }
    ],
    explanation: 'Les prix changent principalement à cause de l\'offre et la demande - plus de gens veulent acheter, le prix monte!',
    correctFeedback: 'Parfait! L\'offre et la demande! 💹',
    incorrectFeedback: 'Les prix changent principalement à cause de l\'offre et la demande, pas à cause d\'autres facteurs externes.'
  },
  {
    type: 'completion',
    stockyEmotion: 'celebrating',
    speechBubble: 'Félicitations! Tu as terminé le Jour 1! 🎊 Tu es maintenant prêt pour le Jour 2!',
    summary: {
      correctAnswers: 2,
      totalQuestions: 2,
      xpEarned: 10,
      coinsEarned: 5
    }
  }
];

export const lesson5Content: LessonContent[] = [
  {
    type: 'intro',
    stockyEmotion: 'excited',
    speechBubble: 'Jour 2! Apprenons les types d\'ordres - c\'est crucial pour trader! 🎯',
    continueButtonText: 'Commençons!'
  },
  {
    type: 'explanation',
    stockyEmotion: 'teaching',
    title: 'Market Orders vs Limit Orders',
    speechBubbleText: 'Un Market Order = exécution immédiate au meilleur prix disponible. Un Limit Order = tu fixes ton prix, mais ça peut ne pas s\'exécuter!',
    keyPoints: [
      'Market Order: rapide, prix garanti mais peut varier',
      'Limit Order: prix fixe, mais exécution non garantie',
      'Market = "Je veux acheter MAINTENANT"',
      'Limit = "Je veux acheter à ce prix exact"'
    ],
    continueButtonText: 'Continuer'
  },
  {
    type: 'multiple_choice',
    question: 'Quel type d\'ordre s\'exécute immédiatement?',
    options: [
      {
        id: 'a',
        text: 'Market Order',
        isCorrect: true
      },
      {
        id: 'b',
        text: 'Limit Order',
        isCorrect: false
      },
      {
        id: 'c',
        text: 'Stop Order',
        isCorrect: false
      },
      {
        id: 'd',
        text: 'Tous les ordres',
        isCorrect: false
      }
    ],
    explanation: 'Un Market Order s\'exécute immédiatement au meilleur prix disponible sur le marché.',
    correctFeedback: 'Oui! Market Order = immédiat! ⚡',
    incorrectFeedback: 'Un Market Order s\'exécute immédiatement, contrairement aux autres types d\'ordres.'
  },
  {
    type: 'multiple_choice',
    question: 'Quand utiliser un Limit Order?',
    options: [
      {
        id: 'a',
        text: 'Quand tu veux un prix exact',
        isCorrect: true
      },
      {
        id: 'b',
        text: 'Quand tu es pressé',
        isCorrect: false
      },
      {
        id: 'c',
        text: 'Pour vendre uniquement',
        isCorrect: false
      },
      {
        id: 'd',
        text: 'Jamais',
        isCorrect: false
      }
    ],
    explanation: 'Tu utilises un Limit Order quand tu veux un prix exact et que tu peux attendre que le marché atteigne ce prix.',
    correctFeedback: 'Exactement! Pour un prix précis! 🎯',
    incorrectFeedback: 'Un Limit Order est utilisé quand tu veux un prix exact, pas quand tu es pressé.'
  },
  {
    type: 'completion',
    stockyEmotion: 'encouraging',
    speechBubble: 'Super! Tu comprends maintenant les types d\'ordres! 💪',
    summary: {
      correctAnswers: 2,
      totalQuestions: 2,
      xpEarned: 10,
      coinsEarned: 5
    }
  }
];

export const lesson6Content: LessonContent[] = [
  {
    type: 'intro',
    stockyEmotion: 'thinking',
    speechBubble: 'Maintenant, comprenons le Bid et l\'Ask - c\'est la base! 💰',
    continueButtonText: 'Allons-y!'
  },
  {
    type: 'explanation',
    stockyEmotion: 'teaching',
    title: 'Comprendre le Bid et l\'Ask',
    speechBubbleText: 'Bid = le prix que les acheteurs sont prêts à payer. Ask = le prix que les vendeurs veulent. La différence = le spread!',
    keyPoints: [
      'Bid: prix d\'achat maximum',
      'Ask: prix de vente minimum',
      'Spread = Ask - Bid',
      'Spread serré = marché liquide'
    ],
    continueButtonText: 'Continuer'
  },
  {
    type: 'multiple_choice',
    question: 'Qu\'est-ce que le "spread"?',
    options: [
      {
        id: 'a',
        text: 'La différence entre Bid et Ask',
        isCorrect: true
      },
      {
        id: 'b',
        text: 'Le prix de l\'action',
        isCorrect: false
      },
      {
        id: 'c',
        text: 'Le volume',
        isCorrect: false
      },
      {
        id: 'd',
        text: 'Le changement de prix',
        isCorrect: false
      }
    ],
    explanation: 'Le spread est la différence entre le prix Ask (vente) et le prix Bid (achat).',
    correctFeedback: 'Parfait! Spread = Ask - Bid! 📊',
    incorrectFeedback: 'Le spread est la différence entre le prix Ask et le prix Bid.'
  },
  {
    type: 'multiple_choice',
    question: 'Un spread serré indique quoi?',
    options: [
      {
        id: 'a',
        text: 'Un marché très liquide',
        isCorrect: true
      },
      {
        id: 'b',
        text: 'Peu de trading',
        isCorrect: false
      },
      {
        id: 'c',
        text: 'Un prix élevé',
        isCorrect: false
      },
      {
        id: 'd',
        text: 'Un marché fermé',
        isCorrect: false
      }
    ],
    explanation: 'Un spread serré (petite différence) indique un marché très liquide avec beaucoup d\'activité.',
    correctFeedback: 'Oui! Spread serré = marché actif! 💹',
    incorrectFeedback: 'Un spread serré indique un marché très liquide avec beaucoup d\'activité de trading.'
  },
  {
    type: 'completion',
    stockyEmotion: 'happy',
    speechBubble: 'Excellent! Tu maîtrises maintenant Bid et Ask! 🎉',
    summary: {
      correctAnswers: 2,
      totalQuestions: 2,
      xpEarned: 10,
      coinsEarned: 5
    }
  }
];

export const lesson7Content: LessonContent[] = [
  {
    type: 'intro',
    stockyEmotion: 'excited',
    speechBubble: 'Les graphiques sont ton meilleur ami en trading! Apprenons à les lire! 📈',
    continueButtonText: 'Commençons!'
  },
  {
    type: 'explanation',
    stockyEmotion: 'teaching',
    title: 'Introduction aux Graphiques Boursiers',
    speechBubbleText: 'Les graphiques montrent l\'histoire du prix! L\'axe X = le temps, l\'axe Y = le prix. Simple mais puissant!',
    keyPoints: [
      'X-axis = Temps (jours, semaines, mois)',
      'Y-axis = Prix de l\'action',
      'Différents timeframes: 1 jour, 5 jours, 1 mois, 1 an',
      'Les graphiques révèlent les tendances'
    ],
    continueButtonText: 'Continuer'
  },
  {
    type: 'multiple_choice',
    question: 'Que montre l\'axe Y d\'un graphique boursier?',
    options: [
      {
        id: 'a',
        text: 'Le prix de l\'action',
        isCorrect: true
      },
      {
        id: 'b',
        text: 'Le temps',
        isCorrect: false
      },
      {
        id: 'c',
        text: 'Le volume',
        isCorrect: false
      },
      {
        id: 'd',
        text: 'Le nombre d\'actions',
        isCorrect: false
      }
    ],
    explanation: 'L\'axe Y (vertical) montre le prix de l\'action, tandis que l\'axe X (horizontal) montre le temps.',
    correctFeedback: 'Exactement! Y = Prix! 📊',
    incorrectFeedback: 'L\'axe Y montre le prix de l\'action, pas le temps ou le volume.'
  },
  {
    type: 'multiple_choice',
    question: 'Qu\'est-ce qu\'un timeframe?',
    options: [
      {
        id: 'a',
        text: 'La période de temps affichée sur le graphique',
        isCorrect: true
      },
      {
        id: 'b',
        text: 'L\'heure de trading',
        isCorrect: false
      },
      {
        id: 'c',
        text: 'Le prix maximum',
        isCorrect: false
      },
      {
        id: 'd',
        text: 'Le volume',
        isCorrect: false
      }
    ],
    explanation: 'Le timeframe est la période de temps affichée sur le graphique (1 jour, 1 semaine, 1 mois, etc.).',
    correctFeedback: 'Parfait! Le timeframe = période affichée! ⏰',
    incorrectFeedback: 'Le timeframe est la période de temps affichée sur le graphique.'
  },
  {
    type: 'completion',
    stockyEmotion: 'encouraging',
    speechBubble: 'Super! Tu peux maintenant lire les graphiques! 📈',
    summary: {
      correctAnswers: 2,
      totalQuestions: 2,
      xpEarned: 10,
      coinsEarned: 5
    }
  }
];

export const lesson8Content: LessonContent[] = [
  {
    type: 'intro',
    stockyEmotion: 'excited',
    speechBubble: 'Les chandeliers sont la façon la plus puissante de lire les graphiques! 🕯️',
    continueButtonText: 'Découvrons-les!'
  },
  {
    type: 'explanation',
    stockyEmotion: 'teaching',
    title: 'Les Bases des Chandeliers',
    speechBubbleText: 'Un chandelier montre 4 prix: Open (ouverture), High (haut), Low (bas), Close (fermeture). Vert = montée, Rouge = baisse!',
    keyPoints: [
      'OHLC = Open, High, Low, Close',
      'Chandelier vert = prix a monté',
      'Chandelier rouge = prix a baissé',
      'Le corps = zone entre Open et Close',
      'Les mèches = High et Low'
    ],
    continueButtonText: 'Continuer'
  },
  {
    type: 'multiple_choice',
    question: 'Que signifie un chandelier vert?',
    options: [
      {
        id: 'a',
        text: 'Le prix a monté pendant cette période',
        isCorrect: true
      },
      {
        id: 'b',
        text: 'Le prix a baissé',
        isCorrect: false
      },
      {
        id: 'c',
        text: 'Pas de changement',
        isCorrect: false
      },
      {
        id: 'd',
        text: 'Volume élevé',
        isCorrect: false
      }
    ],
    explanation: 'Un chandelier vert signifie que le prix de clôture était plus haut que le prix d\'ouverture - le prix a monté!',
    correctFeedback: 'Exactement! Vert = montée! 📈',
    incorrectFeedback: 'Un chandelier vert signifie que le prix a monté (Close > Open).'
  },
  {
    type: 'multiple_choice',
    question: 'Que montre la "mèche" d\'un chandelier?',
    options: [
      {
        id: 'a',
        text: 'Le prix le plus haut ou le plus bas atteint',
        isCorrect: true
      },
      {
        id: 'b',
        text: 'Le prix d\'ouverture',
        isCorrect: false
      },
      {
        id: 'c',
        text: 'Le volume',
        isCorrect: false
      },
      {
        id: 'd',
        text: 'Le spread',
        isCorrect: false
      }
    ],
    explanation: 'Les mèches (wicks) montrent le prix le plus haut (mèche supérieure) et le plus bas (mèche inférieure) atteints.',
    correctFeedback: 'Parfait! Les mèches = High et Low! 🎯',
    incorrectFeedback: 'Les mèches montrent les prix les plus hauts et les plus bas atteints pendant la période.'
  },
  {
    type: 'completion',
    stockyEmotion: 'celebrating',
    speechBubble: 'Excellent! Tu maîtrises maintenant les chandeliers! C\'est un grand pas! 🎊',
    summary: {
      correctAnswers: 2,
      totalQuestions: 2,
      xpEarned: 15,
      coinsEarned: 10
    }
  }
];

export const lesson9Content: LessonContent[] = [
  {
    type: 'intro',
    stockyEmotion: 'teaching',
    speechBubble: 'Le volume est super important! Apprenons pourquoi! 📊',
    continueButtonText: 'Commençons!'
  },
  {
    type: 'explanation',
    stockyEmotion: 'teaching',
    title: 'Analyse du Volume',
    speechBubbleText: 'Le volume = combien d\'actions ont été échangées. Volume élevé = beaucoup d\'intérêt = mouvement de prix plus fiable!',
    keyPoints: [
      'Volume = nombre d\'actions échangées',
      'Volume élevé = mouvement de prix plus fiable',
      'Volume faible = mouvement moins significatif',
      'Les barres de volume sont sous le graphique'
    ],
    continueButtonText: 'Continuer'
  },
  {
    type: 'multiple_choice',
    question: 'Que signifie un volume élevé?',
    options: [
      {
        id: 'a',
        text: 'Beaucoup d\'intérêt et de trading',
        isCorrect: true
      },
      {
        id: 'b',
        text: 'Peu de trading',
        isCorrect: false
      },
      {
        id: 'c',
        text: 'Un prix élevé',
        isCorrect: false
      },
      {
        id: 'd',
        text: 'Un marché fermé',
        isCorrect: false
      }
    ],
    explanation: 'Un volume élevé signifie qu\'il y a beaucoup d\'intérêt et d\'activité de trading, ce qui rend les mouvements de prix plus significatifs.',
    correctFeedback: 'Oui! Volume élevé = beaucoup d\'activité! 💹',
    incorrectFeedback: 'Un volume élevé signifie beaucoup d\'intérêt et d\'activité de trading.'
  },
  {
    type: 'multiple_choice',
    question: 'Pourquoi le volume est-il important?',
    options: [
      {
        id: 'a',
        text: 'Il confirme la force d\'un mouvement de prix',
        isCorrect: true
      },
      {
        id: 'b',
        text: 'Il détermine le prix',
        isCorrect: false
      },
      {
        id: 'c',
        text: 'Il montre le spread',
        isCorrect: false
      },
      {
        id: 'd',
        text: 'Il n\'est pas important',
        isCorrect: false
      }
    ],
    explanation: 'Le volume confirme la force d\'un mouvement de prix - un mouvement avec volume élevé est plus fiable qu\'un mouvement avec faible volume.',
    correctFeedback: 'Exactement! Le volume confirme les mouvements! ✅',
    incorrectFeedback: 'Le volume est important car il confirme la force et la fiabilité d\'un mouvement de prix.'
  },
  {
    type: 'completion',
    stockyEmotion: 'encouraging',
    speechBubble: 'Super! Tu comprends maintenant l\'importance du volume! 📊',
    summary: {
      correctAnswers: 2,
      totalQuestions: 2,
      xpEarned: 10,
      coinsEarned: 5
    }
  }
];

export const lesson10Content: LessonContent[] = [
  {
    type: 'intro',
    stockyEmotion: 'excited',
    speechBubble: 'C\'est le moment! Ton premier trade pratique! 🚀',
    continueButtonText: 'Commençons le trading!'
  },
  {
    type: 'explanation',
    stockyEmotion: 'teaching',
    title: 'Ton Premier Trade Pratique',
    speechBubbleText: 'Nous allons trader AAPL (Apple)! Analyse le graphique, regarde la tendance et le volume, puis place ton ordre!',
    keyPoints: [
      'Analyse la tendance (montante ou descendante)',
      'Vérifie le volume (est-ce élevé?)',
      'Regarde le spread (est-il serré?)',
      'Place ton ordre d\'achat',
      'Surveille ta position'
    ],
    continueButtonText: 'Analyser AAPL'
  },
  {
    type: 'explanation',
    stockyEmotion: 'thinking',
    title: 'Analyse d\'AAPL',
    speechBubbleText: 'Regarde: la tendance est montante 📈, le volume est bon, le spread est serré. C\'est un bon moment pour acheter!',
    keyPoints: [
      '✓ Tendance: Montante',
      '✓ Volume: Élevé (confirmation)',
      '✓ Spread: Serré (liquide)',
      '→ Décision: ACHETER'
    ],
    continueButtonText: 'Placer l\'ordre'
  },
  {
    type: 'multiple_choice',
    question: 'Combien d\'actions AAPL veux-tu acheter? (Prix actuel: $150)',
    options: [
      {
        id: 'a',
        text: '10 actions ($1,500)',
        isCorrect: true
      },
      {
        id: 'b',
        text: '100 actions ($15,000)',
        isCorrect: false
      },
      {
        id: 'c',
        text: '1 action ($150)',
        isCorrect: false
      },
      {
        id: 'd',
        text: '1000 actions ($150,000)',
        isCorrect: false
      }
    ],
    explanation: 'Pour un premier trade, 10 actions est un bon montant pour apprendre sans trop de risque!',
    correctFeedback: 'Parfait! 10 actions, c\'est un bon début! 💪',
    incorrectFeedback: 'Pour un premier trade, 10 actions est un bon montant pour apprendre.'
  },
  {
    type: 'explanation',
    stockyEmotion: 'celebrating',
    title: 'Ordre Exécuté!',
    speechBubbleText: 'Félicitations! Tu as acheté 10 actions AAPL à $150! Ta position est maintenant ouverte! 🎉',
    keyPoints: [
      '✓ Ordre exécuté à $150',
      '✓ 10 actions achetées',
      '✓ Position ouverte',
      '→ Surveille maintenant le prix!'
    ],
    continueButtonText: 'Surveiller la position'
  },
  {
    type: 'explanation',
    stockyEmotion: 'excited',
    title: 'Profit Réalisé!',
    speechBubbleText: 'Le prix est monté à $152! Tu peux vendre maintenant et réaliser un profit de $20! (10 actions × $2 de profit)',
    keyPoints: [
      'Prix d\'achat: $150',
      'Prix actuel: $152',
      'Profit: $2 par action',
      'Profit total: $20'
    ],
    continueButtonText: 'Vendre et clôturer'
  },
  {
    type: 'multiple_choice',
    question: 'Que dois-tu faire maintenant?',
    options: [
      {
        id: 'a',
        text: 'Vendre pour réaliser le profit',
        isCorrect: true
      },
      {
        id: 'b',
        text: 'Attendre encore',
        isCorrect: false
      },
      {
        id: 'c',
        text: 'Acheter plus',
        isCorrect: false
      },
      {
        id: 'd',
        text: 'Rien',
        isCorrect: false
      }
    ],
    explanation: 'Quand tu as un profit, c\'est souvent une bonne idée de vendre et de réaliser ce profit!',
    correctFeedback: 'Exactement! Vendre pour réaliser le profit! 💰',
    incorrectFeedback: 'Quand tu as un profit, tu devrais vendre pour le réaliser.'
  },
  {
    type: 'completion',
    stockyEmotion: 'celebrating',
    speechBubble: '🎊 INCROYABLE! Tu as fait ton premier trade profitable! Tu es maintenant un vrai trader! 🚀',
    summary: {
      correctAnswers: 2,
      totalQuestions: 2,
      xpEarned: 20,
      coinsEarned: 15
    }
  }
];

// Helper function to convert to JSONB format
export function lessonContentToJSONB(content: LessonContent[]): any {
  return content;
}

// Export all lessons data for seeding
export const lessons1to10Data = [
  {
    module_id: 1,
    day_number: 1,
    lesson_number: 1.1,
    title: 'Qu\'est-ce que le Trading d\'Actions?',
    description: 'Découvre les bases de l\'achat et de la vente d\'actions',
    lesson_type: 'mixed',
    content_json: lessonContentToJSONB(lesson1Content),
    min_score_to_pass: 70,
    xp_reward: 10,
    coin_reward: 5,
    is_locked: false,
    unlock_requirement: null,
    estimated_duration_minutes: 5,
    level: 'beginner',
    order_index: 1
  },
  {
    module_id: 1,
    day_number: 1,
    lesson_number: 1.2,
    title: 'Comprendre les Actions',
    description: 'Découvre ce que sont les actions et comment elles fonctionnent',
    lesson_type: 'mixed',
    content_json: lessonContentToJSONB(lesson2Content),
    min_score_to_pass: 70,
    xp_reward: 10,
    coin_reward: 5,
    is_locked: true,
    unlock_requirement: 'complete_lesson_1.1',
    estimated_duration_minutes: 5,
    level: 'beginner',
    order_index: 2
  },
  {
    module_id: 1,
    day_number: 1,
    lesson_number: 1.3,
    title: 'Comment Fonctionnent les Marchés Boursiers',
    description: 'Apprends comment les bourses fonctionnent et les heures de trading',
    lesson_type: 'mixed',
    content_json: lessonContentToJSONB(lesson3Content),
    min_score_to_pass: 70,
    xp_reward: 10,
    coin_reward: 5,
    is_locked: true,
    unlock_requirement: 'complete_lesson_1.2',
    estimated_duration_minutes: 6,
    level: 'beginner',
    order_index: 3
  },
  {
    module_id: 1,
    day_number: 1,
    lesson_number: 1.4,
    title: 'Lire les Prix des Actions',
    description: 'Apprends à lire et comprendre les stock quotes',
    lesson_type: 'mixed',
    content_json: lessonContentToJSONB(lesson4Content),
    min_score_to_pass: 70,
    xp_reward: 10,
    coin_reward: 5,
    is_locked: true,
    unlock_requirement: 'complete_lesson_1.3',
    estimated_duration_minutes: 6,
    level: 'beginner',
    order_index: 4
  },
  {
    module_id: 1,
    day_number: 2,
    lesson_number: 2.1,
    title: 'Market Orders vs Limit Orders',
    description: 'Comprends les différents types d\'ordres de trading',
    lesson_type: 'mixed',
    content_json: lessonContentToJSONB(lesson5Content),
    min_score_to_pass: 70,
    xp_reward: 10,
    coin_reward: 5,
    is_locked: true,
    unlock_requirement: 'complete_lesson_1.4',
    estimated_duration_minutes: 7,
    level: 'beginner',
    order_index: 5
  },
  {
    module_id: 1,
    day_number: 2,
    lesson_number: 2.2,
    title: 'Comprendre le Bid et l\'Ask',
    description: 'Apprends ce que sont le bid, l\'ask et le spread',
    lesson_type: 'mixed',
    content_json: lessonContentToJSONB(lesson6Content),
    min_score_to_pass: 70,
    xp_reward: 10,
    coin_reward: 5,
    is_locked: true,
    unlock_requirement: 'complete_lesson_2.1',
    estimated_duration_minutes: 6,
    level: 'beginner',
    order_index: 6
  },
  {
    module_id: 1,
    day_number: 2,
    lesson_number: 2.3,
    title: 'Introduction aux Graphiques Boursiers',
    description: 'Découvre comment lire et comprendre les graphiques',
    lesson_type: 'mixed',
    content_json: lessonContentToJSONB(lesson7Content),
    min_score_to_pass: 70,
    xp_reward: 10,
    coin_reward: 5,
    is_locked: true,
    unlock_requirement: 'complete_lesson_2.2',
    estimated_duration_minutes: 7,
    level: 'beginner',
    order_index: 7
  },
  {
    module_id: 1,
    day_number: 2,
    lesson_number: 2.4,
    title: 'Les Bases des Chandeliers',
    description: 'Apprends à lire les chandeliers japonais',
    lesson_type: 'mixed',
    content_json: lessonContentToJSONB(lesson8Content),
    min_score_to_pass: 70,
    xp_reward: 15,
    coin_reward: 10,
    is_locked: true,
    unlock_requirement: 'complete_lesson_2.3',
    estimated_duration_minutes: 8,
    level: 'beginner',
    order_index: 8
  },
  {
    module_id: 1,
    day_number: 2,
    lesson_number: 2.5,
    title: 'Analyse du Volume',
    description: 'Comprends l\'importance du volume dans le trading',
    lesson_type: 'mixed',
    content_json: lessonContentToJSONB(lesson9Content),
    min_score_to_pass: 70,
    xp_reward: 10,
    coin_reward: 5,
    is_locked: true,
    unlock_requirement: 'complete_lesson_2.4',
    estimated_duration_minutes: 6,
    level: 'beginner',
    order_index: 9
  },
  {
    module_id: 1,
    day_number: 2,
    lesson_number: 2.6,
    title: 'Ton Premier Trade Pratique',
    description: 'Fais ton premier trade simulé avec AAPL',
    lesson_type: 'mixed',
    content_json: lessonContentToJSONB(lesson10Content),
    min_score_to_pass: 70,
    xp_reward: 20,
    coin_reward: 15,
    is_locked: true,
    unlock_requirement: 'complete_lesson_2.5',
    estimated_duration_minutes: 10,
    level: 'beginner',
    order_index: 10
  }
];

