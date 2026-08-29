/**
 * EduAscent - Main Application Engine
 * Pure Vanilla JavaScript (Zero Frameworks, Zero Backend)
 */

import { QuestionEngine } from './questions.js';

const STORAGE_KEY = 'edu_ascent_student_data_v2';

const INITIAL_STATE = {
  profile: {
    name: 'Student',
    currentClass: 7,
    viewingClass: 7,
    academicYear: '2026–2027',
    streakDays: 1,
    lastActiveDate: new Date().toISOString().split('T')[0]
  },
  classRecords: {
    7: { unlocked: true, completed: false, solved: 0, correct: 0, testsTaken: 0, testAvg: 0 },
    8: { unlocked: false, completed: false, solved: 0, correct: 0, testsTaken: 0, testAvg: 0 },
    9: { unlocked: false, completed: false, solved: 0, correct: 0, testsTaken: 0, testAvg: 0 },
    10: { unlocked: false, completed: false, solved: 0, correct: 0, testsTaken: 0, testAvg: 0 },
    11: { unlocked: false, completed: false, solved: 0, correct: 0, testsTaken: 0, testAvg: 0 },
    12: { unlocked: false, completed: false, solved: 0, correct: 0, testsTaken: 0, testAvg: 0 }
  },
  testLogs: [],
  achievements: [
    { id: 'first_step', title: 'First Step', desc: 'Solve your first question', icon: '🌱', target: 1, current: 0, unlocked: false },
    { id: 'solver_10', title: 'Problem Solver', desc: 'Solve 10 practice questions', icon: '⚡', target: 10, current: 0, unlocked: false },
    { id: 'century', title: 'Century Club', desc: 'Solve 50 questions across all classes', icon: '💯', target: 50, current: 0, unlocked: false },
    { id: 'test_champ', title: 'Test Champion', desc: 'Pass your first subject assessment', icon: '🏆', target: 1, current: 0, unlocked: false },
    { id: 'high_acc', title: 'Sharp Mind', desc: 'Achieve 80% or higher overall accuracy', icon: '🎯', target: 80, current: 0, unlocked: false },
    { id: 'class8', title: 'Promoted to Class 8', desc: 'Unlock and advance to Class 8', icon: '🥈', target: 1, current: 0, unlocked: false },
    { id: 'class10', title: 'Secondary Scholar', desc: 'Reach Class 10 Board prep', icon: '🥇', target: 1, current: 0, unlocked: false },
    { id: 'grad_12', title: 'Class 12 Graduate', desc: 'Complete senior secondary graduation', icon: '👑', target: 1, current: 0, unlocked: false }
  ]
};

