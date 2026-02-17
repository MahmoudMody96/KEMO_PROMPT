// VISUAL STYLE DNA ENGINE v1.0
// Extracted from promptApi.js

// ═══════════════════════════════════════════════════════════════════
// 🎨 VISUAL STYLE DNA ENGINE v1.0
// كل نمط بصري ليه "حمض نووي" كامل يحدد شخصيته البصرية
// ═══════════════════════════════════════════════════════════════════
export const getStyleDNA = (style) => {
    const s = (style || '').toLowerCase();

    // ─────────────────────────────────────────
    // 🏰 3D & ANIMATION STYLES
    // ─────────────────────────────────────────

    // 1. Disney Pixar 3D | ديزني بيكسار
    if (s.includes('pixar') || s.includes('disney')) {
        return {
            name: "Disney Pixar 3D | ديزني بيكسار 3D",
            desc: "عالم 3D ملون ودافي بجودة أفلام بيكسار — شخصيات معبّرة وإضاءة سينمائية",
            colorPalette: "Vibrant saturated primaries (Pixar palette), warm golden highlights, soft pastel accents. Rich but not neon. Warm skin tones with subsurface scattering.",
            lighting: "Warm key light (golden hour feel), soft fill with bounce light, rim light for character separation. Volumetric god rays through windows/trees. Soft ambient occlusion.",
            camera: "Medium close-ups for emotion, wide establishing shots for wonder. Slow dolly-in for dramatic reveals. Shallow DoF on character eyes. Over-the-shoulder for dialogue.",
            renderKeywords: "Pixar 3D style, Octane render, subsurface scattering, volumetric lighting, global illumination, 8K, Disney quality, --stylize 750",
            negativePrompt: "flat 2D, anime, realistic photography, dark gritty, horror, monochrome, low poly, pixel art",
            environments: ["Colorful fantasy kingdom with towering castles", "Cozy family home with warm interior lighting", "Underwater coral reef with bioluminescent creatures", "Bustling cartoon city with exaggerated architecture"],
            mood: "الدهشة والدفء — عالم ملون مليان مشاعر وتفاصيل بتخليك تبتسم. Warm wonder and emotional storytelling.",
            texture: "Smooth subsurface skin, soft fabric with visible thread detail, glossy eyes with multiple light reflections, slightly exaggerated proportions.",
            inspiredBy: "Coco, Inside Out, Soul, Toy Story, Finding Nemo — Pixar / Blue Sky / Illumination"
        };
    }

    // 2. 3D Cute Character | شخصية 3D لطيفة
    if (s.includes('cute') && s.includes('3d')) {
        return {
            name: "3D Cute Character | شخصية 3D كيوت",
            desc: "شخصيات 3D صغيرة ولطيفة بألوان حلوة وملمس ناعم — زي ألعاب الأطفال",
            colorPalette: "Soft pastels (baby pink, mint, lavender, cream). Candy-like colors. Warm undertones. No dark or harsh colors.",
            lighting: "Soft studio three-point lighting, minimal shadows, bright and airy. Rim light for cute glow effect. Soft bloom on highlights.",
            camera: "Low angle looking up (makes characters feel small/cute), macro close-ups on face expressions, centered compositions. Shallow DoF with bokeh hearts/stars.",
            renderKeywords: "cute 3D character, chibi style, soft render, pastel colors, smooth surface, Blender/C4D quality, kawaii aesthetic, 8K, --stylize 500",
            negativePrompt: "scary, dark, realistic, horror, gritty, sharp angles, muscular, adult content, complex backgrounds",
            environments: ["Pastel candy land with lollipop trees", "Soft cloud kingdom with rainbow bridges", "Miniature dessert world, cake mountains", "Cozy toy room with plush furniture"],
            mood: "البراءة والـ Cuteness — كل حاجة لطيفة ومبهجة وبتخليك تقول 'آآآو'. Pure kawaii innocence.",
            texture: "Ultra-smooth matte surfaces, marshmallow-soft feel, round edges everywhere, no sharp corners. Plush toy quality.",
            inspiredBy: "Molang, Sumikko Gurashi, PUI PUI Molcar, LINE Friends, Sanrio characters"
        };
    }

    // 3. Soft 3D / C4D Render | 3D ناعم
    if (s.includes('c4d') || (s.includes('soft') && s.includes('3d'))) {
        return {
            name: "Soft 3D / C4D Render | 3D ناعم سي فور دي",
            desc: "رندر 3D بلاستيكي لامع بظلال خفيفة — الستايل الشائع في إعلانات السوشيال ميديا",
            colorPalette: "Glossy saturated colors, candy-like plastic sheen. Bold primary + secondary colors. Clean white/light gray backgrounds. Gradient accents.",
            lighting: "Clean studio HDRI, soft shadows (no hard edges), strong specular highlights on glossy surfaces. Three-point setup with soft key. Studio product-shot feel.",
            camera: "Isometric-ish angles, product showcase rotations, centered hero compositions. Clean framing with negative space. Slight tilt for dynamism.",
            renderKeywords: "C4D render, glossy plastic, soft shadows, studio lighting, product visualization, Octane/Redshift, clean background, 8K",
            negativePrompt: "gritty, realistic textures, dark moody, film grain, noise, hand-drawn, 2D, organic textures",
            environments: ["Clean gradient studio backdrop (pink to blue)", "Abstract geometric playground", "Floating product display with soft shadows", "Minimal white studio with colored accent lights"],
            mood: "النظافة والحداثة — تصميم عصري ونظيف بيلمع. Clean, modern, and commercially appealing.",
            texture: "High-gloss plastic, matte rubber, frosted glass. Perfectly smooth surfaces. No imperfections. Balloon-like inflation.",
            inspiredBy: "Apple product renders, Instagram 3D artists, Behance trending, Nike/Adidas 3D ads"
        };
    }

    // 4. Claymation / Stop Motion | كلايموشن
    if (s.includes('clay') || s.includes('stop motion') || s.includes('stop-motion')) {
        return {
            name: "Claymation / Stop Motion | كلايموشن / ستوب موشن",
            desc: "عالم مصنوع من صلصال حقيقي — بصمات أصابع وحركة متقطعة ودفء يدوي",
            colorPalette: "Rich matte primaries, slightly imperfect (hand-mixed paint feel). Warm undertones. Earthy but vibrant. No digital perfection.",
            lighting: "Soft diffused top lighting (miniature studio), warm practical lights. Tiny shadows revealing miniature scale. Subtle frame-rate flicker.",
            camera: "Locked-off static shots, slow deliberate pans, close-ups showing fingerprint texture in clay, wide shots revealing miniature set construction. 12fps feel.",
            renderKeywords: "claymation, stop motion, plasticine texture, fingerprint marks visible, miniature set, tactile clay feel, Wallace & Gromit quality, Laika Studios, 8K",
            negativePrompt: "smooth digital CG, photorealistic, neon, cyberpunk, clean perfect surfaces, 2D, anime",
            environments: ["Tiny kitchen with clay utensils and felt curtains", "Miniature garden with wire trees and cotton clouds", "Plasticine living room with fabric furniture", "Clay city street with matchbox cars"],
            mood: "الدفء اليدوي — كل عيب مقصود ومحبوب. كل إطار فيه حب وصبر. Handmade charm, every imperfection is lovable.",
            texture: "Fingerprint marks in clay, visible seams, slightly wobbly surfaces, felt/fabric backgrounds, wire armature hints, tool marks.",
            inspiredBy: "Wallace & Gromit, Coraline, Kubo, Shaun the Sheep, Chicken Run, The Nightmare Before Christmas"
        };
    }

    // 5. Isometric 3D | إيزومتريك
    if (s.includes('isometric')) {
        return {
            name: "Isometric 3D | إيزومتريك 3D",
            desc: "عالم مصغّر من زاوية علوية — زي خريطة لعبة ثلاثية الأبعاد",
            colorPalette: "Clean, organized color coding. Each zone has a distinct palette. Flat colors with subtle gradients. Pastel or vibrant depending on mood.",
            lighting: "Even ambient lighting (no strong shadows), soft directional light at 45° for depth. Clean, readable. Shadow direction consistent at 120°.",
            camera: "STRICT isometric angle (30° from horizontal), NO perspective distortion (orthographic projection), bird's-eye view. Consistent scale throughout.",
            renderKeywords: "isometric 3D, orthographic projection, miniature world, tilt-shift, tiny detailed world, low-poly charm, diorama, 8K, --stylize 500",
            negativePrompt: "perspective view, first person, close-up, realistic photography, dark, horror, fish-eye lens",
            environments: ["Tiny city block with detailed buildings and roads", "Cross-section of a building showing all rooms", "Fantasy island diorama floating in clouds", "Game-level map with paths and obstacles"],
            mood: "الإبهار المصغّر — عالم كامل في مساحة صغيرة. كل تفصيلة بتحكي قصة. Miniature wonder, every detail tells a story.",
            texture: "Low-poly with subtle smoothing, clean edges, miniature model quality, architectural model feel, tilt-shift blur on edges.",
            inspiredBy: "Monument Valley, Crossy Road, SimCity, LEGO worlds, architectural dioramas"
        };
    }

    // 6. Hyper-Casual Game Art | رسومات ألعاب كاجوال
    if (s.includes('casual') || s.includes('game art')) {
        return {
            name: "Hyper-Casual Game Art | رسومات ألعاب كاجوال",
            desc: "رسومات بسيطة وجذابة زي ألعاب الموبايل — ألوان صارخة وأشكال واضحة",
            colorPalette: "Bold, limited palette (3-5 colors max). High contrast primaries. Clean flat fills. White or simple gradient backgrounds. Neon accents for UI elements.",
            lighting: "Flat lighting, minimal shadows, clean and readable. Strong silhouettes. Everything bright and clear. No moody lighting.",
            camera: "Simple centered compositions, 3/4 view for characters, top-down or side-view for gameplay. Clean negative space. No complex angles.",
            renderKeywords: "hyper-casual game art, mobile game style, simple 3D, bold colors, clean shapes, satisfying visuals, minimal design, 8K, --stylize 250",
            negativePrompt: "realistic, complex textures, dark moody, horror, detailed backgrounds, film grain, grunge",
            environments: ["Simple colored platform floating in void", "Clean obstacle course with bright colors", "Minimal arena with one accent color", "Satisfying geometric playground"],
            mood: "البساطة الممتعة — سهل تفهمه، صعب تنساه. ألوان تسحب العين. Simple, satisfying, and instantly understandable.",
            texture: "Perfectly smooth surfaces, no texture detail, clean geometric shapes, rounded corners, satisfying proportions.",
            inspiredBy: "Crossy Road, Helix Jump, Stack, Flappy Bird, Subway Surfers art style"
        };
    }

    // ─────────────────────────────────────────
    // 🎥 CINEMATIC & REALISTIC STYLES
    // ─────────────────────────────────────────

    // 7. Cinematic | سينمائي
    if (s.includes('cinematic') && !s.includes('cyberpunk')) {
        return {
            name: "Cinematic | سينمائي",
            desc: "تصوير سينمائي بعدسات أنامورفيك وإضاءة درامية — زي أفلام هوليوود",
            colorPalette: "Teal-orange color grade (Hollywood standard), rich shadows, controlled highlights. Naturalistic but stylized. Warm skin tones against cool backgrounds.",
            lighting: "Motivated practical lights (window, lamp, fire). Strong key-to-fill ratio (3:1 minimum). Rim light for separation. Chiaroscuro for drama. Golden hour exterior.",
            camera: "Anamorphic wide (2.39:1 feel), dolly/steadicam movements, rule of thirds, rack focus, slow push-ins for tension, wide establishing → medium dialogue → close-up emotion.",
            renderKeywords: "cinematic photography, anamorphic lens, film grain, teal-orange grade, Arri Alexa quality, shallow DoF, 8K",
            negativePrompt: "flat lighting, cartoon, anime, 3D render, fish-eye lens, GoPro, bright even lighting, phone camera quality",
            environments: ["Golden hour rooftop overlooking city", "Dimly lit interior with practical lamps", "Rain-soaked street with reflections", "Desert landscape at magic hour"],
            mood: "الإبهار السينمائي — كل لقطة لوحة. كل إطار يستحق بوستر. Cinematic grandeur — every frame a painting.",
            texture: "Organic film grain, natural skin pores, fabric weave, atmospheric haze, lens flares from practicals, bokeh circles.",
            inspiredBy: "Denis Villeneuve (Dune), Roger Deakins cinematography, Christopher Nolan, David Fincher"
        };
    }

    // 8. Realistic / Photorealistic | واقعي فوتوغرافي
    if (s.includes('realistic') || s.includes('photorealistic') || s.includes('metahuman')) {
        return {
            name: "Realistic / Photorealistic | واقعي فوتوغرافي",
            desc: "واقعية مطلقة بجودة UE5 / Metahuman — مش هتفرق بينها وبين الحقيقي",
            colorPalette: "True-to-life naturalistic colors. No color grading unless motivated. Accurate skin tones, real material colors. Subtle warm/cool contrast.",
            lighting: "Physically accurate lighting (PBR). Real-world light sources only. Accurate shadow falloff. GI and ambient occlusion. No stylized light.",
            camera: "Photographic precision — 85mm portrait, 24mm wide, 50mm normal. Real lens physics: chromatic aberration, real bokeh, lens breathing. Documentary feel.",
            renderKeywords: "photorealistic, UE5, Metahuman quality, ray tracing, PBR materials, 8K, indistinguishable from photograph, --stylize 100",
            negativePrompt: "cartoon, anime, stylized, painting, 3D render look, flat shading, unrealistic proportions, oversaturated",
            environments: ["Real urban street with accurate details", "Natural forest with real foliage", "Modern office with accurate materials", "Kitchen with real food textures"],
            mood: "الواقعية المطلقة — المشاهد مش هيفرق بين ده وفيديو حقيقي. Uncanny realism that breaks the CGI barrier.",
            texture: "Real skin pores, fabric micro-fibers, metal scratches, wood grain, concrete imperfections. Imperfection IS the perfection.",
            inspiredBy: "UE5 demos, Metahuman, The Mandalorian (ILM), Avatar: Way of Water — photoreal CG"
        };
    }

    // 9. Film Noir | فيلم نوار
    if (s.includes('noir')) {
        return {
            name: "Film Noir | فيلم نوار",
            desc: "أبيض وأسود بظلال ثقيلة وغموض — أجواء أفلام التحقيقات الكلاسيكية",
            colorPalette: "STRICT black and white. Crushed blacks (90% frame), bright highlights (10%). NO color unless symbolic (single red element). Maximum contrast.",
            lighting: "Single hard key light (window/streetlamp), venetian blind shadow stripes, NO fill light, rim silhouettes only. Extreme chiaroscuro. Embrace darkness.",
            camera: "Dutch/canted angles for unease, deep focus, low-angle power shots, high-angle vulnerability, smoke/rain elements. Static dramatic compositions. Slow dolly.",
            renderKeywords: "film noir, black and white, chiaroscuro, heavy shadows, 1940s detective, high contrast, grain, dramatic lighting, --no color, 8K",
            negativePrompt: "colorful, bright, cheerful, modern clean, daylight, cartoon, anime, 3D cute, well-lit, pastel",
            environments: ["Smoky detective office with venetian blinds", "Rain-soaked street with single streetlamp", "Jazz club in cigarette haze", "Dark alley with fire escape shadows"],
            mood: "التوتر والغموض — ثق بحدسك بس ما تثقش في حد تاني. Paranoid tension — TRUST NO ONE.",
            texture: "Film grain, smoke wisps, wet surfaces, dusty air catching light shafts, fabric folds in shadow, rain streaks on glass.",
            inspiredBy: "Double Indemnity, Sunset Boulevard, Sin City, The Third Man, Chinatown"
        };
    }

    // 10. GoPro POV | منظور GoPro
    if (s.includes('gopro') || s.includes('pov')) {
        return {
            name: "GoPro POV | منظور جو برو",
            desc: "كاميرا شخصية واسعة الزاوية — المشاهد يحس إنه جوا الحدث",
            colorPalette: "Vivid action colors, slightly oversaturated (GoPro SuperPhoto). High contrast. Bright outdoors, dynamic range challenges in mixed lighting.",
            lighting: "Natural available light ONLY. Sun flares, cloud shadows, indoor/outdoor transitions. No studio lighting. Raw and uncontrolled.",
            camera: "Ultra-wide fisheye (12mm equivalent), first-person chest/head mount, barrel distortion, GoPro HyperSmooth stabilization, TimeWarp for travel. Always moving.",
            renderKeywords: "GoPro POV, first person view, wide angle fisheye, action camera, immersive, barrel distortion, high frame rate, 8K, --ar 16:9",
            negativePrompt: "tripod static, studio lighting, anamorphic, shallow DoF, carefully composed, film noir, anime, 3D render",
            environments: ["Mountain bike trail through forest", "Surfing inside a wave barrel", "Skydiving freefall with clouds", "Busy street market from eye level"],
            mood: "الأدرينالين والمغامرة — إنت جوا الحدث مش بتتفرج عليه. You ARE the action, not watching it.",
            texture: "Water droplets on lens, motion blur streaks, lens flare from sun, dust particles, slightly shaky but stabilized, fisheye distortion.",
            inspiredBy: "GoPro HERO campaigns, Red Bull extreme sports, Casey Neistat vlogs, POV YouTube genre"
        };
    }

    // 11. Drone Aerial | تصوير درون جوي
    if (s.includes('drone') || s.includes('aerial')) {
        return {
            name: "Drone Aerial | تصوير درون جوي",
            desc: "مشاهد بانورامية من السما — تصوير جوي يكشف جمال الأماكن",
            colorPalette: "Earth tones from above (greens, blues, browns), atmospheric haze, golden hour warmth. Colors shift with altitude — more muted at height.",
            lighting: "Natural sunlight only. Golden hour = warm orange side-light. Midday = harsh top-down shadows. Sunrise = soft pink diffusion. Cloud shadows creating patterns.",
            camera: "Top-down bird's eye, sweeping orbital shots, reveal shots (rise over obstacle), tracking follows from above. Smooth gimbal movements. DJI-quality stabilization.",
            renderKeywords: "drone aerial photography, bird's eye view, sweeping panoramic, DJI quality, landscape cinematography, establishing shot, 8K, --ar 16:9",
            negativePrompt: "indoor, close-up, portrait, studio, eye-level, dark, night (unless city lights), claustrophobic",
            environments: ["Coastline where turquoise sea meets golden sand", "City grid at golden hour with long shadows", "Mountain range with clouds below", "Winding river through autumn forest"],
            mood: "الرهبة والجمال — كل ما تبعد عن الأرض الجمال يزيد. Awe-inspiring scale and beauty from above.",
            texture: "Atmospheric perspective (distant haze), texture of terrain from altitude, water patterns, shadow patterns from clouds, geometric farm fields.",
            inspiredBy: "Planet Earth BBC, DJI FPV campaigns, National Geographic aerial, Apple TV screensavers"
        };
    }

    // 12. Mixed Reality | واقع مختلط
    if (s.includes('mixed reality') || (s.includes('mixed') && s.includes('real'))) {
        return {
            name: "Mixed Reality | واقع مختلط",
            desc: "دمج العالم الحقيقي مع عناصر CG خيالية — سحر في الواقع",
            colorPalette: "Realistic base with stylized CG overlays. CG elements slightly more vibrant than reality. Harmonious integration — CG matches real lighting.",
            lighting: "Real-world lighting captured via HDRI, CG elements lit to match perfectly. Shadow direction/color must match. Contact shadows critical for grounding.",
            camera: "Handheld or tracked real-camera feel. CG elements must follow same motion blur, DoF, and lens characteristics. Parallax between real/CG layers.",
            renderKeywords: "mixed reality, real + CGI fusion, VFX integration, photoreal compositing, contact shadows, light matching, 8K, --stylize 500",
            negativePrompt: "fully CG, fully real, obvious compositing, floating objects without shadows, mismatched lighting, anime, cartoon",
            environments: ["Living room with a CG dragon sitting on couch", "City street with holographic billboards", "Park where CG butterflies emerge from real flowers", "Office desk where CG mini-world grows from coffee cup"],
            mood: "سحر الواقع — لما الخيال يدخل حياتك اليومية. العادي يبقى استثنائي. Magic bleeding into mundane reality.",
            texture: "Real textures (concrete, wood, fabric) next to CG (smooth plastic, glowing energy, liquid metal). The contrast IS the appeal.",
            inspiredBy: "Apple Vision Pro demos, Pokémon GO concepts, Marvel VFX integration, Magic Leap experiences"
        };
    }

    // ─────────────────────────────────────────
    // 🎌 ANIME & ILLUSTRATION STYLES
    // ─────────────────────────────────────────

    // 13. Anime (Ufotable/KyoAni) | أنمي
    if (s.includes('anime') || s.includes('ufotable') || s.includes('kyoani')) {
        return {
            name: "Anime (Ufotable/KyoAni) | أنمي ياباني",
            desc: "أنمي ياباني بجودة Ufotable — ألوان مشبعة وحركة سلسة وتأثيرات بصرية مبهرة",
            colorPalette: "High saturation, cel-shaded flat fills with dramatic gradient shadows. Vibrant hair/eye colors. Glowing effects (sakura, fire, energy). Clean linework.",
            lighting: "Dramatic anime lighting — strong rim lights, colored ambient fill, bloom on magic/energy effects. Rim light on hair (angel wings). God rays through dust.",
            camera: "Dynamic action angles — extreme low for power, high speed tracking, dramatic zoom-ins on eyes, speed lines background, parallax scrolling in calm scenes.",
            renderKeywords: "anime style, cel shaded, vibrant colors, clean linework, Ufotable quality, dynamic lighting, --niji 5, 8K",
            negativePrompt: "photorealistic, 3D render, western cartoon, chibi, low quality anime, static pose, dull colors",
            environments: ["Cherry blossom courtyard with floating petals", "Moonlit rooftop of futuristic city", "Ancient temple with spiritual energy glow", "Dramatic cliff edge at sunset with wind effects"],
            mood: "الملحمية العاطفية — لحظات تقشعر لها الأبدان. حركة وعاطفة في كل إطار. Epic emotional intensity in every frame.",
            texture: "Flat cel-shaded fills, clean vector linework, gradient shadows (not realistic), speed lines, particle effects (sparks, petals, energy).",
            inspiredBy: "Demon Slayer (Ufotable), Violet Evergarden (KyoAni), Attack on Titan, Jujutsu Kaisen, Your Name (Shinkai)"
        };
    }

    // 14. Studio Ghibli | ستوديو جيبلي
    if (s.includes('ghibli') || s.includes('miyazaki')) {
        return {
            name: "Studio Ghibli | ستوديو جيبلي",
            desc: "رسم يدوي حالم ودافئ — طبيعة خضراء وسماء واسعة وإحساس بالحنين",
            colorPalette: "Warm earth tones, soft greens, sky blues, golden sunlight. Pastel but rich. Watercolor feel with visible brush texture. NO neon or harsh colors.",
            lighting: "Golden hour dominance, dappled sunlight through leaves, god rays, soft diffused shadows. Warm 4500K. NO harsh shadows or dramatic contrast.",
            camera: "Wide establishing shots showing nature, gentle pans, eye-level intimacy, slow push-ins for wonder. NO shaky cam, NO fast cuts, NO extreme angles.",
            renderKeywords: "Studio Ghibli style, hand-painted watercolor, soft cel shading, warm palette, Miyazaki nature details, visible brushstrokes, 2D animation",
            negativePrompt: "photorealistic, 3D CG, neon, dark gritty, cyberpunk, horror, sharp digital edges, action-heavy",
            environments: ["Sunlit meadow with wildflowers and ancient stone ruins", "Cozy countryside kitchen with steaming pot", "Forest path with moss-covered stones and fireflies", "Cliffside overlooking calm ocean at sunset"],
            mood: "الحنين والدفء — كل إطار زي حضن دافي. الطبيعة حية وسحرية. Nostalgic warmth — nature is alive and magical.",
            texture: "Watercolor washes, visible paper grain, soft pencil outlines, brushstroke textures in sky and water, gentle color bleeding.",
            inspiredBy: "My Neighbor Totoro, Spirited Away, Howl's Moving Castle, Princess Mononoke, Kiki's Delivery Service"
        };
    }

    // 15. Watercolor / Hand-Painted | ألوان مائية
    if (s.includes('watercolor') || s.includes('hand-painted') || s.includes('hand painted')) {
        return {
            name: "Watercolor / Hand-Painted | ألوان مائية / رسم يدوي",
            desc: "رسم فني بالألوان المائية — شفافية وتدرجات طبيعية وإحساس حرفي",
            colorPalette: "Translucent pigment washes, visible paper white showing through. Wet-on-wet color bleeding. Limited palette (3-4 harmonious colors). Soft edges.",
            lighting: "Implied through value shifts (light = more paper white, dark = denser pigment). Soft gradients. NO hard spotlight effects. Atmosphere through wash density.",
            camera: "Gentle compositions, central subjects with loose backgrounds, vignette (darker edges, lighter center). Illustrative rather than photographic.",
            renderKeywords: "watercolor painting, hand-painted, translucent pigment, visible paper texture, wet-on-wet technique, artistic illustration, fine art quality",
            negativePrompt: "photorealistic, 3D, digital art, sharp edges, neon, dark gritty, heavy shadows, mechanical/technical",
            environments: ["Flowering garden dissolving into abstract washes", "Rainy street with colors bleeding into puddles", "Mountain landscape with misty watercolor sky", "Cozy café interior with warm color washes"],
            mood: "الجمال الفني — كل إطار لوحة تستاهل تتعلق في متحف. Artistic beauty — every frame is gallery-worthy.",
            texture: "Visible paper grain (cold press), pigment granulation, water blooms, dry brush strokes, paint drips at edges.",
            inspiredBy: "Turner watercolors, Hayao Miyazaki concept art, Children's book illustration, Impressionist watercolor masters"
        };
    }

    // 16. Pop Art / Comic | بوب آرت / كوميك
    if (s.includes('pop art') || s.includes('comic') || s.includes('halftone')) {
        return {
            name: "Pop Art / Comic | بوب آرت / كوميك",
            desc: "ألوان صارخة ونقاط هالفتون وإطارات كوميك — زي مجلات مارفل الكلاسيكية",
            colorPalette: "CMYK primaries (cyan, magenta, yellow, black). Bold flat fills. Ben-Day dot patterns. Thick black outlines. Limited palette, maximum contrast.",
            lighting: "Flat comic lighting — NO graduated shadows. Hard black shadow shapes only. Halftone dots for mid-tones. Clean separation between light and dark.",
            camera: "Panel-based compositions (comic grid), dramatic foreshortening, Kirby Krackle energy effects, impact frames, speed lines, thought/speech bubbles.",
            renderKeywords: "pop art, comic book style, halftone dots, bold outlines, primary colors, Roy Lichtenstein, Marvel comic, speech bubbles, BANG/POW effects, 8K",
            negativePrompt: "photorealistic, subtle colors, gradient shading, 3D render, watercolor, soft, muted, pastel",
            environments: ["City skyline with dramatic clouds and bold outlines", "Action scene with impact stars and speed lines", "Café scene with Lichtenstein dots and bold colors", "Abstract pop art background with pattern fills"],
            mood: "الطاقة والجرأة — ألوان صارخة وحركة مبالغة وتأثير فوري. Bold energy — maximum visual impact, no subtlety.",
            texture: "Ben-Day halftone dots, thick black ink outlines, flat color fills, newsprint texture, screen-printed imperfections.",
            inspiredBy: "Roy Lichtenstein, Andy Warhol, Jack Kirby Marvel, Spider-Verse animation, Robert Rauschenberg"
        };
    }

    // ─────────────────────────────────────────
    // 🌃 AESTHETIC & VIBES STYLES
    // ─────────────────────────────────────────

    // 17. Cyberpunk / Neon Noir | سايبربانك
    if (s.includes('cyberpunk') || s.includes('neon noir')) {
        return {
            name: "Cyberpunk / Neon Noir | سايبربانك / نيون نوار",
            desc: "مدن مستقبلية مظلمة بإضاءة نيون — تكنولوجيا وخطر وجمال ديستوبي",
            colorPalette: "Neon cyan (#00FFFF), magenta (#FF00FF), deep purple against pitch black. LED strips, holographic reflections, chromatic aberration on edges.",
            lighting: "High contrast neon rim lights, volumetric fog catching colored beams, bioluminescent accents. Key = neon sign. Fill = ambient city glow. NO natural sunlight.",
            camera: "Low angle hero shots, Dutch angles for unease, rack focus through rain, lens flares from neon, anamorphic horizontal flares. Rain droplets on lens.",
            renderKeywords: "cyberpunk 2077, neon-noir, UE5 ray tracing, volumetric neon fog, wet surface reflections, chromatic aberration, holographic, 8K",
            negativePrompt: "bright daylight, pastoral nature, warm cozy, simple backgrounds, medieval, historical, cartoon, flat lighting",
            environments: ["Rain-soaked alley with holographic billboards", "Underground tech market with illegal mods", "Penthouse overlooking neon megacity", "Cybernetic surgery clinic with sterile blue light"],
            mood: "الرهبة الديستوبية — جمال خطير. تكنولوجيا في كل مكان بس الإنسانية بتختفي. Dystopian wonder — beautiful but dangerous.",
            texture: "Wet asphalt reflecting neon, chrome and brushed metal, glowing circuit patterns, holographic glitches, rain streaks.",
            inspiredBy: "Blade Runner 2049, Ghost in the Shell, Cyberpunk 2077, Akira, The Matrix"
        };
    }

    // 18. Vaporwave / Retrowave | فيبورويف
    if (s.includes('vaporwave') || s.includes('retrowave')) {
        return {
            name: "Vaporwave / Retrowave | فيبورويف / ريتروويف",
            desc: "ألوان باستيل ونوستالجيا 90s — تماثيل يونانية ونخيل وغروب أبدي",
            colorPalette: "Pastel pink, lavender, mint, baby blue. Gradient skies (pink→purple→blue). Chrome/silver metallics. Soft neon glow. NO harsh primaries.",
            lighting: "Ambient pastel neon glow, NO harsh shadows. Eternal sunset backlighting. Slightly overexposed and dreamy. Soft bloom effect everywhere.",
            camera: "Centered symmetrical compositions, slow zoom through corridors, scan lines overlay, pseudo-3D perspective grids. Static and contemplative.",
            renderKeywords: "vaporwave aesthetic, retrowave, synthwave, pastel neon, Greek statue, 90s nostalgia, VHS grain, scan lines, chrome text, --stylize 1000",
            negativePrompt: "modern clean, realistic, dark gritty, horror, medieval, natural, action-heavy, sharp digital",
            environments: ["Infinite checkered floor with Greek columns", "Sunset beach with chrome dolphins", "Empty mall with neon signs and marble", "Digital corridor with floating shapes"],
            mood: "النوستالجيا الرقمية — جنة رقمية مش موجودة. جمال حزين ووحيد. Digital paradise that doesn't exist — peaceful but lonely.",
            texture: "VHS scan lines, chromatic aberration, blur, holographic sheen, marble textures, chrome reflections, glitch artifacts.",
            inspiredBy: "Macintosh Plus, 90s internet, Miami Vice, Hotline Miami, Greek statues in neon"
        };
    }

    // 19. Retro 80s / Synthwave | ريترو 80s
    if (s.includes('retro') || s.includes('synthwave') || s.includes('80s')) {
        return {
            name: "Retro 80s / Synthwave | ريترو ثمانينات / سينثويف",
            desc: "شبكات نيون وغروب بنفسجي وسيارات رياضية — حلم الثمانينات الكهربائي",
            colorPalette: "Hot pink, electric blue, purple, orange sunset gradient. Neon grid lines. Chrome and mirror finishes. Warm sunset backgrounds with cool neon foregrounds.",
            lighting: "Neon glow from below (underglow), sunset backlighting (warm orange/pink), laser grid lines on ground, lens flares, fog machine atmosphere.",
            camera: "Low angle for car/hero shots, long focal length for compression, slow zoom on sunset, tracking shots along neon-lit highway. Cinematic widescreen.",
            renderKeywords: "synthwave, retro 80s, neon grid, sunset gradient, chrome, DeLorean aesthetic, outrun, laser lights, 8K, --stylize 750",
            negativePrompt: "modern minimal, medieval, realistic documentary, watercolor, flat, cute, pastel soft, black and white",
            environments: ["Neon highway at sunset with laser grid hills", "Retro arcade with glowing cabinets", "Chrome sports car under neon palm trees", "80s-style room with VHS tapes and synth keyboards"],
            mood: "الحنين المستقبلي — مستقبل الثمانينات اللي ما جاش. كهرباء ونيون وسرعة. Electric nostalgia — the future that never came.",
            texture: "Chrome reflections, neon tube glow, VHS noise, laser grid perspective lines, sunset gradient banding, fog/haze.",
            inspiredBy: "Outrun game, Drive (2011), Tron Legacy, Far Cry: Blood Dragon, The Midnight music videos"
        };
    }

    // 20. Lo-Fi Aesthetic | لو-فاي
    if (s.includes('lo-fi') || s.includes('lofi') || s.includes('lo fi')) {
        return {
            name: "Lo-Fi Aesthetic | لو-فاي",
            desc: "هادئ ودافئ ومريح — إحساس ليلة شتا مع شاي وموسيقى هادية",
            colorPalette: "Warm muted tones (amber, rust, olive, cream). Desaturated slightly. Warm color temperature (3000K feel). Cozy autumn/night palette.",
            lighting: "Warm desk lamp glow (tungsten 2700K), soft window light (rain outside), candle flicker, screen glow on face. Intimate and small-scale. NO bright lights.",
            camera: "Static medium shots, gentle loop animations, window framing with rain, over-shoulder of character at desk. Minimal movement. Contemplative.",
            renderKeywords: "lo-fi aesthetic, cozy warm, study vibes, rain window, warm lighting, anime lo-fi, chill atmosphere, grain, soft focus, 8K",
            negativePrompt: "bright neon, action, horror, cyberpunk, sterile clean, cold blue lighting, outdoor adventure, extreme angles",
            environments: ["Cozy bedroom with desk lamp and rain on window", "Late-night café with warm lights and jazz", "Rooftop at dusk with city lights and headphones", "Library corner with stacked books and warm glow"],
            mood: "الراحة والسكون — العالم بره مشغول بس إنت هنا في سلام. Peaceful solitude — the world is busy but you're at peace.",
            texture: "Film grain, slight blur/soft focus, warm color cast, paper/book textures, rain droplets, steam from cup, dust particles in light.",
            inspiredBy: "Lo-Fi Girl YouTube, Studio Ghibli calm scenes, Pixel Café aesthetic, Chillhop animations"
        };
    }

    // 21. Surreal / Dreamcore | سريالي
    if (s.includes('surreal') || s.includes('dreamcore') || s.includes('dream')) {
        return {
            name: "Surreal / Dreamcore | سريالي / حُلمي",
            desc: "عوالم مستحيلة وهندسة غريبة — زي لوحات سلفادور دالي ولكن رقمية",
            colorPalette: "Uncanny pastels mixed with deep saturated accents. Colors that 'shouldn't work together' but do. Impossible gradients. Dreamlike color shifts.",
            lighting: "Multiple impossible light sources (light from below, shadows going wrong direction), bioluminescent objects, sourceless ambient glow. Physics-defying.",
            camera: "Impossible perspectives (Escher stairs), forced perspective tricks, infinite zoom, objects at impossible scales, fish-eye for distortion. Slow dreamlike movement.",
            renderKeywords: "surrealism, dreamcore, impossible geometry, Escher, Dalí, liminal space, uncanny, floating objects, impossible architecture, 8K, --stylize 1000",
            negativePrompt: "realistic, normal architecture, everyday scenes, documentary, flat, minimal, simple, generic backgrounds",
            environments: ["Infinite staircase going in all directions (Escher)", "Desert with melting clocks and burning giraffes (Dalí)", "Empty pool/hallway with uncanny liminal feel", "Floating islands with waterfalls going upward"],
            mood: "الغرابة الساحرة — عقلك بيقولك 'ده مستحيل' بس عينك مش قادرة تبعد. Uncanny fascination — impossible but mesmerizing.",
            texture: "Hyper-smooth impossible surfaces, melting/morphing edges, organic-geometric fusion, dream-fog, floating particles without gravity.",
            inspiredBy: "Salvador Dalí, M.C. Escher, René Magritte, Backrooms/Liminal Spaces, Inception, Everything Everywhere All At Once"
        };
    }

    // 22. Dark Fantasy / Gothic | فانتازيا مظلمة
    if (s.includes('dark fantasy') || s.includes('gothic') || s.includes('eerie')) {
        return {
            name: "Dark Fantasy / Gothic | فانتازيا مظلمة / قوطي",
            desc: "قلاع مظلمة وغابات مسحورة وأجواء مرعبة — بين الجمال والرعب",
            colorPalette: "Desaturated cold tones (dark blue, grey, black) with warm accent (candle orange, blood red, toxic green). Mostly dark with strategic color pops.",
            lighting: "Moonlight through clouds (cold blue), candle/torch flicker (warm orange), bioluminescent fungi/magic (green/purple). Deep shadows. Fog and mist diffusion.",
            camera: "Low angles for imposing architecture, slow creeping dolly, looking up at towering elements, fog obscuring details, pull-back reveals of scale. Gothic grandeur.",
            renderKeywords: "dark fantasy, gothic architecture, moonlit, eerie atmosphere, medieval dark, Elden Ring aesthetic, moody fog, volumetric darkness, 8K",
            negativePrompt: "bright cheerful, modern city, pastel cute, minimalist, clean, well-lit, sunny day, cartoon comedy",
            environments: ["Crumbling Gothic cathedral with moonlight through broken stained glass", "Enchanted dark forest with glowing mushrooms", "Castle throne room lit by a single chandelier", "Graveyard at midnight with rising fog"],
            mood: "الرهبة القوطية — جمال مخيف بيسحرك وبيرعبك في نفس الوقت. Gothic awe — beauty and terror intertwined.",
            texture: "Weathered stone, rusted iron, cracked leather, cobwebs, moss on ancient walls, tarnished silver, old wood grain.",
            inspiredBy: "Elden Ring, Dark Souls, Castlevania, Tim Burton, Bram Stoker's Dracula, The Witcher"
        };
    }

    // 23. Steampunk | ستيمبانك
    if (s.includes('steampunk') || s.includes('steam punk')) {
        return {
            name: "Steampunk | ستيمبانك",
            desc: "تروس نحاسية وبخار فيكتوري — عالم بديل فيه التكنولوجيا شغالة بالبخار",
            colorPalette: "Warm brass (#B5651D), copper (#B87333), aged leather brown, ivory parchment, deep forest green. Amber gas lamp glow. NO modern blues or neon.",
            lighting: "Gas lamp warmth (2700K amber), furnace glow, steam catching light shafts from industrial windows, candlelight. NO LED or fluorescent.",
            camera: "Medium shots for mechanical detail, macro on gears/gauges, wide shots of impossible machines, tracking along pipes and steam. Victorian portrait framing.",
            renderKeywords: "steampunk, Victorian industrial, brass gears, copper pipes, steam-powered, clockwork, Tesla coils, dieselpunk, goggles, top hats, 8K",
            negativePrompt: "modern technology, smartphones, neon, plastic, minimalist, cyberpunk, digital screens, sleek surfaces",
            environments: ["Workshop with brass gears covering walls", "Steam airship cockpit with leather and copper", "Underground boiler room with massive furnaces", "Clocktower interior with spinning mechanisms"],
            mood: "الإبهار الميكانيكي — المستحيل اتعمل بتروس وبخار. عبقرية فيكتورية. Industrial wonder — genius invention meets Victorian elegance.",
            texture: "Polished brass, aged leather, riveted iron plates, ticking mechanisms, hissing steam valves, oil-stained blueprints, gauge needles.",
            inspiredBy: "Bioshock Infinite, Hugo, Wild Wild West, Jules Verne, HG Wells, Howl's Moving Castle (mechanical)"
        };
    }

    // 24. Glitch Art / Datamosh | جليتش آرت
    if (s.includes('glitch') || s.includes('datamosh')) {
        return {
            name: "Glitch Art / Datamosh | جليتش آرت / تشويش رقمي",
            desc: "تشويش رقمي وخلل بصري مقصود — لما التكنولوجيا تبوظ بتبقى جميلة",
            colorPalette: "RGB channel splitting (red/green/blue offsets). Corrupted gradients. Pixel sorting creating color streaks. Inverted colors in patches. Digital noise.",
            lighting: "Screen glow, pixel brightness variations, scan line flicker, corrupted exposure (blown highlights, crushed blacks randomly). No natural lighting rules.",
            camera: "Datamosh transitions (frame blending), pixel sorting vertical/horizontal, VHS tracking errors, scan lines, static compositions interrupted by glitch bursts.",
            renderKeywords: "glitch art, datamosh, pixel sorting, RGB split, digital corruption, VHS error, scan lines, visual noise, corrupted data, 8K",
            negativePrompt: "clean perfect, smooth, realistic, traditional art, natural, warm cozy, minimal, simple",
            environments: ["Digital void with corrupted data streams", "Real scene breaking apart into pixel fragments", "Screen within screen recursion with glitch borders", "Corrupted landscape where reality pixelates"],
            mood: "الفوضى الرقمية الجميلة — الخطأ التكنولوجي بقى فن. لما النظام ينهار بيبقى جميل. Beautiful digital chaos — when systems break, art emerges.",
            texture: "Pixel blocks, scan lines, JPEG artifacts, compression noise, bit-crushed gradients, frozen frame remnants, data corruption patterns.",
            inspiredBy: "Rosa Menkman, Sabato Visconti, Nam June Paik, A Scanner Darkly, Mr. Robot credits"
        };
    }

    // 25. Minimalist / Flat | مينيماليست
    if (s.includes('minimalist') || s.includes('flat')) {
        return {
            name: "Minimalist / Flat | مينيماليست / فلات",
            desc: "بساطة أنيقة وألوان محدودة — أقل = أكثر",
            colorPalette: "1-3 colors maximum. Bold geometric color blocks. High contrast between subject and background. Monochromatic options. Clean white space.",
            lighting: "Flat even lighting, NO shadows (or minimal geometric shadows). Clean, graphic, poster-like. Light IS even. NO dramatic effects.",
            camera: "Centered symmetric compositions, lots of negative space, geometric framing, static clean shots. NO clutter. Rule of simplicity. Fixed wide shots.",
            renderKeywords: "minimalist design, flat illustration, geometric shapes, clean lines, limited palette, Swiss design, negative space, vector art quality, 8K",
            negativePrompt: "complex textures, cluttered, ornate, photorealistic, dark gritty, busy backgrounds, multiple light sources, grunge",
            environments: ["Single object on solid color background", "Geometric landscape with flat shapes", "Clean interior with one accent object", "Abstract composition with basic shapes"],
            mood: "الأناقة في البساطة — كل عنصر ليه سبب. اللي مش موجود مهم زي اللي موجود. Elegant simplicity — less is more, always.",
            texture: "Perfectly flat fills, clean vector edges, NO texture (anti-texture). Smooth matte surfaces. Paper-cut feel optional.",
            inspiredBy: "Swiss/International Style, Dieter Rams, Muji, Apple design language, Bauhaus, Olly Moss posters"
        };
    }

    // ─────────────────────────────────────────
    // 🔥 TREND STYLES
    // ─────────────────────────────────────────

    // 26. Transparent Living Creature | كائن شفاف حي
    if (s.includes('transparent') || s.includes('glass creature') || s.includes('crystal creature')) {
        return {
            name: "Transparent Living Creature | كائن شفاف حي",
            desc: "كائن حي شفاف زي المية بملمس مطاطي ناعم — أعضاؤه الداخلية مرئية بألوان ناعمة متناسقة وبيتحرك بطبيعية كأنه كائن حقيقي",
            colorPalette: "Water-clear transparent body with very soft aqua/cyan tint. Internal organs in SOFT HARMONIOUS pastel-warm tones that blend with the transparent body (soft rose-pink beating heart, pale blush lungs, warm peach kidneys, creamy ivory spine and ribcage). Gentle warm subsurface glow from within — organs glow softly like warm light through wax, NOT harsh or clinical. Delicate soft coral-blue circulatory veins. All organ colors should feel gentle, cohesive, and aesthetically pleasing — like a beautiful illustration, NOT a medical textbook.",
            lighting: "Soft diffused natural backlight revealing internal anatomy gently. Warm golden rim light on body edges showing elastic skin texture. Subtle warm subsurface glow emanating from organs creating a gentle inner radiance. Soft caustic light patterns on ground beneath creature. Golden hour natural light for outdoor shots. NO harsh clinical studio lights — everything warm and inviting.",
            camera: "Macro close-up 100mm lens showing organ detail through translucent body. Eye-level portrait for emotional connection with the creature. Shallow DoF f/2.8 with creamy natural bokeh. Slight low angle to add life and grandeur. Track creature movement naturally. Capture mid-action: bird mid-flap, snake mid-slither, fish mid-swim, bee mid-hover.",
            renderKeywords: "transparent living creature, water-clear translucent body, soft rubbery elastic skin, gentle soft-toned internal organs, organs with harmonious pastel colors, soft rose heart gently beating, pale blush lungs softly breathing, creamy ivory spine, organs blending beautifully with transparent body, ALL organs contained inside body boundary, organs NEVER protrude outside skin surface, proportional head matching body size and style, uniform transparent texture from head to tail, seamless consistent body shape, aesthetically pleasing organ rendering, lifelike animal in motion, natural animal behavior, creature caught mid-movement, photorealistic macro photography, subsurface scattering, soft elastic silicone-like texture, real animal proportions, ultra detailed, 8K, --stylize 750",
            negativePrompt: "harsh organ colors, clinical medical red organs, bloody organs, gore, graphic anatomy, dark red harsh organs, organs outside body, organs protruding from skin, organs escaping body boundary, heart outside chest, lungs outside ribcage, intestines hanging out, exposed organs, organs breaking through skin, oversized head, disproportionate head, head different texture than body, head different transparency than body, head shape mismatch, glass texture, hard shiny surface, brittle look, cracked, broken, ceramic, porcelain, rigid body, stiff pose, statue-like, trophy mount, taxidermy, matte opaque skin, cartoon, anime, 2D, low quality, blurry, watermark, unrealistic anatomy, toy-like, plastic doll, T-pose, frozen pose, dead animal",
            environments: [
                "Natural habitat with soft morning golden light — forest floor with leaves, garden with flowers, pond edge with reeds, matching the creature's real environment",
                "Clean soft gradient background with gentle caustic light patterns on surface beneath creature, studio macro feel",
                "Outdoor nature scene — creature on a real branch, real flower, real rock — behaving naturally as it would in the wild",
                "Backlit scene at golden hour, creature silhouetted with all internal organs glowing warmly and softly through transparent body"
            ],
            mood: "كائن حقيقي حي بيتنفس وبيتحرك — مش تمثال ومش لعبة. أعضاؤه الداخلية بألوان ناعمة لطيفة متناسقة مع جسمه — قلب وردي ناعم بينبض، رئة بلون الخوخ بتتمدد بهدوء. الشكل العام متناسق وجميل — مش تشريحي طبي قاسي. ⚠️ كل الأعضاء لازم تفضل جوّا حدود الجسم — مفيش عضو بيطلع برّا الجلد أبداً. A truly ALIVE transparent creature with SOFT, GENTLE organ colors — soft rose heart beating gently, pale blush lungs expanding, warm ivory bones. Organs should look beautiful and harmonious inside the body, NOT harsh medical-red or clinical. CRITICAL: ALL internal organs must remain CONTAINED within the body boundary. The head must have the SAME transparency, texture, and proportional style as the rest of the body — seamless uniform appearance.",
            texture: "Soft elastic rubbery surface like medical-grade clear silicone or firm gelatin. NOT glass and NOT hard — skin that flexes and stretches with movement. Smooth organic translucent skin with subtle depth. CRITICAL: All organs stay INSIDE the body — visible THROUGH the transparent skin but NEVER break through or protrude outside. Organs rendered with SOFT gentle colors (rose, blush, peach, ivory, coral) — harmonious and aesthetically pleasing, NOT clinical harsh reds and dark colors. Head has the EXACT same transparent texture, color tint, and material as the body — no different opacity, no different shape language. Proportional head-to-body ratio matching real anatomy. Skeletal structure visible as warm ivory beneath transparent flesh. Muscles visible as very soft pale pink fibers during movement.",
            inspiredBy: "Transparent glass frog (Hyalinobathra), deep-sea transparent jellyfish, aesthetic anatomical illustration art, soft pastel medical illustration, gentle macro wildlife photography by National Geographic, trending AI transparent animal art 2024-2025"
        };
    }

    // ─────────────────────────────────────────
    // 🎬 DEFAULT FALLBACK
    // ─────────────────────────────────────────
    return {
        name: "High-End Production | إنتاج عالي الجودة",
        desc: "إنتاج بصري احترافي مع إضاءة درامية وتصوير سينمائي — الخيار الافتراضي",
        colorPalette: "Naturalistic with controlled color grade. Teal-orange or complementary scheme. Rich but not oversaturated. Professional studio quality.",
        lighting: "Three-point professional lighting. Motivated key light, soft fill, rim for separation. Clean and controlled. Studio or cinematic quality.",
        camera: "Standard cinematic coverage — establishing wide, medium for action, close-up for emotion. Smooth dolly/steadicam. Rule of thirds. 24fps cinematic.",
        renderKeywords: "professional production, studio lighting, 8K resolution, ray tracing, volumetric lighting, cinematic quality",
        negativePrompt: "amateur, phone quality, flat lighting, oversaturated, noisy, blurry, inconsistent style",
        environments: ["Professional studio with controlled lighting", "Natural outdoor location at golden hour", "Modern interior with architectural details", "Abstract gradient background"],
        mood: "الاحترافية — مخرجات بجودة إنتاج عالية تصلح لأي غرض. Professional quality — production-ready for any purpose.",
        texture: "Clean professional surfaces, controlled grain if cinematic, sharp detail, consistent quality throughout.",
        inspiredBy: "Apple commercials, Nike campaigns, Vogue editorials, TED stage production"
    };
};
