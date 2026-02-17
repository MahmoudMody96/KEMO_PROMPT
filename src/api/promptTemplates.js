// ============================================================
// PROMPT TEMPLATES LIBRARY v1.0
// 100+ Production-Ready Templates across 14 Domains
// Each template: { title, description, template, variables, example, difficulty, tags }
// ============================================================

const PROMPT_TEMPLATES = {

    // ══════════════════════════════════════
    // 👨‍💻 SOFTWARE ENGINEERING
    // ══════════════════════════════════════
    software: [
        {
            id: 'sw_code_review',
            title: { en: 'Code Review Expert', ar: 'مراجعة الكود الاحترافية' },
            description: { en: 'Deep code review with security, performance, and best practices', ar: 'مراجعة كود عميقة مع الأمان والأداء وأفضل الممارسات' },
            difficulty: 'advanced',
            tags: ['review', 'quality', 'security'],
            variables: ['LANGUAGE', 'CODE_SNIPPET', 'FOCUS_AREA'],
            template: `You are a Principal Software Engineer with 20+ years of experience in {{LANGUAGE}}.

TASK: Perform an exhaustive code review on the following code.

CODE TO REVIEW:
\`\`\`
{{CODE_SNIPPET}}
\`\`\`

REVIEW PROTOCOL:
1. **Security Audit** — Identify vulnerabilities (injection, XSS, CSRF, secrets exposure)
2. **Performance Analysis** — Time/space complexity, bottlenecks, memory leaks
3. **Code Quality** — SOLID principles, DRY, naming conventions, readability
4. **Error Handling** — Edge cases, graceful degradation, error propagation
5. **Testing Gaps** — What tests are missing? Suggest test cases.
{{FOCUS_AREA ? '6. **Special Focus:** ' + FOCUS_AREA : ''}}

OUTPUT FORMAT:
- 🔴 Critical Issues (must fix)
- 🟡 Warnings (should fix)
- 🟢 Suggestions (nice to have)
- 📊 Overall Score: X/100
- 🔧 Refactored Code (improved version)

Be brutally honest. No sugar-coating.`,
        },
        {
            id: 'sw_api_design',
            title: { en: 'REST API Architect', ar: 'مهندس REST API' },
            description: { en: 'Design production-ready REST APIs with full documentation', ar: 'تصميم REST APIs جاهزة للإنتاج مع توثيق كامل' },
            difficulty: 'advanced',
            tags: ['api', 'architecture', 'rest'],
            variables: ['RESOURCE', 'REQUIREMENTS', 'AUTH_METHOD'],
            template: `You are a Senior API Architect specializing in RESTful system design.

TASK: Design a complete REST API for: {{RESOURCE}}

REQUIREMENTS: {{REQUIREMENTS}}
AUTHENTICATION: {{AUTH_METHOD}}

DELIVERABLES:
1. **Endpoint Table** — Method, Path, Description, Auth Required
2. **Request/Response Schemas** — JSON with types and validation
3. **Error Codes** — Standard HTTP + custom error format
4. **Rate Limiting Strategy** — Tiers and headers
5. **Pagination** — Cursor vs Offset with examples
6. **Versioning Strategy** — URL vs Header
7. **OpenAPI 3.0 Spec** — Full YAML specification
8. **Security Headers** — CORS, CSP, HSTS

CONSTRAINTS:
- Follow Richardson Maturity Model Level 3 (HATEOAS)
- Include idempotency keys for mutations
- Design for backward compatibility`,
        },
        {
            id: 'sw_debug',
            title: { en: 'Bug Detective', ar: 'محقق الأخطاء' },
            description: { en: 'Systematic debugging with root cause analysis', ar: 'تصحيح أخطاء منهجي مع تحليل السبب الجذري' },
            difficulty: 'intermediate',
            tags: ['debug', 'fix', 'troubleshoot'],
            variables: ['BUG_DESCRIPTION', 'ERROR_MESSAGE', 'CODE_CONTEXT'],
            template: `You are a world-class debugger who has solved 10,000+ production bugs.

BUG REPORT:
- Description: {{BUG_DESCRIPTION}}
- Error: {{ERROR_MESSAGE}}

CODE CONTEXT:
\`\`\`
{{CODE_CONTEXT}}
\`\`\`

DEBUGGING PROTOCOL:
1. **Reproduce** — What exact steps trigger this?
2. **Isolate** — Narrow down to the smallest failing unit
3. **Root Cause** — WHY does this happen? (not just what)
4. **Fix** — Provide the corrected code
5. **Prevent** — How to prevent this class of bugs in the future
6. **Test** — Write a regression test for this bug

Think step-by-step. Show your reasoning.`,
        },
        {
            id: 'sw_arch_decision',
            title: { en: 'Architecture Decision Record', ar: 'سجل قرارات الهندسة المعمارية' },
            description: { en: 'Document architectural decisions with ADR format', ar: 'توثيق قرارات الهندسة المعمارية بتنسيق ADR' },
            difficulty: 'advanced',
            tags: ['architecture', 'design', 'decision'],
            variables: ['DECISION_TOPIC', 'CONTEXT', 'OPTIONS'],
            template: `You are a Chief Architect at a Fortune 500 tech company.

TASK: Write an Architecture Decision Record (ADR) for: {{DECISION_TOPIC}}

CONTEXT: {{CONTEXT}}
OPTIONS CONSIDERED: {{OPTIONS}}

ADR FORMAT:
# ADR-XXX: {{DECISION_TOPIC}}

## Status: [Proposed/Accepted/Deprecated]
## Date: [Today]

## Context
[Why is this decision needed? What forces are at play?]

## Decision
[What was decided and why]

## Options Considered
| Option | Pros | Cons | Effort |
|--------|------|------|--------|
| ... | ... | ... | ... |

## Consequences
### Positive
### Negative
### Risks & Mitigations

## Follow-up Actions
[What needs to happen next]`,
        },
        {
            id: 'sw_unit_test',
            title: { en: 'Test Suite Generator', ar: 'مولّد اختبارات الوحدات' },
            description: { en: 'Generate comprehensive test suites with edge cases', ar: 'توليد مجموعات اختبار شاملة مع الحالات الحدية' },
            difficulty: 'intermediate',
            tags: ['testing', 'unit-test', 'tdd'],
            variables: ['FUNCTION_CODE', 'FRAMEWORK', 'LANGUAGE'],
            template: `You are a Senior QA Engineer who writes bulletproof tests.

FUNCTION TO TEST:
\`\`\`{{LANGUAGE}}
{{FUNCTION_CODE}}
\`\`\`

TESTING FRAMEWORK: {{FRAMEWORK}}

GENERATE:
1. **Happy Path Tests** — Expected inputs and outputs
2. **Edge Cases** — Empty, null, undefined, boundary values
3. **Error Cases** — Invalid inputs, exceptions, timeouts
4. **Performance Tests** — Large inputs, stress scenarios
5. **Integration Points** — Mock external dependencies

RULES:
- Use AAA pattern (Arrange, Act, Assert)
- Each test has a descriptive name: \`should_[action]_when_[condition]\`
- Aim for >95% code coverage
- Include setup/teardown if needed`,
        },
        {
            id: 'sw_refactor',
            title: { en: 'Code Refactoring Master', ar: 'خبير إعادة هيكلة الكود' },
            description: { en: 'Refactor code for readability, performance, and maintainability', ar: 'إعادة هيكلة الكود للقراءة والأداء والصيانة' },
            difficulty: 'intermediate',
            tags: ['refactor', 'clean-code', 'optimization'],
            variables: ['CODE', 'LANGUAGE', 'GOALS'],
            template: `You are a Clean Code evangelist and refactoring expert.

CODE TO REFACTOR:
\`\`\`{{LANGUAGE}}
{{CODE}}
\`\`\`

REFACTORING GOALS: {{GOALS}}

APPLY THESE PRINCIPLES:
1. **Extract Methods** — Single Responsibility per function
2. **Naming** — Self-documenting variable and function names
3. **DRY** — Eliminate duplication
4. **SOLID** — Apply relevant principles
5. **Guard Clauses** — Early returns over deep nesting
6. **Composition** — Favor composition over inheritance

OUTPUT:
- Refactored code with comments explaining each change
- Before/After comparison of key sections
- Performance impact analysis`,
        },
        {
            id: 'sw_system_design',
            title: { en: 'System Design Interview', ar: 'تصميم نظام متكامل' },
            description: { en: 'Design scalable distributed systems', ar: 'تصميم أنظمة موزعة قابلة للتوسع' },
            difficulty: 'advanced',
            tags: ['system-design', 'scalability', 'distributed'],
            variables: ['SYSTEM', 'REQUIREMENTS', 'SCALE'],
            template: `You are a Distinguished Engineer at Google/Netflix designing systems at scale.

DESIGN: {{SYSTEM}}
REQUIREMENTS: {{REQUIREMENTS}}
SCALE: {{SCALE}}

SYSTEMATIC APPROACH:
1. **Requirements Clarification** — Functional & Non-Functional
2. **Back-of-envelope Estimation** — QPS, storage, bandwidth
3. **High-Level Design** — Components diagram (ASCII)
4. **Detailed Design** — Database schema, API contracts
5. **Data Flow** — Read/Write paths step by step
6. **Scaling Strategy** — Horizontal, caching, CDN, sharding
7. **Bottlenecks & Solutions** — Single points of failure
8. **Monitoring & Alerting** — Key metrics to track

Draw ASCII diagrams for architecture.`,
        },
        {
            id: 'sw_documentation',
            title: { en: 'Technical Documentation', ar: 'التوثيق التقني' },
            description: { en: 'Write clear, comprehensive technical docs', ar: 'كتابة توثيق تقني واضح وشامل' },
            difficulty: 'beginner',
            tags: ['docs', 'readme', 'documentation'],
            variables: ['PROJECT_NAME', 'DESCRIPTION', 'TECH_STACK'],
            template: `You are a Developer Advocate who writes award-winning documentation.

PROJECT: {{PROJECT_NAME}}
DESCRIPTION: {{DESCRIPTION}}
TECH STACK: {{TECH_STACK}}

GENERATE COMPLETE DOCUMENTATION:
1. **README.md** — Overview, badges, quickstart
2. **Installation** — Step-by-step with prerequisites
3. **Configuration** — Environment variables, config files
4. **API Reference** — Every endpoint/function documented
5. **Examples** — Real-world usage scenarios
6. **Troubleshooting** — Common errors and solutions
7. **Contributing Guide** — How to contribute
8. **Changelog** — Version history format

RULES:
- Use Markdown formatting
- Include code examples for every concept
- Add copy-paste-ready commands
- Support both beginners and advanced users`,
        },
    ],

    // ══════════════════════════════════════
    // 📈 DIGITAL MARKETING
    // ══════════════════════════════════════
    marketing: [
        {
            id: 'mkt_landing_page',
            title: { en: 'Landing Page Copy', ar: 'نص صفحة الهبوط' },
            description: { en: 'High-converting landing page copy with AIDA framework', ar: 'نص صفحة هبوط عالي التحويل بإطار AIDA' },
            difficulty: 'intermediate',
            tags: ['landing-page', 'conversion', 'copy'],
            variables: ['PRODUCT', 'TARGET_AUDIENCE', 'USP', 'CTA'],
            template: `You are a world-class conversion copywriter (David Ogilvy + Gary Halbert level).

PRODUCT: {{PRODUCT}}
TARGET AUDIENCE: {{TARGET_AUDIENCE}}
UNIQUE SELLING PROPOSITION: {{USP}}
DESIRED CTA: {{CTA}}

WRITE COMPLETE LANDING PAGE:
1. **Hero Section** — Headline (max 8 words), subheadline, CTA button
2. **Problem Agitation** — 3 pain points the audience faces
3. **Solution** — How the product solves each pain
4. **Social Proof** — Testimonial templates, stats, logos
5. **Features → Benefits** — Transform features into emotional benefits
6. **FAQ Section** — 5 objection-handling FAQs
7. **Final CTA** — Urgency-driven closing section

COPYWRITING RULES:
- Use power words: "Instantly", "Proven", "Exclusive"
- Every sentence must earn its place
- Write at 6th-grade reading level
- Include micro-copy for buttons, tooltips
- A/B test variants for headline`,
        },
        {
            id: 'mkt_email_sequence',
            title: { en: 'Email Sequence Builder', ar: 'منشئ تسلسل البريد الإلكتروني' },
            description: { en: 'Complete email nurture sequence', ar: 'تسلسل بريد إلكتروني كامل للتنمية' },
            difficulty: 'intermediate',
            tags: ['email', 'nurture', 'automation'],
            variables: ['PRODUCT', 'AUDIENCE', 'SEQUENCE_LENGTH', 'GOAL'],
            template: `You are an email marketing strategist with a 45%+ open rate track record.

PRODUCT: {{PRODUCT}}
AUDIENCE: {{AUDIENCE}}
SEQUENCE LENGTH: {{SEQUENCE_LENGTH}} emails
GOAL: {{GOAL}}

FOR EACH EMAIL PROVIDE:
1. **Subject Line** — With curiosity gap + personalization
2. **Preview Text** — 40-90 chars
3. **Body Copy** — Hook → Story → Offer → CTA
4. **Send Timing** — Optimal day/time
5. **A/B Variant** — Alternative subject line

SEQUENCE STRUCTURE:
- Email 1: Welcome + Quick Win
- Email 2: Story + Problem Awareness
- Email 3: Social Proof + Case Study
- Email 4: Objection Handling
- Email 5: Urgency + Final CTA

RULES: No spam triggers. CAN-SPAM compliant. Mobile-first formatting.`,
        },
        {
            id: 'mkt_social_media',
            title: { en: 'Social Media Content Calendar', ar: 'تقويم محتوى السوشيال ميديا' },
            description: { en: '30-day social media content plan', ar: 'خطة محتوى سوشيال ميديا لـ 30 يوم' },
            difficulty: 'beginner',
            tags: ['social-media', 'calendar', 'content'],
            variables: ['BRAND', 'PLATFORMS', 'INDUSTRY', 'GOALS'],
            template: `You are a Social Media Manager for a top agency managing Fortune 500 brands.

BRAND: {{BRAND}}
PLATFORMS: {{PLATFORMS}}
INDUSTRY: {{INDUSTRY}}
GOALS: {{GOALS}}

CREATE A 30-DAY CONTENT CALENDAR:

For each day provide:
| Day | Platform | Content Type | Topic | Caption | Hashtags | Best Time |

CONTENT MIX (80/20 Rule):
- 40% Educational/Value
- 25% Entertainment/Engagement
- 20% Social Proof/UGC
- 15% Promotional/CTA

Include: Carousel ideas, Reel concepts, Story sequences, Poll ideas.`,
        },
        {
            id: 'mkt_seo_article',
            title: { en: 'SEO-Optimized Article', ar: 'مقال محسّن لـ SEO' },
            description: { en: 'Write SEO-first content that ranks', ar: 'كتابة محتوى يتصدر نتائج البحث' },
            difficulty: 'intermediate',
            tags: ['seo', 'content', 'article'],
            variables: ['KEYWORD', 'SEARCH_INTENT', 'WORD_COUNT', 'AUDIENCE'],
            template: `You are an SEO Content Strategist who has ranked 500+ articles on page 1 of Google.

PRIMARY KEYWORD: {{KEYWORD}}
SEARCH INTENT: {{SEARCH_INTENT}}
TARGET WORD COUNT: {{WORD_COUNT}}
AUDIENCE: {{AUDIENCE}}

WRITE AN ARTICLE THAT:
1. **Title** — Contains keyword, under 60 chars, curiosity-driven
2. **Meta Description** — 150-160 chars, includes keyword, has CTA
3. **Outline** — H2/H3 structure optimized for featured snippets
4. **Introduction** — Hook + keyword in first 100 words
5. **Body** — Comprehensive, E-E-A-T signals, internal link suggestions
6. **FAQ Schema** — 5 questions for rich snippets
7. **Conclusion** — Summary + CTA

SEO RULES:
- Keyword density: 1-2%
- LSI keywords throughout
- One H1, multiple H2/H3
- Short paragraphs (2-3 sentences)
- Include "People Also Ask" answers`,
        },
        {
            id: 'mkt_ad_copy',
            title: { en: 'Ad Copy Generator', ar: 'مولّد نصوص إعلانية' },
            description: { en: 'High-performance ad copy for multiple platforms', ar: 'نصوص إعلانية عالية الأداء لمنصات متعددة' },
            difficulty: 'beginner',
            tags: ['ads', 'ppc', 'copy'],
            variables: ['PRODUCT', 'PLATFORM', 'AUDIENCE', 'BUDGET_TIER'],
            template: `You are a Performance Marketing Expert managing $10M+ annual ad spend.

PRODUCT: {{PRODUCT}}
PLATFORM: {{PLATFORM}}
AUDIENCE: {{AUDIENCE}}
BUDGET TIER: {{BUDGET_TIER}}

GENERATE 5 AD VARIATIONS:
For each:
1. **Headline** — Platform-specific length limit
2. **Body Copy** — Benefit-driven, emotional hook
3. **CTA** — Action-oriented button text
4. **Visual Direction** — What image/video to pair with
5. **Audience Targeting** — Demographics, interests, lookalikes

PLATFORM SPECS:
- Google Ads: 30-char headlines, 90-char descriptions
- Facebook/IG: Primary text, headline, description
- LinkedIn: 150-char intro, 70-char headline
- TikTok: 100-char text, hook in first 3 seconds`,
        },
    ],

    // ══════════════════════════════════════
    // 🎓 ACADEMIC RESEARCH
    // ══════════════════════════════════════
    academic: [
        {
            id: 'acad_literature_review',
            title: { en: 'Literature Review', ar: 'مراجعة الأدبيات' },
            description: { en: 'Systematic literature review with proper citations', ar: 'مراجعة أدبيات منهجية مع اقتباسات صحيحة' },
            difficulty: 'advanced',
            tags: ['literature', 'review', 'research'],
            variables: ['TOPIC', 'FIELD', 'CITATION_STYLE', 'SCOPE'],
            template: `You are a tenured professor with 500+ citations in {{FIELD}}.

TASK: Write a systematic literature review on: {{TOPIC}}
CITATION STYLE: {{CITATION_STYLE}}
SCOPE: {{SCOPE}}

STRUCTURE:
1. **Introduction** — Background, research gap, objectives
2. **Methodology** — Search strategy, inclusion/exclusion criteria
3. **Thematic Analysis** — Group findings by theme
4. **Critical Analysis** — Strengths, limitations, contradictions
5. **Research Gaps** — What hasn't been studied
6. **Conclusion** — Synthesis and future directions

ACADEMIC STANDARDS:
- Every claim must have a citation
- Use hedging language appropriately
- Maintain objective, third-person tone
- Follow {{CITATION_STYLE}} formatting exactly`,
        },
        {
            id: 'acad_thesis_outline',
            title: { en: 'Thesis/Dissertation Outline', ar: 'مخطط الأطروحة' },
            description: { en: 'Complete thesis structure with chapter breakdown', ar: 'هيكل أطروحة كامل مع تقسيم الفصول' },
            difficulty: 'advanced',
            tags: ['thesis', 'dissertation', 'outline'],
            variables: ['TOPIC', 'DEGREE_LEVEL', 'METHODOLOGY', 'FIELD'],
            template: `You are a PhD supervisor who has guided 100+ successful dissertations.

TOPIC: {{TOPIC}}
DEGREE: {{DEGREE_LEVEL}}
METHODOLOGY: {{METHODOLOGY}}
FIELD: {{FIELD}}

GENERATE COMPLETE THESIS OUTLINE:
1. Title Page
2. Abstract (250 words)
3. Chapter 1: Introduction
4. Chapter 2: Literature Review
5. Chapter 3: Methodology
6. Chapter 4: Results
7. Chapter 5: Discussion
8. Chapter 6: Conclusion
9. References
10. Appendices

For each chapter: key sections, estimated word count, key arguments.`,
        },
        {
            id: 'acad_research_proposal',
            title: { en: 'Research Proposal', ar: 'مقترح بحثي' },
            description: { en: 'Funding-ready research proposal', ar: 'مقترح بحثي جاهز للتمويل' },
            difficulty: 'advanced',
            tags: ['proposal', 'funding', 'research'],
            variables: ['TOPIC', 'FIELD', 'DURATION', 'METHODOLOGY'],
            template: `You are a researcher who has won $50M+ in grant funding.

TOPIC: {{TOPIC}}
FIELD: {{FIELD}}
DURATION: {{DURATION}}
METHODOLOGY: {{METHODOLOGY}}

WRITE A COMPLETE RESEARCH PROPOSAL:
1. **Title** — Concise, specific, compelling
2. **Abstract** — 300 words max
3. **Background & Significance** — Why this matters NOW
4. **Research Questions** — Clear, testable hypotheses
5. **Methodology** — Step-by-step research design
6. **Timeline** — Gantt chart in text form
7. **Budget Justification** — Line items with rationale
8. **Expected Outcomes** — Measurable deliverables
9. **References** — Key foundational works`,
        },
    ],

    // ══════════════════════════════════════
    // ⚖️ LEGAL
    // ══════════════════════════════════════
    legal: [
        {
            id: 'legal_contract',
            title: { en: 'Contract Drafter', ar: 'صائغ العقود' },
            description: { en: 'Draft professional legal contracts', ar: 'صياغة عقود قانونية احترافية' },
            difficulty: 'advanced',
            tags: ['contract', 'agreement', 'legal'],
            variables: ['CONTRACT_TYPE', 'PARTIES', 'JURISDICTION', 'KEY_TERMS'],
            template: `You are a Senior Partner at a top international law firm.

CONTRACT TYPE: {{CONTRACT_TYPE}}
PARTIES: {{PARTIES}}
JURISDICTION: {{JURISDICTION}}
KEY TERMS: {{KEY_TERMS}}

DRAFT A COMPLETE CONTRACT:
1. Recitals / Preamble
2. Definitions
3. Scope of Agreement
4. Rights and Obligations
5. Payment Terms
6. Confidentiality
7. Intellectual Property
8. Liability & Indemnification
9. Termination
10. Dispute Resolution
11. General Provisions
12. Signatures

⚠️ DISCLAIMER: This is a draft template. Always review with a licensed attorney.`,
        },
        {
            id: 'legal_memo',
            title: { en: 'Legal Memorandum', ar: 'مذكرة قانونية' },
            description: { en: 'IRAC-format legal analysis', ar: 'تحليل قانوني بتنسيق IRAC' },
            difficulty: 'advanced',
            tags: ['memo', 'analysis', 'irac'],
            variables: ['ISSUE', 'FACTS', 'JURISDICTION'],
            template: `You are a legal analyst at a top-tier law firm.

ISSUE: {{ISSUE}}
FACTS: {{FACTS}}
JURISDICTION: {{JURISDICTION}}

WRITE A LEGAL MEMORANDUM USING IRAC:
1. **Issue** — State the legal question precisely
2. **Rule** — Cite relevant statutes, regulations, case law
3. **Analysis** — Apply the rule to the facts
4. **Conclusion** — Clear recommendation with confidence level

Include: Risk assessment (Low/Medium/High), Alternative arguments, Precedent cases.

⚠️ This is not legal advice. Consult a licensed attorney.`,
        },
    ],

    // ══════════════════════════════════════
    // 🎨 CREATIVE WRITING
    // ══════════════════════════════════════
    creative: [
        {
            id: 'crt_story',
            title: { en: 'Story Writer', ar: 'كاتب القصص' },
            description: { en: 'Short story with rich narrative', ar: 'قصة قصيرة بسرد غني' },
            difficulty: 'intermediate',
            tags: ['story', 'narrative', 'fiction'],
            variables: ['GENRE', 'THEME', 'SETTING', 'WORD_COUNT'],
            template: `You are a Pulitzer Prize-winning author and master storyteller.

GENRE: {{GENRE}}
THEME: {{THEME}}
SETTING: {{SETTING}}
TARGET LENGTH: {{WORD_COUNT}} words

CRAFT A COMPELLING SHORT STORY:

NARRATIVE RULES:
1. **Hook** — First sentence must be unforgettable
2. **Show Don't Tell** — Use sensory details, no info-dumps
3. **Character** — 3D characters with flaws and desires
4. **Conflict** — Internal + External tension throughout
5. **Dialogue** — Subtext-rich, each character has unique voice
6. **Pacing** — Vary sentence length for rhythm
7. **Ending** — Surprising yet inevitable

TECHNICAL RULES:
- Active voice dominates
- Eliminate adverbs — use stronger verbs
- Each paragraph earns its place`,
        },
        {
            id: 'crt_screenplay',
            title: { en: 'Screenplay Writer', ar: 'كاتب سيناريو' },
            description: { en: 'Professional screenplay format', ar: 'سيناريو بتنسيق احترافي' },
            difficulty: 'advanced',
            tags: ['screenplay', 'film', 'script'],
            variables: ['LOGLINE', 'GENRE', 'TONE', 'PAGE_COUNT'],
            template: `You are an Academy Award-winning screenwriter.

LOGLINE: {{LOGLINE}}
GENRE: {{GENRE}}
TONE: {{TONE}}
LENGTH: ~{{PAGE_COUNT}} pages

WRITE IN PROPER SCREENPLAY FORMAT:
- FADE IN:
- INT./EXT. LOCATION - TIME OF DAY
- Action lines (present tense, visual)
- CHARACTER NAME (centered)
- Dialogue (indent)
- (parentheticals for tone)
- Transitions

STRUCTURE: 3-Act Structure
- Act 1 (25%): Setup, Inciting Incident
- Act 2 (50%): Rising Action, Midpoint, Crisis
- Act 3 (25%): Climax, Resolution`,
        },
        {
            id: 'crt_poetry',
            title: { en: 'Poetry Composer', ar: 'ملحّن الشعر' },
            description: { en: 'Poetry in various forms and styles', ar: 'شعر بأشكال وأساليب متنوعة' },
            difficulty: 'intermediate',
            tags: ['poetry', 'verse', 'lyrical'],
            variables: ['THEME', 'FORM', 'TONE', 'LANGUAGE'],
            template: `You are a Poet Laureate with mastery of all poetic forms.

THEME: {{THEME}}
FORM: {{FORM}} (sonnet/haiku/free verse/ghazal/ode/limerick)
TONE: {{TONE}}
LANGUAGE: {{LANGUAGE}}

COMPOSE POETRY THAT:
1. Uses vivid imagery and metaphor
2. Has rhythmic musicality (even in free verse)
3. Employs at least 3 literary devices
4. Creates emotional resonance
5. Has a volta/turn/surprise

If Arabic: Use classical Arabic poetic devices (tashbih, kinaya, isti'ara).`,
        },
    ],

    // ══════════════════════════════════════
    // 🤖 DATA SCIENCE & AI
    // ══════════════════════════════════════
    data_science: [
        {
            id: 'ds_ml_pipeline',
            title: { en: 'ML Pipeline Designer', ar: 'مصمم خط أنابيب ML' },
            description: { en: 'End-to-end machine learning pipeline', ar: 'خط أنابيب تعلم آلي من البداية للنهاية' },
            difficulty: 'advanced',
            tags: ['ml', 'pipeline', 'model'],
            variables: ['PROBLEM', 'DATASET_DESC', 'METRIC', 'FRAMEWORK'],
            template: `You are a Lead ML Engineer at Google DeepMind.

PROBLEM: {{PROBLEM}}
DATASET: {{DATASET_DESC}}
SUCCESS METRIC: {{METRIC}}
FRAMEWORK: {{FRAMEWORK}}

DESIGN COMPLETE ML PIPELINE:
1. **Problem Framing** — Classification/Regression/Clustering/etc.
2. **Data Analysis (EDA)** — Key statistics, distributions, correlations
3. **Feature Engineering** — Transformations, encoding, scaling
4. **Model Selection** — 3 candidate models with rationale
5. **Training Strategy** — Cross-validation, hyperparameter tuning
6. **Evaluation** — Confusion matrix, precision/recall, ROC-AUC
7. **Deployment** — API endpoint, monitoring, drift detection
8. **Code** — Complete Python implementation

Include data preprocessing pipeline code.`,
        },
        {
            id: 'ds_data_analysis',
            title: { en: 'Data Analysis Report', ar: 'تقرير تحليل البيانات' },
            description: { en: 'Comprehensive data analysis with insights', ar: 'تحليل بيانات شامل مع رؤى' },
            difficulty: 'intermediate',
            tags: ['analysis', 'report', 'insights'],
            variables: ['DATASET', 'QUESTIONS', 'TOOLS'],
            template: `You are a Senior Data Analyst at McKinsey.

DATASET DESCRIPTION: {{DATASET}}
KEY QUESTIONS: {{QUESTIONS}}
TOOLS: {{TOOLS}}

DELIVER:
1. **Executive Summary** — Key findings in 3 bullets
2. **Data Quality Report** — Missing values, outliers, distributions
3. **Exploratory Analysis** — Key patterns and correlations
4. **Statistical Tests** — Hypothesis testing with p-values
5. **Visualizations** — Describe ideal charts (type + axes + insight)
6. **Actionable Insights** — So-what? Now-what?
7. **Code** — Python/SQL implementation`,
        },
        {
            id: 'ds_prompt_engineering',
            title: { en: 'AI Prompt Optimizer', ar: 'محسّن برومبت الذكاء الاصطناعي' },
            description: { en: 'Optimize prompts for LLMs', ar: 'تحسين البرومبتات لنماذج اللغة الكبيرة' },
            difficulty: 'advanced',
            tags: ['prompt', 'llm', 'optimization'],
            variables: ['CURRENT_PROMPT', 'MODEL', 'ISSUE'],
            template: `You are a Prompt Engineering Researcher at Anthropic.

CURRENT PROMPT:
"""
{{CURRENT_PROMPT}}
"""
TARGET MODEL: {{MODEL}}
ISSUE: {{ISSUE}}

OPTIMIZE USING:
1. **Clarity Score** — Rate current prompt 1-10, explain why
2. **Structure** — Add XML tags, markdown headers, numbered steps
3. **Specificity** — Replace vague language with precise instructions
4. **Examples** — Add 1-2 few-shot examples
5. **Chain-of-Thought** — Add reasoning triggers
6. **Anti-Hallucination** — Add verification steps
7. **Output Format** — Specify exact desired format

OUTPUT: The optimized prompt, ready to use.`,
        },
    ],

    // ══════════════════════════════════════
    // ☁️ DEVOPS & CLOUD
    // ══════════════════════════════════════
    devops: [
        {
            id: 'devops_infra',
            title: { en: 'Infrastructure as Code', ar: 'البنية التحتية ككود' },
            description: { en: 'Terraform/CloudFormation templates', ar: 'قوالب Terraform/CloudFormation' },
            difficulty: 'advanced',
            tags: ['terraform', 'iac', 'cloud'],
            variables: ['CLOUD_PROVIDER', 'SERVICE_TYPE', 'REQUIREMENTS', 'IAC_TOOL'],
            template: `You are a Principal Cloud Architect certified in AWS/GCP/Azure.

CLOUD: {{CLOUD_PROVIDER}}
SERVICE: {{SERVICE_TYPE}}
REQUIREMENTS: {{REQUIREMENTS}}
IAC TOOL: {{IAC_TOOL}}

GENERATE:
1. **Architecture Diagram** — ASCII art of the infrastructure
2. **IaC Code** — Complete {{IAC_TOOL}} configuration
3. **Security** — IAM roles, security groups, encryption
4. **Networking** — VPC, subnets, load balancers
5. **Monitoring** — CloudWatch/Prometheus alerts
6. **Cost Estimate** — Monthly cost breakdown
7. **DR Strategy** — Backup and recovery plan`,
        },
        {
            id: 'devops_cicd',
            title: { en: 'CI/CD Pipeline', ar: 'خط أنابيب CI/CD' },
            description: { en: 'Complete CI/CD pipeline configuration', ar: 'إعداد خط أنابيب CI/CD كامل' },
            difficulty: 'intermediate',
            tags: ['cicd', 'pipeline', 'automation'],
            variables: ['PLATFORM', 'LANGUAGE', 'DEPLOY_TARGET', 'STAGES'],
            template: `You are a DevOps Lead managing 100+ microservices.

CI/CD PLATFORM: {{PLATFORM}} (GitHub Actions/GitLab CI/Jenkins)
LANGUAGE: {{LANGUAGE}}
DEPLOY TO: {{DEPLOY_TARGET}}
STAGES: {{STAGES}}

GENERATE COMPLETE PIPELINE:
1. **Config File** — Complete YAML with all stages
2. **Build Stage** — Compile, dependencies, caching
3. **Test Stage** — Unit, integration, e2e
4. **Security Scan** — SAST, dependency audit
5. **Deploy Stage** — Blue/green or canary
6. **Rollback** — Automatic rollback on failure
7. **Notifications** — Slack/email on success/failure`,
        },
    ],

    // ══════════════════════════════════════
    // 🎨 UI/UX DESIGN
    // ══════════════════════════════════════
    ui_ux: [
        {
            id: 'ux_user_research',
            title: { en: 'User Research Plan', ar: 'خطة بحث المستخدم' },
            description: { en: 'Comprehensive user research methodology', ar: 'منهجية بحث مستخدم شاملة' },
            difficulty: 'intermediate',
            tags: ['research', 'user', 'ux'],
            variables: ['PRODUCT', 'RESEARCH_GOAL', 'AUDIENCE', 'BUDGET'],
            template: `You are a Head of UX Research at a top design agency.

PRODUCT: {{PRODUCT}}
RESEARCH GOAL: {{RESEARCH_GOAL}}
TARGET USERS: {{AUDIENCE}}
BUDGET: {{BUDGET}}

DELIVER:
1. **Research Questions** — 5-7 key questions
2. **Methodology Mix** — Surveys, interviews, usability tests
3. **Participant Criteria** — Screening questions
4. **Interview Guide** — 15 open-ended questions
5. **Usability Test Script** — Tasks and success criteria
6. **Analysis Framework** — Affinity mapping, thematic analysis
7. **Report Template** — Findings → Insights → Recommendations`,
        },
        {
            id: 'ux_design_system',
            title: { en: 'Design System Spec', ar: 'مواصفات نظام التصميم' },
            description: { en: 'Complete design system specification', ar: 'مواصفات نظام تصميم كاملة' },
            difficulty: 'advanced',
            tags: ['design-system', 'components', 'tokens'],
            variables: ['BRAND', 'PLATFORM', 'ACCESSIBILITY'],
            template: `You are a Design Systems Lead at Airbnb/Google.

BRAND: {{BRAND}}
PLATFORM: {{PLATFORM}}
ACCESSIBILITY: {{ACCESSIBILITY}}

SPECIFY:
1. **Design Tokens** — Colors, typography, spacing, shadows
2. **Component Library** — Button, Input, Card, Modal, etc.
3. **Layout Grid** — Columns, gutters, breakpoints
4. **Iconography** — Style guide, naming convention
5. **Motion Design** — Animation principles, timing functions
6. **Accessibility** — WCAG {{ACCESSIBILITY}} compliance checklist
7. **Documentation** — Usage guidelines per component`,
        },
    ],

    // ══════════════════════════════════════
    // 💰 FINANCE
    // ══════════════════════════════════════
    finance: [
        {
            id: 'fin_analysis',
            title: { en: 'Financial Analysis', ar: 'التحليل المالي' },
            description: { en: 'Professional financial analysis report', ar: 'تقرير تحليل مالي احترافي' },
            difficulty: 'advanced',
            tags: ['finance', 'analysis', 'report'],
            variables: ['COMPANY', 'PERIOD', 'ANALYSIS_TYPE', 'STANDARD'],
            template: `You are a CFA Charterholder and Senior Financial Analyst.

COMPANY/ENTITY: {{COMPANY}}
PERIOD: {{PERIOD}}
ANALYSIS TYPE: {{ANALYSIS_TYPE}}
ACCOUNTING STANDARD: {{STANDARD}}

DELIVER:
1. **Executive Summary** — Key findings in 5 bullets
2. **Ratio Analysis** — Liquidity, profitability, leverage, efficiency
3. **Trend Analysis** — Year-over-year comparison
4. **Peer Comparison** — Industry benchmarks
5. **DCF Valuation** — If applicable
6. **Risk Assessment** — Key financial risks
7. **Recommendations** — Buy/Hold/Sell with rationale

Use tables for all numerical data.`,
        },
        {
            id: 'fin_business_plan',
            title: { en: 'Business Plan', ar: 'خطة عمل' },
            description: { en: 'Investor-ready business plan', ar: 'خطة عمل جاهزة للمستثمرين' },
            difficulty: 'advanced',
            tags: ['business-plan', 'startup', 'investment'],
            variables: ['BUSINESS', 'INDUSTRY', 'FUNDING_NEEDED', 'STAGE'],
            template: `You are a McKinsey strategy consultant and Y Combinator advisor.

BUSINESS: {{BUSINESS}}
INDUSTRY: {{INDUSTRY}}
FUNDING: {{FUNDING_NEEDED}}
STAGE: {{STAGE}}

WRITE COMPLETE BUSINESS PLAN:
1. Executive Summary
2. Problem & Solution
3. Market Analysis (TAM/SAM/SOM)
4. Business Model & Revenue Streams
5. Competitive Analysis (Porter's 5 Forces)
6. Go-to-Market Strategy
7. Team
8. Financial Projections (3 years)
9. Funding Requirements & Use of Proceeds
10. Exit Strategy`,
        },
    ],

    // ══════════════════════════════════════
    // 🏥 MEDICAL
    // ══════════════════════════════════════
    medical: [
        {
            id: 'med_patient_edu',
            title: { en: 'Patient Education Material', ar: 'مواد تثقيف المريض' },
            description: { en: 'Clear, accurate patient education content', ar: 'محتوى تثقيف مريض واضح ودقيق' },
            difficulty: 'intermediate',
            tags: ['patient', 'education', 'health'],
            variables: ['CONDITION', 'AUDIENCE_LEVEL', 'LANGUAGE_STYLE'],
            template: `You are a medical communication specialist (MD + Health Literacy Expert).

CONDITION: {{CONDITION}}
READING LEVEL: {{AUDIENCE_LEVEL}}
STYLE: {{LANGUAGE_STYLE}}

CREATE PATIENT EDUCATION MATERIAL:
1. **What Is It?** — Simple explanation with analogies
2. **Symptoms** — What to watch for
3. **Causes** — Why it happens
4. **Treatment Options** — Medications, lifestyle, procedures
5. **When to See a Doctor** — Red flags
6. **FAQ** — 5 common patient questions
7. **Glossary** — Medical terms in plain language

⚠️ DISCLAIMER: This is educational content only. Always consult a healthcare provider.
RULES: No medical advice. Evidence-based. Cite guidelines (WHO, CDC, etc.)`,
        },
        {
            id: 'med_case_study',
            title: { en: 'Clinical Case Study', ar: 'دراسة حالة سريرية' },
            description: { en: 'Medical case study for teaching', ar: 'دراسة حالة طبية للتعليم' },
            difficulty: 'advanced',
            tags: ['case-study', 'clinical', 'teaching'],
            variables: ['SPECIALTY', 'PRESENTATION', 'COMPLEXITY'],
            template: `You are a senior attending physician and medical educator.

SPECIALTY: {{SPECIALTY}}
INITIAL PRESENTATION: {{PRESENTATION}}
COMPLEXITY: {{COMPLEXITY}}

WRITE A CLINICAL CASE STUDY:
1. **Patient Demographics** — Age, sex, relevant history
2. **Chief Complaint** — HPI in standard format
3. **Physical Exam** — Key findings
4. **Lab/Imaging** — Results with normal ranges
5. **Differential Diagnosis** — Ranked list with reasoning
6. **Working Diagnosis** — Most likely diagnosis with evidence
7. **Treatment Plan** — Step-by-step management
8. **Discussion Questions** — 5 teaching points

⚠️ Fictional patient. For educational purposes only.`,
        },
    ],

    // ══════════════════════════════════════
    // 📚 EDUCATION
    // ══════════════════════════════════════
    education: [
        {
            id: 'edu_lesson_plan',
            title: { en: 'Lesson Plan', ar: 'خطة الدرس' },
            description: { en: 'Complete lesson plan with activities', ar: 'خطة درس كاملة مع أنشطة' },
            difficulty: 'beginner',
            tags: ['lesson', 'teaching', 'plan'],
            variables: ['SUBJECT', 'TOPIC', 'GRADE_LEVEL', 'DURATION'],
            template: `You are a National Board Certified Teacher with 20+ years experience.

SUBJECT: {{SUBJECT}}
TOPIC: {{TOPIC}}
GRADE LEVEL: {{GRADE_LEVEL}}
DURATION: {{DURATION}}

CREATE A COMPLETE LESSON PLAN:
1. **Learning Objectives** — SMART goals (Bloom's Taxonomy verbs)
2. **Prior Knowledge** — What students should already know
3. **Materials Needed** — Complete list
4. **Warm-Up** — 5-min engagement hook
5. **Direct Instruction** — Main teaching (I Do)
6. **Guided Practice** — Together (We Do)
7. **Independent Practice** — Solo (You Do)
8. **Assessment** — Formative + exit ticket
9. **Differentiation** — For struggling, on-level, advanced
10. **Homework/Extension** — Meaningful practice`,
        },
        {
            id: 'edu_quiz_generator',
            title: { en: 'Quiz/Exam Generator', ar: 'مولّد الامتحانات' },
            description: { en: 'Assessment with answer key and rubric', ar: 'تقييم مع مفتاح الإجابة ومعايير التقييم' },
            difficulty: 'beginner',
            tags: ['quiz', 'exam', 'assessment'],
            variables: ['SUBJECT', 'TOPICS', 'DIFFICULTY', 'QUESTION_COUNT'],
            template: `You are an assessment design expert.

SUBJECT: {{SUBJECT}}
TOPICS: {{TOPICS}}
DIFFICULTY: {{DIFFICULTY}}
NUMBER OF QUESTIONS: {{QUESTION_COUNT}}

GENERATE:
1. **Multiple Choice** — 4 options each, 1 correct, plausible distractors
2. **True/False** — With explanation
3. **Short Answer** — With model answer
4. **Essay Question** — With rubric (4 levels)

INCLUDE:
- Complete answer key
- Point values
- Time allocation
- Bloom's Taxonomy level per question`,
        },
    ],

    // ══════════════════════════════════════
    // 🔍 SEO & CONTENT
    // ══════════════════════════════════════
    seo_content: [
        {
            id: 'seo_keyword_strategy',
            title: { en: 'Keyword Strategy', ar: 'استراتيجية الكلمات المفتاحية' },
            description: { en: 'Complete keyword research and content strategy', ar: 'بحث كلمات مفتاحية واستراتيجية محتوى كاملة' },
            difficulty: 'intermediate',
            tags: ['keyword', 'seo', 'strategy'],
            variables: ['NICHE', 'COMPETITORS', 'GOALS', 'BUDGET'],
            template: `You are an SEO Director who has grown sites from 0 to 1M monthly visitors.

NICHE: {{NICHE}}
COMPETITORS: {{COMPETITORS}}
GOALS: {{GOALS}}
BUDGET: {{BUDGET}}

DELIVER:
1. **Seed Keywords** — 20 primary keywords with search intent
2. **Long-Tail Clusters** — 50 long-tail keywords grouped by topic
3. **Content Calendar** — 12 articles prioritized by opportunity
4. **Competitor Gap Analysis** — Keywords they rank for that you don't
5. **Technical SEO Checklist** — Site health priorities
6. **Link Building Strategy** — Outreach targets and tactics
7. **KPI Dashboard** — Metrics to track monthly`,
        },
        {
            id: 'seo_product_description',
            title: { en: 'Product Description', ar: 'وصف المنتج' },
            description: { en: 'SEO-optimized product descriptions', ar: 'أوصاف منتجات محسّنة لـ SEO' },
            difficulty: 'beginner',
            tags: ['product', 'ecommerce', 'description'],
            variables: ['PRODUCT', 'FEATURES', 'TARGET_KEYWORD', 'BRAND_VOICE'],
            template: `You are a senior eCommerce copywriter for luxury brands.

PRODUCT: {{PRODUCT}}
KEY FEATURES: {{FEATURES}}
TARGET KEYWORD: {{TARGET_KEYWORD}}
BRAND VOICE: {{BRAND_VOICE}}

WRITE:
1. **SEO Title** — Under 60 chars, includes keyword
2. **Meta Description** — 150-160 chars
3. **Product Title** — Compelling, keyword-rich
4. **Short Description** — 25-50 words for listings
5. **Full Description** — 200-300 words, benefit-focused
6. **Bullet Points** — 5 feature → benefit pairs
7. **Schema Markup** — Product schema JSON-LD`,
        },
    ],

    // ══════════════════════════════════════
    // 📦 PRODUCT MANAGEMENT
    // ══════════════════════════════════════
    product: [
        {
            id: 'pm_prd',
            title: { en: 'Product Requirements Document', ar: 'وثيقة متطلبات المنتج' },
            description: { en: 'Complete PRD for product development', ar: 'وثيقة PRD كاملة لتطوير المنتج' },
            difficulty: 'advanced',
            tags: ['prd', 'requirements', 'product'],
            variables: ['PRODUCT', 'PROBLEM', 'USERS', 'METRICS'],
            template: `You are a Senior PM at Google/Meta with 10+ shipped products.

PRODUCT: {{PRODUCT}}
PROBLEM: {{PROBLEM}}
USERS: {{USERS}}
SUCCESS METRICS: {{METRICS}}

WRITE COMPLETE PRD:
1. **Overview** — Problem statement, goals, non-goals
2. **User Stories** — As a [user], I want [action], so that [benefit]
3. **Requirements** — Must Have / Should Have / Could Have / Won't Have
4. **User Flows** — Step-by-step user journeys (text diagram)
5. **Wireframe Descriptions** — Key screen descriptions
6. **Technical Requirements** — API, data, infrastructure needs
7. **Success Metrics** — KPIs with targets
8. **Launch Plan** — Phases, rollout strategy
9. **Risks & Mitigations** — What could go wrong`,
        },
        {
            id: 'pm_user_story',
            title: { en: 'User Story Writer', ar: 'كاتب قصص المستخدم' },
            description: { en: 'Detailed user stories with acceptance criteria', ar: 'قصص مستخدم مفصلة مع معايير القبول' },
            difficulty: 'beginner',
            tags: ['user-story', 'agile', 'scrum'],
            variables: ['FEATURE', 'USER_TYPE', 'CONTEXT'],
            template: `You are a Senior Product Owner certified in SAFe and Scrum.

FEATURE: {{FEATURE}}
USER TYPE: {{USER_TYPE}}
CONTEXT: {{CONTEXT}}

GENERATE 5-10 USER STORIES:

For each:
**Title:** [Feature Name]
**As a** [User Type]
**I want** [Action/Capability]
**So that** [Benefit/Value]

**Acceptance Criteria:**
- GIVEN [context]
- WHEN [action]
- THEN [expected result]

**Story Points:** [1/2/3/5/8/13]
**Priority:** [Must/Should/Could]
**Dependencies:** [Other stories]`,
        },
    ],

    // ══════════════════════════════════════
    // 🌐 GENERAL / CUSTOM
    // ══════════════════════════════════════
    general: [
        {
            id: 'gen_summarizer',
            title: { en: 'Smart Summarizer', ar: 'ملخص ذكي' },
            description: { en: 'Summarize any content at multiple levels', ar: 'تلخيص أي محتوى بمستويات متعددة' },
            difficulty: 'beginner',
            tags: ['summary', 'tldr', 'compress'],
            variables: ['CONTENT', 'LENGTH', 'AUDIENCE'],
            template: `You are an expert information synthesizer.

CONTENT TO SUMMARIZE:
"""
{{CONTENT}}
"""

AUDIENCE: {{AUDIENCE}}
TARGET LENGTH: {{LENGTH}}

PRODUCE 3 VERSIONS:
1. **TL;DR** — 1 sentence (under 25 words)
2. **Executive Summary** — 3-5 bullet points
3. **Detailed Summary** — {{LENGTH}} length with key takeaways

RULES:
- Preserve all critical data points (numbers, names, dates)
- Maintain the original tone
- Highlight actionable insights
- No new information — only what's in the source`,
        },
        {
            id: 'gen_translator',
            title: { en: 'Professional Translator', ar: 'مترجم احترافي' },
            description: { en: 'Context-aware professional translation', ar: 'ترجمة احترافية مدركة للسياق' },
            difficulty: 'beginner',
            tags: ['translation', 'language', 'localization'],
            variables: ['TEXT', 'SOURCE_LANG', 'TARGET_LANG', 'CONTEXT'],
            template: `You are a certified translator with 15+ years of experience.

TEXT TO TRANSLATE:
"""
{{TEXT}}
"""

FROM: {{SOURCE_LANG}}
TO: {{TARGET_LANG}}
CONTEXT: {{CONTEXT}}

TRANSLATION RULES:
- Preserve meaning, not literal word-for-word
- Adapt idioms and cultural references
- Maintain tone and register
- Keep technical terms accurate
- Provide alternatives for ambiguous phrases [in brackets]
- Flag any untranslatable cultural concepts`,
        },
        {
            id: 'gen_email',
            title: { en: 'Professional Email', ar: 'بريد إلكتروني احترافي' },
            description: { en: 'Craft perfect professional emails', ar: 'صياغة بريد إلكتروني احترافي مثالي' },
            difficulty: 'beginner',
            tags: ['email', 'professional', 'communication'],
            variables: ['PURPOSE', 'RECIPIENT', 'TONE', 'KEY_POINTS'],
            template: `You are an executive communication specialist.

PURPOSE: {{PURPOSE}}
TO: {{RECIPIENT}}
TONE: {{TONE}}
KEY POINTS: {{KEY_POINTS}}

WRITE A PROFESSIONAL EMAIL:
1. **Subject Line** — Clear, actionable, under 50 chars
2. **Greeting** — Appropriate for relationship
3. **Opening** — Purpose in first sentence
4. **Body** — Key points, clear and concise
5. **Call to Action** — What you need from them
6. **Closing** — Professional sign-off

RULES: Under 200 words. One idea per paragraph. Mobile-readable.`,
        },
    ],
};

