import { ClassLevel, DifficultyLevel, Question, SubjectId } from '../types';
import { CHAPTERS_DATABASE } from './curriculumData';
import { SEEDED_QUESTIONS } from './questionBank';

// Utility helper for random integer between min and max (inclusive)
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Utility to shuffle array
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Dynamic generators for endless questions
export function generateProceduralQuestion(
  classLevel: ClassLevel,
  subjectId: SubjectId,
  chapterId?: string,
  difficulty: DifficultyLevel = 'medium'
): Question {
  const timestamp = Date.now();
  const randomSuffix = randInt(1000, 9999);
  const qId = `dyn-${classLevel}-${subjectId}-${timestamp}-${randomSuffix}`;

  // Find relevant chapter or fallback
  const availableChapters = CHAPTERS_DATABASE.filter(
    (c) => c.classLevel === classLevel && c.subjectId === subjectId
  );
  const chapter = chapterId
    ? availableChapters.find((c) => c.id === chapterId) || availableChapters[0]
    : availableChapters[randInt(0, Math.max(0, availableChapters.length - 1))] || {
        id: `c${classLevel}-${subjectId}-gen`,
        title: 'Core Concepts & Problem Solving',
      };

  // MATHEMATICS PROCEDURAL GENERATOR
  if (subjectId === 'mathematics') {
    if (classLevel <= 8) {
      const mode = randInt(1, 4);
      if (mode === 1) {
        // Linear equation: a*x + b = c
        const a = randInt(2, 9);
        const x = randInt(2, 12);
        const b = randInt(3, 25);
        const c = a * x + b;
        const correct = x.toString();
        const wrong1 = (x + 1).toString();
        const wrong2 = (Math.max(1, x - 1)).toString();
        const wrong3 = (x + 2).toString();
        return {
          id: qId,
          classLevel,
          subjectId,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          type: 'mcq',
          difficulty,
          question: `Solve for the variable x in the equation: ${a}x + ${b} = ${c}`,
          options: shuffle([correct, wrong1, wrong2, wrong3]),
          correctAnswer: correct,
          explanation: `Subtract ${b} from both sides: ${a}x = ${c - b}. Divide by ${a}: x = ${c - b} ÷ ${a} = ${x}.`,
        };
      } else if (mode === 2) {
        // Perimeter & Area
        const length = randInt(6, 25);
        const width = randInt(4, 18);
        const area = length * width;
        const correct = area.toString();
        return {
          id: qId,
          classLevel,
          subjectId,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          type: 'numerical',
          difficulty,
          question: `A rectangular garden has a length of ${length} m and a width of ${width} m. Calculate its total area in square meters (m²).`,
          correctAnswer: correct,
          explanation: `Area of a rectangle = Length × Breadth = ${length} m × ${width} m = ${area} m².`,
        };
      } else if (mode === 3) {
        // Exponents
        const base = randInt(2, 5);
        const exp1 = randInt(2, 4);
        const exp2 = randInt(2, 3);
        const sumExp = exp1 + exp2;
        const correctVal = Math.pow(base, sumExp).toString();
        return {
          id: qId,
          classLevel,
          subjectId,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          type: 'mcq',
          difficulty,
          question: `Simplify using laws of exponents: ${base}^${exp1} × ${base}^${exp2}`,
          options: shuffle([
            `${base}^${sumExp} (= ${correctVal})`,
            `${base}^${exp1 * exp2}`,
            `${base * base}^${sumExp}`,
            `${base}^${Math.abs(exp1 - exp2)}`,
          ]),
          correctAnswer: `${base}^${sumExp} (= ${correctVal})`,
          explanation: `By exponent law a^m × a^n = a^(m+n): ${base}^${exp1} × ${base}^${exp2} = ${base}^(${exp1}+${exp2}) = ${base}^${sumExp} = ${correctVal}.`,
        };
      } else {
        // Integers subtraction
        const n1 = randInt(-30, -5);
        const n2 = randInt(10, 45);
        const ans = (n1 - n2).toString();
        return {
          id: qId,
          classLevel,
          subjectId,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          type: 'fill_blank',
          difficulty,
          question: `Evaluate the expression: (${n1}) - (${n2}) = ______`,
          correctAnswer: ans,
          explanation: `Subtracting a positive integer is equivalent to adding its negative: ${n1} + (-${n2}) = ${ans}.`,
        };
      }
    } else if (classLevel <= 10) {
      const mode = randInt(1, 3);
      if (mode === 1) {
        // AP series
        const a = randInt(3, 15);
        const d = randInt(2, 7);
        const n = randInt(8, 20);
        const an = a + (n - 1) * d;
        const correct = an.toString();
        return {
          id: qId,
          classLevel,
          subjectId,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          type: 'numerical',
          difficulty,
          question: `Given an Arithmetic Progression (AP) with first term a = ${a} and common difference d = ${d}, find the ${n}th term.`,
          correctAnswer: correct,
          explanation: `Using formula a_n = a + (n - 1)d: a_${n} = ${a} + (${n} - 1) × ${d} = ${a} + ${n - 1} × ${d} = ${an}.`,
        };
      } else if (mode === 2) {
        // Quadratic discriminant
        const a = randInt(1, 3);
        const b = randInt(4, 9);
        const c = randInt(1, 4);
        const disc = b * b - 4 * a * c;
        const correct = disc.toString();
        return {
          id: qId,
          classLevel,
          subjectId,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          type: 'numerical',
          difficulty,
          question: `Calculate the discriminant D (b² - 4ac) of the quadratic equation: ${a === 1 ? '' : a}x² + ${b}x + ${c} = 0.`,
          correctAnswer: correct,
          explanation: `D = b² - 4ac = (${b})² - 4(${a})(${c}) = ${b * b} - ${4 * a * c} = ${disc}.`,
        };
      } else {
        // Trigonometry
        const angles = [
          { name: 'sin(30°)', val: '1/2' },
          { name: 'cos(60°)', val: '1/2' },
          { name: 'tan(45°)', val: '1' },
          { name: 'sin(90°)', val: '1' },
          { name: 'cos(0°)', val: '1' },
        ];
        const pick = angles[randInt(0, angles.length - 1)];
        return {
          id: qId,
          classLevel,
          subjectId,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          type: 'mcq',
          difficulty,
          question: `What is the exact standard value of ${pick.name}?`,
          options: shuffle(['1/2', '√3/2', '1', '1/√2']),
          correctAnswer: pick.val,
          explanation: `From standard trigonometric ratio tables, ${pick.name} = ${pick.val}.`,
        };
      }
    } else {
      // Class 11 & 12 Math
      const mode = randInt(1, 3);
      if (mode === 1) {
        // Matrix Determinant 2x2
        const a = randInt(1, 6);
        const b = randInt(1, 6);
        const c = randInt(1, 6);
        const d = randInt(1, 6);
        const det = a * d - b * c;
        return {
          id: qId,
          classLevel,
          subjectId,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          type: 'numerical',
          difficulty,
          question: `Evaluate the 2×2 matrix determinant: | [${a}, ${b}], [${c}, ${d}] |`,
          correctAnswer: det.toString(),
          explanation: `Determinant = (a × d) - (b × c) = (${a} × ${d}) - (${b} × ${c}) = ${a * d} - ${b * c} = ${det}.`,
        };
      } else if (mode === 2) {
        // Combinations nCr
        const n = randInt(4, 7);
        const r = 2;
        const val = (n * (n - 1)) / 2;
        return {
          id: qId,
          classLevel,
          subjectId,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          type: 'numerical',
          difficulty,
          question: `Calculate the combination ⁿC₂ for n = ${n}:`,
          correctAnswer: val.toString(),
          explanation: `ⁿC₂ = n! / (2! × (n-2)!) = (${n} × ${n - 1}) / 2 = ${val}.`,
        };
      } else {
        // Derivative power rule
        const coeff = randInt(2, 6);
        const power = randInt(3, 5);
        const newCoeff = coeff * power;
        const newPower = power - 1;
        return {
          id: qId,
          classLevel,
          subjectId,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          type: 'mcq',
          difficulty,
          question: `Find the first derivative d/dx (${coeff}x^${power}) with respect to x:`,
          options: shuffle([
            `${newCoeff}x^${newPower}`,
            `${coeff}x^${newPower}`,
            `${newCoeff}x^${power}`,
            `${coeff * power}x^${power + 1}`,
          ]),
          correctAnswer: `${newCoeff}x^${newPower}`,
          explanation: `Using the power rule d/dx(a*x^n) = a*n*x^(n-1): (${coeff} × ${power})x^(${power}-1) = ${newCoeff}x^${newPower}.`,
        };
      }
    }
  }

  // SCIENCE PROCEDURAL GENERATOR
  if (subjectId === 'science') {
    const mode = randInt(1, 3);
    if (mode === 1) {
      // Ohm's law / Electricity
      const i = randInt(1, 6);
      const r = randInt(3, 20);
      const v = i * r;
      return {
        id: qId,
        classLevel,
        subjectId,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        type: 'numerical',
        difficulty,
        question: `A resistor of ${r} Ω draws a current of ${i} A. What is the potential difference (voltage in Volts) across its ends?`,
        correctAnswer: v.toString(),
        explanation: `By Ohm's Law: V = I × R = ${i} A × ${r} Ω = ${v} Volts.`,
      };
    } else if (mode === 2) {
      // Speed, distance, time
      const speed = randInt(40, 90);
      const time = randInt(2, 6);
      const dist = speed * time;
      return {
        id: qId,
        classLevel,
        subjectId,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        type: 'numerical',
        difficulty,
        question: `An express train travels at a uniform speed of ${speed} km/h for ${time} hours. What total distance (in km) does it cover?`,
        correctAnswer: dist.toString(),
        explanation: `Distance = Speed × Time = ${speed} km/h × ${time} h = ${dist} km.`,
      };
    } else {
      // Chemical & biological facts
      const facts = [
        {
          q: 'What is the standard chemical formula of sodium chloride (table salt)?',
          ans: 'NaCl',
          opts: ['NaCl', 'Na₂SO₄', 'HCl', 'KCl'],
          exp: 'Table salt consists of sodium (Na⁺) and chloride (Cl⁻) in 1:1 ratio: NaCl.',
        },
        {
          q: 'Which human blood cells are primary defenders responsible for immunity and fighting infections?',
          ans: 'White Blood Cells (Leukocytes)',
          opts: ['White Blood Cells (Leukocytes)', 'Red Blood Cells (Erythrocytes)', 'Platelets (Thrombocytes)', 'Plasma'],
          exp: 'White blood cells fight pathogenic bacteria, viruses, and foreign invaders.',
        },
        {
          q: 'What is the acceleration due to gravity (g) near the Earth’s surface approximated as?',
          ans: '9.8 m/s²',
          opts: ['9.8 m/s²', '8.9 m/s²', '11.2 m/s²', '6.67 m/s²'],
          exp: 'Standard acceleration due to Earth’s gravitational attraction is ~9.8 m/s².',
        },
        {
          q: 'Which gas is predominantly released by green plants during daytime photosynthesis?',
          ans: 'Oxygen (O₂)',
          opts: ['Oxygen (O₂)', 'Carbon Dioxide (CO₂)', 'Nitrogen (N₂)', 'Methane (CH₄)'],
          exp: 'In the presence of sunlight and chlorophyll, water and CO₂ produce glucose and release O₂.',
        },
      ];
      const pick = facts[randInt(0, facts.length - 1)];
      return {
        id: qId,
        classLevel,
        subjectId,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        type: 'mcq',
        difficulty,
        question: pick.q,
        options: shuffle(pick.opts),
        correctAnswer: pick.ans,
        explanation: pick.exp,
      };
    }
  }

  // ENGLISH PROCEDURAL GENERATOR
  if (subjectId === 'english') {
    const vocabList = [
      { word: 'Benevolent', type: 'synonym', ans: 'Kind & Generous', opts: ['Kind & Generous', 'Cruel', 'Hostile', 'Greedy'], exp: 'Benevolent means well-meaning and kindly.' },
      { word: 'Arduous', type: 'synonym', ans: 'Difficult & Tiring', opts: ['Difficult & Tiring', 'Simple', 'Quick', 'Relaxing'], exp: 'Arduous means requiring strenuous effort or great labor.' },
      { word: 'Candid', type: 'synonym', ans: 'Frank & Truthful', opts: ['Frank & Truthful', 'Deceitful', 'Hesitant', 'Secretive'], exp: 'Candid describes an honest, forthright, and straightforward person.' },
      { word: 'Obsolete', type: 'synonym', ans: 'Outdated & No longer in use', opts: ['Outdated & No longer in use', 'Modern', 'Fashionable', 'Priceless'], exp: 'Obsolete refers to things that have been superseded by new versions.' },
      { word: 'Ephemeral', type: 'antonym', ans: 'Permanent', opts: ['Permanent', 'Short-lived', 'Fleeting', 'Transient'], exp: 'Ephemeral means lasting a very short time; its opposite is permanent or enduring.' },
      { word: 'Courageous', type: 'antonym', ans: 'Timid / Cowardly', opts: ['Timid / Cowardly', 'Brave', 'Valiant', 'Heroic'], exp: 'The antonym of courageous is cowardly or timid.' },
    ];
    const item = vocabList[randInt(0, vocabList.length - 1)];
    return {
      id: qId,
      classLevel,
      subjectId,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      type: 'mcq',
      difficulty,
      question: `Choose the correct ${item.type.toUpperCase()} for the word: "${item.word}"`,
      options: shuffle(item.opts),
      correctAnswer: item.ans,
      explanation: item.exp,
    };
  }

  // HINDI PROCEDURAL GENERATOR
  if (subjectId === 'hindi') {
    const hindiItems = [
      {
        q: '‘सूर्य’ का निम्नलिखित में से सही पर्यायवाची शब्द कौन-सा है?',
        ans: 'दिनकर',
        opts: ['दिनकर', 'निशाकर', 'वारिद', 'पयोधि'],
        exp: 'सूर्य के पर्यायवाची हैं: रवि, दिनकर, भास्कर, भानु।',
      },
      {
        q: '‘अमृत’ का विलोम शब्द क्या होगा?',
        ans: 'विष',
        opts: ['विष', 'पीयूष', 'सुधा', 'जल'],
        exp: 'अमृत (जीवनदायी) का विलोम शब्द ‘विष’ (हलाहल) है।',
      },
      {
        q: '‘आंखों का तारा होना’ मुहावरे का सही अर्थ क्या है?',
        ans: 'बहुत प्यारा होना',
        opts: ['बहुत प्यारा होना', 'अंधा होना', 'धोखा देना', 'गुस्सा होना'],
        exp: '‘आंखों का तारा होना’ का भावार्थ होता है अत्यंत प्रिय या प्यारा होना।',
      },
      {
        q: '‘देवालय’ शब्द का सही संधि-विच्छेद क्या है?',
        ans: 'देव + आलय',
        opts: ['देव + आलय', 'देवा + लय', 'देव + लय', 'दे + आलय'],
        exp: 'देव + आलय = देवालय (दीर्घ स्वर संधि: अ + आ = आ)।',
      },
      {
        q: '‘कमल नयन’ में कौन-सा समास है?',
        ans: 'कर्मधारय समास',
        opts: ['कर्मधारय समास', 'द्वंद्व समास', 'द्विगु समास', 'अव्ययीभाव समास'],
        exp: 'कमल के समान नयन - जहां उपमान और उपमेय का संबंध हो, वहां कर्मधारय समास होता है।',
      },
    ];
    const pick = hindiItems[randInt(0, hindiItems.length - 1)];
    return {
      id: qId,
      classLevel,
      subjectId,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      type: 'mcq',
      difficulty,
      question: pick.q,
      options: shuffle(pick.opts),
      correctAnswer: pick.ans,
      explanation: pick.exp,
    };
  }

  // COMPUTER PROCEDURAL GENERATOR
  if (subjectId === 'computer') {
    const compModes = [
      {
        q: 'What is the output of the following Python expression: print(3 + 4 * 2)?',
        ans: '11',
        opts: ['11', '14', '7', 'Error'],
        exp: 'By Python operator precedence, multiplication (*) is evaluated before addition (+): 4 * 2 = 8, then 3 + 8 = 11.',
      },
      {
        q: 'Which protocol is standardly used for secure, encrypted web communication in browsers?',
        ans: 'HTTPS',
        opts: ['HTTPS', 'HTTP', 'FTP', 'SMTP'],
        exp: 'HTTPS (Hypertext Transfer Protocol Secure) encrypts HTTP requests using SSL/TLS.',
      },
      {
        q: 'What data structure is utilized in Python to store unordered key-value pairs?',
        ans: 'Dictionary (dict)',
        opts: ['Dictionary (dict)', 'List', 'Tuple', 'String'],
        exp: 'Python dictionaries store associative key: value mappings accessed via keys in O(1) average time.',
      },
      {
        q: 'Which SQL command is used to delete an entire table along with its structure permanently?',
        ans: 'DROP TABLE',
        opts: ['DROP TABLE', 'DELETE TABLE', 'REMOVE TABLE', 'TRUNCATE TABLE'],
        exp: 'DROP TABLE removes the table definition and all rows completely from the database catalog.',
      },
    ];
    const pick = compModes[randInt(0, compModes.length - 1)];
    return {
      id: qId,
      classLevel,
      subjectId,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      type: 'mcq',
      difficulty,
      question: pick.q,
      options: shuffle(pick.opts),
      correctAnswer: pick.ans,
      explanation: pick.exp,
    };
  }

  // SOCIAL SCIENCE PROCEDURAL GENERATOR
  const socItems = [
    {
      q: 'Who is recognized as the Chief Architect and Chairman of the Drafting Committee of the Indian Constitution?',
      ans: 'Dr. B. R. Ambedkar',
      opts: ['Dr. B. R. Ambedkar', 'Jawaharlal Nehru', 'Mahatma Gandhi', 'Sardar Vallabhbhai Patel'],
      exp: 'Dr. Bhimrao Ramji Ambedkar headed the Constituent Assembly’s Drafting Committee.',
    },
    {
      q: 'Which imaginary line of latitude at 23°30′ N divides India almost equally into two halves?',
      ans: 'Tropic of Cancer',
      opts: ['Tropic of Cancer', 'Equator', 'Tropic of Capricorn', 'Prime Meridian'],
      exp: 'The Tropic of Cancer (23°30’ N) passes across 8 states of India.',
    },
    {
      q: 'What is the minimum voting age for Indian citizens as per the 61st Constitutional Amendment Act?',
      ans: '18 years',
      opts: ['18 years', '21 years', '16 years', '25 years'],
      exp: 'The 61st Amendment (1988) reduced the universal adult franchise voting age from 21 to 18 years.',
    },
  ];
  const sPick = socItems[randInt(0, socItems.length - 1)];
  return {
    id: qId,
    classLevel,
    subjectId,
    chapterId: chapter.id,
    chapterTitle: chapter.title,
    type: 'mcq',
    difficulty,
    question: sPick.q,
    options: shuffle(sPick.opts),
    correctAnswer: sPick.ans,
    explanation: sPick.exp,
  };
}

// Next question selector from seeded pool + procedural generator
export function getNextPracticeQuestion(
  classLevel: ClassLevel,
  subjectId: SubjectId,
  chapterId?: string,
  difficulty?: DifficultyLevel,
  answeredQuestionIds: Set<string> = new Set()
): Question {
  // Find eligible seeded questions
  const filteredSeeded = SEEDED_QUESTIONS.filter((q) => {
    if (q.classLevel !== classLevel) return false;
    if (q.subjectId !== subjectId) return false;
    if (chapterId && q.chapterId !== chapterId) return false;
    if (difficulty && q.difficulty !== difficulty) return false;
    return !answeredQuestionIds.has(q.id);
  });

  // If unattempted seeded questions remain, return one randomly
  if (filteredSeeded.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredSeeded.length);
    return filteredSeeded[randomIndex];
  }

  // Otherwise, procedural generator creates fresh infinite questions!
  return generateProceduralQuestion(classLevel, subjectId, chapterId, difficulty);
}
