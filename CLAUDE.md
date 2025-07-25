# CLAUDE.md

This file provides Claude Code project configuration and guidance.

## Commands

### Development
- `npm run dev` - Start development server
- `npm run build` - Generate static site (outputs to `out/`)
- `npm run lint` - Run ESLint checks

### Deployment
Auto-deploy via GitHub Actions (`.github/workflows/deploy.yml`). Triggers on push to `main` branch.

### Quality Assurance
- `E2E Tests` - Automated post-deployment testing (HTTP status, content validation)

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
- **Markdown Rendering**: `react-markdown` + `rehype-highlight` (XSS-safe)
- **Image Optimization**: Next.js Image component for performance
- **Responsive**: 2-column (desktop) ↔ 1-column (mobile)

### Article Processing
1. Parse Markdown files from `posts/` with `gray-matter`
2. Safe rendering with `react-markdown` (XSS protection)
3. GitHub Flavored Markdown + syntax highlighting with `rehype-highlight`
4. Sort by date (newest first)

### Metadata Management (`src/lib/metadata.ts`)
- **Centralized OpenGraph**: Unified social media metadata
- **Type-safe**: TypeScript interfaces for all metadata
- **DRY Principle**: Single source of truth for site metadata
- **SEO Optimized**: Consistent meta tags across all pages

## TypeScript Config
- **Path Aliases**: `@/*` → `./src/*`
- **Important**: Place utilities in `src/` directory (`src/lib/posts.ts`)

## GitHub Pages
- **Live URL**: https://hiramekun.github.io/my-blog/
- **Deploy**: GitHub Actions deploys `out/` directory
- **Setup**: Configure Pages settings to "GitHub Actions"

## Security & Performance

### Security Enhancements
- **XSS Protection**: `dangerouslySetInnerHTML` eliminated
- **Safe Markdown**: `react-markdown` with sanitization
- **Dependency Security**: 96+ unnecessary packages removed
- **npm audit**: 0 vulnerabilities maintained

### Performance Optimizations
- **Image Loading**: Next.js Image component (LCP/CLS improvements)
- **Bundle Size**: Significant dependency reduction
- **Type Safety**: Strict TypeScript configuration
- **Code Quality**: ESLint with security rules

### E2E Testing (`.github/workflows/deploy.yml`)
- **Post-deployment Testing**: Automatic quality checks
- **HTTP Status**: Verify 200 responses
- **Content Validation**: Check page titles and content
- **Failure Alerts**: Detailed error reporting

## Common Issues
- **Build Errors**: Check if files are in `src/` directory
- **Articles Not Showing**: Verify frontmatter date format (`YYYY-MM-DD`)
- **Image Paths**: Place static files in `public/`, requires `/my-blog/` prefix
- **E2E Test Failures**: Check deployment status and manual site verification