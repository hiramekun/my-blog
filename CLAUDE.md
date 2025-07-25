# CLAUDE.md

This file provides Claude Code project configuration and guidance.

## Commands

### Development
- `npm run dev` - Start development server
- `npm run build` - Generate static site (outputs to `out/`)
- `npm run lint` - Run ESLint checks

### Deployment
Auto-deploy via GitHub Actions (`.github/workflows/deploy.yml`). Triggers on push to `main` branch.

## Architecture

**Static blog site** - Next.js 15 + TypeScript + GitHub Pages

### Blog Content
- **Articles**: Markdown/MDX files in `posts/` directory
- **Processing**: Article loading and parsing in `src/lib/posts.ts`
- **Frontmatter**: `title`, `date`, `excerpt`, `tags`

### Static Generation Config
- `output: "export"` - Generate static HTML
- `trailingSlash: true` - For GitHub Pages
- `basePath: "/my-blog"` - Subpath support
- `images: { unoptimized: true }` - For static export

### Page Structure
- **Home** (`src/app/page.tsx`): Article list (2-column layout)
- **Articles** (`src/app/posts/[id]/page.tsx`): Individual article pages
- **Archive** (`src/app/archive/[year]/[month]/page.tsx`): Monthly article listings
- **Header/Sidebar** (`src/components/`): Shared components

### Design System
- **Dark Theme**: GitHub dark color palette (`src/app/globals.css`)
- **CSS Variables**: Centralized theme color management
- **Markdown Rendering**: `marked.js` + `highlight.js` + footnote support
- **Responsive**: 2-column (desktop) ↔ 1-column (mobile)

### Article Processing
1. Parse Markdown files from `posts/` with `gray-matter`
2. Convert to HTML with `marked.js` (GitHub Flavored Markdown + footnotes)
3. Apply syntax highlighting with `highlight.js`
4. Sort by date (newest first)

## TypeScript Config
- **Path Aliases**: `@/*` → `./src/*`
- **Important**: Place utilities in `src/` directory (`src/lib/posts.ts`)

## GitHub Pages
- **Live URL**: https://hiramekun.github.io/my-blog/
- **Deploy**: GitHub Actions deploys `out/` directory
- **Setup**: Configure Pages settings to "GitHub Actions"

## Common Issues
- **Build Errors**: Check if files are in `src/` directory
- **Articles Not Showing**: Verify frontmatter date format (`YYYY-MM-DD`)
- **Image Paths**: Place static files in `public/`, requires `/my-blog/` prefix