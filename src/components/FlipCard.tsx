import React from 'react';
import { StudyCard } from '../types';
import { motion } from 'motion/react';

interface FlipCardProps {
  card: StudyCard;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlipCard({ card, isFlipped, onFlip }: FlipCardProps) {
  const level =
    card.levels.find(l => l.level_index === card.activeLevel) ??
    card.levels[0];

  const frontText = level?.content?.question || card.title || '…';
  const backText = level?.content?.answer || '…';

  return (
    <div className="flipcard-container">
      <motion.div className="flipcard" onClick={onFlip} style={{ perspective: 1000 }}>
        <motion.div
          className="flipcard__inner"
          initial={false}
          animate={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <div className="flipcard__side flipcard__front">
            <p className="flipcard__text">{frontText}</p>
            <div className="flipcard__hint">Нажмите, чтобы увидеть ответ</div>
          </div>

          <div className="flipcard__side flipcard__back">
            <p className="flipcard__text">{backText}</p>
            <div className="flipcard__hint">
              Уровень {card.activeLevel + 1} из {card.levels.length}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
