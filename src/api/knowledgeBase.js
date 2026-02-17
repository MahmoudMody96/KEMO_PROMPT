// ============================================================
// SMART KNOWLEDGE BASE v1.0
// Provides domain-specific knowledge for characters/food/objects
// Used by generateIdeaPrompt & generateSystemPrompt
// ============================================================

// --- FOOD KNOWLEDGE DATABASE ---
const FOOD_KNOWLEDGE = {
    // VEGETABLES & FRUITS
    tomato: {
        facts: ["Tomatoes are technically berries", "Originally from South America, brought to Europe in 1500s", "Contains lycopene — a powerful antioxidant"],
        visual_keywords: "glossy red skin, water droplets, vine-attached stem, juicy cross-section, vibrant red pulp",
        personality_traits: "Dramatic, emotional, turns red when angry, juicy personality",
        cooking_techniques: ["roasting", "sun-drying", "making sauce", "salad slicing"],
    },
    potato: {
        facts: ["4th most consumed crop worldwide", "Has more potassium than bananas", "Can be cooked 100+ ways"],
        visual_keywords: "rough brown skin, earthy texture, golden when fried, fluffy when baked, crispy edges",
        personality_traits: "Humble, versatile, underestimated but powerful, street-smart",
        cooking_techniques: ["frying", "baking", "mashing", "boiling"],
    },
    onion: {
        facts: ["Has natural antibacterial properties", "Ancient Egyptians worshipped onions", "Layers represent complexity"],
        visual_keywords: "translucent layers, purple/golden skin, teardrop-shaped, caramelized golden rings",
        personality_traits: "Makes everyone cry, has layers (like Shrek), tough exterior soft interior",
        cooking_techniques: ["caramelizing", "deep frying rings", "pickling", "sautéing"],
    },
    garlic: {
        facts: ["Used as medicine for 5000 years", "Repels vampires (and bad dates)", "One bulb has 10-20 cloves"],
        visual_keywords: "papery white skin, clustered cloves, golden when roasted, aromatic steam",
        personality_traits: "Small but mighty, legendary fighter, strong presence, unforgettable",
        cooking_techniques: ["roasting whole", "mincing", "crushing", "confit"],
    },
    lemon: {
        facts: ["Can conduct electricity", "Contains more sugar than strawberries", "Natural bleaching agent"],
        visual_keywords: "bright yellow rind, citrus spray mist, seed cross-section, zest curls",
        personality_traits: "Sour attitude, brightens everything, life gives you lemons energy",
        cooking_techniques: ["juicing", "zesting", "preserving", "garnishing"],
    },
    carrot: {
        facts: ["Originally purple, not orange", "The orange color was bred by Dutch farmers", "High in Vitamin A for eyes"],
        visual_keywords: "vibrant orange, green leafy top, crunchy snap, soil-dusted",
        personality_traits: "Health-obsessed, always positive, can see in the dark jokes",
        cooking_techniques: ["roasting", "juicing", "grating", "glazing"],
    },
    eggplant: {
        facts: ["Member of nightshade family", "90% water", "Sponge-like texture absorbs flavors"],
        visual_keywords: "deep purple glossy skin, green cap, creamy white interior, charred skin",
        personality_traits: "Elegant, mysterious, absorbs everything around it, adaptable",
        cooking_techniques: ["grilling", "smoking (baba ghanoush)", "frying", "stuffing"],
    },

    // FAST FOOD
    burger: {
        facts: ["Americans eat 50 billion burgers/year", "The Big Mac has a 'secret sauce'", "First burger: 1900s USA"],
        visual_keywords: "stacked layers, melting cheese drip, sesame bun, crispy lettuce peek, juice dripping",
        personality_traits: "Popular, all-American, stacked with ambition, layered personality",
        cooking_techniques: ["grilling", "smashing on griddle", "flame-broiling"],
    },
    pizza_slice: {
        facts: ["Originated in Naples, Italy", "Most popular food in the world", "First pizza delivery: 1889 to Italian Queen"],
        visual_keywords: "stretching cheese pull, crispy golden crust, bubbling toppings, triangular shape, grease shine",
        personality_traits: "Everyone's favorite, cheesy humor, always there for you at 2AM",
        cooking_techniques: ["stone oven baking", "wood-fired", "hand-tossing dough"],
    },
    fries: {
        facts: ["Belgian invention, not French", "McDonald's fries have 19 ingredients", "Perfect fry: double-fried"],
        visual_keywords: "golden crispy sticks, salt crystals, ketchup dip, steam rising, perfectly uniform",
        personality_traits: "Addictive, always wants to be in a group, salty attitude",
        cooking_techniques: ["double frying", "air frying", "seasoning"],
    },
    fried_chicken: {
        facts: ["KFC recipe has 11 herbs and spices", "Southern US tradition", "Crispy coating = buttermilk + flour"],
        visual_keywords: "golden crispy crust, juicy interior reveal, steam burst, crunchy texture detail",
        personality_traits: "Crunchy exterior, tender heart, Southern charm, finger-lickin' good",
        cooking_techniques: ["deep frying", "pressure cooking", "brining", "buttermilk soaking"],
    },

    // EGYPTIAN & ORIENTAL
    koshary: {
        facts: ["Egypt's national dish", "Mix of 7+ ingredients from 4 continents", "Costs less than $1 street-side"],
        visual_keywords: "layered rice-pasta-lentils, crispy onion topping, red tomato sauce drizzle, chickpeas scattered",
        personality_traits: "Proud Egyptian, multicultural soul, feeds everyone equally, street champion",
        cooking_techniques: ["layering", "crispy onion frying", "tomato sauce making", "vinegar garlic dakkah"],
    },
    falafel: {
        facts: ["Ancient Egyptian recipe (1000+ years)", "Made from fava beans in Egypt (not chickpeas)", "Deep fried to perfection"],
        visual_keywords: "golden-green crispy ball, herb-flecked interior, oil bubbles, tahini drizzle",
        personality_traits: "Classic Egyptian, small but filling, golden heart, morning person",
        cooking_techniques: ["deep frying", "herb mixing", "tahini pairing"],
    },
    shawarma: {
        facts: ["Originally Turkish döner kebab", "Meat rotates on vertical spit for hours", "50+ spices in marinade"],
        visual_keywords: "rotating meat cone, thin-sliced layers, pita wrap, garlic sauce drizzle, golden crispy edges",
        personality_traits: "Sophisticated, always spinning, well-seasoned, late-night hero",
        cooking_techniques: ["vertical spit roasting", "thin slicing", "marinating", "wrapping"],
    },

    // DESSERTS
    kunafa: {
        facts: ["Origin: Nablus, Palestine", "Made with shredded phyllo dough", "Soaked in sugar syrup"],
        visual_keywords: "golden crispy top, stretching cheese center, sugar syrup drizzle, pistachios sprinkled",
        personality_traits: "Sweet royalty, crunchy outside soft inside, celebration star",
        cooking_techniques: ["baking", "syrup soaking", "cheese stretching", "butter crisping"],
    },
    basbousa: {
        facts: ["Semolina-based Egyptian dessert", "Soaked in rosewater syrup", "Each piece topped with almond"],
        visual_keywords: "golden semolina squares, syrup-soaked glistening, almond centerpiece, diamond-cut pattern",
        personality_traits: "Traditional, sweet grandmother energy, soaks up all the love",
        cooking_techniques: ["baking", "syrup soaking", "diamond cutting"],
    },

    // DRINKS
    coffee_cup: {
        facts: ["2.25 billion cups consumed daily worldwide", "Ethiopian origin legend", "Caffeine takes 20 min to kick in"],
        visual_keywords: "rising steam swirls, latte art, dark liquid, ceramic cup, foam texture",
        personality_traits: "Morning boss, bitter but necessary, keeps everyone awake, sophisticated",
        cooking_techniques: ["brewing", "espresso pulling", "latte art pouring"],
    },
    tea_glass: {
        facts: ["Most consumed drink after water", "Egyptian koshary tea tradition", "Mint tea = Egyptian hospitality"],
        visual_keywords: "amber liquid, transparent glass, sugar dissolving, mint leaf floating, steam wisps",
        personality_traits: "Calm, patient, brings people together, Egyptian tradition keeper",
        cooking_techniques: ["brewing", "steeping", "mint infusing"],
    },

    // BAKERY
    bread_loaf: {
        facts: ["Oldest prepared food (30,000 years)", "Egypt was called 'Land of Bread'", "'Eish' means both 'bread' and 'life' in Arabic"],
        visual_keywords: "golden crust, flour-dusted, steam from fresh cut, soft white interior, scoring pattern",
        personality_traits: "Essential, humble hero, staff of life, connects all meals",
        cooking_techniques: ["kneading", "proofing", "baking", "scoring"],
    },

    // PROTEINS
    egg: {
        facts: ["A hen lays ~300 eggs/year", "Shell has 17,000 tiny pores", "Can tell fresh by water float test"],
        visual_keywords: "smooth white shell, golden yolk center, cracking moment, sunny-side-up perfection",
        personality_traits: "Fragile exterior, golden heart, full of potential, cracks under pressure",
        cooking_techniques: ["boiling", "frying", "scrambling", "poaching"],
    },
    steak: {
        facts: ["Wagyu beef can cost $200/lb", "Perfect sear: 450°F cast iron", "Resting = juicier meat"],
        visual_keywords: "seared grill marks, pink center, butter melting on top, rosemary garnish, juices pooling",
        personality_traits: "Premium, rare (literally), high-maintenance, sizzling personality",
        cooking_techniques: ["searing", "resting", "reverse searing", "sous vide"],
    },
};

