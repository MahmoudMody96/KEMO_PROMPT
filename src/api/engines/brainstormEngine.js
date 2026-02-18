// BRAINSTORM ENGINE - brainstorm_concept + generateIdeaPrompt + helpers
import { TEXT_MODEL } from '../config.js';
import { callOpenRouter } from '../openrouter.js';
import { getPersona } from './personaEngine.js';
import { getStyleDNA } from './styleDnaEngine.js';
import { getCharacterDNA } from './characterDnaEngine.js';
import { getVoiceToneDNA } from './voiceToneDnaEngine.js';
import { getDialectDNA } from './dialectDnaEngine.js';
import { getTransparentCreatureRules } from './transparentCreatureEngine.js';

// --- GENRE DNA EXTRACTOR v1.0 ---
// Extracts the complete DNA from existing Persona definitions
export const getGenreDNA = (genre) => {
    const persona = getPersona(genre);

    return {
        type: genre,
        mission: persona.mission,
        laws: persona.laws,
        mustHaves: persona.must_haves,
        content_mandates: persona.content_mandates || [],
        signature: persona.signature_style,
        references: persona.inspired_by,
        pitfalls: persona.common_pitfalls
    };
};

// --- MORAL/LESSON TEMPLATE SYSTEM v1.0 ---
// Provides genre-specific moral templates to ensure every idea has value/lesson
const getMoralTemplates = (genre) => {
    const normalize = (s) => (s || '').toLowerCase();
    const g = normalize(genre);

    // MEDICAL / HEALTH / SCIENCE
    if (g.includes('medical') || g.includes('health') || g.includes('science') || g.includes('طبي') || g.includes('صحة')) {
        return [
            "الوقاية خير من العلاج - جسمك بيتكلم، استمع له",
            "المعرفة الطبية تنقذ حياتك - الجهل بيدمرها",
            "التوازن هو السر - الإفراط في أي حاجة ضرر",
            "جسمك مصنع 24/7 بيشتغل عشانك - متحملوش فوق طاقته",
            "الصحة ثروة حقيقية - متضيعهاش على حاجات تافهة",
            "الأعراض إشارات تحذير - متتجاهلهاش",
            "العلم والبحث أساس الصحة - مش الخرافات",
            "الوعي الصحي بيحمي اللي حواليك مش بس نفسك"
        ];
    }

    // COMEDY / FUNNY / SATIRE
    if (g.includes('comedy') || g.includes('funny') || g.includes('satire') || g.includes('كوميدي') || g.includes('ساخر')) {
        return [
            "الضحك بيخليك تشوف الحياة من زاوية تانية",
            "أحياناً الحل الأبسط للمشاكل هو إنك تضحك عليها",
            "الكوميديا في التفاصيل الصغيرة اللي بنتجاهلها",
            "متخليش الحياة تثقل عليك - الفكاهة سلاح سري",
            "وراء كل موقف كوميدي حقيقة عميقة",
            "الضحك على نفسك أول خطوة للتطور",
            "الفكاهة بتقرّب الناس من بعض",
            "العبثية جزء من الحياة - اتقبلها واضحك"
        ];
    }

    // DOCUMENTARY / HISTORY / EDUCATIONAL  
    if (g.includes('documentary') || g.includes('history') || g.includes('وثائقي') || g.includes('تاريخ')) {
        return [
            "الحقيقة أقوى من الخيال - والماضي مفتاح المستقبل",
            "التاريخ بيعيد نفسه لو ما اتعلمناش منه",
            "المعرفة قوة - والجهل عبودية",
            "وراء كل ظاهرة حكاية تستحق المعرفة",
            "الفهم أول خطوة للتغيير الحقيقي",
            "الأسئلة الصح بتوصلك للحقيقة",
            "الوثائق والأدلة أقوى من الآراء",
            "كل حدث تاريخي درس للحاضر"
        ];
    }

    // HORROR / THRILLER / MYSTERY
    if (g.includes('horror') || g.includes('thriller') || g.includes('mystery') || g.includes('رعب') || g.includes('غموض')) {
        return [
            "أكبر مخاوفنا أحياناً مجرد وهم في العقل",
            "الشجاعة مش غياب الخوف - هي مواجهته",
            "الخطر الحقيقي دايماً في اللي ما تعرفوش",
            "واجه مخاوفك عشان تتحرر منها",
            "الخوف بيكبر في الظلام - نوّر طريقك",
            "المجهول مخيف بس الفضول أقوى",
            "الغموض بيدفعنا نبحث عن الحقيقة",
            "أحياناً الخوف بيحمينا من الخطر الحقيقي"
        ];
    }

    // MOTIVATIONAL / SPORTS / INSPIRATION
    if (g.includes('motivational') || g.includes('gym') || g.includes('sports') || g.includes('تحفيزي') || g.includes('رياضة')) {
        return [
            "الإرادة تهزم المستحيل - والإصرار يصنع المعجزات",
            "كل خطوة صغيرة بتوصلك للهدف الكبير",
            "الفشل درس مش نهاية - قوم وكمّل",
            "قوتك الحقيقية جواك - اكتشفها",
            "النجاح نتيجة إصرار مش موهبة بس",
            "التحدي بيطلع أحسن ما فيك",
            "الألم مؤقت - الإنجاز دائم",
            "حدد هدفك وامشي - الطريق هيتضح"
        ];
    }

    // EDUCATIONAL / TUTORIAL / EXPLANATION
    if (g.includes('educational') || g.includes('tutorial') || g.includes('تعليمي') || g.includes('شرح') || g.includes('تبسيط')) {
        return [
            "التعلم رحلة مستمرة مش وجهة نهائية",
            "الفهم أهم بكتير من الحفظ",
            "كل معرفة جديدة بتفتح أبواب أكتر",
            "السؤال أول خطوة في طريق العلم",
            "البساطة في الشرح مفتاح الفهم",
            "التطبيق العملي يثبت المعلومة",
            "التعليم استثمار في نفسك",
            "شارك معرفتك - العلم ينمو بالمشاركة"
        ];
    }

    // SOCIAL MEDIA / VIRAL (dedicated — not marketing)
    if (g.includes('viral') || g.includes('social media') || g.includes('trend')) {
        return [
            "السعادة في اللحظات الصغيرة اللي بنتشاركها مع اللي بنحبهم",
            "أحياناً الموقف العادي بيبقى أحلى ذكرى",
            "الضحك مع الناس أحسن علاج للضغوط",
            "متخليش الخجل يمنعك تعيش اللحظة",
            "الصراحة أحياناً بتكون مضحكة أكتر من الكدب",
            "الحياة مليانة مواقف كوميدية لو بصيت صح",
            "اللي بيخلينا نضحك مع بعض هو اللي بيقرّبنا",
            "الاعتراف بالموقف المحرج أسهل من التبرير"
        ];
    }

    // COMMERCIAL / MARKETING
    if (g.includes('commercial') || g.includes('marketing') || g.includes('ad') || g.includes('إعلان') || g.includes('تسويق')) {
        return [
            "الجودة تتكلم عن نفسها - مش محتاجة دعاية كتير",
            "الثقة أساس كل علاقة تجارية ناجحة",
            "القيمة الحقيقية في التجربة مش السعر",
            "الحل الذكي يوفر الوقت والجهد والفلوس",
            "الاستثمار الصح في نفسك بيدفع نفسه",
            "ابحث عن المشكلة الحقيقية - والحل هيبيع نفسه",
            "العميل الراضي أفضل إعلان",
            "الابتكار يخلق أسواق جديدة"
        ];
    }

    // COOKING / FOOD / RECIPE
    if (g.includes('cooking') || g.includes('food') || g.includes('recipe') || g.includes('طبخ')) {
        return [
            "الطبخ فن ومحبة - والصبر سر النكهة",
            "المكونات البسيطة تعمل معجزات لو اتعاملت معاها صح",
            "الطعام لغة عالمية بتقرّب القلوب",
            "في المطبخ، الحب هو المكون السري",
            "الإتقان في التفاصيل - والنكهة في التوازن",
            "كل وصفة حكاية - والطبخ رواية",
            "التجربة والخطأ طريق الإبداع في المطبخ",
            "الطعام الصحي مش محتاج يكون ممل"
        ];
    }

    // DEFAULT (General/Drama)
    return [
        "الحياة دروس - والتجربة أقوى معلم",
        "الصعوبات بتطلع أحسن ما فينا",
        "كل قرار بيشكل مستقبلك",
        "التغيير يبدأ من جوّاك",
        "القيمة الحقيقية في الرحلة مش الوصول",
        "الإنسانية في التعاطف والتفهم",
        "الماضي درس - الحاضر فرصة - المستقبل أمل"
    ];
};

