import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PresetRange =
  | 'Today'
  | 'Yesterday'
  | 'Last 7 Days'
  | 'Last 30 Days'
  | 'This Month'
  | 'Last Month'
  | 'Last 3 Months'
  | 'Last 6 Months'
  | 'Last 12 Months'
  | 'Custom Range';

export interface CustomDateRange {
  start: Date;
  end: Date;
}

interface DateRangeContextValue {
  preset: PresetRange;
  customRange: CustomDateRange | null;
  isLoading: boolean;
  setDateRange: (preset: PresetRange, customRange?: CustomDateRange) => void;
}

const DateRangeContext = createContext<DateRangeContextValue | undefined>(undefined);

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [preset, setPresetState] = useState<PresetRange>('This Month');
  const [customRange, setCustomRange] = useState<CustomDateRange | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setDateRange = (newPreset: PresetRange, newCustomRange?: CustomDateRange) => {
    setPresetState(newPreset);
    if (newPreset === 'Custom Range' && newCustomRange) {
      setCustomRange(newCustomRange);
    } else {
      setCustomRange(null);
    }

    // Simulate network/loading delay
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <DateRangeContext.Provider value={{ preset, customRange, isLoading, setDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const context = useContext(DateRangeContext);
  if (context === undefined) {
    throw new Error('useDateRange must be used within a DateRangeProvider');
  }
  return context;
}
