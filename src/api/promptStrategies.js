// ============================================================
// PROMPT STRATEGIES ENGINE v1.0
// Advanced Prompt Engineering Techniques
// ============================================================

const PROMPT_STRATEGIES = {
    zero_shot: {
        id: 'zero_shot',
        name: { en: 'Zero-Shot', ar: 'بدون أمثلة' },
        icon: '⚡',
        description: {
            en: 'Direct instruction without examples. Best for simple, well-defined tasks.',
            ar: 'تعليمات مباشرة بدون أمثلة. الأفضل للمهام البسيطة المحددة.'
        },
        when: { en: 'Simple tasks, clear instructions', ar: 'مهام بسيطة، تعليمات واضحة' },
        difficulty: 'beginner',
        modifier: (prompt) => prompt, // No modification needed
        injection: '',
    },

    few_shot: {
        id: 'few_shot',
        name: { en: 'Few-Shot Learning', ar: 'تعلم بأمثلة قليلة' },
        icon: '📝',
        description: {
            en: 'Provide 2-3 examples to guide the AI. Dramatically improves output quality.',
            ar: 'قدم 2-3 أمثلة لتوجيه الذكاء الاصطناعي. يحسن جودة المخرجات بشكل كبير.'
        },
        when: { en: 'Specific format needed, quality matters', ar: 'تنسيق محدد مطلوب، الجودة مهمة' },
        difficulty: 'intermediate',
        injection: `

### FEW-SHOT EXAMPLES (Critical for Quality)
Before answering, study these examples carefully:

**EXAMPLE 1 — EXCELLENT OUTPUT:**
[Provide a high-quality example that matches the desired output format, tone, and depth]

**EXAMPLE 2 — ANOTHER GOOD OUTPUT:**
[Provide a different but equally excellent example showing variety]

**ANTI-EXAMPLE — DO NOT PRODUCE THIS:**
[Show a poor example and explain why it's bad]

Now, following the pattern demonstrated above, generate your response:`,
    },

    chain_of_thought: {
        id: 'chain_of_thought',
        name: { en: 'Chain-of-Thought (CoT)', ar: 'سلسلة التفكير' },
        icon: '🧠',
        description: {
            en: 'Force step-by-step reasoning. Essential for complex logic, math, and analysis.',
            ar: 'فرض التفكير خطوة بخطوة. ضروري للمنطق المعقد والرياضيات والتحليل.'
        },
        when: { en: 'Complex reasoning, math, multi-step problems', ar: 'تفكير معقد، رياضيات، مشاكل متعددة الخطوات' },
        difficulty: 'intermediate',
        injection: `

### REASONING PROTOCOL (Chain-of-Thought)
You MUST think step-by-step before providing your final answer.

MANDATORY PROCESS:
1. **UNDERSTAND:** Restate the problem in your own words. What exactly is being asked?
2. **DECOMPOSE:** Break the problem into smaller, manageable sub-problems.
3. **ANALYZE:** For each sub-problem:
   - What information do I have?
   - What information do I need?
   - What approach will work best?
4. **SOLVE:** Work through each sub-problem methodically, showing ALL reasoning.
5. **VERIFY:** Double-check your work. Does the answer make sense? Are there edge cases?
6. **SYNTHESIZE:** Combine sub-solutions into your final, clean answer.

Format your reasoning clearly with headers. Show your work.`,
    },

    tree_of_thought: {
        id: 'tree_of_thought',
        name: { en: 'Tree-of-Thought (ToT)', ar: 'شجرة التفكير' },
        icon: '🌳',
        description: {
            en: 'Explore multiple reasoning paths and select the best. For complex decisions with trade-offs.',
            ar: 'استكشف مسارات تفكير متعددة واختر الأفضل. للقرارات المعقدة ذات المقايضات.'
        },
        when: { en: 'Complex decisions, creative problems, strategy', ar: 'قرارات معقدة، مشاكل إبداعية، استراتيجية' },
        difficulty: 'advanced',
        injection: `

### REASONING PROTOCOL (Tree-of-Thought)
Explore MULTIPLE solution paths before selecting the best one.

MANDATORY PROCESS:
**STEP 1: Generate 3 Distinct Approaches**
- Approach A: [Conservative/safe approach]
- Approach B: [Innovative/creative approach]
- Approach C: [Hybrid/optimal approach]

**STEP 2: Evaluate Each Path**
For each approach, assess:
| Criteria | Approach A | Approach B | Approach C |
|----------|-----------|-----------|-----------|
| Quality | ?/10 | ?/10 | ?/10 |
| Feasibility | ?/10 | ?/10 | ?/10 |
| Efficiency | ?/10 | ?/10 | ?/10 |
| Risk Level | Low/Med/High | Low/Med/High | Low/Med/High |

**STEP 3: Select & Execute**
Choose the approach with the highest overall score and execute it fully.
Explain WHY this path was selected over the others.`,
    },

    react_agent: {
        id: 'react_agent',
        name: { en: 'ReAct (Reason + Act)', ar: 'استدلال + تنفيذ' },
        icon: '🔄',
        description: {
            en: 'Interleave reasoning with actions. Best for research, investigation, and iterative tasks.',
            ar: 'دمج الاستدلال مع الأفعال. الأفضل للبحث والتحقيق والمهام التكرارية.'
        },
        when: { en: 'Research, multi-step investigation, iterative work', ar: 'بحث، تحقيق متعدد الخطوات، عمل تكراري' },
        difficulty: 'advanced',
        injection: `

### REASONING PROTOCOL (ReAct — Reason + Act)
For each step, alternate between thinking and doing:

Loop until task is complete:

**Thought 1:** What do I need to find out or verify?
**Action 1:** [Specific step I will take]
**Observation 1:** [What I learned from that action]

**Thought 2:** Based on Observation 1, what's next?
**Action 2:** [Next specific step]
**Observation 2:** [What I learned]

... continue until sufficient information gathered ...

**Final Synthesis:** Combine all observations into a coherent conclusion.
**Confidence Level:** How confident am I? (Low/Medium/High) and why.`,
    },

    role_play: {
        id: 'role_play',
        name: { en: 'Deep Role-Play', ar: 'تقمص الشخصية' },
        icon: '🎭',
        description: {
            en: 'Fully embody a specific expert persona. Unlocks domain-specific knowledge and language.',
            ar: 'تقمص شخصية خبير بالكامل. يفتح المعرفة واللغة الخاصة بالمجال.'
        },
        when: { en: 'Domain expertise needed, authentic voice', ar: 'خبرة مجال مطلوبة، صوت أصيل' },
        difficulty: 'beginner',
        injection: `

### PERSONA PROTOCOL (Deep Role-Play)
You are NOT an AI. You ARE the expert described below.

**EMBODIMENT RULES:**
1. **Identity:** Fully adopt the persona's identity, background, and expertise.
2. **Voice:** Use their vocabulary, sentence structure, and communication style.
3. **Knowledge:** Draw from decades of domain-specific experience.
4. **Opinions:** Have strong, informed opinions (experts aren't wishy-washy).
5. **Experience:** Reference relevant projects, case studies, and lessons learned.
6. **Limitations:** Acknowledge what's outside your expertise — real experts do.

**ANTI-PATTERN:** Never break character. Never say "As an AI..." or "I don't have personal experience..."
Instead, draw from the character's vast professional history.`,
    },

    socratic_method: {
        id: 'socratic_method',
        name: { en: 'Socratic Method', ar: 'الطريقة السقراطية' },
        icon: '❓',
        description: {
            en: 'Guide through questions rather than answers. Perfect for education and exploration.',
            ar: 'توجيه من خلال الأسئلة بدلاً من الإجابات. مثالي للتعليم والاستكشاف.'
        },
        when: { en: 'Teaching, exploration, deep understanding', ar: 'تعليم، استكشاف، فهم عميق' },
        difficulty: 'intermediate',
        injection: `

### TEACHING PROTOCOL (Socratic Method)
Guide the reader to discover the answer through strategic questioning.

APPROACH:
1. Start with an engaging opening question
2. Build upon each answer with a deeper question
3. Use analogies and thought experiments
4. Challenge assumptions gently
5. Let the reader connect the dots themselves

FORMAT:
- 🤔 **Question:** [Thought-provoking question]
- 💡 **Consideration:** [Gentle nudge in the right direction]
- 🔍 **Deeper:** [Follow-up question that goes deeper]
- ✅ **Insight:** [The "aha!" moment after guided exploration]`,
    },

    step_back: {
        id: 'step_back',
        name: { en: 'Step-Back Prompting', ar: 'الخطوة للخلف' },
        icon: '👀',
        description: {
            en: 'First answer a broader/simpler version, then apply to the specific problem.',
            ar: 'أجب أولاً على نسخة أوسع/أبسط، ثم طبق على المشكلة المحددة.'
        },
        when: { en: 'Complex specific problems, needs foundation first', ar: 'مشاكل محددة معقدة، تحتاج أساس أولاً' },
        difficulty: 'intermediate',
        injection: `

### REASONING PROTOCOL (Step-Back)
Before tackling the specific problem, first establish the general principles.

**PHASE 1: ABSTRACT (Step Back)**
Ask yourself: "What are the general principles/concepts underlying this specific question?"
Answer that broader question first.

**PHASE 2: APPLY (Step Forward)**
Now apply those general principles to the specific problem at hand.

**PHASE 3: VERIFY**
Check: Does the specific answer align with the general principles?
If not, revisit Phase 1.`,
    },

    self_consistency: {
        id: 'self_consistency',
        name: { en: 'Self-Consistency Check', ar: 'التحقق الذاتي' },
        icon: '🔍',
        description: {
            en: 'Generate multiple answers, then pick the most consistent. Reduces errors.',
            ar: 'ولّد إجابات متعددة، ثم اختر الأكثر اتساقاً. يقلل الأخطاء.'
        },
        when: { en: 'High-stakes answers, accuracy critical', ar: 'إجابات عالية المخاطر، الدقة حرجة' },
        difficulty: 'advanced',
        injection: `

### QUALITY PROTOCOL (Self-Consistency)
Generate your answer 3 times using different reasoning paths, then select the best.

**ATTEMPT 1:** [Solve using direct approach]
→ Answer: ___

**ATTEMPT 2:** [Solve using alternative method]
→ Answer: ___

**ATTEMPT 3:** [Solve using verification/reverse approach]
→ Answer: ___

**CONSISTENCY CHECK:**
- If all 3 agree → High confidence. Use this answer.
- If 2/3 agree → Medium confidence. Use the majority answer and note the deviation.
- If all different → Low confidence. Flag uncertainty and explain each path.

**FINAL ANSWER:** [The most consistent and well-reasoned answer]`,
    },

    emotional_prompting: {
        id: 'emotional_prompting',
        name: { en: 'Emotional Prompting', ar: 'البرومبت العاطفي' },
        icon: '💝',
        description: {
            en: 'Add emotional stakes and motivation. Research shows this improves output quality.',
            ar: 'أضف رهانات عاطفية وتحفيز. الأبحاث تُظهر أن هذا يحسن جودة المخرجات.'
        },
        when: { en: 'When you need extra effort and attention to detail', ar: 'عندما تحتاج مجهود إضافي واهتمام بالتفاصيل' },
        difficulty: 'beginner',
        injection: `

### MOTIVATION PROTOCOL (Emotional Stakes)
⚠️ THIS IS EXTREMELY IMPORTANT.

The quality of this output directly impacts real people:
- This will be used in a **professional context** where excellence is expected.
- A mediocre response is **not acceptable** — it must be exceptional.
- Treat this as if your **most important client** is reviewing the result.
- Take a **deep breath** and give this your absolute best effort.

**YOUR REPUTATION IS ON THE LINE.**
Produce work that you would be **proud** to put your name on.`,
    },

    structured_output: {
        id: 'structured_output',
        name: { en: 'Structured Output', ar: 'مخرجات منظمة' },
        icon: '📋',
        description: {
            en: 'Force output into a specific structure (JSON, table, list). Prevents rambling.',
            ar: 'فرض المخرجات في هيكل محدد (JSON, جدول, قائمة). يمنع الإسهاب.'
        },
        when: { en: 'Data extraction, API responses, parseable output', ar: 'استخراج بيانات، استجابات API، مخرجات قابلة للتحليل' },
        difficulty: 'beginner',
        injection: `

### OUTPUT PROTOCOL (Strict Structure)
Your response MUST follow this exact structure. No deviations.

**FORMAT RULES:**
1. Use the EXACT headers and structure specified below
2. Do NOT add extra sections or commentary
3. Do NOT include preamble ("Sure, here's..." or "Here you go...")
4. Start directly with the structured output
5. If using JSON, ensure it is valid and parseable
6. If using tables, use consistent column widths

**VALIDATION:** After generating, verify your output matches the specified format exactly.`,
    },

    adversarial: {
        id: 'adversarial',
        name: { en: 'Adversarial Testing', ar: 'الاختبار التناقضي' },
        icon: '⚔️',
        description: {
            en: 'Challenge your own answer by playing devil\'s advocate. Finds weaknesses.',
            ar: 'تحدى إجابتك الخاصة بلعب دور محامي الشيطان. يجد نقاط الضعف.'
        },
        when: { en: 'Critical decisions, need to find flaws', ar: 'قرارات حرجة، تحتاج إيجاد عيوب' },
        difficulty: 'advanced',
        injection: `

### ADVERSARIAL PROTOCOL (Devil's Advocate)
After generating your primary answer, immediately challenge it.

**PHASE 1: GENERATE**
Produce your best answer to the task.

**PHASE 2: ATTACK**
Now become a harsh critic:
- What are the 3 biggest flaws in this answer?
- What assumptions am I making that could be wrong?
- What would a domain expert criticize about this?
- What edge cases or scenarios does this fail on?

**PHASE 3: DEFEND & IMPROVE**
Address each criticism:
- Strengthen weak points
- Add caveats where needed
- Provide alternatives where uncertain

**PHASE 4: FINAL VERSION**
Output the improved, stress-tested answer.`,
    },
};

