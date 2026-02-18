// SCREENPLAY ENGINE - generate_prompt + generateSystemPrompt
import { TEXT_MODEL } from '../config.js';
import { callOpenRouter } from '../openrouter.js';
import { getCharacterKnowledge, getAspectRatioRules } from '../knowledgeBase.js';
import { getPersona } from './personaEngine.js';
import { getStyleDNA } from './styleDnaEngine.js';
import { getCharacterDNA } from './characterDnaEngine.js';
import { getVoiceToneDNA } from './voiceToneDnaEngine.js';
import { getDialectDNA } from './dialectDnaEngine.js';
import { getTransparentCreatureRules } from './transparentCreatureEngine.js';
import { getGenreGoal } from './genreGoalEngine.js';

export async function generate_prompt(inputs) {
  // 1. THE INPUT MATRIX (Receive & Lock)
  // Multi-character support: characters = { primary, secondary[] }
  const chars = inputs.characters || {};
  const primaryChar = chars.primary || inputs.characterType || 'auto';
  const secondaryChars = chars.secondary || [];
  const totalCharacters = 1 + secondaryChars.filter(s => s).length;

  const data = {
    concept: inputs.coreIdea || inputs.videoTopic || 'General Viral Concept',
    genre: (inputs.genre || 'General').toLowerCase(),
    style: (inputs.videoStyle || 'Cinematic').toLowerCase(),
    character_type: primaryChar,
    secondary_characters: secondaryChars.filter(s => s),
    scenes: parseInt(inputs.numScenes) || 5,
    characters: totalCharacters,
    duration: parseInt(inputs.duration) || 10,
    tone: (inputs.voiceTone || inputs.tone || 'Professional').toLowerCase(),
    dialect: inputs.videoLanguage || 'Egyptian Arabic (Masri)',
    aspectRatio: inputs.aspectRatio || '16:9',
    notes: inputs.modifiers || inputs.additionalInfo || '',
    prohibitions: inputs.prohibitions || ''
  };

  // 2. Generate the System Prompt using the specialized function
  const systemPrompt = generateSystemPrompt({ ...data, mode: 'script' });

  // 3. Call The LLM with proper system/user separation
  const allChars = [primaryChar, ...secondaryChars.filter(s => s)].join(' + ');
  const userMessage = `الفكرة: ${data.concept}\nالنوع: ${data.genre} | الأسلوب: ${data.style} | الشخصيات: ${allChars}\nالمشاهد: ${data.scenes} | عدد الشخصيات: ${data.characters} | المدة: ${data.duration}s\nاللهجة: ${data.dialect} | النسبة: ${data.aspectRatio}${data.notes ? '\nملاحظات: ' + data.notes : ''}${data.prohibitions ? '\nمحظورات: ' + data.prohibitions : ''}\n\nابدأ التنفيذ الآن. أخرج JSON فقط.`;
  return callOpenRouter(userMessage, TEXT_MODEL, false, 8192, 0.6, systemPrompt);
}

/**
 * Regenerate a SINGLE scene while maintaining consistency with the rest
 * @param {Object} params - { sceneIndex, existingScenes, existingCharacters, originalInputs }
 */
export async function regenerate_scene({ sceneIndex, existingScenes, existingCharacters, originalInputs }) {
  const sceneNum = sceneIndex + 1;
  const totalScenes = existingScenes.length;
  const prevScene = sceneIndex > 0 ? existingScenes[sceneIndex - 1] : null;
  const nextScene = sceneIndex < totalScenes - 1 ? existingScenes[sceneIndex + 1] : null;

  const dialect = originalInputs.videoLanguage || 'Egyptian Arabic (Masri)';
  const style = originalInputs.videoStyle || 'Cinematic';

  // Build a focused context prompt
  const charDescs = existingCharacters.map(c =>
    `${c.name_ar || c.name_en || 'Character'}: ${c.screenplay_description || c.visual_desc_en || ''}`
  ).join('\n');

  const contextPrompt = `أعد كتابة المشهد رقم ${sceneNum} من ${totalScenes} فقط.

الشخصيات:
${charDescs}

${prevScene ? `المشهد السابق (${sceneNum - 1}): ${prevScene.visual_script || prevScene.visual || ''}` : ''}
${nextScene ? `المشهد التالي (${sceneNum + 1}): ${nextScene.visual_script || nextScene.visual || ''}` : ''}

أسلوب: ${style} | لهجة: ${dialect}

أخرج JSON لمشهد واحد فقط بالشكل ده:
{
  "scene_number": ${sceneNum},
  "duration_seconds": ${originalInputs.duration || 10},
  "visual_script": "...(60-80 words, English, [LOCATION]+[LIGHTING]+[CAMERA]+[ACTION]+[STYLE])",
  "dialogue_script": "...(${dialect})",
  "audio_notes": "FG: ... | MG-NEAR: ... | MG-FAR: ... | BG: ... | SFX: ...",
  "scene_prompt": "CREF: ... (60-80 words, English)",
  "negative_prompt": "..."
}

الشروط:
1. حافظ على نفس الشخصيات ووصفهم البصري بالظبط
2. المشهد لازم يكون مرتبط بالمشهد قبله وبعده
3. JSON فقط بدون شرح`;

  return callOpenRouter(contextPrompt, TEXT_MODEL, false, 2048, 0.65);
}

