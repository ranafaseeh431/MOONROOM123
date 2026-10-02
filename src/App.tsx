import React, { useState, useEffect, useMemo } from 'react';
import { Exercise, FeedbackResponse, UserProfile } from './types';
import { EXERCISES } from './data/exercises';
import {
  loadPreferences,
  toggleFavorite as toggleStorageFavorite,
  recordSession,
  recordFeedback,
  savePreferences,
  syncPreferencesWithFirestore,
} from './services/storage';
import { getCurrentUser, logout } from './services/auth';
import { NightSkyBackground } from './components/NightSkyBackground';
import { TopBar } from './components/TopBar';
import { Navigation, NavTab } from './components/Navigation';
import { AboutModal } from './components/AboutModal';
import { ExercisePlayer } from './components/player/ExercisePlayer';
import { AuthScreen } from './components/auth/AuthScreen';
import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { FavoritesView } from './views/FavoritesView';
import { ProgressView } from './views/ProgressView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getCurrentUser());
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [preferences, setPreferences] = useState(() => loadPreferences(currentUser?.id));
  const [aboutModalState, setAboutModalState] = useState<{
    isOpen: boolean;
    tab: 'about' | 'crisis';
  }>({
    isOpen: false,
    tab: 'about',
  });

  // Keep preferences in sync when user logs in or switches
  useEffect(() => {
    setPreferences(loadPreferences(currentUser?.id));
    if (currentUser?.id) {
      syncPreferencesWithFirestore(currentUser.id).then((synced) => {
        setPreferences(synced);
      }).catch(() => {});
    }
  }, [currentUser?.id]);

  const refreshPreferences = () => {
    setPreferences(loadPreferences(currentUser?.id));
  };

  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    toggleStorageFavorite(id, currentUser?.id);
    refreshPreferences();
  };

  const handleOpenExercise = (exercise: Exercise) => {
    setActiveExercise(exercise);
  };

  const handleSelectExerciseById = (id: string) => {
    const ex = EXERCISES.find((e) => e.id === id);
    if (ex) {
      setActiveExercise(ex);
    }
  };

  const handleSessionComplete = (exercise: Exercise, feedback?: FeedbackResponse) => {
    recordSession(
      {
        exerciseId: exercise.id,
        exerciseTitle: exercise.title,
        category: exercise.category,
        completed: true,
        feedback,
      },
      currentUser?.id
    );
    if (feedback) {
      recordFeedback(exercise.id, feedback, currentUser?.id);
    }
    refreshPreferences();
  };

  const handleClearHistory = () => {
    const prefs = loadPreferences(currentUser?.id);
    prefs.history = [];
    savePreferences(prefs, currentUser?.id);
    refreshPreferences();
  };

  const handleTryAnother = () => {
    setActiveExercise(null);
    setCurrentTab('explore');
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
  };

  // Recent unique exercises
  const recentExercises = useMemo(() => {
    const ids = Array.from(new Set(preferences.history.map((h) => h.exerciseId)));
    return ids
      .map((id) => EXERCISES.find((e) => e.id === id))
      .filter((e): e is Exercise => !!e);
  }, [preferences.history]);

  const activeSectionTitle = useMemo(() => {
    switch (currentTab) {
      case 'home':
        return undefined;
      case 'explore':
        return 'Library';
      case 'favorites':
        return 'Quiet Places';
      case 'progress':
        return 'Quiet Moments';
    }
  }, [currentTab]);

  // If user is not authenticated, show the serene Moonroom login screen
  if (!currentUser) {
    return <AuthScreen onAuthenticated={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-[#e8e6e1] relative flex flex-col font-sans selection:bg-[#252f48] selection:text-[#f2f1ed]">
      {/* Night Sky Atmospheric Canvas with Soft Moon Disc */}
      <NightSkyBackground showLargeMoon={currentTab === 'home' && !activeExercise} />

      {/* Clean 3-Zone Top Bar with subtle User Profile indicator */}
      <TopBar
        activeSectionTitle={activeSectionTitle}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAbout={() => setAboutModalState({ isOpen: true, tab: 'about' })}
        onOpenCrisis={() => setAboutModalState({ isOpen: true, tab: 'crisis' })}
      />

      {/* Main Responsive Layout */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Navigation Rail (Desktop) / Bottom Bar (Mobile) */}
        <Navigation
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          favoritesCount={preferences.favorites.length}
        />

        {/* Dynamic Content View Container */}
        <main className="flex-1 md:pl-60 pb-24 md:pb-12 transition-all">
          {currentTab === 'home' && (
            <HomeView
              onSelectExercise={handleOpenExercise}
              favorites={preferences.favorites}
              onToggleFavorite={handleToggleFavorite}
              recentExercises={recentExercises}
            />
          )}

          {currentTab === 'explore' && (
            <ExploreView
              onSelectExercise={handleOpenExercise}
              favorites={preferences.favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {currentTab === 'favorites' && (
            <FavoritesView
              favoriteIds={preferences.favorites}
              onSelectExercise={handleOpenExercise}
              onToggleFavorite={handleToggleFavorite}
              onBrowseLibrary={() => setCurrentTab('explore')}
            />
          )}

          {currentTab === 'progress' && (
            <ProgressView
              history={preferences.history}
              favoritesCount={preferences.favorites.length}
              onClearHistory={handleClearHistory}
              onSelectExerciseById={handleSelectExerciseById}
            />
          )}
        </main>
      </div>

      {/* Full-Screen Exercise Player */}
      {activeExercise && (
        <ExercisePlayer
          exercise={activeExercise}
          isFavorited={preferences.favorites.includes(activeExercise.id)}
          onToggleFavorite={(id) => handleToggleFavorite(id)}
          onClose={() => setActiveExercise(null)}
          onSessionComplete={handleSessionComplete}
          onTryAnother={handleTryAnother}
        />
      )}

      {/* About & Crisis Modal */}
      <AboutModal
        isOpen={aboutModalState.isOpen}
        onClose={() => setAboutModalState((prev) => ({ ...prev, isOpen: false }))}
        initialTab={aboutModalState.tab}
      />
    </div>
  );
}