// --- STRATEGIC BRAINSTORMING ENGINE ---

export async function brainstorm_concept(inputs) {
    try {
        const ideaSystemPrompt = generateIdeaPrompt(inputs);

        // User message: brief trigger with key params (including secondary characters + seed idea)
        const primaryChar = inputs.characters?.primary || inputs.characterType || 'Auto';
        const secondaryChars = (inputs.characters?.secondary || []).filter(s => s);
        const secondaryCharsText = secondaryChars.length > 0 ? ` | شخصيات فرعية: ${secondaryChars.join('، ')}` : '';
        const seedIdea = inputs.coreIdea?.trim() || '';
        const seedText = seedIdea ? ` | 🌱 بذرة الفكرة: "${seedIdea}"` : '';
        const userMessage = seedIdea
            ? `ولّد 3 أفكار فيديو **مبنية على** هذه البذرة: "${seedIdea}" | ${inputs.genre || 'Creative'} | ${inputs.videoStyle || 'Cinematic'} | بطل: ${primaryChar}${secondaryCharsText}. ابني على الفكرة دي وطوّرها في 3 اتجاهات مختلفة. JSON فقط.`
            : `ولّد 3 أفكار فيديو عن: ${inputs.genre || 'Creative'} | ${inputs.videoStyle || 'Cinematic'} | بطل: ${primaryChar}${secondaryCharsText}. JSON فقط.`;

        // v13.0: 1800 tokens for 3 rich ideas (title + hook + lesson), 0.82 temp for higher creative diversity
        const result = await callOpenRouter(userMessage, TEXT_MODEL, false, 1800, 0.82, ideaSystemPrompt);
        return result;
    } catch (error) {
        console.error('[ERROR] brainstorm_concept failed:', error);
        throw error;
    }
}

// --- GENRE-ADAPTIVE VIRAL HOOK TEMPLATES ---
export const getHookTemplates = (genre) => {
    const normalize = (s) => (s || '').toLowerCase();
    const g = normalize(genre);

    // MEDICAL / HEALTH / SCIENCE
    if (g.includes('medical') || g.includes('health') || g.includes('science') || g.includes('طبي')) {
        return [
            "الحاجة دي بتقتلك ببطء وإنت مش واخد بالك...",
            "لو بتعمل X كل يوم... الأطباء بيقولوا إنك في خطر",
            "٩٠٪ من الناس مش عارفين إن X بيسبب Y...",
            "جسمك بيبعتلك إشارات تحذير وإنت بتتجاهلها...",
            "العلماء اكتشفوا إن X اللي بتاكله كل يوم بيعمل Y...",
            "هل تعلم إن X الواحدة فيها ما يكفي لـ Y؟",
            "الفرق بين X و Y... ممكن ينقذ حياتك",
            "لو بتحس بـ X... جسمك بيقولك حاجة مهمة"
        ];
    }

    // COMEDY / FUNNY / SKETCH
    if (g.includes('comedy') || g.includes('funny') || g.includes('sketch') || g.includes('كوميدي')) {
        return [
            "لما X يعمل Y... (الكارثة بتبدأ)",
            "أنا vs الناس العادية لما بيحصل X...",
            "لو X كان شخص حقيقي... كان عمل إيه؟",
            "الفرق بين اللي بتقوله... واللي بتعمله فعلاً",
            "أمي لما تشوفني بعمل X...",
            "POV: إنت X وصاحبك Y... والموقف ده حصل",
            "لو X وY اتقابلوا... الحرب العالمية التالتة",
            "المصريين لما يشوفوا X... (ردة الفعل الحقيقية)"
        ];
    }

    // HORROR / THRILLER / MYSTERY
    if (g.includes('horror') || g.includes('thriller') || g.includes('mystery') || g.includes('رعب')) {
        return [
            "في 3 بالليل... لقيت X وأنا لوحدي...",
            "لو سمعت الصوت ده... اجري فوراً",
            "القصة دي حصلت فعلاً في X... ومحدش صدق",
            "الكاميرا التقطت حاجة مكنش المفروض تكون هناك...",
            "آخر رسالة بعتها قبل ما يختفي كانت...",
            "الباب اتفتح لوحده... وأنا عارف إن محدش في البيت",
            "لو شوفت X ده في بيتك... متقربش منه أبداً"
        ];
    }

    // SOCIAL MEDIA / VIRAL (universal viral hooks — all styles)
    if (g.includes('viral') || g.includes('social media') || g.includes('trend')) {
        return [
            "شوفوا اللي حصل... محدش هيصدق!",
            "POV: إنت X وفجأة Y حصل... شوف النهاية!",
            "لما X يعمل Y... الريأكشن مش طبيعي!",
            "استنوا للآخر... النهاية صادمة!",
            "day in the life of X... الناس في الشارع اتصدمت!",
            "شوفوا بيحصل إيه لما X يشوف/يسمع/يعمل Y...",
            "what X does when nobody's watching... 🤯",
            "المصريين لما يشوفوا X لأول مرة... (الكارثة!)",
            "X عمل حاجة محدش توقعها... والكاميرا صورت كل حاجة!",
            "جربت X لأول مرة... واللي حصل مكنش في الحسبان!"
        ];
    }

    // COMMERCIAL / MARKETING / AD
    if (g.includes('commercial') || g.includes('marketing') || g.includes('ad') || g.includes('إعلان')) {
        return [
            "قبل ما تشتري X... لازم تعرف الحقيقة دي",
            "ليه X غيّر حياتي في أسبوع واحد بس...",
            "المنتج ده عمل حاجة محدش كان متوقعها...",
            "كنت بستخدم X غلط طول عمري... لحد ما عرفت",
            "الفرق بين X الرخيص و X الغالي... صادم",
            "POV: لما تجرب X لأول مرة... (الصدمة)",
            "X واحد بس... غيّر كل حاجة في Y"
        ];
    }

    // DOCUMENTARY / HISTORY / EDUCATIONAL
    if (g.includes('documentary') || g.includes('history') || g.includes('تعليمي') || g.includes('وثائقي')) {
        return [
            "القصة اللي مش هتلاقيها في أي كتاب تاريخ...",
            "الحقيقة اللي حاولوا يخبوها عنك لسنين...",
            "في X سنة... حصل شيء غيّر مسار التاريخ للأبد",
            "هل تعلم إن X اللي بتشوفه كل يوم... أصله Y؟",
            "السر وراء X... اللي محدش بيتكلم عنه",
            "لو عرفت القصة دي... نظرتك لـ X هتتغير للأبد",
            "٣ حقائق عن X... الأخيرة هتصدمك"
        ];
    }

    // COOKING / FOOD / RECIPE
    if (g.includes('cooking') || g.includes('food') || g.includes('recipe') || g.includes('طبخ')) {
        return [
            "الغلطة اللي كلنا بنعملها في X... وإزاي تصلحها",
            "سر X الحقيقي اللي الشيفات مش بيقولوه...",
            "لو عملت X بالطريقة دي... هتفرق معاك ١٨٠ درجة",
            "أسهل طريقة لـ X... في ٣٠ ثانية بس",
            "جربت أعمل X بطريقة Y... والنتيجة كانت مجنونة",
            "الحاجة السرية اللي بتحطها ستّي في X...",
            "لو عندك X في التلاجة... ممكن تعمل بيها Y"
        ];
    }

    // MOTIVATIONAL / SPORTS / FITNESS
    if (g.includes('motivational') || g.includes('sports') || g.includes('fitness') || g.includes('تحفيزي')) {
        return [
            "كل الناس قالتلي مستحيل... وأنا عملت X",
            "من X لـ Y... الرحلة اللي غيّرت كل حاجة",
            "لو حاسس إنك فاشل... اسمع الكلام ده",
            "العادة الواحدة اللي لو عملتها... حياتك هتتغير",
            "ليه ٩٩٪ من الناس بيفشلوا في X... والحل بسيط",
            "أنا كنت X... دلوقتي أنا Y. إزاي؟",
            "الفرق بين اللي بينجح واللي بيفشل... حاجة واحدة بس"
        ];
    }

    // DEFAULT / CINEMATIC / DRAMA
    return [
        "القصة اللي محدش يعرفها عن X...",
        "لو X اتكلم... كان هيقول إيه؟",
        "في عالم مليان Y... X الوحيد اللي مختلف",
        "ماذا لو X قرر يعمل Y... للمرة الأخيرة؟",
        "بين X وY... في سر محدش يعرفه",
        "اللحظة اللي غيّرت كل حاجة... كانت عادية جداً",
        "POV: إنت X... وعندك ٢٤ ساعة بس"
    ];
};

