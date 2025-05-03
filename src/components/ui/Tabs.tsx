import React from 'react';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex rounded-lg overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps & { onClick?: () => void }> = ({
  value,
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`px-4 py-2 text-sm font-medium transition-colors
        ${props.value === value ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-100'}
        ${className}`}
      onClick={() => props.onValueChange?.(value)}
      {...props}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children }) => {
  return <div className="mt-4">{children}</div>;
};