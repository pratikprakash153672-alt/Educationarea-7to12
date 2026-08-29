import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Layers,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { CHAPTERS_DATABASE, SUBJECTS_META } from '../data/curriculumData';
import { Chapter, SubjectId } from '../types';

interface SubjectsViewProps {
  initialSubjectId?: SubjectId;
  onPracticeChapter: (chapterId: string, subjectId: SubjectId) => void;
  onTestSubject: (subjectId: SubjectId) => void;
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({
  initialSubjectId = 'mathematics',
  onPracticeChapter,
  onTestSubject,
}) => {
  const { viewingClass } = useStudent();
  const [activeSubject, setActiveSubject] = useState<SubjectId>(initialSubjectId);
  const [activeSubStream, setActiveSubStream] = useState<string>('all');

  const meta = SUBJECTS_META[activeSubject];

  // Filter chapters for this class and subject
  const chapters = CHAPTERS_DATABASE.filter(
    (c) =>
      c.classLevel === viewingClass &&
      c.subjectId === activeSubject &&
      (activeSubStream === 'all' || c.subStream?.toLowerCase() === activeSubStream.toLowerCase())
  );

  const subjectList: SubjectId[] = [
    'mathematics',
    'science',
    'social_science',
    'english',
    'hindi',
    'computer',
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Subject Header & Subject Picker Tabs */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                Class {viewingClass} Curriculum
              </span>
              <span className="text-xs font-bold text-slate-500">6 Core Disciplines</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Curriculum & Chapter Explorer
            </h1>
          </div>

          <button
            onClick={() => onTestSubject(activeSubject)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Take {meta.name} Test</span>
          </button>
        </div>

        {/* Top Subject Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-100">
          {subjectList.map((sId) => {
            const sm = SUBJECTS_META[sId];
            const isActive = activeSubject === sId;
            return (
              <button
                key={sId}
                id={`subject-tab-${sId}`}
                onClick={() => {
                  setActiveSubject(sId);
                  setActiveSubStream('all');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{sm.name}</span>
                <span className="text-[10px] opacity-70">({sm.hindiName})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Subject Information Bar & Sub-streams */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${meta.badgeColor}`}>
                {meta.hindiName}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">{meta.name}</h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">{meta.shortDesc}</p>
          </div>

          {/* Substream Filter (e.g. Science: Physics, Chemistry, Biology) */}
          {meta.subStreams && meta.subStreams.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveSubStream('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeSubStream === 'all'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Branches
              </button>
              {meta.subStreams.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setActiveSubStream(st.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeSubStream === st.id
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Chapters for Class {viewingClass} ({chapters.length})
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Procedural practice ready for every chapter
          </span>
        </div>

        {chapters.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            <p className="text-sm">No chapters found for this sub-stream in Class {viewingClass}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapters.map((chap, idx) => (
              <div
                key={chap.id}
                id={`chapter-card-${chap.id}`}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                      Chapter {idx + 1} {chap.subStream ? `• ${chap.subStream}` : ''}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Class {chap.classLevel}</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-snug">{chap.title}</h4>

                  <p className="text-xs text-slate-600 leading-relaxed">{chap.description}</p>

                  {/* Key Concepts */}
                  {chap.keyConcepts && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {chap.keyConcepts.map((kc, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                        >
                          {kc}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onPracticeChapter(chap.id, chap.subjectId)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Practice Chapter</span>
                  </button>

                  <button
                    onClick={() => onTestSubject(chap.subjectId)}
                    className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    Chapter Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
