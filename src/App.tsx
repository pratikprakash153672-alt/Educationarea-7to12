import React, { useEffect, useState } from 'react';
import { CelebrationModal } from './components/CelebrationModal';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { ProfileModal } from './components/ProfileModal';
import { SearchModal } from './components/SearchModal';
import { StudentProvider, useStudent } from './context/StudentContext';
import { ClassLevel, SubjectId } from './types';
import { AboutView } from './views/AboutView';
import { AchievementsView } from './views/AchievementsView';
import { AdminPanelView } from './views/AdminPanelView';
import { ClassesView } from './views/ClassesView';
import { DashboardView } from './views/DashboardView';
import { HomePage } from './views/HomePage';
import { LegalView } from './views/LegalView';
import { PracticeView } from './views/PracticeView';
import { ProgressView } from './views/ProgressView';
import { SubjectsView } from './views/SubjectsView';
import { TestSystemView } from './views/TestSystemView';

type TabView =
  | 'home'
  | 'dashboard'
  | 'classes'
  | 'subjects'
  | 'practice'
  | 'tests'
  | 'progress'
  | 'achievements'
  | 'about'
  | 'privacy'
  | 'terms'
  | 'admin';

const MainAppContent: React.FC = () => {
  const { state, isProfileReady, viewingClass, setViewingClass } = useStudent();

  const [currentTab, setCurrentTab] = useState<TabView>('home');
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>('mathematics');
  const [selectedChapterId, setSelectedChapterId] = useState<string | undefined>(undefined);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{
    isOpen: boolean;
    completedClass: ClassLevel;
    isGraduation: boolean;
  }>({
    isOpen: false,
    completedClass: 7,
    isGraduation: false,
  });

  // Automatically prompt profile on first visit if student hasn't entered name
  useEffect(() => {
    if (!state.profile.name) {
      setIsProfileOpen(true);
    }
  }, [state.profile.name]);

  // Global Ctrl+K / Cmd+K search listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateTo = (tab: TabView) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectClass = (cls: ClassLevel) => {
    setViewingClass(cls);
    navigateTo('subjects');
  };

  const handleSelectSubject = (subId: SubjectId) => {
    setSelectedSubjectId(subId);
    navigateTo('subjects');
  };

  const handlePracticeSubject = (subId?: SubjectId) => {
    if (subId) setSelectedSubjectId(subId);
    setSelectedChapterId(undefined);
    navigateTo('practice');
  };

  const handlePracticeChapter = (chapterId: string, subId: SubjectId) => {
    setSelectedSubjectId(subId);
    setSelectedChapterId(chapterId);
    navigateTo('practice');
  };

  const handleTakeTest = (subId?: SubjectId) => {
    if (subId) setSelectedSubjectId(subId);
    navigateTo('tests');
  };

  const handleTriggerCelebration = (completedClass: ClassLevel, isGraduation = false) => {
    setCelebrationData({
      isOpen: true,
      completedClass,
      isGraduation,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-800 font-sans antialiased">
      {/* Primary Navigation */}
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab) => navigateTo(tab as TabView)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {currentTab === 'home' && (
          <HomePage
            onStartLearning={() => navigateTo(state.profile.name ? 'dashboard' : 'classes')}
            onPracticeNow={() => navigateTo('practice')}
            onSelectClass={handleSelectClass}
            onSelectSubject={handleSelectSubject}
            onOpenAbout={() => navigateTo('about')}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            onStartPractice={handlePracticeSubject}
            onTakeTest={handleTakeTest}
            onViewSubjects={() => navigateTo('subjects')}
            onViewAchievements={() => navigateTo('achievements')}
            onTriggerPromotionCelebration={handleTriggerCelebration}
          />
        )}

        {currentTab === 'classes' && (
          <ClassesView
            onSelectClass={handleSelectClass}
            onStartPractice={(cls) => {
              setViewingClass(cls);
              navigateTo('practice');
            }}
          />
        )}

        {currentTab === 'subjects' && (
          <SubjectsView
            initialSubjectId={selectedSubjectId}
            onPracticeChapter={handlePracticeChapter}
            onTestSubject={handleTakeTest}
          />
        )}

        {currentTab === 'practice' && (
          <PracticeView
            initialSubjectId={selectedSubjectId}
            initialChapterId={selectedChapterId}
          />
        )}

        {currentTab === 'tests' && (
          <TestSystemView
            initialSubjectId={selectedSubjectId}
            onReturnDashboard={() => navigateTo('dashboard')}
          />
        )}

        {currentTab === 'progress' && <ProgressView />}

        {currentTab === 'achievements' && <AchievementsView />}

        {currentTab === 'about' && <AboutView />}

        {currentTab === 'privacy' && <LegalView initialTab="privacy" />}

        {currentTab === 'terms' && <LegalView initialTab="terms" />}

        {currentTab === 'admin' && <AdminPanelView />}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => navigateTo(tab as TabView)}
        onSelectClass={handleSelectClass}
        onSelectSubject={handleSelectSubject}
      />

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        isMandatoryFirstTime={!state.profile.name}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectChapter={(chapId, subId, clsLvl) => {
          setViewingClass(clsLvl);
          setSelectedSubjectId(subId);
          setSelectedChapterId(chapId);
          navigateTo('practice');
        }}
        onSelectSubject={(subId, clsLvl) => {
          setViewingClass(clsLvl);
          setSelectedSubjectId(subId);
          navigateTo('subjects');
        }}
      />

      <CelebrationModal
        isOpen={celebrationData.isOpen}
        onClose={() =>
          setCelebrationData((prev) => ({ ...prev, isOpen: false }))
        }
        completedClass={celebrationData.completedClass}
        isClass12Graduation={celebrationData.isGraduation}
        onContinueNextClass={() => {
          navigateTo('dashboard');
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <StudentProvider>
      <MainAppContent />
    </StudentProvider>
  );
}
