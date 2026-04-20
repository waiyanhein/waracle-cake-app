import { createContext, useContext, useState } from 'react';

type ScreenLoaderContextType = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export const ScreenLoaderContext =
  createContext<ScreenLoaderContextType | null>(null);

export const ScreenLoaderProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ScreenLoaderContext.Provider value={{ isLoading, setIsLoading }}>
      <div className="relative">
        {isLoading ? (
          <div className="bg-black/50 absolute top-0 left-0 w-full h-full opacity-50 z-1000">
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          </div>
        ) : null}
        {children}
      </div>
    </ScreenLoaderContext.Provider>
  );
};

export const useScreenLoaderContext = () => {
  const context = useContext(ScreenLoaderContext);
  if (!context) {
    throw new Error(
      'useScreenLoaderContext must be used within a ScreenLoaderProvider',
    );
  }
  return context;
};
