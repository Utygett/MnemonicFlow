// src/api/client.ts
import { Card, Deck, Statistics, DifficultyRating, CardType } from '../types';
import { DeckSummary } from '../types';


export class ApiClient {
  static API_BASE_URL = 'http://localhost:8000';

  // Получаем колоды пользователя
  static async getUserDecks(token: string): Promise<DeckSummary[]> {
    const res = await fetch(`${this.API_BASE_URL}/decks/`, { // ✅ добавлен слеш
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to fetch user decks: ${text}`);
    }

    return res.json();
  }
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


  static async getDeckCards(deckId: string, token: string) {
    const res = await fetch(
      `${this.API_BASE_URL}/decks/${deckId}/cards`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to fetch deck cards: ${text}`);
    }

    return res.json();  
  }
  static async reviewCard(cardId: string, rating: DifficultyRating) {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('No auth token');

    const res = await fetch(
      `${this.API_BASE_URL}/cards/${cardId}/review`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    return res.json();
  }

  static async createCard(payload: {
  deck_id: string;
  title: string;
  type: string;
  levels: Array<{ question: string; answer: string }>;
}) {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No auth token');

  const res = await fetch(`${this.API_BASE_URL}/cards/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create card: ${text}`);
  }

  return res.json();
}

}
