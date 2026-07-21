import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { normalizeDate, toYearMonthKey, formatYearMonth } from './date';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostData {
  id: string;
  date: string;
  title: string;
  excerpt?: string;
  tags?: string[];
  content: string;
}

const MARKDOWN_EXTENSIONS = ['.md', '.mdx'];

function isMarkdownFile(fileName: string): boolean {
  return MARKDOWN_EXTENSIONS.some((ext) => fileName.endsWith(ext));
}

function toPostId(fileName: string): string {
  return fileName.replace(/\.mdx?$/, '');
}

// posts配下のMarkdownファイル名一覧を取得する
function getPostFileNames(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs.readdirSync(postsDirectory).filter(isMarkdownFile);
}

// idに対応するMarkdownファイルを読み込む（.md優先、なければ.mdx）
function readPostFile(id: string): string {
  for (const ext of MARKDOWN_EXTENSIONS) {
    const fullPath = path.join(postsDirectory, `${id}${ext}`);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, 'utf8');
    }
  }
  throw new Error(`Post not found: ${id}`);
}

// gray-matterのパース結果からPostDataを組み立てる
function buildPostData(id: string, fileContents: string, content?: string): PostData {
  const matterResult = matter(fileContents);
  const data = matterResult.data;
  data.date = normalizeDate(data.date);

  return {
    id,
    content: content ?? matterResult.content,
    ...data,
  } as PostData;
}

export function getSortedPostsData(): PostData[] {
  const allPostsData = getPostFileNames().map((fileName) => {
    const id = toPostId(fileName);
    const fileContents = fs.readFileSync(path.join(postsDirectory, fileName), 'utf8');
    return buildPostData(id, fileContents);
  });

  return allPostsData.sort((a, b) => b.date.localeCompare(a.date));
}

export function getAllPostIds() {
  return getPostFileNames().map((fileName) => ({
    params: {
      id: toPostId(fileName),
    },
  }));
}

// Markdownコンテンツ内の **「...」** 強調パターンを<strong>に変換する前処理
function preprocessContent(content: string): string {
  return content
    // 1. **「から始まり」**で終わるパターン
    .replace(/\*\*「([^*]+?)」\*\*/g, '<strong>「$1」</strong>')
    // 2. **「から始まり**で終わるパターン（」がない）
    .replace(/\*\*「([^*]+?)\*\*/g, '<strong>「$1</strong>')
    // 3. **から始まり」**で終わるパターン（「がない）
    .replace(/\*\*([^*]+?)」\*\*/g, '<strong>$1」</strong>');
}

export function getPostData(id: string): PostData {
  const fileContents = readPostFile(id);
  const matterResult = matter(fileContents);
  const processedContent = preprocessContent(matterResult.content);
  return buildPostData(id, fileContents, processedContent);
}

// カテゴリ関連の関数
export function getAllCategories() {
  const categories = new Set<string>();
  getSortedPostsData().forEach((post) => {
    post.tags?.forEach((tag) => categories.add(tag));
  });
  return Array.from(categories).sort();
}

export function getPostsByCategory(category: string) {
  return getSortedPostsData().filter((post) => post.tags?.includes(category));
}

// アーカイブ関連の関数
export function getAllArchives() {
  const archives = new Set<string>();
  getSortedPostsData().forEach((post) => {
    archives.add(toYearMonthKey(post.date));
  });
  return Array.from(archives).sort().reverse(); // 新しい順
}

export function getPostsByArchive(year: string, month: string) {
  const targetYearMonth = `${year}-${month.padStart(2, '0')}`;
  return getSortedPostsData().filter(
    (post) => toYearMonthKey(post.date) === targetYearMonth
  );
}

export function getArchiveDisplayName(year: string, month: string) {
  return formatYearMonth(year, month);
}
