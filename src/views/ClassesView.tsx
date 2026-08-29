import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Lock,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import React from 'react';
import { useStudent } from '../context/StudentContext';
import { CHAPTERS_DATABASE } from '../data/curriculumData';
import { ClassLevel } from '../types';

interface ClassesViewProps {
  onSelectClass: (c: ClassLevel) => void;
  onStartPractice: (classLevel: ClassLevel) => void;
}

export const ClassesView: React.FC<ClassesViewProps> = ({ onSelectClass, onStartPractice }) => {
  const { state, setViewingClass } = useStudent();
  const currentClass = state.profile.currentClass;

  const classData: {
    level: ClassLevel;
    stage: string;
    description: string;
    focus: string[];
  }[] = [
    {
      level: 7,
      stage: 'Middle School (Junior)',
      description:
        'Fundamental reasoning across algebraic integers, living nutrition, medieval societies, and computer algorithms.',
      focus: ['Integers & Fractions', 'Nutrition & Heat', 'Medieval India', 'English Grammar', 'हिंदी व्याकरण', 'Computer Logic'],
    },
    {
      level: 8,
      stage: 'Middle School (Senior)',
      description:
        'Transition to rigorous scientific inquiry, linear equations, Indian constitutional frameworks, and Python coding basics.',
      focus: ['Rational Numbers', 'Cell Biology & Microorganisms', 'Indian Constitution', 'Vocabulary & Poetics', 'Basic Python'],
    },
    {
      level: 9,
      stage: 'Secondary Foundation',
      description:
        'Preparation for secondary board rigor: Newton’s laws of motion, coordinate geometry, atomic theory, and democratic rights.',
      focus: ['Number Systems & Polynomials', 'Laws of Motion & Gravitation', 'Matter & Atoms', 'Democratic Politics', 'Python Arrays'],
    },
    {
      level: 10,
      stage: 'Secondary Board Examination',
      description:
        'Benchmark secondary school completion: Quadratic equations, trigonometry, electric circuits, heredity, and SQL databases.',
      focus: ['Trigonometry & Quadratics', 'Light & Electricity', 'Nationalism in India', 'Formal Writing', 'SQL Databases'],
    },
    {
      level: 11,
      stage: 'Senior Secondary (Junior)',
      description:
        'Advanced specialized curricula: Limits, derivatives, Newtonian kinematics, atomic orbital structure, and object-oriented algorithms.',
      focus: ['Sets, Relations & Calculus', 'Kinematics & Thermodynamics', 'Chemical Structure', 'Advanced Language', 'Data Structures'],
    },
    {
      level: 12,
      stage: 'Senior Secondary Board / Career Launch',
      description:
        'Culmination of school education: Differential calculus, electrodynamics, organic reaction mechanisms, and database management.',
      focus: ['Integrals & Vectors', 'Electrostatics & Optics', 'Organic Chemistry', 'Literary Analysis', 'Python & SQL Networking'],
    },
  ];

  const handleEnterClass = (lvl: ClassLevel) => {
    setViewingClass(lvl);
    onSelectClass(lvl);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
            Natural Progression Ladder
          </span>
          <span className="text-xs font-semibold text-slate-500">
            Current Level: Class {currentClass}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Classes 7 to 12 Academic Pathway
        </h1>

        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Students progress sequentially through each grade. Lower classes remain unlocked for review and practice, while subsequent classes unlock upon completing practice milestones and passing assessments.
        </p>
      </div>

      {/* Class Cards Ladder */}
      <div className="space-y-5">
        {classData.map((c) => {
          const record = state.classRecords[c.level];
          const isUnlocked = record?.isUnlocked;
          const isCompleted = record?.isCompleted;
          const isCurrent = c.level === currentClass;
          const classChapters = CHAPTERS_DATABASE.filter((ch) => ch.classLevel === c.level);

          return (
            <div
              key={c.level}
              id={`class-ladder-card-${c.level}`}
              className={`p-6 sm:p-7 rounded-3xl border transition-all ${
                isCurrent
                  ? 'bg-indigo-50/40 border-indigo-300 ring-2 ring-indigo-200 shadow-sm'
                  : isUnlocked
                  ? 'bg-white border-slate-200 shadow-2xs hover:shadow-sm'
                  : 'bg-slate-50 border-slate-200/80 opacity-70'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-xs ${
                      isCurrent
                        ? 'bg-indigo-600 text-white'
                        : isUnlocked
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-300 text-slate-600'
                    }`}
                  >
                    {c.level}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-900">Class {c.level}</h2>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {c.stage}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {classChapters.length} Curriculum Chapters • 6 Major Subjects
                    </p>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2 self-start md:self-auto">
                  {isCompleted ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" /> Class Completed
                    </span>
                  ) : isCurrent ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                      <Sparkles className="w-4 h-4 text-indigo-600" /> Current Active Grade
                    </span>
                  ) : isUnlocked ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      Unlocked Revision
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-600">
                      <Lock className="w-3.5 h-3.5" /> Locked (Requires Class {c.level - 1})
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                {c.description}
              </p>

              {/* Core Syllabus tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {c.focus.map((f, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium"
                  >
                    {f}
                  </span>
                ))}
              </div>

              {/* Stats & Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>
                    Questions Solved:{' '}
                    <strong className="text-slate-800">{record?.questionsAnswered || 0}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Tests Taken:{' '}
                    <strong className="text-slate-800">{record?.testsAttempted || 0}</strong>
                  </span>
                  {record?.averageScorePercentage ? (
                    <>
                      <span>•</span>
                      <span>
                        Avg Score:{' '}
                        <strong className="text-emerald-700">
                          {record.averageScorePercentage}%
                        </strong>
                      </span>
                    </>
                  ) : null}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={!isUnlocked}
                    onClick={() => handleEnterClass(c.level)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isUnlocked
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>{isUnlocked ? 'Explore Class' : 'Locked'}</span>
                    {isUnlocked && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>

                  {isUnlocked && (
                    <button
                      onClick={() => onStartPractice(c.level)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Practice
                    </button>
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
