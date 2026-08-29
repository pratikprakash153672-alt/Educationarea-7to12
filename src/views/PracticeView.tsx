import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  XCircle,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { CHAPTERS_DATABASE, SUBJECTS_META } from '../data/curriculumData';
import { getNextPracticeQuestion } from '../data/infiniteQuestionEngine';
import { DifficultyLevel, Question, SubjectId } from '../types';

interface PracticeViewProps {
  initialSubjectId?: SubjectId;
  initialChapterId?: string;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  initialSubjectId,
  initialChapterId,
}) => {
  const { viewingClass, recordPracticeAnswer } = useStudent();

  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(
    initialSubjectId || 'mathematics'
  );
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    initialChapterId || 'all'
  );
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');

  // Current active question
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userSelectedAnswer, setUserSelectedAnswer] = useState<string>('');
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Session Statistics
  const [sessionAnswered, setSessionAnswered] = useState<number>(0);
  const [sessionCorrect, setSessionCorrect] = useState<number>(0);
  const [seenQuestionIds, setSeenQuestionIds] = useState<Set<string>>(new Set());

  // Filtered chapters for dropdown
  const classChapters = CHAPTERS_DATABASE.filter(
    (c) => c.classLevel === viewingClass && c.subjectId === selectedSubject
  );

  // Load new question
  const loadQuestion = () => {
    setIsSubmitted(false);
    setUserSelectedAnswer('');
    setTextAnswer('');

    const chId = selectedChapterId === 'all' ? undefined : selectedChapterId;
    const q = getNextPracticeQuestion(
      viewingClass,
      selectedSubject,
      chId,
      difficulty,
      seenQuestionIds
    );

    setCurrentQuestion(q);
    setSeenQuestionIds((prev) => new Set([...prev, q.id]));
  };

  useEffect(() => {
    loadQuestion();
  }, [viewingClass, selectedSubject, selectedChapterId, difficulty]);

  const handleSubmitAnswer = () => {
    if (!currentQuestion || isSubmitted) return;

    let answerToCheck = '';
    if (currentQuestion.type === 'mcq' || currentQuestion.type === 'true_false') {
      if (!userSelectedAnswer) return;
      answerToCheck = userSelectedAnswer;
    } else {
      if (!textAnswer.trim()) return;
      answerToCheck = textAnswer.trim();
    }

    // Check correctness
    let correct = false;
    const normalizedCorrect = String(currentQuestion.correctAnswer).trim().toLowerCase();
    const normalizedUser = answerToCheck.trim().toLowerCase();

    if (currentQuestion.type === 'numerical') {
      const numCorrect = parseFloat(normalizedCorrect);
      const numUser = parseFloat(normalizedUser);
      if (!isNaN(numCorrect) && !isNaN(numUser)) {
        const tolerance = currentQuestion.numericalTolerance ?? 0.05;
        correct = Math.abs(numCorrect - numUser) <= tolerance;
      } else {
        correct = normalizedCorrect === normalizedUser;
      }
    } else {
      correct = normalizedCorrect === normalizedUser;
    }

    setIsCorrect(correct);
    setIsSubmitted(true);
    setSessionAnswered((prev) => prev + 1);
    if (correct) {
      setSessionCorrect((prev) => prev + 1);
    }

    // Save to student context
    recordPracticeAnswer(currentQuestion.id, viewingClass, selectedSubject, correct);
  };

  const sessionAccuracy =
    sessionAnswered > 0 ? Math.round((sessionCorrect / sessionAnswered) * 100) : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header & Filter Controls */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                Class {viewingClass} Unlimited Practice
              </span>
              <span className="text-xs text-slate-500 font-medium">Infinite questions</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Practice Arena
            </h1>
          </div>

          {/* Session live scoreboard */}
          <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Solved</span>
              <span className="text-base font-extrabold text-slate-800">{sessionAnswered}</span>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div>
              <span className="text-slate-400 block font-medium">Correct</span>
              <span className="text-base font-extrabold text-emerald-600">{sessionCorrect}</span>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div>
              <span className="text-slate-400 block font-medium">Accuracy</span>
              <span className="text-base font-extrabold text-indigo-600">{sessionAccuracy}%</span>
            </div>
          </div>
        </div>

        {/* Filters: Subject, Chapter, Difficulty */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Subject</label>
            <select
              id="practice-subject-select"
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value as SubjectId);
                setSelectedChapterId('all');
              }}
              className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {(Object.keys(SUBJECTS_META) as SubjectId[]).map((sId) => (
                <option key={sId} value={sId}>
                  {SUBJECTS_META[sId].name} ({SUBJECTS_META[sId].hindiName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Chapter Focus</label>
            <select
              id="practice-chapter-select"
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Chapters (Randomized)</option>
              {classChapters.map((chap) => (
                <option key={chap.id} value={chap.id}>
                  {chap.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Difficulty Level</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`py-1.5 text-xs font-bold rounded-lg capitalize border transition-all ${
                    difficulty === diff
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      {currentQuestion ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          {/* Question Metadata bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                {currentQuestion.chapterTitle || 'Core Concepts'}
              </span>
              <span className="text-xs uppercase font-bold text-slate-400">
                Type: {currentQuestion.type.replace('_', ' ')}
              </span>
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                currentQuestion.difficulty === 'easy'
                  ? 'bg-emerald-100 text-emerald-800'
                  : currentQuestion.difficulty === 'medium'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {currentQuestion.difficulty}
            </span>
          </div>

          {/* Question Statement */}
          <div className="space-y-2">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Question #{sessionAnswered + 1}
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Match Pairs Display (if match type) */}
          {currentQuestion.type === 'match' && currentQuestion.matchPairs && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <p className="text-xs font-bold text-slate-700">Statements to Match:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {currentQuestion.matchPairs.map((pair, idx) => (
                  <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-200 flex justify-between">
                    <span className="font-semibold text-slate-800">{pair.left}</span>
                    <span className="text-indigo-600 font-bold">→ {pair.right}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Options / Input based on Question Type */}
          <div>
            {currentQuestion.type === 'mcq' && currentQuestion.options && (
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = userSelectedAnswer === opt;
                  let optStyle = 'border-slate-200 bg-slate-50 hover:bg-indigo-50/40 text-slate-800';

                  if (isSubmitted) {
                    if (opt === currentQuestion.correctAnswer) {
                      optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-400';
                    } else if (isSelected && !isCorrect) {
                      optStyle = 'border-rose-400 bg-rose-50 text-rose-900 line-through';
                    } else {
                      optStyle = 'border-slate-200 bg-white text-slate-400 opacity-60';
                    }
                  } else if (isSelected) {
                    optStyle = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold ring-2 ring-indigo-200';
                  }

                  return (
                    <button
                      key={idx}
                      id={`practice-opt-${idx}`}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => setUserSelectedAnswer(opt)}
                      className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-center justify-between ${optStyle}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-xs font-bold">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </span>
                      {isSubmitted && opt === currentQuestion.correctAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === 'true_false' && (
              <div className="grid grid-cols-2 gap-3">
                {['True', 'False'].map((tf) => {
                  const isSelected = userSelectedAnswer === tf;
                  let btnStyle = 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800';

                  if (isSubmitted) {
                    if (tf === currentQuestion.correctAnswer) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                    }
                  } else if (isSelected) {
                    btnStyle = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold ring-2 ring-indigo-200';
                  }

                  return (
                    <button
                      key={tf}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => setUserSelectedAnswer(tf)}
                      className={`py-4 px-6 rounded-2xl border text-center text-base font-bold transition-all ${btnStyle}`}
                    >
                      {tf}
                    </button>
                  );
                })}
              </div>
            )}

            {(currentQuestion.type === 'numerical' ||
              currentQuestion.type === 'fill_blank' ||
              currentQuestion.type === 'short_answer' ||
              currentQuestion.type === 'match') && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-600">
                  {currentQuestion.type === 'numerical'
                    ? 'Enter numerical answer:'
                    : currentQuestion.type === 'fill_blank'
                    ? 'Fill in the blank value:'
                    : 'Type your answer:'}
                </label>
                <div className="flex gap-2">
                  <input
                    id="practice-text-input"
                    type={currentQuestion.type === 'numerical' ? 'number' : 'text'}
                    step="any"
                    disabled={isSubmitted}
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    placeholder="Type answer here..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons: Check Answer / Next Question */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            {!isSubmitted ? (
              <button
                id="submit-answer-btn"
                onClick={handleSubmitAnswer}
                disabled={
                  (currentQuestion.type === 'mcq' || currentQuestion.type === 'true_false')
                    ? !userSelectedAnswer
                    : !textAnswer.trim()
                }
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Check Answer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="next-question-btn"
                onClick={loadQuestion}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={loadQuestion}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Skip Question
            </button>
          </div>

          {/* Instant Feedback & Detailed Explanation Box (Requirement 7) */}
          {isSubmitted && (
            <div
              className={`p-5 rounded-2xl border space-y-3 animate-in fade-in duration-200 ${
                isCorrect
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50/80 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  )}
                  <span className="font-bold text-sm">
                    {isCorrect ? 'Correct Answer! Well done! 🎉' : 'Incorrect. Keep learning!'}
                  </span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/80">
                  {isCorrect ? '+10 Points' : '0 Points'}
                </span>
              </div>

              {!isCorrect && (
                <div className="text-xs">
                  <span className="font-semibold text-slate-700">Correct Answer: </span>
                  <span className="font-bold text-emerald-800">{currentQuestion.correctAnswer}</span>
                </div>
              )}

              <div className="pt-2 border-t border-current/10 text-xs leading-relaxed">
                <span className="font-bold block mb-0.5">Explanation:</span>
                <p>{currentQuestion.explanation}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <p className="text-slate-500">Loading unlimited practice questions...</p>
        </div>
      )}
    </div>
  );
};