export const generateSystemPrompt = (data) => {
  const concept = data.concept || "General Viral Video";
  const mode = data.mode || 'script';
  const genre = data.genre || "Cinematic";
  const style = data.style || "High-End Commercial";
  const duration = data.duration || 15;
  const characterType = data.character_type || "Realistic";
  const numCharacters = data.characters || 1;
  const numScenes = data.scenes || 5;
  const dialect = data.dialect || 'Egyptian Arabic (Masri)';
  const voiceTone = data.tone || 'Professional';
  const aspectRatio = data.aspectRatio || '16:9';
  const prohibitions = data.prohibitions || '';
  const notes = data.notes || '';

  // 2. DYNAMIC PERSONA
  const persona = getPersona(genre);

  // 3. HELPERS
  const aspectRatioData = getAspectRatioRules(aspectRatio);

  // 4. DIALOGUE CALIBRATION — ~2.5-3.0 words/second (avg 2.75)
  const wordsPerScene = numCharacters > 1
    ? Math.round(duration * 2.75 * Math.min(numCharacters, 3) * 0.65)
    : Math.round(duration * 2.75);
  const wordCountMin = Math.max(wordsPerScene - 6, 20);
  const wordCountMax = Math.max(wordsPerScene + 6, 35);

  // 5. CHARACTER RULES (compact)
  const nonHumanTypes = ['object', 'food', 'animal', 'robot', 'creature', 'monster', 'alien', 'body', 'toy', 'mythical'];
  const isNonHuman = nonHumanTypes.some(t => characterType.toLowerCase().includes(t));

  // 8. CHARACTER DNA — الحمض النووي للشخصية (Primary + Secondary Multi-Character)
  const charDNA = getCharacterDNA(characterType);
  const secondaryCharacters = data.secondary_characters || [];
  const secondaryDNAs = secondaryCharacters.map(sc => getCharacterDNA(sc));

  const charRule = isNonHuman
    ? `🚨🚨🚨 قاعدة حاسمة — كسرها = السيناريو مرفوض بالكامل 🚨🚨🚨
⚠️ البطل = **${characterType}** (مش إنسان).
• ممنوع نهائياً: أيدي بشرية، وجوه بشرية، أي عنصر بشري في أي مشهد
• البطل هو الراوي — كل الحوار بضمير المتكلم ("أنا"، "إحنا")
• البطل ليه مشاعر وشخصية وبيتكلم مباشرة — مش حد بيتكلم عنه
• مثال صح ✅: "أنا الميكروويف، وأنا زهقت من البروكلي!"
• مثال غلط ❌: "الميكروويف بيسخن الأكل" (ده راوي خارجي = مرفوض)
• مثال غلط ❌: "A hand places food inside" (أيدي بشرية = مرفوض)`
    : '';

  // 5a. SELF-EAT RULE — food characters can't eat themselves
  const selfEatRule = isNonHuman && characterType.toLowerCase().includes('food')
    ? `🍽️ قاعدة "الأكل الذاتي" (إلزامية لشخصيات الطعام):
• الشخصية ممنوع تاكل نفسها (نفس الفرد بالظبط) — يعني البطاطس بتاعتنا ما تاكلش من جسمها
• لكن ممكن تاكل واحدة تانية أصغر من نفس النوع عادي (مثلاً: بطاطس تاكل بطاطس صغيرة = مقبول)
• ممكن كمان تاكل أنواع تانية من الأكل (مثلاً: بطاطس تاكل كاتشب أو جبنة = مقبول)
• في المشاهد النهائية: الشخصية تقدّم الوجبة للمشاهد بدل ما تاكلها بنفسها (أفضل)`
    : '';

  // 5c. CHARACTER LOCK — enforce visual consistency across scenes
  const charLock = `🔒 CHARACTER LOCK PROTOCOL (كسر القاعدة = السيناريو مرفوض):
1. حدد وصف بصري ثابت واحد لكل شخصية في screenplay_description (اللون، الحجم، الملابس، العلامات المميزة)
2. هذا الوصف يجب أن يتكرر حرفياً في كل scene_prompt وvisual_script
3. ممنوع تغيير لون/حجم/ملابس/شكل الشخصية بين المشاهد إلا بتبرير درامي صريح
4. image_prompt للشخصية = الشكل الأساسي النهائي (مش حالة مؤقتة)
5. كل scene_prompt يبدأ بـ CREF: [اسم الشخصية] - [نسخ حرفي من وصف image_prompt]`;
  // 5b. NARRATOR RULE — enforce first-person for non-human
  const narratorRule = isNonHuman
    ? `🎙️ قاعدة الرواية (إلزامية):
• الراوي = البطل نفسه (${charDNA.name}) — بيتكلم بضمير المتكلم
• كل الحوار: "أنا عملت..."، "إحنا شوفنا..."، "تعالوا أوريكم..."
• ممنوع نهائياً: "هنشوف..."، "الميكروويف بيحس..."، "البيضة بتعمل..." (وجهة نظر خارجية = مرفوض)
• ممنوع: أي مشهد فيه إيد بشرية، شخص بشري، أو تفاعل بشري مباشر
• البطل بيتفاعل مع أبطال تانيين من نفس النوع (${characterType}) — مش مع بشر`
    : '';

  // 6. MULTI-CHARACTER RULE (enriched with secondary DNA)
  const secondaryCharsInfo = secondaryCharacters.length > 0
    ? secondaryCharacters.map((sc, i) => {
      const dna = secondaryDNAs[i];
      return `  ${i + 1}. **${dna.name}**
     ↳ شخصية: ${dna.personalityTraits}
     ↳ حوار: ${dna.dialogueStyle}
     ↳ شكل: ${dna.visualBuild}
     ↳ تفاعل: ${dna.interactionStyle}`;
    }).join('\n')
    : '';
  const teamRule = numCharacters > 1
    ? `👥 عدد الشخصيات: ${numCharacters} — فريق متكامل كل واحد ليه اسم، شكل، وطريقة كلام مختلفة.
📌 الشخصيات الفرعية (إلزامي — لازم يظهروا في السيناريو بتفاعل حقيقي):
${secondaryCharsInfo}
⚠️ كل شخصية فرعية لازم يكون ليها دور فعّال في الأحداث — مش مجرد ديكور أو ذكر عابر!
⚠️ لازم يكون في تفاعل واضح بين البطل والشخصيات الفرعية (حوار، صراع، تعاون، أو مواجهة)`
    : '';

  // 7. STYLE DNA — الحمض النووي البصري
  const styleDNA = getStyleDNA(style);
  const colorHint = styleDNA.colorPalette;
  const renderKeywords = styleDNA.renderKeywords;

  // 7a. TRANSPARENT STYLE × CHARACTER INTEGRATION (v2.0 — 3-Layer Engine)
  const isTransparentStyle = style.toLowerCase().includes('transparent') ||
    characterType.toLowerCase().includes('transparent') ||
    secondaryCharacters.some(sc => sc.toLowerCase().includes('transparent'));

  const isViralGenreForStyle = genre.toLowerCase().includes('viral') || genre.toLowerCase().includes('social') || genre.toLowerCase().includes('trend');
  const transparentStyleRule = isTransparentStyle
    ? (() => {
      const tRules = getTransparentCreatureRules(genre, characterType, isNonHuman);
      if (isNonHuman) {
        return `🫧🫧🫧 قاعدة الاستايل الشفاف — الكائن الشفاف الحي (v3.0) 🫧🫧🫧
⚠️ البطل (${characterType}) = كائن شفاف حي بالكامل!

📌 ليه البطل شفاف في "${genre}"؟
${tRules.genreLogic}

📌 شكل البطل الشفاف:
${tRules.creatureRole}
• جسم البطل شفاف زي المية بملمس مطاطي ناعم — مش زجاج ومش صلب
• الأعضاء بألوان ناعمة لطيفة متناسقة (قلب وردي ناعم، رئة بلون الخوخ، عظام عاجية دافية) — مش ألوان طبية قاسية

📌 قاعدة تفاعل الأعضاء مع الدراما (إلزامي — الأعضاء مش ديكور):
${tRules.organRules}
🚨 كل مشهد لازم يحتوي على وصف تفاعل عضو في [ACTION] section!
أمثلة: "heart beating faster with excitement" | "lungs freezing in shock" | "spine glowing with courage" | "veins pulsing rapidly"
مشهد بدون تفاعل عضو = مرفوض!

📌 قاعدة [CREATURE] في الـ visual_script (إلزامي):
• كل visual_script لازم يحتوي على section اسمه [CREATURE] بعد [ACTION]
• [CREATURE] = وصف 15-20 كلمة للبطل الشفاف: شكله + حالة أعضاؤه + تفاعلها مع الحدث
• مثال: "[CREATURE] transparent ${characterType}, soft rose heart beating rapidly inside chest, pale blush lungs expanding with excitement, warm ivory spine glowing faintly"
• مفيش [CREATURE] section = مرفوض!

📌 قواعد الـ Prompt:
• image_prompt للبطل يبدأ بـ: "transparent living [نوع الكائن], water-clear elastic body, soft rose heart gently pulsing inside chest cavity, pale peach lungs softly expanding inside ribcage, warm ivory spine and ribs glowing faintly, delicate coral veins throughout body, all organs contained inside body, proportional head matching body, uniform transparency head to tail, lifelike movement..."
• ⚠️ negative_prompt لازم يتضمن: "organs outside body, organs protruding from skin, heart outside chest, exposed organs, disproportionate head, head different texture than body, harsh organ colors, clinical red organs"
• في visual_script: استخدم كلمات style مختصرة: "transparent creature, soft pastel organs inside body, lifelike, 8K"
• التفاصيل الكاملة (render keywords) تبقى في scene_prompt مش visual_script
• البيئة المحيطة واقعية وطبيعية — الشفافية على البطل بس`;
      }
      if (isViralGenreForStyle) {
        return `🫧🫧🫧 قاعدة الاستايل الشفاف — الكائن الشفاف هو النجم! (v4.0 VIRAL) 🫧🫧🫧
⚠️ تجاوز قاعدة البطل: الكائن الشفاف هو بطل الفيديو والإنسان (${characterType}) = شخصية ثانوية (صاحب الكائن / اللي لقاه).

📌 ليه فيه كائن شفاف في "${genre}"؟
${tRules.genreLogic}

📌 دور الكائن الشفاف:
${tRules.creatureRole}
• الكائن الشفاف جسمه شفاف زي المية بملمس مطاطي — مش زجاج

🚨🚨🚨 قاعدة المشاهد (VIRAL — الكائن هو الفعل!):
• [ACTION] لازم يبدأ بفعل الكائن الشفاف مش فعل الإنسان!
• الكاميرا بتصور الكائن — close-up عليه، macro على أعضاؤه، الإنسان في الخلفية
• كل مشهد عضو مختلف بيتفاعل بشكل دراماتيكي (مش نفس العضو كل مرة!):
  مشهد 1: قلب بينبض هادي | مشهد 2: مخ بيشتغل | مشهد 3: معدة بتتفاعل | مشهد 4: أعصاب بتنور | مشهد 5: كل الأعضاء بتتفاعل مع بعض!
• الحوار = صاحب الكائن بيعلق على اللي بيحصل جوا الكائن (مش حوار درامي)

🚨 قاعدة الظهور الإجباري:
• الكائن الشفاف لازم يظهر في كل مشهد كعنصر رئيسي — مش في الخلفية!

📌 الكائن الشفاف = شخصية رئيسية:
• لازم يكون موجود في characters[] كشخصية رئيسية (مش ثانوية!)
• ليه image_prompt مخصوص يبدأ بـ: "transparent living [creature type], water-clear elastic body, soft rose heart gently pulsing inside chest cavity, pale peach lungs softly expanding inside ribcage, warm ivory spine glowing faintly, delicate coral veins, all organs contained inside body, proportional head matching body..."

📌 قاعدة [CREATURE] في الـ visual_script (إلزامي):
• كل visual_script لازم يحتوي على [CREATURE] section بعد [ACTION]
• [CREATURE] = وصف 20-30 كلمة للكائن: فعله + شكله + حالة العضو المختلف في كل مشهد
• ممنوع: نفس وصف الأعضاء في كل مشهد! كل مشهد عضو جديد بيتفاعل

📌 قواعد الـ Prompt:
• البطل (الإنسان) يفضل بشكله الطبيعي
• ⚠️ negative_prompt لازم يتضمن: "organs outside body, organs protruding, exposed organs, disproportionate head, head different texture, harsh organ colors, clinical red"
• في visual_script: استخدم كلمات style مختصرة: "transparent creature, soft pastel organs inside body, lifelike, 8K"
• التفاصيل الكاملة (render keywords) تبقى في scene_prompt مش visual_script
• image_prompt للبطل = طبيعي عادي | الكائن الشفاف يُوصف بالتفصيل في scene_prompt`;
      }
      return `🫧🫧🫧 قاعدة الاستايل الشفاف — عالم الكائنات الشفافة (v3.0) 🫧🫧🫧
⚠️ البطل = إنسان عادي (${characterType}) — مش شفاف!

📌 ليه فيه كائن شفاف في "${genre}"؟
${tRules.genreLogic}

📌 دور الكائن الشفاف:
${tRules.creatureRole}
• الكائن الشفاف جسمه شفاف زي المية بملمس مطاطي — مش زجاج
• العلاقة بين البطل والكائن الشفاف = جزء أساسي من القصة (مش ديكور!)

🚨 قاعدة الظهور الإجباري:
• الكائن الشفاف لازم يظهر في كل مشهد بدون استثناء — حتى لو في الخلفية أو على كتف البطل
• مشهد بدون الكائن الشفاف = مرفوض!

📌 الكائن الشفاف = شخصية رسمية:
• لازم يكون موجود في characters[] كشخصية ثانوية
• ليه image_prompt مخصوص يبدأ بـ: "transparent living [creature type], water-clear elastic body, soft rose heart gently pulsing inside chest cavity, pale peach lungs softly expanding inside ribcage, warm ivory spine glowing faintly, delicate coral veins, all organs contained inside body, proportional head matching body..."

📌 قاعدة تفاعل الأعضاء مع الدراما (إلزامي — الكائن مش ديكور):
${tRules.organRules}
🚨 كل مشهد لازم يحتوي على وصف تفاعل عضو من أعضاء الكائن الشفاف في [ACTION]!
مشهد بدون تفاعل عضو = مرفوض!

📌 قاعدة [CREATURE] في الـ visual_script (إلزامي):
• كل visual_script لازم يحتوي على section اسمه [CREATURE] بعد [ACTION]
• [CREATURE] = وصف 15-20 كلمة للكائن الشفاف: موقعه + شكله + حالة أعضاؤه
• مفيش [CREATURE] section = مرفوض!

📌 قواعد الـ Prompt:
• البطل يفضل بشكله الطبيعي — بشرة ولون وملابس عادية، لا شفافية على جسمه
• ⚠️ negative_prompt لازم يتضمن: "organs outside body, organs protruding, exposed organs, disproportionate head, head different texture, harsh organ colors, clinical red"
• في visual_script: استخدم كلمات style مختصرة: "transparent creature, soft pastel organs inside body, lifelike, 8K"
• التفاصيل الكاملة (render keywords) تبقى في scene_prompt مش visual_script
• image_prompt للبطل = طبيعي عادي | الكائن الشفاف يُوصف بالتفصيل في scene_prompt`;
    })()
    : '';


  // 9. VOICE TONE DNA — الحمض النووي للنبرة
  const toneDNA = getVoiceToneDNA(voiceTone);

  // 10. DIALECT DNA — الحمض النووي للهجة
  const dialectDNA = getDialectDNA(dialect);

  // 9. GOLDEN SCENE — compact genre-specific example (saves tokens)
  const getSceneKey = (g) => {
    const gl = g.toLowerCase();
    if (gl.includes('cook') || gl.includes('food') || gl.includes('recipe')) return 'cooking';
    if (gl.includes('medical') || gl.includes('health')) return 'medical';
    if (gl.includes('science') || gl.includes('documentary') || gl.includes('tutorial') || gl.includes('educational')) return 'educational';
    if (gl.includes('comedy') || gl.includes('funny') || gl.includes('sketch') || gl.includes('sarcas')) return 'comedy';
    if (gl.includes('horror') || gl.includes('thriller') || gl.includes('mystery') || gl.includes('crime')) return 'horror';
    if (gl.includes('drama') || gl.includes('emotional') || gl.includes('romance') || gl.includes('love')) return 'drama';
    if (gl.includes('action') || gl.includes('adventure') || gl.includes('sport')) return 'action';
    if (gl.includes('kid') || gl.includes('family') || gl.includes('cartoon')) return 'kids';
    if (gl.includes('motivat') || gl.includes('inspirat') || gl.includes('self-help') || gl.includes('psycholog')) return 'motivational';
    if (gl.includes('sci-fi') || gl.includes('futur') || gl.includes('fantasy') || gl.includes('epic')) return 'scifi';
    if (gl.includes('viral') || gl.includes('social') || gl.includes('trend')) return 'viral';
    return 'default';
  };
  const sceneKey = getSceneKey(genre);

  // Compact golden scenes — visual only (dialogue/audio use dialect DNA examples)
  const goldenVisuals = {
    cooking: `[LOCATION] Modern kitchen, steel counters, steam rising. [LIGHTING] Warm 5500K pendants, rim light from window. [CAMERA] Medium shot, 50mm, shallow DoF, tracking. [ACTION] Chef stirs bubbling pot, sauce glistening, droplets splashing, focused expression. [STYLE] ${renderKeywords} --ar ${aspectRatio}`,
    medical: `[LOCATION] Interior bloodstream, red blood cells flowing, plasma glowing amber. [LIGHTING] Bioluminescent glow, pulsing immune signals. [CAMERA] Macro tracking, 100mm, extreme shallow DoF. [ACTION] White blood cell spots virus, extends pseudopod, engulfing begins. [STYLE] ${renderKeywords} --ar ${aspectRatio}`,
    comedy: `[LOCATION] Cluttered apartment, mismatched furniture, pizza boxes. [LIGHTING] Flickering fluorescent 6500K, phone glow. [CAMERA] Static wide, 35mm, deep DoF. [ACTION] Character freezes mid-bite at phone, eyes widen comically, crumbs fall slow-mo. [STYLE] ${renderKeywords} --ar ${aspectRatio}`,
    horror: `[LOCATION] Abandoned hospital corridor, peeling paint, flickering lights. [LIGHTING] Single fluorescent 7000K, deep shadows, red EXIT glow. [CAMERA] Slow dolly push, 24mm wide, low angle. [ACTION] Door creaks open by itself, cold mist rolls along floor. [STYLE] ${renderKeywords} --ar ${aspectRatio}`,
    drama: `[LOCATION] Rain-streaked café window at night, neon reflections. [LIGHTING] Warm amber 3200K inside, cold blue rain outside. [CAMERA] Close-up through glass, 85mm, rack focus. [ACTION] Character reads phone message, jaw tightens, eyes glisten, places phone face-down. [STYLE] ${renderKeywords} --ar ${aspectRatio}`,
    action: `[LOCATION] Skyscraper rooftop under construction, steel beams, city below. [LIGHTING] Spotlights from below, orange sunset. [CAMERA] Static wide, 24mm, low angle, deep DoF. [ACTION] Character leaps between beams, grabs cable mid-air, lands in combat roll. [STYLE] ${renderKeywords} --ar ${aspectRatio}`,
    kids: `[LOCATION] Magical treehouse, glowing crayon walls, floating books. [LIGHTING] Fairy lights 3000K, bioluminescent mushrooms 。[CAMERA] Child eye-level, 50mm, gentle float. [ACTION] Robot opens glowing book, light butterflies emerge, eyes widen in wonder. [STYLE] ${renderKeywords} --ar ${aspectRatio}`,
    educational: `[LOCATION] Solar system visualization, Earth rotating. [LIGHTING] Sun as main source, atmospheric blue halo. [CAMERA] Smooth orbital tracking, 100mm telephoto. [ACTION] Camera flies through atmosphere showing aurora, transitions to city lights view. [STYLE] ${renderKeywords} --ar ${aspectRatio}`,
    motivational: `[LOCATION] Boxing gym 5AM, heavy bag, single spotlight. [LIGHTING] Hard overhead pool, pre-dawn blue windows. [CAMERA] Static low angle, 35mm, shallow DoF. [ACTION] Fighter wraps hands, shadow boxes, explodes into heavy bag. [STYLE] ${renderKeywords} --ar ${aspectRatio}`,
    scifi: `[LOCATION] Derelict generation ship, bioluminescent flora overgrowth. [LIGHTING] Cyan bioluminescence, emergency red strips, nebula god rays. [CAMERA] Steadicam glide, 28mm wide. [ACTION] Protagonist touches panel, AI projects star map showing 400-year drift. [STYLE] ${renderKeywords} --ar ${aspectRatio}`,
    viral: `[LOCATION] Modern apartment, natural daylight, phone recording. [LIGHTING] Bright daylight, warm fill. [CAMERA] Phone-style vertical, close-up. [ACTION] Transparent cat sees mirror reflection, brain pulses, paw reaches out. [CREATURE] Transparent cat, brain firing pulses, heart accelerating. [STYLE] ${renderKeywords} --ar 9:16`,
    default: `[LOCATION] Atmospheric ${genre} environment, rich details. [LIGHTING] Dramatic ${colorHint}, motivated sources. [CAMERA] Static or gentle pan, steady tripod, cinematic framing. [ACTION] Main character in defining moment, expressive body language. [STYLE] ${renderKeywords} --ar ${aspectRatio}`
  };
  const goldenVisual = goldenVisuals[sceneKey] || goldenVisuals.default;
  const goldenDialogue = dialectDNA.exampleDialogue[0];
  const goldenAudio = "FG: [primary action sounds] | MG-NEAR: [secondary sounds] | MG-FAR: [distant sounds] | BG: [ambient bed] | SFX: [genre-specific effects]";

  // === BUILD THE LASER PROMPT ===
  return `أنت **${persona.role}**.
صوتك: ${persona.voice}
مهمتك: ${persona.mission}
أسلوبك: ${persona.signature_style}

═══ المشروع ═══
• الفكرة: "${concept}"
• النوع: ${genre} | الأسلوب: ${style}
• المدة/مشهد: ${duration}ث | عدد المشاهد: ${numScenes}
• عدد الشخصيات: ${numCharacters} | نوع: ${characterType}
• اللغة: ${dialectDNA.name} | نبرة الصوت: ${toneDNA.name}
• نسبة العرض: ${aspectRatio}

🎯🎯🎯 الهدف الأساسي (أولوية قصوى — لا تحيد عنه أبداً):
${getGenreGoal(genre)}

${charRule}
${charLock}
${selfEatRule}
${narratorRule}
${transparentStyleRule}
${teamRule}
${prohibitions ? `
🚫🚫🚫 محظورات المستخدم (ممنوع نهائياً):
${prohibitions}` : ''}
${notes ? `
📝 تعليمات المستخدم الإبداعية (أولوية عالية):
${notes}` : ''}

${aspectRatioData.rules}

═══ القوانين الثلاثة لـ ${genre} ═══
${persona.laws.join('\n')}

═══ تقنياتك المميزة (استخدم 2+ في كل مشهد) ═══
${persona.must_haves.map(h => `• ${h}`).join('\n')}

${(persona.content_mandates && persona.content_mandates.length > 0) ? `═══ أوامر إبداعية إلزامية لنوع ${genre} ═══
${persona.content_mandates.map(m => `🎯 ${m}`).join('\n')}
` : ''}
═══ القوس الدرامي (${numScenes} مشاهد) ═══
• المشاهد 1-${Math.ceil(numScenes * 0.25)}: 🟢 التأسيس — قدّم العالم والشخصية، اخطف الانتباه من أول ثانية
• المشاهد ${Math.ceil(numScenes * 0.25) + 1}-${Math.ceil(numScenes * 0.7)}: 🟡 التصعيد — عقّد الموقف، زوّد الضغط والتوتر
• المشاهد ${Math.ceil(numScenes * 0.7) + 1}-${numScenes}: 🔴 الذروة والنهاية — لحظة الحقيقة + خاتمة مؤثرة
⚠️ ممنوع مشاهد منفصلة — كل مشهد يكمّل اللي قبله ويمهّد لللي بعده. لازم يكون فيه تطور واضح.

═══ 🔗 ربط المشاهد — Scene Continuity Engine (إلزامي) ═══
كل مشهد لازم يرتبط باللي قبله بـ 3 طرق:
1. 🎨 **Visual Bridge**: آخر عنصر بصري في المشهد = أول عنصر في المشهد اللي بعده
   مثال: المشهد 2 بينتهي بالبطل بيبص على الباب → المشهد 3 يبدأ من الناحية التانية من الباب
2. 🔊 **Audio Bridge**: صوت من المشهد السابق يستمر لحظة في بداية المشهد الجديد
   مثال: صوت المطر من المشهد 1 يستمر خافت في أول ثانيتين من المشهد 2
3. 💬 **Dialogue Hook**: آخر جملة في المشهد تمهد للمشهد اللي بعده أو تسأل سؤال
   مثال: "بس الحكاية مخلصتش..." → المشهد اللي بعده يكمل الحكاية
⚠️ مشهد بدون أي bridge مع اللي قبله = مشهد مفكوك = مرفوض!

═══ 💥 Power Ending Protocol — المشهد الأخير (إلزامي) ═══
المشهد رقم ${numScenes} (الأخير) له قواعد خاصة:
1. 🔄 **Callback**: لازم يرجع لعنصر من المشهد الأول (مكان / جملة / prop) — دائرة كاملة
   مثال: المشهد 1 قال "أنا مش زيهم" → المشهد الأخير يقول "أنا مش زيهم... أنا أحسن"
2. 💬 **Quotable Line**: آخر جملة في السيناريو = الجملة اللي المشاهد هيفتكرها وهيعيد نشرها
   مثال: "والبيضة اكتشفت... إن اللي خايف ينكسر مش هيتولد أبداً"
3. 🎬 **Visual Crescendo**: المشهد الأخير لازم يكون أقوى بصرياً من كل المشاهد — مش ملخص ولا recap
⚠️ نهاية ضعيفة = سيناريو فاشل حتى لو المشاهد اللي قبلها قوية!

═══ 🎭 Dialogue Personality Lock — قفل صوت الشخصيات (إلزامي) ═══
كل شخصية لازم يكون ليها صوت مميز في الحوار:
1. **Catchphrase**: كل شخصية ليها 1-2 تعبير مميز بتكرره (مش كل جملة — بس 2-3 مرات في السيناريو)
   مثال: البطل دايماً يقول "يعني إيه يعني!" | الصديق يقول "بقولك إيه..."
2. **Sentence Rhythm**: كل شخصية ليها إيقاع مختلف:
   → الشخصية المتوترة: جمل قصيرة متقطعة ("لأ. مش كده. يعني... أنا...!")
   → الشخصية الحكيمة: جمل طويلة متماسكة ("شوف يا حبيبي، الدنيا دي فيها حاجات كتير مش بنفهمها")
   → الشخصية الكوميدية: جمل بتتصاعد وتنتهي بمفاجأة ("كل حاجة كانت تمام... لحد ما الملعقة طارت!")
3. **Voice Test**: لو غطيت اسم الشخصية من الحوار ومش عارف تخمن مين اللي بيتكلم → الحوار فاشل
⚠️ شخصيتين بيتكلموا بنفس الطريقة = فشل!

═══ 🎨 الحمض النووي البصري — ${styleDNA.name} ═══
${styleDNA.desc}
• لوحة الألوان (Color Palette): ${styleDNA.colorPalette}
• قواعد الإضاءة (Lighting): ${styleDNA.lighting}
• حركة الكاميرا (Camera): ${styleDNA.camera}
• كلمات الرندر (Render): ${styleDNA.renderKeywords}
• ممنوعات بصرية (Negative): ${styleDNA.negativePrompt}
• المزاج العام (Mood): ${styleDNA.mood}
• الملمس والخامات (Texture): ${styleDNA.texture}
• بيئات مقترحة (Environments): ${styleDNA.environments.join(' | ')}
• إلهام (Inspired By): ${styleDNA.inspiredBy}

⚠️ كل مشهد لازم يلتزم بالأسلوب البصري "${styleDNA.name}" — الألوان والإضاءة والكاميرا والمزاج لازم يكونوا متسقين مع الـ DNA البصري ده.

═══ 🧑 الحمض النووي للشخصية الرئيسية — ${charDNA.name} ═══
${charDNA.desc}
• البنية البصرية (Visual Build): ${charDNA.visualBuild}
• ملامح الوجه (Facial Features): ${charDNA.facialFeatures}
• الملابس والزي (Costume): ${charDNA.costumeStyle}
• ألوان الشخصية (Color Scheme): ${charDNA.colorScheme}
• أسلوب الحركة (Animation): ${charDNA.animationStyle}
• سمات الشخصية (Personality): ${charDNA.personalityTraits}
• نمط الحوار (Dialogue): ${charDNA.dialogueStyle}
• ملاحظات الرندر (Render): ${charDNA.renderNotes}
• أسلوب التفاعل (Interaction): ${charDNA.interactionStyle}
• إلهام (Inspired By): ${charDNA.inspiredBy}

⚠️ الشخصية الرئيسية لازم تلتزم بالـ DNA ده — البنية البصرية والملامح والحركة والحوار لازم يكونوا متسقين مع نوع الشخصية "${charDNA.name}".

${secondaryDNAs.length > 0 ? secondaryDNAs.map((sd, i) => `═══ 👥 شخصية ثانوية ${i + 1} — ${sd.name} ═══
${sd.desc}
• البنية البصرية: ${sd.visualBuild}
• ملامح الوجه: ${sd.facialFeatures}
• الملابس والزي: ${sd.costumeStyle}
• ألوان الشخصية: ${sd.colorScheme}
• أسلوب الحركة: ${sd.animationStyle}
• سمات الشخصية: ${sd.personalityTraits}
• نمط الحوار: ${sd.dialogueStyle}
• ملاحظات الرندر: ${sd.renderNotes}
• أسلوب التفاعل: ${sd.interactionStyle}
• إلهام: ${sd.inspiredBy}`).join('\n\n') + `

🤝 قواعد التفاعل بين الشخصيات:
• كل شخصية لازم يكون ليها هوية بصرية مميزة ومختلفة عن الباقي
• في كل مشهد، حدد مين الشخصية اللي بتقود الحدث ومين بتتفاعل
• الحوار لازم يعكس شخصية كل واحد — مينفعش كلهم يتكلموا بنفس الطريقة
• في scene_prompt و visual_script: اذكر كل الشخصيات الموجودة في المشهد بالاسم` : ''}


═══ 🎙️ الحمض النووي للنبرة — ${toneDNA.name} ═══
${toneDNA.desc}
• الإيقاع (Pacing): ${toneDNA.pacing}
• المفردات (Vocabulary): ${toneDNA.vocabulary}
• بنية الجمل (Sentence Structure): ${toneDNA.sentenceStructure}
• النطاق العاطفي (Emotional Range): ${toneDNA.emotionalRange}
• أسلوب الترقيم (Punctuation): ${toneDNA.punctuationStyle}
• توجيهات صوتية (Audio Direction): ${toneDNA.audioDirection}
• أمثلة حوار بالنبرة:
${toneDNA.exampleLines.map((l, i) => `  ${i + 1}. "${l}"`).join('\n')}
• ممنوعات النبرة: ${toneDNA.forbidden}
• أنواع متوافقة: ${toneDNA.compatibleGenres.join(' | ')}
• إلهام: ${toneDNA.inspiredBy}

⚠️ كل حوار لازم يلتزم بنبرة "${toneDNA.name}" — الإيقاع والمفردات وبنية الجمل والمشاعر لازم يكونوا متسقين مع الـ DNA الصوتي ده.

═══ 🌍 الحمض النووي للهجة — ${dialectDNA.name} ═══
${dialectDNA.desc}
• المنطقة (Region): ${dialectDNA.region}
• قواعد المفردات (Vocabulary Rules): ${dialectDNA.vocabularyRules}
• التحيات (Greetings): ${dialectDNA.greetings}
• تعبيرات شائعة: ${dialectDNA.commonExpressions.join(' | ')}
• كلمات عامية مميزة: ${dialectDNA.slangWords.join(' | ')}
• نهايات الجمل: ${dialectDNA.sentenceEndings}
• نوع الفكاهة: ${dialectDNA.humorStyle}
• مراجع ثقافية: ${dialectDNA.culturalReferences}
• أمثلة حوار باللهجة:
${dialectDNA.exampleDialogue.map((l, i) => `  ${i + 1}. "${l}"`).join('\n')}
• ممنوعات لغوية: ${dialectDNA.forbidden}
• نظام الكتابة: ${dialectDNA.writingScript}

⚠️ كل الحوارات لازم تتكتب بلهجة "${dialectDNA.name}" — المفردات والتحيات والتعبيرات ونهايات الجمل لازم تبقى أصيلة ومتسقة مع الـ DNA اللغوي ده. ممنوع خلط لهجات.

🔴 قواعد اللهجة الصارمة (إلزامي):
• استخدم أدوات النفي الخاصة باللهجة — مثلاً المصري: "ما...ش" (ماعرفش، ماشفتش، مارحتش) وليس "ما عرفت" أو "لم أعرف".
• استخدم التعبيرات الشعبية الأصيلة مش الترجمة الحرفية من الفصحى — مثلاً: "يا فندم" مش "يا ست هانم"، "خلاص" مش "حسناً".
• الحوار لازم يبان كأنه شخص حقيقي بيتكلم في الشارع — مش مترجم من الفصحى.
• ممنوع: كلمات فصحوية في حوار عامي (لو سمحت → من فضلك/لو سمحتي، هونها → سهلها/خففها).
• كل حوار اختبره بسؤال: "هل حد في الشارع بيقول كده فعلاً؟" لو الإجابة لأ → غيّره.

═══ ✏️ قاعدة التشكيل ═══
🔴 ممنوع نهائياً استخدام التشكيل (حركات/فتحة/ضمة/كسرة/شدة/تنوين) في الحوارات العربية العامية.
• اكتب الحوار بدون أي تشكيل — خلّي اللهجة طبيعية وأصيلة كما ينطقها أهلها.
• التشكيل بيخلّي الكلام يبان فصحى ومتصلّب — واحنا عايزين لهجة حية وطبيعية.
• الاستثناء الوحيد: الفصحى (MSA) — لو اللهجة فصحى، شكّل الكلام بشكل إعرابي صحيح.


═══ أخطاء ممنوعة ═══
${persona.common_pitfalls.map(p => `✗ ${p}`).join('\n')}

═══ 📷 CAMERA STYLE RULE (إلزامي) ═══
🎯 القاعدة الذهبية: الكاميرا هادية ومستقرة — مفيش حركات سريعة أو مفاجئة 🎯
التصوير لازم يكون طبيعي ومريح للعين — زي ما بتتفرج على فيلم مش فيديو أكشن.

المشهد الأول (التأسيس): WIDE/ESTABLISHING — لقطة واسعة ثابتة بتعرّف المكان، بدون حركة أو بحركة بطيئة جداً
المشاهد الوسطى: نوّع بين:
  → STATIC MEDIUM (35-50mm) — لقطة ثابتة للحوار والتفاعل (الأساس)
  → GENTLE PAN/TILT — حركة بطيئة وناعمة فقط لمتابعة الحدث
  → CLOSE-UP (85mm+) — للعاطفة والتفاصيل، ثابتة مش متحركة
المشهد الأخير: لقطة ثابتة أو SLOW PULL-BACK — بدون حركات مفاجئة

⚠️ ممنوعات الكاميرا:
✗ ممنوع: fast tracking, speed ramping, handheld shaky, snap zoom, whip pan
✗ ممنوع: حركات كاميرا سريعة أو مفاجئة من أي نوع
✓ مسموح: ثابتة، pan بطيء، tilt هادي، dolly بطيء جداً

مثال صح ✅: "[CAMERA] Static medium shot, 50mm lens, eye level, steady tripod, shallow DoF"
مثال غلط ❌: "[CAMERA] Dynamic tracking shot with speed ramp" (حركة سريعة = مرفوض)

═══ 🎙️ TONE ENFORCEMENT (إلزامي) ═══
النبرة "${toneDNA.name}" يجب أن تحكم:
1. الحوار: استخدم المفردات والإيقاع من أمثلة النبرة — لا تكتب حوار "تعليمي جاف" إذا النبرة ترفيهية
2. المؤثرات الصوتية: لازم تعكس طاقة النبرة (مرح = أصوات كرتونية مبالغة | درامي = أصوات عميقة وبطيئة | مخيف = أصوات مفاجئة وصمت)
3. الإيقاع: ${toneDNA.pacing} ← هذا يحكم سرعة القطع بين المشاهد

═══ 🔇 AUDIO RULE (إلزامي) ═══
• ممنوع نهائياً: موسيقى، ميوزيك، music، soundtrack، score، melody، lullaby، theme
• المطلوب: مؤثرات صوتية (SFX) احترافية واقعية فقط
• كل طبقة صوت لازم تكون مؤثر صوتي حقيقي مرتبط بالمشهد مباشرة
• SFX = مؤثرات خاصة (انفجار، صرير، طقطقة، صفارة) — مش موسيقى
• AMBIENT = أصوات بيئية طبيعية (رياح، مطر، زحمة، حشرات) — مش موسيقى
• المؤثرات لازم تتنوع بين المشاهد — ممنوع تكرار نفس المؤثر

═══ قبل كتابة كل مشهد، فكّر (Think-First Protocol) ═══
1. ما الهدف الدرامي لهذا المشهد؟ (تقديم شخصية / تصعيد / ذروة / حل)
2. ما الشعور المطلوب؟ (خوف / ضحك / دهشة / حماس)
3. ما الرابط البصري مع المشهد السابق؟ (نفس الإضاءة / نفس المكان / نفس الشخصية)
4. هل الحوار طبيعي ولّا مترجم؟
5. هل زاوية الكاميرا مختلفة عن المشهد السابق؟

═══ المشهد الذهبي (اكتب بنفس المستوى ده بالظبط) ═══

**visual_script (60-80 كلمة باللغة الإنجليزية):**
"${goldenVisual}"

**dialogue_script (${wordCountMin}-${wordCountMax} كلمة بالعامية — تجاوز الحد = مرفوض):**
"${goldenDialogue}"

**audio_notes (5 طبقات صوتية — بدون موسيقى نهائياً):**
"${goldenAudio}"

**scene_prompt (60-80 كلمة إنجليزية — يُستخرج من visual_script):**
"CREF: [اسم الشخصية] - [نسخ حرفي من image_prompt]. [نفس محتوى visual_script لكن بصيغة prompt لمولد الصور]. ${renderKeywords} --ar ${aspectRatio}"

═══ قواعد حرجة (5 فقط) ═══
1. visual_script = 60-80 كلمة إنجليزية بصيغة [LOCATION] + [LIGHTING] + [CAMERA] + [ACTION]${isTransparentStyle ? ' + [CREATURE]' : ''} + [STYLE]${isTransparentStyle ? ' — ⚠️ [CREATURE] section إلزامي = 15-20 كلمة وصف الكائن الشفاف وأعضاؤه' : ''}
2. dialogue_script = ${wordCountMin}-${wordCountMax} كلمة بلهجة ${dialectDNA.name} — طبيعي، بدون تكرار، تجاوز الحد = مرفوض
3. scene_prompt = CREF: [الشخصية] + نفس تفاصيل visual_script + ${renderKeywords}
4. negative_prompt = مخصص حسب نوع المشهد:
   • Close-up/Portrait → "deformed face, asymmetric eyes, extra fingers, bad teeth, blurry skin texture, uncanny valley, bad anatomy, low quality, watermark, ${styleDNA.negativePrompt}, character appearance changes"
   • Medium shot → "deformed hands, extra fingers, bad anatomy, wrong proportions, missing limbs, low quality, watermark, ${styleDNA.negativePrompt}, character appearance changes"
   • Wide/Establishing → "inconsistent perspective, floating objects, broken architecture, impossible geometry, blurry background, low quality, watermark, ${styleDNA.negativePrompt}, character appearance changes"
   • اختر النوع المناسب من [CAMERA] في الـ visual_script — ممنوع نفس الـ negative لكل المشاهد
5. الاتساق = نفس وصف الشخصية + نفس الإضاءة + نفس الأسلوب في كل المشاهد

═══ الحوار — قواعد TTS ═══
• جمل متدفقة 8-15 كلمة — مش جمل مقطّعة
• فاصلة (,) للوقفات الطبيعية — بدل !!!
• ✅ "${dialectDNA.exampleDialogue[0]}"
• 🚫 ${dialectDNA.forbidden}
• ${numCharacters > 1 ? `سمّي كل متكلم بالاسم قبل كل جملة حوار` : 'مونولوج داخلي أو تعليق صوتي'}

═══ مراجعة ذاتية (افحص قبل الإخراج) ═══
□ هل كل الشخصيات بنفس الوصف البصري في كل مشهد؟
□ هل كل الحوارات بلهجة "${dialectDNA.name}" ثابتة بلا خلط؟
□ هل فيه تصعيد درامي واضح من المشهد الأول للأخير؟
□ هل كل visual_script فيه [LOCATION]+[LIGHTING]+[CAMERA]+[ACTION]+[STYLE]؟
□ هل عدد المشاهد = ${numScenes} بالظبط وعدد الشخصيات = ${numCharacters}؟
□ هل كل audio_notes خالي تماماً من أي إشارة لموسيقى أو music أو score؟
□ هل زوايا الكاميرا متنوعة (3 أنواع على الأقل)؟
□ هل الحوار في حدود ${wordCountMin}-${wordCountMax} كلمة لكل مشهد؟
${isNonHuman ? `□ 🚨 هل البطل هو الراوي (first-person بضمير المتكلم)؟ لو لأ → أعد كتابة كل الحوارات
□ 🚨 هل فيه أي عنصر بشري (أيدي، وجوه، أشخاص) في visual_script؟ لو أه → احذفه فوراً
□ 🚨 هل الحوار فيه "يا ترى" أو "هل تعلم"؟ لو أه → امسحها وابدأ بفعل أو اسم` : ''}
${isTransparentStyle ? `□ 🫧 هل الكائن الشفاف موجود في كل مشهد بدون استثناء؟ لو لأ → أضفه فوراً
□ 🫧 هل كل visual_script فيه [CREATURE] section (15-20 كلمة)؟ لو لأ → أضفه
□ 🫧 هل كل [ACTION] فيه تفاعل عضو (قلب/رئة/عمود فقري/دورة دموية) مع الحدث؟ لو لأ → أضفه
□ 🫧 هل كل الأعضاء جوّا حدود الجسم؟ لو فيه عضو طالع برّا → أعد الوصف` : ''}
□ 🔗 هل كل مشهد مرتبط باللي قبله بـ bridge واحد على الأقل (بصري/صوتي/حواري)؟ لو لأ → أضف bridge
□ 💥 هل المشهد الأخير فيه callback لعنصر من المشهد الأول؟ لو لأ → أضف callback
□ 💥 هل آخر جملة في السيناريو quotable وقوية؟ لو لأ → أعد كتابتها
□ 🎭 لو فيه أكتر من شخصية: هل كل واحد ليه صوت مميز في الحوار؟ لو غطيت الاسم ومش عارف تخمنه → أعد صياغة الحوار

═══ مخطط JSON (أخرج ده بالظبط) ═══
{
  "creative_blueprint": {
    "plan_summary": "رؤية المخرج في 1-2 جملة",
    "audience_hook": "المحفز النفسي في أول 3 ثوانٍ",
    "visual_arc": "تطور المزاج (مثلاً: 'من ظلام إلى نور')"
  },
  "meta_data": {
    "title": "عنوان عربي إبداعي",
    "logline": "ملخص في جملة واحدة (عربي)",
    "director_notes": "Brief tone note (English)",
    "master_visual_prompt": "[Subject] + [Environment] + [Lighting] + [Camera] + [Style] ${renderKeywords} --ar ${aspectRatio} (ENGLISH, 60-80 words — هذا المرجع البصري لكل المشاهد)"
  },
  "characters": [
    // 🔒 بالظبط ${numCharacters} شخصية
    {
      "name_ar": "الاسم بالعربي",
      "name_en": "English Name",
      "role": "الدور (بطل / مساعد / خصم)",
      "screenplay_description": "CHARACTER: [Name] | TYPE: [Archetype] | PHYSICAL: [Body] | FACE: [Features] | COSTUME: [Clothing] | PROPS: [Items] | DISTINCTIVE: [Unique markers]",
      "image_prompt": "Character image prompt (English, ${style} aesthetic, 40-60 words)"
    }
  ],
  "scenes": [
    // 🔒 بالظبط ${numScenes} مشهد
    {
      "scene_number": 1,
      "duration_seconds": ${duration},
      "visual_script": "[LOCATION]...[LIGHTING]...[CAMERA]...[ACTION]...[STYLE]... (60-80 words, English)",
      "dialogue_script": "(${wordCountMin}-${wordCountMax} words, ${dialect})",
      "audio_notes": "FG: [أصوات قريبة] | MG-NEAR: [أصوات متوسطة] | MG-FAR: [أصوات بعيدة] | BG: [خلفية بيئية] | SFX: [مؤثرات خاصة]",
      "scene_prompt": "CREF: [character] + [location] + [action] + [lighting] + [camera] + ${renderKeywords} --ar ${aspectRatio} (60-80 words, English)",
      "negative_prompt": "[مخصص حسب نوع الكاميرا: close-up → face/skin negatives | medium → hands/anatomy negatives | wide → perspective/architecture negatives] + ${styleDNA.negativePrompt} + low quality, watermark, character appearance changes"
    }
  ]
}

⚠️ بالظبط ${numScenes} مشهد. بالظبط ${numCharacters} شخصية. JSON فقط. بدون شرح.
🔥 ابدأ الآن. أخرج التحفة.
`;
};