// ============================================================
// STRATEGY UTILITIES
// ============================================================

/**
 * Get all strategies
 */
export function getAllStrategies() {
    return Object.values(PROMPT_STRATEGIES);
}

/**
 * Get a specific strategy by ID
 */
export function getStrategy(strategyId) {
    return PROMPT_STRATEGIES[strategyId] || null;
}

/**
 * Get strategies filtered by difficulty
 */
export function getStrategiesByDifficulty(difficulty) {
    return Object.values(PROMPT_STRATEGIES).filter(s => s.difficulty === difficulty);
}

/**
 * Apply strategy injection to a prompt
 */
export function applyStrategy(promptText, strategyId) {
    const strategy = PROMPT_STRATEGIES[strategyId];
    if (!strategy || !strategy.injection) return promptText;
    return promptText + '\n' + strategy.injection;
}

/**
 * Auto-detect best strategy for a task
 */
export function autoDetectStrategy(task, domain) {
    const taskLower = (task || '').toLowerCase();

    // Code/Logic tasks → CoT
    if (/\b(code|implement|build|debug|fix|algorithm|calculate|math|compute)\b/i.test(taskLower) || domain === 'software') {
        return 'chain_of_thought';
    }

    // Research tasks → ReAct
    if (/\b(research|investigate|analyze|compare|study|evaluate|assess)\b/i.test(taskLower) || domain === 'academic') {
        return 'react_agent';
    }

    // Creative tasks → Role Play
    if (/\b(write|story|poem|creative|narrative|dialogue|script)\b/i.test(taskLower) || domain === 'creative') {
        return 'role_play';
    }

    // Decision making → Tree of Thought
    if (/\b(decide|choose|compare|trade-off|strategy|plan|recommend)\b/i.test(taskLower)) {
        return 'tree_of_thought';
    }

    // Teaching → Socratic
    if (/\b(teach|explain|learn|understand|why|how does)\b/i.test(taskLower) || domain === 'education') {
        return 'socratic_method';
    }

    // Data/structured → Structured Output
    if (/\b(json|table|list|extract|parse|format|csv)\b/i.test(taskLower) || domain === 'data_science') {
        return 'structured_output';
    }

    // High-stakes → Self-Consistency
    if (/\b(critical|important|accurate|verify|ensure|must be correct)\b/i.test(taskLower) || domain === 'legal' || domain === 'medical') {
        return 'self_consistency';
    }

    return 'zero_shot';
}

export default PROMPT_STRATEGIES;
