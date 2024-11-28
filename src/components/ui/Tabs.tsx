import React from 'react';
import { cn } from '../../lib/utils';

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

const TabsContext = React.createContext<{
  value: string;
  onChange: (value: string) => void;
}>({
  value: '',
  onChange: () => {},
});

export function Tabs({ defaultValue, className, children }: TabsProps) {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, onChange: setValue }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }: TabsListProps) {
  return (
    <div
      className={cn(
        'inline-flex w-full rounded-lg bg-gray-100 p-1 dark:bg-gray-800',
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children }: TabsTriggerProps) {
  const { value: selectedValue, onChange } = React.useContext(TabsContext);
  const isSelected = value === selectedValue;

  return (
    <button
      className={cn(
        'flex items-center justify-center px-3 py-1.5 text-sm font-medium transition-all',
        'rounded-md',
        isSelected
          ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
        className
      )}
      onClick={() => onChange(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children }: TabsContentProps) {
  const { value: selectedValue } = React.useContext(TabsContext);

  if (value !== selectedValue) {
    return null;
  }

  return (
    <div className={cn('mt-2 rounded-lg', className)}>
      {children}
    </div>
  );
}
