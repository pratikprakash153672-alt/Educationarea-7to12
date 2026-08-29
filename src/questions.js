/**
 * EduAscent Question Engine
 * Procedural & Curated Question Banks for Classes 7 to 12
 * Mathematics, Science, Social Science, English, Hindi, Computer Science
 */

export const QuestionEngine = {
  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  generateMath(clsLevel, difficulty = 'all') {
    const randInt = this.randInt;

    if (clsLevel === 7) {
      const a = randInt(-20, 25);
      const b = randInt(-20, 25);
      const ans = a + b;
      const wrong1 = ans + randInt(1, 4);
      const wrong2 = ans - randInt(1, 4);
      const wrong3 = a - b;
      return {
        subjectId: 'mathematics',
        chapterTitle: 'Integers & Real Numbers',
        difficulty: 'Easy',
        question: `Calculate the arithmetic sum: (${a}) + (${b})`,
        options: this.shuffle([ans.toString(), wrong1.toString(), wrong2.toString(), wrong3.toString()]),
        correctAnswer: ans.toString(),
        explanation: `When adding integers, ${a} + (${b}) equals ${ans}. Remember that adding a negative number is equivalent to subtraction.`
      };
    } else if (clsLevel === 8) {
      const m = randInt(2, 7);
      const x = randInt(2, 9);
      const c = randInt(3, 18);
      const rhs = m * x + c;
      const ans = x;
      return {
        subjectId: 'mathematics',
        chapterTitle: 'Linear Equations in One Variable',
        difficulty: 'Medium',
        question: `Solve for variable x in the algebraic equation: ${m}x + ${c} = ${rhs}`,
        options: this.shuffle([ans.toString(), (ans + 1).toString(), (ans - 1).toString(), (ans * 2).toString()]),
        correctAnswer: ans.toString(),
        explanation: `Step 1: Subtract ${c} from both sides: ${m}x = ${rhs} - ${c} = ${rhs - c}.\nStep 2: Divide both sides by ${m}: x = ${rhs - c} / ${m} = ${ans}.`
      };
    } else if (clsLevel === 9) {
      const base = randInt(4, 14);
      const height = randInt(4, 16);
      const area = 0.5 * base * height;
      return {
        subjectId: 'mathematics',
        chapterTitle: 'Geometry & Mensuration',
        difficulty: 'Medium',
        question: `Find the area of a right triangle with base = ${base} cm and altitude = ${height} cm.`,
        options: this.shuffle([`${area} cm²`, `${area + 6} cm²`, `${base * height} cm²`, `${area - 4} cm²`]),
        correctAnswer: `${area} cm²`,
        explanation: `Area of a triangle = 1/2 × base × height = 0.5 × ${base} × ${height} = ${area} cm².`
      };
    } else if (clsLevel === 10) {
      const p = randInt(2, 6);
      const q = randInt(2, 7);
      const sum = p + q;
      const prod = p * q;
      return {
        subjectId: 'mathematics',
        chapterTitle: 'Quadratic Equations & Roots',
        difficulty: 'Hard',
        question: `If the roots of quadratic equation x² - Sx + P = 0 are α = ${p} and β = ${q}, find the values of S and P:`,
        options: this.shuffle([
          `S = ${sum}, P = ${prod}`,
          `S = ${prod}, P = ${sum}`,
          `S = ${sum + 2}, P = ${prod - 2}`,
          `S = ${p - q}, P = ${prod}`
        ]),
        correctAnswer: `S = ${sum}, P = ${prod}`,
        explanation: `By Vieta's formulas for a monic quadratic equation:\nSum of roots S = α + β = ${p} + ${q} = ${sum}.\nProduct of roots P = α × β = ${p} × ${q} = ${prod}.`
      };
    } else if (clsLevel === 11) {
      const n = randInt(2, 6);
      const coeff = randInt(2, 5);
      const newCoeff = coeff * n;
      const newPow = n - 1;
      return {
        subjectId: 'mathematics',
        chapterTitle: 'Calculus: Differentiation Fundamentals',
        difficulty: 'Hard',
        question: `Find the first derivative dy/dx of the polynomial function y = ${coeff}x^${n}:`,
        options: this.shuffle([
          `${newCoeff}x^${newPow}`,
          `${coeff}x^${newPow}`,
          `${newCoeff}x^${n}`,
          `${coeff * (n + 1)}x^${n + 1}`
        ]),
        correctAnswer: `${newCoeff}x^${newPow}`,
        explanation: `Using the power rule of calculus: d/dx [c · x^n] = c · n · x^(n - 1) = ${coeff} · ${n} · x^${newPow} = ${newCoeff}x^${newPow}.`
      };
    } else {
      // Class 12
      const upper = randInt(2, 4);
      // Integral of 2x dx from 0 to upper = [x^2]_0^upper = upper^2
      const ans = upper * upper;
      return {
        subjectId: 'mathematics',
        chapterTitle: 'Integral Calculus & Definite Integrals',
        difficulty: 'Hard',
        question: `Evaluate the definite integral ∫ from 0 to ${upper} of (2x) dx:`,
        options: this.shuffle([`${ans}`, `${ans * 2}`, `${ans + 2}`, `${upper}`]),
        correctAnswer: `${ans}`,
        explanation: `∫ 2x dx = x² + C.\nEvaluating from 0 to ${upper}: [${upper}² - 0²] = ${ans}.`
      };
    }
  },

  generateScience(clsLevel) {
    const randInt = this.randInt;
    if (clsLevel <= 8) {
      const mass = randInt(3, 12);
      const acc = randInt(2, 7);
      const force = mass * acc;
      return {
        subjectId: 'science',
        chapterTitle: 'Force, Pressure & Motion',
        difficulty: 'Medium',
        question: `A vehicle of mass ${mass} kg accelerates forward at ${acc} m/s². What net horizontal force acts on it?`,
        options: this.shuffle([`${force} N`, `${force + 5} N`, `${force - 4} N`, `${mass + acc} N`]),
        correctAnswer: `${force} N`,
        explanation: `By Newton's Second Law of Motion: Net Force F = mass (m) × acceleration (a) = ${mass} kg × ${acc} m/s² = ${force} Newtons (N).`
      };
    } else if (clsLevel <= 10) {
      const v = randInt(12, 48);
      const r = randInt(2, 8);
      const i = (v / r).toFixed(1);
      return {
        subjectId: 'science',
        chapterTitle: 'Electricity & Circuits',
        difficulty: 'Hard',
        question: `According to Ohm's Law, what current flows through an electric resistor of ${r} Ω when a potential difference of ${v} V is applied?`,
        options: this.shuffle([`${i} A`, `${(Number(i) + 1.5).toFixed(1)} A`, `${(v * r)} A`, `${(r / v).toFixed(2)} A`]),
        correctAnswer: `${i} A`,
        explanation: `Ohm's Law states: V = I × R, therefore current I = V / R = ${v} V / ${r} Ω = ${i} Amperes (A).`
      };
    } else {
      // Class 11 & 12
      const pool = [
        { q: 'Which quantum principle dictates that no two identical fermions may occupy the same quantum state simultaneously?', a: 'Pauli Exclusion Principle', opts: ['Pauli Exclusion Principle', 'Heisenberg Uncertainty Principle', 'Hund’s Rule of Multiplicity', 'Aufbau Principle'], exp: 'Wolfgang Pauli formulated the exclusion principle in 1925 for electrons in atomic shells.' },
        { q: 'What is the SI unit of electric capacitance?', a: 'Farad (F)', opts: ['Farad (F)', 'Henry (H)', 'Tesla (T)', 'Weber (Wb)'], exp: 'The Farad (symbol F) is the SI unit of electrical capacitance, named after Michael Faraday.' },
        { q: 'In chemical kinetics, what effect does an ideal catalyst have on an exothermic reaction?', a: 'Lowers activation energy without altering ΔH', opts: ['Lowers activation energy without altering ΔH', 'Increases enthalpy change ΔH', 'Shifts chemical equilibrium toward products', 'Decreases the rate constant k'], exp: 'Catalysts provide an alternative reaction pathway with lower activation energy Ea, leaving overall enthalpy ΔH unchanged.' }
      ];
      const item = pool[Math.floor(Math.random() * pool.length)];
      return {
        subjectId: 'science',
        chapterTitle: 'Physics & Chemistry Senior Core',
        difficulty: 'Hard',
        question: item.q,
        options: this.shuffle([...item.opts]),
        correctAnswer: item.a,
        explanation: item.exp
      };
    }
  },

  generateSocialScience(clsLevel) {
    const pool = [
      { q: 'Who served as the Chairman of the Drafting Committee of the Indian Constitution?', a: 'Dr. B.R. Ambedkar', opts: ['Dr. B.R. Ambedkar', 'Mahatma Gandhi', 'Pt. Jawaharlal Nehru', 'Dr. Rajendra Prasad'], exp: 'Dr. Bhimrao Ramji Ambedkar served as the chairman of the Constitution Drafting Committee.' },
      { q: 'Which imaginary line of latitude divides the globe into the Northern and Southern Hemispheres?', a: 'The Equator (0°)', opts: ['The Equator (0°)', 'Prime Meridian (0°)', 'Tropic of Cancer (23.5° N)', 'Arctic Circle (66.5° N)'], exp: 'The Equator is the zero-degree latitude dividing Earth into the Northern and Southern hemispheres.' },
      { q: 'In which year did India adopt its written Constitution and become a sovereign Republic?', a: '1950', opts: ['1950', '1947', '1952', '1949'], exp: 'While adopted by the Constituent Assembly on 26 November 1949, the Constitution of India came into full effect on 26 January 1950.' },
      { q: 'Which sector of the economy includes agriculture, dairy, fishing, and forestry?', a: 'Primary Sector', opts: ['Primary Sector', 'Secondary Sector', 'Tertiary Sector', 'Quaternary Sector'], exp: 'The Primary Sector involves the direct extraction and harvesting of natural resources.' }
    ];
    const item = pool[Math.floor(Math.random() * pool.length)];
    return {
      subjectId: 'social_science',
      chapterTitle: 'History, Civics & Geography',
      difficulty: 'Medium',
      question: item.q,
      options: this.shuffle([...item.opts]),
      correctAnswer: item.a,
      explanation: item.exp
    };
  },

  generateEnglish(clsLevel) {
    const pool = [
      { q: 'Choose the correct preposition: "The scholarship ceremony will begin ___ 10:00 AM on Monday."', a: 'at', opts: ['at', 'on', 'in', 'during'], exp: 'We use the preposition "at" with precise clock times (e.g., at 10:00 AM).' },
      { q: 'Identify the passive voice of: "The teacher evaluated the research papers."', a: 'The research papers were evaluated by the teacher.', opts: ['The research papers were evaluated by the teacher.', 'The research papers had been evaluated by the teacher.', 'The research papers are evaluated by the teacher.', 'The teacher was evaluating the research papers.'], exp: 'Past simple active "evaluated" converts to "were evaluated" in the passive voice.' },
      { q: 'Which of the following words is a close antonym of "Meticulous"?', a: 'Careless', opts: ['Careless', 'Diligent', 'Scrupulous', 'Methodical'], exp: '"Meticulous" means showing great attention to detail; its opposite is "careless".' },
      { q: 'Identify the figure of speech: "The autumn leaves danced merrily across the courtyard."', a: 'Personification', opts: ['Personification', 'Metaphor', 'Hyperbole', 'Oxymoron'], exp: 'Giving human traits (dancing merrily) to non-human elements (leaves) is personification.' }
    ];
    const item = pool[Math.floor(Math.random() * pool.length)];
    return {
      subjectId: 'english',
      chapterTitle: 'Grammar, Syntax & Vocabulary',
      difficulty: 'Medium',
      question: item.q,
      options: this.shuffle([...item.opts]),
      correctAnswer: item.a,
      explanation: item.exp
    };
  },

  generateHindi(clsLevel) {
    const pool = [
      { q: '‘सूर्योदय’ शब्द का सही संधि-विच्छेद क्या होगा?', a: 'सूर्य + उदय', opts: ['सूर्य + उदय', 'सूर्यो + दय', 'सूर्य + दय', 'सूर्या + उदय'], exp: '‘सूर्य + उदय’ मिलकर गुण संधि के नियम से ‘सूर्योदय’ बनता है (अ/आ + उ = ओ)।' },
      { q: '‘दशानन’ (दस हैं आनन जिसके - रावण) में कौन-सा समास है?', a: 'बहुव्रीहि समास', opts: ['बहुव्रीहि समास', 'द्विगु समास', 'तत्पुरुष समास', 'कर्मधारय समास'], exp: 'जहाँ दोनों पद मिलकर किसी तीसरे विशेष संज्ञा (रावण) का बोध कराते हैं, वहाँ बहुव्रीहि समास होता है।' },
      { q: 'मुहावरा ‘अंगूठा दिखाना’ का सही अर्थ क्या है?', a: 'ऐन वक्त पर मना कर देना', opts: ['ऐन वक्त पर मना कर देना', 'मदद करना', 'चिढ़ाना', 'जीत जाना'], exp: '‘अंगूठा दिखाना’ का अर्थ होता है आवश्यकता के समय साफ़ इनकार कर देना।' },
      { q: '‘अनुराग’ शब्द का सही विलोम शब्द क्या है?', a: 'विराग', opts: ['विराग', 'द्वेष', 'घृणा', 'विमुख'], exp: '‘अनुराग’ (प्रेम) का प्रामाणिक विलोम ‘विराग’ (उदासीनता) होता है।' }
    ];
    const item = pool[Math.floor(Math.random() * pool.length)];
    return {
      subjectId: 'hindi',
      chapterTitle: 'हिंदी व्याकरण एवं साहित्य',
      difficulty: 'Medium',
      question: item.q,
      options: this.shuffle([...item.opts]),
      correctAnswer: item.a,
      explanation: item.exp
    };
  },

  generateComputer(clsLevel) {
    const pool = [
      { q: 'What is the output of the Python expression: `3 * (2 + 4) // 2`?', a: '9', opts: ['9', '9.0', '18', '7'], exp: 'Parenthesis evaluates first: (2 + 4) = 6. Then 3 * 6 = 18. Integer division 18 // 2 results in 9.' },
      { q: 'In binary numeral system, what decimal value does the 8-bit byte `00001101` represent?', a: '13', opts: ['13', '11', '15', '26'], exp: 'Powers of 2: 8 + 4 + 1 = 13.' },
      { q: 'Which fundamental data structure operates strictly under the First-In, First-Out (FIFO) principle?', a: 'Queue', opts: ['Queue', 'Stack', 'Binary Search Tree', 'Hash Map'], exp: 'A Queue adheres to FIFO, where the first element enqueued is the first dequeued.' },
      { q: 'Which SQL clause is used to filter records returned by an aggregate GROUP BY query?', a: 'HAVING', opts: ['HAVING', 'WHERE', 'ORDER BY', 'LIMIT'], exp: 'The HAVING clause filters aggregated groups, whereas WHERE filters individual rows before grouping.' }
    ];
    const item = pool[Math.floor(Math.random() * pool.length)];
    return {
      subjectId: 'computer',
      chapterTitle: 'Computer Science, Python & Logic',
      difficulty: 'Medium',
      question: item.q,
      options: this.shuffle([...item.opts]),
      correctAnswer: item.a,
      explanation: item.exp
    };
  },

  getQuestion(subjectId, clsLevel, difficulty) {
    switch (subjectId) {
      case 'mathematics': return this.generateMath(clsLevel, difficulty);
      case 'science': return this.generateScience(clsLevel);
      case 'social_science': return this.generateSocialScience(clsLevel);
      case 'english': return this.generateEnglish(clsLevel);
      case 'hindi': return this.generateHindi(clsLevel);
      case 'computer': return this.generateComputer(clsLevel);
      default: return this.generateMath(clsLevel, difficulty);
    }
  }
};
