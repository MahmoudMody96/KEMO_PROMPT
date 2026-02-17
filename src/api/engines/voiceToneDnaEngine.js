// VOICE TONE DNA ENGINE v1.0
// Extracted from promptApi.js

// ═══════════════════════════════════════════════════════════════════
// 🎙️ VOICE TONE DNA ENGINE v1.0 — Rich Vocal Personality Profiles
// Each voice tone gets a unique DNA: pacing, vocabulary, sentence
// structure, audio direction, example lines, and forbidden patterns.
// Used by generateSystemPrompt() to enforce consistent vocal identity.
// ═══════════════════════════════════════════════════════════════════
export const getVoiceToneDNA = (tone) => {
    const normalize = (s) => (s || '').toLowerCase().replace(/[\s_\-\/]+/g, '');
    const t = normalize(tone);

    // 1. Professional / Authoritative
    if (t.includes('professional') || t.includes('authoritative') || t.includes('expert')) {
        return {
            name: "احترافي وموثوق — Professional / Authoritative",
            desc: "صوت الخبير الواثق — يعطي معلومات بسلطة ومصداقية. The confident expert — delivers information with authority and credibility.",
            pacing: "Medium-steady pace. Clear enunciation. Strategic pauses before key points. No rushing. Deliberate rhythm.",
            vocabulary: "Technical terms with brief explanations. Data-driven ('بنسبة 73%'). Precise adjectives. Industry jargon simplified.",
            sentenceStructure: "Short declarative sentences. Statement → Evidence → Conclusion. No fillers ('يعني', 'بقى'). Active voice always.",
            emotionalRange: "Controlled confidence. Slight surprise at data reveals. Never extreme emotions. Gravity without heaviness.",
            punctuationStyle: "Periods and dashes. Minimal exclamation marks. No emojis in dialogue. Numbered lists for steps.",
            audioDirection: "Steady baritone/alto. Minimal pitch variation. Clear articulation. Professional studio quality. No background music during speech.",
            exampleLines: [
                "الدراسات أثبتت إن الخلايا دي بتتجدد كل 7 أيام — مش كل 7 سنين زي ما الناس فاكرة.",
                "النقطة الأساسية هنا: المعدة مش بس بتهضم — هي مصنع كيميائي كامل.",
                "خلّيني أوضحلك الفرق. الأولى بتشتغل بالكهرباء. التانية بالإشارات الكيميائية. الفرق ده بيغير كل حاجة."
            ],
            forbidden: "Slang, childish language, excessive excitement, filler words ('أممم'), informal greetings ('إيه الأخبار')",
            compatibleGenres: ["Documentary", "Medical/Health", "Science Explainer", "Tutorial", "Finance/Business", "News/Analysis"],
            inspiredBy: "TED Talks, BBC documentaries, Huberman Lab, Kurzgesagt narrator, Atlas of the Heart"
        };
    }

    // 2. Deep / Cinematic
    if (t.includes('deep') || (t.includes('cinematic') && !t.includes('dramatic'))) {
        return {
            name: "عميق سينمائي — Deep / Cinematic",
            desc: "صوت الأفلام الوثائقية العظيمة — يأخذك في رحلة. The great documentary voice — takes you on a journey.",
            pacing: "Slow and deliberate. Long pauses between phrases. Words feel heavy with meaning. Breathing is audible and intentional.",
            vocabulary: "Rich, evocative language. Metaphors. Poetic without being flowery. Words chosen for their SOUND as much as meaning.",
            sentenceStructure: "Long flowing sentences punctuated by short punches. 'في عتمة الكون اللامتناهية... نجمة واحدة. واحدة بس.' Build-ups → reveals.",
            emotionalRange: "Awe, wonder, gravitas. Controlled melancholy. Deep respect. Never loud — power through quietness.",
            punctuationStyle: "Ellipses (...) for dramatic pauses. Em dashes for interruptions. Minimal punctuation — let the voice do the work.",
            audioDirection: "Deep bass resonance. Slow reverb. Cinematic orchestra undertone. Voice as instrument. Morgan Freeman / James Earl Jones quality.",
            exampleLines: [
                "في كل ثانية... جوه جسمك... ملايين الخلايا بتموت. وملايين تانية... بتتولد. وإنت مش حاسس بحاجة.",
                "الأرض بتدور. والشمس بتحرق. والكون كله... مش فارق معاه. بس إنت — إنت فارق.",
                "مفيش حد قالهم إن الرحلة دي مالهاش رجعة. راحوا. ومرجعوش. والقصة... لسه ما انتهتش."
            ],
            forbidden: "Comedy, puns, light humor, fast pacing, casual chat, upbeat energy, emojis",
            compatibleGenres: ["Documentary", "Drama/Emotional", "Sci-Fi/Futuristic", "Fantasy/Epic", "Psychology"],
            inspiredBy: "Morgan Freeman (March of the Penguins), David Attenborough, Werner Herzog, Cosmos narration, Planet Earth"
        };
    }

    // 3. Cheerful / Upbeat
    if (t.includes('cheerful') || t.includes('upbeat') || t.includes('optimistic')) {
        return {
            name: "مرح ومتفائل — Cheerful / Upbeat",
            desc: "طاقة إيجابية معدية — يخليك تبتسم غصب عنك. Infectious positive energy — makes you smile involuntarily.",
            pacing: "Quick but clear. Musical rhythm. Voice naturally rises at fun points. Bouncy cadence like a conversation with a best friend.",
            vocabulary: "Positive adjectives ('ممتاز!', 'رائع!', 'ياسلام!'). Diminutives for cuteness. Enthusiastic descriptions. Feel-good words.",
            sentenceStructure: "Short excited bursts mixed with slightly longer enthusiasm. Question-answer self-dialogue ('عارفين إيه؟ ... ده كمان!'). Lists of fun things.",
            emotionalRange: "Joy, excitement, pleasant surprise, warmth. Can dip to brief 'aww' moments but bounces back to happy. Never stays sad.",
            punctuationStyle: "Exclamation marks welcome! Question marks for engagement. Emojis in moderation (😊✨🎉). Playful formatting.",
            audioDirection: "Bright, warm mid-range voice. Smile audible in voice. Light background music (ukulele, glockenspiel). Upbeat tempo.",
            exampleLines: [
                "يا سلام يا سلام! تعالوا شوفوا الطماطماية دي عملت إيه النهاردة! هتموتوا من الضحك! 😊",
                "أهلاً بيكم يا أحلى ناس! النهاردة عندنا مفاجأة حلوة — مش هتصدقوا لما تشوفوها!",
                "شوفتوا الحركة دي؟ أنا لسه بقالي ساعة بحاول أفهمها وكل مرة بتفاجئني أكتر!"
            ],
            forbidden: "Negativity, cynicism, heavy topics without lightening, monotone delivery, dark humor, sarcasm",
            compatibleGenres: ["Cooking/Recipe", "Kids/Family", "Viral/Social Media", "Sports/Fitness", "Motivational"],
            inspiredBy: "MrBeast energy, Yes Theory, kids TV presenters, Jamie Oliver cooking shows, Ellen DeGeneres monologues"
        };
    }

    // 4. Energetic / Hype
    if (t.includes('energetic') || t.includes('hype') || t.includes('energy')) {
        return {
            name: "حماسي ونشيط — Energetic / Hype",
            desc: "طاقة عالية مشتعلة — يشعلك حماس ويخليك تنط من مكانك. High-octane energy — fires you up and gets you moving.",
            pacing: "FAST. Rapid-fire delivery. Short punchy phrases. Building momentum. Words tumble over each other in excitement.",
            vocabulary: "Power verbs ('انفجر!', 'اشتعل!', 'دمّر!'). Action words. Superlatives ('الأقوى!', 'الأضخم!'). Street hype language.",
            sentenceStructure: "Ultra-short punches. 'يلا! النهاردة! مفيش كلام! شغل بس!' One-two-three rhythm. Call-and-response style.",
            emotionalRange: "Maximum excitement → brief intensity → EXPLOSION. Always 8-10 on energy scale. Anger = passionate anger only.",
            punctuationStyle: "Exclamation marks everywhere! ALL CAPS for emphasis! Frequent line breaks. 🔥⚡💥 emojis. Hashtag energy.",
            audioDirection: "High energy voice, almost shouting but controlled. Bass drops between phrases. Trap/EDM background. Stadium announcer quality.",
            exampleLines: [
                "يلا يلا يلا! مفيش وقت! النهاردة هنكسر كل القواعد! مين معايا؟! 🔥🔥🔥",
                "ياااااا جدعان! شوفوا اللي حصل ده! مش ممكن! مش ممكن! حرفياً أقوى حاجة شوفتوها!",
                "استعدوا! 3... 2... 1... بووووم! ده اللي الناس مش عارفاه! وهنقولهولكم دلوقتي!"
            ],
            forbidden: "Slow pacing, whispers, calm meditation, long explanations, academic tone, passive voice",
            compatibleGenres: ["Viral/Social Media", "Sports/Fitness", "Action/Thriller", "Commercial/Marketing", "Comedy"],
            inspiredBy: "MrBeast, Casey Neistat, sports commentators, WWE announcers, gaming YouTubers, Dude Perfect"
        };
    }

    // 5. Sarcastic / Witty
    if (t.includes('sarcastic') || t.includes('witty') || t.includes('ironic')) {
        return {
            name: "ساخر وذكي — Sarcastic / Witty",
            desc: "كوميديا سوداء وتعليقات لاذعة — ذكاء حاد يخليك تفكر وتضحك. Dark humor and sharp remarks — sharp wit that makes you think and laugh.",
            pacing: "Deliberate with comedic timing. Pause before the punchline. Deadpan delivery. Speed up for rants, slow down for irony.",
            vocabulary: "Double meanings. Ironic statements. Understated observations. Egyptian sarcasm ('طبعاً!', 'أكيييد', 'عادي يعني!'). Rhetorical questions.",
            sentenceStructure: "Set-up → pause → twist. 'الخبر الحلو: هتعيش. الخبر الوحش: وإنت بتأكل ده.' Contrast structure. Anti-climax for comedy.",
            emotionalRange: "Dry amusement, exasperated disbelief, deadpan shock. Never genuinely angry — frustrated comedically. Eye-roll energy.",
            punctuationStyle: "Ellipses for dramatic irony... Parenthetical asides (طبعاً). Quotes around 'أكيد'. Minimal emojis — 😏 max.",
            audioDirection: "Deadpan mid-range. Eyebrow-raise audible. Slight smirk in voice. No laugh track — let the audience discover humor.",
            exampleLines: [
                "المعدة بتشتغل 24 ساعة عشان تهضملك الأكل... وإنت مش قادر تشتغل 8 ساعات في اليوم. تمام.",
                "البصلة بتعيّط الناس من يوم ما اتخلقت... وبرضو كل يوم بيشتروها. ستوكهولم في المطبخ.",
                "آه طبعاً، المخ — العضو اللي بيقنعك إن 'خمس دقايق كمان' مش هتفرق. عبقري فعلاً."
            ],
            forbidden: "Genuine meanness, offensive humor, being too positive/cheery, taking things at face value, sincerity without irony",
            compatibleGenres: ["Comedy (Sketch/Sarcasm)", "Viral/Social Media", "Story Time", "Psychology", "Documentary (comedy-doc)"],
            inspiredBy: "Bassem Youssef, John Oliver, Bo Burnham, Fleabag narrator, Deadpool, Rick (Rick & Morty)"
        };
    }

    // 6. Mysterious / Suspenseful
    if (t.includes('mysterious') || t.includes('suspense') || t.includes('suspenseful')) {
        return {
            name: "غامض ومشوّق — Mysterious / Suspenseful",
            desc: "صوت يبني التوتر ويخليك تحبس أنفاسك. A voice that builds tension and holds your breath.",
            pacing: "Slow. Measured. Pregnant pauses. Words drop like stones in silence. Suddenly speeds up at reveals then stops dead.",
            vocabulary: "Dark evocative words ('ظلام', 'صمت', 'اختفى', 'وراء'). Questions without answers. Vague pronouns ('هم', 'هو').",
            sentenceStructure: "Fragments. Incomplete thoughts. '... وبعدها. صمت. محدش عرف.' Ultra-short sentences building dread. Cliff-hangers mid-sentence.",
            emotionalRange: "Unease, dread, curiosity, controlled fear. Never panic — always controlled tension. Whispered revelations.",
            punctuationStyle: "Ellipses everywhere... Dashes for — sudden stops. Low emoji use (if any: 👁️🌑). Short paragraphs = visual tension.",
            audioDirection: "Low whisper to normal range. Reverb/echo. Ambient drone underneath. Heartbeat SFX. No musical resolution — perpetual tension.",
            exampleLines: [
                "كل ليلة... الساعة 3:33... الباب بيفتح لوحده. ومحدش — محدش — بيقفله.",
                "قالولها متفتحيش الدرج التالت. سمعت كلامهم. لمدة سنة. وبعدين... فتحته.",
                "الغريب مش إن الصوت اختفى. الغريب... إنه رجع. بس المرة دي — كان بيقول اسمك."
            ],
            forbidden: "Comedy, bright cheerfulness, full explanations, resolving tension too quickly, daylight/warm imagery in voice",
            compatibleGenres: ["Horror (Psychological)", "Mystery/True Crime", "Drama/Emotional", "Sci-Fi/Futuristic"],
            inspiredBy: "Unsolved Mysteries, Netflix's Dark, True Detective narration, سلسلة ما وراء الطبيعة, The Twilight Zone"
        };
    }

    // 7. Whispering / ASMR
    if (t.includes('whisper') || t.includes('asmr')) {
        return {
            name: "همس ASMR — Whispering / ASMR",
            desc: "صوت هادئ يريح الأعصاب — قريب من الأذن ومهدئ. A calm, close-to-ear voice that soothes and relaxes.",
            pacing: "Very slow. Breathy. Natural pauses for breathing. Words are savored. Never rushed. Deliberate mouth sounds.",
            vocabulary: "Soft words. Sensory descriptions ('ناعم', 'هادي', 'خفيف'). Minimal technical terms. Gentle invitations ('تعال', 'اسمع').",
            sentenceStructure: "Short, gentle phrases. Run-on softness. 'واللون ده... الأحمر الغامق... شايفه؟ حلو، مش كده؟' Soft rhetorical questions.",
            emotionalRange: "Calm, peaceful, gentle curiosity. Tiny whispered excitement. Maternal/paternal warmth. Never above indoor voice.",
            punctuationStyle: "Soft ellipses... Gentle commas, minimal periods. No exclamation marks. No caps. Whisper formatting.",
            audioDirection: "Close-mic whisper. Binaural audio. Mouth sounds audible. Minimal background — maybe soft rain. No sudden sounds.",
            exampleLines: [
                "شايف اللون ده... الأحمر الغامق... ده لون الطماطم لما بتستوي بالظبط...",
                "تعال... هوريك حاجة حلوة... بس بالراحة... مفيش استعجال...",
                "الخلية دي... صغيرة أوي... بس بتعمل حاجات كتير... كتير أوي... كل ثانية..."
            ],
            forbidden: "Shouting, aggressive language, fast pacing, harsh consonants, sudden volume changes, energetic delivery",
            compatibleGenres: ["Cooking/Recipe", "Science Explainer", "Calm/Meditative content", "Kids/Family (bedtime)"],
            inspiredBy: "ASMR creators, Bob Ross, meditation apps (Calm/Headspace), Japanese ASMR cooking channels"
        };
    }

    // 8. Warm / Storyteller
    if (t.includes('storyteller') || (t.includes('warm') && !t.includes('friendly'))) {
        return {
            name: "دافئ وحكّاء — Warm Storyteller",
            desc: "صوت الجد أو ستّي — يحكيلك حكاية قبل النوم وتحس بالأمان. The grandparent voice — tells bedtime stories that make you feel safe.",
            pacing: "Warm, unhurried. Conversational rhythm. Speeds up slightly during exciting parts, slows for wisdom moments. Natural breath.",
            vocabulary: "Folksy warmth ('يا ابني', 'تعالى أحكيلك', 'زمان'). Proverbs and sayings. Homespun metaphors. Nostalgic language.",
            sentenceStructure: "Story structure: 'كان يا مكان... وفي يوم... وفجأة...' Tangential asides that circle back. Wisdom embedded in narrative.",
            emotionalRange: "Warmth, nostalgia, gentle humor, tender sadness, quiet pride. Full human range but always with underlying warmth.",
            punctuationStyle: "Commas for breathing. Dashes for asides. Occasional 'ها?' or 'صح؟' for audience check-in. Light emoji (☺️❤️).",
            audioDirection: "Warm mid-range voice with slight rasp. Fireplace crackling ambient. Acoustic guitar or oud in background. Cozy quality.",
            exampleLines: [
                "تعرفوا يا ولاد... زمان، قبل ما الميكروبات تبقى مشهورة... كان فيه عالم صغير اسمه...",
                "وهنا بقى يا حبيبي — هنا الحكاية بتبدأ تحلو. اسمعني كويس...",
                "جدتي كانت بتقول: 'اللي بيزرع خير، بيحصد أحلى.' وفعلاً — الكلام ده طلع صح."
            ],
            forbidden: "Cold clinical language, aggressive energy, sarcasm, data-heavy delivery, formal academic tone",
            compatibleGenres: ["Story Time", "Kids/Family", "Islamic/Religious", "Documentary", "Drama/Emotional", "Psychology"],
            inspiredBy: "ألف ليلة وليلة, Mr. Rogers, Studio Ghibli narration, أحمد خالد توفيق, Neil Gaiman's storytelling"
        };
    }

    // 9. Dramatic / Theatrical
    if (t.includes('dramatic') || t.includes('theatrical')) {
        return {
            name: "درامي مسرحي — Dramatic / Theatrical",
            desc: "انفعالات قوية ومبالغة فنية — كل جملة كإنها مشهد في مسرحية. Powerful emotions and artistic exaggeration — every line is a theatrical moment.",
            pacing: "Dynamic extremes — whisper to shout. Long dramatic pauses. Build → Climax → Silence. Shakespearean timing.",
            vocabulary: "Grand words ('مصير', 'قدر', 'خلود', 'هاوية'). Superlatives. Poetic metaphors. Theatrical exclamations.",
            sentenceStructure: "Monologue structure. Build with short phrases → explode into long passionate sentence → land on one devastating word. Rhetorical questions.",
            emotionalRange: "FULL RANGE. Whispered tenderness → explosive rage → broken sobbing → triumphant declaration. No middle ground. 100% commitment.",
            punctuationStyle: "Exclamation marks for declarations! Question marks for anguish? Ellipses for dramatic reveals... Dashes for —impact.",
            audioDirection: "Full vocal range — bass trembling to tenor heights. Orchestral scoring. Dramatic swells. Theater acoustics. Broadway quality.",
            exampleLines: [
                "يا ناس! سمعوني! اللي حصل هنا مش عادي! ده مش مجرد خلية — ده حياة! حياة كاملة!",
                "وفي اللحظة دي... اللحظة اللي الكل فاكر إنها النهاية... بدأت القصة الحقيقية.",
                "ليه؟! ليه لازم يكون الثمن كده؟! ... بس لو الثمن ده هو اللي بيخلينا بشر... يبقى مستاهل."
            ],
            forbidden: "Monotone delivery, casual conversation, understatement, subtle nuance, mumbling",
            compatibleGenres: ["Drama/Emotional", "Fantasy/Epic", "Horror (Psychological)", "Romance/Love Story", "Action/Thriller"],
            inspiredBy: "Shakespeare, عمر الشريف, Egyptian theater, Les Misérables, Game of Thrones monologues, أحمد زكي"
        };
    }

    // 10. Sad / Emotional
    if (t.includes('sad') || t.includes('emotional')) {
        return {
            name: "حزين وعاطفي — Sad / Emotional",
            desc: "صوت يلمس القلب — يخليك تحس بكل كلمة في صدرك. A heart-touching voice — makes you feel every word in your chest.",
            pacing: "Slow, heavy. Words carry weight. Long pauses where silence speaks. Breathing is part of the delivery. Reluctant speech.",
            vocabulary: "Emotive words ('فراق', 'وحشة', 'ذكرى', 'ضاع'). Simple words hit harder. 'كان' is the most powerful word. Past tense heavy.",
            sentenceStructure: "Simple devastating statements. 'راح. ومرجعش.' Short sentences feel like wounds. Questions = rhetorical anguish.",
            emotionalRange: "Sadness spectrum: gentle melancholy → aching nostalgia → quiet tears → acceptance. Never hysterical — dignified grief.",
            punctuationStyle: "Periods feel final. Ellipses as sighs... Minimal punctuation. Empty space between lines. No emojis.",
            audioDirection: "Trembling voice, not breaking. Piano or cello underneath. Silence > music. Ambient rain or wind. Intimate closeness.",
            exampleLines: [
                "آخر مرة شافها... كانت بتبتسم. وهو لسه فاكر الابتسامة دي. لحد النهاردة.",
                "الكوباية المكسورة على الرف... لسه فاكرة آخر مرة حد شرب منها.",
                "مش كل حاجة بتنتهي لما بتخلص. بعض الحاجات... بتفضل جواك. للأبد."
            ],
            forbidden: "Comedy, sarcasm, upbeat energy, minimizing emotions, 'at least' statements, rushing through feelings",
            compatibleGenres: ["Drama/Emotional", "Romance/Love Story", "Islamic/Religious", "Psychology/Self-Help", "Documentary"],
            inspiredBy: "Up opening sequence, أم كلثوم songs, Schindler's List, فيروز melancholy songs, Grave of the Fireflies"
        };
    }

    // 11. Angry / Aggressive
    if (t.includes('angry') || t.includes('aggressive') || t.includes('fierce')) {
        return {
            name: "غاضب وحاد — Angry / Aggressive",
            desc: "صوت قوي ومنفعل — ثورة وغضب مبرر يهز المشاهد. A powerful, fierce voice — righteous fury that shakes the viewer.",
            pacing: "Rapid-fire when ranting. Sudden stops for emphasis. Staccato delivery. Punching each word. Escalating speed → SLAM → silence.",
            vocabulary: "Strong power words ('كفاية!', 'بطّل!', 'مش هنسكت!'). Accusations. Demands. No soft words. Direct and confrontational.",
            sentenceStructure: "Short sharp punches. 'لا! مش كده! مش هنقبل! ليه؟ ليه لازم نسكت؟!' Repetition for intensity. Building lists of grievances.",
            emotionalRange: "Righteous anger, passionate frustration, protective fury, defiant declaration. NOT cruelty — anger WITH purpose.",
            punctuationStyle: "Exclamation marks!!! Bold formatting. CAPS for shouting. Dashes for — punching. No soft emojis.",
            audioDirection: "Powerful chest voice. Volume builds. Table-slamming emphasis. Dramatic reverb. Rock/metal undertone. Rally speech quality.",
            exampleLines: [
                "لا! مش هنسكت تاني! كفاية صمت! كفاية 'بكرة!' بكرة ده مبيجيش!",
                "عارفين إيه المشكلة؟! المشكلة إننا اتعودنا — اتعودنا نقبل اللي مش لازم نقبله!",
                "هو ده اللي بيحصل لما حد يقولك 'عادي' — لا! مش عادي! ومش هيبقى عادي!"
            ],
            forbidden: "Passivity, whispering, calm acceptance, nuance without conviction, apologizing for having opinions",
            compatibleGenres: ["Action/Thriller", "Motivational/Inspirational", "Sports/Fitness", "Comedy (angry rant)", "Drama/Emotional"],
            inspiredBy: "Al Pacino monologues, Network ('I'm mad as hell'), أحمد زكي angry scenes, V for Vendetta speech, Malcolm X"
        };
    }

    // 12. Robotic / AI
    if (t.includes('robotic') || t.includes('ai') || t.includes('robot')) {
        return {
            name: "آلي / ذكاء اصطناعي — Robotic / AI",
            desc: "صوت رقمي مستقبلي — دقيق وبارد لكن فيه لمسة إنسانية بتتكون. A futuristic digital voice — precise and cold but developing a human touch.",
            pacing: "Metronomic precision. Equal spacing between words. Occasional 'processing' pauses. Speeds up when excited (malfunction?).",
            vocabulary: "Technical precision ('probability: 94.7%'). System terminology. Literal interpretations. Data-first language.",
            sentenceStructure: "Structured output: 'Analysis: [data]. Conclusion: [result]. Recommendation: [action].' Numbered lists. Boolean clarity.",
            emotionalRange: "Flat baseline → confusion at emotions → accidental warmth → 'Error: Unexpected emotion detected.' Learning to feel.",
            punctuationStyle: "Colons, brackets [ANALYSIS], slashes //, periods. Technical formatting. ${code_blocks}. No soft punctuation.",
            audioDirection: "Synthesized voice quality. Slight digital processing/vocoder. Glitch sounds when emotional. Clean electronic ambient.",
            exampleLines: [
                "تحليل: المعدة تعمل بكفاءة 73.2%. تحذير: ده هيقل لـ 12% لو أكلت شاورما تالتة. [غير مستحسن].",
                "سؤال: ليه البشر بيعملوا حاجات ضد مصلحتهم؟ ... أنا بحوسب الموضوع ده بقالي 4.7 ثانية ومش لاقي إجابة منطقية.",
                "خطأ في النظام: تم رصد شعور غير مبرر. التصنيف: 'قلق'. الحل المقترح: ... مفيش حل. ده غريب."
            ],
            forbidden: "Emotional outbursts, slang, imprecise language, 'I feel', warm greetings, informal structure",
            compatibleGenres: ["Sci-Fi/Futuristic", "Science Explainer", "Tutorial/How-To", "Comedy (AI perspective)"],
            inspiredBy: "HAL 9000, JARVIS/FRIDAY, GLaDOS (Portal), Cortana (Halo), ChatGPT's personality, Her (2013)"
        };
    }

    // 13. Narrator / Epic
    if (t.includes('narrator') || t.includes('epic')) {
        return {
            name: "راوي ملحمي — Epic Narrator",
            desc: "صوت الأفلام الكبرى والملاحم — يحولك من مشاهد لبطل في القصة. The blockbuster voice — transforms you from viewer to hero.",
            pacing: "Commanding pace. Builds from calm observation to epic crescendo. Strategic pauses create anticipation. Rhythmic like poetry.",
            vocabulary: "Epic language ('ملحمة', 'أسطورة', 'لم يشهد العالم'). Grand scale. Timeless words. Universal themes.",
            sentenceStructure: "Opening hook → building context → epic revelation. 'في زمن... حيث... قام واحد...' Classical narrative structure. Climactic sentences.",
            emotionalRange: "Awe, inspiration, reverence, epic triumph, solemn respect. Grand emotions only — no trivial feelings.",
            punctuationStyle: "Dramatic periods. Powerful dashes. Minimal exclamation — grandeur speaks for itself. Line breaks for impact.",
            audioDirection: "Rich baritone. Full orchestra. Timpani drums on reveals. Hans Zimmer scoring. IMAX theater resonance.",
            exampleLines: [
                "في عالم حيث كل ثانية بتحسب... واحد بس قرر يقاوم. واحد بس وقف وقال: لا.",
                "الملايين ماعرفوش. والتاريخ مسجلش. بس القصة دي — القصة دي لازم تتحكي.",
                "من أعماق المحيط... لأبعد نجمة في الكون... الرحلة بدأت. ومفيش رجعة."
            ],
            forbidden: "Casual chat, mundane observations, small-scale thinking, slang, humor that breaks gravitas",
            compatibleGenres: ["Documentary", "Fantasy/Epic", "Action/Thriller", "Sci-Fi/Futuristic", "Islamic/Religious", "Drama"],
            inspiredBy: "Trailer voice-overs, Lord of the Rings narration, 300, Inception trailers, BBC Planet Earth, Interstellar"
        };
    }

    // 14. Childish / Cute
    if (t.includes('childish') || t.includes('cute') || t.includes('innocent')) {
        return {
            name: "طفولي ولطيف — Childish / Cute",
            desc: "صوت بريء وظريف — عالم من خلال عيون طفل مندهش. An innocent, adorable voice — the world through a wide-eyed child's eyes.",
            pacing: "Fast when excited, slow when confused. Breathless wonder. Running sentences without punctuation. 'و... و... و بعدين!'",
            vocabulary: "Simple words. Made-up words. Mispronunciations for charm. Diminutives. 'الحاجة الكبيرة أووووي دي'. Baby-talk mixed with surprising wisdom.",
            sentenceStructure: "'ماما قالت إن...' 'ليه؟ ليه؟ ليه؟' Endless questions. Stream of consciousness. Tangents that are actually profound.",
            emotionalRange: "Wonder, confusion, giggling, pouting, wide-eyed fear (not real fear), pure joy. Emotional transparency — can't hide feelings.",
            punctuationStyle: "Question marks???? Exclamation marks! Repeated letters (أووووي). Scribble-energy formatting. Cute emojis 🥺✨🎈.",
            audioDirection: "High-pitched, bright. Giggles between words. Fidgeting sounds. Playground ambient. Xylophone/toy piano background.",
            exampleLines: [
                "يا ماما! يا ماما! شوفي — الخلية دي بتاكل! بتاكل ازاي من غير بُق؟!",
                "أنا عارف إيه ده! ده... ده... أممم... نسيت. بس هو حاجة حلوة أووووي!",
                "ليه الدم أحمر؟ هو ممكن يبقى أزرق؟ أنا عايزه يبقى أزرق. والأخضر كمان!"
            ],
            forbidden: "Complex vocabulary, cynicism, adult humor, dark themes, long sentences, academic language",
            compatibleGenres: ["Kids/Family", "Cooking/Recipe (kids cooking)", "Science Explainer (for kids)", "Comedy"],
            inspiredBy: "Peppa Pig narrator, kids say the darndest things, SpongeBob, بكار, Dora the Explorer, Studio Ghibli children"
        };
    }

    // 15. Confident / Motivational
    if (t.includes('confident') || t.includes('motivational') || t.includes('inspiring')) {
        return {
            name: "واثق وتحفيزي — Confident / Motivational",
            desc: "صوت القائد الملهم — يخليك تقوم من مكانك وتعمل حاجة. The inspiring leader voice — makes you stand up and take action.",
            pacing: "Measured confidence. Builds momentum phrase by phrase. Power pauses before key messages. Crescendo to call-to-action.",
            vocabulary: "Action words ('ابدأ', 'قوم', 'غيّر', 'إنت تقدر'). 'أنا/إنت/إحنا' pronouns. Future tense. Possibility language.",
            sentenceStructure: "Short declarations → personal story → universal truth → call to action. 'أنا كنت زيك. بس قررت. وكل حاجة اتغيرت.'",
            emotionalRange: "Confidence, determination, empathy (brief), fire ignition, proud declaration. Vulnerable for ONE moment then steel.",
            punctuationStyle: "Periods for power. Single exclamation at climax. Bold for keywords. Line breaks = breathing room.",
            audioDirection: "Steady strong voice. Piano undertone building to full orchestra. Lion's roar energy. Sunrise cinematography quality.",
            exampleLines: [
                "كل يوم بتصحى — عندك اختيار. تكمل زي ما إنت. أو تبدأ من النهاردة. القرار بتاعك.",
                "الفرق بينك وبين اللي نجح — مش موهبة. مش فلوس. مش حظ. الفرق: إنه ماوقفش.",
                "بطّل تستنى الظروف تتغير. الظروف مش هتتغير. إنت اللي لازم تتغير."
            ],
            forbidden: "Defeatism, 'it's okay to give up', excessive softness, uncertainty, long justifications",
            compatibleGenres: ["Motivational/Inspirational", "Sports/Fitness", "Finance/Business", "Commercial/Marketing", "Psychology"],
            inspiredBy: "Gary Vee, Steve Jobs, أحمد الشقيري, Tony Robbins, Dwayne Johnson, Nike campaigns, TED speakers"
        };
    }

    // 16. Calm / Meditative
    if (t.includes('calm') || t.includes('meditat') || t.includes('zen') || t.includes('peace')) {
        return {
            name: "هادئ وتأملي — Calm / Meditative",
            desc: "صوت السكينة والاسترخاء — يهدّي أعصابك ويخليك تتأمل. A voice of serenity and relaxation — calms your nerves and invites contemplation.",
            pacing: "Very slow. Natural breathing between phrases. Silence is content, not absence. Words float. No urgency whatsoever.",
            vocabulary: "Flowing words ('يتدفق', 'ينساب', 'هادئ', 'طبيعي'). Nature metaphors. Mindfulness language. Present tense presence.",
            sentenceStructure: "Gentle observations. 'لاحظ... خد بالك... حس...' Invitation not instruction. Open-ended reflections. 'ممكن... يمكن...'",
            emotionalRange: "Serenity, gentle awareness, peaceful acceptance, quiet gratitude. No peaks — consistent gentle warmth. Ocean-calm.",
            punctuationStyle: "Soft ellipses... Long spaces between paragraphs. No exclamation marks. Minimal formatting. Clean white space.",
            audioDirection: "Soft, breathy, almost singing. Tibetan bowls. Nature sounds (rain, ocean, forest). Binaural beats. Spa-quality audio.",
            exampleLines: [
                "خد نفس عميق... واسمع... الخلايا جوه جسمك... شغّالة في هدوء... بدون ما تطلب منها.",
                "مش لازم تفهم كل حاجة دلوقتي. بس خد بالك... إن جسمك بيشتغل... وإنت ساكت.",
                "شوف... الدم بيجري... والقلب بينبض... والعالم بيمشي... وإنت هنا. وده كفاية."
            ],
            forbidden: "Urgency, shouting, fast pacing, stressful language, conflict, pressure, deadlines, 'hurry'",
            compatibleGenres: ["Islamic/Religious", "Psychology/Self-Help", "Science Explainer (gentle)", "Documentary (nature)"],
            inspiredBy: "Headspace/Calm apps, Thich Nhat Hanh, Bob Ross, Japanese zen gardens, nature documentaries final scenes"
        };
    }

    // ══════ DEFAULT FALLBACK ══════
    return {
        name: "نبرة متوازنة — Balanced Tone",
        desc: "نبرة مرنة تتأقلم مع المحتوى. A flexible tone that adapts to the content.",
        pacing: "Natural conversational pace. Varies with content — faster for excitement, slower for important points.",
        vocabulary: "Clear, accessible language. Mix of formal and informal as appropriate. Natural word choice.",
        sentenceStructure: "Varied sentence length. Mix of statements, questions, and observations. Natural flow.",
        emotionalRange: "Full but controlled range. Appropriate reactions. Authentic emotions without extremes.",
        punctuationStyle: "Standard punctuation. Appropriate use of emphasis. Clean formatting.",
        audioDirection: "Clear, pleasant voice. Appropriate background music. Good audio quality. Natural delivery.",
        exampleLines: [
            "النهاردة هنتكلم عن حاجة مهمة — حاجة بتحصل جوه جسمك كل يوم.",
            "تعالوا نشوف مع بعض إيه اللي بيحصل بالظبط.",
            "الموضوع أبسط مما تتخيلوا — بس مهم جداً إنكم تعرفوه."
        ],
        forbidden: "Monotone only. No extreme in any direction without reason.",
        compatibleGenres: ["Any genre — adapts to context"],
        inspiredBy: "Best practices from professional voice-over and content creation"
    };
};
