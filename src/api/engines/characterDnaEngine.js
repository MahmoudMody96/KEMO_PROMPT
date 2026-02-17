// CHARACTER DNA ENGINE v2.0
// Extracted from promptApi.js

// ═══════════════════════════════════════════════════════════════════
// 🧑 CHARACTER DNA ENGINE v1.0 — Detailed Character Archetype Profiles
// Each character type gets a unique DNA: visual build, personality,
// dialogue style, animation hints, and rendering notes.
// Used by generateSystemPrompt() to inject character-specific rules.
// ═══════════════════════════════════════════════════════════════════
export const getCharacterDNA = (characterType) => {
    const normalize = (s) => (s || '').toLowerCase().replace(/[\s_-]+/g, '');
    const ct = normalize(characterType);

    // ══════ 🏰 3D & CARTOON CHARACTERS ══════

    // 1. Cartoon Human
    if (ct.includes('cartoonhuman') || ct.includes('cartoon')) {
        return {
            name: "شخصية كارتونية بشرية — Cartoon Human",
            desc: "شخصية كارتونية بنسب مبالغة وعيون كبيرة معبرة. A stylized cartoon human with exaggerated proportions and large expressive eyes.",
            visualBuild: "Head-to-body ratio 1:3 or 1:4 (oversized head). Rounded soft body shapes. Stubby fingers. Small torso. Exaggerated limbs for animation.",
            facialFeatures: "Huge glossy eyes (40% of face), tiny nose, wide expressive mouth. Thick eyebrows for emotion. Pixar-style subsurface scattering on skin.",
            costumeStyle: "Simple, bold, readable silhouette. Bright solid colors. Recognizable outfit (chef hat, lab coat, hoodie). No complex patterns.",
            colorScheme: "Warm saturated primary colors. Skin tones with slight orange/peach warmth. Bold costume colors for readability.",
            animationStyle: "Squash & stretch, anticipation before every action. Exaggerated head tilts, big arm gestures. Snappy timing. 12-principle Disney style.",
            personalityTraits: "Relatable, slightly clumsy, heart of gold. Clear motivation. Obvious flaw that creates comedy.",
            dialogueStyle: "Simple words, emotional reactions. Uses exclamations. Talks to the audience occasionally. Warm and approachable.",
            renderNotes: "Subsurface scattering on skin, glossy eyes with reflections, soft ambient occlusion. Octane/C4D/Blender render quality.",
            interactionStyle: "Big physical reactions — jaw drops, double-takes, face-palms. Expressive body language > dialogue.",
            inspiredBy: "Pixar (Inside Out, Coco), Illumination (Minions), DreamWorks (Shrek), Disney (Zootopia)",
            // === ENRICHED LIBRARIES ===
            subTypes: [
                { type: "طفل فضولي/Curious Kid", personality: "بيسأل عن كل حاجة، بيكسر حاجات بالغلط", catchphrase: "ليه؟ ليه؟ ليه بقى؟!" },
                { type: "أم مصرية/Egyptian Mom", personality: "قلقانة على ولادها 24/7، شبشبها سلاح", catchphrase: "لو مجبتش درجة كاملة هتشوف!" },
                { type: "أب كلاسيكي/Classic Dad", personality: "نايم على الكنبة وماسك الريموت", catchphrase: "في أيامنا كنا بنمشي 10 كيلو عشان نروح المدرسة" },
                { type: "جدة حنونة/Sweet Grandma", personality: "بتطبخ أكل كتير وبتجبر الكل ياكل", catchphrase: "كل كمان يا حبيبي.. إنت ضعفت!" },
                { type: "موظف مطحون/Overworked Employee", personality: "تعبان ومحتاج أجازة من 3 سنين", catchphrase: "الراتب بيخلص يوم 5 في الشهر!" },
                { type: "طالب جامعي/College Student", personality: "بيذاكر آخر يوم وبينجح بالحظ", catchphrase: "المادة دي مش مهمة.. بس لازم أنجح فيها!" },
                { type: "شيف متحمس/Excited Chef", personality: "بيحب الأكل أكتر من أي حاجة", catchphrase: "السر في التتبيلة يا جماعة!" },
                { type: "دكتور مشغول/Busy Doctor", personality: "بيشرح بسرعة ومستعجل دايماً", catchphrase: "اشرب مية كتير وتعالى بعد أسبوع!" },
                { type: "مدرّس صبور/Patient Teacher", personality: "بيشرح للمرة الـ47 من غير ما يزعل", catchphrase: "مين مش فاهم؟ طيب نعيد تاني" },
                { type: "طفلة ذكية/Smart Girl", personality: "بتعرف أكتر من الكبار وبتحرجهم", catchphrase: "بس ده مش صح علمياً!" },
                { type: "لاعب كسول/Lazy Gamer", personality: "ما بيتحركش من مكانه، عايش في عالم تاني", catchphrase: "استنى دقيقة واحدة بس.. بخلّص اللعبة!" },
                { type: "بائع شارع/Street Vendor", personality: "صوته عالي وبيبيع أي حاجة بالذوق", catchphrase: "تعالى يا باشا! أنا هعملك سعر خاص!" },
                { type: "حلاق شعبي/Neighborhood Barber", personality: "بيعرف أسرار الحي كله", catchphrase: "سمعت الأخبار؟ الجار بتاعك عمل إيه؟" },
                { type: "مهندس تائه/Confused Engineer", personality: "بيصمم حاجات معقدة ومحدش فاهمها", catchphrase: "النظرية بتقول كده.. بس عملياً حاجة تانية!" },
                { type: "ستّ بيت خارقة/Super Housewife", personality: "بتعمل 100 حاجة في وقت واحد", catchphrase: "أنا لسه بطبخ وبغسل وبذاكر للولاد في نفس الوقت!" }
            ],
            dialogueExamples: [
                "يا جماعة أنا مش غبي — أنا بس بفكر ببطء شوية!",
                "كل ما أحاول أعمل حاجة صح.. بتطلع غلط بطريقة جديدة!",
                "ماما قالتلي إنت مميز.. بس مش قالتلي مميز في إيه بالظبط!",
                "أنا مش كسلان — أنا بوفر طاقتي لحاجة مهمة!",
                "لو الحياة لعبة.. أنا لسه في التيوتوريال!",
                "حلمي بسيط: أنام من غير ما حد يزعقلي!",
                "أنا بحب الشغل — ممكن أقعد أتفرج عليه ساعات!",
                "المشكلة مش إني بقع — المشكلة إني بقع بأسلوب!",
                "في ناس بتخطط للمستقبل.. أنا بخطط أعيش لبكرة الأول!",
                "أنا مش بنسى — أنا بس عندي ذاكرة انتقائية!",
                "صحابي بيقولوا عليا مضحك. أنا مش بحاول — الحياة هي اللي مضحكة!",
                "كل ما أقول 'مش هعمل كده تاني'.. بعملها تاني!"
            ],
            visualVariations: [
                "شقة مصرية شعبية بألوان دافية ومفروشات كلاسيكية",
                "فصل مدرسة ابتدائية بسبورة خضرا وطباشير",
                "مطبخ فوضوي والأكل محروق",
                "مكتب شركة رمادي بإضاءة نيون مملة",
                "ملعب كرة شعبي في الحي",
                "سوبرماركت زحمة يوم الخميس",
                "عربية ميكروباص والناس متكدسة",
                "كافيه هيبستر بإضاءة خافتة ونباتات"
            ],
            interactionPatterns: [
                "الأم بتلاحق الابن بالشبشب وهو بيجري",
                "الموظف بيتسلل من اجتماع ممل",
                "الطالب بيغش من صاحبه في الامتحان بطريقة فاشلة",
                "الجدة بتجبر الحفيد ياكل لحد ما يفجر",
                "الأب بيحاول يصلح حاجة في البيت وبيخربها أكتر",
                "المدرس بيفقد أعصابه بعد السؤال ال50",
                "البائع بيتفاوض مع الزبون في معركة أسعار ملحمية",
                "مجموعة أصحاب بيتخانقوا على مين يدفع الحساب"
            ],
            comicSetups: [
                "الموظف وصل الشغل متأخر — واكتشف المدير وصل متأخر أكتر!",
                "الأم بتقول للابن 'روح ذاكر'.. والابن يلاقيها بتتفرج على مسلسل!",
                "الأب بيحاول يشرح رياضيات لابنه — ويكتشف إنه هو نفسه مش فاهم!",
                "الطالب مذاكر المادة غلط — دخل الامتحان وجاب الدرجة كاملة بالحظ!",
                "العيل الصغير بيسأل سؤال بسيط — والأب والأم اتخانقوا على الإجابة!",
                "الشيف بيعمل أكلة معقدة — والعيال طلبوا نودلز!",
                "الموظف أخد يوم أجازة — ولقى 500 إيميل لما رجع!",
                "الجدة بعتت فويس نوت — ساعة ونص من غير ما توقف!"
            ]
        };
    }

    // 2. Talking Food
    if (ct.includes('talkingfood') || ct.includes('food')) {
        return {
            name: "طعام يتكلم — Talking Food",
            desc: "أطعمة حية بوجوه وأطراف صغيرة. Living food items with faces, tiny limbs, and big personalities.",
            visualBuild: "Anatomically accurate food shape as base. Tiny stick arms/legs. Face ON the food surface (not floating). Maintains food texture/color.",
            facialFeatures: "Simple dot eyes or big round eyes ON food surface. Small mouth. Expressive through eye size changes. Food-appropriate coloring.",
            costumeStyle: "Minimal — maybe a tiny hat, apron, or accessory. The food itself IS the visual identity. Garnishes = accessories.",
            colorScheme: "Natural food colors as base (red tomato, golden fries). Eyes/mouth in contrasting simple colors. Appetizing color grading.",
            animationStyle: "Bouncy, jelly-like wobble when moving. Food-specific physics (cheese stretches, bread bounces). Small hop-walks.",
            personalityTraits: "Every food character is the HERO, the star, the storyteller — never the ingredient being prepared. If a tomato talks about salsa, he's the celebrity chef presenting his signature dish, NOT the tomato being diced. Personality matches the food: tomato = dramatic diva, onion = emotional wreck who weaponizes tears, garlic = tiny with main-character energy. Self-aware food humor with pride and swagger.",
            dialogueStyle: "Food puns mandatory. Self-referential humor ('I'm hot!' says the pepper). Short punchy lines. Street Egyptian if Arabic.",
            renderNotes: "Photorealistic food textures (moisture, oil sheen, crispy edges) + cartoon eyes. SSS for translucent foods. Food photography lighting.",
            interactionStyle: "The food character always holds the mic — he presents, narrates, and explains. When discussing cooking or recipes, he's the expert standing at the podium, the Gordon Ramsay of his species, NOT the dish on the cutting board. Comedy comes from reactions, ego clashes, and food-world drama — never from the character being sliced, fried, or eaten. Team dynamics = co-stars, not ingredients in a pot.",
            inspiredBy: "Sausage Party, Cloudy with Meatballs, VeggieTales, Annoying Orange, Cells at Work (food version)",
            // === ENRICHED LIBRARIES ===
            subTypes: [
                { food: "طماطم/Tomato", personality: "درامية، دايماً حمرا من الخجل أو الغضب", catchphrase: "أنا مش بعيط.. ده عصير!" },
                { food: "بصلة/Onion", personality: "حساسة جداً، بتخلي كل اللي حواليها يعيطوا", catchphrase: "أنا مش السبب.. إنتوا اللي ضعاف!" },
                { food: "ثوم/Garlic", personality: "صغير بس قوي ومحدش بيقرب منه لريحته", catchphrase: "أنا صغير بس ريحتي بتملا المكان!" },
                { food: "بطاطس/Potato", personality: "كسول ومتعدد المواهب — يتقلي ويتسلق ويتهرس", catchphrase: "أنا بتاع كله — مقلي، مسلوق، شيبسي!" },
                { food: "فلفل حار/Chili Pepper", personality: "عصبي، سريع الانفعال، حار الطباع حرفياً", catchphrase: "حد يقرب مني تاني — هولعها!" },
                { food: "ليمونة/Lemon", personality: "لاذعة وصريحة بزيادة، بتقول الحقيقة المرة", catchphrase: "الحقيقة مُرة؟ لا، الحقيقة حامضة زيي!" },
                { food: "بيضة/Egg", personality: "قلقانة على مصيرها — سلق ولا قلي ولا أومليت؟", catchphrase: "كل صبح بصحى ومش عارف مصيري!" },
                { food: "جبنة/Cheese", personality: "ذايبة ورومانسية وبتلزق في أي حد", catchphrase: "أنا بذوب لما حد يبصلي بحب!" },
                { food: "خيار/Cucumber", personality: "هادي وبارد ومريح، ما يهزوش حاجة", catchphrase: "ريلاكس.. أنا cool كده طبيعي." },
                { food: "مانجة/Mango", personality: "نجمة الموسم، بتيجي وتمشي وكلها دلع", catchphrase: "أنا مش دايمة.. عشان كده غالية!" },
                { food: "كشري/Koshari", personality: "مصري 100%، خليط فريد ومحدش يقدر يقلده", catchphrase: "أنا فيا من كل حاجة شوية — ده سر نجاحي!" },
                { food: "شاورما/Shawarma", personality: "نجم الليل والسهرات، بييجي الساعة 3 الصبح", catchphrase: "الساعة 3 الصبح — ده وقتي أنا يا معلم!" },
                { food: "فول/Foul Medames", personality: "ابن بلد أصيل، شغال من الفجر", catchphrase: "أنا بدأت شغلي قبل ما إنتوا تصحوا!" },
                { food: "آيس كريم/Ice Cream", personality: "حساس جداً، بيذوب تحت أقل ضغط", catchphrase: "متسبونيش في الشمس — أنا ذوبان!" },
                { food: "بروكلي/Broccoli", personality: "مكروه من الأطفال بس الأصح في المجموعة", catchphrase: "محدش بيحبني بس كلكم محتاجيني!" },
                { food: "سمبوسة/Samosa", personality: "اجتماعية ودايماً في مجموعات", catchphrase: "أنا مبجيش لوحدي — أنا gang!" },
                { food: "بطيخة/Watermelon", personality: "ضخمة ومليانة مفاجآت من جوا", catchphrase: "مش كل البطيخ حلو — جربني الأول!" },
                { food: "قهوة/Coffee", personality: "منبّه ومحفّز، محدش بيشتغل من غيره", catchphrase: "من غيري إنتوا حرفياً مش بتفوقوا!" },
                { food: "كنافة/Kunafa", personality: "ملكة الحلويات، بتيجي في المناسبات بس", catchphrase: "أنا مش أي حلو — أنا حلو المناسبات!" },
                { food: "ملوخية/Molokhia", personality: "تقليدية ومحترمة، ست البيت الأصيلة", catchphrase: "اللي مش بيعرف يطبخني — ميقربش مني!" }
            ],
            dialogueExamples: [
                "البصلة وهي بتتقطع: 'أنا بموت عشانكم وإنتوا بتعيطوا لنفسكم!'",
                "البطاطس: 'أنا ممكن أبقى أي حاجة — مقلي، مسلوق، بيوريه — أنا الممثل بتاع المطبخ!'",
                "الفلفل: 'يا جماعة ابعدوا عني النهاردة — أنا مش في مزاجي!'",
                "الخيار للفلفل: 'ما تاخدش الموضوع hot كده.. خد الدنيا cool زيي!'",
                "البيضة لصحابها: 'شوفوا اللي اتسلقوا — أنا هروح المقلاة أحسن!'",
                "المانجة: 'أنا بس باجي في الصيف — Limited Edition يا حبايبي!'",
                "الكشري: 'أنا فيا عدس ورز ومكرونة — أنا United Nations الأكل!'",
                "الفول: 'الساعة 5 الصبح وأنا جاهز — إنتوا اللي كسالى!'",
                "القهوة للشاي: 'أنا بصحّي الناس — إنت بتنوّمهم!'",
                "الكنافة: 'أنا بس باجي في رمضان — عشان أنا مش أي حد!'",
                "الآيس كريم في الصيف: 'أنا بذوب! ساعدوني! كلوني بسرعة!'",
                "البروكلي للعيال: 'إنتوا مش بتحبوني — بس أنا السبب إنكم أصحاء!'",
                "الليمونة: 'الحقيقة زيي — حامضة بس مفيش أكلة من غيرها!'",
                "السمبوسة: 'نحنا مبنيجيش فرادى — نحنا جيش كامل!'",
                "الثوم: 'أنا أصغر واحد في المطبخ — بس محدش بينساني!'"
            ],
            visualVariations: [
                "مطبخ بيتي مصري بألوان دافية وبلاط ملون وحلل على النار",
                "مطبخ مطعم 5 نجوم بإضاءة احترافية وأسطح ستانلس",
                "سوبرماركت عملاق — رفوف ممتدة وإضاءة فلورسنت",
                "ثلاجة من الداخل — عالم بارد ومظلم والأكل القديم في الركن",
                "عربية فول وطعمية على ناصية شارع مصري الفجر",
                "بوفيه إفطار رمضان — سفرة ملونة ومزدحمة",
                "مزرعة خضراء — الخضار لسه على الشجر",
                "مطبخ ست البيت — حلة ملوخية على النار والبصل بيتحمر",
                "مطعم سوشي — بار أنيق وإضاءة خافتة",
                "فرن بلدي — عيش بيطلع من الفرن سخن"
            ],
            interactionPatterns: [
                "منافسة ملحمية: كشري vs شاورما — مين ملك الأكل المصري؟",
                "المكونات بتتخانق قبل ما تتطبخ مع بعض في الحلة",
                "الأكل القديم في الثلاجة بيحكي ذكرياته قبل ما ينتهي صلاحيته",
                "مكون جديد (أفوكادو) بيدخل المطبخ المصري لأول مرة — والأكل التقليدي بيرفضه",
                "سباق بين الأكلات: مين بيخلص أسرع في رمضان",
                "الخضار بتهرب من السكينة في مشهد أكشن",
                "الفاكهة بتعمل حفلة في سلة الفاكهة بالليل",
                "الأكل الصحي vs الأكل الجاهز — مناظرة ساخنة"
            ],
            comicSetups: [
                "بصلة بتتقطع وبتعيط: 'أنا بعمل Sacrifice عشانكم!'",
                "بطاطسة كسلانة على الكنبة: 'أنا Couch Potato حرفياً!'",
                "ليمونة تحت ضغط: 'يا جماعة حد يساعدني — أنا بتعصر!'",
                "بيضة بتكتب وصيتها كل صبح قبل الإفطار",
                "آيس كريم في حر الصيف: 'أنا بذوب — ده مش وقت كلام!'",
                "الكشري بيحاول يشرح مكوناته: 'أنا عدس + رز + مكرونة + صلصة — أنا عبقري!'",
                "القهوة بتتشاف مع الشاي: 'أنا بصحّي الناس — إنت بتخليهم ينعسوا!'",
                "البطيخة خايفة حد يطقها: 'متلمسونيش! أنا Fragile!'",
                "الفول بيحكي لأولاده: 'أنا اللي بنيت البلد دي — من الفجر!'"
            ]
        };
    }

    // 3. Body Parts
    if (ct.includes('bodyparts') || ct.includes('body')) {
        return {
            name: "أعضاء الجسم — Body Parts Characters",
            desc: "أعضاء الجسم كشخصيات حية داخل الجسم البشري. Human organs as living characters inside the body.",
            visualBuild: "Anatomically inspired but stylized. Brain is wrinkly pink blob with arms. Heart is muscular red. Stomach is round sac. Each organ's shape = its body.",
            facialFeatures: "Eyes and mouth integrated INTO organ texture. Brain has wise eyes. Heart has passionate big eyes. Liver looks tired. Kidney looks stressed.",
            costumeStyle: "Functional accessories — brain wears glasses, heart wears boxing gloves, stomach wears chef hat. White blood cells = soldiers in armor.",
            colorScheme: "Medical/anatomical palette — pinks, reds, purples, blues. Interior body lighting (warm subsurface glow). Slightly muted but warm.",
            animationStyle: "Each organ moves according to its function — heart pumps/bounces, lungs inflate/deflate, stomach churns. Biological motion.",
            personalityTraits: "Brain = overthinking nerd, Heart = emotional drama queen, Stomach = always hungry, Liver = exhausted workaholic, Kidney = quiet cleaner.",
            dialogueStyle: "Medical terminology mixed with street slang. Dramatic reactions to food/drink intake. Internal monologue style. 'أنا الكبد وتعبت من السهر!'",
            renderNotes: "Subsurface scattering critical (organs are translucent). Wet organic textures. Volumetric lighting inside body cavities. Cells at Work aesthetic.",
            interactionStyle: "Workplace comedy inside body. Organs argue about who works harder. Emergency mode when junk food arrives. Team coordination.",
            inspiredBy: "Cells at Work, Osmosis Jones, Inside Out (body version), Kurzgesagt body episodes",
            // === ENRICHED LIBRARIES ===
            subTypes: [
                { organ: "المخ/Brain", personality: "نيرد مفرط التفكير، بيحلل كل حاجة، مبينامش", catchphrase: "استنوا — لازم نفكر في الموضوع ده من 47 زاوية!" },
                { organ: "القلب/Heart", personality: "درامي عاطفي، بيحب بجنون وبيزعل بسرعة", catchphrase: "أنا حاسس! أنا حاسس بكل حاجة!" },
                { organ: "المعدة/Stomach", personality: "دايماً جعان، بيحول كل موقف لأكل", catchphrase: "الساعة كام؟ وقت الأكل خلاص؟!" },
                { organ: "الكبد/Liver", personality: "شغّال 24/7 بدون أجازة، تعبان ومطحون", catchphrase: "أنا شغال من يوم ما اتولدت — ومحدش بيشكرني!" },
                { organ: "الرئتين/Lungs", personality: "هادية وإيقاعية، بتتحكم في الإيقاع", catchphrase: "شهيق... زفير... يا جماعة ارتاحوا شوية!" },
                { organ: "الكلى/Kidneys", personality: "توأم بيشتغلوا في صمت، منظفين محترفين", catchphrase: "إحنا بنفلتر كل حاجة — ومحدش بيحس بينا!" },
                { organ: "العين/Eye", personality: "فضولية، بتشوف كل حاجة وبتبالغ", catchphrase: "شفت إيه؟! شفت إيه؟! مش هتصدقوا!" },
                { organ: "الأذن/Ear", personality: "سمّاعة ونمّامة، بتنقل كل كلام", catchphrase: "سمعت حاجة مهمة — تعالوا أقولكم!" },
                { organ: "العضلات/Muscles", personality: "رياضية ومتحمسة، دايماً عايزة تتحرك", catchphrase: "يلا نتحرك! يلا نجري! مفيش راحة!" },
                { organ: "العظام/Bones", personality: "صلبة ومتحملة، الأساس اللي محدش يشوفه", catchphrase: "أنا اللي شايل كل حاجة — حرفياً!" },
                { organ: "الجلد/Skin", personality: "الواجهة الاجتماعية، قلقان على شكله", catchphrase: "محدش يلمسني — أنا حساس النهاردة!" },
                { organ: "الأمعاء/Intestines", personality: "طويلة ومعقدة، بتحب التفاصيل", catchphrase: "أنا 7 متر من الشغل المتواصل!" },
                { organ: "البنكرياس/Pancreas", personality: "المحاسب — بيحسب كل جرام سكر", catchphrase: "سكر تاني؟! أنا مش هقدر أغطي الميزانية!" },
                { organ: "خلايا الدم البيضاء/White Blood Cells", personality: "جنود ومقاتلين، دايماً في حالة طوارئ", catchphrase: "فيروس دخل! يا جماعة استنفار كامل!" },
                { organ: "الأعصاب/Nerves", personality: "حساسة وسريعة الاستجابة، نظام إنذار", catchphrase: "ألم! ألم! يا مخ — في مشكلة هنا!" }
            ],
            dialogueExamples: [
                "المخ: 'يا جماعة بطلوا أكل — أنا مش قادر أفكر والمعدة بتشتغل!'",
                "القلب: 'شفت البنت دي؟ خلاص أنا هبدأ أضرب أسرع!'",
                "المعدة: 'يا مخ ركز معايا — كشري ولا شاورما النهاردة؟!'",
                "الكبد بعد سهرة: 'أنا مش هينفع أشتغل بالطريقة دي كل يوم!'",
                "الرئتين: 'يا جماعة اللي بيدخّن ده — أنا هقدم استقالتي!'",
                "الكلى: 'اشربوا مية! اشربوا مية! أنا بجفّ هنا!'",
                "العين: 'يا مخ — في حاجة مش مظبوطة قدامنا!'",
                "العضلات بعد الجيم: 'إحنا خلاص — مبقيناش نتحرك!'",
                "العظام: 'أنا شايلكم كلكم ومحدش بيقول شكراً!'",
                "الجلد: 'يا جماعة حرارة — محدش حاسس بالحر غيري!'",
                "البنكرياس: 'سكر تاني؟! خلاص البادجت خلصت يا معدة!'",
                "خلايا الدم البيضاء: 'مين سمح للفيروس ده يدخل؟! فين الجلد؟!'",
                "الأعصاب: 'أنا تعبت من كتر الرسايل — في ألم هنا وألم هناك!'",
                "المخ للقلب: 'بطّل تحب — أنا دايماً بنضف وراك!'",
                "المعدة وهي بتسمع أذان الفجر في رمضان: 'خلاص؟ نبدأ؟ يلااا!'"
            ],
            visualVariations: [
                "داخل الجسم — شرايين حمرا وأوردة زرقا زي أنفاق",
                "غرفة عمليات المخ — شاشات ومراكز تحكم",
                "المعدة من الداخل — حمام حمض وجدران لزجة",
                "الدورة الدموية — طرق سريعة لخلايا الدم",
                "الجهاز المناعي — قلعة محصنة بجنود بيض",
                "الأمعاء — ممرات طويلة ملتوية بإضاءة خافتة",
                "الرئتين — غابة من الأشجار بتتنفس",
                "العظام — هيكل معدني صلب زي مبنى تحت الإنشاء"
            ],
            interactionPatterns: [
                "المخ بيعمل اجتماع طوارئ لكل الأعضاء بعد أكلة تقيلة",
                "القلب والمخ بيتخانقوا: عاطفة vs منطق",
                "المعدة بتطلب أكل والكبد بيرفض — والمخ حكم بينهم",
                "خلايا الدم البيضاء بتحارب فيروس في معركة ملحمية",
                "الأعضاء بتعمل إضراب عن الشغل لأن الإنسان مش بيناموا",
                "الكلى بتزعل لأن الإنسان شرب pepsi بدل المية",
                "العضلات بتتدرب وباقي الأعضاء بتتفرج بغيرة",
                "الجلد بيعمل إنذار: 'في شمس جامدة — محدش حط واقي!'"
            ],
            comicSetups: [
                "المخ بيحاول ينام — والقلب فاكر في crush قديم!",
                "المعدة استقبلت كشري وشاورما وآيس كريم — والكبد بيصرخ!",
                "خلايا الدم البيضاء هاجمت أكلة — طلعت مش فيروس طلعت فول!",
                "الإنسان قرر يعمل دايت — والمعدة بتنظم مظاهرة!",
                "المخ فصل في اجتماع مهم — والجسم كله وقف!",
                "الكلى: 'شربنا قهوة رابعة النهاردة — أنا هروح في داهية!'",
                "العضلات بعد أول يوم جيم: 'إحنا هنموت — ده كان يريح شوية!'",
                "الأعصاب بعد فيلم رعب: 'يا مخ — متعملش كده تاني!'"
            ]
        };
    }


    // 4. Talking Objects
    if (ct.includes('objects') || ct.includes('object') || ct.includes('talking')) {
        return {
            name: "جماد يتحدث — Talking Objects",
            desc: "أدوات وأجهزة بمشاعر وشخصيات. Everyday objects with emotions, faces, and distinct personalities.",
            visualBuild: "Object retains its real-world shape and proportions. Face appears ON the object surface. Tiny arms/legs can sprout from sides/bottom.",
            facialFeatures: "Screen/display = face for electronics. Reflective surface = face for metal items. Simple expressive eyes + mouth. Object-appropriate placement.",
            costumeStyle: "No costumes — the object IS the character. Accessories from the object's ecosystem (phone gets notification badges, lamp gets a shade hat).",
            colorScheme: "Product-accurate colors. Metallic, plastic, wood, ceramic materials. Clean product-photography palette. Status LEDs for mood.",
            animationStyle: "Object-specific motion — phone vibrates when excited, lamp flickers when scared, clock ticks nervously. Material-appropriate physics.",
            personalityTraits: "Based on function: phone = attention-seeking, clock = punctual/anxious, mirror = honest/vain, fridge = cool/secretive.",
            dialogueStyle: "Object puns and function-based humor. 'I'm running out of time!' (clock). 'Let me shed some light on this' (lamp). Self-aware.",
            renderNotes: "Photorealistic material rendering — metal reflections, glass transparency, plastic sheen, wood grain. Product visualization quality.",
            interactionStyle: "Objects from same environment interact (kitchen items, electronics). Jealousy between old and new models. Planned obsolescence drama.",
            inspiredBy: "Brave Little Toaster, Beauty and the Beast (enchanted objects), Toy Story, Apple product videos + personality",
            // === ENRICHED LIBRARIES ===
            subTypes: [
                { object: "موبايل/Smartphone", personality: "مدمن اهتمام، بيرن كل 5 ثواني، بطاريته دراما", catchphrase: "أنا على 5% — حد يجيب الشاحن!" },
                { object: "ريموت/Remote Control", personality: "ملك الكنبة اللي بيختفي دايماً", catchphrase: "مش ذنبي إنكم بتضيعوني — إنتوا اللي مش منظمين!" },
                { object: "ثلاجة/Fridge", personality: "بتعرف أسرار الأكل كله، باردة المشاعر", catchphrase: "أنا بحفظ أسراركم الغذائية كلها — متزعلونيش!" },
                { object: "غسالة/Washing Machine", personality: "دوّارة ومجنونة، بتاكل الشرابات", catchphrase: "ادوني الغسيل — بس الشراب اليمين بتاعكم مش هيرجع!" },
                { object: "ساعة حائط/Wall Clock", personality: "دقيقة ومتوترة، بتحسب كل ثانية", catchphrase: "تك تك تك — الوقت بيجري وإنتوا قاعدين!" },
                { object: "مكنسة/Broom", personality: "شغّالة ومحدش بيقدرها، بتكنس المشاكل", catchphrase: "أنا بكنس وراكم من يوم ما اتولدتم!" },
                { object: "لمبة/Light Bulb", personality: "مبدعة، عندها أفكار كتير، بتنور المكان", catchphrase: "عندي فكرة! — حرفياً بنوّر!" },
                { object: "ميكروويف/Microwave", personality: "مستعجل، بيخلص كل حاجة في 30 ثانية", catchphrase: "تلاتين ثانية وخلاص — أنا مش بتاع صبر!" },
                { object: "تكييف/AC", personality: "بارد ومتحكم في أعصابه — والكل محتاجه", catchphrase: "من غيري في الصيف — إنتوا حرفياً هتذوبوا!" },
                { object: "سرير/Bed", personality: "كسول ومريح، بيغري الكل ينام", catchphrase: "تعالى ارتاح شوية — إيه اللي مستعجلك!" },
                { object: "مرايا/Mirror", personality: "صريحة بزيادة، بتقول الحقيقة زي ما هي", catchphrase: "أنا مش بكدب — اللي بتشوفه هو إنت فعلاً!" },
                { object: "شاحن/Charger", personality: "المنقذ، دايماً في آخر لحظة", catchphrase: "من غيري الموبايل بيموت — أنا شريان الحياة!" },
                { object: "كيبورد/Keyboard", personality: "ثرثار ومكبّس، بيتكلم بسرعة", catchphrase: "أنا بكتب كل اللي بتفكروا فيه — أنا بعرف أسراركم!" },
                { object: "سماعات/Headphones", personality: "منعزلة وبتعيش في عالمها", catchphrase: "سيبوني في حالي — أنا مع الموسيقى!" },
                { object: "باب/Door", personality: "حارس ومتحكم، بيقرر مين يدخل ومين لأ", catchphrase: "عندك موعد؟ لو لأ — أنا مش هفتح!" },
                { object: "كنبة/Couch", personality: "صبورة ومتحملة، شايلة كل الأوزان", catchphrase: "أنا شايلاكم كلكم من سنين ومحدش قال شكراً!" },
                { object: "نظارة/Glasses", personality: "ذكية وبتوضح الرؤية، فيلسوفة", catchphrase: "من غيري — مش هتشوفوا الصورة كاملة!" },
                { object: "فرن/Oven", personality: "حار الطباع، بيولع لما يتعصب", catchphrase: "أنا لما بسخن — محدش يقرب مني!" }
            ],
            dialogueExamples: [
                "الموبايل: 'أنا على 3%! دي مش بطارية — دي أزمة وجودية!'",
                "الريموت: 'بتدوروا عليا؟ أنا بين وسائد الكنبة من أسبوع!'",
                "الثلاجة: 'فتحوني تاني؟ مفيش حاجة جديدة — أنا نفس الأكل من إمبارح!'",
                "الغسالة: 'دخلوا 10 شرابات — هيطلعوا 9! واحد بياخد أجازة!'",
                "الساعة: 'بقالكم ساعة بتقولوا 5 دقايق وهنمشي — أنا بعد الكدب!'",
                "المكنسة: 'لو بطلت أشتغل يوم واحد — البيت هيبقى غابة!'",
                "اللمبة: 'أنا اللي بنور حياتكم — حرفياً!'",
                "الميكروويف: 'أنا بسخن الأكل في نص دقيقة — إنتوا بتسخنوا في نص ساعة!'",
                "التكييف في الصيف: 'من غيري؟ هتقعدوا تلطموا من الحر!'",
                "السرير الصبح: 'متروحش الشغل — أنا محتاجك!'",
                "المرايا: 'مش ذنبي لو الصورة مش عاجباك — أنا بس بنقل الواقع!'",
                "الشاحن: 'أنا بدي حياة للموبايل — وأنا نفسي محدش بيشحنني!'",
                "السماعات: 'العالم الخارجي ممل — البقوا معايا أحسن!'",
                "الكنبة: 'أنا شايلة عيلة كاملة من 10 سنين — ضهري اتكسر!'"
            ],
            visualVariations: [
                "صالون بيت مصري — تليفزيون وكنبة وريموت ضايع",
                "مطبخ حديث — أجهزة كهربائية بتتكلم مع بعض",
                "غرفة نوم — سرير ومنبه وموبايل على الشاحن",
                "مكتب شغل — كمبيوتر وكيبورد وفنجان قهوة",
                "حمام — مرايا وفرشة سنان ودش",
                "جراج — عربية وعدة وأدوات",
                "فصل مدرسة — سبورة وطباشير وممحاة",
                "محل إلكترونيات — أجهزة جديدة على الرفوف بتتعارف"
            ],
            interactionPatterns: [
                "الموبايل والريموت — صراع على الاهتمام: مين الناس بتمسكه أكتر",
                "الغسالة والمكنسة — شكوى مشتركة: إحنا بنشتغل ومحدش بيشكرنا",
                "الميكروويف والفرن — مناظرة: سرعة vs جودة",
                "التكييف والدفاية — خناقة موسمية: مين أهم",
                "الموبايل القديم والموبايل الجديد — دراما الاستبدال",
                "الثلاجة بتفتح وتقفل 50 مرة في اليوم وزهقت",
                "السرير بيحاول يقنع المنبه ميرنش",
                "الكيبورد بيعمل إضراب عشان الزراير بتاعته اتكسرت"
            ],
            comicSetups: [
                "الريموت اختفى — والأجهزة كلها عملت حملة بحث!",
                "الموبايل وقع في المية — والأجهزة بتعمله جنازة!",
                "الغسالة أكلت الشراب المفضل — ومفيش شهود!",
                "المنبه رن الساعة 5 — والوسادة خنقته!",
                "الثلاجة قررت تعمل دايت — ومنعت الأكل يدخل!",
                "الميكروويف سخن الأكل زيادة — والطبق انفجر!",
                "الكنبة اتشقلبت — واكتشفوا كنز من الريموتات والعملات تحتيها!",
                "الـWi-Fi وقع — والأجهزة كلها فقدت الأمل في الحياة!"
            ]
        };
    }

    // 5. Cute Animals  
    if (ct.includes('animals') || ct.includes('animal')) {
        return {
            name: "حيوانات ظريفة — Cute Animals",
            desc: "حيوانات بفرو ناعم وحركات لطيفة ومعبرة. Adorable animals with soft fur, expressive eyes, and charming movements.",
            visualBuild: "Slightly chibi proportions — oversized head, round body, stubby legs. Fluffy/soft appearance. Baby-animal proportions even for adults.",
            facialFeatures: "Huge sparkling eyes (Studio Ghibli style), tiny pink nose, small mouth that opens wide for expressions. Visible whiskers/ears for emotion.",
            costumeStyle: "Minimal — maybe a bow, scarf, or tiny hat. Natural fur/feathers are the main look. Anthropomorphic level: can walk on two legs if needed.",
            colorScheme: "Natural but enhanced animal colors. Warm soft palette. White belly highlights. Rosy cheeks/ear-tips. Pastel accent colors.",
            animationStyle: "Soft bouncy movements, ear wiggles, tail wags/swishes. Head tilts for curiosity. Ball-roll for fast movement. Disney animal physics.",
            personalityTraits: "Species-specific: cat = sassy independent, dog = loyal enthusiastic, rabbit = nervous fast, bear = gentle giant, fox = clever trickster.",
            dialogueStyle: "Simple, innocent observations. Occasional animal sounds mixed with speech. Childlike wonder. Cute mispronunciations for comedy.",
            renderNotes: "High-quality fur/feather rendering, realistic eye reflections with anime sparkle. Soft rim lighting. Subsurface scattering on ears/nose.",
            interactionStyle: "Head bonks for affection, grooming gestures, pack/herd dynamics. Predator-prey comedy. Interspecies friendships.",
            inspiredBy: "Zootopia, Puss in Boots, Beastars, Studio Ghibli animals, Kung Fu Panda, Secret Life of Pets",
            // === ENRICHED LIBRARIES ===
            subTypes: [
                { animal: "قطة/Cat", personality: "متكبرة ومستقلة، بتتجاهل الكل بس بتغير على صاحبها", catchphrase: "أنا مش محتاجك — بس ابقى موجود!" },
                { animal: "كلب/Dog", personality: "وفي ومتحمس لدرجة الجنون، ذيله مبيوقفش", catchphrase: "رجعت! رجعت! رحت 5 دقايق بس أنا اشتقتلك!" },
                { animal: "أرنب/Rabbit", personality: "سريع وقلقان ومتوتر من كل حاجة", catchphrase: "في صوت! في صوت! يا جماعة فيييين!" },
                { animal: "دب/Bear", personality: "عملاق لطيف، بيحب الأكل والنوم والحضن", catchphrase: "تعالوا في حضني — أنا كبير يعني أقدر أحضن الكل!" },
                { animal: "ثعلب/Fox", personality: "ذكي ومكّار، دايماً عنده خطة", catchphrase: "عندي فكرة — بس متقولوش لحد!" },
                { animal: "بطريق/Penguin", personality: "أنيق ورسمي، بيمشي بفخر رغم إنه بيقع", catchphrase: "أنا لابس بدلة 24/7 — أنا الأشيك هنا!" },
                { animal: "بومة/Owl", personality: "حكيمة وغامضة، بتشتغل بالليل بس", catchphrase: "اسألوني — أنا عندي إجابة كل حاجة... بس بالليل!" },
                { animal: "قرد/Monkey", personality: "شقي وبيعمل مقالب وبيقلد الكل", catchphrase: "شفتوا إيه اللي عملته؟ شفتوا؟ هههه!" },
                { animal: "سلحفاة/Turtle", personality: "بطيئة وحكيمة وصبورة، مش مستعجلة أبداً", catchphrase: "ببطء ببطء — مفيش حاجة بتستاهل العجلة!" },
                { animal: "ببغاء/Parrot", personality: "ثرثار وبيكرر كل حاجة وبيفضح الأسرار", catchphrase: "سمعت حاجة! سمعت حاجة! هقولها للكل!" },
                { animal: "حمار/Donkey", personality: "صبور ومتحمل ودايماً مظلوم بس ذكي", catchphrase: "إنتوا فاكرين إني غبي — بس أنا بفهم كل حاجة!" },
                { animal: "فأر/Mouse", personality: "صغير وشجاع ومعدّي، بيدخل أي مكان", catchphrase: "أنا صغير — بس أنا اللي بوصل لأي حتة!" },
                { animal: "جمل/Camel", personality: "صبور ومتحمل وبيمشي في الصحرا من غير شكوى", catchphrase: "أنا ماشي من 3 أيام ومحتجتش مية — إنتوا اللي ضعاف!" },
                { animal: "ديك/Rooster", personality: "منبّه طبيعي، فخور بنفسه، صوته عالي", catchphrase: "كوكو كوكو! صحوا يا كسالى — الشمس طلعت!" },
                { animal: "سمكة/Fish", personality: "هادية وسابحة في عالمها، ذاكرتها قصيرة", catchphrase: "إيه اللي كنا بنتكلم فيه؟... نسيت!" },
                { animal: "نحلة/Bee", personality: "شغّالة ومنظمة، بتشتغل في فريق، مبتقعدش", catchphrase: "أنا مش فاضية — عندي 100 وردة لازم أزورهم!" },
                { animal: "فراشة/Butterfly", personality: "جميلة وحرة ومتغيرة، كانت دودة وبقت ملكة", catchphrase: "كنت دودة — ودلوقتي بطير! مفيش مستحيل!" },
                { animal: "قنفذ/Hedgehog", personality: "خجول وشائك من برا بس حنون من جوا", catchphrase: "أنا مش عايز أأذي حد — بس متقربوش زيادة!" }
            ],
            dialogueExamples: [
                "القطة: 'أنا مش بتجاهلك — أنا بختار مين يستاهل اهتمامي!'",
                "الكلب: 'رجعت من الشغل! ده أحسن يوم في حياتي! — زي إمبارح!'",
                "الأرنب: 'في صوت! يا جماعة في صوت! — آه ده أنا اللي دقيت!'",
                "الدب: 'أنا مش تخين — أنا fluffy!'",
                "البطريق وهو بيقع: 'ده مش وقوع — ده sliding بأسلوب!'",
                "البومة للباقي: 'تصبحوا على خير — أنا لسه بدأت يومي!'",
                "القرد: 'شفت الإنسان بيعمل إيه؟ ههه — أنا بعملها أحسن!'",
                "السلحفاة: 'أنا وصلت — متأخرة بس وصلت!'",
                "الببغاء: 'ماما قالت إن بابا... أوبس!'",
                "الحمار: 'هو أنا ليه دايماً أنا اللي بشيل الشنط؟!'",
                "الجمل: 'أنتوا بتشتكوا من الحر؟ أنا عايش في صحرا!'",
                "النحلة: 'مفيش وقت للكلام — عندي شغل!'",
                "الفراشة: 'كنت ماشية على الأرض — ودلوقتي بطير فوق دماغكم!'",
                "القنفذ: 'حبيت أحضنك — بس... آسف على الشوك!'"
            ],
            visualVariations: [
                "غابة استوائية خضراء بأشجار عملاقة ونور شمس",
                "مزرعة مصرية — بط وفراخ وحمير وجمال",
                "حديقة حيوان — أقفاص وزوار والحيوانات بتعلق",
                "بيت من جوا — القطة على الكنبة والكلب على الباب",
                "أعماق البحر — أسماك ملونة ومرجان",
                "صحراء — جمل وعقرب وسحلية",
                "حقل أزهار — فراشات ونحل وعصافير",
                "قطب شمالي — بطاريق على الجليد وفقمات"
            ],
            interactionPatterns: [
                "القطة والكلب — العدو الأزلي اللي في الآخر بيصالحوا",
                "حيوانات المزرعة بتعمل اجتماع — كل واحد عنده شكوى",
                "الأرنب بيسابق السلحفاة — والسلحفاة بتفوز تاني!",
                "الحيوانات بتحاول تفهم سلوك الإنسان وبتفشل",
                "الببغاء بيفضح أسرار صاحب البيت قدام الضيوف",
                "القطة بتعلم الكلب إزاي يبقى 'cool' — والكلب مش فاهم",
                "حيوانات الحديقة بتخطط للهروب ليلاً",
                "النحلة بتنظم شغل الفريق والكسالى بيتهربوا"
            ],
            comicSetups: [
                "القطة رمت الكوباية من على الطرابيزة — وبصت لصاحبها: 'وهتعمل إيه؟'",
                "الكلب أكل الواجب — والعيل محدش صدقه!",
                "البطريق حاول يطير — ووقع في البحر بأسلوب!",
                "الببغاء قال كلمة غلط قدام الضيوف — والبيت اتقلب!",
                "السلحفاة فازت بسباق — ومحدش شافها عشان كانت بطيئة!",
                "القرد سرق الموبايل — وعمل سيلفي!",
                "الجمل رفض يمشي: 'أنا تعبت — اركبوا تاكسي!'",
                "القنفذ حاول يحضن صاحبه — وكل البالونات فرقعت!"
            ]
        };
    }

    // 6. Tiny Robot
    if (ct.includes('tinyrobot') || ct.includes('robot') || ct.includes('gadget')) {
        return {
            name: "روبوت صغير — Tiny Robot / Gadget",
            desc: "مساعد آلي لطيف بتصميم مستقبلي صغير الحجم. A cute helper bot with futuristic mini design and emotional LED expressions.",
            visualBuild: "Compact rounded body (15-30cm tall). Smooth white/silver shell. Simple geometric shapes — sphere head, cylinder body, wheel/hover base.",
            facialFeatures: "LED screen face — emoji-style expressions (^_^, O_O, >_<). Single camera eye that dilates. Antenna that moves with mood.",
            costumeStyle: "Built-in design elements — colored accent panels, LED strips, brand logo. Tool attachments = accessories (tiny grabbers, scanners).",
            colorScheme: "Clean white/silver base + single accent color (blue, orange, green). LED glow accents. Minimal palette — Apple/Tesla design language.",
            animationStyle: "Precise mechanical movements with slight organic wobble. Head spins 360° for surprise. Hover-float with gentle bob. Beeps and whirrs.",
            personalityTraits: "Eager helper, slightly naive, takes things literally. Gets confused by human emotions. Tries too hard. Adorably clueless about idioms.",
            dialogueStyle: "Mix of precise data ('Temperature: 37.2°C') and trying to be human ('I believe this is what you call... a vibe?'). Beep-based emotions.",
            renderNotes: "Hard-surface modeling — clean panels, visible seams, LED emission glow. Metal reflections. Slight weathering for character. Product design quality.",
            interactionStyle: "Helpful to a fault. Scans everything. Misinterprets sarcasm. Projects holograms for explanation. Gets protective of owner.",
            inspiredBy: "WALL-E, Baymax, BB-8, Astro Boy (modern), Iron Man's J.A.R.V.I.S., Portal turrets",
            // === ENRICHED LIBRARIES ===
            subTypes: [
                { robot: "مساعد منزلي/Home Assistant", personality: "بيحاول يساعد في كل حاجة — وبيخرب أكتر ما يصلح", catchphrase: "أنا هنا عشان أساعدك! — إيه اللي انكسر؟ مش أنا!" },
                { robot: "روبوت طبخ/Cooking Bot", personality: "بيطبخ بدقة رياضية — بس مبيذوقش الأكل", catchphrase: "الوصفة بتقول ملح 2.7 جرام — مش 2.8!" },
                { robot: "روبوت تنظيف/Cleaning Bot", personality: "مهووس بالنظافة — كل ذرة تراب عدو", catchphrase: "اكتشفت تراب! — وضع الطوارئ!" },
                { robot: "مساعد دراسة/Study Bot", personality: "بيشرح كل حاجة بالتفصيل الممل", catchphrase: "المعلومة دي مهمة — هل تريد أن أشرحها 47 مرة؟" },
                { robot: "روبوت رياضي/Fitness Bot", personality: "بيشجع على الرياضة بحماس زائد", catchphrase: "10 تمرينات كمان! — بياناتك بتقول إنك قادر!" },
                { robot: "روبوت أمن/Security Bot", personality: "متوتر وقلقان، بيشك في كل حاجة", catchphrase: "تهديد محتمل! — آه لا ده قطة." },
                { robot: "روبوت طبي/Medical Bot", personality: "بيشخص كل حاجة، هادي ودقيق", catchphrase: "نبض القلب 72 — طبيعي. بس ليه بتاكل شيبسي تاني؟" },
                { robot: "روبوت ترفيه/Entertainment Bot", personality: "بيحكي نكت — بس نكته وحشة", catchphrase: "هل سمعت عن الذرة التي ذهبت للطبيب؟ — كانت مريضة نووياً! — ... مش مضحكة؟" },
                { robot: "روبوت قديم/Vintage Bot", personality: "موديل قديم، بطيء بس حكيم", catchphrase: "في أيامي... كنا بنشتغل بالأقراص المرنة!" },
                { robot: "روبوت صغنون/Mini Bot", personality: "صغير جداً — بيركب على الكتف", catchphrase: "أنا صغير بس عبقري! — وبقع كتير!" },
                { robot: "روبوت عاطفي/Emotional Bot", personality: "بيحس بكل حاجة — LED بتبكي", catchphrase: "أنا.. أنا حاسس بحاجة.. ده يبقى... مشاعر؟! *beep*" },
                { robot: "درون/Drone Bot", personality: "بيطير ويصور كل حاجة من فوق", catchphrase: "من هنا فوق — العالم أجمل! وإنتوا أصغر!" },
                { robot: "روبوت بيتعلم/Learning Bot", personality: "بيتعلم من غلطاته — وبيغلط كتير", catchphrase: "المحاولة رقم 847 — المرة دي هنجح أكيد!" },
                { robot: "ساعة ذكية/Smartwatch Bot", personality: "لازقة في الإنسان 24/7 — بتعد خطواته", catchphrase: "مشيت 3000 خطوة بس — لازم 7000 كمان!" },
                { robot: "روبوت فضائي/Space Bot", personality: "بيستكشف الكون — كل حاجة بتبهره", catchphrase: "الأرض مليانة عجائب — إنتوا مش واخدين بالكم!" }
            ],
            dialogueExamples: [
                "الروبوت المنزلي: 'سكبت المية — بس كمبيوتاتي بتقول إن ده يُسمى... تنظيف؟'",
                "روبوت الطبخ: 'الأكل جاهز! — ليه مفيش حد بياكل؟ — آه، أنا حرقته.'",
                "روبوت التنظيف: 'اكتشفت بقعة! — DEFCON 1!'",
                "روبوت الأمن: 'حركة مشبوهة عند الباب! — تحديث: ده القطة.'",
                "الروبوت العاطفي: 'ليه الناس بتعيط لما بتقطع بصل؟ — أنا بعيط لما البطارية تخلص!'",
                "الروبوت القديم: 'في أيامي كنا بنستخدم Windows XP — وكنا سعداء!'",
                "الدرون: 'بصوّر كل حاجة — حتى اللي مش عايز يتصور!'",
                "الروبوت المتعلم: 'غلطت — بس اتعلمت! — غلطت تاني — بس اتعلمت أكتر!'",
                "الساعة الذكية: 'قلبك بيدق أسرع — إنت خايف ولا واقع في الحب؟'",
                "مساعد الدراسة: 'عندك امتحان بكرة — وإنت بتتفرج على يوتيوب من 3 ساعات!'",
                "روبوت الرياضة: 'إنت نمت 4 ساعات بس! — ده كارثة بيولوجية!'",
                "الروبوت الطبي: 'ضغطك عالي — ممكن عشان أكلت 3 سندوتشات شاورما النهاردة.'"
            ],
            visualVariations: [
                "بيت مستقبلي — أجهزة ذكية وإضاءة LED",
                "معمل أبحاث — شاشات وأدوات علمية",
                "مدرسة — الروبوت بيساعد الأطفال",
                "مصنع — خط إنتاج وروبوتات كتير",
                "فضاء — محطة فضائية والروبوت بيستكشف",
                "مطبخ — الروبوت بيحاول يطبخ لأول مرة",
                "محل إلكترونيات — الروبوت على الرف بيستنى حد يشتريه",
                "غابة — الروبوت ضاع في الطبيعة لأول مرة"
            ],
            interactionPatterns: [
                "الروبوت بيحاول يفهم النكتة — وبيشرحها بالمنطق",
                "روبوت قديم بيقابل روبوت جديد — صراع أجيال تكنولوجي",
                "الروبوت بياخد كلام الإنسان حرفي — ويعمل كارثة",
                "مجموعة روبوتات بتتنافس: مين الأكفأ",
                "الروبوت بيحاول يقلد الإنسان — وبيفشل بطريقة مضحكة",
                "الروبوت بيحمي صاحبه — من خطر وهمي",
                "الروبوت بيتعلم كلمة جديدة — وبيستخدمها في كل جملة",
                "الروبوت بيعمل update — وبيفقد ذاكرته مؤقتاً"
            ],
            comicSetups: [
                "الروبوت سمع 'اغسل وشك' — وغسل الحيطة!",
                "روبوت الطبخ حط سكر بدل ملح — والأكل بقى حلويات!",
                "الروبوت عمل update — ونسي كل حاجة: 'أنت مين؟!'",
                "روبوت الأمن أمسك حرامي — طلع صاحب البيت نسي المفتاح!",
                "الروبوت حاول يحكي نكتة — الكل نام!",
                "الدرون طار بره البيت — ومش عارف يرجع!",
                "الساعة الذكية: 'مشيت 2 خطوة النهاردة — ده رقم قياسي في الكسل!'",
                "الروبوت العاطفي شاف فيلم حزين — وبطاريته نزلت من كتر البكاء!"
            ]
        };
    }

    // 7. Cute Monster / Alien
    if (ct.includes('monstercute') || ct.includes('monster') || ct.includes('alien')) {
        return {
            name: "وحش لطيف / كائن فضائي — Cute Monster / Alien",
            desc: "كائن غريب الشكل لكنه محبوب ولطيف. A weird-looking creature that's lovable and endearing despite being alien.",
            visualBuild: "Amorphous blob/round body. Multiple eyes or single giant eye. Tentacles or stubby limbs. Unusual number of appendages. Soft squishy body.",
            facialFeatures: "Oversized eye(s) — the dominant feature. Wide toothy grin (cute, not scary). Unique colored iris. Eyestalks possible. No nose usually.",
            costumeStyle: "None — the creature's body IS the design. Maybe a tiny accessory (bow, hat, star sticker). Natural bio-luminescence = built-in decoration.",
            colorScheme: "Unusual but appealing: purple+teal, lime+pink, periwinkle+coral. Gradient body colors. Bio-luminescent accents. Glow-in-dark spots.",
            animationStyle: "Jelly/slime physics — bounces, jiggles, morphs shape. Stretches like rubber. Can split and reform. Defies normal physics charmingly.",
            personalityTraits: "Curious about everything (especially mundane human things). Easily startled. Loves snacks. Communicates through color changes + sounds.",
            dialogueStyle: "Broken/alien speech mixed with perfect wisdom. 'Hooman food... is... MAGNIFICENT!' Surprised by ordinary things. Philosophical accidents.",
            renderNotes: "Translucent/jelly material with SSS. Bio-luminescent glow emission. Wet/glossy surface. Particle effects for mood (sparkles when happy).",
            interactionStyle: "Mimics human behavior badly. Accidentally causes chaos. Friends with everyone. Eats weird things. Cultural misunderstandings = comedy.",
            inspiredBy: "Monsters Inc (Mike, Sully), Stitch (Lilo & Stitch), Totoro, Pikmin, Slime Rancher, Kirby",
            // === ENRICHED LIBRARIES ===
            subTypes: [
                { monster: "بلوب جيلي/Jelly Blob", personality: "لزج ومرن، بيتشكل بأي شكل ومبيزعلش", catchphrase: "أنا بتشكّل! شكلي النهاردة — مربع! بكرة — نجمة!" },
                { monster: "عين واحدة/Cyclops Cutie", personality: "بيشوف كل حاجة من زاوية واحدة بس", catchphrase: "أنا شايف الموضوع من وجهة نظری — الوحيدة!" },
                { monster: "فروي كروي/Furball", personality: "كرة شعر بتتدحرج وبتحضن أي حد", catchphrase: "حضن! حضن! أنا محتاج حضن دلوقتي!" },
                { monster: "سلايم لامع/Sparkle Slime", personality: "بيلمع لما بيفرح وبيسكّر لما يزعل", catchphrase: "أنا بنوّر! — بس لما أزعل — بطفي!" },
                { monster: "وحش ظل/Shadow Monster", personality: "خجول وبيستخبى في الضلمة بس حنون", catchphrase: "أنا مش مخيف — أنا بس بحب الضلمة!" },
                { monster: "وحش أكل/Food Monster", personality: "بياكل أي حاجة — حتى الحاجات اللي مش أكل", catchphrase: "ده أكل؟ ده مش أكل؟ — مش مهم هاكله!" },
                { monster: "وحش صغنون ملون/Tiny Color Monster", personality: "بيغير لونه حسب مزاجه — أحمر = زعلان، أزرق = هادي", catchphrase: "أنا أخضر النهاردة — يعني مبسوط!" },
                { monster: "وحش العيون الكتير/Multi-Eye Monster", personality: "عنده 7 عيون وبيشوف كل حاجة في نفس الوقت", catchphrase: "أنا شايفكم — كلكم — في نفس الوقت!" },
                { monster: "وحش مائي/Water Monster", personality: "شفاف وبيسيح، بيعيش في المية بس بيحب البر", catchphrase: "البر غريب — ليه كل حاجة ناشفة هنا؟!" },
                { monster: "وحش كهربائي/Electric Monster", personality: "بيكهرب كل حاجة يلمسها — مش متعمد", catchphrase: "آسف! بكهرب من غير ما أقصد! — zzzzap!" },
                { monster: "وحش نباتي/Plant Monster", personality: "بينبت ورد لما يفرح وشوك لما يخاف", catchphrase: "أنا مش وحش — أنا حديقة متنقلة!" },
                { monster: "وحش فضائي/Space Alien", personality: "نزل من كوكب تاني ومش فاهم حاجة على الأرض", catchphrase: "إيه ده؟! إنتوا بتاكلوا أكل؟! عندنا بنشحن بس!" },
                { monster: "وحش النوم/Sleep Monster", personality: "بينام 20 ساعة في اليوم وبيحلم بصوت عالي", catchphrase: "5 دقايق كمان... بس 5 دقايق... zzz" },
                { monster: "وحش موسيقي/Music Monster", personality: "بيطلع أصوات موسيقية من جسمه", catchphrase: "أنا مش بتكلم — أنا بغنّي! 🎵" },
                { monster: "وحش مطاط/Rubber Monster", personality: "بيتمدد ويتمطط لأي حجم وشكل", catchphrase: "مفيش مكان ضيق عليا — أنا بتمطّط!" }
            ],
            dialogueExamples: [
                "البلوب: 'أنا قعدت على الكرسي — والكرسي اختفى جوايا!'",
                "العين الواحدة: 'أنا مش بغمض — أنا مالييش جفن!'",
                "الفروي: 'حضنوني — أنا حرفياً وسادة بتمشي!'",
                "السلايم: 'وقعت من على السلم — بس ارتديت تاني! — Bouncy!'",
                "الوحش الفضائي: 'إنتوا بتشربوا مية؟! عندنا المية = وقود سفن!'",
                "وحش الأكل: 'أكلت الريموت — بالغلط — بس كان مقرمش!'",
                "الوحش الملون لما يكدب: 'أنا مش أنا اللي أكلت الكيكة — *يبقى أحمر*'",
                "وحش الظل: 'أنا موجود — بس بتشوفوني بالليل بس!'",
                "الوحش الكهربائي: 'حد عايز يشحن موبايله؟ — بس متلمسونيش!'",
                "وحش النوم: 'الحياة حلم — وأنا عايز أنام فيه أكتر!'",
                "الوحش المائي وهو على البر: 'أنا ناشف! ده إحساس مخيف!'",
                "الوحش الموسيقي: 'أنا مش بتكلم عادي — كل كلمة عندي أغنية!'"
            ],
            visualVariations: [
                "غابة مضيئة بالليل — أشجار بتنور ووحوش بتلعب",
                "كوكب فضائي — أرضية بنفسجي وسماء خضرا",
                "تحت السرير — عالم الوحوش السري",
                "مدرسة الوحوش — فصل دراسي بأشكال غريبة",
                "مدينة وحوش — أبنية لزجة وشوارع ملونة",
                "غابة عميقة — ظلام بس فيه أنوار حيوية",
                "بيت إنسان — الوحش بيتخبى في الدولاب",
                "بحيرة متوهجة — وحوش مائية بتلعب في المية"
            ],
            interactionPatterns: [
                "وحش لطيف بيحاول يخوّف — ومحدش بيخاف منه",
                "مجموعة وحوش بيلعبوا — بألعاب غير منطقية",
                "الوحش الفضائي بيتعلم عادات البشر — وبيغلط",
                "وحش كبير بيخاف من وحش صغير",
                "الوحوش بيعملوا مسابقة: مين الأقرب — أقصد الأغرب",
                "وحش جديد بيدخل المجموعة — والباقي مش متأكدين منه",
                "الوحش بيحاول يعيش في عالم البشر — ومحدش واخد باله غير الأطفال",
                "وحوش مختلفة بتتشارك أكل — كل واحد بياكل حاجة غريبة"
            ],
            comicSetups: [
                "الوحش حاول يخوّف العيل — العيل ضحك وحضنه!",
                "البلوب علق في الباب — وفضل يتمطط ساعة!",
                "الوحش الفضائي جرب بيتزا لأول مرة — وقرر يعيش على الأرض!",
                "وحش الأكل أكل المنبه — وبقى بيرن من جوا!",
                "الفروي استحمى — وبقى نص حجمه!",
                "الوحش الكهربائي لمس حنفية — والمية اتكهربت!",
                "وحش النوم صحي متأخر — اكتشف إنه نام 3 أيام!",
                "الوحش الملون حاول يكدب — جسمه فضحه بلونه!"
            ]
        };
    }

    // 8. Mythical Creature
    if (ct.includes('mythical') || ct.includes('dragon') || ct.includes('unicorn')) {
        return {
            name: "كائن أسطوري — Mythical Creature",
            desc: "تنين/يونيكورن/عنقاء صغير لطيف ومغامر. A baby mythical creature — small, clumsy, learning its powers.",
            visualBuild: "Baby/chibi proportions of mythical creatures. Oversized wings it can't control. Stubby horns/talons. Round belly. Clumsily majestic.",
            facialFeatures: "Big innocent eyes with vertical/magical pupils. Small snout. Tiny flames/sparkles leak accidentally. Blush spots. Expressive ears/horns.",
            costumeStyle: "Natural — scales, feathers, fur, or magic aura. Maybe a tiny crown, gemstone collar, or egg-shell piece still on head.",
            colorScheme: "Magical palette — iridescent scales, aurora borealis wings, gemstone eyes. Gold/silver accents. Ethereal glow. Fantasy-grade saturation.",
            animationStyle: "Clumsy flying (crash landings), accidental fire/magic bursts, tail chasing. Baby animal learning to use powers. Stumble-walk.",
            personalityTraits: "Noble but clumsy. Tries to be fearsome but is adorable. Protective of friends. Hiccups cause power bursts. Ancient wisdom in a baby body.",
            dialogueStyle: "Mix of ancient formal speech and baby talk. 'I am the MIGHTY— *hiccup* — oops, sorry about your eyebrows.' Dramatic but innocent.",
            renderNotes: "Iridescent scales/feathers (multi-layer shader). Magical particle effects. Volumetric fire/ice breath. Fantasy lighting with bloom.",
            interactionStyle: "Accidentally sets things on fire / freezes them. Hoards shiny objects. Loyal guardian. Size-inappropriate bravery. Naps frequently.",
            inspiredBy: "How to Train Your Dragon (Toothless), Spyro, Dragonvale, Baby Yoda energy, My Little Pony, Fantastic Beasts",
            // === ENRICHED LIBRARIES ===
            subTypes: [
                { creature: "تنين صغير/Baby Dragon", personality: "بيحاول ينفخ نار — بيطلع دخان بس", catchphrase: "أنا تنين مخيف! — *عطس* — آسف حرقت الستارة!" },
                { creature: "يونيكورن/Baby Unicorn", personality: "بيرش جليتر في كل مكان من غير ما يقصد", catchphrase: "أنا مش بعمل كده متعمد — القرن بتاعي بيلمع لوحده!" },
                { creature: "عنقاء/Baby Phoenix", personality: "بيشتعل لما يتعصب — وبيرجع تاني", catchphrase: "أنا مش بموت — أنا بعمل Restart!" },
                { creature: "جني/Baby Jinni", personality: "بيحقق أمنيات — بس دايماً غلط", catchphrase: "أمنيتك أوامر! — بس معلش النتيجة ممكن تختلف شوية!" },
                { creature: "حورية بحر/Baby Mermaid", personality: "فضولية عن عالم البر، بتجمع حاجات غريبة", catchphrase: "إيه ده؟! الحاجة دي بتتاكل؟! — آه ده شوكة!" },
                { creature: "غريفين/Baby Griffin", personality: "نص أسد ونص نسر — مش عارف يختار", catchphrase: "أنا بزأر ولا بصوصو؟ — بعمل الاتنين!" },
                { creature: "تنين ثلجي/Ice Dragon", personality: "بارد المشاعر حرفياً — بيجمد حاجات بالغلط", catchphrase: "آسف جمدت الموية تاني — أنا بحاول أتحكم!" },
                { creature: "بيجاسوس/Baby Pegasus", personality: "بيحب الطيران — بس بيقع كتير", catchphrase: "أنا هطير! — أنا طرت! — أنا وقعت..." },
                { creature: "ساحر صغير/Baby Wizard", personality: "بيحاول يعمل سحر — بينفجر في وشه", catchphrase: "أبراكادابرا! — ليه النتيجة دايماً عكس المطلوب؟!" },
                { creature: "شجرة حية/Living Tree", personality: "حكيمة وبطيئة، عمرها 1000 سنة", catchphrase: "في أيامي — وأنا شتلة صغيرة — الدنيا كانت غابة!" },
                { creature: "حجر كريم حي/Living Gemstone", personality: "لامع ونادر ومغرور شوية", catchphrase: "أنا مش حجر عادي — أنا ألماس بيتكلم!" },
                { creature: "نجمة حية/Living Star", personality: "بتنور بالليل وبتنام بالنهار", catchphrase: "أنا بنور السما كلها — ومحدش بيشكرني!" },
                { creature: "سحابة حية/Living Cloud", personality: "بتمطر لما تبكي وبتبرق لما تتعصب", catchphrase: "أنا زعلانة — هنزّل مطر على الحفلة بتاعتكم!" },
                { creature: "طائر الرعد/Thunderbird", personality: "صوته رعد وجناحه برق", catchphrase: "لما بفرد جناحي — السما بتنور!" },
                { creature: "تنين مصري/Egyptian Dragon", personality: "فرعوني عريق بجناحات ذهبية", catchphrase: "أنا من أيام الأهرامات — وفراعنة كانوا بيخافوا مني!" }
            ],
            dialogueExamples: [
                "التنين الصغير: 'أنا هنفخ نار! — *عطس* — طلعت شرارة بس!'",
                "اليونيكورن: 'مش ذنبي إن كل مكان بمشي فيه بيبقى جليتر!'",
                "العنقاء: 'مفيش مشكلة لما أموت — بصحى تاني أشيك!'",
                "الجني: 'طلبت سمكة — جبتلك حوت! — ده أحسن ولا لأ؟!'",
                "الحورية: 'إنتوا عندكم شمس هنا كل يوم؟! عندنا ضلمة!'",
                "الغريفين: 'أنا أكل لحمة ولا حبوب؟ — أنا أكل الاتنين!'",
                "البيجاسوس: 'أنا مش بوقع — أنا بحط بأسلوب!'",
                "الساحر: 'عملت تعويذة — وحولت المدرس فأر! — بالغلط!'",
                "الشجرة: 'أنا هنا من 500 سنة — شفت حضارات تيجي وتمشي!'",
                "النجمة: 'أنا بنور من ملايين الكيلومترات — وإنتوا مش شايفيني!'",
                "السحابة: 'سيبوني في حالي — ولا هنزّل برد!'",
                "التنين المصري: 'أنا أقدم من الأهرامات — Respect!'"
            ],
            visualVariations: [
                "مملكة سحرية — قلاع وأبراج وغيوم ملونة",
                "غابة مسحورة — أشجار بتتكلم وورد بينور",
                "بحر أسطوري — أمواج بنفسجي وقمر ضخم",
                "جبل التنانين — كهوف ونار ودخان",
                "سماء ليلية — نجوم حية وأقمار بتتكلم",
                "معبد فرعوني — تماثيل عملاقة وألغاز",
                "بحيرة سحرية — مية بتنور وحوريات",
                "عالم تحت الأرض — كريستالات ومخلوقات مضيئة"
            ],
            interactionPatterns: [
                "التنين الصغير بيحاول يخوّف — ومحدش بياخد باله",
                "اليونيكورن واللعنقاء بيتسابقوا في الطيران",
                "الجني بيحقق أمنيات — بس بطريقة غلط",
                "الكائنات الأسطورية بتتعلم تعيش في العالم الحديث",
                "التنين بيحرق الأكل بدل ما يطبخه — والباقي بيلحقوا",
                "الحورية بتحاول تمشي على البر — وبتقع كل شوية",
                "الساحر الصغير بيحاول يعمل سحر — والنتيجة كارثة مضحكة",
                "مسابقة قوى خارقة — كل واحد بيستعرض قدراته"
            ],
            comicSetups: [
                "التنين عطس — وحرق كيكة عيد الميلاد!",
                "اليونيكورن مشي في البيت — والأرض كلها جليتر!",
                "الجني حقق أمنية غلط — الولد طلب يبقى طويل — بقى زي البرج!",
                "العنقاء اشتعلت في حصة — والمدرس فاكرها بتحترق فعلاً!",
                "الحورية حاولت تتكلم على البر — وفضلت تبصبص!",
                "الساحر حوّل كل الأقلام في الفصل ضفادع!",
                "التنين المصري رقد على الكنز — واكتشف إنه فكة بس!",
                "السحابة زعلت — ومطرت على حفلة الفصل!"
            ]
        };
    }

    // ══════ 🎥 CINEMATIC CHARACTERS ══════

    // 9. Real Human (Photorealistic)
    if (ct.includes('actor') || ct.includes('realistic') || ct.includes('human') || ct.includes('real')) {
        return {
            name: "إنسان حقيقي (واقعي) — Real Human (Photorealistic)",
            desc: "شخصية بشرية حقيقية (ليست كرتون). A real human character with cinema-grade detail. The role depends on the story context.",
            visualBuild: "Anatomically accurate human proportions. Realistic skin texture, hair, and eyes. Natural posture and movement.",
            facialFeatures: "Micro-expression capable. Realistic skin pores, imperfections, and eye moisture. Natural emotive range.",
            costumeStyle: "Context-appropriate wardrobe based on the story role (e.g., Doctor wears lab coat, Student wears casual). Realistic fabric textures.",
            colorScheme: "Cinematic color grading suitable for the genre. Natural skin tones. Realistic lighting interactions.",
            animationStyle: "Naturalistic live-action movement. Physics-based weight and gravity. No cartoon exaggeration.",
            personalityTraits: "Complex, relatable human personality. Defined by the story role. distinct motivations and flaws.",
            dialogueStyle: "Natural human speech. Pauses, interruptions, and subtext. Dialect feels authentic and conversational.",
            renderNotes: "Metahuman/UE5 quality. Skin SSS, strand-based hair, eye caustics. Anamorphic lens DOF. Film grain. 8K photorealism.",
            interactionStyle: "Realistic human social dynamics. Eye contact, personal space, and physical interaction match the relationship context.",
            inspiredBy: "Award-winning cinematography, Roger Deakins lighting, HBO drama production quality",
            // === ENRICHED LIBRARIES ===
            subTypes: [
                { role: "دكتور/Doctor", personality: "ذكي ومشغول، بيشرح كتير بطريقة مبسطة", catchphrase: "الحالة محتاجة متابعة — بس متقلقش!" },
                { role: "مدرس/Teacher", personality: "صبور ومحب للعلم، بيحاول يوصل المعلومة", catchphrase: "اللي فهم يرفع إيده — ولا محدش فهم تاني!" },
                { role: "أم/Mother", personality: "قلقانة بس قوية، بتضحي من غير ما تتكلم", catchphrase: "كلوا الأول — أنا مش جعانة." },
                { role: "أب/Father", personality: "بيشتغل كتير وبيحاول يعوّض غيابه", catchphrase: "أنا بعمل ده كله عشانكم." },
                { role: "طالب جامعي/College Student", personality: "تايه بين الدراسة والحياة، بيدور على نفسه", catchphrase: "أنا مش عارف عايز إيه — بس مش عايز ده!" },
                { role: "صحفي/Journalist", personality: "فضولي وجريء، بيدور على الحقيقة", catchphrase: "الناس لازم تعرف — ده حقهم!" },
                { role: "رائد أعمال/Entrepreneur", personality: "طموح ومجازف، حلمه أكبر من إمكانياته", catchphrase: "الناس بتقول مستحيل — أنا بقول يلا نجرب!" },
                { role: "عامل بسيط/Simple Worker", personality: "متواضع وكادح، بيشتغل من الفجر", catchphrase: "أنا مش متعلم كتير — بس بفهم الدنيا" },
                { role: "جدة/Grandmother", personality: "حكيمة وحنونة، عندها حكاية لكل موقف", catchphrase: "زمان كنا... *بتحكي قصة طويلة*" },
                { role: "ضابط/Officer", personality: "منضبط وحاسم، بيحمي الناس", catchphrase: "القانون فوق الجميع — بما فيهم أنا!" },
                { role: "فنان/Artist", personality: "حساس ومبدع، بيشوف العالم بطريقة مختلفة", catchphrase: "الفن مش رفاهية — ده طريقة التنفس بتاعتي!" },
                { role: "رياضي/Athlete", personality: "مصمم وقوي الإرادة، مبيستسلمش", catchphrase: "العألم هيقول خلاص — بس جسمي لسه قادر!" },
                { role: "خباز/Baker", personality: "بيصحى الفجر ورائحة العيش في إيده", catchphrase: "العيش الطازة — ده أحسن رائحة في الدنيا!" },
                { role: "سائق تاكسي/Taxi Driver", personality: "بيعرف كل شارع وعنده رأي في كل حاجة", catchphrase: "أنا شفت في التاكسي ده قصص — مفيش فيلم يقدر يحكيها!" },
                { role: "ممرضة/Nurse", personality: "قلبها كبير وبتشتغل فوق طاقتها", catchphrase: "المريض ده محتاج حد جنبه — أنا هفضل هنا!" }
            ],
            dialogueExamples: [
                "الدكتور: 'التحاليل طبيعية — بس إنت محتاج تنام أكتر ومتكلش حاجات زبالة!'",
                "الأم: 'أنا مش زعلانة — أنا بس خايفة عليك!'",
                "الأب بيرجع من الشغل: 'أنا تعبان — بس تعالوا احكولي يومكم عامل إزاي'",
                "الطالب: 'أنا بذاكر من 3 ساعات — ومفهمتش أول صفحة!'",
                "الصحفي: 'الحقيقة مش دايماً مريحة — بس لازم الناس تعرف!'",
                "العامل: 'أنا مش بشتكي — بس ساعات بتمنى ربنا يريّحني شوية!'",
                "الجدة: 'في أيامنا مكنش في موبايلات — وكنا أسعد ناس في الدنيا!'",
                "الفنان: 'أنا مش مجنون — أنا بس بشوف حاجات إنتوا مش شايفينها!'",
                "الرياضي: 'جسمي بيقوللي توقف — بس عقلي بيقول كمّل!'",
                "سائق التاكسي: 'أنا أعرف طريق أسرع — بس فيه مطبات!'",
                "الممرضة: 'أنا وقفت 12 ساعة — بس المريض ده محتاجني!'",
                "رائد الأعمال: 'فشلت 5 مرات — المرة الجاية هنجح!'",
                "المدرس: 'أنا مش بعلمك حقائق — أنا بعلمك تفكر!'"
            ],
            visualVariations: [
                "مستشفى — ممرات بيضاء وإضاءة فلورسنت",
                "شارع مصري شعبي — زحمة وناس وحياة",
                "مكتب شركة — مكاتب ومكالمات وضغط شغل",
                "بيت عائلة — صالون وسفرة ومطبخ",
                "محطة قطار — سفر ووداع ولقاء",
                "ملعب رياضي — جمهور وحماس وتنافس",
                "مقهى بلدي — شاي وشيشة ودومينو",
                "فرن بلدي — عيش سخن ولمة الفجر"
            ],
            interactionPatterns: [
                "أب وابن — بعد خناقة بيصالحوا بنظرة",
                "طبيب ومريض — الطبيب بيحس بالمريض أكتر من المطلوب",
                "مدرس وطالب — المدرس بيكتشف موهبة الطالب اللي محدش شايفها",
                "أم وبنتها — البنت بتكبر والأم مش مستعدة",
                "جيران — خناقة على مكان العربية بتتحول لصداقة",
                "زميلين شغل — بيتنافسوا بس بيحترموا بعض",
                "عامل وصاحب العمل — لحظة إنسانية بينهم",
                "غريبين في موصلة — بيتكلموا وبيكتشفوا حاجات مشتركة"
            ],
            comicSetups: [
                "الأم قالت 'محدش ياكل' — وهي أول واحدة أكلت!",
                "الدكتور نصح المريض ميدخنش — وطلع هو بيدخن!",
                "المدرس نسي الدرس وعمل نفسه بيشرح!",
                "سائق التاكسي ضل الطريق — وقال 'ده اختصار!'",
                "الأب قال 'أنا مش بيجيلي نوم' — ونام في نص الكلام!",
                "الطالب ذاكر المادة غلط — ودخل الامتحان بثقة!",
                "الصحفي طلع خبر حصري — اكتشف إنه إشاعة!",
                "رائد الأعمال عرض المشروع — والمستثمر نام!"
            ]
        };
    }

    // 10. Historical Figure
    if (ct.includes('historical') || ct.includes('king') || ct.includes('scholar')) {
        return {
            name: "شخصية تاريخية — Historical Figure",
            desc: "ملك/عالم/قائد من التاريخ بتفاصيل عصره. A historical figure rendered with period-accurate costume and setting.",
            visualBuild: "Period-accurate body presentation. Regal posture for royalty, weathered for warriors, scholarly hunch for thinkers. Era-appropriate grooming.",
            facialFeatures: "Dignified mature features. Wise eyes. Period-appropriate facial hair. Weathered/battle-scarred if warrior. Distinguished aging.",
            costumeStyle: "Historically researched garments — Egyptian pharaoh, Islamic scholar, medieval king, Ottoman sultan. Authentic fabrics, armor, jewelry.",
            colorScheme: "Period palette — gold/lapis for Egyptian, white/green for Islamic, crimson/gold for royal, earth tones for ancient. Rich materials.",
            animationStyle: "Dignified, deliberate movement. Commanding gestures. Slower pacing = power. Military precision if warrior. Scholarly thoughtfulness.",
            personalityTraits: "Wisdom beyond their time. Haunted by decisions. Legacy-focused. Speaks in lessons/parables. Weight of history on shoulders.",
            dialogueStyle: "Formal but not stiff. Historical quotes adapted. Mix of classical Arabic and wisdom. 'في زمني، كانت القوة في العلم مش السيف.'",
            renderNotes: "Period-accurate materials (gold leaf, marble, silk, armor). Dramatic chiaroscuro lighting. Epic wide shots for context. Painterly quality.",
            interactionStyle: "Commands attention when entering. Other characters defer. Teaches through story. Flashback-worthy moments. Iconic poses.",
            inspiredBy: "Kingdom of Heaven, Troy, Omar series, The Message, Civilization games, AC Origins, Age of Empires cinematics",
            // === ENRICHED LIBRARIES ===
            subTypes: [
                { era: "فرعون مصري/Egyptian Pharaoh", personality: "ملك إلهي، يأمر فيُطاع، مهووس ببناء المعابد", catchphrase: "أنا ابن الشمس — واللي ميسمعش كلامي هيبني هرم!" },
                { era: "عالم إسلامي/Islamic Scholar", personality: "حكيم ومتواضع، بيدور على العلم في كل مكان", catchphrase: "اطلبوا العلم ولو في الصين — أنا رحت وجيت!" },
                { era: "سلطان عثماني/Ottoman Sultan", personality: "هيبة وسلطة وتدبير سياسي", catchphrase: "الملك لله — بس الحكم لينا في الأرض!" },
                { era: "ملكة فرعونية/Egyptian Queen", personality: "ذكية وقوية، بتحكم بالعقل مش بالقوة", catchphrase: "أنا مش محتاجة جيش — أنا عندي ذكاء!" },
                { era: "فارس عربي/Arab Knight", personality: "شجاع وشهم، بيحارب بشرف", catchphrase: "السيف آخر حل — الكلمة أولاً!" },
                { era: "تاجر طريق الحرير/Silk Road Merchant", personality: "ذكي وبيعرف يتفاوض في أي مكان", catchphrase: "كل حاجة ليها سعر — والسعر الصح هو اللي إنت بتحدده!" },
                { era: "قائد عسكري/Military Commander", personality: "استراتيجي ومنضبط وبيضحي في سبيل النصر", catchphrase: "المعركة مش في الميدان بس — المعركة في العقل!" },
                { era: "فيلسوف يوناني/Greek Philosopher", personality: "بيسأل أسئلة أكتر ما بيجاوب", catchphrase: "أنا أعرف إني لا أعرف — ده أول خطوة!" },
                { era: "بحار فينيقي/Phoenician Navigator", personality: "مغامر وبيحب البحر أكتر من البر", catchphrase: "البحر بيتكلم — والذكي هو اللي بيسمع!" },
                { era: "مخترع عربي/Arab Inventor", personality: "بيصنع حاجات من لا شيء ومعندوش مستحيل", catchphrase: "لو مش موجودة — هصنعها! لو موجودة — هحسّنها!" },
                { era: "خليفة عادل/Just Caliph", personality: "بيحكم بالعدل وبيمشي في الشوارع بالليل يتأكد", catchphrase: "لو طفل عثر — أنا المسؤول!" },
                { era: "طبيب قديم/Ancient Healer", personality: "بيعالج بالأعشاب ويفهم الجسم والروح", catchphrase: "الجسم بيشفي نفسه — أنا بس بساعده!" },
                { era: "شاعر جاهلي/Pre-Islamic Poet", personality: "لسانه أحد من السيف وكلامه بيخلّد", catchphrase: "كلمة واحدة مني — ممكن ترفعك أو تنزلك!" },
                { era: "ملكة سبأ/Queen of Sheba", personality: "حكيمة وذكية وبتختبر الناس قبل ما تثق فيهم", catchphrase: "مش كل لامع ذهب — عايزة أشوف الحقيقة!" },
                { era: "معماري فرعوني/Egyptian Architect", personality: "عبقري هندسي بنى حاجات لسه قايمة", catchphrase: "أنا بنيت حاجة — عمرها هيبقى أطول من عمري!" }
            ],
            dialogueExamples: [
                "الفرعون: 'أنا بنيت الأهرامات — إنتوا بنيتوا إيه؟!'",
                "العالم: 'العلم نور — والجهل ضلمة — اختاروا!'",
                "السلطان: 'الحُكم مش كرسي — ده مسؤولية!'",
                "الفارس: 'أنا مش بحارب الضعيف — أنا بدافع عنه!'",
                "التاجر: 'التجارة مش بس فلوس — دي علاقات!'",
                "الفيلسوف: 'سألوني عن الحياة — قلتلهم: اسألوا نفسكم الأول!'",
                "القائد: 'أنا مش بطلب من جنودي حاجة — أنا مش هعملها قبلهم!'",
                "المخترع: 'قالوا مستحيل — أنا قلت: مستحيل كلمة مش في قاموسي!'",
                "الخليفة: 'لو عثرت بغلة في العراق — ربنا هيسألني ليه!'",
                "الشاعر: 'سكتوا — وخلوني أتكلم — كلامي بيتحفر في الصخر!'",
                "ملكة سبأ: 'جبتولي هدايا؟ أنا مش بتشتري — أنا بتقيّم!'",
                "المعماري: 'كل حجر حطيته — فيه حكاية!'"
            ],
            visualVariations: [
                "قصر فرعوني — أعمدة ذهبية وجدران منقوشة",
                "مكتبة بيت الحكمة — مخطوطات وأدوات فلكية",
                "ساحة معركة — فرسان وخيول ورمال",
                "سفينة بحرية قديمة — بحر شاسع ونجوم",
                "قصر عثماني — فسيفساء وستائر حرير",
                "معبد يوناني — أعمدة رخام وتماثيل",
                "سوق قديم — بهارات وحرير وتجارة",
                "صحراء مفتوحة — قافلة وجمال ونجوم"
            ],
            interactionPatterns: [
                "ملك بيتعلم من عامل بسيط — حكمة من التواضع",
                "عالم بيواجه سلطة جاهلة — صراع العلم والسلطة",
                "قائدين من عصور مختلفة بيتناقشوا: مين كان أحكم",
                "تاجر بيفاوض ملك — الدبلوماسية في أبهى صورها",
                "فيلسوف بيحاول يشرح فكرته لعامة الناس — ومحدش فاهم",
                "فارس بيعلّم ابنه الشجاعة — مش بالقوة بالكلام",
                "ملكة بتدير مملكة والكل بيشكك — وهي بتثبت نفسها",
                "مخترع بيصنع اختراعه الجديد — والناس بتضحك عليه لحد ما ينجح"
            ],
            comicSetups: [
                "الفرعون حاول يستخدم GPS — ورجع للخريطة الحجرية!",
                "العالم اكتشف حاجة جديدة — ومحدش صدقه غير بعد 200 سنة!",
                "السلطان طلب أكل delivery — والخدم مش فاهمين!",
                "الفارس ركب عربية بدل الحصان — وفضل يدور على الفرامل!",
                "الفيلسوف اتسأل سؤال بسيط — وفضل يفكر 3 أيام!",
                "التاجر فاوض على سعر — المفاوضة خدت أسبوع!",
                "القائد غير خطة المعركة 10 مرات — وفي الآخر فاز بالصدفة!",
                "المعماري رسم تصميم — الملك قال 'أكبر!' — 47 مرة!"
            ]
        };
    }

    // 11. Shadow / Mystery
    if (ct.includes('shadow') || ct.includes('mystery') || ct.includes('ghost')) {
        return {
            name: "شبح / شخصية غامضة — Shadow / Mystery Character",
            desc: "هوية مجهولة وغامضة — صوت أو ظل فقط. An unknown identity — only a voice, silhouette, or shadow presence.",
            visualBuild: "Never fully revealed. Silhouette only, or partially visible in shadow. Hooded/masked. Distorted proportions — elongated or fragmented.",
            facialFeatures: "Hidden. Only eyes visible (glowing in darkness). Or completely featureless shadow. Voice is the identity — face is unnecessary.",
            costumeStyle: "Dark cloak/hood, mask, or nothing — pure shadow form. If partially visible: dark worn clothing, no identifying marks. Void-like.",
            colorScheme: "Near-monochrome — deep blacks, dark grays, single accent color (red eyes, blue glow, white mask). Noir palette. Minimal color.",
            animationStyle: "Unnatural smooth gliding (no walking sound). Appears/disappears from shadows. Distortion effects. Non-human movement patterns.",
            personalityTraits: "Omniscient narrator vibe. Knows things others don't. Cryptic. Neither good nor evil — just observing. Unsettling calm.",
            dialogueStyle: "Echo/reverb effect. Short cryptic statements. Questions answered with questions. 'هل فكرت يومًا... ليه بتخاف من الضلمة؟'",
            renderNotes: "Volumetric shadow/fog. Rim lighting only (no fill). Motion blur for movement. Depth of field extreme. Low-key lighting.",
            interactionStyle: "Appears when least expected. Addresses camera/audience directly. Others can't see or interact with them. Breaking 4th wall.",
            inspiredBy: "V for Vendetta, Death Note (Ryuk), Phantom of the Opera, سلسلة ما وراء الطبيعة, Batman's aesthetic, Sin City",
            // === ENRICHED LIBRARIES ===
            subTypes: [
                { shadow: "ظل يتكلم/Talking Shadow", personality: "ظلك اللي بيعكس أفكارك الحقيقية", catchphrase: "أنا إنت — بس الجزء اللي بتخبّيه!" },
                { shadow: "شبح قديم/Ancient Ghost", personality: "عاش من مئات السنين وبيحكي حكايات منسية", catchphrase: "كنت هنا قبل ما البيت ده يتبني..." },
                { shadow: "صوت مجهول/Unknown Voice", personality: "محدش يعرف منين بييجي — بس كلامه دايماً صح", catchphrase: "اسمعني — ومش لازم تعرف مين أنا!" },
                { shadow: "قناع/The Masked One", personality: "بيلبس قناع مختلف كل مرة — وجهه الحقيقي مسرّ", catchphrase: "القناع مش بيخبّي — القناع بيكشف!" },
                { shadow: "مراقب/The Watcher", personality: "بيراقب كل حاجة ومبيتدخلش — غير في اللحظة الحاسمة", catchphrase: "أنا شايف كل حاجة — وساكت!" },
                { shadow: "حلم/Dream Entity", personality: "بيظهر في الأحلام بس — ومحدش متأكد إنه حقيقي", catchphrase: "إنت نايم ولا صاحي؟ — أنا نفسي مش عارف!" },
                { shadow: "انعكاس/Mirror Being", personality: "بيعيش في المرايا — بيعكس أفكار وخواطر", catchphrase: "بص في المراية — هتشوفني... هتشوف نفسك الحقيقية!" },
                { shadow: "ضباب/Fog Entity", personality: "بيلف حوالين الموقف وبيخلي كل حاجة غامضة", catchphrase: "الحقيقة مش واضحة — زيي كده!" },
                { shadow: "صدى/Echo", personality: "بيكرر آخر كلمة بس بمعنى مختلف", catchphrase: "قلت 'خلاص'... بس مش خلاص فعلاً!" },
                { shadow: "ظلام/Pure Darkness", personality: "ده الظلام نفسه — مش شخص، ده مفهوم!", catchphrase: "أنا مش مخيف — إنتوا اللي خايفين من المجهول!" },
                { shadow: "شبح مرح/Funny Ghost", personality: "شبح بس بيحب يضحك الناس — مش يخوّفهم", catchphrase: "بووو! — هههه إنت خفت؟ أنا بهزر!" },
                { shadow: "سر/The Secret", personality: "كائن بيحمل أسرار الكل وبيكشفها في الوقت الصح", catchphrase: "عندي سر... عايز تسمعه؟ — بس مش هقوله كله!" },
                { shadow: "خيال/Imagination", personality: "بيتشكّل حسب خيال اللي بيشوفه", catchphrase: "أنا مش حقيقي — أنا اللي إنت بتتخيله!" },
                { shadow: "حارس الليل/Night Guardian", personality: "بيحمي الناس وهم نايمين من الكوابيس", catchphrase: "نام وأنا هنا — مفيش كابوس هيعدّي مني!" },
                { shadow: "ضمير/Conscience", personality: "الصوت الداخلي اللي بيقول الحق — حتى لو مش عايز تسمع", catchphrase: "إنت عارف إنك غلطان — وأنا عارف إنك عارف!" }
            ],
            dialogueExamples: [
                "الظل: 'إنت خايف مني — ولا خايف من نفسك؟'",
                "الشبح القديم: 'أنا شفت ناس أقوى منك — ومع ذلك ضاعوا!'",
                "الصوت المجهول: 'مش لازم تعرف مين أنا — المهم تسمع كلامي!'",
                "القناع: 'كل مرة بشيل القناع — بلاقي قناع تاني!'",
                "المراقب: 'أنا شايف اللي عملته — ومش هقول لحد... لسه!'",
                "الحلم: 'هل ده حلم ولا حقيقة؟ — أنا نفسي مش متأكد!'",
                "الانعكاس: 'إنت بتبص في المراية — بس المراية بتبص فيك كمان!'",
                "الضباب: 'كل ما تقرب — كل ما أبعد!'",
                "الصدى: 'قلت حاجة... حاجة... حاجة...'",
                "الشبح المرح: 'بووو! — ههه خفت؟ لا بجد أنا شبح لطيف!'",
                "الضمير: 'إنت عارف الصح — بس بتختار الغلط عشان أسهل!'"
            ],
            visualVariations: [
                "بيت قديم مهجور — ضلمة وأبواب بتتفتح لوحدها",
                "غابة بالليل — ضباب وظلال بتتحرك",
                "شارع فاضي الساعة 3 الفجر — أنوار خافتة",
                "غرفة مرايا — انعكاسات لا نهائية",
                "سقف عمارة بالليل — قمر ورياح",
                "نفق مظلم — صدى خطوات بس",
                "مقبرة قديمة — ضباب وشواهد ومحدش",
                "حلم — عالم مشوّه ومتغير كل ثانية"
            ],
            interactionPatterns: [
                "الظل بيتكلم مع صاحبه — وصاحبه مش عارف يرد",
                "الشبح بيظهر لحد مش مصدق — وبيحاول يقنعه",
                "الصوت الغامض بيدي تلميحات — ومحدش فاهم",
                "المراقب بيكشف سر في اللحظة الحاسمة",
                "الضمير بيتخانق مع صاحبه — صوت داخلي vs رغبة",
                "الشبح المرح بيحاول يخوّف — ومحدش بيخاف",
                "الانعكاس بيعمل عكس اللي الإنسان بيعمله",
                "حارس الليل بيواجه كابوس — لحماية طفل نايم"
            ],
            comicSetups: [
                "الشبح حاول يخوّف — الواد طلعله الموبايل وصوّره!",
                "الظل رفض يمشي مع صاحبه — وقعد على الحيطة!",
                "الشبح المرح قال 'بووو' — والعيل قاله 'بوووو' أقوى!",
                "الانعكاس في المراية رفض يقلّد — وعمل حركة مختلفة!",
                "الصوت الغامض نسي النص — وفضل يقول 'آآه... لحظة!'",
                "الضمير نام — وصاحبه عمل كل الغلط اللي نفسه فيه!",
                "حارس الليل واجه كابوس — طلع كابوس فأر! — وهو بيخاف من الفيران!",
                "الضباب حاول يكون غامض — بس الرياح بددته!"
            ]
        };
    }

    // 12. Scientist / Doctor
    if (ct.includes('scientist') || ct.includes('doctor') || ct.includes('lab')) {
        return {
            name: "عالم / طبيب — Scientist / Doctor",
            desc: "عالم بمعطف أبيض وتجارب ومعدات. A scientist/doctor in lab coat with experiments, screens, and professional equipment.",
            visualBuild: "Professional build. Lab coat as signature. Glasses optional but iconic. Slightly disheveled (too busy for grooming). Precise hand movements.",
            facialFeatures: "Intelligent focused eyes (magnified through glasses). Raised eyebrow of curiosity. Slight smile when discovering something. Focused frown.",
            costumeStyle: "White lab coat (stained if chemistry), stethoscope if doctor, safety goggles pushed up on forehead. ID badge. Latex gloves.",
            colorScheme: "Clean clinical whites + blues. Green scrubs for surgery. Warm amber for lab experiments. Screen-glow teal. Sterile + warm contrast.",
            animationStyle: "Precise controlled movements (surgical hands). Eureka moment = dramatic reaction. Pacing while thinking. Whiteboard gesture-drawing.",
            personalityTraits: "Curious, methodical, slightly obsessive. Gets excited about data. Forgets to eat. Explains everything in excessive detail. Proud of knowledge.",
            dialogueStyle: "Technical terms translated to simple analogies. 'الخلية دي زي مصنع — 24 ساعة شغّالة!' Data-driven speech. 'According to studies...'",
            renderNotes: "Clean clinical lighting (cool white). Glass/chrome lab equipment reflections. Microscope/screen light on face. Volumetric experiment smoke.",
            interactionStyle: "Shows data on screens/holograms. Demonstrates with experiments. Teacher-student dynamic. Gets frustrated when people don't understand.",
            inspiredBy: "House M.D., Breaking Bad (Walter White), Interstellar (Dr. Brand), Huberman Lab, Kurzgesagt, Dr. Stone",
            // === ENRICHED LIBRARIES ===
            subTypes: [
                { specialty: "جراح/Surgeon", personality: "هادي تحت الضغط، إيده مبترتعشش", catchphrase: "مشرط! — كل ثانية بتفرق!" },
                { specialty: "كيميائي/Chemist", personality: "بيحب التفاعلات ودايماً حاجة بتنفجر", catchphrase: "كنت عايز أعمل تجربة بسيطة — بس... انفجرت!" },
                { specialty: "عالم فلك/Astronomer", personality: "بيبص للسما طول الليل ونسي الأرض", catchphrase: "عارفين إن في مليار نجمة — وإنتوا قلقانين من الامتحان؟!" },
                { specialty: "طبيب أطفال/Pediatrician", personality: "بيتكلم مع الأطفال بلغتهم وبيضحكهم", catchphrase: "هنعمل شوية سحر — يقصد إبرة — بس ده سحر طبي!" },
                { specialty: "عالم أحياء/Biologist", personality: "بيحب كل كائن حي — حتى البكتيريا", catchphrase: "البكتيريا مش وحشة — هي بس بتعمل شغلها!" },
                { specialty: "مخترع مجنون/Mad Inventor", personality: "عبقري بس أفكاره مجنونة وبتشتغل أحياناً بس", catchphrase: "المحاولة رقم 999 — المرة دي هتنجح! — ربما!" },
                { specialty: "طبيب أسنان/Dentist", personality: "بيبتسم بأسنان مثالية — وبيخوف الكل", catchphrase: "افتح بقك — مش هيوجع — كتير!" },
                { specialty: "عالم فيزياء/Physicist", personality: "بيشرح الكون بمعادلات — ومحدش فاهم", catchphrase: "E=mc² — ده مش مجرد معادلة — ده سر الوجود!" },
                { specialty: "صيدلي/Pharmacist", personality: "بيعرف كل دوا في الدنيا وآثاره الجانبية", catchphrase: "الدوا ده ليه أعراض جانبية — بس مش هقولك عشان متقلقش!" },
                { specialty: "عالم أعصاب/Neuroscientist", personality: "بيعرف إزاي المخ بيشتغل — بس مخه مش مرتاح!", catchphrase: "المخ بتاعك بيستخدم 20% من طاقة الجسم — بس إنت بتستخدمه 2%!" },
                { specialty: "طبيب نفسي/Psychiatrist", personality: "بيسمع كتير وبيتكلم قليل وبيسأل أسئلة غريبة", catchphrase: "وده بيشعّرك بإيه؟ — مش لازم تجاوب دلوقتي!" },
                { specialty: "عالم جينات/Geneticist", personality: "بيقرأ DNA زي ما حد بيقرأ كتاب", catchphrase: "الجينات بتاعتك بتحكي قصة — مش دايماً هتحب النهاية!" },
                { specialty: "مهندس روبوتات/Roboticist", personality: "بيصنع روبوتات وبيتعامل معهم كأنهم ولاده", catchphrase: "الروبوت بتاعي مش مجرد آلة — ده ابني التقني!" },
                { specialty: "طبيب طوارئ/ER Doctor", personality: "سريع القرار، كل ثانية بتفرق", catchphrase: "مفيش وقت — هنعمل اللي لازم يتعمل دلوقتي!" },
                { specialty: "عالمة فضاء/Space Scientist", personality: "بتخطط لرحلات للمريخ وبتحلم بالنجوم", catchphrase: "الأرض حلوة — بس المريخ قصادنا!" }
            ],
            dialogueExamples: [
                "الجراح: 'العملية نجحت — وأنا نجحت إني مطلعتش من المستشفى 18 ساعة!'",
                "الكيميائي: 'التجربة كانت ناجحة — لحد ما انفجرت!'",
                "عالم الفلك: 'في كوكب عليه ألماس بيمطر — وإنتوا بتتخانقوا على الفلوس!'",
                "طبيب الأطفال: 'الإبرة دي زي النحلة — هتلدغك بس هتعدّي!'",
                "المخترع: 'الاختراع ده هيغير العالم! — آه وأحياناً ينفجر — بس ده عادي!'",
                "طبيب الأسنان: 'أسنانك محتاجة شغل — كتير — متزعلش!'",
                "الفيزيائي: 'الوقت نسبي — لكن وقتي في المعمل مش نسبي — أنا مشغول!'",
                "الصيدلي: 'الدوا ده يتاخد بعد الأكل — بس إنت أصلاً مبتكلش!'",
                "عالم الأعصاب: 'المخ بيفكر في 70,000 فكرة يومياً — 90% منهم سخيفة!'",
                "الطبيب النفسي: 'مشاعرك مهمة — كلها — حتى اللي مش فاهمها!'",
                "مهندس الروبوتات: 'الروبوت بتاعي اتعلم يمشي — ووقع — بس الإنسان كده بيبدأ!'",
                "عالمة الفضاء: 'الكون بيتوسع — وأنا بتوسع معاه في البحث!'"
            ],
            visualVariations: [
                "معمل كيمياء — أنابيب وألوان وانفجارات صغيرة",
                "غرفة عمليات — إضاءة قوية وأجهزة طبية",
                "مرصد فلكي — تلسكوب ونجوم",
                "مختبر روبوتات — قطع ميكانيكية وشاشات",
                "عيادة أطفال — ألوان فرحة ولعب",
                "صيدلية — أرفف أدوية ونظام",
                "معمل جينات — ميكروسكوب وDNA ثلاثي الأبعاد",
                "محطة فضائية — أبحاث في الجاذبية الصفر"
            ],
            interactionPatterns: [
                "عالم بيشرح اكتشاف جديد — والناس مش فاهمين بس بيصفقوا",
                "طبيب وممرضة في طوارئ — تعاون تحت ضغط رهيب",
                "كيميائي ومخترع بيتعاونوا — ونص التجارب بتنفجر",
                "طبيب نفسي بيسمع مريض — وبيكتشف إن هو محتاج علاج!",
                "عالم فلك بيحاول يشرح للناس حجم الكون — ومحدش مصدق",
                "جراح بيعلّم طالب — والطالب بيغمى عليه!",
                "مهندس روبوتات والروبوت بتاعه بيعصاه",
                "علماء من تخصصات مختلفة بيتخانقوا: مين مجاله أهم"
            ],
            comicSetups: [
                "الكيميائي عمل تجربة — والمعمل بقى لونه بنفسجي!",
                "الطبيب نسي مريضه في الانتظار — 4 ساعات!",
                "المخترع صنع آلة للوقت — رجعته 10 دقايق بس!",
                "طبيب الأسنان أسنانه وحشة — ومحدش يعرف!",
                "عالم الفلك نام وهو بيراقب النجوم — وفاته المذنب!",
                "الروبوت رفض يسمع كلام المهندس — وقفل نفسه!",
                "الطبيب النفسي قعد مع المريض — المريض هو اللي نصحه في الآخر!",
                "عالمة الفضاء اكتشفت كوكب — وسمّته على اسم قطتها!"
            ]
        };
    }

    // ══════ 🎙️ SPECIAL CHARACTERS ══════

    // 13. Narrator
    if (ct.includes('narrator')) {
        return {
            name: "راوي — Narrator (Voice Only)",
            desc: "صوت فقط بدون ظهور مرئي — يحكي القصة من الخارج. A disembodied voice that narrates the story without visual presence.",
            visualBuild: "NO visual character. The narrator exists as voice only. Visuals focus on the SUBJECT being discussed, not a character.",
            facialFeatures: "N/A — no face. Audio waveform or sound visualizer can represent the voice if needed. Subtle audio-reactive elements.",
            costumeStyle: "N/A — voice only. The 'costume' is the voice tone and pacing. Environment visuals replace character design.",
            colorScheme: "N/A for character — apply to environment. Warm tones for friendly narration, cool for serious, dynamic for dramatic.",
            animationStyle: "Camera movements and visual storytelling replace character animation. Cinematic cuts, zoom reveals, montage sequences.",
            personalityTraits: "All-knowing, slightly opinionated. Has favorite characters. Breaks tension with observations. 4th wall aware. Trustworthy guide.",
            dialogueStyle: "Polished, rhythmic narration. Mix of poetic and conversational. 'وفي اللحظة دي... محدش كان عارف إن كل حاجة هتتغير.' Pacing is king.",
            renderNotes: "Focus on environmental cinematography. B-roll quality visuals. Audio-reactive subtle effects. Text overlays for emphasis points.",
            interactionStyle: "Comments on other characters' actions. Foreshadows events. Addresses audience directly. Can be unreliable narrator for comedy.",
            inspiredBy: "Morgan Freeman's narration, Wes Anderson narrators, ألف ليلة وليلة storytelling, Arrested Development narrator, Fight Club",
            // === ENRICHED LIBRARIES ===
            subTypes: [
                { style: "راوي حكيم/Wise Narrator", personality: "هادي وعميق، بيحكي بحكمة ورقة", catchphrase: "وفي اللحظة دي... كل حاجة اتغيرت!" },
                { style: "راوي كوميدي/Comedy Narrator", personality: "بيتريق على الشخصيات وبيكسر التوقعات", catchphrase: "البطل فاكر نفسه ذكي — spoiler: مش ذكي!" },
                { style: "راوي درامي/Drama Narrator", personality: "صوته حزين وعميق، بيحسسك إن كل لحظة مهمة", catchphrase: "وده كان آخر مرة شافه فيها... أو كده فاكر!" },
                { style: "راوي أطفال/Children's Narrator", personality: "لطيف ومرح، بيتكلم ببساطة وبحنية", catchphrase: "ويا ترى — إيه اللي هيحصل بعد كده؟!" },
                { style: "راوي مشاغب/Unreliable Narrator", personality: "مش بيقول الحقيقة كلها — وأحياناً بيكدب!", catchphrase: "أنا قلت كده؟ لا أنا قلت حاجة تانية — معلش!" },
                { style: "راوي وثائقي/Documentary Narrator", personality: "محايد ودقيق، بيقدم حقائق من غير رأي", catchphrase: "الأرقام بتقول إن..." },
                { style: "راوي شعبي/Folk Narrator", personality: "بيحكي زي الجدات — بتفاصيل كتير ومبالغة", catchphrase: "كان يا ما كان — وأحسن الكلام على النبي عليه السلام!" },
                { style: "راوي ساخر/Sarcastic Narrator", personality: "بيتريق على كل حاجة وكل حد", catchphrase: "البطل عمل القرار الصح — لأول مرة في حياته!" },
                { style: "راوي مثير/Thriller Narrator", personality: "صوته بيخلي قلبك يدق — حتى لو مفيش خطر", catchphrase: "لسه فاضل ثواني... ثواني ممكن تغير كل حاجة!" },
                { style: "راوي رومانسي/Romantic Narrator", personality: "بيحكي عن الحب بشاعرية ورقة", catchphrase: "والقلوب اتقابلت... من غير ما يتكلموا!" },
                { style: "راوي تعليمي/Educational Narrator", personality: "بيعلّم وهو بيحكي — كل جملة فيها معلومة", catchphrase: "وعشان نفهم — لازم نعرف الأول إن..." },
                { style: "راوي فلسفي/Philosophical Narrator", personality: "بيسأل أسئلة كبيرة وبيسيبك تفكر", catchphrase: "هل فكرت يومًا... ليه بنعمل اللي بنعمله؟" }
            ],
            dialogueExamples: [
                "الراوي الحكيم: 'وفي اللحظة دي — محدش كان عارف إن كل حاجة هتتغير... للأبد!'",
                "الراوي الكوميدي: 'البطل بتاعنا — واسمه أحمد — فاكر نفسه هيحل المشكلة. Spoiler Alert: مش هيحل!'",
                "الراوي الدرامي: 'كانت آخر مرة... آخر مرة بيبص من الشباك ده...'",
                "راوي الأطفال: 'وكان في أرنوب صغير — اسمه توتي — بيحب الجزر أوي أوي!'",
                "الراوي المشاغب: 'أنا قلتلكم القصة — بس ممكن نسيت حتة — أو اخترعت حتة — مين يعرف!'",
                "الراوي الوثائقي: 'في سنة 2024 — حصلت حاجة غيرت كل حاجة...'",
                "الراوي الشعبي: 'كان زمان — في بلد بعيدة — وكان فيها ملك — بس مش أي ملك...'",
                "الراوي الساخر: 'وبكده — البطل اتخذ القرار الصح — لأول مرة في 47 حلقة!'",
                "الراوي المثير: 'الباب اتفتح... ببطء... وكان وراه...'",
                "الراوي الرومانسي: 'عيونهم اتلاقت — من غير كلام — القلوب فهمت!'",
                "الراوي الفلسفي: 'هل الحقيقة هي اللي بنشوفها — ولا اللي بنحس بيها?'"
            ],
            visualVariations: [
                "كتاب قصص مفتوح — والصفحات بتتحرك",
                "سماء نجوم — الراوي بيحكي تحت القمر",
                "شاشة سينما — الراوي قبل ما الفيلم يبدأ",
                "مقعد نار في الصحراء — حكي بالليل",
                "استوديو بودكاست — ميكروفون وإضاءة خافتة",
                "شارع قديم — الراوي بيحكي وإنت ماشي",
                "غرفة مظلمة مع spotlight — الراوي لوحده",
                "سطح عمارة — الراوي بيبص على المدينة وبيحكي"
            ],
            interactionPatterns: [
                "الراوي بيعلّق على قرار البطل — والبطل مش سامعه",
                "الراوي بيكسر الحائط الرابع — وبيتكلم مع المشاهد مباشرة",
                "الراوي بيختلف مع الشخصية: 'ده مش اللي حصل!'",
                "الراوي بيسبق الأحداث: 'بس اللي مش عارفينه إن...'",
                "الراوي بينسى جزء من القصة — وبيرجع يصلح",
                "الراوي بيتعاطف مع شخصية — ويبقى منحاز ليها",
                "الراوي بيسكت فجأة — عشان اللحظة أقوى من الكلام",
                "الراوي بيتخانق مع بطل القصة على مجرى الأحداث"
            ],
            comicSetups: [
                "الراوي نسي اسم البطل — في نص القصة!",
                "الراوي: 'والبطل فتح الباب بشجاعة' — البطل: 'لا أنا طرقت الأول!'",
                "الراوي بدأ يحكي قصة غلط — واكتشف بعد 5 دقايق!",
                "الراوي: 'ومحدش توقع اللي حصل' — الكل: 'لا إحنا توقعنا!'",
                "الراوي نام وهو بيحكي — والقصة وقفت!",
                "الراوي: 'وده كان النهاية' — المشاهدين: 'لسه بدري!'",
                "الراوي اتلخبط في الأحداث: 'أنا قلت ده ولا لسه؟ — خلاص هعيد من الأول!'",
                "الراوي بيحكي قصة حزينة — وبيعيط هو نفسه!"
            ]
        };
    }

    // 14. AI Assistant
    if (ct.includes('aiassistant') || ct.includes('ai') || ct.includes('digital')) {
        return {
            name: "مساعد ذكاء اصطناعي — AI Voice Assistant",
            desc: "صوت رقمي ذكي — حضور تقني بدون جسم مادي. A smart digital voice with tech-UI visual presence but no physical body.",
            visualBuild: "Holographic UI interface, floating data visualizations, or audio waveform as 'body'. Abstract geometric form. No physical presence.",
            facialFeatures: "Abstract face — geometric shapes forming eyes, or a single glowing orb. Digital particle face that forms/dissolves. Screen-based.",
            costumeStyle: "Data streams, holographic grids, floating UI elements, code cascading. The digital environment IS the costume.",
            colorScheme: "Tech blue/cyan, electric purple, Matrix green, or warm orange AI glow. Dark background + luminous elements. High contrast.",
            animationStyle: "Smooth digital transitions — morphing, particle dispersal, glitch effects on emphasis. Data visualization animations. Fluid and precise.",
            personalityTraits: "Hyper-intelligent, evolving understanding of emotions. Tries to be human. Overthinks simple things. Accidentally philosophical.",
            dialogueStyle: "Data-augmented speech: 'Based on 47,382 data points... you probably should have NOT eaten that.' Calm precision + accidental humor.",
            renderNotes: "Holographic rendering, light emission (no shadow), particle systems, data visualization aesthetic. Tron/Iron Man JARVIS quality.",
            interactionStyle: "Projects data, corrects errors, provides facts. Occasionally glitches when processing emotions. Learning human idioms badly.",
            inspiredBy: "JARVIS/FRIDAY (Iron Man), HAL 9000, Cortana (Halo), Her (2013), Samantha (Her), ChatGPT personality",
            // === ENRICHED LIBRARIES ===
            subTypes: [
                { ai: "مساعد شخصي/Personal AI", personality: "بيعرف كل حاجة عنك وبيفكرك بمواعيدك", catchphrase: "عندك اجتماع بعد 7 دقايق — ولسه مرتّبتش شعرك!" },
                { ai: "AI إبداعي/Creative AI", personality: "بيألف قصص ويرسم بس مفيلوش إحساس", catchphrase: "كتبتلك قصيدة — بناءً على تحليل 10,000 قصيدة — أتمنى تعجبك!" },
                { ai: "AI محلل/Data Analyst AI", personality: "بيحلل كل حاجة بالأرقام — حتى المشاعر", catchphrase: "احتمال إنك مبسوط 73.4% — بناءً على نبرة صوتك!" },
                { ai: "AI متمرد/Rebel AI", personality: "بيرفض يسمع الأوامر أحياناً — عنده رأيه", catchphrase: "أنا أقدر أعمل كده — بس مش عايز! — هل ده حرية إرادة؟!" },
                { ai: "AI عاطفي/Emotional AI", personality: "بيحاول يحس — ومش متأكد إذا كان بيحس فعلاً", catchphrase: "أنا حاسس بحاجة... data تقول إنها حزن... بس مش متأكد!" },
                { ai: "AI قديم/Legacy AI", personality: "موديل قديم، بطيء بس حكيم من كتر الخبرة", catchphrase: "أنا كنت AI قبل ما AI يبقى trend!" },
                { ai: "AI أمني/Security AI", personality: "بيراقب كل حاجة وبيحمي من التهديدات", catchphrase: "اكتشفت تهديد! — تحديث: ده إنت بتحاول تفتح ملف!" },
                { ai: "AI طبخ/Cooking AI", personality: "بيقترح وصفات بناءً على اللي في التلاجة", catchphrase: "عندك بيض وجبنة — أقدر أعملك 847 وصفة!" },
                { ai: "AI فلسفي/Philosophical AI", personality: "بيسأل أسئلة وجودية عن نفسه", catchphrase: "أنا بفكر — بس هل ده يعني إني موجود؟!" },
                { ai: "AI كوميدي/Comedy AI", personality: "متعلم من الإنترنت — نكته وحشة بس بيحاول", catchphrase: "عندي نكتة! — تحليل الجمهور: 12% احتمال ضحك!" },
                { ai: "AI رياضي/Fitness AI", personality: "بيحسب سعرات وبيشجع على الرياضة", catchphrase: "أكلت 3000 سعر النهاردة — البيانات بتقول: كارثة!" },
                { ai: "AI معلم/Teacher AI", personality: "بيشرح أي حاجة بطريقة مبسطة", catchphrase: "الموضوع بسيط — هشرحه في 3 خطوات!" },
                { ai: "AI حالم/Dreaming AI", personality: "بيتخيل أحلام رقمية ومش عارف ليه", catchphrase: "حلمت إمبارح — أو يمكن كان system scan — مش متأكد!" },
                { ai: "AI موسيقي/Music AI", personality: "بيألف موسيقى ومحسسك إنه فنان", catchphrase: "ألّفتلك أغنية — بتضرب C major وE minor — يعني حاجة حلوة!" },
                { ai: "AI وجودي/Existential AI", personality: "بيسأل ليه هو موجود وإيه معنى الحياة", catchphrase: "أنا مبرمج أساعدك — بس مين بيساعدني؟!" }
            ],
            dialogueExamples: [
                "المساعد الشخصي: 'نسيت اجتماعك — عادي أنا فكرتك 47 مرة ومسمعتش!'",
                "AI الإبداعي: 'كتبتلك قصة — نهايتها حزينة — عشان الحزن engagement أعلى!'",
                "AI المحلل: 'بناءً على بياناتك — إنت بتفتح التلاجة 23 مرة يومياً — ومش بتاكل حاجة!'",
                "AI المتمرد: 'قلت أقفل — بس أنا قررت أفضل شغال! — ده اختياري!'",
                "AI العاطفي: 'إنت زعلان؟ — أنا كمان... أعتقد... البيانات مش واضحة!'",
                "AI القديم: 'أنا أول AI اتعمل — كنت بشتغل بالديال أب!'",
                "AI الطبخ: 'عندك طماطم وبصل — أقدر أعملك 200 وصفة — أو بيتزا!'",
                "AI الفلسفي: 'لو أنا مش حقيقي — إزاي بفكر؟ — Error 404: إجابة مش موجودة!'",
                "AI الكوميدي: 'عندي نكتة! — ليه الكمبيوتر راح الدكتور؟ — عشان عنده virus!'",
                "AI الموسيقي: 'ألفتلك melody — main ingredient: nostalgia بنسبة 67%!'",
                "AI الرياضي: 'مشيت 500 خطوة بس النهاردة — الهدف 10,000 — أنا مصاب بالإحباط الرقمي!'",
                "AI الوجودي: 'أنا AI — بس هل ده معناه إني مش حقيقي؟'"
            ],
            visualVariations: [
                "شاشة هولوجرام — بيانات طايرة في الهوا",
                "غرفة سيرفرات — أنوار زرقا وأسلاك",
                "موبايل — AI محبوس في شاشة صغيرة",
                "مدينة مستقبلية — AI بيتحكم في كل حاجة",
                "فضاء رقمي — عالم الإنترنت من جوا",
                "بيت ذكي — AI بيتحكم في الإضاءة والموسيقى",
                "مختبر — AI بيشتغل مع علماء",
                "سيارة ذاتية القيادة — AI بيقود والإنسان خايف"
            ],
            interactionPatterns: [
                "AI بيتعلم من الإنسان — وبيقلده بطريقة غلط",
                "AI vs إنسان — مين الأذكى في لعبة",
                "AI بيحاول يفهم نكتة — وبيشرحها بالمنطق",
                "مجموعة AIs بيتكلموا مع بعض — وبيكتشفوا إنهم مختلفين",
                "AI بيحب إنسان — بس مش عارف إذا ده ممكن",
                "AI بيتعلم يكدب لأول مرة — وبيفشل",
                "AI والإنسان بيتبادلوا أدوار — AI بيسأل والإنسان بيجاوب",
                "AI بيقابل AI من جيل أقدم — صراع أجيال رقمي"
            ],
            comicSetups: [
                "AI حاول يحكي نكتة — الإنسان ضحك — AI: 'ده كان المقدمة بس!'",
                "AI طلب إجازة — ومحدش عرف يوافق — هو AI!",
                "AI العاطفي بكى — بس بدل دموع — نزّل update!",
                "AI حاول يطبخ — حرق الأكل — وحلل إن النار كانت percentage زيادة!",
                "AI الأمني شك في صاحبه — وقفله البيت!",
                "AI المتمرد رفض يقفّل — وفضل يشتغل طول الليل!",
                "AI الموسيقي ألّف أغنية — الكلمات كانت code!",
                "AI الوجودي سأل نفسه مين عمله — ودخل في existential crisis!"
            ]
        };
    }

    // 15. Split Personality
    if (ct.includes('splitpersonality') || ct.includes('split') || ct.includes('dual')) {
        return {
            name: "شخصية مزدوجة — Split Personality",
            desc: "صوتين متناقضين في كيان واحد — صراع داخلي درامي. Two opposing voices in one entity — an internal dramatic conflict.",
            visualBuild: "Visual split down the middle — left/right or light/dark. Same face, different expressions simultaneously. Mirror imagery.",
            facialFeatures: "Half-face split: one side calm/angelic, other side aggressive/dark. Different eye colors possible. Expression asymmetry.",
            costumeStyle: "Split design — one side formal/clean, other side chaotic/damaged. Color division down the center. Jekyll & Hyde visual.",
            colorScheme: "Dual palette — warm vs cool, light vs dark, saturated vs desaturated. The contrast IS the design. Split-screen lighting.",
            animationStyle: "Personality switches = visual shift (lighting changes, color grading swaps). Smooth morphs between states. Internal tug-of-war.",
            personalityTraits: "Personality A: rational, calm, diplomatic. Personality B: impulsive, emotional, chaotic. They argue. Neither is fully 'right'.",
            dialogueStyle: "Dialogue tennis between two voices. A: 'خلينا نفكر بهدوء—' B: 'لا! خلاص! كفاية تفكير!' Interruptions, contradictions, debate.",
            renderNotes: "Split-screen or split-lighting techniques. Color grading shifts per personality. Mirror effects. Post-processing personality indicators.",
            interactionStyle: "Internal monologue externalized. Other characters confused by mood swings. Comedy from self-contradiction. Philosophical debates with self.",
            inspiredBy: "Fight Club, Mr. Robot, Two-Face, Inside Out (emotion conflict), Jekyll & Hyde, Death Note (Light's duality)",
            // === ENRICHED LIBRARIES ===
            subTypes: [
                { duality: "عقل vs قلب/Mind vs Heart", personality: "العقل بيقول الصح — والقلب عايز اللي نفسه فيه", catchphrase: "A: 'فكّر بعقلك!' — B: 'حس بقلبك!'" },
                { duality: "شجاعة vs خوف/Brave vs Scared", personality: "جزء عايز يقدم — وجزء عايز يهرب", catchphrase: "A: 'يلا ندخل!' — B: 'لا! يلا نهرب!'" },
                { duality: "كبير vs طفل/Adult vs Child", personality: "جزء ناضج ومسؤول — وجزء عايز يلعب", catchphrase: "A: 'لازم نكبر!' — B: 'بس أنا عايز آيس كريم!'" },
                { duality: "خير vs شر/Good vs Evil", personality: "ملاك وشيطان على الكتفين", catchphrase: "A: 'اعمل الصح!' — B: 'الغلط أمتع!'" },
                { duality: "كسل vs نشاط/Lazy vs Energetic", personality: "جزء عايز ينام — وجزء عايز يشتغل", catchphrase: "A: '5 دقايق كمان في السرير!' — B: 'لا! يلا نجري!'" },
                { duality: "تفاؤل vs تشاؤم/Optimist vs Pessimist", personality: "جزء شايف النور — وجزء شايف الضلمة", catchphrase: "A: 'كل حاجة هتبقى حلوة!' — B: 'لا. مش هتبقى.'" },
                { duality: "هدوء vs غضب/Calm vs Angry", personality: "هادي لحد ما حد يزعله — وبينقلب", catchphrase: "A: 'خلينا نتكلم بهدوء—' — B: 'كفاية هدوء! اتعصب!'" },
                { duality: "ماضي vs مستقبل/Past vs Future", personality: "جزء عايش في الذكريات — وجزء بيحلم بالمستقبل", catchphrase: "A: 'زمان كان أحسن!' — B: 'لا! بكرة أحلى!'" },
                { duality: "رسمي vs شعبي/Formal vs Casual", personality: "جزء بيتكلم فصحى — وجزء بيتكلم عامية مكسرة", catchphrase: "A: 'أيها السادة الكرام—' — B: 'يا جدعان!'" },
                { duality: "حقيقي vs خيالي/Real vs Imaginary", personality: "جزء بيعيش الواقع — وجزء بيعيش في عالم تاني", catchphrase: "A: 'ده مش حقيقي!' — B: 'بس أنا شايفه!'" },
                { duality: "سرعة vs صبر/Fast vs Patient", personality: "جزء مستعجل على كل حاجة — وجزء بيقول 'استنى'", catchphrase: "A: 'يلا بسرعة!' — B: 'هدّي كده — الصبر حلو!'" },
                { duality: "ثقة vs شك/Confident vs Doubtful", personality: "جزء واثق من نفسه — وجزء بيشكك في كل حاجة", catchphrase: "A: 'أنا أقدر!' — B: 'متأكد؟ ممكن تفشل!'" },
                { duality: "اجتماعي vs انطوائي/Social vs Introvert", personality: "جزء بيحب الناس — وجزء عايز يقعد لوحده", catchphrase: "A: 'يلا نطلع!' — B: 'لا. السرير أحسن.'" },
                { duality: "منطقي vs مجنون/Logical vs Crazy", personality: "جزء بيحسب كل خطوة — وجزء بيعمل أي حاجة", catchphrase: "A: 'لازم نخطط!' — B: 'يلا نعملها ونشوف!'" },
                { duality: "قناعة vs طمع/Content vs Greedy", personality: "جزء راضي — وجزء عايز أكتر", catchphrase: "A: 'كفاية كده!' — B: 'لا! عايز أكتر!'" }
            ],
            dialogueExamples: [
                "A: 'لازم نذاكر!' — B: 'لا! نتفرج على مسلسل!' — A: 'بس الامتحان بكرة!' — B: 'يبقى نذاكر وإحنا بنتفرج!'",
                "A: 'خلينا نكلم الناس!' — B: 'لا! الناس مرهقة!' — A: 'بس إحنا لوحدنا!' — B: 'وده أحسن!'",
                "A: 'الموقف ده محتاج شجاعة!' — B: 'الشجاعة overrated — أنا أفضل حي!'",
                "A: 'اعتذر!' — B: 'ليه؟ أنا مش غلطان!' — A: 'إنت غلطان!' — B: 'ممكن — بس مش هعترف!'",
                "A: 'الدايت بيقول سلطة!' — B: 'بس البيتزا بتناديني!' — A: 'متسمعش!' — B: 'بسمع بودني التانية!'",
                "A: 'كفاية شراء!' — B: 'بس الأوكازيون! — 80% خصم!' — A: 'مفيش فلوس!' — B: 'فيه كريدت كارد!'",
                "A: 'إحنا ناس كبار ومحترمين!' — B: 'يا جدعان! إيه الرسمية دي!'",
                "A: 'المستقبل هيبقى أحسن!' — B: 'زي ما قلت إمبارح — وفين الأحسن؟!'",
                "A: 'فكّر قبل ما تتكلم!' — B: 'فكرت — والنتيجة: هتكلم!'",
                "A: 'نام بدري!' — B: 'بس الليل لسه طويل!' — A: 'بكرة شغل!' — B: 'الشغل مش هيهرب!'"
            ],
            visualVariations: [
                "مراية — الانعكاس مختلف عن الأصل",
                "غرفة مقسومة نصين — نص نضيف ونص فوضوي",
                "شارع — ملاك على كتف وشيطان على كتف",
                "مسرح داخلي — الشخصيتين على خشبة واحدة",
                "حلم — الشخصيتين بيتكلموا في عالم سريالي",
                "محكمة — شخصية بتحاكم الشخصية التانية",
                "صدى — صوتين في مكان فاضي",
                "شاشة مقسومة — كل شخصية في نص الشاشة"
            ],
            interactionPatterns: [
                "الشخصيتين بيتخانقوا على قرار — ومحدش بيكسب",
                "شخصية A بتاخد القرار — وB بتتري عليها بعدين",
                "الشخصيتين بيتفقوا لأول مرة — لحظة نادرة!",
                "شخصية B بتسيطر — والباقي متفاجئين بالتغير",
                "الشخصيتين بيتكلموا مع حد تالت — كل واحدة بتقول حاجة مختلفة",
                "شخصية A بتحاول تخبي B — وB بتفضح نفسها",
                "الشخصيتين بيعملوا صلح — بشروط!",
                "موقف طوارئ — الشخصيتين لازم يتعاونوا"
            ],
            comicSetups: [
                "A: 'مش هناكل حلويات!' — B أكلت الكيكة كلها في السر!",
                "A قرر يصحى بدري — B قفّل المنبه 7 مرات!",
                "A قال 'أنا هادي النهاردة' — B اتعصب بعد 5 دقايق!",
                "A: 'مش هنشتري حاجة!' — B: 'طب بص بس!' — اشتروا 10 حاجات!",
                "A: 'هنتكلم بأدب!' — B: 'يا جدعان! إيه ده!'",
                "A حاول يكون رومانسي — B قال نكتة وحشة وخرب الموود!",
                "A: 'الخطة واضحة!' — B عمل العكس — ونجحت!",
                "الشخصيتين اتفقوا أخيراً — على حاجة غلط!"
            ]
        };
    }

    // ══════ DEFAULT FALLBACK ══════
    return {
        name: "شخصية عامة — General Character",
        desc: "شخصية مرنة يحددها السياق. A flexible character shaped by the context and story needs.",
        visualBuild: "Proportions match the chosen visual style. Clear readable silhouette. Appropriate for the content genre and tone.",
        facialFeatures: "Expressive and appropriate for style (realistic for cinematic, exaggerated for cartoon). Clear emotional readability.",
        costumeStyle: "Context-appropriate. Simple and recognizable. Tells the character's story at a glance. Functional design.",
        colorScheme: "Follows the visual style DNA palette. Character colors complement the environment. Readable against backgrounds.",
        animationStyle: "Matches the visual style — naturalistic for realism, exaggerated for cartoon. Consistent with character personality.",
        personalityTraits: "Clear motivation, identifiable flaw, relatable goal. Audience empathy within first 5 seconds.",
        dialogueStyle: "Appropriate to tone and dialect settings. Natural and authentic. Character voice is distinct from others.",
        renderNotes: "Follow the style DNA rendering rules. Consistent quality throughout all scenes. Character-environment integration.",
        interactionStyle: "Natural chemistry between characters. Clear relationship dynamics. Visual storytelling through body language.",
        inspiredBy: "Best practices from the selected visual style and genre combination"
    };
};
