import React, { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { InstallPrompt } from './components/InstallPrompt';
import { Dashboard } from './screens/Dashboard';
import { StudySession } from './screens/StudySession';
import { CreateCard } from './screens/CreateCard';
import { Statistics } from './screens/Statistics';
import { Onboarding } from './screens/Onboarding';
import { Card, Deck, Statistics as StatsType, DifficultyRating } from './types';

// Компонент для отображения обновлений PWA
function PWAUpdatePrompt() {
  const [showReload, setShowReload] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowReload(true);
                setWaitingWorker(newWorker);
              }
            });
          }
        });
      });

      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    setShowReload(false);
    window.location.reload();
  };

  if (!showReload) return null;

  return (
    <div className="fixed top-4 right-4 left-4 z-50 bg-[#252B3D] p-4 rounded-lg shadow-lg border border-[#2D3548] animate-slide-down">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-[#4A6FA5] rounded-full flex items-center justify-center">
            <span className="text-white text-sm">🔄</span>
          </div>
          <div>
            <p className="text-[#E8EAF0] font-medium">Доступно обновление!</p>
            <p className="text-[#9CA3AF] text-sm mt-1">
              Новая версия приложения загружена. Обновите для получения новых функций.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowReload(false)}
            className="px-4 py-2 text-sm font-medium text-[#9CA3AF] hover:text-[#E8EAF0] transition-colors"
          >
            Позже
          </button>
          <button
            onClick={reloadPage}
            className="px-4 py-2 bg-[#4A6FA5] text-white rounded-lg hover:bg-[#3A5A85] transition-colors text-sm font-medium flex-1 sm:flex-none"
          >
            Обновить
          </button>
        </div>
      </div>
    </div>
  );
}

// Компонент для отображения статуса офлайн-режима
function OfflineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-24 right-4 left-4 z-40 bg-[#FF9A76]/10 border border-[#FF9A76]/20 p-3 rounded-lg backdrop-blur-sm">
      <div className="flex items-center gap-2 text-sm">
        <div className="w-2 h-2 bg-[#FF9A76] rounded-full animate-pulse"></div>
        <span className="text-[#FF9A76]">Работаем в офлайн-режиме</span>
      </div>
    </div>
  );
}

