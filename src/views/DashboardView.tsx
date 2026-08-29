import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Flame,
  GraduationCap,
  Lock,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  TrendingUp,
} from 'lucide-react';
import React from 'react';
import { useStudent } from '../context/StudentContext';
import { CHAPTERS_DATABASE, SUBJECTS_META } from '../data/curriculumData';
import { ClassLevel, SubjectId } from '../types';

interface DashboardViewProps {
  onStartPractice: (subjectId?: SubjectId) => void;
  onTakeTest: (subjectId?: SubjectId) => void;
  onViewSubjects: () => void;
  onViewAchievements: () => void;
  onTriggerPromotionCelebration: (completedClass: ClassLevel, isGraduation?: boolean) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartPractice,
  onTakeTest,
  onViewSubjects,
  onViewAchievements,
  onTriggerPromotionCelebration,
}) => {
  const { state, viewingClass, setViewingClass, checkPromotionStatus, promoteStudent } =
    useStudent();

  const curClass = state.profile.currentClass;
  const currentRecord = state.classRecords[curClass];
  const viewingRecord = state.classRecords[viewingClass];

  // Calculations for current viewing class
  const classChapters = CHAPTERS_DATABASE.filter((c) => c.classLevel === viewingClass);
  const totalQuestionsAnswered = viewingRecord?.questionsAnswered || 0;
  const totalCorrect = viewingRecord?.correctAnswers || 0;
  const accuracy =
    totalQuestionsAnswered > 0 ? Math.round((totalCorrect / totalQuestionsAnswered) * 100) : 0;
  const testsCount = viewingRecord?.testsAttempted || 0;
  const avgTestScore = viewingRecord?.averageScorePercentage || 0;

  // Overall class completion progress calculation
  // Factors: Practice volume (up to 30), Tests (up to 3), Accuracy
  const practiceWeight = Math.min(100, Math.round((totalQuestionsAnswered / 30) * 100));
  const testWeight = Math.min(100, Math.round((testsCount / 2) * 100));
  const overallProgress = Math.min(
    100,
    Math.round(practiceWeight * 0.4 + testWeight * 0.4 + Math.min(100, accuracy) * 0.2)
  );

  // Promotion requirements
  const { isEligible, requirements } = checkPromotionStatus(curClass);

  const handlePromoteClick = () => {
    const res = promoteStudent();
    if (res.success) {
      if (res.isGraduated) {
        onTriggerPromotionCelebration(12, true);
      } else {
        onTriggerPromotionCelebration(curClass, false);
      }
    }
  };

  // Subject-wise progress estimations for viewing class
  const subjectList: SubjectId[] = [
    'mathematics',
    'science',
    'social_science',
    'english',
    'hindi',
    'computer',
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Student Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Academic Year {state.profile.currentAcademicYear}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                {state.streakDays} Day Streak
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome, {state.profile.name || 'Scholar'} 👋
            </h1>

            <p className="text-sm sm:text-base text-indigo-200 font-medium max-w-xl">
              Your Class: <strong className="text-white">Class {curClass}</strong>. Keep learning and improving! You have solved{' '}
              <strong className="text-white">{totalQuestionsAnswered}</strong> practice problems this session.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="dashboard-resume-practice-btn"
              onClick={() => onStartPractice()}
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
              <span>Resume Practice</span>
            </button>
            <button
              id="dashboard-take-test-btn"
              onClick={() => onTakeTest()}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm border border-indigo-400/50 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Take Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Class Progress</span>
            <GraduationCap className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{overallProgress}%</p>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Questions Solved</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalQuestionsAnswered}</p>
          <p className="text-xs text-slate-500 font-medium">{totalCorrect} correct answers</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Accuracy Rate</span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{accuracy}%</p>
          <p className="text-xs text-slate-500 font-medium">
            {accuracy >= 80 ? 'Mastery tier' : 'Steady progress'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Tests Taken</span>
            <Trophy className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{testsCount}</p>
          <p className="text-xs text-slate-500 font-medium">
            Avg score: {avgTestScore}%
          </p>
        </div>
      </div>

      {/* Class Promotion Status Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                Academic Journey
              </span>
              <span className="text-xs font-bold text-slate-500">
                Class {curClass} → {curClass < 12 ? `Class ${curClass + 1}` : 'Class 12 Graduation'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Class Promotion Requirements
            </h2>
          </div>

          <div>
            {curClass === 12 && currentRecord?.isCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-100 text-amber-800 font-bold text-sm">
                <GraduationCap className="w-5 h-5 text-amber-600" />
                Class 12 Completed
              </span>
            ) : isEligible ? (
              <button
                id="promote-now-btn"
                onClick={handlePromoteClick}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 animate-pulse"
              >
                <GraduationCap className="w-4 h-4" />
                <span>
                  {curClass < 12 ? `Promote to Class ${curClass + 1} 🔓` : 'Graduate Class 12 🎓'}
                </span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold text-xs border border-slate-200">
                <Lock className="w-4 h-4 text-slate-400" />
                Complete criteria below to unlock
              </span>
            )}
          </div>
        </div>

        {/* Requirements Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {requirements.map((req, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                req.isMet
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold">
                  {req.isMet ? 'Requirement Met' : 'In Progress'}
                </span>
                <CheckCircle2
                  className={`w-4 h-4 ${req.isMet ? 'text-emerald-600' : 'text-slate-300'}`}
                />
              </div>
              <p className="text-xs font-semibold text-slate-800">{req.label}</p>
              <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-slate-500">
                <span>Progress</span>
                <span>
                  {req.current} / {req.required}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full ${req.isMet ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                  style={{
                    width: `${Math.min(100, Math.round((req.current / req.required) * 100))}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject-Wise Progress Section (Requirement 9) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Subject-Wise Progress (Class {viewingClass})
            </h2>
            <p className="text-xs text-slate-500">
              Track mastery and completed chapters across each core subject.
            </p>
          </div>
          <button
            onClick={onViewSubjects}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All Chapters</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectList.map((subId) => {
            const meta = SUBJECTS_META[subId];
            const chaps = classChapters.filter((c) => c.subjectId === subId);
            // Subject progress estimation
            const subPracticed = state.recentPracticeHistory.filter(
              (h) => h.classLevel === viewingClass && h.subjectId === subId
            ).length;
            const subScorePct = Math.min(100, Math.max(10, subPracticed * 15));

            return (
              <div
                key={subId}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold border ${meta.badgeColor}`}>
                    {meta.hindiName}
                  </span>
                  <span className="text-xs font-extrabold text-slate-700">{subScorePct}%</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{meta.name}</h3>
                  <p className="text-xs text-slate-500">{chaps.length} Chapters in Class {viewingClass}</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600"
                    style={{ width: `${subScorePct}%` }}
                  ></div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => onStartPractice(subId)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <span>Practice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onTakeTest(subId)}
                    className="text-xs font-medium text-slate-500 hover:text-slate-800"
                  >
                    Take Test
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges & Achievements Showcase */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">Achievements & Badges</h2>
          </div>
          <button
            onClick={onViewAchievements}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All Badges</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {state.achievements.slice(0, 4).map((ach) => (
            <div
              key={ach.id}
              className={`p-3.5 rounded-xl border text-center space-y-1.5 ${
                ach.unlocked
                  ? 'bg-amber-50/50 border-amber-200 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-500 opacity-75'
              }`}
            >
              <div className="text-xl mx-auto">
                {ach.id === 'first-test' && '🏆'}
                {ach.id === 'streak-7' && '🔥'}
                {ach.id === 'questions-100' && '⭐'}
                {ach.id === 'perfect-score' && '💯'}
                {ach.id === 'chapter-master' && '📚'}
                {ach.id === 'accuracy-90' && '🎯'}
                {ach.id === 'class-completed' && '🎓'}
                {ach.id === 'class-12-grad' && '👑'}
              </div>
              <h4 className="text-xs font-bold line-clamp-1">{ach.title}</h4>
              <span
                className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  ach.unlocked
                    ? 'bg-amber-200/80 text-amber-900'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {ach.unlocked ? 'Unlocked' : `${ach.progressCurrent}/${ach.progressTarget}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
