# Hirame's Blog

A blog recording daily thoughts and learnings, covering a wide range of topics including technology, education, and social issues.

🌐 **Live Site**: https://hiramekun.github.io/my-blog/

## Tech Stack

- **Next.js 15** - Static site generation (App Router + TypeScript)
- **React Markdown** - Safe markdown rendering with security enhancements
- **Tailwind CSS** - GitHub dark theme based design
- **Next.js Image** - Optimized image loading for performance
- **GitHub Pages** - Automated deployment with E2E testing

## Features

### Content Management
- **Post Management**: Markdown file-based article creation
- **Archive System**: Monthly post listings (`/archive/2025/06/`)
- **Category Support**: Organized content by topics
- **Safe Rendering**: XSS-protected markdown processing with react-markdown

### SEO & Performance
- **Optimized Images**: Next.js Image component with LCP/CLS improvements
- **Unified Metadata**: Centralized OpenGraph and Twitter card management
- **Responsive Design**: Mobile-first responsive layout
- **Performance**: 96+ dependency cleanup, optimized build pipeline

### Development & Quality
- **Type Safety**: Full TypeScript implementation with strict mode
- **E2E Testing**: Automated testing on every deployment
- **Code Quality**: ESLint + security auditing (0 vulnerabilities)
- **Syntax Highlighting**: Enhanced code block display with rehype-highlight

## Development

```bash
# Setup
npm install
npm run dev  # localhost:3000

# Deploy
git push origin main  # Automated deployment with E2E testing
```

## Creating Articles

Create `posts/article-name.md`:

```markdown
---
title: "Article Title"
date: "2025-07-24"
excerpt: "Article summary"
tags: ["tag1", "tag2"]
---

Write article content in Markdown...
```

## Project Structure

```
├── posts/                 # Articles (Markdown)
├── src/
│   ├── app/
│   │   ├── posts/[id]/    # Article pages
│   │   ├── archive/       # Archive pages  
│   │   └── category/      # Category pages
│   ├── components/        # React components (Image optimized)
│   └── lib/
│       ├── posts.ts       # Article processing logic
│       └── metadata.ts    # Centralized metadata management
└── .github/workflows/     # CI/CD with E2E testing
```

## Quality Assurance

### Security
- **XSS Protection**: Safe markdown rendering without `dangerouslySetInnerHTML`
- **Dependency Security**: 0 npm audit vulnerabilities
- **Type Safety**: Strict TypeScript configuration

### Performance
- **Image Optimization**: Next.js Image component for LCP/CLS improvements
- **Bundle Size**: 96+ unnecessary dependencies removed
- **Build Performance**: Optimized dependencies and configuration

### Testing & Monitoring
- **E2E Testing**: Automated post-deployment testing
  - HTTP status verification
  - Content validation
  - Page accessibility checks
- **Continuous Quality**: GitHub Actions integration

## Customization

- **Theme Colors**: CSS variables in `src/app/globals.css`
- **Site Info**: `src/components/Header.tsx`, `Sidebar.tsx`
- **Metadata**: Centralized in `src/lib/metadata.ts`
- **Testing**: E2E test configuration in `.github/workflows/deploy.yml`