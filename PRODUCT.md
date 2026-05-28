# PRODUCT.md — NorthStar Impex AI 学习平台

**Register:** product

## Users

An internal, China-based procurement team (sourcing steel, contacting suppliers, building
RFQs) learning to use AI in daily work. Their environment is Claude Code on a DeepSeek
backend. They access from mainland China; the admin (NorthStar Impex) from India. The team
is technical, busy, and culturally direct — they prefer substance to flash.

## Product purpose

An internal training portal: one learning video, six theory chapters (each with a real
comprehension quiz), six hands-on practical labs, and seven AI labs (the six plus a Browser
Agents lab). Entirely in Simplified Chinese. Progress persists per user.

## Brand

NorthStar Impex — a red five-pointed star wordmark. Professional, not flashy. Generous
whitespace, substance over decoration. The curtain preloader is the single brand-drama
moment; everything else is quiet and functional.

## Tone

Clear, direct, respectful of the reader's time. No fluff, no marketing voice. UI copy is
Simplified Chinese; it never restates headings and never uses em dashes.

## Anti-references

Generic AI-template look; navy+gold "finance/procurement" cliché; Inter/other default fonts;
identical icon-heading-text card grids; anything that feels machine-generated.

## Strategic principles

- Must load reliably from mainland China and India (Netlify, no GFW-blocked deps, no Supabase
  / Firebase / third-party auth).
- Seamless flow, no broken or jarring states. Loading, empty, and error states are all handled
  with friendly Chinese copy.
- The quizzes test understanding (why / when / what-would-you-do), not memorization.
