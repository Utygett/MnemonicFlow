import React, { useEffect, useMemo, useState } from 'react';
import type { DeckSummary } from '../types';
import { ApiClient } from '../api/client';
import { Input } from '../components/Input';
import { Button } from '../components/Button/Button';
import { LevelIndicator } from '../components/LevelIndicator';
import { X, Plus, Trash2 } from 'lucide-react';

type LevelQA = { question: string; answer: string };
type CardSummary = {
  card_id: string;
  title: string;
  type: string;
  levels?: Array<{ level_index: number; content: any }>;
};

interface Props {
  decks: DeckSummary[];
  onCancel: () => void;
  onDone: () => void;
}

export function EditCardFlow({ decks, onCancel, onDone }: Props) {
  const defaultDeckId = useMemo(() => decks?.[0]?.deck_id ?? '', [decks]);
  const [deckId, setDeckId] = useState(defaultDeckId);

  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<CardSummary[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>('');

  const selectedCard = useMemo(
    () => cards.find(c => c.card_id === selectedCardId) || null,
    [cards, selectedCardId]
  );

  const [activeLevel, setActiveLevel] = useState(0);
  const [levels, setLevels] = useState<LevelQA[]>([{ question: '', answer: '' }]);

  // загрузка карточек колоды
  useEffect(() => {
    if (!deckId) return;

    (async () => {
      setLoading(true);
      try {
        const data = await ApiClient.getDeckWithCards(deckId); // DeckWithCards[]
        const deck = data?.[0];
        setCards(deck?.cards ?? []);
        setSelectedCardId('');
      } finally {
        setLoading(false);
      }
    })();
  }, [deckId]);

  // когда выбрали карточку — заполняем уровни
  useEffect(() => {
    if (!selectedCard) return;

    const sorted = [...(selectedCard.levels ?? [])].sort((a, b) => a.level_index - b.level_index);
    const mapped: LevelQA[] =
      sorted.length > 0
        ? sorted.map(l => ({
            question: String(l.content?.question ?? ''),
            answer: String(l.content?.answer ?? ''),
          }))
        : [{ question: '', answer: '' }];

    setLevels(mapped);
    setActiveLevel(0);
  }, [selectedCardId]);

  const patchLevel = (index: number, patch: Partial<LevelQA>) => {
    const next = [...levels];
    next[index] = { ...next[index], ...patch };
    setLevels(next);
  };

  const addLevel = () => {
    if (levels.length >= 10) return;
    setLevels(prev => [...prev, { question: '', answer: '' }]);
    setActiveLevel(levels.length);
  };

  const removeLevel = (index: number) => {
    if (levels.length <= 1) return;
    const next = levels.filter((_, i) => i !== index);
    setLevels(next);
    if (activeLevel >= next.length) setActiveLevel(next.length - 1);
  };

  const canSave = selectedCard && levels.some(l => l.question.trim() && l.answer.trim());

  const save = async () => {
    if (!selectedCard) return;

    const cleaned = levels
      .map(l => ({ question: l.question.trim(), answer: l.answer.trim() }))
      .filter(l => l.question && l.answer);

    // 1) удалить старые уровни (только существующие индексы)
    const oldIndices = (selectedCard.levels ?? []).map(l => l.level_index);
    await Promise.all(oldIndices.map(i => ApiClient.deleteCardLevel(selectedCard.card_id, i)));

    // 2) создать новые уровни подряд 0..N-1
    await Promise.all(
      cleaned.map((lvl, i) => ApiClient.upsertCardLevel(selectedCard.card_id, i, lvl))
    );

    // 3) синхронизировать max_level
    await ApiClient.updateCardMaxLevel(selectedCard.card_id, cleaned.length);

    onDone();
  };

  return (
    <div className="min-h-screen bg-dark pb-24">
      <div className="page__header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
        <div className="page__header-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={onCancel} style={{ color: '#9CA3AF', background: 'transparent', border: 0 }}>
              <X size={24} />
            </button>
            <h2 style={{ color: '#E8EAF0' }}>Редактирование уровней</h2>
            <div style={{ width: 24 }} />
          </div>
        </div>
      </div>

      <main className="container-centered max-w-390 space-y-6 py-6">
        {/* Deck */}
        <div className="form-row">
          <label className="form-label">Колода</label>
          <select value={deckId} onChange={(e) => setDeckId(e.target.value)} className="input">
            {decks.map(d => (
              <option key={d.deck_id} value={d.deck_id}>{d.title}</option>
            ))}
          </select>
        </div>

        {/* Card */}
        <div className="form-row">
          <label className="form-label">Карточка</label>
          <select
            value={selectedCardId}
            onChange={(e) => setSelectedCardId(e.target.value)}
            className="input"
            disabled={loading || cards.length === 0}
          >
            <option value="">{loading ? 'Загрузка…' : 'Выбери карточку'}</option>
            {cards.map(c => (
              <option key={c.card_id} value={c.card_id}>{c.title}</option>
            ))}
          </select>
        </div>

        {!selectedCard ? null : (
          <>
            {/* Tabs уровней */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.875rem', color: '#E8EAF0' }}>
                  Уровни ({levels.length})
                </label>
                {levels.length < 10 && (
                  <button onClick={addLevel} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4A6FA5', background: 'transparent', border: 0 }}>
                    <Plus size={16} />
                    Добавить уровень
                  </button>
                )}
              </div>

              <div className="level-tabs">
                {levels.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveLevel(index)}
                    className={`level-tab ${activeLevel === index ? 'level-tab--active' : 'level-tab--inactive'}`}
                  >
                    <span style={{ fontSize: '0.875rem' }}>Уровень {index + 1}</span>
                  </button>
                ))}
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <LevelIndicator currentLevel={Math.min(activeLevel, 3) as 0 | 1 | 2 | 3} size="small" />
                    {levels.length > 1 && (
                      <button onClick={() => removeLevel(activeLevel)} style={{ color: '#E53E3E', padding: 4, background: 'transparent', border: 0 }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <Input
                  value={levels[activeLevel].question}
                  onChange={(v) => patchLevel(activeLevel, { question: v })}
                  label={`Вопрос (уровень ${activeLevel + 1})`}
                  multiline
                  rows={3}
                />
                <Input
                  value={levels[activeLevel].answer}
                  onChange={(v) => patchLevel(activeLevel, { answer: v })}
                  label={`Ответ (уровень ${activeLevel + 1})`}
                  multiline
                  rows={5}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem' }}>
              <Button onClick={onCancel} variant="secondary" size="large" fullWidth>
                Отмена
              </Button>
              <Button onClick={save} variant="primary" size="large" fullWidth disabled={!canSave}>
                Сохранить
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
