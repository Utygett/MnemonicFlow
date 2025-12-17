import React, { useState } from 'react';
import { StudyCard, DifficultyRating } from '../types';
import { FlipCard } from '../components/FlipCard';
import { RatingButton } from '../components/RatingButton';
import { Button } from '../components/Button/Button';
import { ProgressBar } from '../components/ProgressBar';
import { X, ArrowUp } from 'lucide-react';

interface StudySessionProps {
  cards: StudyCard[];
  currentIndex: number;
  onRate: (rating: DifficultyRating) => void;
  onLevelUp: () => void;
  onClose: () => void;
}

export function StudySession({ cards, currentIndex, onRate, onClose }: StudySessionProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const currentCard = cards[currentIndex];
  if (!currentCard) {
    return (
      <div className="study-page flex items-center justify-center">
        <div className="text-muted">Карточки закончились</div>
      </div>
    );
  }
  const progress = ((currentIndex) / cards.length) * 100;
  const canLevelUp = false; // Проверяем по длине массива
  
  const handleRate = (rating: DifficultyRating) => {
    setIsFlipped(false);
    setTimeout(() => {
      onRate(rating);
    }, 300);
  };
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  if (!currentCard) {
    return null;
  }
  
  return (
    <div className="study-page">
      {/* Header */}
      <div className="page__header py-4">
  <div className="page__header-inner">
          <div className="flex justify-between items-center mb-4">
            <button onClick={onClose} className="text-muted">
              <X size={24} />
            </button>
            <span className="text-sm text-muted">
              {currentIndex + 1} / {cards.length}
            </span>
          </div>
          <ProgressBar progress={progress} color="#FF9A76" />
        </div>
      </div>
      
      {/* Card Area */}
      <div className="study__card-area">
        <FlipCard
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />
      </div>
      
      {/* Actions */}
  <div className="study__actions">
        {!isFlipped ? (
          <Button onClick={handleFlip} variant="primary" size="large" fullWidth>
            Показать ответ
          </Button>
        ) : (
          <div className="study__actions-inner">
            {/* Level Up Button */}
            {/* {canLevelUp && (
              <Button
                onClick={handleLevelUp}
                variant="secondary"
                size="medium"
                fullWidth
                className="btn--centered"
              >
                <ArrowUp size={20} />
                Попробовать сложнее
              </Button>
            )} */}
            
            {/* Rating Buttons */}
            <div className="rating-row">
              <RatingButton
                rating="again"
                label="Снова"
                onClick={() => handleRate('again')}
              />
              <RatingButton
                rating="hard"
                label="Трудно"
                onClick={() => handleRate('hard')}
              />
              <RatingButton
                rating="good"
                label="Хорошо"
                onClick={() => handleRate('good')}
              />
              <RatingButton
                rating="easy"
                label="Легко"
                onClick={() => handleRate('easy')}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}