export const app = {
  state: null,
  activeTab: 'dashboard',

  // Practice State
  currentPractice: {
    subjectId: 'mathematics',
    difficulty: 'all',
    questionData: null,
    selectedOption: null,
    isAnswered: false
  },

  // Test State
  activeTest: {
    inProgress: false,
    subjectId: null,
    questions: [],
    currentIndex: 0,
    userAnswers: {},
    flagged: {},
    timerSeconds: 600,
    timerInterval: null
  },

  init() {
    this.loadState();
    this.initConfetti();
    this.bindEvents();
    this.renderAll();
    this.generateNewPracticeQuestion();
  },

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.state = JSON.parse(saved);
      } else {
        this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
        this.saveState();
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
      this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
    }
  },

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to persist state', e);
    }
  },

  bindEvents() {
    // Navigation Tabs
    document.querySelectorAll('.nav-tab-btn, .mobile-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = btn.getAttribute('data-tab');
        if (tab) {
          this.switchTab(tab);
          // Close mobile drawer if open
          document.getElementById('mobileNavDrawer')?.classList.remove('open');
        }
      });
    });

    // Mobile Menu Toggle
    document.getElementById('mobileMenuToggleBtn')?.addEventListener('click', () => {
      document.getElementById('mobileNavDrawer')?.classList.toggle('open');
    });

    // Class Switcher button
    document.getElementById('classBadgeBtn')?.addEventListener('click', () => {
      this.openClassModal();
    });

    // Practice filter buttons
    document.querySelectorAll('#practiceSubjectFilters .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#practiceSubjectFilters .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentPractice.subjectId = btn.getAttribute('data-subject');
        this.generateNewPracticeQuestion();
      });
    });

    document.querySelectorAll('#practiceDifficultyFilters .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#practiceDifficultyFilters .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentPractice.difficulty = btn.getAttribute('data-diff');
        this.generateNewPracticeQuestion();
      });
    });
  },

  switchTab(tabId) {
    this.activeTab = tabId;

    // Update nav tab classes
    document.querySelectorAll('.nav-tab-btn, .mobile-nav-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Show active tab view
    document.querySelectorAll('.tab-content').forEach(view => {
      view.classList.remove('active');
    });
    const targetView = document.getElementById(`view-${tabId}`);
    if (targetView) {
      targetView.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.renderAll();
  },

  renderAll() {
    this.renderHeader();
    this.renderDashboard();
    this.renderPromotionView();
    this.renderRecordsTable();
    this.renderAchievements();
  },

  renderHeader() {
    const curCls = this.state.profile.currentClass;
    const viewCls = this.state.profile.viewingClass;
    const classBtnText = document.getElementById('classBadgeText');
    if (classBtnText) {
      classBtnText.textContent = `Class ${viewCls} ${viewCls !== curCls ? '(Browsing)' : 'Active'}`;
    }

    const streakVal = document.getElementById('streakVal');
    if (streakVal) {
      streakVal.textContent = `${this.state.profile.streakDays} Day Streak`;
    }
  },

  renderDashboard() {
    const p = this.state.profile;
    const rec = this.state.classRecords[p.currentClass];

    // Welcome titles
    const heroTitle = document.getElementById('heroStudentTitle');
    if (heroTitle) {
      heroTitle.textContent = `Welcome back, ${p.name}! (Class ${p.currentClass})`;
    }

    // Hero Stats
    const totalSolved = Object.values(this.state.classRecords).reduce((sum, r) => sum + r.solved, 0);
    const totalCorrect = Object.values(this.state.classRecords).reduce((sum, r) => sum + r.correct, 0);
    const totalTests = Object.values(this.state.classRecords).reduce((sum, r) => sum + r.testsTaken, 0);
    const overallAcc = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;

    const heroGrade = document.getElementById('heroGradeStat');
    if (heroGrade) heroGrade.textContent = `Class ${p.currentClass}`;

    const heroSolved = document.getElementById('heroSolvedStat');
    if (heroSolved) heroSolved.textContent = totalSolved;

    const heroAcc = document.getElementById('heroAccStat');
    if (heroAcc) heroAcc.textContent = `${overallAcc}%`;

    const heroTests = document.getElementById('heroTestsStat');
    if (heroTests) heroTests.textContent = totalTests;

    // Promotion Progress Bar in Dashboard
    const promoFill = document.getElementById('dashPromoBarFill');
    const promoLabel = document.getElementById('dashPromoLabel');
    const promoBtn = document.getElementById('dashPromoActionBtn');

    const reqQuestions = 10;
    const curSolved = rec.solved;
    const hasPassedTest = rec.testsTaken > 0 && rec.testAvg >= 60;

    let points = 0;
    if (curSolved >= reqQuestions) points += 50;
    else points += Math.round((curSolved / reqQuestions) * 50);

    if (hasPassedTest) points += 50;
    else if (rec.testsTaken > 0) points += 25;

    if (promoFill) promoFill.style.width = `${points}%`;
    if (promoLabel) {
      if (p.currentClass >= 12) {
        promoLabel.textContent = `Class 12 Senior Secondary Curriculum Completed!`;
      } else {
        promoLabel.textContent = `Class ${p.currentClass + 1} Readiness: ${points}% completed (${curSolved}/${reqQuestions} questions, ${hasPassedTest ? 'Test Passed' : 'Needs Passing Test'})`;
      }
    }

    if (promoBtn) {
      if (p.currentClass >= 12) {
        promoBtn.textContent = 'Curriculum Completed 👑';
        promoBtn.disabled = true;
      } else if (points >= 100) {
        promoBtn.textContent = `Promote to Class ${p.currentClass + 1} 🎉`;
        promoBtn.disabled = false;
        promoBtn.onclick = () => this.promoteToNextClass();
      } else {
        promoBtn.textContent = `Class ${p.currentClass + 1} Locked`;
        promoBtn.disabled = false;
        promoBtn.onclick = () => this.switchTab('promotion');
      }
    }
  },

  // --------------------------------------------------------------------------
  // PRACTICE LAB ENGINE
  // --------------------------------------------------------------------------
  generateNewPracticeQuestion() {
    const cls = this.state.profile.viewingClass;
    const sub = this.currentPractice.subjectId;
    const diff = this.currentPractice.difficulty;

    const q = QuestionEngine.getQuestion(sub, cls, diff);
    this.currentPractice.questionData = q;
    this.currentPractice.selectedOption = null;
    this.currentPractice.isAnswered = false;

    // Render Question
    document.getElementById('pqSubjectBadge').textContent = sub.replace('_', ' ').toUpperCase();
    document.getElementById('pqChapterBadge').textContent = q.chapterTitle;
    document.getElementById('pqDiffBadge').textContent = q.difficulty;
    document.getElementById('pqQuestionText').textContent = q.question;

    const optionsContainer = document.getElementById('pqOptionsContainer');
    optionsContainer.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.id = `practice-opt-${idx}`;
      btn.innerHTML = `
        <span class="option-tag">${letters[idx]}</span>
        <span>${opt}</span>
      `;
      btn.onclick = () => this.handleSelectPracticeOption(opt, btn);
      optionsContainer.appendChild(btn);
    });

    const expBox = document.getElementById('pqExplanationContainer');
    expBox.style.display = 'none';
    expBox.innerHTML = '';

    document.getElementById('pqNextBtn').style.display = 'none';
  },

  handleSelectPracticeOption(chosenOption, btnElement) {
    if (this.currentPractice.isAnswered) return;

    this.currentPractice.isAnswered = true;
    this.currentPractice.selectedOption = chosenOption;

    const q = this.currentPractice.questionData;
    const isCorrect = chosenOption === q.correctAnswer;

    // Update student statistics
    const curCls = this.state.profile.currentClass;
    this.state.classRecords[curCls].solved += 1;
    if (isCorrect) {
      this.state.classRecords[curCls].correct += 1;
    }
    this.checkAchievements();
    this.saveState();
    this.renderHeader();
    this.renderDashboard();

    // Style option buttons
    document.querySelectorAll('#pqOptionsContainer .option-btn').forEach(btn => {
      btn.disabled = true;
      const text = btn.querySelector('span:nth-child(2)').textContent;
      if (text === q.correctAnswer) {
        btn.classList.add('correct');
      } else if (text === chosenOption && !isCorrect) {
        btn.classList.add('incorrect');
      }
    });

    // Show Explanation
    const expBox = document.getElementById('pqExplanationContainer');
    expBox.className = `explanation-box ${isCorrect ? 'success' : 'error'}`;
    expBox.innerHTML = `
      <div style="font-weight: 800; font-size: 1rem; margin-bottom: 0.25rem;">
        ${isCorrect ? '✅ Well done! Correct Answer.' : '❌ Incorrect. Review Solution Below:'}
      </div>
      <div>${q.explanation}</div>
    `;
    expBox.style.display = 'block';

    document.getElementById('pqNextBtn').style.display = 'inline-flex';
  },

  // --------------------------------------------------------------------------
  // TIMED TEST / ASSESSMENT ENGINE
  // --------------------------------------------------------------------------
  startTest(subjectId) {
    const cls = this.state.profile.viewingClass;
    const questions = [];

    // Generate 10 randomized procedural questions for this assessment
    for (let i = 0; i < 10; i++) {
      questions.push(QuestionEngine.getQuestion(subjectId, cls, 'all'));
    }

    this.activeTest = {
      inProgress: true,
      subjectId: subjectId,
      questions: questions,
      currentIndex: 0,
      userAnswers: {},
      flagged: {},
      timerSeconds: 600, // 10 minutes
      timerInterval: null
    };

    // Switch views
    document.getElementById('testLobbyView').style.display = 'none';
    document.getElementById('testResultView').style.display = 'none';
    document.getElementById('testActiveView').style.display = 'block';

    document.getElementById('testHeaderTitle').textContent = `${subjectId.replace('_', ' ').toUpperCase()} Exam`;
    document.getElementById('testHeaderClass').textContent = `Class ${cls}`;

    this.startTestTimer();
    this.renderActiveTestQuestion();
    this.renderTestPalette();
  },

  startTestTimer() {
    clearInterval(this.activeTest.timerInterval);
    const display = document.getElementById('testCountdownTimer');

    const updateTimer = () => {
      if (this.activeTest.timerSeconds <= 0) {
        clearInterval(this.activeTest.timerInterval);
        this.submitTest();
        return;
      }

      this.activeTest.timerSeconds--;
      const mins = Math.floor(this.activeTest.timerSeconds / 60);
      const secs = this.activeTest.timerSeconds % 60;
      display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

      if (this.activeTest.timerSeconds < 120) {
        display.classList.add('danger');
      } else {
        display.classList.remove('danger');
      }
    };

    updateTimer();
    this.activeTest.timerInterval = setInterval(updateTimer, 1000);
  },

  renderActiveTestQuestion() {
    const qIndex = this.activeTest.currentIndex;
    const q = this.activeTest.questions[qIndex];

    document.getElementById('testQuestionIndexLabel').textContent = `Question ${qIndex + 1} of 10 • ${q.chapterTitle}`;
    document.getElementById('testQuestionText').textContent = q.question;

    const optContainer = document.getElementById('testOptionsContainer');
    optContainer.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    const chosen = this.activeTest.userAnswers[qIndex];

    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = `option-btn ${chosen === opt ? 'selected' : ''}`;
      btn.id = `test-opt-${idx}`;
      btn.innerHTML = `
        <span class="option-tag">${letters[idx]}</span>
        <span>${opt}</span>
      `;
      btn.onclick = () => {
        this.activeTest.userAnswers[qIndex] = opt;
        this.renderActiveTestQuestion();
        this.renderTestPalette();
      };
      optContainer.appendChild(btn);
    });

    // Flag button
    const flagBtn = document.getElementById('testFlagBtn');
    if (this.activeTest.flagged[qIndex]) {
      flagBtn.textContent = '🚩 Flagged (Click to Unflag)';
      flagBtn.style.background = '#fef3c7';
      flagBtn.style.borderColor = '#f59e0b';
    } else {
      flagBtn.textContent = '🚩 Flag for Review';
      flagBtn.style.background = 'white';
      flagBtn.style.borderColor = 'var(--slate-300)';
    }

    // Prev / Next button states
    document.getElementById('testPrevBtn').disabled = qIndex === 0;
    const nextBtn = document.getElementById('testNextBtn');
    if (qIndex === 9) {
      nextBtn.textContent = 'Review & Finish';
    } else {
      nextBtn.textContent = 'Next Question →';
    }
  },

  renderTestPalette() {
    const container = document.getElementById('testBubblesContainer');
    container.innerHTML = '';

    for (let i = 0; i < 10; i++) {
      const bubble = document.createElement('button');
      bubble.className = 'nav-bubble';
      bubble.textContent = i + 1;

      if (i === this.activeTest.currentIndex) {
        bubble.classList.add('active');
      } else if (this.activeTest.flagged[i]) {
        bubble.classList.add('flagged');
      } else if (this.activeTest.userAnswers[i] !== undefined) {
        bubble.classList.add('answered');
      }

      bubble.onclick = () => {
        this.activeTest.currentIndex = i;
        this.renderActiveTestQuestion();
        this.renderTestPalette();
      };

      container.appendChild(bubble);
    }
  },

  nextTestQuestion() {
    if (this.activeTest.currentIndex < 9) {
      this.activeTest.currentIndex++;
      this.renderActiveTestQuestion();
      this.renderTestPalette();
    } else {
      if (confirm('You are on the last question. Would you like to submit your exam now?')) {
        this.submitTest();
      }
    }
  },

  prevTestQuestion() {
    if (this.activeTest.currentIndex > 0) {
      this.activeTest.currentIndex--;
      this.renderActiveTestQuestion();
      this.renderTestPalette();
    }
  },

  toggleFlagQuestion() {
    const idx = this.activeTest.currentIndex;
    this.activeTest.flagged[idx] = !this.activeTest.flagged[idx];
    this.renderActiveTestQuestion();
    this.renderTestPalette();
  },

  submitTest() {
    clearInterval(this.activeTest.timerInterval);

    let score = 0;
    this.activeTest.questions.forEach((q, idx) => {
      if (this.activeTest.userAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });

    const percent = Math.round((score / 10) * 100);
    const passed = percent >= 60;

    // Record test in state
    const curCls = this.state.profile.currentClass;
    const rec = this.state.classRecords[curCls];
    const prevTotal = rec.testAvg * rec.testsTaken;
    rec.testsTaken += 1;
    rec.testAvg = Math.round((prevTotal + percent) / rec.testsTaken);

    this.state.testLogs.unshift({
      date: new Date().toLocaleDateString(),
      classLevel: curCls,
      subjectId: this.activeTest.subjectId,
      score: score,
      percent: percent,
      passed: passed
    });

    this.checkAchievements();
    this.saveState();

    // Show Results
    document.getElementById('testActiveView').style.display = 'none';
    document.getElementById('testResultView').style.display = 'block';

    document.getElementById('resultEmoji').textContent = passed ? '🎉' : '📚';
    const badge = document.getElementById('resultBadge');
    badge.className = `badge ${passed ? 'badge-emerald' : 'badge-amber'}`;
    badge.textContent = passed ? 'Passed (≥ 60%)' : 'Needs Practice (< 60%)';

    document.getElementById('resultTitle').textContent = passed ? 'Congratulations! Test Passed' : 'Test Completed';
    document.getElementById('resultScoreText').textContent = `You scored ${score} / 10 (${percent}%)`;
    document.getElementById('resultFeedback').textContent = passed
      ? 'Great job! This score counts towards your promotion requirements for the next grade.'
      : 'You need at least 60% to pass. Don\'t worry, practice the concepts and retake the test!';

    if (passed) {
      this.triggerConfetti();
    }
  },

  resetTestToLobby() {
    document.getElementById('testActiveView').style.display = 'none';
    document.getElementById('testResultView').style.display = 'none';
    document.getElementById('testLobbyView').style.display = 'block';
  },

  // --------------------------------------------------------------------------
  // PROMOTION & GRADUATION SYSTEM
  // --------------------------------------------------------------------------
  renderPromotionView() {
    const curCls = this.state.profile.currentClass;
    const rec = this.state.classRecords[curCls];

    const reqQuestions = 10;
    const hasQuestions = rec.solved >= reqQuestions;
    const hasPassed = rec.testsTaken > 0 && rec.testAvg >= 60;
    const canPromote = hasQuestions && hasPassed && curCls < 12;

    const banner = document.getElementById('promoRequirementsList');
    if (banner) {
      banner.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.95rem; margin-bottom: 0.5rem;">
          <span>${hasQuestions ? '✅' : '⭕'}</span>
          <span>Solve at least 10 practice questions in Class ${curCls} <strong>(${rec.solved}/10 completed)</strong></span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.95rem;">
          <span>${hasPassed ? '✅' : '⭕'}</span>
          <span>Pass at least 1 subject assessment with ≥ 60% score <strong>(${hasPassed ? 'Passed' : 'Not yet passed'})</strong></span>
        </div>
      `;
    }

    const actionBtn = document.getElementById('promoMainActionBtn');
    if (actionBtn) {
      if (curCls >= 12) {
        actionBtn.textContent = 'Senior Secondary Curriculum Completed 👑';
        actionBtn.disabled = true;
      } else if (canPromote) {
        actionBtn.textContent = `Graduate & Promote to Class ${curCls + 1} 🎓`;
        actionBtn.disabled = false;
        actionBtn.onclick = () => this.promoteToNextClass();
      } else {
        actionBtn.textContent = `Promote to Class ${curCls + 1} (Locked - Fulfill Requirements)`;
        actionBtn.disabled = true;
      }
    }

    // Render 7-12 Grade Cards
    const grid = document.getElementById('promotionGradeGrid');
    if (grid) {
      grid.innerHTML = '';
      for (let c = 7; c <= 12; c++) {
        const cRec = this.state.classRecords[c];
        const isCurrent = c === curCls;
        const card = document.createElement('div');
        card.className = 'card';
        card.style.borderColor = isCurrent ? 'var(--primary)' : 'var(--slate-200)';
        card.style.background = isCurrent ? '#faf5ff' : 'white';

        card.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <h3 style="font-size: 1.2rem; font-weight: 800;">Class ${c}</h3>
            <span class="badge ${cRec.completed ? 'badge-emerald' : isCurrent ? 'badge-primary' : cRec.unlocked ? 'badge-amber' : 'badge-slate'}">
              ${cRec.completed ? 'Completed' : isCurrent ? 'Active Grade' : cRec.unlocked ? 'Unlocked' : 'Locked'}
            </span>
          </div>
          <p style="font-size: 0.8rem; color: var(--slate-600); margin-bottom: 1rem;">
            ${c <= 8 ? 'Middle School Foundations' : c <= 10 ? 'Secondary & Board Curriculum' : 'Senior Secondary Specialization'}
          </p>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; border-top: 1px solid var(--slate-100); padding-top: 0.75rem;">
            <span>Questions Solved: <strong>${cRec.solved}</strong></span>
            <span>Accuracy: <strong>${cRec.solved > 0 ? Math.round((cRec.correct / cRec.solved) * 100) : 0}%</strong></span>
          </div>
        `;
        grid.appendChild(card);
      }
    }
  },

  promoteToNextClass() {
    const cur = this.state.profile.currentClass;
    if (cur >= 12) return;

    const next = cur + 1;
    this.state.classRecords[cur].completed = true;
    this.state.classRecords[next].unlocked = true;
    this.state.profile.currentClass = next;
    this.state.profile.viewingClass = next;

    this.checkAchievements();
    this.saveState();
    this.renderAll();

    // Show celebration modal
    const modal = document.getElementById('celebrationModal');
    document.getElementById('celebrationText').textContent =
      `You have completed the requirements for Class ${cur} and have officially ascended to Class ${next}!`;
    modal.classList.add('open');
    this.triggerConfetti();
  },

  closeCelebrationModal() {
    document.getElementById('celebrationModal').classList.remove('open');
    this.switchTab('dashboard');
  },

  // --------------------------------------------------------------------------
  // ACADEMIC RECORDS & HONORS
  // --------------------------------------------------------------------------
  renderRecordsTable() {
    const tbody = document.getElementById('recordsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const curCls = this.state.profile.currentClass;

    for (let c = 7; c <= 12; c++) {
      const rec = this.state.classRecords[c];
      const isCurrent = c === curCls;
      const acc = rec.solved > 0 ? Math.round((rec.correct / rec.solved) * 100) : 0;

      const tr = document.createElement('tr');
      if (isCurrent) tr.className = 'current-row';

      tr.innerHTML = `
        <td><strong>Class ${c}</strong></td>
        <td>
          <span class="badge ${rec.completed ? 'badge-emerald' : isCurrent ? 'badge-primary' : rec.unlocked ? 'badge-amber' : 'badge-slate'}">
            ${rec.completed ? 'Completed' : isCurrent ? 'Active Grade' : rec.unlocked ? 'Unlocked' : 'Locked'}
          </span>
        </td>
        <td>${rec.solved}</td>
        <td>${acc}%</td>
        <td>${rec.testsTaken}</td>
        <td>${rec.testAvg}%</td>
      `;
      tbody.appendChild(tr);
    }
  },

  renderAchievements() {
    const grid = document.getElementById('achievementsGrid');
    if (!grid) return;

    grid.innerHTML = '';
    this.state.achievements.forEach(ach => {
      const card = document.createElement('div');
      card.className = `achievement-card ${ach.unlocked ? 'unlocked' : ''}`;
      card.innerHTML = `
        <div class="achievement-icon">${ach.icon}</div>
        <h4 style="font-size: 1rem; font-weight: 800; margin-bottom: 0.25rem;">${ach.title}</h4>
        <p style="font-size: 0.8rem; color: var(--slate-500); margin-bottom: 0.75rem;">${ach.desc}</p>
        <span class="badge ${ach.unlocked ? 'badge-emerald' : 'badge-slate'}">
          ${ach.unlocked ? 'Unlocked 🎖️' : 'Locked'}
        </span>
      `;
      grid.appendChild(card);
    });
  },

  checkAchievements() {
    const totalSolved = Object.values(this.state.classRecords).reduce((s, r) => s + r.solved, 0);
    const totalCorrect = Object.values(this.state.classRecords).reduce((s, r) => s + r.correct, 0);
    const overallAcc = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;
    const totalTests = Object.values(this.state.classRecords).reduce((s, r) => s + r.testsTaken, 0);
    const curCls = this.state.profile.currentClass;

    this.state.achievements.forEach(ach => {
      if (ach.id === 'first_step' && totalSolved >= 1) ach.unlocked = true;
      if (ach.id === 'solver_10' && totalSolved >= 10) ach.unlocked = true;
      if (ach.id === 'century' && totalSolved >= 50) ach.unlocked = true;
      if (ach.id === 'test_champ' && totalTests >= 1) ach.unlocked = true;
      if (ach.id === 'high_acc' && totalSolved >= 10 && overallAcc >= 80) ach.unlocked = true;
      if (ach.id === 'class8' && curCls >= 8) ach.unlocked = true;
      if (ach.id === 'class10' && curCls >= 10) ach.unlocked = true;
      if (ach.id === 'grad_12' && curCls >= 12 && this.state.classRecords[12].completed) ach.unlocked = true;
    });
  },

  // --------------------------------------------------------------------------
  // MODALS & CLASS SWITCHER
  // --------------------------------------------------------------------------
  openClassModal() {
    const container = document.getElementById('classSelectButtonsContainer');
    container.innerHTML = '';

    const cur = this.state.profile.currentClass;
    const viewing = this.state.profile.viewingClass;

    for (let c = 7; c <= 12; c++) {
      const rec = this.state.classRecords[c];
      const isViewing = c === viewing;
      const isCurrent = c === cur;

      const btn = document.createElement('button');
      btn.className = `btn ${isViewing ? 'btn-primary' : 'btn-secondary'}`;
      btn.style.width = '100%';
      btn.style.justifyContent = 'space-between';
      btn.style.marginBottom = '0.5rem';

      btn.innerHTML = `
        <span>Class ${c} ${isCurrent ? '(Your Grade)' : ''}</span>
        <span class="badge ${rec.unlocked ? 'badge-emerald' : 'badge-slate'}">
          ${rec.unlocked ? 'Unlocked' : 'Locked'}
        </span>
      `;

      btn.onclick = () => {
        this.state.profile.viewingClass = c;
        this.saveState();
        this.renderAll();
        this.generateNewPracticeQuestion();
        this.closeClassModal();
      };

      container.appendChild(btn);
    }

    document.getElementById('classModal').classList.add('open');
  },

  closeClassModal() {
    document.getElementById('classModal').classList.remove('open');
  },

  openResetModal() {
    document.getElementById('resetModal').classList.add('open');
  },

  closeResetModal() {
    document.getElementById('resetModal').classList.remove('open');
  },

  confirmResetProgress() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
    this.saveState();
    this.closeResetModal();
    this.renderAll();
    this.generateNewPracticeQuestion();
    alert('Student progress and academic history have been reset.');
  },

  downloadStandaloneHTML() {
    const a = document.createElement('a');
    a.href = '/standalone.html';
    a.download = 'eduascent_classes_7_12.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },

  // --------------------------------------------------------------------------
  // CONFETTI CANVAS ENGINE (Pure JS, zero libraries)
  // --------------------------------------------------------------------------
  initConfetti() {
    this.confettiCanvas = document.getElementById('confettiCanvas');
    if (!this.confettiCanvas) return;
    this.confettiCtx = this.confettiCanvas.getContext('2d');
    window.addEventListener('resize', () => {
      if (this.confettiCanvas) {
        this.confettiCanvas.width = window.innerWidth;
        this.confettiCanvas.height = window.innerHeight;
      }
    });
    this.confettiCanvas.width = window.innerWidth;
    this.confettiCanvas.height = window.innerHeight;
  },

  triggerConfetti() {
    if (!this.confettiCtx) return;
    const colors = ['#4f46e5', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6'];
    const particles = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: -20,
        size: Math.random() * 8 + 4,
        speedY: Math.random() * 4 + 3,
        speedX: (Math.random() - 0.5) * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360
      });
    }

    const ctx = this.confettiCtx;
    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let alive = false;
      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += 4;
        if (p.y < window.innerHeight) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };
    requestAnimationFrame(animate);
  }
};

// Global reference for onclick handlers in HTML
window.app = app;

// Auto-boot on load
window.addEventListener('DOMContentLoaded', () => {
  app.init();
});
