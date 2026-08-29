import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Heart,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import React from 'react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-12 pb-16 max-w-4xl mx-auto">
      {/* Hero Header */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
          <GraduationCap className="w-4 h-4 text-indigo-300" />
          <span>Our Educational Mission</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Empowering School Students Through Free, Boundless Practice
        </h1>

        <p className="text-sm sm:text-base text-indigo-200 max-w-2xl mx-auto leading-relaxed">
          EduAscent is built on a single belief: Every student in Classes 7 through 12 deserves high-quality curriculum practice without subscription paywalls, forced sign-ups, or artificial question caps.
        </p>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">Infinite Procedural Engine</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Never hit a ceiling. Mathematical equations, science problems, and language concepts are procedurally synthesized with varied numbers and parameters so practice is truly unlimited.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900">Natural Class Promotion</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            School is sequential. We honor this by providing structured requirements to advance from Class 7 up to Class 12, fostering genuine self-discipline and academic pride.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <ShieldCheck className="w-6 h-6 text-purple-600" />
          <h3 className="text-base font-bold text-slate-900">Student Privacy First</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Zero sign-in barrier. No passwords or personal phone numbers collected. Progress stays stored securely in the student's browser.
          </p>
        </div>
      </div>

      {/* Curriculum Coverage Details */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Classes & Academic Streams Covered</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900">Middle School (Classes 7 & 8)</h4>
            <p>
              Foundational mathematics (integers, fractions, linear equations), basic scientific inquiry (nutrition, heat, cell structure), medieval Indian history, grammar, and early computational logic.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900">Secondary Stage (Classes 9 & 10)</h4>
            <p>
              Pre-board and board standard preparation: quadratic equations, trigonometry, Newton’s mechanics, electricity & magnetism, chemical reactions, nationalism, and database foundations.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900">Senior Secondary Sciences (Classes 11 & 12)</h4>
            <p>
              Rigorous physics (kinematics, thermodynamics, electrostatics), chemistry (atomic models, bonding, organic mechanisms), and calculus (limits, derivatives, integrals, vectors).
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900">Languages & Computer Sciences</h4>
            <p>
              Comprehensive English and Hindi grammar, vocabulary, reading comprehension, alongside modern computer science (Python programming, data structures, SQL queries).
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Contact Academic Support</h2>
          <p className="text-xs text-slate-400">
            Have suggestions for new chapters or curriculum enhancements? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800 border border-slate-700">
            <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <span className="text-slate-400 block font-medium">Curriculum Desk</span>
              <span className="font-semibold text-white">support@eduascent.org</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800 border border-slate-700">
            <Phone className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <span className="text-slate-400 block font-medium">Student Helpline</span>
              <span className="font-semibold text-white">+91 (0) 11 2800 4500</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800 border border-slate-700">
            <MapPin className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <span className="text-slate-400 block font-medium">Location</span>
              <span className="font-semibold text-white">New Delhi, India</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