// --- OBJECT KNOWLEDGE DATABASE ---
const OBJECT_KNOWLEDGE = {
    // KITCHEN
    frying_pan: {
        facts: ["Cast iron pans get better with age", "Non-stick invented accidentally in 1938", "A good pan lasts 50+ years"],
        visual_keywords: "sizzling oil surface, black cast iron, wooden handle, food tossing mid-air",
        personality_traits: "Hot-tempered, sizzling personality, things always cooking, gets better with age",
    },
    knife: {
        facts: ["Japanese knives sharpened to 15° angle", "Damascus steel has 67+ layers", "A sharp knife is safer than a dull one"],
        visual_keywords: "gleaming blade edge, Damascus pattern, chopping motion blur, precision cuts",
        personality_traits: "Sharp-witted, precise, cutting-edge thinker, dual-sided",
    },
    refrigerator: {
        facts: ["Runs 24/7/365", "Keeps food at 37°F (3°C)", "First home fridge: 1913"],
        visual_keywords: "cold blue interior light, organized shelves, frost crystals, door opening glow",
        personality_traits: "Always cool, keeps secrets (leftovers), never sleeps, reliable guardian",
    },

    // ELECTRONICS
    smartphone: {
        facts: ["Average person checks phone 96 times/day", "More computing power than Apollo 11", "3.5 billion users worldwide"],
        visual_keywords: "glowing screen, notification badges, fingerprint on glass, app grid",
        personality_traits: "Attention-seeking, knows everything, addictive personality, always on",
    },
    headphones: {
        facts: ["First headphones: 1910, weighed 10 lbs", "Noise cancelling uses anti-phase waves", "Can cause hearing loss above 85dB"],
        visual_keywords: "cushioned ear cups, LED indicator, cable coil, bass vibration waves",
        personality_traits: "Good listener, isolates from the world, lives in their own world, rhythmic",
    },

    // SPORTS
    soccer_ball: {
        facts: ["Official ball has 32 panels", "World Cup most watched event (3.5B viewers)", "Ball travels up to 80 mph on kick"],
        visual_keywords: "black and white hexagons, grass-stained, spinning in air, goal net bulge",
        personality_traits: "Team player, always getting kicked around, bounces back, world-famous",
    },

    // HOME
    lamp: {
        facts: ["Edison's first bulb lasted 13.5 hours", "LED lasts 50,000 hours", "Light affects mood and productivity"],
        visual_keywords: "warm golden glow, lampshade shadow patterns, filament detail, cozy atmosphere",
        personality_traits: "Bright ideas, lights up the room, warm personality, guiding light",
    },
    mirror: {
        facts: ["First mirrors were polished obsidian (6000 BC)", "Reflects 95% of light", "Two-way mirrors exist"],
        visual_keywords: "reflection clarity, ornate frame, foggy condensation, light bounce",
        personality_traits: "Honest (sometimes too honest), reflects everything, self-aware, mysterious",
    },
    clock: {
        facts: ["Oldest clock: 3500 BC sundial", "Big Ben is actually the bell, not the clock", "Atomic clocks lose 1 second per 300M years"],
        visual_keywords: "ticking hands, Roman numerals, pendulum swing, midnight moment",
        personality_traits: "Always on time, never stops, hands always moving, ticks people off",
    },
};

