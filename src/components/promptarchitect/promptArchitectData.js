// promptArchitectData.js — Domain definitions, translations, color/icon maps
// Extracted to keep PromptArchitect.jsx lean

import {
    Code, Zap, Shield, FileText, Wand2, Globe,
    Database, Cloud, Palette, DollarSign, Heart,
    GraduationCap, Search, Package
} from 'lucide-react';

// ============================================
// COLOR MAP — 14 Domains
// ============================================
export const colorMap = {
    software: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#10b981', gradient: 'from-emerald-500/20 to-teal-500/20' },
    marketing: { bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.3)', text: '#a855f7', gradient: 'from-purple-500/20 to-fuchsia-500/20' },
    academic: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', text: '#3b82f6', gradient: 'from-blue-500/20 to-indigo-500/20' },
    legal: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b', gradient: 'from-amber-500/20 to-yellow-500/20' },
    creative: { bg: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.3)', text: '#ec4899', gradient: 'from-pink-500/20 to-rose-500/20' },
    general: { bg: 'rgba(113,113,122,0.1)', border: 'rgba(113,113,122,0.3)', text: '#71717a', gradient: 'from-zinc-500/20 to-gray-500/20' },
    data_science: { bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.3)', text: '#06b6d4', gradient: 'from-cyan-500/20 to-sky-500/20' },
    devops: { bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)', text: '#f97316', gradient: 'from-orange-500/20 to-red-500/20' },
    ui_ux: { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.3)', text: '#8b5cf6', gradient: 'from-violet-500/20 to-purple-500/20' },
    finance: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', text: '#22c55e', gradient: 'from-green-500/20 to-emerald-500/20' },
    medical: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#ef4444', gradient: 'from-red-500/20 to-rose-500/20' },
    education: { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)', text: '#6366f1', gradient: 'from-indigo-500/20 to-blue-500/20' },
    seo_content: { bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)', text: '#eab308', gradient: 'from-yellow-500/20 to-lime-500/20' },
    product: { bg: 'rgba(20,184,166,0.1)', border: 'rgba(20,184,166,0.3)', text: '#14b8a6', gradient: 'from-teal-500/20 to-cyan-500/20' },
};

// ============================================
// ICON MAP
// ============================================
export const iconMap = {
    software: Code,
    marketing: Zap,
    academic: Shield,
    legal: FileText,
    creative: Wand2,
    general: Globe,
    data_science: Database,
    devops: Cloud,
    ui_ux: Palette,
    finance: DollarSign,
    medical: Heart,
    education: GraduationCap,
    seo_content: Search,
    product: Package,
};

// ============================================
// SHARED DOMAIN FIELDS (language-independent options)
// ============================================
const SW_LANGS = ['Python', 'JavaScript', 'TypeScript', 'Java', 'C#', 'C++', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'R', 'Scala'].map(v => ({ value: v, label: v }));
const SW_FRAMEWORKS = ['React', 'Vue', 'Angular', 'Next.js', 'Nuxt', 'Svelte', 'Django', 'Flask', 'FastAPI', 'Express', 'NestJS', 'Spring Boot', 'Laravel', 'Rails', '.NET', 'Gin', 'None/Vanilla'].map(v => ({ value: v, label: v }));
const CITATION_STYLES = ['APA 7th', 'IEEE', 'MLA 9th', 'Chicago', 'Harvard', 'Vancouver', 'None'].map(v => ({ value: v, label: v }));

