import { useState, useEffect, useMemo, useRef } from 'react';
import { StudyCard, DifficultyRating } from '../types';
import { ApiClient } from '../api/client';

export function useStudySession(deckCards: StudyCard[] | null) {
  const [cards, setCards] = useState<StudyCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Сигнатура очереди: зависит только от id и порядка, а не от activeLevel/levels
  const queueSig = useMemo(() => {
    if (!deckCards || deckCards.length === 0) return '';
    return deckCards.map(c => c.id).join('|');
  }, [deckCards]);

  const prevQueueSigRef = useRef<string>('');

  useEffect(() => {
    // Всегда синкаем cards, чтобы UI видел актуальные activeLevel/levels
    setCards(deckCards ?? []);

    const prevSig = prevQueueSigRef.current;
    prevQueueSigRef.current = queueSig;

    // Первичная загрузка очереди: сбрасываем на 0
    if (prevSig === '' && queueSig !== '') {
      setCurrentIndex(0);
      return;
    }

    // Если очередь реально изменилась (другая колода/другая сессия) — сброс
    if (prevSig !== '' && prevSig !== queueSig) {
      setCurrentIndex(0);
      return;
    }

    // Иначе (та же очередь, просто обновились поля карточек) — индекс сохраняем
  }, [deckCards, queueSig]);

  const currentCard = cards[currentIndex] || null;
  const isCompleted = cards.length > 0 && currentIndex >= cards.length;

  const rateCard = async (rating: DifficultyRating) => {
    const card = currentCard;
    if (!card) return;

    try {
      await ApiClient.reviewCard(card.id, rating);
    } catch (err) {
      console.error('Failed to send rating:', err);
    }

    setCurrentIndex(prev => prev + 1);
  };

  const resetSession = () => setCurrentIndex(0);

  return { cards, currentIndex, currentCard, isCompleted, rateCard, resetSession };
}
