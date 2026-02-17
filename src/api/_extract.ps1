$lines = Get-Content -Path "promptApi.js" -Encoding UTF8

# --- screenplayEngine.js ---
$h1 = "// SCREENPLAY ENGINE - generate_prompt + generateSystemPrompt`n"
$h1 += "import { TEXT_MODEL } from '../config.js';`n"
$h1 += "import { callOpenRouter } from '../openrouter.js';`n"
$h1 += "import { getCharacterKnowledge, getAspectRatioRules } from '../knowledgeBase.js';`n"
$h1 += "import { getPersona } from './personaEngine.js';`n"
$h1 += "import { getStyleDNA } from './styleDnaEngine.js';`n"
$h1 += "import { getCharacterDNA } from './characterDnaEngine.js';`n"
$h1 += "import { getVoiceToneDNA } from './voiceToneDnaEngine.js';`n"
$h1 += "import { getDialectDNA } from './dialectDnaEngine.js';`n"
$h1 += "import { getTransparentCreatureRules } from './transparentCreatureEngine.js';`n"
$h1 += "import { getGenreGoal } from './genreGoalEngine.js';`n`n"
$body1 = ($lines[18..49] + "" + $lines[2960..3570]) -join "`n"
[System.IO.File]::WriteAllText("engines/screenplayEngine.js", $h1 + $body1, [System.Text.Encoding]::UTF8)
Write-Host "OK screenplayEngine.js"

# --- brainstormEngine.js ---
$h2 = "// BRAINSTORM ENGINE - brainstorm_concept + generateIdeaPrompt + helpers`n"
$h2 += "import { TEXT_MODEL } from '../config.js';`n"
$h2 += "import { callOpenRouter } from '../openrouter.js';`n"
$h2 += "import { getPersona } from './personaEngine.js';`n"
$h2 += "import { getStyleDNA } from './styleDnaEngine.js';`n"
$h2 += "import { getCharacterDNA } from './characterDnaEngine.js';`n"
$h2 += "import { getVoiceToneDNA } from './voiceToneDnaEngine.js';`n"
$h2 += "import { getDialectDNA } from './dialectDnaEngine.js';`n"
$h2 += "import { getTransparentCreatureRules } from './transparentCreatureEngine.js';`n`n"
$body2 = ($lines[3572..4219]) -join "`n"
[System.IO.File]::WriteAllText("engines/brainstormEngine.js", $h2 + $body2, [System.Text.Encoding]::UTF8)
Write-Host "OK brainstormEngine.js"

# --- trendEngine.js ---
$h3 = "// TREND ENGINE - search_viral_trends + generate_from_trend`n"
$h3 += "import { TEXT_MODEL } from '../config.js';`n"
$h3 += "import { callOpenRouter } from '../openrouter.js';`n"
$h3 += "import { getCharacterDNA } from './characterDnaEngine.js';`n"
$h3 += "import { getDialectDNA } from './dialectDnaEngine.js';`n"
$h3 += "import { getGenreDNA, getHookTemplates } from './brainstormEngine.js';`n`n"
$body3 = ($lines[4221..4506]) -join "`n"
[System.IO.File]::WriteAllText("engines/trendEngine.js", $h3 + $body3, [System.Text.Encoding]::UTF8)
Write-Host "OK trendEngine.js"

# --- nexusEngine.js ---
$h4 = "// NEXUS ENGINE - Prompt Architect (engineer, refine, simulate)`n"
$h4 += "import { TEXT_MODEL } from '../config.js';`n"
$h4 += "import { callOpenRouter } from '../openrouter.js';`n"
$h4 += "import { getStrategy, autoDetectStrategy } from '../promptStrategies.js';`n`n"
$body4 = ($lines[4508..5517]) -join "`n"
[System.IO.File]::WriteAllText("engines/nexusEngine.js", $h4 + $body4, [System.Text.Encoding]::UTF8)
Write-Host "OK nexusEngine.js"

Write-Host "ALL DONE"
