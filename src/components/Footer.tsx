import {
  BookOpen,
  GraduationCap,
  Heart,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import React from 'react';
import { SUBJECTS_META } from '../data/curriculumData';
import { ClassLevel, SubjectId } from '../types';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onSelectClass: (c: ClassLevel) => void;
  onSelectSubject: (s: SubjectId) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSelectClass,
  onSelectSubject,
}) => {
  const classes: ClassLevel[] = [7, 8, 9, 10, 11, 12];

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">EduAscent</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Free educational practice & assessment platform for school students from Class 7 to Class 12. Master concepts, solve procedural unlimited questions, and advance sequentially grade by grade.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Zero-sign-in • Client encrypted local persistence</span>
            </div>
          </div>

          {/* Column 2: Classes */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">Academic Classes</h4>
            <ul className="space-y-2">
              {classes.map((cls) => (
                <li key={cls}>
                  <button
                    onClick={() => onSelectClass(cls)}
                    className="hover:text-white transition-colors"
                  >
                    Class {cls} Curriculum
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Subjects */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">Core Subjects</h4>
            <ul className="space-y-2">
              {(Object.keys(SUBJECTS_META) as SubjectId[]).map((sId) => (
                <li key={sId}>
                  <button
                    onClick={() => onSelectSubject(sId)}
                    className="hover:text-white transition-colors"
                  >
                    {SUBJECTS_META[sId].name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Quick Links & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">Platform Links</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white">
                  Student Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('practice')} className="hover:text-white">
                  Unlimited Practice
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tests')} className="hover:text-white">
                  Subject Tests & Quizzes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('achievements')} className="hover:text-white">
                  Badges & Trophies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white">
                  About the Platform
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© {new Date().getFullYear()} EduAscent. All rights reserved. Class 7–12 Learning.</p>
          <div className="flex items-center gap-4">
            <button
              id="footer-admin-link"
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
