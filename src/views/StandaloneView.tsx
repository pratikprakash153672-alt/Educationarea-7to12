import {
  Check,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FileCode,
  Globe,
  Layers,
  Maximize2,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import React, { useState } from 'react';

export const StandaloneView: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'all' | 'html' | 'css' | 'js'>('all');
  const [copied, setCopied] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const handleCopy = () => {
    // Fetch or copy standalone code
    fetch('/standalone.html')
      .then((res) => res.text())
      .then((text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      })
      .catch(() => {
        // Fallback
        navigator.clipboard.writeText('<!-- Standalone HTML, CSS & JS App -->');
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = '/standalone.html';
    a.download = 'eduascent_standalone.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const reloadIframe = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Pure HTML5 • CSS3 • Vanilla JavaScript
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Full Standalone HTML, CSS & JS App
            </h1>
            <p className="text-slate-300 text-sm max-width-2xl max-w-2xl leading-relaxed">
              Here is the complete, self-contained Class 7–12 Educational Platform built in pure
              HTML, CSS, and Vanilla JavaScript. It includes procedural questions, timed exams,
              offline local storage, and grade promotion without requiring any backend or build tools.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <button
              id="download-standalone-html-btn"
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-sm shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download .HTML File</span>
            </button>

            <a
              id="open-standalone-tab-btn"
              href="/standalone.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open in New Tab</span>
            </a>
          </div>
        </div>
      </div>

      {/* Embedded Live Runner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <span className="text-xs font-mono text-slate-300 ml-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              Live HTML/CSS/JS Sandbox: <span className="text-white">/standalone.html</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={reloadIframe}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs flex items-center gap-1"
              title="Reload sandbox"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <a
              href="/standalone.html"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs flex items-center gap-1"
              title="Full screen view"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Full Screen</span>
            </a>
          </div>
        </div>

        {/* Live Runner Frame */}
        <div className="relative w-full bg-slate-100 min-h-[640px] h-[780px]">
          <iframe
            key={iframeKey}
            src="/standalone.html"
            title="EduAscent Standalone HTML CSS JS Platform"
            className="w-full h-full border-0"
          />
        </div>
      </div>

      {/* Code Breakdown & Copy Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-600" />
              Standalone Source Code Architecture
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Zero dependencies, no node_modules required. Can run locally from your desktop or any static web hosting.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied Full Source!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>Copy Complete HTML/CSS/JS</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Code Tabs */}
        <div className="flex border-b border-slate-200 gap-2">
          {[
            { id: 'all', label: 'Full Single-File HTML', icon: Layers },
            { id: 'html', label: 'HTML5 Elements', icon: Globe },
            { id: 'css', label: 'CSS3 Styles', icon: FileCode },
            { id: 'js', label: 'JavaScript Engine', icon: Play },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCodeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCodeTab(tab.id as any)}
                className={`flex items-center gap-1.5 pb-2.5 px-2 text-xs font-semibold transition-colors border-b-2 ${
                  isActive
                    ? 'border-indigo-600 text-indigo-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Code Preview Box */}
        <div className="bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
          {activeCodeTab === 'all' && (
            <pre className="text-slate-300">
{`<!-- eduascent_standalone.html -->
<!-- Run directly by double-clicking in Google Chrome, Microsoft Edge, Safari, or Firefox -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EduAscent - Class 7–12 Learning Platform (HTML, CSS & JS Standalone)</title>
  <style>
    /* Pure CSS3 Design System with modern CSS variables, responsive grids, and clean cards */
    :root {
      --primary: #4f46e5;
      --slate-900: #0f172a;
      --emerald-600: #059669;
      --radius-xl: 24px;
    }
    body { font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; color: #1e293b; }
    /* ... 200+ lines of customized responsive styles ... */
  </style>
</head>
<body>
  <!-- Semantic layout: Navigation, Class Promotion Bar, Dashboard, Practice Lab, Exams, History -->
  <header>...</header>
  <main class="container">...</main>
  
  <script>
    // Pure Vanilla JS: Procedural Question Generators, Timed Assessment Engine, and LocalStorage State
    const QuestionEngine = {
      generateMath(clsLevel) { /* Dynamic equations & integers */ },
      generateScience(clsLevel) { /* Dynamic numericals & physics/chem */ },
      generate(subjectId, clsLevel) { /* Returns randomized question with solutions */ }
    };
    
    const app = {
      state: {...},
      init() { this.loadState(); this.renderAll(); }
    };
    window.addEventListener('DOMContentLoaded', () => app.init());
  <\/script>
</body>
</html>`}
            </pre>
          )}

          {activeCodeTab === 'html' && (
            <pre className="text-slate-300">
{`<!-- Semantic HTML5 Architecture -->
<div class="container nav-wrapper">
  <div class="brand" onclick="app.switchTab('dashboard')">
    <div class="brand-icon">🎓</div>
    <div><span>EduAscent</span></div>
  </div>
  <ul class="nav-links">
    <li><button class="nav-btn active" onclick="app.switchTab('dashboard')">Dashboard</button></li>
    <li><button class="nav-btn" onclick="app.switchTab('practice')">Practice</button></li>
    <li><button class="nav-btn" onclick="app.switchTab('tests')">Tests</button></li>
    <li><button class="nav-btn" onclick="app.switchTab('records')">History</button></li>
    <li><button class="nav-btn" onclick="app.switchTab('achievements')">Badges</button></li>
  </ul>
</div>

<!-- Class Promotion Milestone Card -->
<div class="promotion-card">
  <h2 id="dashWelcomeTitle">Welcome back, Student!</h2>
  <div class="progress-bar-bg"><div class="progress-bar-fill" id="dashPromoProgressBar"></div></div>
  <button class="btn btn-gold" onclick="app.tryPromoteClass()">🌟 Advance to Next Class</button>
</div>`}
            </pre>
          )}

          {activeCodeTab === 'css' && (
            <pre className="text-slate-300">
{`/* CSS3 Architecture: Theme Tokens & Layout Rules */
:root {
  --primary: #4f46e5;
  --primary-hover: #4338ca;
  --primary-light: #eef2ff;
  --primary-border: #c7d2fe;
  --slate-900: #0f172a;
  --emerald-600: #059669;
  --radius-xl: 24px;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.card {
  background: #ffffff;
  border: 1px solid var(--slate-200);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.option-btn {
  padding: 1rem 1.25rem;
  border-radius: 18px;
  border: 2px solid var(--slate-200);
  background: white;
  transition: all 0.15s ease;
}
.option-btn:hover:not(:disabled) {
  border-color: var(--primary-border);
  background: var(--primary-light);
}`}
            </pre>
          )}

          {activeCodeTab === 'js' && (
            <pre className="text-slate-300">
{`// JavaScript State Management & Procedural Math/Science Engine
const STORAGE_KEY = 'edu_ascent_standalone_state_v1';

const QuestionEngine = {
  generateMath(clsLevel) {
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const a = randInt(-15, 20);
    const b = randInt(-15, 20);
    const ans = a + b;
    return {
      subjectId: 'mathematics',
      question: \`Calculate the sum: (\${a}) + (\${b})\`,
      options: [ans.toString(), (ans + 1).toString(), (ans - 1).toString(), (a - b).toString()],
      correctAnswer: ans.toString(),
      explanation: \`Adding integers: \${a} + (\${b}) equals \${ans}.\`
    };
  }
};

const app = {
  loadState() {
    this.state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || INITIAL_STATE;
  },
  saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }
};`}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
