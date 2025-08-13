import { useState, useEffect, useCallback, useRef } from 'react';
import { getAutocompleteSuggestions, AutocompleteSuggestion } from '@/data/productDatabase';

export interface UseAutocompleteOptions {
  debounceMs?: number;
  minChars?: number;
  maxSuggestions?: number;
}

export function useAutocomplete(options: UseAutocompleteOptions = {}) {
  const {
    debounceMs = 150, // Ridotto da 300ms a 150ms per maggiore reattività
    minChars = 2,
    maxSuggestions = 8
  } = options;

  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const debounceTimer = useRef<NodeJS.Timeout>();
  const lastQuery = useRef<string>('');

  // Funzione debounced per cercare i suggerimenti
  const debouncedSearch = useCallback(async (query: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      if (query.length < minChars) {
        setSuggestions([]);
        setIsOpen(false);
        setIsLoading(false);
        return;
      }

      if (query === lastQuery.current) {
        return; // Evita ricerche duplicate
      }

      lastQuery.current = query;
      setIsLoading(true);
      
      try {
        const results = await getAutocompleteSuggestions(query);
        setSuggestions(results.slice(0, maxSuggestions));
        setIsOpen(results.length > 0);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);
  }, [debounceMs, minChars, maxSuggestions]);

  // Gestione della navigazione da tastiera
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          return suggestions[selectedIndex];
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
    
    return null;
  }, [isOpen, selectedIndex, suggestions]);

  // Selezione di un suggerimento
  const selectSuggestion = useCallback((suggestion: AutocompleteSuggestion) => {
    setIsOpen(false);
    setSelectedIndex(-1);
    setSuggestions([]);
    return suggestion;
  }, []);

  // Chiusura dei suggerimenti
  const closeSuggestions = useCallback(() => {
    setIsOpen(false);
    setSelectedIndex(-1);
  }, []);

  // Cleanup del timer quando il component si smonta
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    suggestions,
    isLoading,
    isOpen,
    selectedIndex,
    search: debouncedSearch,
    handleKeyDown,
    selectSuggestion,
    closeSuggestions,
    setIsOpen
  };
}
