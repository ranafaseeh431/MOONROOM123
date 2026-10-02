import React, { useState } from 'react';
import { Heart, Info, ShieldAlert, User, LogOut } from 'lucide-react';
import { UserProfile } from '../types';

interface TopBarProps {
  onOpenAbout: () => void;
  onOpenCrisis: () => void;
  activeSectionTitle?: string;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenAbout,
  onOpenCrisis,
  activeSectionTitle,
  currentUser,
  onLogout,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-[#07090e]/80 border-b border-white/[0.06] transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand Zone: Clean single text element */}
        <div className="flex items-center gap-3">
          <span className="font-serif text-lg tracking-tight text-[#f2f1ed]">
            Moonroom
          </span>
          {activeSectionTitle && (
            <>
              <span className="text-white/20 text-xs" aria-hidden="true">/</span>
              <span className="text-xs text-[#9aa2b5] font-normal truncate max-w-[140px] sm:max-w-xs">
                {activeSectionTitle}
              </span>
            </>
          )}
        </div>

        {/* Action Zone: Quiet and unobtrusive */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Subtle User Profile indicator */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                aria-label={`User account: ${currentUser.username}`}
                title={`Signed in as ${currentUser.username}`}
                className="h-9 px-2 sm:px-2.5 rounded-lg text-xs font-medium text-[#9aa2b5] hover:text-[#f2f1ed] hover:bg-white/[0.04] transition-colors flex items-center gap-1.5 focus-visible:outline-none"
              >
                <div className="w-5 h-5 rounded-full bg-[#1e273a] text-[#c4b5fd] flex items-center justify-center text-[10px] font-mono border border-white/[0.1]">
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline font-serif italic text-xs max-w-[110px] truncate text-[#e0e6f5]">
                  {currentUser.username}
                </span>
              </button>

              {/* Minimal Account Popover */}
              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-[#0e131d] border border-white/[0.1] shadow-xl p-3 z-50 text-left space-y-2 animate-fadeIn">
                    <div className="border-b border-white/[0.06] pb-2">
                      <div className="font-serif text-sm text-[#f2f1ed] font-medium truncate">
                        {currentUser.username}
                      </div>
                      <div className="text-[11px] text-[#626b80] truncate font-mono">
                        {currentUser.email}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout?.();
                      }}
                      className="w-full text-xs text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 py-1.5 px-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          <button
            onClick={onOpenCrisis}
            aria-label="Crisis support and safety resources"
            title="Crisis support and safety"
            className="h-9 px-2.5 rounded-lg text-xs font-medium text-[#9aa2b5] hover:text-[#f2f1ed] hover:bg-white/[0.04] transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#b3aed8]/80" />
            <span className="hidden sm:inline">Support</span>
          </button>

          <button
            onClick={onOpenAbout}
            aria-label="About Moonroom and health guidelines"
            title="About Moonroom"
            className="h-9 px-2.5 rounded-lg text-xs font-medium text-[#9aa2b5] hover:text-[#f2f1ed] hover:bg-white/[0.04] transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">About</span>
          </button>
        </div>
      </div>
    </header>
  );
};
