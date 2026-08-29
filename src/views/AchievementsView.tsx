import {
  Award,
  BookOpenCheck,
  CheckCircle2,
  Crown,
  Flame,
  GraduationCap,
  Lock,
  Sparkles,
  Star,
  Target,
  Trophy,
} from 'lucide-react';
import React from 'react';
import { useStudent } from '../context/StudentContext';

export const AchievementsView: React.FC = () => {
  const { state } = useStudent();

  const getBadgeIcon = (iconName: string, unlocked: boolean) => {
    const color = unlocked ? 'text-amber-500' : 'text-slate-400';
    switch (iconName) {
      case 'Trophy':
        return <Trophy className={`w-8 h-8 ${color}`} />;
      case 'Flame':
        return <Flame className={`w-8 h-8 ${color}`} />;
      case 'Star':
        return <Star className={`w-8 h-8 ${color}`} />;
      case 'Award':
        return <Award className={`w-8 h-8 ${color}`} />;
      case 'BookOpenCheck':
        return <BookOpenCheck className={`w-8 h-8 ${color}`} />;
      case 'Target':
        return <Target className={`w-8 h-8 ${color}`} />;
      case 'GraduationCap':
        return <GraduationCap className={`w-8 h-8 ${color}`} />;
      case 'Crown':
        return <Crown className={`w-8 h-8 ${color}`} />;
      default:
        return <Award className={`w-8 h-8 ${color}`} />;
    }
  };

  const unlockedCount = state.achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
            Hall of Honor
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {unlockedCount} of {state.achievements.length} Badges Earned
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Achievements & Badges
        </h1>

        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Earn awards and academic badges as you solve practice questions, maintain practice streaks, score 100% on assessments, and complete grades!
        </p>

        {/* Unlock progress bar */}
        <div className="pt-2 max-w-md">
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
              style={{
                width: `${Math.round((unlockedCount / state.achievements.length) * 100)}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {state.achievements.map((ach) => {
          const isUnlocked = ach.unlocked;
          const progressPct = Math.min(
            100,
            Math.round((ach.progressCurrent / ach.progressTarget) * 100)
          );

          return (
            <div
              key={ach.id}
              id={`achievement-card-${ach.id}`}
              className={`p-6 rounded-3xl border text-center transition-all flex flex-col justify-between space-y-4 ${
                isUnlocked
                  ? 'bg-white border-amber-200 shadow-xs hover:shadow-md'
                  : 'bg-slate-50/60 border-slate-200/80 opacity-75'
              }`}
            >
              <div className="space-y-3">
                <div
                  className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-all ${
                    isUnlocked
                      ? 'bg-amber-100/70 border border-amber-200 shadow-xs'
                      : 'bg-slate-100 border border-slate-200'
                  }`}
                >
                  {getBadgeIcon(ach.icon, isUnlocked)}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{ach.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{ach.description}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Progress</span>
                  <span className={isUnlocked ? 'text-amber-700' : 'text-slate-600'}>
                    {ach.progressCurrent} / {ach.progressTarget}
                  </span>
                </div>

                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isUnlocked ? 'bg-amber-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>

                <div className="text-[11px] pt-1">
                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                      <Lock className="w-3 h-3" /> In Progress
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
