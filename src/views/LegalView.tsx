import { FileText, Lock, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';

export const LegalView: React.FC<{ initialTab?: 'privacy' | 'terms' }> = ({
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Legal & Compliance
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions of Service'}
        </h1>

        <div className="flex gap-2 border-b border-slate-100 pb-2">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'privacy'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'terms'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Terms & Conditions
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs text-xs sm:text-sm text-slate-600 leading-relaxed space-y-6">
        {activeTab === 'privacy' ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. Zero Account / Local Persistence</h2>
              <p>
                EduAscent does not require users to create accounts, provide passwords, enter email addresses, or share personal phone numbers. All student progress—including questions answered, test results, chapter completion, and academic promotions—is saved locally within your client browser via HTML5 local storage.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">2. Student Data Safety</h2>
              <p>
                We adhere to strict child and student safety guidelines. We never collect or sell student personal identifiable information (PII). Any profile details entered (such as your chosen display name and grade level) are strictly stored on your own device and are never broadcast to public directories.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">3. Cookies & Analytics</h2>
              <p>
                We do not track users across third-party websites. Standard performance logs and aggregated test accuracy statistics are handled on our servers in an anonymous, de-identified format purely to improve curriculum quality and identify difficult questions.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">4. Advertising & Sponsorship Disclosure</h2>
              <p>
                Educational containers are reserved for clean, age-appropriate, certified educational sponsors and Google AdSense. In compliance with student-first policies, advertisements will never block practice questions, mimic interface buttons, or obscure answer feedback.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">5. Policy Revisions</h2>
              <p>
                Any updates to this Privacy Policy will be reflected with the date of modification. Last updated: August 2026.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. Educational Use Only</h2>
              <p>
                EduAscent is designed for self-directed study, academic practice, homework support, and exam preparation for school students in Classes 7 through 12. While content is crafted to align closely with standard secondary school frameworks, students should always consult their prescribed school textbooks and official examination boards.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">2. Academic Progression & Integrity</h2>
              <p>
                The sequential promotion system from Class 7 through Class 12 is intended to encourage realistic pacing and comprehensive mastery. The digital certificates and badges provided on the platform are motivational awards designed to celebrate personal milestones and do not constitute formal government accreditation.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">3. Intellectual Property</h2>
              <p>
                All proprietary questions, procedural generation algorithms, curriculum mappings, interface designs, and code are the intellectual property of the EduAscent initiative. You may freely use the platform for non-commercial individual and classroom learning.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">4. Availability & Warranties</h2>
              <p>
                The platform is provided "as is" with high uptime and responsive performance across modern mobile, tablet, and desktop devices.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
