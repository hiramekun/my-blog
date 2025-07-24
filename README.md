# ひらめのブログ

日々の思考や学びを記録するブログです。技術、教育、社会問題など幅広いテーマを扱っています。

🌐 **Live Site**: https://hiramekun.github.io/my-blog/

## 技術構成

- **Next.js 15** - 静的サイト生成（App Router + TypeScript）
- **Tailwind CSS** - GitHubダークテーマベースのデザイン
- **Markdown/MDX** - 記事執筆（脚注記法対応）
- **GitHub Pages** - 自動デプロイ

## 機能

- **投稿管理**: Markdownファイルベースの記事作成
- **アーカイブ**: 月別記事一覧（`/archive/2025/06/`）
- **OGPサポート**: Twitter/SNS共有対応
- **レスポンシブ**: モバイル・デスクトップ対応
- **シンタックスハイライト**: コードブロック表示
- **脚注**: `[^1]` 記法サポート

## 開発

```bash
# セットアップ
npm install
npm run dev  # localhost:3000

# デプロイ
git push origin main  # 自動デプロイ
```

## 記事作成

`posts/article-name.md` を作成：

```markdown
---
title: "記事タイトル"
date: "2025-07-24"
excerpt: "記事の概要"
tags: ["タグ1", "タグ2"]
---

記事内容をMarkdownで記述...
```

## プロジェクト構造

```
├── posts/                 # 記事（Markdown）
├── src/
│   ├── app/
│   │   ├── posts/[id]/    # 記事ページ
│   │   └── archive/       # アーカイブページ
│   ├── components/        # React コンポーネント  
│   └── lib/posts.ts      # 記事処理ロジック
└── .github/workflows/    # 自動デプロイ設定
```

## カスタマイズ

- **テーマ色**: `src/app/globals.css` の CSS変数
- **サイト情報**: `src/components/Header.tsx`, `Sidebar.tsx`
- **メタデータ**: `src/app/layout.tsx`