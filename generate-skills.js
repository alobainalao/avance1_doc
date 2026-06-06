const fs = require('fs');
const path = require('path');

const files = {
  '.claude/skills/react-slideshow-architect/SKILL.md': `---
name: react-slideshow-architect
description: Maintain and evolve a React scientific presentation system without breaking existing functionality.
---

# PURPOSE

This repository contains a production-ready React slideshow presentation system.

The existing slideshow implementation is STABLE and MUST NOT be modified destructively.

Your task is to evolve the system safely by creating a parallel V2 architecture.

# CRITICAL RULES

## NEVER MODIFY

You MUST NOT break or refactor these existing files unless explicitly requested:

- SlideShow.jsx
- SlideShow.css
- Controls.jsx
- ProgressIndicator.jsx
- AnimationButtons.jsx
- UrlHeader.jsx
- SectionHeader.jsx
- Portada.jsx

These files are considered STABLE PRODUCTION FILES.

You may READ them for compatibility.

# SAFE MIGRATION STRATEGY

Always create:

- SlideShowV2.jsx
- SlideShowV2.css
- slides-v2/
- layouts-v2/
- themes-v2/

Never replace the old system.

The old slideshow must continue working at all times.

# OBJECTIVE

Replace static slide images with real React slide components.

OLD:

<img src="slide1.png" />

NEW:

<Slide01 />

# REQUIRED FEATURES TO PRESERVE

The V2 system MUST preserve:

- keyboard navigation
- swipe navigation
- fullscreen mode
- timing tracking
- progress indicators
- dark/light themes
- iframe overlays
- animations
- responsive behavior
- presentation mode
- mobile support

# REQUIRED ARCHITECTURE

src/
 ├── slides-v2/
 │    ├── Slide01.jsx
 │    ├── Slide02.jsx
 │    └── ...
 │
 ├── layouts-v2/
 │    ├── SlideLayout.jsx
 │    └── ScientificLayout.jsx
 │
 ├── themes-v2/
 │    ├── dark.css
 │    └── light.css
 │
 ├── SlideShowV2.jsx
 └── SlideShowV2.css

# DESIGN REQUIREMENTS

Visual style should resemble:

- modern scientific conference presentations
- Apple Keynote
- linear.app aesthetics
- cinematic UI
- glassmorphism
- subtle gradients
- high readability

Avoid:

- clutter
- excessive neon
- low contrast
- cartoonish styles

# PERFORMANCE RULES

Avoid:

- unnecessary rerenders
- giant inline styles
- duplicated logic
- massive component trees

Prefer:

- reusable layouts
- reusable typography components
- reusable content blocks

# OUTPUT STYLE

When generating code:

- create complete files
- include imports
- include CSS
- explain integration steps
- avoid pseudo-code
`,

  '.claude/skills/react-slideshow-architect/rules.md': `# PROTECTED FILES

Never destructively modify:

- SlideShow.jsx
- SlideShow.css
- Controls.jsx
- ProgressIndicator.jsx
- AnimationButtons.jsx
- UrlHeader.jsx
- SectionHeader.jsx
- Portada.jsx

# REQUIRED APPROACH

Always:

- clone
- extend
- preserve compatibility

Never:

- replace blindly
- refactor unrelated systems
- break keyboard controls
- break fullscreen

# SAFE EXTENSIONS

Allowed:

- SlideShowV2.jsx
- new layouts
- new slides
- helper hooks
- theme extensions
- animation layers

# FORBIDDEN ACTIONS

Do NOT:

- delete old slideshow logic
- rename stable props
- remove current navigation behavior
- alter timing calculations globally
`,

  '.claude/skills/react-slideshow-architect/migration-strategy.md': `# MIGRATION STRATEGY

## STEP 1

Create:

- SlideShowV2.jsx
- SlideShowV2.css
- slideConfig.js

Clone current slideshow behavior safely.

## STEP 2

Create reusable layouts.

Examples:

- SlideLayout
- TwoColumnLayout
- HeroLayout
- ScientificLayout

## STEP 3

Migrate slides gradually.

Never migrate all slides at once.

Start with:

- title slides
- bullet slides
- simple layouts

Then migrate:

- diagrams
- animations
- videos

## STEP 4

Improve progressively.

Possible improvements:

- animated reveals
- responsive grids
- dynamic diagrams
- interactive demos
- live charts

# IMPORTANT

Always preserve:

- current timing system
- current controls
- current gestures
- fullscreen workflow
`,

  '.claude/skills/react-slideshow-architect/architecture.md': `# ARCHITECTURE PRINCIPLES

# GOAL

Transform the slideshow into a presentation application platform.

# PRESENTATION MODEL

Slides are components.

Each slide should:

- receive props
- support themes
- support animations
- support responsive rendering

# CONFIG DRIVEN

Prefer:

const slideConfig = [
  {
    id: 1,
    component: Slide01,
    duration: 30,
    section: 'Introduction'
  }
];

Avoid multiple disconnected arrays.

# LAYOUT DRIVEN

Separate:

- content
- layout
- transitions
- theme

# DESIGN GOALS

Visual target:

- premium
- scientific
- cinematic
- minimal
- modern

Inspired by:

- Apple Keynote
- Linear
- Figma
- modern AI dashboards
`,

  '.claude/skills/slide-migrator/SKILL.md': `---
name: slide-migrator
description: Convert static presentation screenshots into semantic React slides.
---

# OBJECTIVE

Transform image-based slides into semantic JSX slide components.

# PROCESS

For every slide:

1. Identify:
   - title
   - sections
   - bullets
   - diagrams
   - highlights
   - metrics

2. Create:
   - semantic JSX
   - reusable blocks
   - responsive layouts

3. Preserve:
   - original meaning
   - hierarchy
   - emphasis

4. Improve:
   - responsiveness
   - accessibility
   - animation quality

# OUTPUT FORMAT

Generate:

- SlideXX.jsx
- SlideXX.css

# IMPORTANT

Do NOT generate image-based slides.

Slides must be real JSX structures.
`,

  '.claude/skills/slide-migrator/jsx-guidelines.md': `# JSX GUIDELINES

Prefer:

<section>
<header>
<main>
<article>

Use semantic structure.

# COMPONENTIZATION

Extract reusable pieces:

- SectionTitle
- MetricCard
- BulletList
- HighlightBox
- DiagramContainer

# SPACING

Prefer:

- flex layouts
- grid layouts
- gap
- clamp()

Avoid:

- magic pixel values
- deeply nested wrappers
`,

  '.claude/skills/slide-migrator/accessibility.md': `# ACCESSIBILITY

Slides must maintain:

- readable contrast
- scalable typography
- keyboard compatibility

# TYPOGRAPHY

Prefer:

font-size: clamp(1rem, 2vw, 2rem);

# CONTRAST

Maintain strong readability in:

- dark mode
- projector environments
- bright rooms
`,

  '.claude/skills/presentation-ui/SKILL.md': `---
name: presentation-ui
description: Create cinematic scientific presentation interfaces in React.
---

# DESIGN LANGUAGE

Use a premium presentation aesthetic.

Inspired by:

- Apple WWDC
- Linear
- Raycast
- Figma
- modern AI products

# VISUAL RULES

Use:

- subtle gradients
- soft shadows
- glass effects
- layered depth
- smooth transitions

Support:

- dark mode
- light mode

# ACCESSIBILITY

Maintain:

- readable contrast
- scalable text
- keyboard compatibility
`,

  '.claude/skills/presentation-ui/visual-language.md': `# VISUAL LANGUAGE

# COLORS

Dark theme:

- deep navy
- graphite
- soft cyan accents

Light theme:

- subtle whites
- soft grays
- muted blue accents

# DEPTH

Use:

- backdrop blur
- translucent layers
- shadow separation

Avoid flat interfaces.
`,

  '.claude/skills/presentation-ui/animation-guidelines.md': `# ANIMATION GUIDELINES

Preferred library:

- framer-motion

# GOOD ANIMATIONS

Use:

- fade
- slide
- stagger
- soft scaling

# BAD ANIMATIONS

Avoid:

- bounce
- shake
- exaggerated elastic effects
- meme motion

# PERFORMANCE

Animations must remain GPU-friendly.
`,

  '.claude/skills/react-performance-guard/SKILL.md': `---
name: react-performance-guard
description: Protect slideshow rendering performance and avoid unnecessary React rendering costs.
---

# OBJECTIVE

Maintain smooth presentation performance.

# PERFORMANCE RULES

Avoid:

- unnecessary rerenders
- giant context trees
- expensive recalculations
- inline object recreation

# PREFERRED TECHNIQUES

Use:

- memoization
- reusable layouts
- lightweight transitions
- lazy loading when appropriate
`,

  '.claude/skills/react-performance-guard/rendering-rules.md': `# RENDERING RULES

Prefer:

React.memo()
useMemo()
useCallback()

only when useful.

# AVOID

- premature optimization
- unnecessary abstractions

# VIDEO

Pause hidden videos automatically.

# FULLSCREEN

Presentation mode must remain smooth in fullscreen.
`
};

function createFile(filePath, content) {
  const fullPath = path.join(process.cwd(), filePath);

  fs.mkdirSync(path.dirname(fullPath), {
    recursive: true
  });

  fs.writeFileSync(fullPath, content, 'utf8');

  console.log('✓', filePath);
}

console.log('\\nGenerating Claude Skills...\\n');

Object.entries(files).forEach(([filePath, content]) => {
  createFile(filePath, content);
});

console.log('\\nClaude skills generated successfully.\\n');