export enum CardType {
  Flashcard = 'flashcard',
  Cloze = 'cloze',
  MultipleChoice = 'multiple-choice'
}

export interface CardLevel {
  level_index: number;
  content: {
    question: string;
    answer: string;
  };
}

export interface StudyCard {
  id: string;
  title: string;
  levels: CardLevel[];
}

export interface Card {
  id: string;
  term: string;
  levels: string[]; // Динамический массив уровней (от 1 до неограниченного количества)
  currentLevel: number; // Текущий уровень (индекс в массиве)
  nextReview: Date;
  lastReviewed?: Date;
  streak: number;
  deckId: string;
  cardType: CardType;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  cardsCount: number;
  progress: number; // 0-100
  averageLevel: number; // 0-3
  color: string;
}

export interface StudySession {
  cards: Card[];
  currentIndex: number;
  correctCount: number;
  totalCount: number;
}

export interface Statistics {
  cardsStudiedToday: number;
  timeSpentToday: number; // minutes
  currentStreak: number; // days
  totalCards: number;
  weeklyActivity: number[]; // 7 days
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
}

export interface DeckSummary {
  deck_id: string;
  title: string;
}

export type DifficultyRating = 'again' | 'hard' | 'good' | 'easy';