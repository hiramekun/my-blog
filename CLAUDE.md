# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the static site (outputs to `out/` directory)
- `npm run lint` - Run ESLint checks

### Deployment
The project auto-deploys to GitHub Pages via GitHub Actions when pushing to the `main` branch. The workflow is defined in `.github/workflows/deploy.yml`.

## Architecture Overview

This is a **static blog site** built with Next.js 15 + TypeScript, configured for static site generation and GitHub Pages deployment.

### Blog Content System
- **Content Location**: All blog posts are stored as Markdown/MDX files in the `posts/` directory
- **Post Processing**: `lib/posts.ts` contains utilities to read and parse Markdown files using `gray-matter` for frontmatter extraction
- **Supported Formats**: Both `.md` and `.mdx` files are supported

### Post Structure
Posts require frontmatter with these fields:
```yaml
---
title: "Post Title"
date: "YYYY-MM-DD"
excerpt: "Optional excerpt"
tags: ["tag1", "tag2"]  # Optional
---
```

### Static Generation Configuration
The `next.config.ts` is configured for static export with:
- `output: "export"` - Generates static HTML files
- `trailingSlash: true` - Required for GitHub Pages
- `images: { unoptimized: true }` - Disables Image Optimization for static export
- MDX support through `@next/mdx`

### Page Structure
- **Home Page** (`src/app/page.tsx`): Lists all blog posts chronologically
- **Post Pages** (`src/app/posts/[id]/page.tsx`): Dynamic routes for individual posts using `generateStaticParams()`
- **Styling**: Tailwind CSS with `@tailwindcss/typography` for Markdown content

### Content Processing Flow
1. Markdown files in `posts/` are read by `lib/posts.ts`
2. Frontmatter is parsed using `gray-matter`
3. Content is converted to HTML using `remark` and `remark-html`
4. Posts are sorted by date (newest first)

### GitHub Pages Deployment
- Builds static files to `out/` directory
- GitHub Actions workflow deploys on push to `main`
- Requires GitHub Pages to be configured for "GitHub Actions" source