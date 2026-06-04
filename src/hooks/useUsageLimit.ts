import { useState, useEffect } from 'react';

export function useUsageLimit(featureKey: string, isSubscribed: boolean = false) {
  const [useCount, setUseCount] = useState(0);
  const [lastUsedDate, setLastUsedDate] = useState('');

  // Determine limit based on feature and subscription status
  const getLimit = () => {
    if (isSubscribed) {
      switch (featureKey) {
        case 'ai_tools': // AI Stories
          return 8;
        case 'drawing_analyzer': // Drawing Analysis
          return 4;
        case 'magic_translator': // Magic Translator
          return 20;
        default:
          return 9999;
      }
    } else {
      switch (featureKey) {
        case 'ai_tools': // AI Stories
          return 3;
        case 'drawing_analyzer': // Drawing Analysis
          return 1;
        case 'magic_translator': // Magic Translator
          return 5;
        default:
          return 9999;
      }
    }
  };

  const limit = getLimit();

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const storageKey = `usage_${featureKey}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        const { date, count } = JSON.parse(stored);
        if (date === today) {
          setUseCount(count);
          setLastUsedDate(date);
        } else {
          // New day, reset
          setUseCount(0);
          setLastUsedDate(today);
          localStorage.setItem(storageKey, JSON.stringify({ date: today, count: 0 }));
        }
      } catch (e) {
        console.error("Failed to parse usage data", e);
      }
    } else {
      setLastUsedDate(today);
      localStorage.setItem(storageKey, JSON.stringify({ date: today, count: 0 }));
    }
  }, [featureKey]);

  const incrementUsage = () => {
    const today = new Date().toLocaleDateString();
    const storageKey = `usage_${featureKey}`;
    const newCount = useCount + 1;
    setUseCount(newCount);
    localStorage.setItem(storageKey, JSON.stringify({ date: today, count: newCount }));
  };

  const isLimitReached = useCount >= limit;
  const remaining = Math.max(0, limit - useCount);

  return { useCount, isLimitReached, remaining, incrementUsage, limit };
}
