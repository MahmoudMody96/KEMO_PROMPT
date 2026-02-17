// DIALECT DNA ENGINE v1.0
// Extracted from promptApi.js

// ═══════════════════════════════════════════════════════════════════
// 🌍 DIALECT DNA ENGINE v1.0 — Rich Language & Cultural Profiles
// Each dialect gets a unique DNA: vocabulary, greetings, expressions,
// humor style, cultural references, and example dialogue.
// Used by generateSystemPrompt() to enforce authentic dialect usage.
// ═══════════════════════════════════════════════════════════════════
export const getDialectDNA = (dialect) => {
    const normalize = (s) => (s || '').toLowerCase().replace(/[\s_\-\/()]+/g, '');
    const d = normalize(dialect);

    // ═══ ARABIC DIALECTS ═══

    // 1. Egyptian (Masri)
    if (d.includes('egypt') || d.includes('masri') || d.includes('مصري')) {
        return {
            name: "مصري — Egyptian (Masri)",
            desc: "عامية القاهرة — ساخرة، شعبية، مليانة حكم وأمثال. Cairo dialect — witty, street-smart, full of proverbs and charm.",
            region: "مصر — القاهرة والدلتا والصعيد",
            vocabularyRules: "استخدم مفردات مصرية أصيلة: 'إيه' بدل 'شو'، 'فين' بدل 'وين'، 'كده' بدل 'هيك'، 'دلوقتي' بدل 'هلأ'. Use Egyptian-specific words: 'حاجة' (thing), 'عايز' (want), 'بتاع' (of/belonging to)",
            greetings: "إيه الأخبار! | أهلاً يا معلم! | ازيك يا باشا! | منوّر يا كبير!",
            commonExpressions: ["يا سلام!", "يا نهار أبيض!", "ده جنان!", "ولا يهمك!", "كله تمام!", "ربنا يسترها!", "ما تقلقش!", "حصل خير!"],
            slangWords: ["بتاع (شيء/تابع)", "يعني (أي/مثلاً)", "بقى (أصبح/إذاً)", "خالص (أبداً/نهائياً)", "كده (هكذا)", "لسه (لم يزل)", "بردو (أيضاً)", "عشان (لأن)"],
            sentenceEndings: "جمل تنتهي بـ 'يعني'، 'كده'، 'بقى'، 'ولا إيه'. Questions end with 'ولا إيه؟' or 'صح؟'",
            humorStyle: "سخرية ذكية، تعليقات جانبية، مبالغة كوميدية، أمثال شعبية ملتوية. Self-deprecating humor. 'يا بني أنا...' setup → punchline.",
            culturalReferences: "أفلام عادل إمام، أمثال شعبية (اللي بيته من ازاز)، أكل الشارع (كشري، فول)، المواصلات (ميكروباص)، المصطبة، الحارة",
            exampleDialogue: [
                "يا جدعان بصوا هنا — الخلية دي شغالة 24 ساعة من غير أجازة. يعني أنا أحسن منها؟ أكيد! أنا باخد أجازة 😏",
                "المعدة بتقولك: يا بني أنا تعبت! وإنت بتاكل عليها شاورما الساعة 3 الصبح. حصل خير يا معدة.",
                "إيه الأخبار يا صحاب! تعالوا أوريكم حاجة — حاجة مش هتلاقوها في أي حتة تانية. جاهزين؟ يلا بينا!",
                "لسه بدري على الموضوع ده — بس إحنا هنتكلم عشان تفهموا كل حاجة بالظبط من غير لف ولا دوران."
            ],
            forbidden: "مفردات شامية (هلأ، شو، كتير)، مفردات خليجية (واجد، حيل)، فصحى مبالغ فيها، لغة رسمية متصلبة",
            writingScript: "Arabic"
        };
    }

    // 2. Saudi (Khaleeji)
    if (d.includes('saudi') || d.includes('khaleeji') || d.includes('سعودي') || d.includes('خليجي')) {
        return {
            name: "سعودي خليجي — Saudi (Khaleeji)",
            desc: "لهجة نجدية/حجازية — فخمة ومباشرة وفيها ثقة عالية. Najdi/Hijazi dialect — dignified, direct, and confidently delivered.",
            region: "السعودية — الرياض (نجد)، جدة (الحجاز)، الدمام (الشرقية)",
            vocabularyRules: "استخدم: 'وش' بدل 'إيه'، 'ذحين/الحين' بدل 'دلوقتي'، 'واجد/حيل' بدل 'كتير'، 'يبه' للمخاطب. Use: 'أبي/أبغى' (want), 'ذا/ذي' (this), 'مب/مو' (not)",
            greetings: "هلا والله! | مرحبا يا حبيبي! | السلام عليكم! | هلا وغلا! | حيّاك الله!",
            commonExpressions: ["والله!", "ما شاء الله!", "يا وليّ!", "عاد!", "يبه!", "ترى!", "وش ذا!", "الله يعطيك العافية!"],
            slangWords: ["وش (ماذا)", "ذحين/الحين (الآن)", "واجد/حيل (كثير)", "أبي/أبغى (أريد)", "مب/مو (ليس)", "يبه (يا ولد)", "ترى (انتبه)", "زين (جيد/حسناً)"],
            sentenceEndings: "جمل تنتهي بـ 'ترى'، 'عاد'، 'بس'، 'ذا اللي صار'. Use 'وش رايك؟' for questions.",
            humorStyle: "فكاهة مباشرة وصريحة، مبالغة في الصفات، قصص يومية مع twist، دعابة ذكية بدون إسفاف. Observational humor.",
            culturalReferences: "القهوة العربية والتمر، الصحراء، الإبل، الضيافة الخليجية، المجلس، طقوس العيد، التطوير والرؤية 2030",
            exampleDialogue: [
                "يا حبيبي والله إن الخلية ذي شغلها واجد — تشتغل الليل والنهار ولا تقول تعبت. ما شاء الله عليها!",
                "وش ذا اللي يسوونه! الحين بقولكم شي — شي ما حد يعرفه. ترى الموضوع أكبر مما تتخيلون.",
                "هلا وغلا! ذحين وريكم حاجة — بس خلوا تركيزكم معاي. زين؟ يلا نبدأ!"
            ],
            forbidden: "مفردات مصرية (بتاع، فين، كده)، مفردات شامية (هلأ، شو)، لهجة بدوية مبالغة، ألفاظ غير لائقة",
            writingScript: "Arabic"
        };
    }

    // 3. Levantine (Shami)
    if (d.includes('levant') || d.includes('shami') || d.includes('شامي') || d.includes('lebane') || d.includes('syrian')) {
        return {
            name: "شامي — Levantine (Shami)",
            desc: "لهجة لبنانية/سورية — ناعمة وأنيقة وموسيقية. Lebanese/Syrian dialect — smooth, elegant, and musical.",
            region: "لبنان، سوريا، الأردن، فلسطين — بلاد الشام",
            vocabularyRules: "استخدم: 'شو' بدل 'إيه'، 'هلأ/هلق' بدل 'دلوقتي'، 'كتير' بدل 'قوي/أوي'، 'هيك' بدل 'كده'. Use: 'بدي' (want), 'هيدا/هيدي' (this), 'ما في' (there isn't)",
            greetings: "كيفك! | أهلين وسهلين! | مرحبا حبيبي! | شو الأخبار! | يا هلا!",
            commonExpressions: ["كتير حلو!", "يي!", "والله!", "يا عيني!", "شو هالحكي!", "معقول!", "ما بصدق!", "تكرم عيونك!"],
            slangWords: ["شو (ماذا)", "هلأ/هلق (الآن)", "كتير (كثير)", "بدي (أريد)", "هيك (هكذا)", "يعني (أي)", "ما في (لا يوجد)", "عنجد (حقاً)"],
            sentenceEndings: "جمل تنتهي بـ 'يعني'، 'هيك'، 'ما هيك؟'. Use rising intonation for charm. 'لا تزعل حبيبي' softener.",
            humorStyle: "فكاهة أنيقة راقية، إيحاءات ذكية، غزل خفيف، مفارقات اجتماعية. Charm-based humor, never vulgar.",
            culturalReferences: "فيروز والصباح، المطبخ اللبناني (تبولة، حمص)، الجبال والأرز، البحر الأبيض المتوسط، الحياة الليلية في بيروت",
            exampleDialogue: [
                "يا عيني شو هالشي الحلو! هيدي الخلية بتشتغل من القلب — كتير أحلى من اللي فكرتوا!",
                "شو يعني؟ يعني إنو الجسم كلو ماشي بنظام — وإنت ما عم تحس بشي. هيك هيي الحياة!",
                "أهلين حبابي! بدي خبركم شي — شي كتير حلو. بس خلوا عندكم صبر شوي... هلأ بتعرفوا."
            ],
            forbidden: "مفردات مصرية (بتاع، فين)، مفردات خليجية (وش، واجد)، خشونة في التعبير، لهجة عنيفة أو حادة",
            writingScript: "Arabic"
        };
    }

    // 4. Maghrebi (Darija)
    if (d.includes('maghreb') || d.includes('darija') || d.includes('morocc') || d.includes('مغربي')) {
        return {
            name: "مغربي دارجة — Maghrebi (Darija)",
            desc: "مزيج عربي فرنسي فريد — سريع وحيوي وملون. A unique Arabic-French blend — fast, lively, and colorful.",
            region: "المغرب، الجزائر، تونس — شمال أفريقيا",
            vocabularyRules: "مزج عربي-فرنسي: 'بزاف' (كثير), 'واخا' (حسناً), 'ديال' (ملك/تبع), 'كاين' (يوجد). French loanwords natural: 'formidable', 'tranquille'",
            greetings: "لاباس! | كيداير! | أهلاً خويا! | السلام! | واش كلشي مزيان!",
            commonExpressions: ["بزاف!", "والله!", "واش!?", "ياك!", "كاين!", "ما كاينش!", "ساهل!", "مزيان بزاف!"],
            slangWords: ["بزاف (كثير)", "واخا (حسناً/موافق)", "ديال (ملك/تبع)", "كاين (يوجد)", "ماشي (ليس)", "فين (أين)", "كيفاش (كيف)", "زوين (جميل)"],
            sentenceEndings: "جمل تنتهي بـ 'ياك'، 'واخا'، 'أ صاحبي'. Questions with 'واش...؟'",
            humorStyle: "فكاهة سريعة الإيقاع، مزج لغوي مضحك (عربي+فرنسي)، مواقف يومية مبالغ فيها، نكت شعبية",
            culturalReferences: "الشاي المغربي بالنعناع، الكسكس، ساحة جامع الفنا، الحمّام التقليدي، كرة القدم المغربية",
            exampleDialogue: [
                "واش عرفتي شنو اللي كايدير الجسم ديالك كل يوم؟ بزاف ديال الخدمة! وإنت ما كاتحس بوالو!",
                "أ خويا، سمع مزيان — الموضوع ماشي ساهل بحال ما كاتفكر. كاين شي حاجة خطيرة!",
                "لاباس عليكم أ صحاب! اليوم عندنا شي حاجة زوينة بزاف — واخا نبداو؟ يلا!"
            ],
            forbidden: "مفردات مشرقية (إيه، بتاع، شو)، بطء في الإيقاع، فصحى متصلبة، تجاهل المزج اللغوي الطبيعي",
            writingScript: "Arabic (with French loanwords)"
        };
    }

    // 5. Iraqi (Mesopotamian)
    if (d.includes('iraq') || d.includes('mesopo') || d.includes('عراقي') || d.includes('baghdad')) {
        return {
            name: "عراقي — Iraqi (Mesopotamian)",
            desc: "لهجة بغدادية قوية وأصيلة — فيها كرامة وحنين وعمق. Strong authentic Baghdadi dialect — full of dignity, nostalgia, and depth.",
            region: "العراق — بغداد، البصرة، الموصل، كردستان",
            vocabularyRules: "استخدم: 'شكو ماكو' (ما الجديد)، 'هواية' (كثير)، 'شلون' (كيف)، 'آني' (أنا)، 'هسه' (الآن). Use: 'أريد' (want), 'شنو' (what), 'يمعود' (يا صديق)",
            greetings: "شلونك! | شكو ماكو! | هلا بيك! | الله بالخير! | أهلاً يمعود!",
            commonExpressions: ["والله عظيم!", "هواية!", "شنو هذا!", "يمعود!", "لعد!", "بالله!", "ماكو مثله!", "خوش!"],
            slangWords: ["شكو ماكو (ما الجديد)", "هواية (كثير)", "شلون (كيف)", "آني (أنا)", "هسه (الآن)", "شنو (ماذا)", "خوش (جيد/جميل)", "يمعود (صديقي)"],
            sentenceEndings: "جمل تنتهي بـ 'يمعود'، 'لعد'، 'هاي'. Questions with 'شنو...؟' or 'شلون...؟'",
            humorStyle: "فكاهة حادة وذكية، حنين ممزوج بسخرية، قصص من الحارة، مبالغة محبوبة. Dry wit with warmth.",
            culturalReferences: "نهر دجلة، المسكوف، الچاي العراقي، الشعر العربي، بغداد التاريخية، الأهوار، المقام العراقي",
            exampleDialogue: [
                "يمعود تعال شوف — الخلية هاي هواية شغل عندها! آني أقولك شي، ماكو مثلها بالدنيا!",
                "شلون يعني ما تعرف؟! هسه أشرحلك — بالله عليك ركز وياي. الموضوع مو ساهل.",
                "شكو ماكو يا أهل! اليوم عندي شي خوش — شي ما سمعتوا بيه قبل. هسه أخبركم."
            ],
            forbidden: "مفردات مصرية (حاجة، عايز)، مفردات خليجية مبالغة، فكاهة سطحية بدون عمق، تجاهل الحنين العراقي",
            writingScript: "Arabic"
        };
    }

    // 6. Sudanese
    if (d.includes('sudan') || d.includes('سوداني')) {
        return {
            name: "سوداني — Sudanese",
            desc: "لهجة دافئة ومميزة — فيها طيبة وبساطة وعمق إنساني. A warm, distinctive dialect — kind, simple, and deeply human.",
            region: "السودان — الخرطوم، أم درمان، دارفور، كردفان",
            vocabularyRules: "استخدم: 'ده داير' (يريد)، 'شنو' (ماذا)، 'كيفنك' (كيف حالك)، 'دغري' (مباشرة)، 'جاي' (قادم). Use: 'يا زول' (يا شخص), 'كملِ' (أكمل).",
            greetings: "كيفنك يا زول! | السلام عليكم يا جماعة! | مرحب بيك! | الله أكبر!",
            commonExpressions: ["والله يا زول!", "ده كلام!", "يا سلام!", "ما شاء الله!", "ده شنو!", "بلا كلام!", "جاي حلو!"],
            slangWords: ["يا زول (يا شخص)", "داير (يريد)", "شنو (ماذا)", "دغري (مباشرة)", "جاي (قادم)", "كيفنك (كيف حالك)", "ود (ابن)", "بت (ابنة/بنت)"],
            sentenceEndings: "جمل تنتهي بـ 'يا زول'، 'ده'، 'كده'. Warm closing phrases.",
            humorStyle: "فكاهة دافئة وبسيطة، قصص من الحياة اليومية، حكمة ريفية، ضحك من القلب. Wholesome humor.",
            culturalReferences: "النيل الأزرق والأبيض، الفول المدمس السوداني، الجبنة (القهوة)، الثوب السوداني، الدبكة والأغاني الشعبية",
            exampleDialogue: [
                "يا زول تعال هنا — أوريك حاجة عجيبة! الخلية دي بتشتغل ليل ونهار ولا داير أجازة!",
                "كيفنكم يا جماعة! اليوم جاي ليكم بكلام مهم — كلام ما سمعتوهو قبل كده.",
                "والله يا زول الموضوع ده عجيب — ما كنت أصدق لو ما شفت بعيني. تعال أشرحلك."
            ],
            forbidden: "مفردات مصرية أو خليجية مباشرة، سخرية لاذعة (اللهجة دافئة)، تصنع في اللغة، عنف لغوي",
            writingScript: "Arabic"
        };
    }

    // 7. MSA (Fusha)
    if (d.includes('msa') || d.includes('fusha') || d.includes('fus7a') || d.includes('فصحى') || d.includes('classical')) {
        return {
            name: "فصحى — MSA (Modern Standard Arabic)",
            desc: "العربية الفصيحة الرسمية — بلاغة وفصاحة ودقة لغوية. Formal Classical Arabic — eloquence, rhetoric, and linguistic precision.",
            region: "العالم العربي بأكمله — اللغة الرسمية المشتركة",
            vocabularyRules: "مفردات فصيحة دقيقة، بلاغة عربية (استعارة، تشبيه، كناية). Formal vocabulary: 'إذ' بدل 'لما'، 'حيث' بدل 'المكان اللي'. إعراب صحيح.",
            greetings: "السلام عليكم ورحمة الله | أهلاً وسهلاً | تحية طيبة | بارك الله فيكم",
            commonExpressions: ["والله العظيم!", "جلّ جلاله!", "ما شاء الله!", "تبارك الرحمن!", "سبحان الله!", "لا ريب في ذلك!", "حقاً!"],
            slangWords: ["إذ (حين/عندما)", "حيث (في المكان الذي)", "ثمة (هناك)", "لعمري (والله)", "إنّ (التأكيد)", "بيد أنّ (لكن)", "فحسب (فقط)", "آنذاك (حينها)"],
            sentenceEndings: "جمل مكتملة نحوياً بإعراب صحيح. No colloquial endings. Formal closings.",
            humorStyle: "أدب ساخر راقي، تورية لغوية، بلاغة في السخرية، نكتة ذكية بدون ابتذال. Literary wit.",
            culturalReferences: "القرآن الكريم والحديث النبوي، الشعر العربي (المتنبي، نزار)، التراث الأدبي، التاريخ الإسلامي والعربي",
            exampleDialogue: [
                "ايها المشاهدون الاعزاء، ان ما يحدث داخل اجسادكم في هذه اللحظة لهو امر يستحق التامل.",
                "ثمة حقيقة لا يعلمها كثيرون — حقيقة تكمن في اعماق كل خلية من خلاياكم.",
                "لعلكم تتساءلون: كيف يعمل هذا النظام المعقد؟ الاجابة ابسط مما تتصورون — واعمق."
            ],
            forbidden: "عامية بأي لهجة، أخطاء نحوية، اختصارات عصرية، إيموجي في الحوار، كلمات أجنبية",
            writingScript: "Arabic (Formal)"
        };
    }

    // ═══ INTERNATIONAL LANGUAGES ═══

    // 8. English (American)
    if (d.includes('american') || (d.includes('english') && !d.includes('british'))) {
        return {
            name: "English (American) — إنجليزي أمريكي",
            desc: "عصري ومباشر — لغة هوليوود ووادي السيليكون. Modern and direct — the language of Hollywood and Silicon Valley.",
            region: "United States — diverse regional accents unified by General American",
            vocabularyRules: "Casual American English. Contractions welcome (don't, can't, gonna). Pop culture references. Tech-savvy language. Inclusive pronouns.",
            greetings: "Hey! | What's up! | Hey guys! | Yo! | Welcome back!",
            commonExpressions: ["No way!", "That's insane!", "For real?", "Let's go!", "Mind-blowing!", "Literally!", "I'm dead!", "Nailed it!"],
            slangWords: ["gonna (going to)", "wanna (want to)", "kinda (kind of)", "legit (legitimate)", "vibe (feeling)", "sus (suspicious)", "lowkey (subtly)", "slay (excel)"],
            sentenceEndings: "Casual endings: 'right?', 'you know?', 'though'. Valley girl? inflection? for emphasis.",
            humorStyle: "Self-deprecating, observational, pop culture based. Stand-up comedy style. Meme-aware. Gen-Z/Millennial humor shifts.",
            culturalReferences: "Hollywood, Super Bowl, Thanksgiving, road trips, college culture, social media trends, Netflix, fast food chains",
            exampleDialogue: [
                "Okay so like — your body is literally running a factory 24/7 and you didn't even know? That's wild.",
                "Here's the thing nobody tells you: your cells are doing the MOST right now. Like, they never stop. Ever.",
                "Alright, buckle up because what I'm about to show you is gonna blow your mind. Ready? Let's go!"
            ],
            forbidden: "British spelling (colour, favour), formal Victorian English, overly academic language without personality",
            writingScript: "Latin (English)"
        };
    }

    // 9. English (British)
    if (d.includes('british') || d.includes('uk') || d.includes('بريطاني')) {
        return {
            name: "English (British) — إنجليزي بريطاني",
            desc: "كلاسيكي وأنيق — ذكاء بريطاني لطيف وتعليقات ساخرة. Classic and elegant — gentle British wit and dry commentary.",
            region: "United Kingdom — RP (Received Pronunciation) as baseline, with regional flavour hints",
            vocabularyRules: "British spelling: colour, favourite, realise. British terms: 'brilliant', 'rubbish', 'proper', 'quite', 'rather'. Understatement is key.",
            greetings: "Hello there! | Right then! | Lovely to see you! | Cheers! | How do you do!",
            commonExpressions: ["Brilliant!", "Absolutely!", "Quite right!", "How extraordinary!", "Rather!", "I say!", "Splendid!", "Good heavens!"],
            slangWords: ["brilliant (great)", "rubbish (terrible)", "proper (very/real)", "cheeky (playfully rude)", "knackered (exhausted)", "dodgy (suspicious)", "gutted (devastated)", "sorted (arranged)"],
            sentenceEndings: "Understated endings: 'isn't it?', 'rather', 'I suppose'. Tag questions for politeness.",
            humorStyle: "Dry wit, understatement, gentle irony, self-deprecating, absurdist. Monty Python sensibility. Never loud about being funny.",
            culturalReferences: "The Crown, BBC, tea culture, queueing, the NHS, pub culture, Oxbridge, the weather (always), countryside",
            exampleDialogue: [
                "Right, so — your body is, rather extraordinarily, running what amounts to a small country. And you haven't the faintest idea.",
                "Now, I don't mean to alarm you, but what's happening inside your cells is really quite remarkable. Shall we have a look?",
                "One might assume the whole thing's rather straightforward. One would be spectacularly wrong. Let me explain."
            ],
            forbidden: "American slang (gonna, awesome, like), excessive enthusiasm, loud exclamations, earnest sincerity without dry wit",
            writingScript: "Latin (English - British)"
        };
    }

    // 10. French
    if (d.includes('french') || d.includes('franc') || d.includes('فرنسي')) {
        return {
            name: "Français — French / فرنسي",
            desc: "راقي وفني — لغة الفلسفة والسينما والطبخ. Refined and artistic — the language of philosophy, cinema, and cuisine.",
            region: "France — Parisian French as standard, with European French sensibility",
            vocabularyRules: "Elegant French vocabulary. Philosophical terms natural. Food/art terminology. Gendered articles precise. Proper conjugation.",
            greetings: "Bonjour! | Salut! | Bienvenue! | Mes chers amis! | Enchanté!",
            commonExpressions: ["Incroyable!", "C'est magnifique!", "Mon Dieu!", "Formidable!", "Voilà!", "Exactement!", "Quelle horreur!", "Comme c'est beau!"],
            slangWords: ["voilà (here it is)", "c'est la vie (that's life)", "n'est-ce pas (isn't it)", "comme ci comme ça (so-so)", "oh là là (surprise)", "en effet (indeed)"],
            sentenceEndings: "n'est-ce pas? | voilà | c'est ça | enfin... Trailing thoughts with '...'",
            humorStyle: "Philosophical humor, subtle irony, wordplay (jeux de mots), intellectual observations, cinematic absurdism",
            culturalReferences: "Cinema (nouvelle vague), gastronomy, philosophy (Sartre, Camus), fashion (Paris), wine, art (Louvre), revolution",
            exampleDialogue: [
                "Mes amis, ce qui se passe dans votre corps en ce moment — c'est un véritable chef-d'œuvre de la nature. Regardons ensemble.",
                "Voilà quelque chose d'extraordinaire: chaque cellule est un petit univers. Et vous, vous ne le saviez même pas!",
                "C'est fascinant, n'est-ce pas? La biologie est, en quelque sorte, la plus belle des poésies."
            ],
            forbidden: "Franglais (excessive English), argot vulgaire, loss of elegance, speaking like Google Translate",
            writingScript: "Latin (French)"
        };
    }

    // 11. Spanish
    if (d.includes('spanish') || d.includes('español') || d.includes('إسباني')) {
        return {
            name: "Español — Spanish / إسباني",
            desc: "حيوي وعاطفي — لغة ملتهبة بالحماس والحب والدراما. Vibrant and passionate — a language burning with enthusiasm, love, and drama.",
            region: "Spain (Castilian) + Latin American awareness — Neutral Spanish as baseline",
            vocabularyRules: "Passionate vocabulary. Diminutives for affection (-ito/-ita). Exclamatory sentences. ¡Opening exclamation marks! Rich adjectives.",
            greetings: "¡Hola amigos! | ¡Bienvenidos! | ¡Qué tal! | ¡Buenos días! | ¡Oigan!",
            commonExpressions: ["¡Increíble!", "¡Dios mío!", "¡Qué barbaridad!", "¡No me digas!", "¡Venga ya!", "¡Ándale!", "¡Mira!", "¡Qué maravilla!"],
            slangWords: ["vale (okay-Spain)", "mira (look)", "oye (hey)", "¡venga! (come on)", "guay (cool)", "tío/tía (dude)", "mola (cool)", "flipar (freak out)"],
            sentenceEndings: "¿verdad? | ¿no? | ¡vamos! | pues... Trailing 'pues' for transitions.",
            humorStyle: "Physical comedy references, passionate exaggeration, family humor, dramatic reactions. Telenovela-level emotion in comedy.",
            culturalReferences: "Football (fútbol), family gatherings, siestas, tapas, flamenco, Día de los Muertos, telenovelas, Gabriel García Márquez",
            exampleDialogue: [
                "¡Amigos! ¡Miren esto! Lo que pasa dentro de su cuerpo es absolutamente increíble — ¡como una telenovela microscópica!",
                "¿Saben qué? Cada célula en su cuerpo es como un pequeño héroe. ¡Y nadie les da las gracias! ¡Qué injusticia!",
                "Oigan, esto es importante — muy, muy importante. ¡Vengan! Les voy a mostrar algo que les va a volar la mente."
            ],
            forbidden: "Cold clinical tone, lack of passion, monotone delivery, ignoring ¡¿ opening punctuation, robotic formality",
            writingScript: "Latin (Spanish)"
        };
    }


    // ══════ DEFAULT FALLBACK ══════
    return {
        name: "لغة مرنة — Flexible Language",
        desc: "لغة تتأقلم مع السياق. A language that adapts to context.",
        region: "Universal",
        vocabularyRules: "Clear, accessible language appropriate for the target audience. Natural word choice.",
        greetings: "Appropriate cultural greeting for the context",
        commonExpressions: ["Appropriate exclamations and reactions"],
        slangWords: ["Natural colloquial words as appropriate"],
        sentenceEndings: "Natural sentence endings appropriate to the language.",
        humorStyle: "Culturally appropriate humor that resonates with the target audience.",
        culturalReferences: "Relevant cultural references for the target audience.",
        exampleDialogue: [
            "مرحباً! اليوم سنتحدث عن موضوع مهم.",
            "هل تعلمون ما يحدث داخل أجسادكم؟ شيء مذهل!",
            "تعالوا معي في هذه الرحلة — ستكتشفون أشياء رائعة."
        ],
        forbidden: "Mixing languages inappropriately. Unnatural phrasing.",
        writingScript: "Arabic / Latin (as appropriate)"
    };
};
