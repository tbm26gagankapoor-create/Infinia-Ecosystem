# AI Gateway — Project Guidelines

This is product docs/market research/presentation for AI Gateway by Infinia Technologies. Not a code app — HTML pages, markdown docs, MkDocs site.

## Design System
- Dark monochrome: `#000` bg, white text, teal `#2dd4bf` accent
- Fonts: Space Grotesk (body), Roboto Mono (code)
- CSS vars: `--ig-*` prefix, defined inline per HTML file
- Sidebar: fixed left 260px; content starts at 260px

## Editing Conventions
- HTML pages are self-contained with inline `<style>` blocks (no external CSS)
- Keep dark monochrome aesthetic consistent across all pages
- Markdown files numbered sequentially (`01_`, `02_`, etc.)

## Verification
- Do NOT use `preview_screenshot`. Use: `preview_snapshot`, `preview_inspect`, `preview_console_logs`, `preview_logs`, `preview_network`.
- CSS changes → `preview_inspect`. Content changes → `preview_snapshot`.

## External Services
- **Vulcan** (project management): Connected via MCP
- **GitHub:** `tbm26gagankapoor-create/Token-Factory`
- Dev servers in `.claude/launch.json` (ports 8000–8002)
