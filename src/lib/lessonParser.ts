// @ts-nocheck
/**
 * Parser pour transformer le contenu HTML statique en micro-leçons interactives
 * Divise le contenu en étapes avec des opportunités d'interaction
 */

export interface LessonStep {
  id: string;
  type: 'content' | 'concept' | 'interactive' | 'quiz' | 'summary';
  title?: string;
  content: string;
  interaction?: {
    type: 'reveal' | 'choice' | 'input';
    data?: any;
  };
  metadata?: {
    duration?: number;
    keyPoints?: string[];
  };
}

/**
 * Parse le contenu HTML et le divise en étapes interactives
 */
export function parseLessonContent(htmlContent: string): LessonStep[] {
  const steps: LessonStep[] = [];
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  let stepIndex = 0;

  // Extraire les sections principales (h2, h3)
  const sections = extractSections(tempDiv);
  
  sections.forEach((section, index) => {
    // Chaque section principale devient une étape
    if (section.title) {
      // Vérifier si la section contient des listes importantes
      const lists = section.element.querySelectorAll('ul, ol');
      const importantLists: HTMLElement[] = [];
      
      lists.forEach((list) => {
        if (containsImportantContent(list) && list.querySelectorAll('li').length <= 6) {
          importantLists.push(list as HTMLElement);
        }
      });

      // Si on a des listes importantes, créer des étapes séparées
      if (importantLists.length > 0) {
        // Étape de contenu principal (sans les listes)
        const contentWithoutLists = section.content;
        const hasOtherContent = Array.from(section.element.children).some(
          (child) => !importantLists.includes(child as HTMLElement) && child.tagName !== 'H2' && child.tagName !== 'H3'
        );
        
        if (hasOtherContent) {
          const contentDiv = document.createElement('div');
          Array.from(section.element.children).forEach((child) => {
            if (!importantLists.includes(child as HTMLElement) && child.tagName !== 'H2' && child.tagName !== 'H3') {
              contentDiv.appendChild(child.cloneNode(true));
            }
          });
          
          if (contentDiv.innerHTML.trim()) {
            steps.push({
              id: `step-${stepIndex++}`,
              type: 'content',
              title: section.title,
              content: contentDiv.innerHTML,
              metadata: {
                keyPoints: extractKeyPoints(contentDiv.innerHTML),
              },
            });
          }
        }

        // Créer des étapes interactives pour chaque liste
        importantLists.forEach((list) => {
          const items = Array.from(list.querySelectorAll('li'));
          if (items.length > 0) {
            steps.push({
              id: `step-${stepIndex++}`,
              type: 'interactive',
              title: extractListTitle(list) || section.title,
              content: list.outerHTML,
              interaction: {
                type: 'reveal',
                data: {
                  items: items.map((li) => ({
                    label: extractListItemText(li),
                    revealed: false,
                  })),
                },
              },
            });
          }
        });
      } else {
        // Pas de listes importantes, étape de contenu simple
        steps.push({
          id: `step-${stepIndex++}`,
          type: 'content',
          title: section.title,
          content: section.content,
          metadata: {
            keyPoints: extractKeyPoints(section.content),
          },
        });
      }
    } else if (section.content.trim()) {
      // Section sans titre mais avec contenu
      steps.push({
        id: `step-${stepIndex++}`,
        type: 'content',
        content: section.content,
      });
    }
  });

  // Si aucune étape n'a été créée, créer une étape par défaut
  if (steps.length === 0) {
    steps.push({
      id: 'step-0',
      type: 'content',
      content: htmlContent,
    });
  }

  // Calculer les durées estimées
  steps.forEach((step) => {
    if (!step.metadata) {
      step.metadata = {};
    }
    step.metadata.duration = Math.round(estimateStepDuration(step));
  });

  return steps;
}

interface Section {
  title?: string;
  content: string;
  element: HTMLElement;
}

function extractSections(container: HTMLElement): Section[] {
  const sections: Section[] = [];
  const children = Array.from(container.children) as HTMLElement[];

  let currentSection: Section | null = null;

  children.forEach((child) => {
    const tagName = child.tagName.toLowerCase();

    if (tagName === 'h2' || tagName === 'h3') {
      // Nouvelle section
      if (currentSection) {
        sections.push(currentSection);
      }
      // Créer un conteneur pour cette section
      const sectionContainer = document.createElement('div');
      sectionContainer.appendChild(child.cloneNode(true));
      currentSection = {
        title: child.textContent?.trim() || undefined,
        content: '',
        element: sectionContainer,
      };
    } else if (currentSection) {
      // Ajouter au contenu de la section actuelle
      currentSection.content += child.outerHTML;
      currentSection.element.appendChild(child.cloneNode(true));
    } else {
      // Créer une section sans titre
      const sectionContainer = document.createElement('div');
      sectionContainer.appendChild(child.cloneNode(true));
      currentSection = {
        content: child.outerHTML,
        element: sectionContainer,
      };
    }
  });

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

function extractKeyPoints(content: string): string[] {
  const keyPoints: string[] = [];
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  // Extraire les éléments <strong> et les listes
  const strongElements = tempDiv.querySelectorAll('strong');
  strongElements.forEach((el) => {
    const text = el.textContent?.trim();
    if (text && text.length < 100) {
      keyPoints.push(text);
    }
  });

  return keyPoints.slice(0, 5); // Limiter à 5 points clés
}

function containsImportantContent(list: HTMLElement): boolean {
  // Considérer une liste importante si elle contient des éléments <strong> ou <em>
  return list.querySelectorAll('strong, em').length > 0;
}

function extractListTitle(list: HTMLElement): string {
  // Chercher un titre avant la liste
  let prev = list.previousElementSibling;
  while (prev) {
    if (prev.tagName.match(/^H[1-6]$/)) {
      return prev.textContent?.trim() || 'Points importants';
    }
    prev = prev.previousElementSibling;
  }
  return 'Points importants';
}

function extractListItemText(li: HTMLElement): string {
  // Extraire le texte sans les balises HTML internes complexes
  const clone = li.cloneNode(true) as HTMLElement;
  // Garder les balises strong/em mais simplifier
  return clone.textContent?.trim() || '';
}

/**
 * Estime la durée d'une étape en secondes
 */
export function estimateStepDuration(step: LessonStep): number {
  const wordCount = step.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readingSpeed = 200; // mots par minute
  const baseTime = (wordCount / readingSpeed) * 60;
  
  if (step.interaction) {
    return baseTime + 10; // +10s pour l'interaction
  }
  
  return Math.max(30, baseTime); // Minimum 30 secondes
}

