export type ClassLevel = 7 | 8 | 9 | 10 | 11 | 12;

export type SubjectId =
  | 'mathematics'
  | 'science'
  | 'social_science'
  | 'english'
  | 'hindi'
  | 'computer';

export type SubStream =
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'history'
  | 'civics'
  | 'geography'
  | 'grammar'
  | 'literature'
  | 'reading'
  | 'writing'
  | 'vyakaran'
  | 'gadya_padya'
  | 'programming'
  | 'hardware_software'
  | 'general';

export type QuestionType =
  | 'mcq'
  | 'true_false'
  | 'fill_blank'
  | 'numerical'
  | 'match'
  | 'short_answer';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface MatchPair {
  left: string;
  right: string;
}

export interface Question {
  id: string;
  classLevel: ClassLevel;
  subjectId: SubjectId;
  subStream?: SubStream;
  chapterId: string;
  chapterTitle?: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  question: string;
  options?: string[];
  correctAnswer: string; // For MCQ: option string, For numerical/fill: exact or normalized value, For true_false: "True" or "False"
  explanation: string;
  matchPairs?: MatchPair[];
  numericalTolerance?: number; // e.g. 0.1
}

export interface Chapter {
  id: string;
  classLevel: ClassLevel;
  subjectId: SubjectId;
  subStream?: SubStream;
  title: string;
  hindiTitle?: string;
  description: string;
  keyConcepts: string[];
  order: number;
}

export interface SubjectMeta {
  id: SubjectId;
  name: string;
  hindiName: string;
  shortDesc: string;
  icon: string;
  badgeColor: string;
  subStreams?: { id: SubStream; name: string }[];
}

export interface StudentProfile {
  id: string;
  name: string;
  about: string;
  currentClass: ClassLevel;
  avatarSeed: string;
  registeredDate: string;
  lastActiveDate: string;
  currentAcademicYear: string;
}

export interface ClassAcademicRecord {
  classLevel: ClassLevel;
  academicYear: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  completedAt?: string;
  questionsAnswered: number;
  correctAnswers: number;
  completedChapterIds: string[];
  testsAttempted: number;
  averageScorePercentage: number;
}

export interface TestResult {
  id: string;
  testId: string;
  testTitle: string;
  classLevel: ClassLevel;
  subjectId: SubjectId;
  date: string;
  academicYear: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpentSeconds: number;
  rating: 'Excellent!' | 'Good Job!' | 'Keep Practicing!';
  details: {
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'practice' | 'tests' | 'class' | 'streak';
  unlocked: boolean;
  unlockedAt?: string;
  progressCurrent: number;
  progressTarget: number;
}

export interface StudentState {
  profile: StudentProfile;
  classRecords: Record<ClassLevel, ClassAcademicRecord>;
  testResults: TestResult[];
  achievements: Achievement[];
  streakDays: number;
  lastPracticeDate: string;
  recentPracticeHistory: {
    questionId: string;
    classLevel: ClassLevel;
    subjectId: SubjectId;
    isCorrect: boolean;
    timestamp: string;
  }[];
}

export interface TestDefinition {
  id: string;
  title: string;
  classLevel: ClassLevel;
  subjectId: SubjectId;
  chapterId?: string;
  durationMinutes: number;
  questionCount: number;
  difficulty: DifficultyLevel;
  passingScore: number;
}
