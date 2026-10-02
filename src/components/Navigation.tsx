import React from 'react';
import { Home, Compass, Bookmark, Clock } from 'lucide-react';

export type NavTab = 'home' | 'explore' | 'favorites' | 'progress';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  favoritesCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  favoritesCount = 0,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'explore' as NavTab, label: 'Explore', icon: Compass },
    { 
      id: 'favorites' as NavTab, 
      label: 'Favorites', 
      icon: Bookmark, 
      badge: favoritesCount > 0 ? favoritesCount : undefined 
    },
    { id: 'progress' as NavTab, label: 'Progress', icon: Clock },
  ];

  return (
    <>
      {/* =========================================
          Desktop Navigation Rail (Left Sidebar)
          ========================================= */}
      <nav 
        className="hidden md:flex flex-col fixed left-0 top-14 bottom-0 w-60 z-20 bg-[#07090e]/70 backdrop-blur-md border-r border-white/[0.06] p-4 justify-between"
        aria-label="Desktop Primary Navigation"
      >
        <div className="space-y-1 pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-white/[0.08] text-[#f2f1ed]'
                    : 'text-[#9aa2b5] hover:text-[#e2e1db] hover:bg-white/[0.03]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#c4b5fd]' : 'text-[#626b80]'}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && (
                  <span className="text-[11px] font-mono tabular-nums text-[#9aa2b5] opacity-80">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quiet footnote on desktop */}
        <div className="p-3 text-xs text-[#626b80] border-t border-white/[0.04]">
          <p className="font-serif italic text-[#9aa2b5]/70">“A quiet place for a restless mind.”</p>
        </div>
      </nav>

      {/* =========================================
          Mobile Bottom Navigation Bar
          ========================================= */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07090e]/95 backdrop-blur-xl border-t border-white/[0.07] px-2 pb-safe"
        aria-label="Mobile Bottom Navigation"
      >
        <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
                  isActive ? 'text-[#f2f1ed]' : 'text-[#626b80] hover:text-[#9aa2b5]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'text-[#c4b5fd] scale-105' : ''}`} />
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-[#c4b5fd]" />
                  )}
                </div>
                <span className={`text-[10px] tracking-tight mt-1 font-medium ${isActive ? 'text-[#f2f1ed]' : 'text-[#626b80]'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
