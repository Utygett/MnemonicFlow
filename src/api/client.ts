import { Card, Deck, Statistics, DifficultyRating, CardType } from '../types';

const API_BASE_URL = 'http://localhost:8000';

export class ApiClient {
  static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      if (response.status === 204 || options.method === 'DELETE') {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  static async getCards(deckId?: string): Promise<Card[]> {
    const endpoint = deckId ? `/api/cards?deck_id=${deckId}` : '/api/cards';
    return this.request<Card[]>(endpoint);
  }

  static async getCard(cardId: string): Promise<Card> {
    return this.request<Card>(`/api/cards/${cardId}`);
  }

  static async createCard(cardData: any): Promise<Card> {
    return this.request<Card>('/api/cards', {
      method: 'POST',
      body: JSON.stringify(cardData),
    });
  }

  static async updateCard(cardId: string, cardData: Partial<Card>): Promise<Card> {
    return this.request<Card>(`/api/cards/${cardId}`, {
      method: 'PUT',
      body: JSON.stringify(cardData),
    });
  }

  static async deleteCard(cardId: string): Promise<void> {
    await this.request(`/api/cards/${cardId}`, {
      method: 'DELETE',
    });
  }

  static async reviewCard(cardId: string, rating: DifficultyRating): Promise<Card> {
    return this.request<Card>(`/api/cards/${cardId}/review`, {
      method: 'POST',
      body: JSON.stringify({ rating }),
    });
  }

  static async getDecks(): Promise<Deck[]> {
    return this.request<Deck[]>('/api/decks');
  }

  static async getDeck(deckId: string): Promise<Deck> {
    return this.request<Deck>(`/api/decks/${deckId}`);
  }

  static async createDeck(deckData: any): Promise<Deck> {
    return this.request<Deck>('/api/decks', {
      method: 'POST',
      body: JSON.stringify(deckData),
    });
  }

  static async updateDeck(deckId: string, deckData: Partial<Deck>): Promise<Deck> {
    return this.request<Deck>(`/api/decks/${deckId}`, {
      method: 'PUT',
      body: JSON.stringify(deckData),
    });
  }

  static async deleteDeck(deckId: string): Promise<void> {
    await this.request(`/api/decks/${deckId}`, {
      method: 'DELETE',
    });
  }

  static async getStatistics(): Promise<Statistics> {
    return this.request<Statistics>('/api/statistics');
  }

  static async updateStatistics(statistics: Partial<Statistics>): Promise<Statistics> {
    return this.request<Statistics>('/api/statistics', {
      method: 'PUT',
      body: JSON.stringify(statistics),
    });
  }

  static async getReviewCards(deckId?: string, limit: number = 20): Promise<Card[]> {
    const endpoint = deckId
      ? `/api/review-cards?deck_id=${deckId}&limit=${limit}`
      : `/api/review-cards?limit=${limit}`;
    return this.request<Card[]>(endpoint);
  }

  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/api/health');
  }
}