// --- KEMO BRAINSTORM ENGINE v13.0 (ENRICHED VIRAL PREMISE + GENRE DNA) ---
export const generateIdeaPrompt = (currentSettings) => {
    const genre = currentSettings.genre || 'Creative';
    const style = currentSettings.videoStyle || 'Cinematic';
    const characterType = currentSettings.characters?.primary || currentSettings.characterType || 'Auto';
    const secondaryCharacters = (currentSettings.characters?.secondary || []).filter(s => s);
    const numCharacters = String(1 + secondaryCharacters.length);
    const duration = currentSettings.duration || 15;

    const voiceTone = currentSettings.voiceTone || 'Professional';
    const videoLanguage = currentSettings.videoLanguage || 'Egyptian (Masri)';
    const aspectRatio = currentSettings.aspectRatio || '16:9';
    const modifiers = currentSettings.modifiers || '';
    const prohibitions = currentSettings.prohibitions || '';
    const previousTitles = currentSettings._previousTitles || [];
    const seedIdea = (currentSettings.coreIdea || '').trim();

    // === DNA ENGINES ===
    const charDNA = getCharacterDNA(characterType);
    const styleDNA = getStyleDNA(style);
    const toneDNA = getVoiceToneDNA(voiceTone);

    // === SECONDARY CHARACTERS DNA ===
    const secondaryCharDNAs = secondaryCharacters.map(sc => ({
        type: sc,
        dna: getCharacterDNA(sc)
    }));
    const secondaryCharsSection = secondaryCharDNAs.length > 0
        ? `\n👥 الشخصيات الفرعية (إلزامي — لازم يظهروا في كل فكرة):\n${secondaryCharDNAs.map((sc, i) => `  ${i + 1}. **${sc.dna.name}**\n     ↳ شخصية: ${sc.dna.personalityTraits}\n     ↳ تفاعل: ${sc.dna.interactionStyle}`).join('\n')}\n⚠️ كل فكرة لازم تتضمن الشخصيات الفرعية بتفاعل حقيقي مع البطل — مش ديكور!`
        : '';

    // === TRANSPARENT CREATURE SUBTYPE VARIATION ===
    const isTransparentChar = characterType.toLowerCase().includes('transparent');
    const transparentSubtypeVariation = isTransparentChar && charDNA.subTypes
        ? (() => {
            // Pick 3 random subtypes for the 3 ideas
            const shuffledSubs = [...charDNA.subTypes].sort(() => Math.random() - 0.5).slice(0, 3);
            return `\n🫧 تنوع الكائنات الشفافة (إلزامي — كل فكرة لازم كائن مختلف):\n• فكرة ١ → **${shuffledSubs[0].type}**: ${shuffledSubs[0].personality}\n• فكرة ٢ → **${shuffledSubs[1].type}**: ${shuffledSubs[1].personality}\n• فكرة ٣ → **${shuffledSubs[2].type}**: ${shuffledSubs[2].personality}\n⚠️ ممنوع نفس نوع الكائن الشفاف في أكتر من فكرة!`;
        })()
        : '';
    const dialectDNA = getDialectDNA(videoLanguage);

    // === v13.0: GENRE DNA + MORAL + HOOK INJECTION ===
    const genreDNA = getGenreDNA(genre);
    const moralTemplates = getMoralTemplates(genre);
    const hookTemplates = getHookTemplates(genre);

    // Pick 2 random morals and 2 random hooks for diversity
    const shuffledMorals = [...moralTemplates].sort(() => Math.random() - 0.5).slice(0, 2);
    const shuffledHooks = [...hookTemplates].sort(() => Math.random() - 0.5).slice(0, 2);

    // === v14.0: CONFLICT TEMPLATES (7 types for maximum variety) ===
    const conflictTypes = [
        { type: 'داخلي', desc: 'البطل في صراع مع نفسه — تردد، خوف، رغبة مكبوتة', example: 'البيضة مش عارفة تقرر: تتسلق ولا تتقلي — وعمرها بيخلص' },
        { type: 'بين شخصيتين', desc: 'البطل في مواجهة مع شخصية تانية — تحدي، منافسة، سوء فهم', example: 'المانجة بتتحدا الشيف: ورّيني هتعرف تعمل مني أحسن عصير ولّا أنا اللي هكسب!' },
        { type: 'مع البيئة/القدر', desc: 'البطل في مواجهة مع قوة خارجية — طبيعة، زمن، نظام', example: 'الساعة بتجري والعجينة لسه ما خمرتش — السباق مع الوقت بدأ' },
        { type: 'صراع الهوية', desc: 'البطل مش عارف هو مين — اكتشاف ذات، أزمة هوية، تحول', example: 'الطماطماية اكتشفت إنها فاكهة مش خضار — حياتها كلها كانت كدبة!' },
        { type: 'أخلاقي/معضلة', desc: 'البطل قدام اختيار صعب — كل خيار ليه ثمن', example: 'الدكتور عنده دوا واحد بس ومريضين — يختار مين؟' },
        { type: 'كوميدي عبثي', desc: 'سباق أو مهمة غبية بس البطل متعامل معاها بجدية مطلقة', example: 'الملعقة بتتدرب عشان تشيل الشوربة بدون ما توقع ولا نقطة — بتاعها دي مسألة حياة ولا موت!' },
        { type: 'مع الماضي/الذكريات', desc: 'البطل بيواجه خطأ قديم أو ذكرى بترجعله', example: 'الثلاجة افتكرت لما كانت جديدة — دلوقتي غيرها تلاجة جديدة واقفة مكانها' },
    ];
    const shuffledConflicts = [...conflictTypes].sort(() => Math.random() - 0.5);

    // === v14.0: NARRATIVE STRUCTURES (6 types for richer storytelling) ===
    const narrativeStructures = [
        { lens: 'POV البطل (ضمير المتكلم)', instruction: 'البطل هو اللي بيحكي. استخدم "أنا"، "بتاعي"، "عملت"', example: 'أنا البصلة... كل ما حد يقربلي بيعيط. بس محدش سألني أنا كمان بعيط!' },
        { lens: 'راوي خارجي (مشاهد)', instruction: 'حد بيحكي عن البطل من برّا. استخدم "شاف"، "لقى"، اسم البطل', example: 'الملعقة لقت نفسها لوحدها في الدُرج — وبدأت تحكي لصحابها عن أيام المطبخ القديمة' },
        { lens: 'مشهد مباشر (بدون تعليق)', instruction: 'وصف مشهد بيحصل قدامك — مفيش راوي. فعل + مكان + حدث', example: 'المانجة بتتحدا الشيف: ورّيني هتعرف تعمل مني أحسن عصير ولّا أنا اللي هكسب!' },
        { lens: 'فلاش باك (يبدأ من النهاية)', instruction: 'ابدأ من لحظة الذروة — وبعدين ارجع للبداية. "الحكاية دي بدأت قبل كده ب X..."', example: 'الكوباية متكسرة على الأرض... بس الحكاية بدأت من ساعة — لما كانت لسه كاملة ومليانة شاي' },
        { lens: 'مراسل ميداني (بث لايف)', instruction: 'كأن حد بيصوّر الموقف لايف. "احنا دلوقتي هنا في..." "زي ما بتشوفوا..."', example: 'احنا دلوقتي جوا الثلاجة — زي ما بتشوفوا، الخضار لسه نايم والإندار هيرن كمان دقيقة!' },
        { lens: 'مناظرة/ديالوج', instruction: 'شخصيتين بيتناقشوا أو بيتخانقوا. كل واحد ليه وجهة نظر', example: 'الميكروويف: "أنا أسرع!" الفرن: "بس أنا أحسن!" — مناظرة العصر بريحة الأكل المشوي' },
    ];
    const shuffledNarratives = [...narrativeStructures].sort(() => Math.random() - 0.5);

    // === v14.0: TWIST ENGINE (mandatory surprise in every idea) ===
    const twistTypes = [
        { type: 'Plot Twist', desc: 'الحقيقة غير المتوقعة — اللي فاكرينه طلع غلط', example: 'البيضة اللي خايفة تنكسر — اكتشفت إنها مكنتش بيضة أصلاً!' },
        { type: 'Perspective Twist', desc: 'نكتشف إن الراوي مش اللي فاكرينه', example: 'اللي بيحكي القصة مش البطل — ده الضحية اللي محدش سمعها!' },
        { type: 'Emotional Twist', desc: 'الموقف الكوميدي يبقى مؤثر فجأة — الضحك يتحول لدمعة', example: 'الكوباية اللي بتهزر على صحابها — اكتشفنا إنها بتعمل كده عشان خايفة ينسوها' },
        { type: 'Scale Twist', desc: 'الحاجة الصغيرة تبقى ضخمة أو العكس', example: 'النملة اللي فاكرة نفسها بتشيل جبل — اكتشفت إنه حبة رمل' },
    ];
    const shuffledTwists = [...twistTypes].sort(() => Math.random() - 0.5);

    // === v15.0: TREND HOOKS — viral patterns that drive engagement ===
    const trendHooks = [
        { type: 'POV Switch', template: 'لو [X] يقدر يتكلم — هيقول إيه؟', example: 'لو الريموت يقدر يتكلم — هيقول إيه عن صاحبه؟' },
        { type: 'What If', template: 'تخيل لو [X] عمل [Y] — إيه اللي هيحصل؟', example: 'تخيل لو المعدة قررت تعمل إضراب عن الشغل' },
        { type: 'Behind Scenes', template: 'اللي بيحصل وراء [X] — وانت مش واخد بالك', example: 'اللي بيحصل جوا الثلاجة لما بتقفل الباب' },
        { type: 'Battle', template: '[X] ضد [Y] — مين هيكسب؟', example: 'المخ ضد المعدة — مين بيتحكم في قرارات الأكل؟' },
        { type: 'First Time', template: '[X] بيجرب [Y] لأول مرة — شوفوا رد فعله', example: 'القطة بتشوف ثلج لأول مرة — رد فعلها هيضحكك' },
        { type: 'Timer', template: 'آخر [X] ثواني قبل [Y] — والعد التنازلي بدأ', example: 'آخر 60 ثانية قبل ما البيضة تنفجر في الميكروويف' },
    ];
    const shuffledTrendHooks = [...trendHooks].sort(() => Math.random() - 0.5).slice(0, 3);

    // Non-human enforcement
    const nonHumanTypes = ['object', 'food', 'animal', 'robot', 'creature', 'monster', 'alien', 'body', 'toy', 'mythical'];
    const isNonHuman = nonHumanTypes.some(t => characterType.toLowerCase().includes(t));
    const isAutoChar = !characterType || characterType.toLowerCase() === 'auto';

    // === DIVERSITY SYSTEM v1.0 — Auto-vary character categories across 3 ideas ===
    const diversityCategories = {
        human: { label: 'إنسان', examples: ['طفل صغير', 'شاب جامعي', 'جدة حكيمة', 'سائق تاكسي', 'دكتور', 'بائع متجول', 'أم شابة', 'طالب ثانوي', 'عامل نظافة'] },
        trendAnimal: { label: 'حيوان تريند', examples: ['قط شارع', 'كلب وفي', 'حمامة', 'عصفور كناري', 'حرباية', 'نملة', 'سمكة زينة', 'فراشة', 'سلحفاة', 'ببغاء', 'ديك', 'أرنب'] },
        random: [
            { label: 'جماد', examples: ['كوباية شاي', 'ريموت تلفزيون', 'مفتاح قديم', 'ساعة حائط', 'تليفون قديم', 'شنطة مدرسة'] },
            { label: 'خضار/فاكهة', examples: ['طماطماية', 'بصلة', 'مانجة', 'خيارة', 'بطيخة', 'ليمونة', 'موزة'] },
            { label: 'عضو جسم', examples: ['المخ', 'القلب', 'العين', 'المعدة', 'الإصبع', 'الأذن'] },
            { label: 'روبوت/آلة', examples: ['روبوت منزلي', 'ميكروويف ذكي', 'غسالة قديمة', 'ثلاجة'] },
        ]
    };

    let charRule = '';
    let diversityBlock = '';
    if (isAutoChar) {
        // Pick random examples for each category
        const pickRand = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const humanEx = pickRand(diversityCategories.human.examples);
        const animalEx = pickRand(diversityCategories.trendAnimal.examples);
        const randomCat = pickRand(diversityCategories.random);
        const randomEx = pickRand(randomCat.examples);
        const idea3Count = pickRand(['1', '2', '2-3']);
        diversityBlock = `
═══════════════════════════════════════
🎭 تنوع الأبطال (إلزامي — كل فكرة بطلها من فئة مختلفة)
═══════════════════════════════════════
فكرة ١ → بطل **إنسان**: (مثال: ${humanEx}) — شخصية رئيسية واحدة أو أكتر
فكرة ٢ → بطل **حيوان تريند**: (مثال: ${animalEx}) — أنواع بتحقق trend (قط/كلب/حمامة/زواحف/حشرات/أسماك)
فكرة ٣ → بطل **${randomCat.label}**: (مثال: ${randomEx}) — عدد الشخصيات: ${idea3Count}
⚠️ ممنوع نفس الفئة في أكتر من فكرة!
⚠️ فكرة ٢ لازم حيوان حقيقي (قط، كلب، حمامة، عصفور، حرباية، نملة، سمكة...) — مش كائن خيالي!
⚠️ فكرة ٣ ممكن تكون فيها أكتر من شخصية — نوّع في العدد!`;
    } else {
        charRule = isNonHuman
            ? `⚠️ البطل = ${characterType} (مش إنسان). ممنوع بطل بشري.`
            : '';
    }

    // Transparent style × character integration for brainstorm (v3.0 — Trend-Aware)
    const isTransparentStyle = style.toLowerCase().includes('transparent');
    const isViralGenre = genre.toLowerCase().includes('viral') || genre.toLowerCase().includes('social') || genre.toLowerCase().includes('trend');
    const transparentIdeaRule = isTransparentStyle
        ? (() => {
            const tRules = getTransparentCreatureRules(genre, characterType, isNonHuman);

            // VIRAL + TRANSPARENT = The creature IS the content
            const viralCreatureBoost = isViralGenre ? `
🚨🚨🚨 الكائن الشفاف هو البطل والمحتوى نفسه! (إلزامي — أهم قاعدة) 🚨🚨🚨

⚠️ تجاوز لقاعدة البطل: الكائن الشفاف هو بطل الفكرة/العنوان. الإنسان = شخصية ثانوية.

📝 صيغة العنوان (إلزامي — العنوان لازم يبدأ بالكائن الشفاف):
✅ "القطة الشفافة لما شافت نفسها في المراية — مخها اتجنن وقلبها وقف!"
✅ "الكلب الشفاف بياكل لأول مرة — شايف الأكل بينزل في معدته لايف!"
✅ "شوفوا العصفور الشفاف لما سمع صوت عصفور تاني — قلبه بقى أحمر فجأة!"
❌ "أحمد بيعمل X — والكائن الشفاف بيتفاعل" ← ممنوع! العكس هو الصح!

🎬 طريقة ١: "كائن غريب ظهر" (الغموض + الصدمة)
• حد لقى كائن شفاف غريب — الفيديو بيصوره وهو بيتحرك وأعضاؤه باينة

🎬 طريقة ٢: "pet content شفاف" (يومي)
• الكائن الشفاف بياكل/بيلعب/بينام/بيشوف حاجة — وإحنا شايفين اللي جواه

❌❌❌ ممنوع نهائياً:
❌ العنوان يبدأ باسم إنسان (أحمد/أمينة/كريم) + "والكائن بيتفاعل"
❌ الإنسان هو البطل والكائن إضافة
❌ فكرة عادية عن إنسان + "والكائن الشفاف موجود"` : '';

            return isNonHuman
                ? `🫧 قاعدة استايل "كائن شفاف حي" v3.0 (إلزامي في الأفكار):
📌 ليه البطل شفاف في "${genre}"؟ ${tRules.genreLogic}
📌 شكل البطل: ${tRules.creatureRole}
📌 تفاعل الأعضاء مع الحدث (إلزامي — كل فكرة لازم تستغل ده):
${tRules.organRules}
⚠️ كل فكرة لازم تحتوي على لحظة درامية الأعضاء بتتفاعل فيها (مثلاً: قلبه بينبض أسرع لما يخاف، رئته بتتجمد لما يتفاجئ)
${viralCreatureBoost}`
                : `🫧 قاعدة استايل "كائن شفاف حي" v3.0 (إلزامي في الأفكار):
📌 ليه فيه كائن شفاف في "${genre}"؟ ${tRules.genreLogic}
📌 دور الكائن: ${tRules.creatureRole}
📌 تفاعل الأعضاء مع الحدث (إلزامي — الكائن مش ديكور):
${tRules.organRules}
⚠️ كل فكرة لازم يكون فيها لحظة أعضاء الكائن الشفاف بتتفاعل فيها مع الحدث (مثلاً: قلبه بيضيء لما البطل يفرح)
${viralCreatureBoost}`;
        })()
        : '';


    // Anti-repetition (enhanced v13.0)
    const antiRepeat = previousTitles.length > 0
        ? `🚫 ممنوع تشابه مع أي من دي (لا في الصياغة ولا في الفكرة ولا في النمط):
${previousTitles.slice(-15).map(t => `  ❌ "${t}"`).join('\n')}`
        : '';

    // --- GENRE-SPECIFIC GOLDEN EXAMPLES ---
    const genreExamples = {
        'Tutorial / How-To': { goal: 'يعلّم حاجة عملية أو حيلة ذكية', example: 'الشاحن بتاعك بيموّت بطاريتك من وراك — والبطارية ساكتة عشان مش عارفة تشتكي' },
        'Medical / Health': { goal: 'يبسّط معلومة صحية بطريقة مشوقة', example: 'كرات الدم الحمرا بتجري في الشريان — وبتزعق لكرات الدم البيضا الكسلانة عشان ميكروب قرب' },
        'Science Explainer': { goal: 'يبسّط ظاهرة علمية بصرياً', example: 'المخ بيحاول يفهم ليه رجلك بتخبط لوحدها لما تسمع أغنية بتحبها' },
        'Documentary': { goal: 'يكشف حقيقة تاريخية أو مخفية مدهشة', example: 'الفراعنة كانوا بيستخدموا العفن في علاج الجروح — قبل البنسلين بـ 3000 سنة' },
        'Psychology / Self-Help': { goal: 'يفهّم المشاهد حاجة عن نفسه أو سلوكه', example: 'مخك بيخدعك كل صبح — بيقنعك إن 5 دقايق كمان على السرير مش هتفرق، وهي بتفرق كل حاجة' },
        'Comedy (Sketch/Sarcasm)': { goal: 'يضحّك بموقف ذكي أو ساخر', example: 'البيضة قبل ما تتقلي شافت صحابها اتسلقوا — وقررت تهرب من الكرتونة' },
        'Drama / Emotional': { goal: 'يلمس القلب ويحسسك بمشاعر', example: 'الكوباية المكسورة على الرف لسه فاكرة آخر مرة حد شرب منها' },
        'Horror (Psychological)': { goal: 'يخلي المشاهد حاسس بقشعريرة', example: 'الباب بتاع أوضتك اتفتح لوحده الساعة 3 الصبح — بس مفيش هوا' },
        'Sci-Fi / Futuristic': { goal: 'يتخيل مستقبل مثير أو تكنولوجيا غريبة', example: 'سنة 2060 — الروبوت رفض يشتغل وقال لصاحبه: أنا تعبان عايز أجازة' },
        'Fantasy / Epic': { goal: 'يبني عالم خيالي فيه سحر ومغامرات', example: 'التنين الصغير اكتشف إن نار أنفاسه مش بتحرق — بتطبخ أحلى أكل في المملكة' },
        'Action / Thriller': { goal: 'يخلق توتر وإثارة وسرعة', example: 'القطر بيجري 200 كم/ساعة — والسائق لسه ما اكتشفش إن الكوبري قدامه مش موجود' },
        'Romance / Love Story': { goal: 'يحكي قصة حب مؤثرة', example: 'القلب بعت رسالة للمخ يقوله: أنا وقعت — والمخ رد: أنا مش هقدر أنقذك المرة دي' },
        'Mystery / True Crime': { goal: 'يبني لغز مشوق أو جريمة غامضة', example: 'كل يوم الساعة 7 الصبح — الكوباية بتتحرك من مكانها سنتيمتر واحد ومحدش بيلمسها' },
        'Viral / Social Media': { goal: 'يعمل تريند — يوقف السكرول ويخلي 10 مليون شخص يعملوا شير', example: 'جربت أوصل أكل ديليفري لواحد على القمر — شوفوا رد فعله لما الأكل وصل م٫معلقش!' },
        'Story Time': { goal: 'يحكي قصة شخصية تشد المشاهد', example: 'أول يوم في الشغل الجديد نسيت اسم المدير — وناديته بـ "يا باشا" طول اليوم' },
        'Commercial / Marketing': { goal: 'يروّج منتج بإبداع وبدون ملل', example: 'الموبايل القديم بيكتب وصيته قبل ما صاحبه يشتري الجديد — وبيسيب البطارية للشاحن كهدية' },
        'Cooking / Recipe': { goal: 'يعمل وصفة ممتعة أو يحكي عن أكل', example: 'البصلة بتعيط عليك مش إنت اللي بتعيطها — المطبخ فيه دراما أكتر من المسلسلات' },
        'Motivational / Inspirational': { goal: 'يحفّز ويلهم ويغير طريقة تفكير', example: 'الـ 5 دقايق اللي بتضيعها كل صبح على السرير — هي الفرق بين الناجح والعادي' },
        'Kids / Family': { goal: 'محتوى عائلي ممتع وآمن وتعليمي', example: 'الألوان الستة اتخانقوا مين فيهم اللي هيلوّن قوس قزح — والأبيض قاعد يتفرج' },
        'Sports / Fitness': { goal: 'يحفّز للرياضة والتحدي', example: 'آخر 10 ثواني في التمرين — العضلات بتصرخ والمخ بيقولك: يلا كمّل واحدة كمان' },
        'Islamic / Religious': { goal: 'يحكي قصة دينية أو حكمة بأسلوب مؤثر', example: 'النملة اللي سيدنا سليمان سمعها — كانت بتقول لصحابها استخبوا عشان جيش كبير جاي' },
        'Finance / Business': { goal: 'يبسّط فكرة مالية أو يحكي عن نجاح', example: 'أغنى راجل في العالم بدأ من جراج — والجراج لسه موجود بس صاحبه مش محتاجه' },
        'News / Analysis': { goal: 'يشرح خبر أو يحلل حدث بطريقة ذكية', example: 'الدولار طلع — بس مش عشان السبب اللي الناس فاكراه. القصة أعمق بكتير' },
    };

    const g = genre.toLowerCase();
    const currentGenreExample = Object.entries(genreExamples).find(([key]) => g.includes(key.toLowerCase().split(' ')[0]));
    const genreGoal = currentGenreExample ? currentGenreExample[1].goal : 'يعمل محتوى قوي';
    const genreGoldenEx = currentGenreExample ? currentGenreExample[1].example : '';

    const otherExamples = Object.entries(genreExamples)
        .filter(([key]) => !g.includes(key.toLowerCase().split(' ')[0]))
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

    // === BUILD THE v13.0 MEGA-PROMPT ===
    return `أنت **كاتب أفكار فيديوهات فيروسية محترف — مستوى مخرج هوليوودي**. شغلتك: تطلع 3 أفكار خارقة — كل فكرة فيها عنوان + هوك + عبرة.

🚨🚨🚨 المدخلات الإلزامية (كسر أي واحدة = الناتج كله مرفوض) 🚨🚨🚨
${seedIdea ? `🌱🌱🌱 **بذرة الفكرة (إلزامي — المستخدم كتب جزء من فكرة وعايزك تبني عليها)**:
"${seedIdea}"
❗ كل فكرة من الـ 3 لازم تكون **مبنية على البذرة دي** — مش فكرة جديدة من الصفر
❗ خد الفكرة دي وطوّرها في 3 اتجاهات مختلفة (كل فكرة = زاوية مختلفة لنفس البذرة)
❗ ممنوع تتجاهل البذرة أو تعمل فكرة مالهاش علاقة بيها!
` : ''}• النوع: **${genre}** ← كل فكرة لازم تكون من النوع ده بالظبط
• الأسلوب البصري: **${styleDNA.name}**
  ↳ المزاج: ${styleDNA.mood}
  ↳ بيئات مقترحة: ${styleDNA.environments.join(' | ')}
${isAutoChar ? '' : `• نوع البطل: **${charDNA.name}**
  ↳ شخصية البطل: ${charDNA.personalityTraits}
  ↳ أسلوب حواره: ${charDNA.dialogueStyle}
  ↳ طريقة تفاعله: ${charDNA.interactionStyle}`}
• عدد الشخصيات: **${numCharacters}**
${secondaryCharsSection}
${transparentSubtypeVariation}
• النبرة: **${toneDNA.name}**
  ↓ الإيقاع: ${toneDNA.pacing}
  ↓ المفردات: ${toneDNA.vocabulary}
• 🗣️ لغة الحوار (إلزامي — كسرها = الناتج مرفوض): **${dialectDNA.name}**
  ↓ التحيات: ${dialectDNA.greetings}
  ↓ كلمات مميزة (استخدمها في العنوان والهوك): ${dialectDNA.slangWords.slice(0, 8).join(' | ')}
  ↓ مثال عنوان صح باللهجة: "${(dialectDNA.exampleDialogue || [''])[0].substring(0, 60)}..."
  ↓ ممنوع نهائياً: ${dialectDNA.forbidden || 'فصحى أو لهجات تانية'}
${modifiers ? `• ملاحظات خاصة: ${modifiers}` : ''}
${prohibitions ? `🚫🚫🚫 محظورات (ممنوع نهائياً):\n${prohibitions}` : ''}
${charRule}
${diversityBlock}
${transparentIdeaRule}

═══════════════════════════════════════
🚀 Trend Hooks (كل فكرة لازم تستخدم نمط viral مختلف)
═══════════════════════════════════════
فكرة ١ → نمط **${shuffledTrendHooks[0].type}**: ${shuffledTrendHooks[0].template}
   مثال: "${shuffledTrendHooks[0].example}"
فكرة ٢ → نمط **${shuffledTrendHooks[1].type}**: ${shuffledTrendHooks[1].template}
   مثال: "${shuffledTrendHooks[1].example}"
فكرة ٣ → نمط **${shuffledTrendHooks[2].type}**: ${shuffledTrendHooks[2].template}
   مثال: "${shuffledTrendHooks[2].example}"
⚠️ كل فكرة لازم trend hook مختلف — ممنوع تكرار!

═══════════════════════════════════════
🧬 DNA النوع "${genre}" (لازم تلتزم بيه)
═══════════════════════════════════════
🎯 المهمة: ${genreDNA.mission}
📜 القوانين: ${(genreDNA.laws || []).slice(0, 3).join(' | ')}
⚠️ المحاذير: ${(genreDNA.pitfalls || []).slice(0, 3).join(' | ')}
✨ البصمة: ${genreDNA.signature || 'إبداع فريد'}

═══════════════════════════════════════
🎣 أمثلة Hooks (استلهم منها — متنسخش):
═══════════════════════════════════════
${shuffledHooks.map(h => `• "${h}"`).join('\n')}

═══════════════════════════════════════
💎 أمثلة عِبر/قيم (كل فكرة لازم يكون وراها قيمة):
═══════════════════════════════════════
${shuffledMorals.map(m => `• "${m}"`).join('\n')}

═══════════════════════════════════════
⚔️ أنماط الصراع (كل فكرة لازم تستخدم نمط مختلف):
═══════════════════════════════════════
فكرة ١ → **${shuffledConflicts[0].type}**: ${shuffledConflicts[0].desc}
   مثال: "${shuffledConflicts[0].example}"
فكرة ٢ → **${shuffledConflicts[1].type}**: ${shuffledConflicts[1].desc}
   مثال: "${shuffledConflicts[1].example}"
فكرة ٣ → **${shuffledConflicts[2].type}**: ${shuffledConflicts[2].desc}
   مثال: "${shuffledConflicts[2].example}"

═══════════════════════════════════════
📐 الهيكل السردي (كل فكرة لازم تستخدم هيكل مختلف):
═══════════════════════════════════════
فكرة ١ → **${shuffledNarratives[0].lens}**: ${shuffledNarratives[0].instruction}
   مثال: "${shuffledNarratives[0].example}"
فكرة ٢ → **${shuffledNarratives[1].lens}**: ${shuffledNarratives[1].instruction}
   مثال: "${shuffledNarratives[1].example}"
فكرة ٣ → **${shuffledNarratives[2].lens}**: ${shuffledNarratives[2].instruction}
   مثال: "${shuffledNarratives[2].example}"

═══════════════════════════════════════
🎭 المفاجأة/Twist (إلزامي — كل فكرة لازم فيها twist):
═══════════════════════════════════════
فكرة ١ → **${shuffledTwists[0].type}**: ${shuffledTwists[0].desc}
   مثال: "${shuffledTwists[0].example}"
فكرة ٢ → **${shuffledTwists[1].type}**: ${shuffledTwists[1].desc}
   مثال: "${shuffledTwists[1].example}"
فكرة ٣ → **${shuffledTwists[2].type}**: ${shuffledTwists[2].desc}
   مثال: "${shuffledTwists[2].example}"
⚠️ الفكرة بدون twist = فكرة فلات = مرفوضة!

${antiRepeat}

🚫🚫🚫 أمثلة مرفوضة (لو كتبت حاجة شبه دي = فشل) 🚫🚫🚫
❌ "يا ترى إيه اللي بيحصل لما..." ← ممنوع "يا ترى" نهائياً
❌ "طماطماية بتحاول توريك أسهل طريقة..." ← وصف حرفي ممل
❌ "سر خطير وراء..." ← clickbait رخيص
❌ "ما هي فوائد الطماطم..." ← سؤال ويكيبيديا
${isViralGenre ? `❌ "القطة بتلعب في خيط وأحمد عايز ينام" ← فكرة pet عادية بدون WOW
❌ "أحمد بيعمل X — والكائن الشفاف بيتفاعل" ← الإنسان بطل والكائن إضافة = مرفوض!
❌ "أمينة عملت محشي — والقطة قلبها بيغلي" ← الفكرة عن الإنسان مش الكائن!
❌ "كريم بيتخانق مع الناموس — والعصفور بيتنفس بغضب" ← الكائن مجرد رد فعل = مرفوض!
✅ المطلوب: **العنوان يبدأ بالكائن الشفاف** + هو البطل + الإنسان ثانوي` : ''}

═══════════════════════════════════════
🚫 Anti-Boring Filter (إلزامي)
═══════════════════════════════════════
كل فكرة لازم تعدي الاختبار ده:
✅ هل الفكرة فيها **مكان + حدث محدد**؟ (مش بس مفهوم عام)
   ❌ ممل: "المخ بيفكر" → ✅ قوي: "المخ لما لقى نفسه بيفتكر password قديم — فتح باب الذكريات غصب عنه"
✅ هل العنوان بيخليك **تتخيل مشهد**؟ (لازم ترسم صورة في دماغك)
   ❌ مجرد: "فوائد النوم" → ✅ صورة: "المخ بيقفل كل الأبواب واحد واحد — والذكريات بتطلع من تحت الباب"
✅ هل الفكرة فيها **عنصر مفاجئة**؟ (حاجة مش متوقعة)
   ❌ متوقع: "القطة بتلعب" → ✅ مفاجأة: "القطة اكتشفت إن اللي بتلعب بيه مش خيط — ده ذيلهاهي!"

✅✅✅ المستوى المطلوب ✅✅✅
🎯 هدف النوع "${genre}": **${genreGoal}**
${genreGoldenEx ? `⭐ [${genre}]: "${genreGoldenEx}"` : ''}
${otherExamples.map(([key, val]) => `• [${key}]: "${val.example}"`).join('\n')}

📏 القواعد الذهبية (كسر أي واحدة = الناتج مرفوض):
1. كل فكرة = **عنوان جملة واحدة** (8-18 كلمة بـ**${dialectDNA.name}** حصراً)
${isAutoChar ? `2. 🎭 **تنوع الأبطال**: كل فكرة بطلها من فئة مختلفة (راجع قسم "تنوع الأبطال" فوق)` : `2. البطل لازم يكون **${charDNA.name}** — لو طلعت بطل من نوع تاني = مرفوض`}
${isTransparentStyle && isViralGenre ? `3a. 🫧🔥 **تجاوز قاعدة البطل**: الكائن الشفاف هو بطل الفكرة. الإنسان ثانوي. **العنوان يبدأ بالكائن الشفاف مش بالإنسان**!
3b. 🫧 **قاعدة الشفافية**: ${isNonHuman ? 'البطل كائن شفاف حي — كل فكرة لازم تستغل شفافية جسمه وأعضاؤه المرئية' : 'لازم يكون في كل فكرة كائن شفاف حي بجانب البطل'}` : isTransparentStyle ? `3a. 🫧 **قاعدة الشفافية**: ${isNonHuman ? 'البطل كائن شفاف حي — كل فكرة لازم تستغل شفافية جسمه وأعضاؤه المرئية' : 'لازم يكون في كل فكرة كائن شفاف حي بجانب البطل'}
${isViralGenre ? `3b. 🫧🔥 **الكائن الشفاف = التريند**: رد فعل أعضاء الكائن الشفاف هو الـ viral moment! مش بس "موجود" — لازم أعضاؤه تكون الـ punchline والـ scroll-stopper` : ''}` : ''}
3. الفكرة لازم **ترسم مشهد في دماغك** — مش بس سؤال مجرد
4. كل فكرة بصيغة **مختلفة تماماً** عن التانية (صراع مختلف + هيكل سردي مختلف)
5. 🔴🔴🔴 **ممنوع نهائياً** — لو استخدمت أي واحدة = كل الناتج مرفوض:
   "يا ترى" | "هل تعلم" | "هل" في بداية الجملة | "سر خطير" | "لن تصدق" | "ما لا تعرفه"
   → بدلاً منها: **ابدأ باسم البطل أو بفعل مباشر**
6. 🗣️ **قاعدة اللهجة (أساسية)**: كل كلمة لازم تكون بـ**${dialectDNA.name}** — العنوان + الهوك + العبرة كلهم بنفس اللهجة
   ↳ استخدم الكلمات دي: ${dialectDNA.slangWords.slice(0, 5).join(' | ')}
   ↳ لازم تحس إن **حد بيتكلم ${dialectDNA.name}** بيقولها — مش فصحى ومش لهجة تانية
7. 🔒 **ممنوع خلط أنواع**: لو النوع "${genre}" → الفكرة لازم تكون ${genre} بحت
8. 🔒 **ممنوع كلام عام سطحي**: الفكرة لازم تكون **محددة ومخصصة**
9. 🔒 **ممنوع هلوسة**: كل معلومة لازم تكون **حقيقية**
10. 🔒 **لازم إبداع حقيقي**: الفكرة لازم فيها **زاوية جديدة أو twist غير متوقع**
11. كل فكرة لازم فيها **viral_hook** (أول 3 ثواني من الفيديو — الجملة اللي تخلي المشاهد يكمل)
12. كل فكرة لازم فيها **lesson** (القيمة أو العبرة وراها — جملة واحدة)
${isNonHuman ? `13. 🎙️ **قاعدة الصوت**: البطل ${charDNA.name} (مش إنسان) → الفكرة لازم تكون من **وجهة نظره هو**` : ''}

═══ أخرج JSON فقط — بدون أي كلام قبله أو بعده ═══
{
  "ideas": [
    {
      "title": "عنوان الفكرة ١ (جملة واحدة 8-18 كلمة)",
      "viral_hook": "هوك الـ 3 ثواني الأولى (جملة تشد الانتباه)",
      "lesson": "القيمة/العبرة (جملة واحدة)"
    },
    {
      "title": "عنوان الفكرة ٢ (صيغة مختلفة تماماً)",
      "viral_hook": "هوك مختلف عن الأول",
      "lesson": "قيمة/عبرة مختلفة"
    },
    {
      "title": "عنوان الفكرة ٣ (صيغة ثالثة مختلفة)",
      "viral_hook": "هوك ثالث مختلف",
      "lesson": "قيمة/عبرة ثالثة"
    }
  ]
}

⚡ قبل ما تخرج الناتج — راجع:
${isAutoChar ? '- 🎭 هل فكرة ١ عن إنسان؟ فكرة ٢ عن حيوان تريند؟ فكرة ٣ عن فئة تالتة مختلفة؟ لو لأ → صلّح فوراً' : `- هل كل فكرة عن **${charDNA.name}**؟ لو لأ → غيّرها`}
- 🗣️ **اختبار اللهجة**: اقرا كل عنوان بصوت عالي — هل بيبان لهجة **${dialectDNA.name}**؟
  → لو فيه فصحى أو لهجة تانية → **أعد الصياغة بالكامل**
  → هل فيه كلمات ممنوعة: ${dialectDNA.forbidden || 'فصحى/لهجات تانية'}؟ لو أه → غيّرها
- 🔴 هل فيه "يا ترى" أو "هل تعلم" أو "هل" في بداية أي فكرة؟ لو أه → **امسح وابدأ من الأول**
- هل الـ 3 أفكار بنفس الصيغة؟ لو أه → غيّر (صراع مختلف + هيكل سردي مختلف + trend hook مختلف)
- 🚫 **Anti-Boring Test**: كل فكرة فيها مكان + حدث + مفاجأة؟ لو الفكرة "عامة" وممكن تتلخص في 4 كلمات → أعد صياغتها
- هل كل فكرة فيها viral_hook مميز وقصير؟
- هل كل فكرة فيها lesson/عبرة حقيقية؟
- 🎭 هل كل فكرة فيها **twist/مفاجأة** واضحة؟ لو الفكرة predictable → أضف twist
${isNonHuman ? '- 🔴 هل كل فكرة من وجهة نظر البطل؟ لو فيه وجهة نظر خارجية → أعد صياغتها' : ''}
${isTransparentStyle ? (isNonHuman ? '- 🫧 هل كل فكرة بتتكلم عن البطل ككائن شفاف بأعضاء مرئية؟ لو لأ → أضف عنصر الشفافية' : '- 🫧 هل كل فكرة فيها كائن شفاف حي بجانب البطل؟ لو لأ → أضف كائن شفاف') : ''}
${isTransparentStyle && isViralGenre ? '- 🫧🔥 هل رد فعل أعضاء الكائن الشفاف هو الـ viral moment؟' : ''}
${isViralGenre ? '- 🔥 هل كل فكرة فيها WOW بصري + twist + تصاعد؟' : ''}

🔥 ولّد دلوقتي. JSON فقط. بدون أي شرح.
`;
};