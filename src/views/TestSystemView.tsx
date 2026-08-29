import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  HelpCircle,
  Play,
  RotateCcw,
  Trophy,
  XCircle,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { SUBJECTS_META } from '../data/curriculumData';
import { getNextPracticeQuestion } from '../data/infiniteQuestionEngine';
import { getTestsForClass } from '../data/testsData';
import { Question, SubjectId, TestDefinition, TestResult } from '../types';

interface TestSystemViewProps {
  initialSubjectId?: SubjectId;
  onReturnDashboard: () => void;
}

export const TestSystemView: React.FC<TestSystemViewProps> = ({
  initialSubjectId,
  onReturnDashboard,
}) => {
  const { viewingClass, state, recordTestResult } = useStudent();

  // Test Selection & Active Test State
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(
    initialSubjectId || 'mathematics'
  );
  const [activeTestDef, setActiveTestDef] = useState<TestDefinition | null>(null);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(0);
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);

  const availableTests = getTestsForClass(viewingClass, selectedSubject);

  // Start Test handler
  const handleStartTest = (testDef: TestDefinition) => {
    // Generate questions for this test
    const questions: Question[] = [];
    const usedIds = new Set<string>();

    for (let i = 0; i < testDef.questionCount; i++) {
      const q = getNextPracticeQuestion(
        testDef.classLevel,
        testDef.subjectId,
        undefined,
        testDef.difficulty,
        usedIds
      );
      questions.push(q);
      usedIds.add(q.id);
    }

    setActiveTestDef(testDef);
    setTestQuestions(questions);
    setCurrentIndex(0);
    setUserAnswers({});
    setTimeLeftSeconds(testDef.durationMinutes * 60);
    setIsTestActive(true);
    setTestResult(null);
  };

  // Timer effect
  useEffect(() => {
    if (!isTestActive || timeLeftSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTestActive, timeLeftSeconds]);

  // Submit test and evaluate
  const handleSubmitTest = () => {
    if (!activeTestDef) return;

    let score = 0;
    const details = testQuestions.map((q, idx) => {
      const uAns = userAnswers[idx] || '';
      let correct = false;
      if (uAns) {
        const normCorrect = String(q.correctAnswer).trim().toLowerCase();
        const normUser = uAns.trim().toLowerCase();
        if (q.type === 'numerical') {
          const cVal = parseFloat(normCorrect);
          const uVal = parseFloat(normUser);
          correct = !isNaN(cVal) && !isNaN(uVal) && Math.abs(cVal - uVal) <= 0.05;
        } else {
          correct = normCorrect === normUser;
        }
      }
      if (correct) score += 1;

      return {
        questionId: q.id,
        question: q.question,
        userAnswer: uAns || 'Not Answered',
        correctAnswer: q.correctAnswer,
        isCorrect: correct,
        explanation: q.explanation,
      };
    });

    const total = testQuestions.length;
    const percentage = Math.round((score / total) * 100);
    const rating: 'Excellent!' | 'Good Job!' | 'Keep Practicing!' =
      percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good Job!' : 'Keep Practicing!';

    const result: TestResult = {
      id: `res-${Date.now()}`,
      testId: activeTestDef.id,
      testTitle: activeTestDef.title,
      classLevel: activeTestDef.classLevel,
      subjectId: activeTestDef.subjectId,
      date: new Date().toISOString(),
      academicYear: state.profile.currentAcademicYear,
      score,
      totalQuestions: total,
      percentage,
      timeSpentSeconds: activeTestDef.durationMinutes * 60 - timeLeftSeconds,
      rating,
      details,
    };

    setTestResult(result);
    setIsTestActive(false);
    setShowConfirmSubmit(false);

    // Record in local state
    recordTestResult(result);

    // Submit metrics to server
    try {
      fetch('/api/stats/test-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classLevel: result.classLevel,
          subjectId: result.subjectId,
          score: result.score,
          total: result.totalQuestions,
          percentage: result.percentage,
        }),
      }).catch(() => {});
    } catch (e) {}
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 1. Result View
  if (testResult) {
    const passed = testResult.percentage >= 60;
    const percentage = testResult.percentage;

    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-16">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-6">
          <div
            className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-white shadow-lg ${
              passed ? 'bg-emerald-600 shadow-emerald-200' : 'bg-amber-600 shadow-amber-200'
            }`}
          >
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
                passed
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              {passed ? 'Assessment Passed' : 'Needs Practice'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {testResult.testTitle}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Class {testResult.classLevel} • Academic Year {testResult.academicYear}
            </p>
          </div>

          {/* Score breakdown metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-xs text-slate-500 font-medium">Your Score</p>
              <p className="text-2xl font-extrabold text-slate-900">
                {testResult.score} / {testResult.totalQuestions}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Percentage</p>
              <p
                className={`text-2xl font-extrabold ${
                  passed ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {percentage}%
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Passing Score</p>
              <p className="text-2xl font-extrabold text-slate-700">60%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Remark</p>
              <p className="text-sm font-extrabold text-slate-900 mt-1">
                {percentage >= 90
                  ? 'Outstanding! 🌟'
                  : percentage >= 75
                  ? 'Very Good! 👍'
                  : percentage >= 60
                  ? 'Passed! 🎯'
                  : 'Keep Practicing! 💪'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                if (activeTestDef) handleStartTest(activeTestDef);
              }}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Test</span>
            </button>
            <button
              onClick={onReturnDashboard}
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Question-by-Question Review</h2>
          <div className="space-y-4">
            {testResult.details.map((item, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border ${
                  item.isCorrect
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-rose-50/40 border-rose-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">Question {idx + 1}</span>
                  {item.isCorrect ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                      <XCircle className="w-3.5 h-3.5" /> Incorrect
                    </span>
                  )}
                </div>

                <p className="text-sm font-bold text-slate-900 mb-3">{item.question}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-500 block">Your Answer:</span>
                    <span
                      className={`font-semibold ${
                        item.isCorrect ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {item.userAnswer}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-500 block">Correct Answer:</span>
                    <span className="font-semibold text-emerald-700">{item.correctAnswer}</span>
                  </div>
                </div>

                <div className="p-3 bg-white/80 rounded-xl border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-800 block mb-0.5">Explanation:</span>
                  {item.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. Active Test In Progress View
  if (isTestActive && testQuestions.length > 0) {
    const currentQ = testQuestions[currentIndex];
    const currentAnswer = userAnswers[currentIndex] || '';
    const isUrgent = timeLeftSeconds < 120;

    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-16">
        {/* Test Header with Countdown Timer */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">{activeTestDef?.title}</h2>
            <span className="text-xs text-slate-500 font-medium">
              Question {currentIndex + 1} of {testQuestions.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Real-time Timer */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold border transition-colors ${
                isUrgent
                  ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                  : 'bg-slate-100 border-slate-300 text-slate-800'
              }`}
            >
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>{formatTimer(timeLeftSeconds)}</span>
            </div>

            <button
              id="finish-test-early-btn"
              onClick={() => setShowConfirmSubmit(true)}
              className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
            >
              Submit Test
            </button>
          </div>
        </div>

        {/* Question Navigation Palette */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Question Palette</span>
            <span>
              {Object.keys(userAnswers).length} of {testQuestions.length} Answered
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {testQuestions.map((_, idx) => {
              const isAnswered = !!userAnswers[idx];
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={idx}
                  id={`nav-q-${idx + 1}`}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Question Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase pb-3 border-b border-slate-100">
            <span>Class {viewingClass} Assessment</span>
            <span>{currentQ.chapterTitle || 'Standard Curriculum'}</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div>
            {currentQ.type === 'mcq' && currentQ.options && (
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = currentAnswer === opt;
                  return (
                    <button
                      key={idx}
                      onClick={() =>
                        setUserAnswers((prev) => ({ ...prev, [currentIndex]: opt }))
                      }
                      className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold ring-2 ring-indigo-200'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-xs font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {currentQ.type === 'true_false' && (
              <div className="grid grid-cols-2 gap-3">
                {['True', 'False'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() =>
                      setUserAnswers((prev) => ({ ...prev, [currentIndex]: tf }))
                    }
                    className={`py-4 px-6 rounded-2xl border text-center text-base font-bold transition-all ${
                      currentAnswer === tf
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-200'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            )}

            {(currentQ.type === 'numerical' ||
              currentQ.type === 'fill_blank' ||
              currentQ.type === 'short_answer' ||
              currentQ.type === 'match') && (
              <div className="space-y-2">
                <input
                  type={currentQ.type === 'numerical' ? 'number' : 'text'}
                  step="any"
                  value={currentAnswer}
                  onChange={(e) =>
                    setUserAnswers((prev) => ({
                      ...prev,
                      [currentIndex]: e.target.value,
                    }))
                  }
                  placeholder="Type your answer here..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Navigation Prev / Next */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentIndex < testQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
              >
                Finish & Submit
              </button>
            )}
          </div>
        </div>

        {/* Submit Confirmation Modal */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
              <AlertCircle className="w-12 h-12 text-indigo-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">Submit Test?</h3>
              <p className="text-xs text-slate-500">
                You have answered {Object.keys(userAnswers).length} out of{' '}
                {testQuestions.length} questions. You cannot change your answers after submission.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
                >
                  Keep Solving
                </button>
                <button
                  id="confirm-test-submission-btn"
                  onClick={handleSubmitTest}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                >
                  Yes, Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. Test Selection Screen
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                Timed Examination Arena
              </span>
              <span className="text-xs font-semibold text-slate-500">Class {viewingClass}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Subject Tests & Assessments
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Select an official assessment to evaluate conceptual understanding under board exam conditions.
            </p>
          </div>

          <div className="w-full sm:w-56">
            <label className="block text-xs font-bold text-slate-600 mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as SubjectId)}
              className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {(Object.keys(SUBJECTS_META) as SubjectId[]).map((sId) => (
                <option key={sId} value={sId}>
                  {SUBJECTS_META[sId].name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Available Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableTests.map((tDef) => (
          <div
            key={tDef.id}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {SUBJECTS_META[tDef.subjectId]?.name}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    tDef.difficulty === 'easy'
                      ? 'bg-emerald-100 text-emerald-800'
                      : tDef.difficulty === 'medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {tDef.difficulty}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{tDef.title}</h3>

              <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {tDef.durationMinutes} Minutes
                </span>
                <span className="flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  {tDef.questionCount} Questions
                </span>
                <span>Pass: {tDef.passingScore}%</span>
              </div>
            </div>

            <button
              id={`start-test-${tDef.id}`}
              onClick={() => handleStartTest(tDef)}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start Assessment</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
