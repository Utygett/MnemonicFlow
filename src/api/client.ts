// src/api/client.ts
import { Card, Deck, Statistics, DifficultyRating, CardType } from '../types';

const API_BASE_URL = 'http://localhost:8000'; // твой локальный сервер

export class ApiClient {
  // ------------------------
  // MOCK API для теста (Decks/Statistics/ReviewCards)
  // ------------------------
  static async getDecks(): Promise<Deck[]> {
    return [
      { id: '1', name: 'Колода 1', cards: [] },
      { id: '2', name: 'Колода 2', cards: [] },
    ];
  }

  static async getStatistics(): Promise<Statistics> {
    return {
      cardsStudiedToday: 5,
      timeSpentToday: 10,
      currentStreak: 2,
      totalCards: 20,
      weeklyActivity: [2, 4, 3, 5, 1, 0, 6],
      achievements: ['Первый успех', '10 карточек'],
    };
  }

  static async getReviewCards(deckId?: string, limit: number = 20) {
    return [
      { id: '1', term: 'React', definition: 'Библиотека для UI', deckId: '1', cardType: CardType.Flashcard, levels: 1 },
      { id: '2', term: 'JavaScript', definition: 'Язык программирования', deckId: '1', cardType: CardType.Flashcard, levels: 1 },
    ];
  }
}
