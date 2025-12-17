import { useState, useEffect, useCallback } from 'react';
import { StudyCard, DifficultyRating } from '../types';
import { ApiClient } from '../api/client';

export function useStudySession(deckCards: StudyCard[] | null) {
  const [cards, setCards] = useState<StudyCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (deckCards && deckCards.length > 0) {
      setCards(deckCards);
      setCurrentIndex(0);
    }
  }, [deckCards]);

  const currentCard = cards[currentIndex] || null;
  const isCompleted = currentIndex >= cards.length;

  const rateCard = async (rating: DifficultyRating) => {
    if (!currentCard) return;
    try {
      await ApiClient.reviewCard(currentCard.id, rating);
    } catch (err) {
      console.error('Failed to send rating:', err);
    }
    setCurrentIndex(prev => prev + 1);
  };

  const resetSession = () => setCurrentIndex(0);

  return { cards, currentIndex, currentCard, isCompleted, rateCard, resetSession };
}


