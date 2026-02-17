// src/i18n/options.js
// Dropdown options - fully translated

// ============================================
// DROPDOWN OPTIONS - FULLY TRANSLATED
// ============================================
export const getOptions = (lang) => {
    const isAr = lang === 'ar';

    return {
        // ═══════════════════════════════════════════════════════════
        // 🎨 VISUAL STYLES — Cinematic-Grade Style Library
        // ═══════════════════════════════════════════════════════════
        videoStyles: [
            { value: '', label: isAr ? '✨ تحديد تلقائي (دع المحرك يقرر)' : '✨ Auto-Detect (Let Engine Decide)' },
            {
                group: isAr ? '📸 واقعي وتصوير حقيقي' : '📸 Realistic & Photography', items: [
                    { value: 'Street Photography', label: isAr ? '📸 تصوير شارع — لحظات حقيقية من الحياة اليومية' : '📸 Street Photography — Real-Life Everyday Moments' },
                    { value: 'Portrait / Fashion', label: isAr ? '👤 بورتريه — وجوه وتفاصيل بإضاءة احترافية' : '👤 Portrait / Fashion — Faces & Details, Pro Lighting' },
                    { value: 'Product Photography', label: isAr ? '🛍️ تصوير منتجات — خلفية نظيفة وإضاءة استوديو' : '🛍️ Product Photography — Clean Background & Studio Light' },
                    { value: 'Nature / Landscape', label: isAr ? '🏔️ طبيعة ومناظر — جبال وشروق وبحار خلابة' : '🏔️ Nature / Landscape — Mountains, Sunsets & Seas' },
                    { value: 'Food Photography', label: isAr ? '🍽️ تصوير أكل — ألوان شهية ولقطات قريبة' : '🍽️ Food Photography — Appetizing Colors & Close-Up' },
                    { value: 'Documentary Realism', label: isAr ? '🎞️ واقعية وثائقية — كأنه مشهد من فيلم وثائقي' : '🎞️ Documentary Realism — Real Footage Look & Feel' },
                ]
            },
            {
                group: isAr ? '🎥 سينمائي واحترافي' : '🎥 Cinematic & Professional', items: [
                    { value: 'Cinematic', label: isAr ? '🎥 سينمائي — كأنه فيلم سينما حقيقي' : '🎥 Cinematic — Real Movie Look & Feel' },
                    { value: 'Realistic / Photorealistic', label: isAr ? '📷 واقعي فائق الدقة — كأنه صورة حقيقية بجودة 8K' : '📷 Hyper-Realistic — Looks Like a Real 8K Photo' },
                    { value: 'Film Noir', label: isAr ? '🎩 فيلم نوار — أبيض وأسود وظلال غامضة' : '🎩 Film Noir — B&W, Heavy Shadows & Mystery' },
                    { value: 'GoPro POV', label: isAr ? '📹 كاميرا شخصية — منظور الشخص الأول' : '📹 First Person Camera — GoPro POV Style' },
                    { value: 'Drone Aerial', label: isAr ? '🚁 تصوير جوي — مشاهد بانورامية من فوق' : '🚁 Aerial Shots — Sweeping Panoramic Views' },
                    { value: 'Mixed Reality (Realism + 3D)', label: isAr ? '🔮 واقع مختلط — دمج الحقيقي مع الخيالي' : '🔮 Mixed Reality — Real + Fantasy Fusion' },
                ]
            },
            {
                group: isAr ? '🏰 3D ورسوم متحركة' : '🏰 3D & Animation', items: [
                    { value: 'Disney Pixar 3D', label: isAr ? '🏰 ديزني بيكسار 3D — عالم ملون وشخصيات معبّرة' : '🏰 Disney Pixar 3D — Colorful World & Expressive Characters' },
                    { value: '3D Cute Character (Pixar Style)', label: isAr ? '🧸 شخصية 3D لطيفة — ألوان حلوة وملمس ناعم' : '🧸 3D Cute Character — Sweet Colors & Smooth Feel' },
                    { value: 'Soft 3D / C4D Render', label: isAr ? '🫧 3D ناعم — ألوان حلوة وملمس بلاستيكي لامع' : '🫧 Soft 3D — Sweet Colors & Glossy Plastic Look' },
                    { value: 'Claymation / Stop Motion', label: isAr ? '🎨 صلصال متحرك — ملمس محسوس وحركة يدوية' : '🎨 Claymation — Tactile Clay Feel & Handmade Motion' },
                    { value: 'Isometric 3D', label: isAr ? '📐 عالم مصغر 3D — منظور من فوق بزاوية ثابتة' : '📐 Isometric 3D — Mini World, Fixed Top-Down View' },
                    { value: 'Hyper-Casual Game Art', label: isAr ? '🎮 رسومات ألعاب — بسيطة وجذابة ومرحة' : '🎮 Game Art — Simple, Catchy & Playful' },
                ]
            },
            {
                group: isAr ? '🎌 أنمي ورسم يدوي' : '🎌 Anime & Hand-Drawn', items: [
                    { value: 'Anime (Ufotable/KyoAni)', label: isAr ? '🎌 أنمي ياباني — أكشن ملون وحركة سريعة' : '🎌 Japanese Anime — Colorful Action & Fluid Motion' },
                    { value: 'Studio Ghibli', label: isAr ? '🌿 ستوديو جيبلي — رسم يدوي حالم ودافئ' : '🌿 Studio Ghibli — Warm, Dreamy & Hand-Painted' },
                    { value: 'Watercolor / Hand-Painted', label: isAr ? '🖌️ ألوان مائية — رسم يدوي فني وشفاف' : '🖌️ Watercolor — Hand-Painted & Translucent Art' },
                    { value: 'Pop Art / Comic', label: isAr ? '💥 بوب آرت / كوميك — ألوان صارخة وطابع مجلات' : '💥 Pop Art / Comic — Bold Colors & Magazine Style' },
                ]
            },
            {
                group: isAr ? '🌆 عوالم وأجواء خيالية' : '🌆 Fantasy Worlds & Vibes', items: [
                    { value: 'Cyberpunk / Neon Noir', label: isAr ? '🌃 سايبربانك — أضواء نيون في مدينة مظلمة' : '🌃 Cyberpunk — Neon Lights in a Dark City' },
                    { value: 'Dark Fantasy / Gothic', label: isAr ? '🏚️ فانتازيا مظلمة — عالم قوطي غامض ومرعب' : '🏚️ Dark Fantasy — Gothic, Eerie & Mysterious' },
                    { value: 'Steampunk', label: isAr ? '⚙️ ستيمبانك — تروس نحاسية وعالم بخاري قديم' : '⚙️ Steampunk — Brass Gears & Victorian Steam World' },
                    { value: 'Surreal / Dreamcore', label: isAr ? '🌀 سريالي حُلمي — عوالم مستحيلة وغريبة' : '🌀 Surreal / Dreamcore — Impossible & Strange Worlds' },
                ]
            },
            {
                group: isAr ? '🎨 أنماط فنية خاصة' : '🎨 Special Art Styles', items: [
                    { value: 'Vaporwave / Retrowave', label: isAr ? '🌸 أجواء التسعينات — ألوان باستيل ونوستالجيا' : '🌸 90s Vibes — Pastel Colors & Nostalgia' },
                    { value: 'Retro 80s / Synthwave', label: isAr ? '🕹️ ريترو الثمانينات — نيون بنفسجي وغروب' : '🕹️ Retro 80s — Purple Neon & Sunset Grids' },
                    { value: 'Lo-Fi Aesthetic', label: isAr ? '🌙 لو-فاي — هادئ ودافئ ومريح' : '🌙 Lo-Fi — Calm, Warm & Cozy' },
                    { value: 'Glitch Art / Datamosh', label: isAr ? '📡 جليتش آرت — تشويش رقمي وخلل بصري' : '📡 Glitch Art — Digital Distortion & Visual Chaos' },
                    { value: 'Minimalist / Flat', label: isAr ? '⬜ مينيماليست — بساطة أنيقة وألوان محدودة' : '⬜ Minimalist / Flat — Elegant Simplicity' },
                ]
            },

        ],

        // ═══════════════════════════════════════════════════════════
        // 🎬 GENRES — Content DNA Library
        // ═══════════════════════════════════════════════════════════
        genres: [
            { value: '', label: isAr ? '✨ تحديد تلقائي (دع المحرك يقرر)' : '✨ Auto-Detect (Let Engine Decide)' },
            {
                group: isAr ? '📚 تعليمي ومعلوماتي' : '📚 Educational & Informational', items: [
                    { value: 'Tutorial / How-To', label: isAr ? '📚 تعليمي — شرح وحيل ونصائح عملية' : '📚 Tutorial — Tips, Hacks & How-To' },
                    { value: 'Medical / Health', label: isAr ? '🩺 طبي — فوائد وأضرار وحقائق صحية' : '🩺 Medical — Health Facts & Myths' },
                    { value: 'Science Explainer', label: isAr ? '🔬 علمي — تبسيط العلوم بصريًا' : '🔬 Science — Visual Science Explainer' },
                    { value: 'Documentary', label: isAr ? '🔍 وثائقي — حقائق تاريخية ومخفية' : '🔍 Documentary — History & Hidden Facts' },
                    { value: 'Psychology / Self-Help', label: isAr ? '🧠 نفسي / تطوير ذات — فهم النفس والتغيير' : '🧠 Psychology — Self-Understanding & Growth' },
                ]
            },
            {
                group: isAr ? '🎭 ترفيهي' : '🎭 Entertainment', items: [
                    { value: 'Comedy (Sketch/Sarcasm)', label: isAr ? '😂 كوميدي — سكتشات ساخرة وضحك' : '😂 Comedy — Sketches & Sarcasm' },
                    { value: 'Drama / Emotional', label: isAr ? '🎭 درامي عاطفي — قصص تلمس القلب' : '🎭 Drama — Heart-Touching Stories' },
                    { value: 'Horror (Psychological)', label: isAr ? '👻 رعب نفسي — خوف بدون دم، رعب بالأجواء' : '👻 Psychological Horror — Atmosphere of Dread' },
                    { value: 'Sci-Fi / Futuristic', label: isAr ? '🚀 خيال علمي — مستقبل وتكنولوجيا وفضاء' : '🚀 Sci-Fi — Future, Tech & Space' },
                    { value: 'Fantasy / Epic', label: isAr ? '⚔️ فانتازيا ملحمية — سحر ومعارك وعوالم' : '⚔️ Fantasy / Epic — Magic, Battles & Realms' },
                    { value: 'Action / Thriller', label: isAr ? '💥 أكشن وإثارة — سرعة وتشويق وخطر' : '💥 Action / Thriller — Speed, Tension & Danger' },
                    { value: 'Romance / Love Story', label: isAr ? '💕 رومانسي — قصة حب مؤثرة' : '💕 Romance — Touching Love Story' },
                    { value: 'Mystery / True Crime', label: isAr ? '🕵️ غموض وجرائم — ألغاز وتحقيقات' : '🕵️ Mystery / True Crime — Puzzles & Investigations' },
                ]
            },
            {
                group: isAr ? '📱 سوشيال ميديا' : '📱 Social Media & Viral', items: [
                    { value: 'Viral / Social Media', label: isAr ? '📱 سوشيال ميديا — ترند وريأكشن وانتشار' : '📱 Social Media — Trends, Reactions & Virality' },
                    { value: 'Story Time', label: isAr ? '📖 حكاية — سرد قصة شخصية مشوقة' : '📖 Story Time — Gripping Personal Narrative' },
                ]
            },
            {
                group: isAr ? '💼 تسويقي' : '💼 Commercial & Marketing', items: [
                    { value: 'Commercial / Marketing', label: isAr ? '💼 تسويقي — إعلان وعرض منتج بإبداع' : '💼 Marketing — Creative Ads & Product Showcase' },
                ]
            },
            {
                group: isAr ? '🌿 أسلوب حياة' : '🌿 Lifestyle', items: [
                    { value: 'Cooking / Recipe', label: isAr ? '🍳 طبخ — وصفات وأسرار المطبخ' : '🍳 Cooking — Recipes & Kitchen Secrets' },
                    { value: 'Motivational / Inspirational', label: isAr ? '🔥 تحفيزي — طاقة إيجابية وإلهام' : '🔥 Motivational — Positive Energy & Inspiration' },
                    { value: 'Kids / Family', label: isAr ? '👨‍👩‍👧 أطفال وعائلة — محتوى آمن وممتع' : '👨‍👩‍👧 Kids / Family — Safe & Fun Content' },
                    { value: 'Sports / Fitness', label: isAr ? '🏋️ رياضة ولياقة — تحديات وتمارين' : '🏋️ Sports / Fitness — Challenges & Workouts' },
                ]
            },
            {
                group: isAr ? '🕌 محتوى متخصص' : '🕌 Specialized Content', items: [
                    { value: 'Islamic / Religious', label: isAr ? '🕌 ديني / إسلامي — قصص وحكم ومواعظ' : '🕌 Islamic / Religious — Stories & Wisdom' },
                    { value: 'Finance / Business', label: isAr ? '💰 مالي / بيزنس — استثمار وريادة أعمال' : '💰 Finance / Business — Investment & Entrepreneurship' },
                    { value: 'News / Analysis', label: isAr ? '📰 أخبار وتحليل — إيه اللي حصل وليه' : '📰 News / Analysis — What Happened & Why' },
                ]
            },
        ],

        // ═══════════════════════════════════════════════════════════
        // 🎙️ VOICE TONES — Professional Vocal Palette (Grouped)
        // ═══════════════════════════════════════════════════════════
        voiceTones: [
            {
                group: isAr ? '🎬 احترافي وسينمائي' : '🎬 Professional & Cinematic', items: [
                    { value: 'Professional / Authoritative', label: isAr ? '👔 احترافي وموثوق — صوت الخبير' : '👔 Professional — The Expert Voice' },
                    { value: 'Deep / Cinematic', label: isAr ? '🎙️ عميق سينمائي — صوت الأفلام الوثائقية' : '🎙️ Deep Cinematic — Documentary Voice' },
                    { value: 'Narrator / Epic', label: isAr ? '🎬 راوي ملحمي — صوت الأفلام الكبرى' : '🎬 Epic Narrator — Blockbuster Movie Voice' },
                    { value: 'Confident / Motivational', label: isAr ? '🔥 واثق وتحفيزي — صوت القائد الملهم' : '🔥 Confident — The Inspiring Leader Voice' },
                ]
            },
            {
                group: isAr ? '🎭 تعبيري وعاطفي' : '🎭 Expressive & Emotional', items: [
                    { value: 'Dramatic / Theatrical', label: isAr ? '🎭 درامي مسرحي — انفعالات قوية ومبالغة فنية' : '🎭 Dramatic / Theatrical — Powerful Emotions' },
                    { value: 'Sad / Emotional', label: isAr ? '😢 حزين وعاطفي — صوت يلمس القلب' : '😢 Sad / Emotional — Heart-Touching Voice' },
                    { value: 'Angry / Aggressive', label: isAr ? '😤 غاضب وحاد — صوت قوي ومنفعل' : '😤 Angry / Aggressive — Intense & Fierce' },
                    { value: 'Mysterious / Suspenseful', label: isAr ? '🌙 غامض ومشوّق — صوت يبني التوتر' : '🌙 Mysterious — Builds Tension & Suspense' },
                ]
            },
            {
                group: isAr ? '😊 شخصي وأسلوبي' : '😊 Character & Stylized', items: [
                    { value: 'Cheerful / Upbeat', label: isAr ? '😊 مرح ومتفائل — طاقة إيجابية معدية' : '😊 Cheerful — Infectious Positive Energy' },
                    { value: 'Energetic / Hype', label: isAr ? '⚡ حماسي ونشيط — طاقة عالية مشتعلة' : '⚡ Energetic / Hype — High-Octane Energy' },
                    { value: 'Sarcastic / Witty', label: isAr ? '😏 ساخر وذكي — كوميديا سوداء وتعليقات لاذعة' : '😏 Sarcastic / Witty — Dark Humor & Sharp Remarks' },
                    { value: 'Childish / Cute', label: isAr ? '🧒 طفولي ولطيف — صوت بريء وظريف' : '🧒 Childish / Cute — Innocent & Adorable' },
                    { value: 'Robotic / AI', label: isAr ? '🤖 آلي / ذكاء اصطناعي — صوت رقمي مستقبلي' : '🤖 Robotic / AI — Digital Futuristic Voice' },
                ]
            },
            {
                group: isAr ? '🧘 هادئ وحميمي' : '🧘 Calm & Intimate', items: [
                    { value: 'Warm / Storyteller', label: isAr ? '📖 دافئ وحكّاء — صوت الجد أو ستّي' : '📖 Warm Storyteller — Grandpa/Grandma Voice' },
                    { value: 'Whispering / ASMR', label: isAr ? '🤫 همس ASMR — صوت هادئ يريح الأعصاب' : '🤫 Whispering / ASMR — Calm & Soothing' },
                    { value: 'Calm / Meditative', label: isAr ? '🧘 هادئ وتأملي — صوت السكينة والاسترخاء' : '🧘 Calm / Meditative — Peace & Relaxation' },
                ]
            },
        ],

        // ═══════════════════════════════════════════════════════════
        // 🌍 DIALOGUE LANGUAGES — World Dialect Library (Grouped)
        // ═══════════════════════════════════════════════════════════
        videoLanguages: [
            {
                group: isAr ? '🌍 اللهجات العربية' : '🌍 Arabic Dialects', items: [
                    { value: 'Egyptian (Masri)', label: isAr ? '🇪🇬 مصري — عامية القاهرة، ساخر وشعبي' : '🇪🇬 Egyptian (Masri) — Cairo Dialect, Witty & Street' },
                    { value: 'Saudi (Khaleeji)', label: isAr ? '🇸🇦 سعودي خليجي — لهجة نجدية/حجازية' : '🇸🇦 Saudi (Khaleeji) — Najdi/Hijazi Dialect' },
                    { value: 'Levantine (Shami)', label: isAr ? '🇱🇧 شامي — لبناني/سوري، ناعم وأنيق' : '🇱🇧 Levantine — Lebanese/Syrian, Smooth & Elegant' },
                    { value: 'Maghrebi (Darija)', label: isAr ? '🇲🇦 مغربي دارجة — مزيج عربي فرنسي فريد' : '🇲🇦 Maghrebi (Darija) — Unique Arabic-French Blend' },
                    { value: 'Iraqi (Mesopotamian)', label: isAr ? '🇮🇶 عراقي — لهجة بغدادية قوية وأصيلة' : '🇮🇶 Iraqi — Strong & Authentic Baghdadi' },
                    { value: 'Sudanese', label: isAr ? '🇸🇩 سوداني — لهجة دافئة ومميزة' : '🇸🇩 Sudanese — Warm & Distinctive Dialect' },
                    { value: 'MSA (Fusha)', label: isAr ? '📜 فصحى — العربية الفصيحة الرسمية' : '📜 MSA (Fusha) — Formal Classical Arabic' },
                ]
            },
            {
                group: isAr ? '🌐 اللغات العالمية' : '🌐 International Languages', items: [
                    { value: 'English (American)', label: isAr ? '🇺🇸 إنجليزي أمريكي — عصري ومباشر' : '🇺🇸 English (American) — Modern & Direct' },
                    { value: 'English (British)', label: isAr ? '🇬🇧 إنجليزي بريطاني — كلاسيكي وأنيق' : '🇬🇧 English (British) — Classic & Elegant' },
                    { value: 'French', label: isAr ? '🇫🇷 فرنسي — راقي وفني' : '🇫🇷 French — Refined & Artistic' },
                    { value: 'Spanish', label: isAr ? '🇪🇸 إسباني — حيوي وعاطفي' : '🇪🇸 Spanish — Vibrant & Passionate' },
                ]
            },
        ],

        // ═══════════════════════════════════════════════════════════
        // 🔢 COUNTS & RATIOS
        // ═══════════════════════════════════════════════════════════
        characterCounts: [
            { value: '1', label: '١' },
            { value: '2', label: '٢' },
            { value: '3', label: '٣' },
            { value: '4', label: '٤' },
            { value: '5+', label: isAr ? '٥+' : '5+' },
        ].map(o => isAr ? o : { value: o.value, label: o.value === '5+' ? '5+' : o.value }),
        durations: [
            { value: '5 seconds', label: isAr ? '٥ ثواني (ريلز سريع)' : '5s (Quick Reel)' },
            { value: '6 seconds', label: isAr ? '٦ ثواني' : '6s' },
            { value: '8 seconds', label: isAr ? '٨ ثواني' : '8s' },
            { value: '10 seconds', label: isAr ? '١٠ ثواني (قياسي)' : '10s (Standard)' },
            { value: '12 seconds', label: isAr ? '١٢ ثانية' : '12s' },
            { value: '15 seconds', label: isAr ? '١٥ ثانية (سينمائي)' : '15s (Cinematic)' },
        ],
        aspectRatios: [
            { value: '16:9', label: isAr ? '١٦:٩ عريض (يوتيوب)' : '16:9 (YouTube)' },
            { value: '9:16', label: isAr ? '٩:١٦ طولي (تيك توك/ريلز)' : '9:16 (TikTok/Reels)' },
            { value: '1:1', label: isAr ? '١:١ مربع (انستاجرام)' : '1:1 (Instagram)' },
            { value: '4:5', label: isAr ? '٤:٥ بورتريه' : '4:5 (Portrait)' },
        ],

        // ═══════════════════════════════════════════════════════════
        // 🧑 CHARACTER TYPES — Archetypes Per Visual Style
        // ═══════════════════════════════════════════════════════════
        characterTypes: [
            { value: '', label: isAr ? '✨ تحديد تلقائي (دع المحرك يقرر)' : '✨ Auto-Detect (Let Engine Decide)' },
            {
                group: isAr ? '🏰 3D وكارتون' : '🏰 3D & Cartoon', items: [
                    { value: 'cartoon_human', label: isAr ? '👤 شخصية كارتونية بشرية — عيون كبيرة ومعبرة' : '👤 Cartoon Human — Big Expressive Eyes' },
                    { value: 'talking_food', label: isAr ? '🍔 طعام يتكلم — خضار وفواكه وأكلات حية' : '🍔 Talking Food — Living Fruits & Veggies' },
                    { value: 'body_parts', label: isAr ? '🧠 أعضاء الجسم — مخ/قلب/معدة بشخصيات' : '🧠 Body Parts — Brain/Heart/Stomach Characters' },
                    { value: 'objects', label: isAr ? '📱 جماد يتحدث — أدوات وأجهزة بمشاعر' : '📱 Talking Objects — Devices with Emotions' },
                    { value: 'animals', label: isAr ? '🐻 حيوانات ظريفة — فرو ناعم وحركات لطيفة' : '🐻 Cute Animals — Soft Fur & Adorable Moves' },
                    { value: 'tiny_robot', label: isAr ? '🤖 روبوت صغير / أداة — مساعد آلي لطيف' : '🤖 Tiny Robot / Gadget — Cute Helper Bot' },
                    { value: 'monster_cute', label: isAr ? '👾 وحش لطيف / كائن فضائي — غريب ومحبوب' : '👾 Cute Monster / Alien — Weird but Lovable' },
                    { value: 'mythical', label: isAr ? '🐉 كائن أسطوري — تنين/يونيكورن/عنقاء صغير' : '🐉 Mythical Creature — Baby Dragon/Unicorn' },
                ]
            },
            {
                group: isAr ? '🎥 سينمائي وواقعي' : '🎥 Cinematic & Realistic', items: [
                    { value: 'real_human', label: isAr ? '👤 إنسان حقيقي — واقعية مفرطة (Hyper-Real)' : '👤 Real Human — Hyper-Realistic' },
                    { value: 'historical', label: isAr ? '👑 شخصية تاريخية — ملك/عالم/قائد من التاريخ' : '👑 Historical Figure — King/Scholar/Leader' },
                    { value: 'shadow', label: isAr ? '👤 شبح / شخصية غامضة — هوية مجهولة' : '👤 Shadow / Mystery — Unknown Identity' },
                    { value: 'scientist', label: isAr ? '🧬 عالم / طبيب — معطف أبيض وتجارب' : '🧬 Scientist / Doctor — Lab Coat & Experiments' },
                ]
            },
            {
                group: isAr ? '🎙️ أنماط خاصة' : '🎙️ Special Types', items: [
                    { value: 'narrator', label: isAr ? '🎙️ راوي — صوت فقط بدون ظهور مرئي' : '🎙️ Narrator — Voice Only, No Visual' },
                    { value: 'ai_assistant', label: isAr ? '🧠 مساعد ذكاء اصطناعي — صوت رقمي ذكي' : '🧠 AI Voice Assistant — Smart Digital Voice' },
                    { value: 'split_personality', label: isAr ? '🎭 شخصية مزدوجة — صوتين متناقضين' : '🎭 Split Personality — Two Opposing Voices' },
                ]
            },
            {
                group: isAr ? '🫧 كائنات شفافة — تريند' : '🫧 Transparent Creatures — TREND', items: [
                    { value: 'transparent_creature', label: isAr ? '🫧 كائن شفاف حي — جسم شفاف بأعضاء داخلية مرئية (النوع يتحدد تلقائياً)' : '🫧 Transparent Creature — See-Through Body with Visible Organs (Type Auto-Selected)' },
                ]
            },
        ],
    };
};
