---
name: verify-site
description: リファクタリングやUI変更のあとに、ローカルでdevサーバーを起動してサイトの表示が崩れていないかを確認する。ページのレイアウト・スタイル・Markdownレンダリング・コンソールエラーをブラウザで目視チェックしたいときに使う。
---

# verify-site

このブログ（Next.js 静的サイト）のUIに変更を加えたあと、ローカルで表示が崩れていないかを
ブラウザで確認するための手順。ビルドやlintが通っていても、レイアウト崩れやスタイルの欠落は
検出できないため、代表的なページを実際に描画して目視する。

## 前提：basePath の罠

`next.config` で `basePath: "/my-blog"` が設定されているため、devサーバーでも
サイトは `/my-blog` 配下で配信される。

- ❌ `http://localhost:3000/` → **404 になる**
- ✅ `http://localhost:3000/my-blog` → ホームページ

URLには必ず `/my-blog` を付けること。

## 手順

1. **devサーバーを起動**
   - `preview_start` を name `dev` で呼ぶ（`.claude/launch.json` に定義済み、`npm run dev` / port 3000）。
   - すでに起動済みなら再利用される。

2. **代表的な4種類のページを開いて screenshot で目視確認**
   変更内容に関わらず、最低この4種類は確認する（共通コンポーネントの変更は全ページに波及するため）。

   | ページ種別 | URL 例 |
   | --- | --- |
   | ホーム（記事一覧） | `http://localhost:3000/my-blog` |
   | 記事詳細 | `http://localhost:3000/my-blog/posts/llm-thoughts` |
   | アーカイブ | `http://localhost:3000/my-blog/archive/2025/08` |
   | カテゴリ | `http://localhost:3000/my-blog/category/AI` |

   各ページで確認するポイント：
   - ヘッダー・サイドバー（プロフィール／アーカイブ／最近の記事）が表示されているか
   - 記事カードのレイアウト・タグ・日付・抜粋が崩れていないか
   - 記事詳細では Markdown（見出し・コードブロック・`**「...」**` の太字強調）が正しく描画されているか
   - アーカイブ／カテゴリの並び順が期待どおりか

3. **コンソールエラーを確認**
   - 各ページで `read_console_messages`（`onlyErrors: true`）を呼び、エラーが無いことを確認する。

4. 崩れやエラーがあれば原因を特定して修正し、1〜3を再確認する。

## 補足

- 実際に存在する記事ID・カテゴリ名は `posts/` 配下のファイルと frontmatter の `tags` に依存する。
  URL例が 404 になる場合は、`getAllPostIds` / `getAllCategories` 相当の実データに合わせて差し替える。
- 確認が終わったら `preview_stop` でサーバーを停止してよい（起動したままでも支障はない）。
