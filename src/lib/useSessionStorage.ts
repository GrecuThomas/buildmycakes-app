import { useEffect } from 'react';

interface SessionData {
  tiers: any[];
  decorations: any[];
  timestamp: number;
}

const SESSION_KEY = 'cake-designer-session';
const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Get saved session data from localStorage
 */
export const getSessionData = (): SessionData | null => {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    const data: SessionData = JSON.parse(stored);

    // Check if session has expired
    if (Date.now() - data.timestamp > SESSION_EXPIRY_MS) {
      clearSessionData();
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error retrieving session data:', error);
    return null;
  }
};

/**
 * Save session data to localStorage
 */
export const saveSessionData = (tiers: any[], decorations: any[]): void => {
  try {
    const data: SessionData = {
      tiers,
      decorations,
      timestamp: Date.now(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving session data:', error);
  }
};

/**
 * Clear session data from localStorage
 */
export const clearSessionData = (): void => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Error clearing session data:', error);
  }
};

/**
 * Hook to auto-save session data whenever tiers or decorations change
 */
export const useSessionAutoSave = (tiers: any[], decorations: any[], debounceMs: number = 1000): void => {
  useEffect(() => {
    // Debounce the save to avoid too many writes
    const timer = setTimeout(() => {
      saveSessionData(tiers, decorations);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [tiers, decorations, debounceMs]);
};
