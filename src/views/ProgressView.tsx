import {
  AlertTriangle,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Lock,
  RotateCcw,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { SUBJECTS_META } from '../data/curriculumData';
import { ClassLevel } from '../types';

export const ProgressView: React.FC = () => {
  const { state, resetProgress, setViewingClass } = useStudent();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const allClasses: ClassLevel[] = [7, 8, 9, 10, 11, 12];

  const recordsList = Object.values(state.classRecords) as any[];
  const totalQuestions = recordsList.reduce(
    (acc: number, r: any) => acc + (r.questionsAnswered || 0),
    0
  );
  const totalCorrect = recordsList.reduce(
    (acc: number, r: any) => acc + (r.correctAnswers || 0),
    0
  );
  const totalAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const completedClassesCount = recordsList.filter((r: any) => r.isCompleted).length;

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
            Cumulative Academic Record
          </span>
          <span className="text-xs font-semibold text-slate-500">
            Academic Year {state.profile.currentAcademicYear}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Academic Progress & History Report
        </h1>

        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Permanent verified record of student achievements, chapter mastery, score percentages, and sequential class promotions.
        </p>
      </div>

      {/* High-Level Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Completed Grades
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {completedClassesCount} / 6
          </p>
          <p className="text-xs text-indigo-600 font-medium">
            Active: Class {state.profile.currentClass}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Solved
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalQuestions}</p>
          <p className="text-xs text-emerald-600 font-medium">{totalCorrect} correct answers</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Cumulative Accuracy
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600">{totalAccuracy}%</p>
          <p className="text-xs text-slate-500 font-medium">Across all grades</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Tests Evaluated
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-600">
            {state.testResults.length}
          </p>
          <p className="text-xs text-slate-500 font-medium">Standard school tests</p>
        </div>
      </div>

      {/* Class-By-Class Academic History Table (Requirement 12) */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          Permanent Class Academic Records (7 to 12)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold">Class Level</th>
                <th className="px-4 py-3 font-bold">Academic Year</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold">Questions Solved</th>
                <th className="px-4 py-3 font-bold">Accuracy</th>
                <th className="px-4 py-3 font-bold">Tests Taken</th>
                <th className="px-4 py-3 font-bold">Avg Score</th>
                <th className="px-4 py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allClasses.map((lvl) => {
                const rec = state.classRecords[lvl];
                const isCurrent = lvl === state.profile.currentClass;
                const isCompleted = rec?.isCompleted;
                const isUnlocked = rec?.isUnlocked;
                const acc =
                  rec && rec.questionsAnswered > 0
                    ? Math.round((rec.correctAnswers / rec.questionsAnswered) * 100)
                    : 0;

                return (
                  <tr key={lvl} className={isCurrent ? 'bg-indigo-50/40 font-medium' : 'hover:bg-slate-50'}>
                    <td className="px-4 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs flex items-center justify-center font-bold">
                        {lvl}
                      </span>
                      <span>Class {lvl}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">
                      {rec?.academicYear || state.profile.currentAcademicYear}
                    </td>
                    <td className="px-4 py-3.5">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      ) : isCurrent ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3" /> In Progress
                        </span>
                      ) : isUnlocked ? (
                        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          Unlocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900">
                      {rec?.questionsAnswered || 0}
                    </td>
                    <td className="px-4 py-3.5 text-indigo-600 font-semibold">{acc}%</td>
                    <td className="px-4 py-3.5">{rec?.testsAttempted || 0}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">
                      {rec?.averageScorePercentage || 0}%
                    </td>
                    <td className="px-4 py-3.5">
                      {isUnlocked && (
                        <button
                          onClick={() => setViewingClass(lvl)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                        >
                          View Class {lvl}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Past Test Submissions History */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Test & Examination Log</h2>

        {state.testResults.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">
            No tests attempted yet. Visit the Tests tab to take your first assessment!
          </div>
        ) : (
          <div className="space-y-3">
            {state.testResults.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      {SUBJECTS_META[t.subjectId]?.name}
                    </span>
                    <span className="text-xs font-bold text-slate-500">Class {t.classLevel}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{t.testTitle}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(t.date).toLocaleDateString()} at{' '}
                    {new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center gap-4 self-start sm:self-auto">
                  <div className="text-right">
                    <p className="text-base font-extrabold text-slate-900">
                      {t.score} / {t.totalQuestions}
                    </p>
                    <p
                      className={`text-xs font-bold ${
                        t.percentage >= 60 ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {t.percentage}% ({t.percentage >= 60 ? 'PASSED' : 'RETRY'})
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Danger Zone: Reset Student Progress */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Reset Local Academic Profile</h4>
          <p className="text-xs text-slate-500">
            Clears browser memory and allows starting fresh from Class 7.
          </p>
        </div>
        <button
          id="reset-student-data-btn"
          onClick={() => setShowResetConfirm(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-100/70 border border-rose-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset All Progress</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Reset All Academic Data?</h3>
            <p className="text-xs text-slate-500">
              This will erase all solved question logs, test records, and class achievements in this browser. This action cannot be undone.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetProgress();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
