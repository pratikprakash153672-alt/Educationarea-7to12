import { Award, CheckCircle2, ChevronRight, Crown, GraduationCap, Sparkles, X } from 'lucide-react';
import React, { useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { ClassLevel } from '../types';
import { triggerCelebrationConfetti } from '../utils/confetti';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedClass: ClassLevel;
  isClass12Graduation?: boolean;
  onContinueNextClass?: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  completedClass,
  isClass12Graduation = false,
  onContinueNextClass,
}) => {
  const { state } = useStudent();

  useEffect(() => {
    if (isOpen) {
      triggerCelebrationConfetti();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentRecord = state.classRecords[completedClass];
  const nextClass = (completedClass < 12 ? completedClass + 1 : 12) as ClassLevel;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6 sm:p-8 text-center animate-in zoom-in-90 duration-300"
        role="dialog"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close celebration"
        >
          <X className="w-5 h-5" />
        </button>

        {isClass12Graduation ? (
          <div>
            <div className="mx-auto w-20 h-20 rounded-3xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-200 mb-5 animate-bounce">
              <Crown className="w-10 h-10" />
            </div>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 mb-3">
              🎓 Graduation Milestone
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
              🎓 CONGRATULATIONS!
            </h2>
            <p className="text-base text-slate-700 font-medium mb-4">
              Bravo, <span className="font-bold text-indigo-600">{state.profile.name || 'Scholar'}</span>!
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              You have successfully completed your Class 7–12 learning journey. You have mastered all major secondary and senior secondary subjects, passed rigorous assessments, and built strong academic foundations!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
              <div>
                <p className="text-xs text-slate-500 font-medium">Classes</p>
                <p className="text-lg font-extrabold text-slate-900">7 → 12</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Solved</p>
                <p className="text-lg font-extrabold text-indigo-600">
                  {(Object.values(state.classRecords) as any[]).reduce((a, b) => a + (b.questionsAnswered || 0), 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Tests Passed</p>
                <p className="text-lg font-extrabold text-emerald-600">
                  {state.testResults.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Badges</p>
                <p className="text-lg font-extrabold text-amber-600">
                  {state.achievements.filter((a) => a.unlocked).length}
                </p>
              </div>
            </div>

            <button
              id="graduation-finish-btn"
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-base shadow-lg shadow-amber-200 transition-all flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5" />
              <span>Celebrate Academic Laureate</span>
            </button>
          </div>
        ) : (
          <div>
            <div className="mx-auto w-18 h-18 rounded-3xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 mb-4 animate-bounce">
              <Sparkles className="w-9 h-9" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200 mb-2">
              🎉 Academic Promotion
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
              CLASS {completedClass} COMPLETED!
            </h2>
            <p className="text-base text-slate-700 font-semibold mb-4">
              Congratulations, <span className="text-indigo-600">{state.profile.name || 'Student'}</span>!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 mb-5 text-center">
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Subjects</p>
                <p className="text-base font-bold text-slate-900">6 Core</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Questions</p>
                <p className="text-base font-bold text-indigo-600">
                  {currentRecord?.questionsAnswered || 0}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Tests</p>
                <p className="text-base font-bold text-emerald-600">
                  {currentRecord?.testsAttempted || 0}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Avg Score</p>
                <p className="text-base font-bold text-amber-600">
                  {currentRecord?.averageScorePercentage || 85}%
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Next Milestone
                </span>
                <span className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <span>🔓 Class {nextClass}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Unlocked
                  </span>
                </span>
              </div>
              <CheckCircle2 className="w-7 h-7 text-emerald-500" />
            </div>

            <button
              id="continue-next-class-btn"
              onClick={() => {
                if (onContinueNextClass) onContinueNextClass();
                onClose();
              }}
              className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Continue to Class {nextClass}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
