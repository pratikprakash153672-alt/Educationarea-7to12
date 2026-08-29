import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_ACHIEVEMENTS } from '../data/achievementsData';
import {
  Achievement,
  ClassAcademicRecord,
  ClassLevel,
  StudentProfile,
  StudentState,
  TestResult,
} from '../types';

interface StudentContextType {
  state: StudentState;
  isProfileReady: boolean;
  viewingClass: ClassLevel;
  setViewingClass: (c: ClassLevel) => void;
  updateProfile: (name: string, about: string, chosenClass: ClassLevel) => void;
  recordPracticeAnswer: (qId: string, classLevel: ClassLevel, subjectId: any, isCorrect: boolean) => void;
  recordTestResult: (result: TestResult) => void;
  checkPromotionStatus: (classLevel: ClassLevel) => {
    isEligible: boolean;
    requirements: { label: string; current: number; required: number; isMet: boolean }[];
  };
  promoteStudent: () => { success: boolean; nextClass?: ClassLevel; isGraduated?: boolean };
  resetProgress: () => void;
}

const STORAGE_KEY = 'edu_learning_platform_student_state_v1';

const DEFAULT_ACADEMIC_YEAR = '2026–27';

function createDefaultClassRecords(startingClass: ClassLevel): Record<ClassLevel, ClassAcademicRecord> {
  const records: Partial<Record<ClassLevel, ClassAcademicRecord>> = {};
  const allClasses: ClassLevel[] = [7, 8, 9, 10, 11, 12];

  allClasses.forEach((lvl) => {
    records[lvl] = {
      classLevel: lvl,
      academicYear: DEFAULT_ACADEMIC_YEAR,
      isUnlocked: lvl <= startingClass,
      isCompleted: lvl < startingClass,
      questionsAnswered: 0,
      correctAnswers: 0,
      completedChapterIds: [],
      testsAttempted: 0,
      averageScorePercentage: 0,
    };
  });

  return records as Record<ClassLevel, ClassAcademicRecord>;
}

