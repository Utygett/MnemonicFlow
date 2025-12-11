import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { LevelIndicator } from '../components/LevelIndicator';
import { X, Plus, Trash2 } from 'lucide-react';

interface CreateCardProps {
  onSave: (cardData: any) => void;
  onCancel: () => void;
}

export function CreateCard({ onSave, onCancel }: CreateCardProps) {
  const [term, setTerm] = useState('');
  const [activeLevel, setActiveLevel] = useState(0);
  const [levels, setLevels] = useState<string[]>(['']); // Начинаем с одного уровня
  
  const levelDescriptions = [
    'Простое определение',
    'Развернутое определение',
    'Контекстный вопрос',
    'Сложная задача',
    'Применение на практике',
    'Анализ и синтез',
    'Критическое мышление',
    'Экспертный уровень',
    'Мастерство',
    'Инновации',
  ];
  
  const handleAddLevel = () => {
    if (levels.length < 10) {
      setLevels([...levels, '']);
      setActiveLevel(levels.length);
    }
  };
  
  const handleRemoveLevel = (index: number) => {
    if (levels.length > 1) {
      const newLevels = levels.filter((_, i) => i !== index);
      setLevels(newLevels);
      if (activeLevel >= newLevels.length) {
        setActiveLevel(newLevels.length - 1);
      }
    }
  };
  
  const handleLevelChange = (index: number, value: string) => {
    const newLevels = [...levels];
    newLevels[index] = value;
    setLevels(newLevels);
  };
  
  const handleSave = () => {
    // Проверяем, что хотя бы первый уровень заполнен
    if (term && levels[0]) {
      onSave({ term, levels: levels.filter(l => l.trim() !== '') });
    }
  };
  
  return (
    <div className="min-h-screen bg-[#1A1F2E] pb-24">
      {/* Header */}
      <div className="bg-[#252B3D] px-4 pt-12 pb-4 shadow-sm sticky top-0 z-10 border-b border-[#2D3548]">
        <div className="max-w-[390px] mx-auto">
          <div className="flex justify-between items-center">
            <button onClick={onCancel} className="text-[#9CA3AF]">
              <X size={24} />
            </button>
            <h2 className="text-[#E8EAF0]">Новая карточка</h2>
            <div className="w-6" />
          </div>
        </div>
      </div>
      
      <div className="px-4 py-6 max-w-[390px] mx-auto space-y-6">
        {/* Term Input */}
        <Input
          value={term}
          onChange={setTerm}
          label="Термин / Вопрос"
          placeholder="Например: Фотосинтез"
        />
        
        {/* Level Tabs */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm text-[#E8EAF0]">
              Уровни сложности ({levels.length})
            </label>
            {levels.length < 10 && (
              <button
                onClick={handleAddLevel}
                className="flex items-center gap-1 text-[#4A6FA5] text-sm"
              >
                <Plus size={16} />
                Добавить уровень
              </button>
            )}
          </div>
          
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {levels.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveLevel(index)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg transition-colors ${
                  activeLevel === index
                    ? 'bg-[#4A6FA5] text-white'
                    : 'bg-[#252B3D] text-[#9CA3AF] border-2 border-[#2D3548]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">Уровень {index + 1}</span>
                </div>
              </button>
            ))}
          </div>
          
          {/* Level Content */}
          <div className="bg-[#252B3D] rounded-xl p-4 space-y-4 border border-[#2D3548]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <span className="text-sm text-[#9CA3AF]">
                  {levelDescriptions[activeLevel] || `Уровень ${activeLevel + 1}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <LevelIndicator currentLevel={activeLevel} size="small" />
                {levels.length > 1 && (
                  <button
                    onClick={() => handleRemoveLevel(activeLevel)}
                    className="text-[#E53E3E] p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <Input
              value={levels[activeLevel]}
              onChange={(value) => handleLevelChange(activeLevel, value)}
              placeholder={`Введите содержание для уровня ${activeLevel + 1}`}
              multiline
              rows={5}
            />
          </div>
        </div>
        
        {/* Preview */}
        <div>
          <label className="block mb-3 text-sm text-[#E8EAF0]">
            Предпросмотр
          </label>
          <div className="bg-[#252B3D] rounded-xl p-6 shadow-sm min-h-[150px] flex flex-col items-center justify-center border border-[#2D3548]">
            {term ? (
              <>
                <LevelIndicator currentLevel={0} size="medium" />
                <p className="mt-4 text-center text-lg text-[#E8EAF0]">{term}</p>
                {levels[0] && (
                  <p className="mt-2 text-center text-sm text-[#9CA3AF]">
                    {levels[0].substring(0, 50)}{levels[0].length > 50 ? '...' : ''}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-[#9CA3AF]">
                    {levels.filter(l => l.trim() !== '').length} уровней
                  </span>
                </div>
              </>
            ) : (
              <p className="text-[#9CA3AF] text-sm">
                Предпросмотр появится после заполнения
              </p>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button onClick={onCancel} variant="secondary" size="large" fullWidth>
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            variant="primary"
            size="large"
            fullWidth
            disabled={!term || !levels[0]}
          >
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
}
