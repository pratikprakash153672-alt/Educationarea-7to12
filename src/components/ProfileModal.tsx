import { BookOpen, Check, GraduationCap, Sparkles, User, X } from 'lucide-react';
import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { ClassLevel } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMandatoryFirstTime?: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  isMandatoryFirstTime = false,
}) => {
  const { state, updateProfile } = useStudent();
  const [name, setName] = useState(state.profile.name || '');
  const [about, setAbout] = useState(state.profile.about || '');
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(state.profile.currentClass || 7);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name to proceed');
      return;
    }
    setError('');
    updateProfile(name, about, selectedClass);
    onClose();
  };

  const classes: ClassLevel[] = [7, 8, 9, 10, 11, 12];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {!isMandatoryFirstTime && (
          <button
            id="close-profile-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {state.profile.name ? 'Student Profile' : 'Welcome to Your Learning Journey'}
            </h2>
            <p className="text-sm text-slate-500">
              {state.profile.name
                ? 'Update your student details & grade level'
                : 'Enter your basic details to personalize your dashboard'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Student Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Student Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="student-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-sm font-medium"
              />
            </div>
          </div>

          {/* Select Current Class */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Select Starting / Current Class <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {classes.map((cls) => {
                const isSelected = selectedClass === cls;
                return (
                  <button
                    key={cls}
                    id={`select-class-btn-${cls}`}
                    type="button"
                    onClick={() => setSelectedClass(cls)}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-bold text-center transition-all ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm ring-2 ring-indigo-200'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Class {cls}
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              Classes 7 to 12 follow a natural academic promotion path.
            </p>
          </div>

          {/* About Me */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              About Me (Optional)
            </label>
            <textarea
              id="student-about-input"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={2}
              placeholder="e.g. Aspiring engineer, love science experiments and mathematics puzzles!"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-sm"
            />
          </div>

          {/* Privacy & No Sign-In Guarantee */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-800">Zero Sign-In Friction:</span> No passwords or account registration required! Your academic journey, practice history, tests, and badges are automatically saved in your browser and available whenever you return.
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            {!isMandatoryFirstTime && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              id="save-profile-btn"
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{state.profile.name ? 'Save Changes' : 'Start Learning'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