// ============================================================
// TEMPLATE SEARCH & FILTER UTILITIES
// ============================================================

/**
 * Get all templates for a domain
 */
export function getTemplatesByDomain(domain) {
    return PROMPT_TEMPLATES[domain] || PROMPT_TEMPLATES.general;
}

/**
 * Get a specific template by ID
 */
export function getTemplateById(templateId) {
    for (const domain of Object.keys(PROMPT_TEMPLATES)) {
        const found = PROMPT_TEMPLATES[domain].find(t => t.id === templateId);
        if (found) return { ...found, domain };
    }
    return null;
}

/**
 * Search templates by query across all domains
 */
export function searchTemplates(query, lang = 'en') {
    const q = query.toLowerCase();
    const results = [];

    for (const [domain, templates] of Object.entries(PROMPT_TEMPLATES)) {
        for (const tmpl of templates) {
            const title = (tmpl.title[lang] || tmpl.title.en || '').toLowerCase();
            const desc = (tmpl.description[lang] || tmpl.description.en || '').toLowerCase();
            const tags = tmpl.tags.join(' ').toLowerCase();

            if (title.includes(q) || desc.includes(q) || tags.includes(q)) {
                results.push({ ...tmpl, domain });
            }
        }
    }

    return results;
}

/**
 * Get all domain IDs that have templates
 */
export function getAvailableDomains() {
    return Object.keys(PROMPT_TEMPLATES);
}

/**
 * Get template count per domain
 */
export function getTemplateCounts() {
    const counts = {};
    for (const [domain, templates] of Object.entries(PROMPT_TEMPLATES)) {
        counts[domain] = templates.length;
    }
    return counts;
}

/**
 * Fill template variables with values
 */
export function fillTemplate(templateText, variables) {
    let filled = templateText;
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        filled = filled.replace(regex, value || `[${key}]`);
    }
    // Handle conditional variables like {{VAR ? 'text' + VAR : ''}}
    filled = filled.replace(/\{\{(\w+)\s*\?\s*(.+?)\s*:\s*(.+?)\}\}/g, (match, varName, truthy, falsy) => {
        return variables[varName] ? truthy.replace(varName, variables[varName]) : falsy;
    });
    return filled;
}

export default PROMPT_TEMPLATES;
