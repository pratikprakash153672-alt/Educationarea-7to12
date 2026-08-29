import {
  ArrowRight,
  Atom,
  Award,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronDown,
  Globe,
  GraduationCap,
  Languages,
  Laptop,
  Lock,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { AdSenseBanner } from '../components/AdSenseBanner';
import { useStudent } from '../context/StudentContext';
import { SUBJECTS_META } from '../data/curriculumData';
import { ClassLevel, SubjectId } from '../types';

interface HomePageProps {
  onStartLearning: () => void;
  onPracticeNow: () => void;
  onSelectClass: (cls: ClassLevel) => void;
  onSelectSubject: (sub: SubjectId) => void;
  onOpenAbout: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartLearning,
  onPracticeNow,
  onSelectClass,
  onSelectSubject,
  onOpenAbout,
}) => {
  const { state } = useStudent();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do students need to create an account or provide a password?',
      a: 'No! Our platform requires zero sign-in. Simply enter your name and choose your current class. Your academic journey, practice history, and test achievements are saved automatically in your browser so you can return anytime.',
    },
    {
      q: 'How does the class promotion system work?',
      a: 'Students progress naturally from Class 7 through Class 12 (7 → 8 → 9 → 10 → 11 → 12). Arbitrary jumping is locked to ensure real academic mastery. By completing practice milestones and passing subject assessments, you unlock your next class and celebrate with an academic promotion certificate.',
    },
    {
      q: 'Is practice really unlimited?',
      a: 'Yes! Unlike platforms that cap students at 5 or 8 questions, our dynamic question engine procedurally generates and randomizes questions across all chapters, difficulties (Easy, Medium, Hard), and formats (MCQs, numerical, fill-in-blanks, true/false). You can practice thousands of questions endlessly.',
    },
    {
      q: 'Will my previous class data be deleted when I get promoted?',
      a: 'Never. All previous class history, test reports, score percentages, and completed chapters are permanently preserved in your academic portfolio across years (e.g., 2026–27). You can inspect your past class archives anytime.',
    },
    {
      q: 'Are all major school subjects covered for Classes 7 to 12?',
      a: 'Yes! We cover Mathematics, Science (Physics, Chemistry, Biology), Social Science (History, Civics, Geography), English (Grammar, Vocabulary, Literature), Hindi (व्याकरण, शब्द ज्ञान, साहित्य), and Computer & IT (Hardware, Python, SQL, Web basics).',
    },
  ];

  const classesList: { level: ClassLevel; tag: string; desc: string }[] = [
    { level: 7, tag: 'Middle School', desc: 'Integers, Nutrition, Heat, Medieval History, Vyakaran, Binary basics' },
    { level: 8, tag: 'Middle School', desc: 'Rational Numbers, Cell Biology, Combustion, Revolt of 1857, Python intro' },
    { level: 9, tag: 'Secondary', desc: 'Real Numbers, Polynomials, Laws of Motion, French Revolution, Atoms' },
    { level: 10, tag: 'Board Prep', desc: 'Quadratic Equations, Trigonometry, Light & Electricity, Nationalism, SQL' },
    { level: 11, tag: 'Senior Sec.', desc: 'Calculus, Kinematics, Chemical Bonding, Permutations, Python DS' },
    { level: 12, tag: 'Senior Sec. / Boards', desc: 'Matrices, Electrostatics, Optics, Differential Equations, Biotechnology' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 rounded-3xl bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 border border-slate-200/80 px-6 sm:px-12 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200 mb-6 shadow-2xs">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Complete School Learning Platform • Classes 7 to 12</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Master Concepts, Practice Unlimited Questions, and{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
            Promote Class by Class
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          A dedicated academic practice and testing platform designed for school students. Enjoy procedural unlimited questions, timed board-style tests, instant explanations, and an authentic academic progression journey.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="hero-start-learning-btn"
            onClick={onStartLearning}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <BookOpen className="w-5 h-5" />
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-practice-now-btn"
            onClick={onPracticeNow}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-300 shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Practice Now</span>
          </button>
        </div>

        {/* Student Status banner if returning */}
        {state.profile.name && (
          <div className="mt-8 inline-flex items-center gap-3 p-2.5 px-4 rounded-xl bg-white border border-slate-200 shadow-xs text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              Welcome back, <strong>{state.profile.name}</strong>! Active in <strong>Class {state.profile.currentClass}</strong> ({state.profile.currentAcademicYear})
            </span>
          </div>
        )}
      </section>

      {/* Non-intrusive AdSense ready area */}
      <AdSenseBanner slotId="homepage-hero-bottom" format="horizontal" />

      {/* Core Highlights / Features Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Why Students Excel With Us
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Built specifically to reflect school curricula from Class 7 through senior secondary Class 12.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Unlimited Practice Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Never get stuck on only 8 questions. Procedural dynamic questions deliver endless varieties, shuffled numbers, and comprehensive instant step-by-step solutions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Natural Class Promotion</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Progress naturally: Class 7 → 8 → 9 → 10 → 11 → 12. Fulfill chapter practice and test criteria to unlock your next academic grade without losing past data.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Timed Subject Tests</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Simulate actual school and board assessments. Features live countdown timers, question navigation palettes, score breakdowns, and performance badges.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Zero Sign-In Friction</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No account, email, or password required. Your name, current class, and achievements persist securely in your local environment so you can start right away.
            </p>
          </div>
        </div>
      </section>

      {/* Classes Overview Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              The Class 7 to 12 Academic Ladder
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Select any unlocked class to inspect curriculum, start practicing, or test your skills.
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 self-start sm:self-auto">
            Your Active Class: Class {state.profile.currentClass}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {classesList.map((c) => {
            const record = state.classRecords[c.level];
            const isUnlocked = record?.isUnlocked;
            const isCompleted = record?.isCompleted;
            const isCurrent = c.level === state.profile.currentClass;

            return (
              <div
                key={c.level}
                id={`homepage-class-card-${c.level}`}
                className={`p-5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-indigo-50/50 border-indigo-300 ring-2 ring-indigo-200 shadow-sm'
                    : isUnlocked
                    ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    : 'bg-slate-50 border-slate-200/80 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                      {c.level}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Class {c.level}</h3>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {c.tag}
                      </span>
                    </div>
                  </div>
                  <div>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    ) : isCurrent ? (
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        Unlocked
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-200/70 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-4 line-clamp-2">{c.desc}</p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">
                    {record?.questionsAnswered || 0} Questions Solved
                  </span>
                  <button
                    disabled={!isUnlocked}
                    onClick={() => onSelectClass(c.level)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                      isUnlocked
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>{isUnlocked ? 'Enter Class' : 'Locked'}</span>
                    {isUnlocked && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Subjects Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            6 Comprehensive School Subjects
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Complete curriculum alignment across sciences, mathematics, languages, social sciences, and computer literacy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(Object.keys(SUBJECTS_META) as SubjectId[]).map((subId) => {
            const meta = SUBJECTS_META[subId];
            return (
              <div
                key={subId}
                id={`homepage-subject-${subId}`}
                onClick={() => onSelectSubject(subId)}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${meta.badgeColor}`}>
                    {meta.hindiName}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {meta.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{meta.shortDesc}</p>
                {meta.subStreams && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {meta.subStreams.map((st) => (
                      <span
                        key={st.id}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                      >
                        {st.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Step-by-Step Methodology
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold">How Academic Promotion Works</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Designed like a real academic school year with progression, accountability, and celebration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Select Current Class',
              desc: 'Start at Class 7 or choose your current grade. The platform sets up your subjects and benchmarks.',
            },
            {
              step: '02',
              title: 'Learn & Practice Daily',
              desc: 'Solve unlimited practice problems with instant feedback, formula insights, and step-by-step explanations.',
            },
            {
              step: '03',
              title: 'Pass Timed Tests',
              desc: 'Take timed chapter and mid-term assessments with real countdowns and automatic score analysis.',
            },
            {
              step: '04',
              title: 'Class Promotion',
              desc: 'Meet promotion criteria to unlock your next grade. Reach Class 12 and graduate as an Academic Laureate!',
            },
          ].map((item) => (
            <div key={item.step} className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
              <span className="text-2xl font-black text-indigo-400">{item.step}</span>
              <h3 className="text-base font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Everything you need to know about the platform, tests, and promotion.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