// ============================================
// FULL CONTENT — Arabic + English
// ============================================
export const content = {
    ar: {
        nexusTitle: 'مهندس البرومبت v4.0',
        nexusSubtitle: 'المحرك المتقدم لتوليد البرومبتات',
        masterPrompt: 'البرومبت الماستر',
        selectDomain: 'اختر المجال',
        domainContext: 'سياق المجال',
        coreTask: 'المهمة الأساسية',
        taskQuestion: 'ما هي المهمة المحددة؟ *',
        rawDataLabel: 'بيانات/خلفية خام (اختياري)',
        guardrails: 'الحواجز الأمنية',
        avoidQuestion: 'ما الذي يجب تجنبه؟ (قيود سلبية)',
        factCheck: 'وضع التحقق (مضاد للهلوسة)',
        compile: 'توليد البرومبت',
        compiling: 'جاري التوليد...',
        copy: 'نسخ',
        copied: 'تم النسخ!',
        refine: 'تحسين',
        test: 'تجربة',
        contextStatus: 'السياق',
        taskStatus: 'المهمة',
        ready: 'جاهز',
        required: 'مطلوب',
        factOn: 'التحقق مفعل',
        factOff: 'التحقق معطل',
        outputHere: 'البرومبت الماستر سيظهر هنا',
        dynamicContext: 'مع سياق ديناميكي للمجال',
        testOutput: 'نتيجة التجربة',
        proTip: '💡 السياق الديناميكي يُضيف قواعد تلقائياً. مثال: React → استخدم Hooks',
        selectOption: '-- اختر --',
        strategy: 'استراتيجية البرومبت',
        autoDetect: 'اكتشاف تلقائي',
        templates: 'القوالب الجاهزة',
        browseTemplates: 'تصفح القوالب',
        useTemplate: 'استخدم هذا القالب',
        history: 'السجل',
        clearHistory: 'مسح السجل',
        score: 'تقييم',
        promptScore: 'قوة البرومبت',
        weak: 'ضعيف',
        medium: 'متوسط',
        strong: 'قوي',
        excellent: 'ممتاز',
        domains: [
            { id: 'software', label: '👨‍💻 هندسة البرمجيات', emoji: '👨‍💻' },
            { id: 'marketing', label: '📈 التسويق الرقمي', emoji: '📈' },
            { id: 'academic', label: '🎓 البحث الأكاديمي', emoji: '🎓' },
            { id: 'legal', label: '⚖️ القانونية', emoji: '⚖️' },
            { id: 'creative', label: '🎨 الكتابة الإبداعية', emoji: '🎨' },
            { id: 'data_science', label: '🤖 علوم البيانات و AI', emoji: '🤖' },
            { id: 'devops', label: '☁️ DevOps و Cloud', emoji: '☁️' },
            { id: 'ui_ux', label: '🎨 تصميم UI/UX', emoji: '🎨' },
            { id: 'finance', label: '💰 المالية والتحليل', emoji: '💰' },
            { id: 'medical', label: '🏥 الطبي والصحي', emoji: '🏥' },
            { id: 'education', label: '📚 التعليم', emoji: '📚' },
            { id: 'seo_content', label: '🔍 SEO والمحتوى', emoji: '🔍' },
            { id: 'product', label: '📦 إدارة المنتجات', emoji: '📦' },
            { id: 'general', label: '🌐 عام / مخصص', emoji: '🌐' },
        ],
        placeholders: {
            task: 'مثال: إنشاء نظام مصادقة مستخدم مع التحقق من البريد',
            rawData: 'الصق أي كود، بيانات، أو سياق إضافي...',
            constraints: 'مثال: لا مكتبات خارجية، لا أنماط معقدة...'
        },
        fields: {
            software: [
                { key: 'language', label: 'لغة البرمجة', type: 'select', options: SW_LANGS },
                { key: 'framework', label: 'إطار العمل', type: 'select', options: SW_FRAMEWORKS },
                {
                    key: 'complexity', label: 'مستوى الكود', type: 'select', options: [
                        { value: 'Junior (Simple, Commented)', label: 'مبتدئ (بسيط، مُعلق)' },
                        { value: 'Senior (Clean, Optimized)', label: 'متقدم (نظيف، محسّن)' },
                        { value: 'Architect (Scalable, Patterns)', label: 'معماري (قابل للتوسع، أنماط)' }
                    ]
                },
                {
                    key: 'architecture', label: 'نمط الهندسة', type: 'select', options: [
                        { value: 'MVC', label: 'MVC' }, { value: 'Microservices', label: 'Microservices' },
                        { value: 'Monolith', label: 'Monolith' }, { value: 'Serverless', label: 'Serverless' },
                        { value: 'Event-Driven', label: 'Event-Driven' }, { value: 'Clean Architecture', label: 'Clean Architecture' },
                    ]
                },
                {
                    key: 'testStrategy', label: 'استراتيجية الاختبار', type: 'select', options: [
                        { value: 'Unit Tests', label: 'Unit Tests' }, { value: 'Integration Tests', label: 'Integration Tests' },
                        { value: 'E2E Tests', label: 'E2E Tests' }, { value: 'TDD', label: 'TDD' },
                        { value: 'No Tests', label: 'بدون اختبارات' },
                    ]
                },
            ],
            marketing: [
                {
                    key: 'platform', label: 'المنصة', type: 'select', options: [
                        'LinkedIn', 'Twitter/X', 'Instagram', 'Facebook', 'TikTok', 'Email', 'Blog/Article', 'Landing Page', 'YouTube', 'Google Ads', 'Other'
                    ].map(v => ({ value: v, label: v }))
                },
                { key: 'audience', label: 'الجمهور المستهدف', type: 'text', placeholder: 'مثال: جيل Z، رواد الأعمال' },
                {
                    key: 'goal', label: 'هدف الحملة', type: 'select', options: [
                        { value: 'Sales/Conversion', label: 'مبيعات/تحويل' }, { value: 'Brand Awareness', label: 'وعي بالعلامة' },
                        { value: 'Lead Generation', label: 'توليد عملاء' }, { value: 'Engagement/Viral', label: 'تفاعل/فيرال' },
                        { value: 'Community Building', label: 'بناء مجتمع' }, { value: 'Product Launch', label: 'إطلاق منتج' },
                    ]
                },
                {
                    key: 'funnelStage', label: 'مرحلة القمع', type: 'select', options: [
                        { value: 'TOFU (Awareness)', label: 'TOFU (وعي)' }, { value: 'MOFU (Consideration)', label: 'MOFU (اعتبار)' },
                        { value: 'BOFU (Decision)', label: 'BOFU (قرار)' },
                    ]
                },
            ],
            academic: [
                { key: 'field', label: 'المجال الأكاديمي', type: 'text', placeholder: 'مثال: الأحياء، علوم الحاسوب' },
                { key: 'citation', label: 'أسلوب الاقتباس', type: 'select', options: CITATION_STYLES },
                {
                    key: 'level', label: 'المستوى الأكاديمي', type: 'select', options: [
                        { value: 'High School', label: 'ثانوي' }, { value: 'Undergraduate', label: 'جامعي' },
                        { value: 'Graduate/Masters', label: 'ماجستير' }, { value: 'PhD/Doctoral', label: 'دكتوراه' },
                        { value: 'Peer-Reviewed Publication', label: 'نشر محكّم' },
                    ]
                },
                {
                    key: 'methodology', label: 'المنهجية', type: 'select', options: [
                        { value: 'Qualitative', label: 'نوعي' }, { value: 'Quantitative', label: 'كمي' },
                        { value: 'Mixed Methods', label: 'مختلط' }, { value: 'Systematic Review', label: 'مراجعة منهجية' },
                    ]
                },
            ],
            legal: [
                {
                    key: 'jurisdiction', label: 'الاختصاص القضائي', type: 'select', options: [
                        'Egypt', 'United States', 'United Kingdom', 'European Union', 'UAE', 'Saudi Arabia', 'International', 'Other'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'docType', label: 'نوع المستند', type: 'select', options: [
                        { value: 'Contract/Agreement', label: 'عقد/اتفاقية' }, { value: 'Legal Memo', label: 'مذكرة قانونية' },
                        { value: 'Terms of Service', label: 'شروط الخدمة' }, { value: 'Privacy Policy', label: 'سياسة الخصوصية' },
                        { value: 'NDA', label: 'اتفاقية سرية' }, { value: 'Legal Opinion', label: 'رأي قانوني' },
                    ]
                },
                {
                    key: 'riskLevel', label: 'مستوى المخاطرة', type: 'select', options: [
                        { value: 'Aggressive (Max Benefit)', label: 'هجومي (أقصى فائدة)' },
                        { value: 'Balanced', label: 'متوازن' },
                        { value: 'Protective/Safe (Min Risk)', label: 'حمائي (أقل مخاطرة)' },
                    ]
                },
            ],
            creative: [
                { key: 'genre', label: 'النوع الأدبي', type: 'text', placeholder: 'مثال: خيال علمي، رومانسي' },
                {
                    key: 'tone', label: 'النبرة', type: 'select', options: [
                        'Dramatic', 'Humorous', 'Dark/Gritty', 'Whimsical', 'Inspirational', 'Suspenseful', 'Romantic', 'Satirical'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'format', label: 'شكل المحتوى', type: 'select', options: [
                        { value: 'Short Story', label: 'قصة قصيرة' }, { value: 'Novel Chapter', label: 'فصل رواية' },
                        { value: 'Screenplay', label: 'سيناريو' }, { value: 'Poetry', label: 'شعر' },
                        { value: 'Blog Post', label: 'مقال مدونة' }, { value: 'Song Lyrics', label: 'كلمات أغنية' },
                    ]
                },
                {
                    key: 'pov', label: 'وجهة النظر', type: 'select', options: [
                        { value: 'First Person', label: 'أول شخص' }, { value: 'Third Person', label: 'ثالث شخص' },
                        { value: 'Omniscient', label: 'عالم بكل شيء' },
                    ]
                },
            ],
            data_science: [
                {
                    key: 'modelType', label: 'نوع النموذج', type: 'select', options: [
                        'Classification', 'Regression', 'Clustering', 'NLP', 'Computer Vision', 'Time Series', 'Recommendation', 'Generative AI'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'framework', label: 'إطار العمل', type: 'select', options: [
                        'PyTorch', 'TensorFlow', 'Scikit-learn', 'Pandas', 'Hugging Face', 'LangChain', 'OpenCV', 'XGBoost'
                    ].map(v => ({ value: v, label: v }))
                },
                { key: 'metric', label: 'مقياس النجاح', type: 'text', placeholder: 'مثال: Accuracy, F1-Score, RMSE' },
            ],
            devops: [
                {
                    key: 'cloudProvider', label: 'مزود السحابة', type: 'select', options: [
                        'AWS', 'GCP', 'Azure', 'DigitalOcean', 'Vercel', 'Railway', 'Self-Hosted'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'iacTool', label: 'أداة IaC', type: 'select', options: [
                        'Terraform', 'CloudFormation', 'Pulumi', 'Ansible', 'Docker Compose', 'Kubernetes YAML'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'cicd', label: 'CI/CD', type: 'select', options: [
                        'GitHub Actions', 'GitLab CI', 'Jenkins', 'CircleCI', 'ArgoCD'
                    ].map(v => ({ value: v, label: v }))
                },
            ],
            ui_ux: [
                {
                    key: 'designSystem', label: 'نظام التصميم', type: 'select', options: [
                        'Material Design', 'Apple HIG', 'Tailwind UI', 'Ant Design', 'Custom', 'Shadcn/UI'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'platform', label: 'المنصة', type: 'select', options: [
                        'Web', 'iOS', 'Android', 'Cross-Platform', 'Desktop'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'accessibility', label: 'مستوى الإتاحة', type: 'select', options: [
                        { value: 'WCAG AA', label: 'WCAG AA' }, { value: 'WCAG AAA', label: 'WCAG AAA' },
                        { value: 'Basic', label: 'أساسي' },
                    ]
                },
            ],
            finance: [
                {
                    key: 'reportType', label: 'نوع التقرير', type: 'select', options: [
                        'Financial Analysis', 'Business Plan', 'Investment Memo', 'Budget Forecast', 'Valuation', 'Audit Report'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'standard', label: 'المعيار المحاسبي', type: 'select', options: [
                        'IFRS', 'GAAP', 'Egyptian Standards', 'None/Custom'
                    ].map(v => ({ value: v, label: v }))
                },
            ],
            medical: [
                { key: 'specialty', label: 'التخصص', type: 'text', placeholder: 'مثال: أمراض القلب، طب الأطفال' },
                {
                    key: 'evidenceLevel', label: 'مستوى الأدلة', type: 'select', options: [
                        { value: 'Evidence-Based (Meta-Analysis)', label: 'مبني على أدلة' },
                        { value: 'Clinical Guidelines', label: 'إرشادات سريرية' },
                        { value: 'Expert Opinion', label: 'رأي خبير' },
                        { value: 'Educational (Simplified)', label: 'تعليمي (مبسط)' },
                    ]
                },
            ],
            education: [
                {
                    key: 'gradeLevel', label: 'المرحلة الدراسية', type: 'select', options: [
                        { value: 'Elementary (K-5)', label: 'ابتدائي' }, { value: 'Middle (6-8)', label: 'إعدادي' },
                        { value: 'High School (9-12)', label: 'ثانوي' }, { value: 'University', label: 'جامعي' },
                        { value: 'Professional Training', label: 'تدريب مهني' },
                    ]
                },
                { key: 'subject', label: 'المادة', type: 'text', placeholder: 'مثال: رياضيات، علوم، لغة عربية' },
                {
                    key: 'assessmentType', label: 'نوع التقييم', type: 'select', options: [
                        { value: 'Quiz', label: 'اختبار قصير' }, { value: 'Exam', label: 'امتحان' },
                        { value: 'Project', label: 'مشروع' }, { value: 'Lesson Plan', label: 'خطة درس' },
                    ]
                },
            ],
            seo_content: [
                {
                    key: 'contentType', label: 'نوع المحتوى', type: 'select', options: [
                        'Blog Article', 'Product Description', 'Landing Page', 'Social Post', 'Video Script', 'Newsletter'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'searchIntent', label: 'نية البحث', type: 'select', options: [
                        { value: 'Informational', label: 'معلوماتي' }, { value: 'Transactional', label: 'تجاري' },
                        { value: 'Navigational', label: 'تصفحي' }, { value: 'Commercial Investigation', label: 'بحث تجاري' },
                    ]
                },
                { key: 'keywords', label: 'الكلمات المفتاحية', type: 'text', placeholder: 'مثال: best AI tools, أفضل أدوات' },
            ],
            product: [
                {
                    key: 'stage', label: 'المرحلة', type: 'select', options: [
                        { value: 'Discovery', label: 'اكتشاف' }, { value: 'Definition', label: 'تعريف' },
                        { value: 'Development', label: 'تطوير' }, { value: 'Launch', label: 'إطلاق' },
                        { value: 'Growth', label: 'نمو' },
                    ]
                },
                {
                    key: 'methodology', label: 'المنهجية', type: 'select', options: [
                        'Agile/Scrum', 'Lean Startup', 'Design Thinking', 'Waterfall', 'SAFe'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'deliverable', label: 'المُخرج', type: 'select', options: [
                        { value: 'PRD', label: 'PRD' }, { value: 'User Stories', label: 'قصص مستخدم' },
                        { value: 'Roadmap', label: 'خارطة طريق' }, { value: 'Sprint Plan', label: 'خطة سبرنت' },
                    ]
                },
            ],
            general: [
                {
                    key: 'outputType', label: 'نوع المخرج', type: 'select', options: [
                        { value: 'Article/Essay', label: 'مقال' }, { value: 'Code', label: 'كود' },
                        { value: 'List/Checklist', label: 'قائمة' }, { value: 'Email', label: 'بريد' },
                        { value: 'Report', label: 'تقرير' }, { value: 'Summary', label: 'ملخص' },
                        { value: 'Translation', label: 'ترجمة' }, { value: 'Other', label: 'أخرى' },
                    ]
                },
                {
                    key: 'tone', label: 'النبرة', type: 'select', options: [
                        { value: 'Professional', label: 'احترافي' }, { value: 'Casual', label: 'عادي' },
                        { value: 'Academic', label: 'أكاديمي' }, { value: 'Friendly', label: 'ودي' },
                        { value: 'Authoritative', label: 'موثوق' },
                    ]
                },
            ],
        },
    },
    en: {
        nexusTitle: 'Prompt Architect v4.0',
        nexusSubtitle: 'Advanced Prompt Engineering Engine',
        masterPrompt: 'Master Prompt',
        selectDomain: 'Select Domain',
        domainContext: 'Domain Context',
        coreTask: 'Core Task',
        taskQuestion: 'What is the specific mission? *',
        rawDataLabel: 'Raw Data/Background (Optional)',
        guardrails: 'Guardrails',
        avoidQuestion: 'What to avoid? (Negative Constraints)',
        factCheck: 'Fact-Check Mode (Anti-Hallucination)',
        compile: 'Generate Prompt',
        compiling: 'Generating...',
        copy: 'Copy',
        copied: 'Copied!',
        refine: 'Refine',
        test: 'Test',
        contextStatus: 'Context',
        taskStatus: 'Task',
        ready: 'Ready',
        required: 'Required',
        factOn: 'Fact-Check ON',
        factOff: 'Fact-Check OFF',
        outputHere: 'Master prompt will appear here',
        dynamicContext: 'With dynamic domain context',
        testOutput: 'Test Output',
        proTip: '💡 Dynamic context auto-injects domain rules. E.g., React → "Use Hooks and functional patterns"',
        selectOption: '-- Select --',
        strategy: 'Prompt Strategy',
        autoDetect: 'Auto-Detect',
        templates: 'Templates',
        browseTemplates: 'Browse Templates',
        useTemplate: 'Use This Template',
        history: 'History',
        clearHistory: 'Clear History',
        score: 'Score',
        promptScore: 'Prompt Strength',
        weak: 'Weak',
        medium: 'Medium',
        strong: 'Strong',
        excellent: 'Excellent',
        domains: [
            { id: 'software', label: '👨‍💻 Software Engineering', emoji: '👨‍💻' },
            { id: 'marketing', label: '📈 Digital Marketing', emoji: '📈' },
            { id: 'academic', label: '🎓 Academic Research', emoji: '🎓' },
            { id: 'legal', label: '⚖️ Legal', emoji: '⚖️' },
            { id: 'creative', label: '🎨 Creative Writing', emoji: '🎨' },
            { id: 'data_science', label: '🤖 Data Science & AI', emoji: '🤖' },
            { id: 'devops', label: '☁️ DevOps & Cloud', emoji: '☁️' },
            { id: 'ui_ux', label: '🎨 UI/UX Design', emoji: '🎨' },
            { id: 'finance', label: '💰 Finance & Analysis', emoji: '💰' },
            { id: 'medical', label: '🏥 Medical & Health', emoji: '🏥' },
            { id: 'education', label: '📚 Education', emoji: '📚' },
            { id: 'seo_content', label: '🔍 SEO & Content', emoji: '🔍' },
            { id: 'product', label: '📦 Product Management', emoji: '📦' },
            { id: 'general', label: '🌐 General / Custom', emoji: '🌐' },
        ],
        placeholders: {
            task: 'e.g., Build a user authentication system with email verification',
            rawData: 'Paste any code, data, or additional context...',
            constraints: 'e.g., No external libraries, No complex patterns...'
        },
        fields: {
            software: [
                { key: 'language', label: 'Programming Language', type: 'select', options: SW_LANGS },
                { key: 'framework', label: 'Framework/Library', type: 'select', options: SW_FRAMEWORKS },
                {
                    key: 'complexity', label: 'Code Level', type: 'select', options: [
                        { value: 'Junior (Simple, Commented)', label: 'Junior (Simple, Commented)' },
                        { value: 'Senior (Clean, Optimized)', label: 'Senior (Clean, Optimized)' },
                        { value: 'Architect (Scalable, Patterns)', label: 'Architect (Scalable, Patterns)' },
                    ]
                },
                {
                    key: 'architecture', label: 'Architecture Pattern', type: 'select', options: [
                        'MVC', 'Microservices', 'Monolith', 'Serverless', 'Event-Driven', 'Clean Architecture'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'testStrategy', label: 'Testing Strategy', type: 'select', options: [
                        'Unit Tests', 'Integration Tests', 'E2E Tests', 'TDD', 'No Tests'
                    ].map(v => ({ value: v, label: v }))
                },
            ],
            marketing: [
                {
                    key: 'platform', label: 'Platform', type: 'select', options: [
                        'LinkedIn', 'Twitter/X', 'Instagram', 'Facebook', 'TikTok', 'Email', 'Blog/Article', 'Landing Page', 'YouTube', 'Google Ads', 'Other'
                    ].map(v => ({ value: v, label: v }))
                },
                { key: 'audience', label: 'Target Audience', type: 'text', placeholder: 'e.g., Gen-Z, Entrepreneurs' },
                {
                    key: 'goal', label: 'Campaign Goal', type: 'select', options: [
                        'Sales/Conversion', 'Brand Awareness', 'Lead Generation', 'Engagement/Viral', 'Community Building', 'Product Launch'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'funnelStage', label: 'Funnel Stage', type: 'select', options: [
                        'TOFU (Awareness)', 'MOFU (Consideration)', 'BOFU (Decision)'
                    ].map(v => ({ value: v, label: v }))
                },
            ],
            academic: [
                { key: 'field', label: 'Academic Field', type: 'text', placeholder: 'e.g., Biology, Computer Science' },
                { key: 'citation', label: 'Citation Style', type: 'select', options: CITATION_STYLES },
                {
                    key: 'level', label: 'Academic Level', type: 'select', options: [
                        'High School', 'Undergraduate', 'Graduate/Masters', 'PhD/Doctoral', 'Peer-Reviewed Publication'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'methodology', label: 'Methodology', type: 'select', options: [
                        'Qualitative', 'Quantitative', 'Mixed Methods', 'Systematic Review'
                    ].map(v => ({ value: v, label: v }))
                },
            ],
            legal: [
                {
                    key: 'jurisdiction', label: 'Jurisdiction', type: 'select', options: [
                        'Egypt', 'United States', 'United Kingdom', 'European Union', 'UAE', 'Saudi Arabia', 'International', 'Other'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'docType', label: 'Document Type', type: 'select', options: [
                        'Contract/Agreement', 'Legal Memo', 'Terms of Service', 'Privacy Policy', 'NDA', 'Legal Opinion'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'riskLevel', label: 'Risk Approach', type: 'select', options: [
                        'Aggressive (Max Benefit)', 'Balanced', 'Protective/Safe (Min Risk)'
                    ].map(v => ({ value: v, label: v }))
                },
            ],
            creative: [
                { key: 'genre', label: 'Genre/Style', type: 'text', placeholder: 'e.g., Sci-Fi, Romance, Horror' },
                {
                    key: 'tone', label: 'Tone', type: 'select', options: [
                        'Dramatic', 'Humorous', 'Dark/Gritty', 'Whimsical', 'Inspirational', 'Suspenseful', 'Romantic', 'Satirical'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'format', label: 'Content Format', type: 'select', options: [
                        'Short Story', 'Novel Chapter', 'Screenplay', 'Poetry', 'Blog Post', 'Song Lyrics'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'pov', label: 'Point of View', type: 'select', options: [
                        'First Person', 'Third Person', 'Omniscient'
                    ].map(v => ({ value: v, label: v }))
                },
            ],
            data_science: [
                {
                    key: 'modelType', label: 'Model Type', type: 'select', options: [
                        'Classification', 'Regression', 'Clustering', 'NLP', 'Computer Vision', 'Time Series', 'Recommendation', 'Generative AI'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'framework', label: 'Framework', type: 'select', options: [
                        'PyTorch', 'TensorFlow', 'Scikit-learn', 'Pandas', 'Hugging Face', 'LangChain', 'OpenCV', 'XGBoost'
                    ].map(v => ({ value: v, label: v }))
                },
                { key: 'metric', label: 'Success Metric', type: 'text', placeholder: 'e.g., Accuracy, F1-Score, RMSE' },
            ],
            devops: [
                {
                    key: 'cloudProvider', label: 'Cloud Provider', type: 'select', options: [
                        'AWS', 'GCP', 'Azure', 'DigitalOcean', 'Vercel', 'Railway', 'Self-Hosted'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'iacTool', label: 'IaC Tool', type: 'select', options: [
                        'Terraform', 'CloudFormation', 'Pulumi', 'Ansible', 'Docker Compose', 'Kubernetes YAML'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'cicd', label: 'CI/CD', type: 'select', options: [
                        'GitHub Actions', 'GitLab CI', 'Jenkins', 'CircleCI', 'ArgoCD'
                    ].map(v => ({ value: v, label: v }))
                },
            ],
            ui_ux: [
                {
                    key: 'designSystem', label: 'Design System', type: 'select', options: [
                        'Material Design', 'Apple HIG', 'Tailwind UI', 'Ant Design', 'Custom', 'Shadcn/UI'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'platform', label: 'Platform', type: 'select', options: [
                        'Web', 'iOS', 'Android', 'Cross-Platform', 'Desktop'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'accessibility', label: 'Accessibility Level', type: 'select', options: [
                        'WCAG AA', 'WCAG AAA', 'Basic'
                    ].map(v => ({ value: v, label: v }))
                },
            ],
            finance: [
                {
                    key: 'reportType', label: 'Report Type', type: 'select', options: [
                        'Financial Analysis', 'Business Plan', 'Investment Memo', 'Budget Forecast', 'Valuation', 'Audit Report'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'standard', label: 'Accounting Standard', type: 'select', options: [
                        'IFRS', 'GAAP', 'Egyptian Standards', 'None/Custom'
                    ].map(v => ({ value: v, label: v }))
                },
            ],
            medical: [
                { key: 'specialty', label: 'Specialty', type: 'text', placeholder: 'e.g., Cardiology, Pediatrics' },
                {
                    key: 'evidenceLevel', label: 'Evidence Level', type: 'select', options: [
                        'Evidence-Based (Meta-Analysis)', 'Clinical Guidelines', 'Expert Opinion', 'Educational (Simplified)'
                    ].map(v => ({ value: v, label: v }))
                },
            ],
            education: [
                {
                    key: 'gradeLevel', label: 'Grade Level', type: 'select', options: [
                        'Elementary (K-5)', 'Middle (6-8)', 'High School (9-12)', 'University', 'Professional Training'
                    ].map(v => ({ value: v, label: v }))
                },
                { key: 'subject', label: 'Subject', type: 'text', placeholder: 'e.g., Math, Science, English' },
                {
                    key: 'assessmentType', label: 'Assessment Type', type: 'select', options: [
                        'Quiz', 'Exam', 'Project', 'Lesson Plan'
                    ].map(v => ({ value: v, label: v }))
                },
            ],
            seo_content: [
                {
                    key: 'contentType', label: 'Content Type', type: 'select', options: [
                        'Blog Article', 'Product Description', 'Landing Page', 'Social Post', 'Video Script', 'Newsletter'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'searchIntent', label: 'Search Intent', type: 'select', options: [
                        'Informational', 'Transactional', 'Navigational', 'Commercial Investigation'
                    ].map(v => ({ value: v, label: v }))
                },
                { key: 'keywords', label: 'Target Keywords', type: 'text', placeholder: 'e.g., best AI tools, prompt engineering' },
            ],
            product: [
                {
                    key: 'stage', label: 'Stage', type: 'select', options: [
                        'Discovery', 'Definition', 'Development', 'Launch', 'Growth'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'methodology', label: 'Methodology', type: 'select', options: [
                        'Agile/Scrum', 'Lean Startup', 'Design Thinking', 'Waterfall', 'SAFe'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'deliverable', label: 'Deliverable', type: 'select', options: [
                        'PRD', 'User Stories', 'Roadmap', 'Sprint Plan'
                    ].map(v => ({ value: v, label: v }))
                },
            ],
            general: [
                {
                    key: 'outputType', label: 'Output Type', type: 'select', options: [
                        'Article/Essay', 'Code', 'List/Checklist', 'Email', 'Report', 'Summary', 'Translation', 'Other'
                    ].map(v => ({ value: v, label: v }))
                },
                {
                    key: 'tone', label: 'Tone', type: 'select', options: [
                        'Professional', 'Casual', 'Academic', 'Friendly', 'Authoritative'
                    ].map(v => ({ value: v, label: v }))
                },
            ],
        },
    },
};
