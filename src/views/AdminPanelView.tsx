import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Lock,
  LogOut,
  PlusCircle,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { SUBJECTS_META } from '../data/curriculumData';
import { ClassLevel, SubjectId } from '../types';

export const AdminPanelView: React.FC = () => {
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('edu_admin_auth_token');
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // New question form state
  const [newClass, setNewClass] = useState<ClassLevel>(7);
  const [newSubject, setNewSubject] = useState<SubjectId>('mathematics');
  const [newChapter, setNewChapter] = useState('Integers & Fundamentals');
  const [newType, setNewType] = useState('mcq');
  const [newDifficulty, setNewDifficulty] = useState('medium');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptA, setNewOptA] = useState('');
  const [newOptB, setNewOptB] = useState('');
  const [newOptC, setNewOptC] = useState('');
  const [newOptD, setNewOptD] = useState('');
  const [newCorrectAns, setNewCorrectAns] = useState('');
  const [newExplanation, setNewExplanation] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // Handle Admin Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setAuthToken(data.token);
        localStorage.setItem('edu_admin_auth_token', data.token);
        setPasswordInput('');
      } else {
        setLoginError(data.error || 'Authentication failed');
      }
    } catch (e: any) {
      setLoginError('Server connection error. Please retry.');
    }
  };

  const handleLogout = async () => {
    if (authToken) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
      }).catch(() => {});
    }
    setAuthToken(null);
    localStorage.removeItem('edu_admin_auth_token');
    setStats(null);
    setQuestions([]);
  };

  // Fetch admin stats & questions
  const fetchData = async () => {
    if (!authToken) return;
    setIsLoading(true);
    try {
      const [statsRes, questionsRes] = await Promise.all([
        fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        fetch('/api/admin/questions', {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
      ]);

      if (statsRes.status === 401 || statsRes.status === 403) {
        handleLogout();
        return;
      }

      if (statsRes.ok) {
        const sData = await statsRes.json();
        setStats(sData);
      }
      if (questionsRes.ok) {
        const qData = await questionsRes.json();
        setQuestions(qData.questions || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchData();
    }
  }, [authToken]);

  // Create new question
  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!newQuestionText.trim() || !newCorrectAns.trim()) {
      setFormError('Question text and correct answer are required');
      return;
    }

    const payload: any = {
      classLevel: newClass,
      subjectId: newSubject,
      chapterTitle: newChapter,
      type: newType,
      difficulty: newDifficulty,
      question: newQuestionText.trim(),
      correctAnswer: newCorrectAns.trim(),
      explanation: newExplanation.trim(),
    };

    if (newType === 'mcq') {
      payload.options = [newOptA.trim(), newOptB.trim(), newOptC.trim(), newOptD.trim()].filter(Boolean);
      if (payload.options.length < 2) {
        setFormError('Please provide at least 2 options for MCQ');
        return;
      }
    }

    try {
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setFormSuccess('New question published successfully!');
        setNewQuestionText('');
        setNewOptA('');
        setNewOptB('');
        setNewOptC('');
        setNewOptD('');
        setNewCorrectAns('');
        setNewExplanation('');
        fetchData();
      } else {
        setFormError(data.error || 'Failed to create question');
      }
    } catch (e: any) {
      setFormError('Failed to publish question.');
    }
  };

  // Delete question
  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
      }
    } catch (e) {}
  };

  // If not logged in, show secure login form
  if (!authToken) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Administrator Portal</h1>
            <p className="text-xs text-slate-500">
              Curriculum governance & custom question management
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Access Key / Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password-input"
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter administrator password..."
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Default password configured in environment: <code>admin_secret_pass</code>
              </p>
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authenticate Session</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard View
  return (
    <div className="space-y-8 pb-16">
      {/* Top Bar */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Admin Session Active
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">
            Curriculum Administration Console
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Analytics overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Custom Questions Stored
          </span>
          <p className="text-2xl font-extrabold text-slate-900">
            {stats?.totalCustomQuestions ?? questions.length}
          </p>
          <p className="text-xs text-indigo-600 font-medium">In-memory / server cache</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Tests Evaluated
          </span>
          <p className="text-2xl font-extrabold text-slate-900">{stats?.testsLogged ?? 0}</p>
          <p className="text-xs text-slate-500 font-medium">Real student test submissions</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Platform Avg Test Score
          </span>
          <p className="text-2xl font-extrabold text-emerald-600">
            {stats?.averageTestScore ? `${stats.averageTestScore}%` : 'N/A'}
          </p>
          <p className="text-xs text-slate-500 font-medium">Overall student pass rate</p>
        </div>
      </div>

      {/* Add New Question Form (Requirement 15) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-6">
        <div className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">Publish New Curricular Question</h2>
        </div>

        {formSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{formSuccess}</span>
          </div>
        )}

        {formError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleCreateQuestion} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Class Level</label>
              <select
                value={newClass}
                onChange={(e) => setNewClass(Number(e.target.value) as ClassLevel)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                {[7, 8, 9, 10, 11, 12].map((c) => (
                  <option key={c} value={c}>
                    Class {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value as SubjectId)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                {(Object.keys(SUBJECTS_META) as SubjectId[]).map((s) => (
                  <option key={s} value={s}>
                    {SUBJECTS_META[s].name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Question Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="mcq">Multiple Choice (MCQ)</option>
                <option value="numerical">Numerical Value</option>
                <option value="fill_blank">Fill in the Blank</option>
                <option value="short_answer">Short Answer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty</label>
              <select
                value={newDifficulty}
                onChange={(e) => setNewDifficulty(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Chapter / Topic Title
            </label>
            <input
              type="text"
              value={newChapter}
              onChange={(e) => setNewChapter(e.target.value)}
              placeholder="e.g. Chemical Reactions & Equations"
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Question Statement</label>
            <textarea
              rows={3}
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="Enter clear, concise question statement..."
              required
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {newType === 'mcq' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Option A</label>
                <input
                  type="text"
                  value={newOptA}
                  onChange={(e) => setNewOptA(e.target.value)}
                  placeholder="Option A"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Option B</label>
                <input
                  type="text"
                  value={newOptB}
                  onChange={(e) => setNewOptB(e.target.value)}
                  placeholder="Option B"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Option C</label>
                <input
                  type="text"
                  value={newOptC}
                  onChange={(e) => setNewOptC(e.target.value)}
                  placeholder="Option C"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Option D</label>
                <input
                  type="text"
                  value={newOptD}
                  onChange={(e) => setNewOptD(e.target.value)}
                  placeholder="Option D"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Exact Correct Answer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newCorrectAns}
                onChange={(e) => setNewCorrectAns(e.target.value)}
                placeholder="Must match an option or numeric value exactly"
                required
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Solution Explanation
              </label>
              <input
                type="text"
                value={newExplanation}
                onChange={(e) => setNewExplanation(e.target.value)}
                placeholder="Step-by-step reasoning or formula..."
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            id="admin-add-question-btn"
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Question</span>
          </button>
        </form>
      </div>

      {/* Catalog of Custom Questions */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Custom Questions Pool ({questions.length})</h2>

        {questions.length === 0 ? (
          <p className="text-xs text-slate-500">No custom questions in repository.</p>
        ) : (
          <div className="space-y-3">
            {questions.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                      Class {q.classLevel}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700 uppercase">
                      {q.subjectId}
                    </span>
                    <span className="text-xs font-medium text-slate-500">{q.chapterTitle}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{q.question}</h4>
                  <p className="text-xs text-emerald-700 font-semibold">
                    Correct Answer: {q.correctAnswer}
                  </p>
                  <p className="text-xs text-slate-500">{q.explanation}</p>
                </div>

                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors self-end sm:self-start"
                  title="Delete question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