// --- ASPECT RATIO VISUAL RULES ---
const ASPECT_RATIO_RULES = {
    '9:16': {
        name: 'Vertical (TikTok/Reels/Shorts)',
        visual_rules: `
🎬 **VERTICAL FORMAT RULES (9:16):**
- Close-ups and medium shots DOMINATE (80% of scenes)
- Character faces centered vertically
- Text overlays: top 10% and bottom 15% safe zones
- NO wide establishing shots — they look tiny on mobile
- Use vertical movement (top-to-bottom reveals, falling objects)
- Background should be simple/blurred — focus on subject
- Camera: mostly eye-level and low-angle
`,
        scene_prompt_note: "VERTICAL 9:16 composition, close-up framing, centered subject, mobile-optimized"
    },
    '16:9': {
        name: 'Horizontal (YouTube/Cinema)',
        visual_rules: `
🎬 **CINEMATIC FORMAT RULES (16:9):**
- Wide establishing shots welcome (show environment)
- Rule of thirds composition — never center everything
- Use depth of field — foreground/midground/background layers
- Cinematic letterbox feel — epic and dramatic
- Camera: dolly shots, tracking, crane movements
- Multiple characters can share frame side-by-side
`,
        scene_prompt_note: "WIDESCREEN 16:9 cinematic composition, rule of thirds, depth of field"
    },
    '1:1': {
        name: 'Square (Instagram/Facebook)',
        visual_rules: `
🎬 **SQUARE FORMAT RULES (1:1):**
- Centered compositions — symmetry works best
- Medium shots preferred — not too wide, not too tight
- Minimal negative space — fill the frame
- Text overlays within center 80% of frame
- Camera: mostly static or slow pan — no fast movements
`,
        scene_prompt_note: "SQUARE 1:1 composition, centered framing, symmetrical layout"
    },
    '4:5': {
        name: 'Portrait (Instagram Feed)',
        visual_rules: `
🎬 **PORTRAIT FORMAT RULES (4:5):**
- Slightly vertical — good for single character focus
- Head-to-waist framing works best
- Some environment visible — not as tight as 9:16
- Camera: mostly static or gentle movement
`,
        scene_prompt_note: "PORTRAIT 4:5 composition, head-to-waist framing, slight vertical emphasis"
    }
};


