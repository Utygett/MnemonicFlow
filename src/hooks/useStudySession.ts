import { useState, useEffect, useCallback } from 'react';
import { StudyCard, DifficultyRating } from '../types';
import { ApiClient } from '../api/client';

export function useStudySession(cards: StudyCard[]) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const isCompleted = cards.length > 0 && currentIndex >= cards.length;

  const currentCard = cards[currentIndex] || null;

  const rateCard = (rating: DifficultyRating) => {
    if (!currentCard) return;
    // логика рейтинга
  };

  const resetSession = () => setCurrentIndex(0);

  return { cards, currentIndex, currentCard, isCompleted, rateCard, resetSession };
}

