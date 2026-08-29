import { ArrowRight, BookOpen, Calculator, Search, Sparkles, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { CHAPTERS_DATABASE, SUBJECTS_META } from '../data/curriculumData';
import { SEEDED_QUESTIONS } from '../data/questionBank';
import { ClassLevel, SubjectId } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChapter: (chapterId: string, subjectId: SubjectId, classLevel: ClassLevel) => void;
  onSelectSubject: (subjectId: SubjectId, classLevel: ClassLevel) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectChapter,
  onSelectSubject,
}) => {
  const [query, setQuery] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    // 1. Search Chapters
    const matchingChapters = CHAPTERS_DATABASE.filter((chap) => {
      if (filterClass !== 'all' && chap.classLevel !== Number(filterClass)) return false;
      return (
        chap.title.toLowerCase().includes(q) ||
        chap.description.toLowerCase().includes(q) ||
        chap.keyConcepts.some((c) => c.toLowerCase().includes(q))
      );
    }).map((chap) => ({
      type: 'chapter' as const,
      id: chap.id,
      title: chap.title,
      subtitle: `Class ${chap.classLevel} • ${SUBJECTS_META[chap.subjectId]?.name}`,
      tag: chap.subStream || 'Chapter',
      subjectId: chap.subjectId,
      classLevel: chap.classLevel,
      description: chap.description,
    }));

    // 2. Search Subjects
    const matchingSubjects = (Object.keys(SUBJECTS_META) as SubjectId[])
      .filter((subId) => {
        const meta = SUBJECTS_META[subId];
        return (
          meta.name.toLowerCase().includes(q) ||
          meta.hindiName.includes(q) ||
          meta.shortDesc.toLowerCase().includes(q)
        );
      })
      .map((subId) => ({
        type: 'subject' as const,
        id: subId,
        title: SUBJECTS_META[subId].name,
        subtitle: `${SUBJECTS_META[subId].hindiName} • All Classes (7-12)`,
        tag: 'Subject',
        subjectId: subId,
        classLevel: 7 as ClassLevel,
        description: SUBJECTS_META[subId].shortDesc,
      }));

    // 3. Search Questions
    const matchingQuestions = SEEDED_QUESTIONS.filter((item) => {
      if (filterClass !== 'all' && item.classLevel !== Number(filterClass)) return false;
      return (
        item.question.toLowerCase().includes(q) ||
        item.explanation.toLowerCase().includes(q)
      );
    })
      .slice(0, 8)
      .map((item) => ({
        type: 'question' as const,
        id: item.id,
        title: item.question,
        subtitle: `Class ${item.classLevel} • ${SUBJECTS_META[item.subjectId]?.name} • ${item.chapterTitle || 'Chapter'}`,
        tag: `${item.type.toUpperCase()}`,
        subjectId: item.subjectId,
        classLevel: item.classLevel,
        chapterId: item.chapterId,
        description: item.explanation,
      }));

    return [...matchingChapters, ...matchingSubjects, ...matchingQuestions].slice(0, 15);
  }, [query, filterClass]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 sm:pt-16">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
        role="dialog"
      >
        {/* Search Header Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            id="search-input"
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subjects, chapters, topics (e.g., Photosynthesis, Algebra, Gravity, Python)..."
            className="w-full text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Badges */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-500 font-semibold mr-1">Filter Class:</span>
          {['all', '7', '8', '9', '10', '11', '12'].map((c) => (
            <button
              key={c}
              onClick={() => setFilterClass(c)}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                filterClass === c
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {c === 'all' ? 'All Classes' : `Class ${c}`}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 divide-y divide-slate-100">
          {!query.trim() ? (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">Type any subject, chapter, concept, or formula to search</p>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5 text-xs text-slate-500">
                <span className="px-2 py-1 bg-slate-100 rounded-md">Linear Equations</span>
                <span className="px-2 py-1 bg-slate-100 rounded-md">Ohm’s Law</span>
                <span className="px-2 py-1 bg-slate-100 rounded-md">Cell Structure</span>
                <span className="px-2 py-1 bg-slate-100 rounded-md">Indian Constitution</span>
                <span className="px-2 py-1 bg-slate-100 rounded-md">Python Functions</span>
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-10 text-center text-slate-500">
              <p className="text-sm">No educational results found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try another keyword or change class filter</p>
            </div>
          ) : (
            searchResults.map((item, idx) => (
              <div
                key={`${item.type}-${item.id}-${idx}`}
                className="py-3 px-3 hover:bg-indigo-50/50 rounded-xl cursor-pointer transition-colors flex items-start justify-between gap-3 group"
                onClick={() => {
                  if (item.type === 'chapter' || item.type === 'question') {
                    onSelectChapter(item.id, item.subjectId, item.classLevel);
                  } else {
                    onSelectSubject(item.subjectId, item.classLevel);
                  }
                  onClose();
                }}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                      {item.tag}
                    </span>
                    <span className="text-xs font-semibold text-indigo-600">{item.subtitle}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0 mt-2" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