// === PUBLIC API ===

/**
 * Get knowledge about a specific character/food/object
 * @param {string} specificObject - The specific item value (e.g., 'tomato', 'frying_pan')
 * @param {string} characterType - The character type string from UI
 * @returns {string} Knowledge injection text for prompts
 */
export function getCharacterKnowledge(specificObject, characterType) {
    if (!specificObject) return '';

    // Normalize the key — handle both value format and label format
    const key = specificObject.toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z_]/g, '');

    // Try exact match first
    let knowledge = FOOD_KNOWLEDGE[key] || OBJECT_KNOWLEDGE[key];

    // Try partial match if exact fails
    if (!knowledge) {
        const allKeys = [...Object.keys(FOOD_KNOWLEDGE), ...Object.keys(OBJECT_KNOWLEDGE)];
        const partialMatch = allKeys.find(k => key.includes(k) || k.includes(key));
        if (partialMatch) {
            knowledge = FOOD_KNOWLEDGE[partialMatch] || OBJECT_KNOWLEDGE[partialMatch];
        }
    }

    if (!knowledge) return '';

    let injection = `
🧠 **CHARACTER KNOWLEDGE INJECTION (Use This Intel!):**
📦 **Subject:** ${specificObject}
`;

    if (knowledge.facts) {
        injection += `\n📚 **Real Facts (MUST use 1-2 in each idea/scene):**\n${knowledge.facts.map(f => `• ${f}`).join('\n')}\n`;
    }
    if (knowledge.visual_keywords) {
        injection += `\n🎨 **Visual Keywords (for scene_prompt):**\n${knowledge.visual_keywords}\n`;
    }
    if (knowledge.personality_traits) {
        injection += `\n🎭 **Personality Traits (for dialogue & character):**\n${knowledge.personality_traits}\n`;
    }
    if (knowledge.cooking_techniques) {
        injection += `\n👨‍🍳 **Techniques (for cooking genre):**\n${knowledge.cooking_techniques.map(t => `• ${t}`).join(', ')}\n`;
    }

    injection += `\n⚡ **RULE:** Use these facts and visuals to create AUTHENTIC, KNOWLEDGE-RICH content. Don't make up random facts!\n`;

    return injection;
}

/**
 * Get aspect ratio visual rules
 * @param {string} aspectRatio - e.g., '16:9', '9:16', '1:1'
 * @returns {object} { rules: string, sceneNote: string }
 */
export function getAspectRatioRules(aspectRatio) {
    const ratio = ASPECT_RATIO_RULES[aspectRatio] || ASPECT_RATIO_RULES['16:9'];
    return {
        rules: ratio.visual_rules,
        sceneNote: ratio.scene_prompt_note
    };
}

