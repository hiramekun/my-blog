# Hirame's Blog

A blog recording daily thoughts and learnings, covering a wide range of topics including technology, education, and social issues.

🌐 **Live Site**: https://hiramekun.github.io/my-blog/

## Tech Stack

- **Next.js 15** - Static site generation (App Router + TypeScript)
- **Tailwind CSS** - GitHub dark theme based design
- **Markdown/MDX** - Article writing (footnote syntax support)
- **GitHub Pages** - Automated deployment

## Features

- **Post Management**: Markdown file-based article creation
- **Archive**: Monthly post listings (`/archive/2025/06/`)
- **OGP Support**: Twitter/SNS sharing support
- **Responsive**: Mobile and desktop compatibility
- **Syntax Highlighting**: Code block display
- **Footnotes**: `[^1]` syntax support

## Development

```bash
# Setup
npm install
npm run dev  # localhost:3000

# Deploy
git push origin main  # Automated deployment
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
│   │   └── archive/       # Archive pages
│   ├── components/        # React components
│   └── lib/posts.ts      # Article processing logic
└── .github/workflows/    # Automated deployment config
```

## Customization

- **Theme Colors**: CSS variables in `src/app/globals.css`
- **Site Info**: `src/components/Header.tsx`, `Sidebar.tsx`
- **Metadata**: `src/app/layout.tsx`