const StudentContext = createContext<StudentContextType | null>(null);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProfileReady, setIsProfileReady] = useState(false);
  const [viewingClass, setViewingClass] = useState<ClassLevel>(7);

  const [state, setState] = useState<StudentState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.profile?.name) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load student state', e);
    }

    // Uninitialized initial state
    return {
      profile: {
        id: `std-${Date.now()}`,
        name: '',
        about: '',
        currentClass: 7,
        avatarSeed: 'Felix',
        registeredDate: new Date().toISOString(),
        lastActiveDate: new Date().toISOString(),
        currentAcademicYear: DEFAULT_ACADEMIC_YEAR,
      },
      classRecords: createDefaultClassRecords(7),
      testResults: [],
      achievements: INITIAL_ACHIEVEMENTS,
      streakDays: 1,
      lastPracticeDate: new Date().toISOString().split('T')[0],
      recentPracticeHistory: [],
    };
  });

  useEffect(() => {
    if (state.profile.name.trim().length > 0) {
      setIsProfileReady(true);
      setViewingClass(state.profile.currentClass);
    } else {
      setIsProfileReady(false);
    }
  }, [state.profile.name, state.profile.currentClass]);

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to persist student state', e);
    }
  }, [state]);

  // Update profile
  const updateProfile = (name: string, about: string, chosenClass: ClassLevel) => {
    setState((prev) => {
      const updatedRecords = { ...prev.classRecords };
      const allClasses: ClassLevel[] = [7, 8, 9, 10, 11, 12];
      allClasses.forEach((lvl) => {
        if (!updatedRecords[lvl]) {
          updatedRecords[lvl] = {
            classLevel: lvl,
            academicYear: DEFAULT_ACADEMIC_YEAR,
            isUnlocked: lvl <= chosenClass,
            isCompleted: lvl < chosenClass,
            questionsAnswered: 0,
            correctAnswers: 0,
            completedChapterIds: [],
            testsAttempted: 0,
            averageScorePercentage: 0,
          };
        } else {
          if (lvl <= chosenClass) {
            updatedRecords[lvl].isUnlocked = true;
          }
        }
      });

      return {
        ...prev,
        profile: {
          ...prev.profile,
          name: name.trim(),
          about: about.trim(),
          currentClass: chosenClass,
          lastActiveDate: new Date().toISOString(),
        },
        classRecords: updatedRecords,
      };
    });
    setViewingClass(chosenClass);
    setIsProfileReady(true);
  };

  // Practice tracking & achievement checking
  const recordPracticeAnswer = (
    questionId: string,
    classLevel: ClassLevel,
    subjectId: any,
    isCorrect: boolean
  ) => {
    setState((prev) => {
      const classRecord = prev.classRecords[classLevel] || {
        classLevel,
        academicYear: prev.profile.currentAcademicYear,
        isUnlocked: true,
        isCompleted: false,
        questionsAnswered: 0,
        correctAnswers: 0,
        completedChapterIds: [],
        testsAttempted: 0,
        averageScorePercentage: 0,
      };

      const updatedRecord: ClassAcademicRecord = {
        ...classRecord,
        questionsAnswered: classRecord.questionsAnswered + 1,
        correctAnswers: classRecord.correctAnswers + (isCorrect ? 1 : 0),
      };

      // Recalculate streak
      const today = new Date().toISOString().split('T')[0];
      let newStreak = prev.streakDays;
      if (prev.lastPracticeDate !== today) {
        newStreak += 1;
      }

      // Check achievements
      const recordsList = Object.values(prev.classRecords) as ClassAcademicRecord[];
      const totalAnswered =
        recordsList.reduce((acc: number, r: ClassAcademicRecord) => acc + (r.questionsAnswered || 0), 0) + 1;
      const totalCorrect =
        recordsList.reduce((acc: number, r: ClassAcademicRecord) => acc + (r.correctAnswers || 0), 0) +
        (isCorrect ? 1 : 0);
      const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

      const updatedAchievements = prev.achievements.map((ach) => {
        if (ach.unlocked) return ach;
        let unlocked = false;
        let cur = ach.progressCurrent;

        if (ach.id === 'questions-100') {
          cur = totalAnswered;
          if (cur >= ach.progressTarget) unlocked = true;
        } else if (ach.id === 'accuracy-90') {
          cur = overallAccuracy;
          if (totalAnswered >= 20 && overallAccuracy >= 90) unlocked = true;
        } else if (ach.id === 'streak-7') {
          cur = newStreak;
          if (cur >= 7) unlocked = true;
        }

        return {
          ...ach,
          progressCurrent: cur,
          unlocked: unlocked || ach.unlocked,
          unlockedAt: unlocked && !ach.unlocked ? new Date().toISOString() : ach.unlockedAt,
        };
      });

      return {
        ...prev,
        streakDays: newStreak,
        lastPracticeDate: today,
        classRecords: {
          ...prev.classRecords,
          [classLevel]: updatedRecord,
        },
        achievements: updatedAchievements,
        recentPracticeHistory: [
          {
            questionId,
            classLevel,
            subjectId,
            isCorrect,
            timestamp: new Date().toISOString(),
          },
          ...prev.recentPracticeHistory.slice(0, 49),
        ],
      };
    });
  };

  // Test recording & achievement checking
  const recordTestResult = (result: TestResult) => {
    setState((prev) => {
      const classRecord = prev.classRecords[result.classLevel] || {
        classLevel: result.classLevel,
        academicYear: result.academicYear,
        isUnlocked: true,
        isCompleted: false,
        questionsAnswered: 0,
        correctAnswers: 0,
        completedChapterIds: [],
        testsAttempted: 0,
        averageScorePercentage: 0,
      };

      const prevTotalTests = classRecord.testsAttempted;
      const prevAvg = classRecord.averageScorePercentage;
      const newAvg = Math.round((prevAvg * prevTotalTests + result.percentage) / (prevTotalTests + 1));

      const updatedRecord: ClassAcademicRecord = {
        ...classRecord,
        testsAttempted: prevTotalTests + 1,
        averageScorePercentage: newAvg,
        questionsAnswered: classRecord.questionsAnswered + result.totalQuestions,
        correctAnswers: classRecord.correctAnswers + result.score,
      };

      // Check achievements for tests
      const updatedAchievements = prev.achievements.map((ach) => {
        let unlocked = ach.unlocked;
        let cur = ach.progressCurrent;

        if (ach.id === 'first-test') {
          cur = prev.testResults.length + 1;
          unlocked = true;
        } else if (ach.id === 'perfect-score') {
          if (result.percentage === 100) {
            cur = 1;
            unlocked = true;
          }
        }

        return {
          ...ach,
          progressCurrent: cur,
          unlocked,
          unlockedAt: unlocked && !ach.unlocked ? new Date().toISOString() : ach.unlockedAt,
        };
      });

      return {
        ...prev,
        testResults: [result, ...prev.testResults],
        classRecords: {
          ...prev.classRecords,
          [result.classLevel]: updatedRecord,
        },
        achievements: updatedAchievements,
      };
    });
  };

  // Promotion requirements evaluator
  const checkPromotionStatus = (classLevel: ClassLevel) => {
    const record = state.classRecords[classLevel];
    const questionsAnswered = record?.questionsAnswered || 0;
    const testsAttempted = record?.testsAttempted || 0;
    const avgScore = record?.averageScorePercentage || 0;

    const reqs = [
      {
        label: 'Solve at least 15 practice questions',
        current: questionsAnswered,
        required: 15,
        isMet: questionsAnswered >= 15,
      },
      {
        label: 'Attempt at least 1 comprehensive test',
        current: testsAttempted,
        required: 1,
        isMet: testsAttempted >= 1,
      },
      {
        label: 'Maintain at least 50% test score or accuracy',
        current: avgScore,
        required: 50,
        isMet: avgScore >= 50 || (record?.correctAnswers || 0) >= 8,
      },
    ];

    const isEligible = reqs.every((r) => r.isMet);
    return { isEligible, requirements: reqs };
  };

  // Class promotion execution
  const promoteStudent = (): { success: boolean; nextClass?: ClassLevel; isGraduated?: boolean } => {
    const curClass = state.profile.currentClass;

    if (curClass === 12) {
      // Completed Class 12!
      setState((prev) => {
        const curRecord = prev.classRecords[12];
        const updatedRecord = {
          ...curRecord,
          isCompleted: true,
          completedAt: new Date().toISOString(),
        };

        const updatedAchievements = prev.achievements.map((ach) => {
          if (ach.id === 'class-12-grad' || ach.id === 'class-completed') {
            return {
              ...ach,
              unlocked: true,
              unlockedAt: ach.unlockedAt || new Date().toISOString(),
              progressCurrent: ach.progressTarget,
            };
          }
          return ach;
        });

        return {
          ...prev,
          classRecords: {
            ...prev.classRecords,
            12: updatedRecord,
          },
          achievements: updatedAchievements,
        };
      });

      return { success: true, isGraduated: true };
    }

    const nextClass = (curClass + 1) as ClassLevel;

    setState((prev) => {
      const curRecord = prev.classRecords[curClass];
      const updatedCurRecord: ClassAcademicRecord = {
        ...curRecord,
        isCompleted: true,
        completedAt: new Date().toISOString(),
      };

      const nextRecord = prev.classRecords[nextClass] || {
        classLevel: nextClass,
        academicYear: DEFAULT_ACADEMIC_YEAR,
        isUnlocked: true,
        isCompleted: false,
        questionsAnswered: 0,
        correctAnswers: 0,
        completedChapterIds: [],
        testsAttempted: 0,
        averageScorePercentage: 0,
      };

      const updatedNextRecord: ClassAcademicRecord = {
        ...nextRecord,
        isUnlocked: true,
      };

      const updatedAchievements = prev.achievements.map((ach) => {
        if (ach.id === 'class-completed') {
          return {
            ...ach,
            unlocked: true,
            unlockedAt: ach.unlockedAt || new Date().toISOString(),
            progressCurrent: 1,
          };
        }
        return ach;
      });

      return {
        ...prev,
        profile: {
          ...prev.profile,
          currentClass: nextClass,
          lastActiveDate: new Date().toISOString(),
        },
        classRecords: {
          ...prev.classRecords,
          [curClass]: updatedCurRecord,
          [nextClass]: updatedNextRecord,
        },
        achievements: updatedAchievements,
      };
    });

    setViewingClass(nextClass);
    return { success: true, nextClass };
  };

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      profile: {
        id: `std-${Date.now()}`,
        name: '',
        about: '',
        currentClass: 7,
        avatarSeed: 'Felix',
        registeredDate: new Date().toISOString(),
        lastActiveDate: new Date().toISOString(),
        currentAcademicYear: DEFAULT_ACADEMIC_YEAR,
      },
      classRecords: createDefaultClassRecords(7),
      testResults: [],
      achievements: INITIAL_ACHIEVEMENTS,
      streakDays: 1,
      lastPracticeDate: new Date().toISOString().split('T')[0],
      recentPracticeHistory: [],
    });
    setIsProfileReady(false);
  };

  return (
    <StudentContext.Provider
      value={{
        state,
        isProfileReady,
        viewingClass,
        setViewingClass,
        updateProfile,
        recordPracticeAnswer,
        recordTestResult,
        checkPromotionStatus,
        promoteStudent,
        resetProgress,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};
