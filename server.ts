import crypto from 'crypto';
import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Server configuration & Admin credentials
// In production or configured env, ADMIN_PASSWORD comes from environment
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin_secret_pass';
const ADMIN_TOKENS = new Set<string>();

// In-memory educational content store initialized with data
// (Admin can modify, add, edit, or delete questions)
interface QuestionItem {
  id: string;
  classLevel: number;
  subjectId: string;
  subStream?: string;
  chapterId: string;
  chapterTitle?: string;
  type: string;
  difficulty: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

let adminQuestionsStore: QuestionItem[] = [];

// Seed sample admin questions if store is empty
function seedServerQuestions() {
  if (adminQuestionsStore.length === 0) {
    adminQuestionsStore = [
      {
        id: 'srv-q-1',
        classLevel: 7,
        subjectId: 'mathematics',
        chapterId: 'c7-math-1',
        chapterTitle: 'Integers & Operations',
        type: 'mcq',
        difficulty: 'easy',
        question: 'What is the additive identity for integers?',
        options: ['0', '1', '-1', 'None of these'],
        correctAnswer: '0',
        explanation: 'Adding 0 to any integer does not change its identity (a + 0 = a).',
      },
      {
        id: 'srv-q-2',
        classLevel: 10,
        subjectId: 'science',
        chapterId: 'c10-sci-4',
        chapterTitle: 'Electricity & Magnetic Effects',
        type: 'mcq',
        difficulty: 'medium',
        question: 'What is the SI unit of electric potential difference?',
        options: ['Volt', 'Ampere', 'Ohm', 'Watt'],
        correctAnswer: 'Volt',
        explanation: 'Electric potential difference (voltage) is measured in Volts (V).',
      },
    ];
  }
}
seedServerQuestions();

// Log of test submissions and learning metrics
interface TestLog {
  id: string;
  classLevel: number;
  subjectId: string;
  score: number;
  total: number;
  percentage: number;
  timestamp: string;
}
const serverTestLogs: TestLog[] = [];

// Middleware: Authenticate Admin Token
function requireAdmin(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin token required.' });
  }

  const token = authHeader.split(' ')[1];
  if (!ADMIN_TOKENS.has(token)) {
    return res.status(403).json({ error: 'Forbidden. Invalid or expired admin token.' });
  }

  next();
}

// ---------------- API ROUTES ----------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    platform: 'Class 7-12 Learning & Practice Platform',
  });
});

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect administrator password' });
  }

  // Generate secure random session token
  const token = crypto.randomBytes(32).toString('hex');
  ADMIN_TOKENS.add(token);

  res.json({
    success: true,
    token,
    message: 'Admin authentication successful',
  });
});

// Admin Verify
app.get('/api/admin/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }

  const token = authHeader.split(' ')[1];
  const valid = ADMIN_TOKENS.has(token);
  res.json({ valid });
});

// Admin Logout
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    ADMIN_TOKENS.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// Get Content Statistics (Admin only)
app.get('/api/admin/stats', requireAdmin, (req: Request, res: Response) => {
  res.json({
    totalCustomQuestions: adminQuestionsStore.length,
    testsLogged: serverTestLogs.length,
    averageTestScore:
      serverTestLogs.length > 0
        ? Math.round(
            serverTestLogs.reduce((a, b) => a + b.percentage, 0) / serverTestLogs.length
          )
        : 0,
    recentTests: serverTestLogs.slice(-10).reverse(),
  });
});

// Get Admin Questions
app.get('/api/admin/questions', requireAdmin, (req: Request, res: Response) => {
  const { classLevel, subjectId } = req.query;
  let result = [...adminQuestionsStore];

  if (classLevel) {
    result = result.filter((q) => q.classLevel === Number(classLevel));
  }
  if (subjectId) {
    result = result.filter((q) => q.subjectId === subjectId);
  }

  res.json({ questions: result });
});

// Add New Question (Admin only)
app.post('/api/admin/questions', requireAdmin, (req: Request, res: Response) => {
  const {
    classLevel,
    subjectId,
    chapterId,
    chapterTitle,
    type,
    difficulty,
    question,
    options,
    correctAnswer,
    explanation,
  } = req.body;

  if (!classLevel || !subjectId || !question || !correctAnswer) {
    return res.status(400).json({ error: 'Missing required question fields' });
  }

  const newQuestion: QuestionItem = {
    id: `srv-q-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    classLevel: Number(classLevel),
    subjectId,
    chapterId: chapterId || 'general',
    chapterTitle: chapterTitle || 'General Topic',
    type: type || 'mcq',
    difficulty: difficulty || 'medium',
    question: question.trim(),
    options: Array.isArray(options) ? options : undefined,
    correctAnswer: String(correctAnswer).trim(),
    explanation: explanation ? String(explanation).trim() : 'Standard curricular explanation.',
  };

  adminQuestionsStore.unshift(newQuestion);
  res.status(201).json({ success: true, question: newQuestion });
});

// Edit Question (Admin only)
app.put('/api/admin/questions/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = adminQuestionsStore.findIndex((q) => q.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Question not found' });
  }

  const updated = {
    ...adminQuestionsStore[index],
    ...req.body,
    id, // protect id
  };

  adminQuestionsStore[index] = updated;
  res.json({ success: true, question: updated });
});

// Delete Question (Admin only)
app.delete('/api/admin/questions/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLength = adminQuestionsStore.length;
  adminQuestionsStore = adminQuestionsStore.filter((q) => q.id !== id);

  if (adminQuestionsStore.length === initialLength) {
    return res.status(404).json({ error: 'Question not found' });
  }

  res.json({ success: true, message: 'Question deleted successfully' });
});

// Student log test completion (public, no admin token required)
app.post('/api/stats/test-submit', (req: Request, res: Response) => {
  const { classLevel, subjectId, score, total, percentage } = req.body;
  if (typeof percentage === 'number') {
    const log: TestLog = {
      id: `tlog-${Date.now()}`,
      classLevel: Number(classLevel) || 7,
      subjectId: String(subjectId) || 'general',
      score: Number(score) || 0,
      total: Number(total) || 1,
      percentage: Math.round(percentage),
      timestamp: new Date().toISOString(),
    };
    serverTestLogs.push(log);
  }
  res.json({ success: true });
});

// Standalone Single-File HTML Routes
app.get('/standalone.html', (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'public', 'standalone.html');
  res.sendFile(filePath);
});

app.get('/standalone', (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'public', 'standalone.html');
  res.sendFile(filePath);
});

app.get('/api/download-standalone', (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'public', 'standalone.html');
  res.download(filePath, 'eduascent_standalone.html');
});

// ---------------- VITE MIDDLEWARE / STATIC FILES ----------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Class 7-12 Educational Platform server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
