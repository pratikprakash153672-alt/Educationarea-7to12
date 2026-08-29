import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  Home,
  LayoutDashboard,
  Lock,
  Menu,
  RotateCcw,
  Search,
  Sparkles,
  TrendingUp,
  User,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { ClassLevel } from '../types';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenSearch,
  onOpenProfile,
}) => {
  const { state, viewingClass, setViewingClass } = useStudent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);

  const allClasses: ClassLevel[] = [7, 8, 9, 10, 11, 12];

  const handleNavClick = (tabId: string) => {
    onNavigate(tabId);
    setMobileMenuOpen(false);
    setClassDropdownOpen(false);
  };

  const handleSelectClass = (cls: ClassLevel) => {
    const record = state.classRecords[cls];
    if (record?.isUnlocked) {
      setViewingClass(cls);
      setClassDropdownOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              id="brand-home-btn"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  EduAscent <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold border border-indigo-200">7–12</span>
                </span>
                <span className="hidden sm:block text-[11px] font-medium text-slate-500 tracking-wide uppercase">
                  Class 7 to 12 Learning
                </span>
              </div>
            </button>

            {/* Class Selector Dropdown */}
            <div className="relative ml-2 sm:ml-4">
              <button
                id="class-selector-btn"
                onClick={() => setClassDropdownOpen(!classDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors"
                title="Select Academic Class"
              >
                <span>Class {viewingClass}</span>
                {viewingClass !== state.profile.currentClass && (
                  <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-medium">
                    Archive
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${classDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {classDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Select Class (7–12)
                  </div>
                  {allClasses.map((cls) => {
                    const record = state.classRecords[cls];
                    const isUnlocked = record?.isUnlocked;
                    const isCompleted = record?.isCompleted;
                    const isCurrent = cls === state.profile.currentClass;
                    const isViewing = cls === viewingClass;

                    return (
                      <button
                        key={cls}
                        id={`class-option-${cls}`}
                        disabled={!isUnlocked}
                        onClick={() => handleSelectClass(cls)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors ${
                          isViewing
                            ? 'bg-indigo-50 text-indigo-700 font-bold'
                            : isUnlocked
                            ? 'hover:bg-slate-50 text-slate-700'
                            : 'text-slate-400 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>Class {cls}</span>
                          {isCurrent && (
                            <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-semibold">
                              Current
                            </span>
                          )}
                        </span>
                        <span>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : isUnlocked ? (
                            <span className="text-xs text-indigo-600 font-medium">Active</span>
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'classes', label: 'Classes', icon: GraduationCap },
              { id: 'subjects', label: 'Subjects', icon: BookOpen },
              { id: 'practice', label: 'Practice', icon: Sparkles },
              { id: 'tests', label: 'Tests', icon: RotateCcw },
              { id: 'progress', label: 'Progress', icon: TrendingUp },
              { id: 'achievements', label: 'Badges', icon: Award },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              id="global-search-btn"
              onClick={onOpenSearch}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Search subjects, chapters and questions (Ctrl+K)"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Student Profile Chip */}
            <button
              id="student-profile-chip"
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition-colors"
              title="Student Profile"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase shadow-xs">
                {state.profile.name ? state.profile.name.charAt(0) : <User className="w-4 h-4" />}
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-bold text-slate-900 leading-tight">
                  {state.profile.name || 'Setup Profile'}
                </span>
                <span className="block text-[10px] text-slate-500 font-medium leading-none">
                  Class {state.profile.currentClass} • {state.profile.currentAcademicYear}
                </span>
              </div>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-4 duration-200">
          <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-indigo-900 font-semibold">
                Welcome, {state.profile.name || 'Student'} 👋
              </p>
              <p className="text-[11px] text-indigo-600">
                Active: Class {state.profile.currentClass} ({state.profile.currentAcademicYear})
              </p>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenProfile();
              }}
              className="text-xs px-2.5 py-1 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700"
            >
              Edit
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'classes', label: 'Classes', icon: GraduationCap },
              { id: 'subjects', label: 'Subjects', icon: BookOpen },
              { id: 'practice', label: 'Unlimited Practice', icon: Sparkles },
              { id: 'tests', label: 'Subject Tests', icon: RotateCcw },
              { id: 'progress', label: 'Progress Report', icon: TrendingUp },
              { id: 'achievements', label: 'Badges & Honors', icon: Award },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <button onClick={() => handleNavClick('about')} className="hover:underline">
              About Platform
            </button>
            <button onClick={() => handleNavClick('privacy')} className="hover:underline">
              Privacy Policy
            </button>
            <button onClick={() => handleNavClick('terms')} className="hover:underline">
              Terms
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
