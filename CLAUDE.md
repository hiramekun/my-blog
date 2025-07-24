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
- **Post Processing**: `src/lib/posts.ts` contains utilities to read and parse Markdown files using `gray-matter` for frontmatter extraction
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
- **Home Page** (`src/app/page.tsx`): Lists all blog posts chronologically with 2-column layout
- **Post Pages** (`src/app/posts/[id]/page.tsx`): Dynamic routes for individual posts using `generateStaticParams()`
- **Header Component** (`src/components/Header.tsx`): Blog title, profile avatar, and description
- **Sidebar Component** (`src/components/Sidebar.tsx`): Profile, categories, archives, and recent posts
- **Styling**: Tailwind CSS + custom CSS in `src/app/globals.css` for optimal Markdown rendering

### Design System (Hatena Blog-inspired)
- **2-Column Layout**: Main content + functional sidebar (responsive: mobile stacks vertically)
- **Typography**: High-contrast text (#1f2937 on white) for excellent readability
- **Markdown Rendering**: Custom CSS with `marked.js` + `highlight.js` for proper code syntax highlighting
- **Color Scheme**: Minimal white/gray palette with blue accents for links
- **Code Blocks**: Dark background (#0d1117) with syntax highlighting for Go/Java/Scala

### Content Processing Flow
1. Markdown files in `posts/` are read by `src/lib/posts.ts`
2. Frontmatter is parsed using `gray-matter`
3. Content is converted to HTML using `marked.js` with GitHub Flavored Markdown support
4. Syntax highlighting is applied using `highlight.js` with GitHub Dark theme
5. Posts are sorted by date (newest first)

### TypeScript Configuration
- **Path Aliases**: `@/*` maps to `./src/*` in `tsconfig.json`
- **Important**: All utilities must be placed within `src/` directory to work with the path alias
- **Posts Utility**: Located at `src/lib/posts.ts` (not root `lib/`)

### GitHub Pages Deployment
- Builds static files to `out/` directory
- GitHub Actions workflow deploys on push to `main`
- Requires GitHub Pages to be configured for "GitHub Actions" source
- **Live URL**: https://hiramekun.github.io/my-blog/

### Common Issues
- **Build Error**: `Cannot resolve '@/lib/posts'` means utilities are not in `src/` directory
- **Node.js Compatibility**: If build fails, try reinstalling dependencies with `rm -rf node_modules package-lock.json && npm install`
- **Markdown Rendering Issues**: 
  - Uses `marked.js` (not `remark`) for reliable HTML generation
  - Syntax highlighting handled by `highlight.js` with manual post-processing
  - Custom CSS in `globals.css` overrides Tailwind prose classes for better control
- **Text Contrast**: Custom CSS ensures high-contrast text (#1f2937) while preserving code block colors
- **GitHub Pages Routing**: `basePath: "/my-blog"` in `next.config.ts` is required for proper routing