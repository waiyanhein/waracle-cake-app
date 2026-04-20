import type React from 'react';
import { useEffect, useState } from 'react';
import { useConfig } from '../micros/useConfig';

export const PageLayout = ({
  children,
  actions,
}: {
  children: React.ReactNode;
  actions?: React.ReactNode;
}) => {
  const [scrolled, setScrolled] = useState(false);
  const { getAppConfig } = useConfig();
  const appConfig = getAppConfig();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className={`
        sticky top-0 z-10 transition-all
        border-b
        ${
          scrolled
            ? 'bg-white/80 backdrop-blur border-gray-200 shadow-sm'
            : 'bg-white/60 backdrop-blur border-gray-100'
        }
      `}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-lg">🍰</span>
            <span className="text-lg font-medium tracking-tight">
              {appConfig.appName}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">{actions}</div>
        </div>
      </header>
      <main className="w-full mx-auto max-w-6xl">{children}</main>
    </div>
  );
};
