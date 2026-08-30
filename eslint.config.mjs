import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 各ワークスペースが `eslint .` で走るので、ビルド生成物と Next の自動生成
  // ファイルを明示的に外す。(next lint が暗黙にやってくれていた分)
  {
    ignores: [
      "**/.next/**",
      "**/out/**",
      "**/node_modules/**",
      "**/next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
