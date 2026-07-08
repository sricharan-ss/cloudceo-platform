import React, { createContext, useContext, useState, ReactNode } from 'react';

type AiTab = 'assistant' | 'insights' | 'recommendations' | 'history';

interface AiContextType {
  isAiPanelOpen: boolean;
  activeAiTab: AiTab;
  openAiPanel: (tab?: AiTab) => void;
  closeAiPanel: () => void;
  setAiTab: (tab: AiTab) => void;
}

const AiContext = createContext<AiContextType | undefined>(undefined);

export function AiProvider({ children }: { children: ReactNode }) {
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [activeAiTab, setActiveAiTab] = useState<AiTab>('assistant');

  const openAiPanel = (tab?: AiTab) => {
    if (tab) setActiveAiTab(tab);
    setIsAiPanelOpen(true);
  };

  const closeAiPanel = () => {
    setIsAiPanelOpen(false);
  };

  const setAiTab = (tab: AiTab) => {
    setActiveAiTab(tab);
  };

  return (
    <AiContext.Provider value={{ isAiPanelOpen, activeAiTab, openAiPanel, closeAiPanel, setAiTab }}>
      {children}
    </AiContext.Provider>
  );
}

export function useAi() {
  const context = useContext(AiContext);
  if (context === undefined) {
    throw new Error('useAi must be used within an AiProvider');
  }
  return context;
}
