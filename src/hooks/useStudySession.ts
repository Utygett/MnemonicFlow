import { useState, useEffect, useCallback } from 'react';
import { Card, DifficultyRating } from '../types';
import { ApiClient } from '../api/client';

interface StudySessionState {
  cards: Card[];
  currentIndex: number;
  correctCount: number;
  totalCount: number;
}

export function useStudySession(deckId?: string) {
  const [session, setSession] = useState<StudySessionState>({
    cards: [],
    currentIndex: 0,
    correctCount: 0,
    totalCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const cards = await ApiClient.getReviewCards(deckId, 10);
      
      setSession({
        cards,
        currentIndex: 0,
        correctCount: 0,
        totalCount: cards.length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cards');
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const rateCard = useCallback(async (rating: DifficultyRating) => {
    if (session.cards.length === 0) return;

    const currentCard = session.cards[session.currentIndex];
    
    try {
      await ApiClient.reviewCard(currentCard.id, rating);
      
      const isCorrect = rating !== 'again';
      const newIndex = session.currentIndex + 1;
      
      if (newIndex < session.cards.length) {
        setSession(prev => ({
          ...prev,
          currentIndex: newIndex,
          correctCount: prev.correctCount + (isCorrect ? 1 : 0),
        }));
      } else {
        setSession(prev => ({
          ...prev,
          currentIndex: prev.currentIndex + 1,
          correctCount: prev.correctCount + (isCorrect ? 1 : 0),
        }));
      }
    } catch (err) {
      console.error('Failed to rate card:', err);
      const newIndex = session.currentIndex + 1;
      if (newIndex < session.cards.length) {
        setSession(prev => ({
          ...prev,
          currentIndex: newIndex,
        }));
      }
    }
  }, [session]);

  const resetSession = useCallback(() => {
    setSession({
      cards: [],
      currentIndex: 0,
      correctCount: 0,
      totalCount: 0,
    });
    loadCards();
  }, [loadCards]);

  const currentCard = session.cards[session.currentIndex];
  const isCompleted = session.currentIndex >= session.cards.length;

const levelUpCard = useCallback(async () => {
  if (session.cards.length === 0) return;

  const currentCard = session.cards[session.currentIndex];

  // 1️⃣ Проверка на максимум
  if (currentCard.currentLevel >= currentCard.levels.length - 1) return;

  // 2️⃣ Увеличиваем локально уровень
  const updatedCard = {
    ...currentCard,
    currentLevel: currentCard.currentLevel + 1,
  };

  // 3️⃣ Обновляем массив карточек
  setSession(prev => {
    const newCards = [...prev.cards];
    newCards[prev.currentIndex] = updatedCard;
    return {
      ...prev,
      cards: newCards,
    };
  });

  // 4️⃣ Отправляем на сервер (если нужно)
  try {
    await ApiClient.levelUpCard(currentCard.id);
  } catch (err) {
    console.error('Failed to level up card:', err);
  }
}, [session]);




  return {
    session,
    currentCard,
    isCompleted,
    loading,
    error,
    rateCard,
    levelUpCard,
    resetSession,
    progress: session.totalCount > 0 
      ? Math.round((session.currentIndex / session.totalCount) * 100) 
      : 0,
  };
}