export default function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'study' | 'stats' | 'profile'>('home');
  const [isStudying, setIsStudying] = useState(false);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  
  // Проверяем, было ли приложение установлено как PWA
  const [isPWA, setIsPWA] = useState(false);
  
  useEffect(() => {
    // Проверка на установку как PWA
    const checkPWA = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          window.navigator.standalone ||
          document.referrer.includes('android-app://')) {
        setIsPWA(true);
      }
    };
    
    checkPWA();
    
    // Регистрация Service Worker для PWA
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
      });
    }
  }, []);
  
  // Mock Data
  const [decks, setDecks] = useState<Deck[]>([
    {
      id: '1',
      name: 'Биология',
      description: 'Основные понятия биологии',
      cardsCount: 45,
      progress: 68,
      averageLevel: 1.5,
      color: '#4A6FA5',
    },
    {
      id: '2',
      name: 'История',
      description: 'Важные исторические события',
      cardsCount: 32,
      progress: 45,
      averageLevel: 1.2,
      color: '#FF9A76',
    },
    {
      id: '3',
      name: 'Программирование',
      description: 'Основы JavaScript',
      cardsCount: 56,
      progress: 82,
      averageLevel: 2.3,
      color: '#38A169',
    },
  ]);
  
  const [cards, setCards] = useState<Card[]>([
    {
      id: '1',
      term: 'Фотосинтез',
      levels: [
        'Процесс превращения света в энергию',
        'Процесс, при котором растения преобразуют световую энергию в химическую, создавая глюкозу из CO₂ и H₂O',
        'Объясните, почему фотосинтез важен для всей экосистемы планеты',
        'Сравните световую и темновую фазы фотосинтеза, укажите продукты каждой фазы',
      ],
      currentLevel: 1,
      nextReview: new Date(),
      streak: 3,
      deckId: '1',
    },
    {
      id: '2',
      term: 'Митоз',
      levels: [
        'Деление клетки',
        'Процесс деления соматических клеток, при котором из одной клетки образуются две идентичные',
        'В чем разница между митозом и мейозом?',
        'Опишите все фазы митоза и что происходит с хромосомами на каждом этапе',
      ],
      currentLevel: 0,
      nextReview: new Date(),
      streak: 1,
      deckId: '1',
    },
    {
      id: '3',
      term: 'ДНК',
      levels: [
        'Носитель генетической информации',
        'Дезоксирибонуклеиновая кислота - молекула, хранящая генетическую информацию',
        'Как структура ДНК связана с её функцией?',
        'Объясните процесс репликации ДНК и роль ферментов в этом процессе',
      ],
      currentLevel: 2,
      nextReview: new Date(),
      streak: 5,
      deckId: '1',
    },
  ]);
  
  const [statistics, setStatistics] = useState<StatsType>({
    cardsStudiedToday: 24,
    timeSpentToday: 35,
    currentStreak: 7,
    totalCards: 133,
    weeklyActivity: [15, 22, 18, 25, 20, 24, 19],
    achievements: [
      {
        id: '1',
        title: '7 дней',
        description: 'Недельная серия',
        icon: 'trophy',
        unlocked: true,
      },
      {
        id: '2',
        title: '100 карточек',
        description: 'Изучено 100 карточек',
        icon: 'target',
        unlocked: true,
      },
      {
        id: '3',
        title: 'Скорость',
        description: '50 карточек за день',
        icon: 'zap',
        unlocked: false,
      },
    ],
  });
  
  const handleStartStudy = () => {
    setIsStudying(true);
    setCurrentCardIndex(0);
  };
  
  const handleRate = (rating: DifficultyRating) => {
    // Update statistics
    setStatistics({
      ...statistics,
      cardsStudiedToday: statistics.cardsStudiedToday + 1,
    });
    
    // Move to next card
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // Session complete
      setIsStudying(false);
      setCurrentCardIndex(0);
    }
  };
  
  const handleLevelUp = () => {
    const currentCard = cards[currentCardIndex];
    if (currentCard.currentLevel < currentCard.levels.length - 1) {
      const updatedCards = cards.map((card) =>
        card.id === currentCard.id
          ? { ...card, currentLevel: card.currentLevel + 1 }
          : card
      );
      setCards(updatedCards);
    }
  };
  
  const handleCloseStudy = () => {
    setIsStudying(false);
    setCurrentCardIndex(0);
  };
  
  const handleSaveCard = (cardData: any) => {
    const newCard: Card = {
      id: Date.now().toString(),
      term: cardData.term,
      levels: cardData.levels,
      currentLevel: 0,
      nextReview: new Date(),
      streak: 0,
      deckId: '1',
    };
    setCards([...cards, newCard]);
    setIsCreatingCard(false);
  };
  
  const handleDeckClick = (deckId: string) => {
    // Filter cards for this deck and start study
    setIsStudying(true);
    setCurrentCardIndex(0);
  };
  
  if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={() => setHasCompletedOnboarding(true)} />;
  }
  
  if (isStudying) {
    return (
      <>
        <StudySession
          cards={cards}
          currentIndex={currentCardIndex}
          onRate={handleRate}
          onLevelUp={handleLevelUp}
          onClose={handleCloseStudy}
        />
        <PWAUpdatePrompt />
        <OfflineStatus />
      </>
    );
  }
  
  if (isCreatingCard) {
    return (
      <>
        <CreateCard
          onSave={handleSaveCard}
          onCancel={() => setIsCreatingCard(false)}
        />
        <PWAUpdatePrompt />
        <OfflineStatus />
      </>
    );
  }
  
  return (
    <div className="relative">
      {/* Уведомление об обновлении PWA */}
      <PWAUpdatePrompt />
      
      {/* Статус офлайн-режима */}
      <OfflineStatus />
      
      {/* PWA Badge (только если установлено как PWA) */}
      {isPWA && (
        <div className="fixed top-4 left-4 z-30">
          <div className="bg-[#4A6FA5]/20 text-[#4A6FA5] text-xs px-2 py-1 rounded-full border border-[#4A6FA5]/30">
            PWA
          </div>
        </div>
      )}
      
      {activeTab === 'home' && (
        <Dashboard
          statistics={statistics}
          decks={decks}
          onStartStudy={handleStartStudy}
          onDeckClick={handleDeckClick}
        />
      )}
      
      {activeTab === 'study' && (
        <div className="min-h-screen bg-[#1A1F2E] pb-24">
          <div className="bg-[#252B3D] px-4 pt-12 pb-6 shadow-sm border-b border-[#2D3548]">
            <div className="max-w-[390px] mx-auto">
              <h1 className="mb-6 text-[#E8EAF0]">Обучение</h1>
            </div>
          </div>
          <div className="px-4 py-6 max-w-[390px] mx-auto">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📖</div>
              <h2 className="mb-4 text-[#E8EAF0]">Создайте свою первую карточку</h2>
              <p className="text-[#9CA3AF] mb-6">
                Начните изучение с создания карточек
              </p>
              <button
                onClick={() => setIsCreatingCard(true)}
                className="bg-[#4A6FA5] text-white px-6 py-3 rounded-lg hover:bg-[#3A5A85] transition-colors"
              >
                Создать карточку
              </button>
              
              {/* PWA Installation Hint */}
              {!isPWA && (
                <div className="mt-8 p-4 bg-[#252B3D] rounded-lg border border-[#2D3548]">
                  <p className="text-sm text-[#9CA3AF] mb-2">
                    💡 Установите приложение для работы офлайн
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    Нажмите "Установить" в меню браузера
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'stats' && (
        <Statistics statistics={statistics} decks={decks} />
      )}
      
      {activeTab === 'profile' && (
        <div className="min-h-screen bg-[#1A1F2E] pb-24">
          <div className="bg-[#252B3D] px-4 pt-12 pb-6 shadow-sm border-b border-[#2D3548]">
            <div className="max-w-[390px] mx-auto">
              <h1 className="mb-6 text-[#E8EAF0]">Профиль</h1>
            </div>
          </div>
          <div className="px-4 py-6 max-w-[390px] mx-auto">
            <div className="bg-[#252B3D] rounded-xl p-6 text-center border border-[#2D3548]">
              <div className="w-24 h-24 bg-[#4A6FA5] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl">
                У
              </div>
              <h2 className="mb-2 text-[#E8EAF0]">Пользователь</h2>
              <p className="text-[#9CA3AF]">user@example.com</p>
              
              {/* PWA Status */}
              <div className="mt-6 pt-6 border-t border-[#2D3548]">
                <h3 className="text-sm font-medium text-[#E8EAF0] mb-3">Настройки приложения</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9CA3AF]">Версия</span>
                    <span className="text-sm text-[#E8EAF0]">1.0.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9CA3AF]">Режим</span>
                    <span className="text-sm text-[#4A6FA5]">
                      {isPWA ? 'Установлено как PWA' : 'Веб-версия'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9CA3AF]">Офлайн доступ</span>
                    <span className="text-sm text-[#38A169]">
                      {isPWA ? 'Доступно' : 'Требуется установка'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <InstallPrompt />
    </div>
  );
}