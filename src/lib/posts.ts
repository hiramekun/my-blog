import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostData {
  id: string;
  date: string;
  title: string;
  excerpt?: string;
  tags?: string[];
  content: string;
}

export function getSortedPostsData(): PostData[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      const id = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        id,
        content: matterResult.content,
        ...matterResult.data,
      } as PostData;
    });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      return {
        params: {
          id: fileName.replace(/\.mdx?$/, ''),
        },
      };
    });
}

export function getPostData(id: string): PostData {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  let fileContents: string;
  
  try {
    fileContents = fs.readFileSync(fullPath, 'utf8');
  } catch {
    const mdxPath = path.join(postsDirectory, `${id}.mdx`);
    fileContents = fs.readFileSync(mdxPath, 'utf8');
  }

  const matterResult = matter(fileContents);

  // **「」**パターンを適切に処理するための前処理
  let processedContent = matterResult.content;
  // 1. **「から始まり」**で終わるパターン
  processedContent = processedContent.replace(/\*\*「([^*]+?)」\*\*/g, '<strong>「$1」</strong>');
  // 2. **「から始まり**で終わるパターン（」がない）
  processedContent = processedContent.replace(/\*\*「([^*]+?)\*\*/g, '<strong>「$1</strong>');
  // 3. **から始まり」**で終わるパターン（「がない）
  processedContent = processedContent.replace(/\*\*([^*]+?)」\*\*/g, '<strong>$1」</strong>');

  return {
    id,
    content: processedContent,
    ...matterResult.data,
  } as PostData;
}

// カテゴリ関連の関数
export function getAllCategories() {
  const categories = new Set<string>();
  const allPosts = getSortedPostsData();
  allPosts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => categories.add(tag));
    }
  });
  return Array.from(categories).sort();
}

export function getPostsByCategory(category: string) {
  return getSortedPostsData().filter(post => 
    post.tags && post.tags.includes(category)
  );
}

// アーカイブ関連の関数
export function getAllArchives() {
  const archives = new Set<string>();
  const allPosts = getSortedPostsData();
  allPosts.forEach(post => {
    const date = new Date(post.date);
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    archives.add(yearMonth);
  });
  return Array.from(archives).sort().reverse(); // 新しい順
}

export function getPostsByArchive(year: string, month: string) {
  const targetYearMonth = `${year}-${month.padStart(2, '0')}`;
  return getSortedPostsData().filter(post => {
    const date = new Date(post.date);
    const postYearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    return postYearMonth === targetYearMonth;
  });
}

export function getArchiveDisplayName(year: string, month: string) {
  return `${year}年${parseInt(month)}月`;
}