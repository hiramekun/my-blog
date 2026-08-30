variable "account_id" {
  type        = string
  description = "Cloudflare のアカウント ID"
}

variable "zone_id" {
  type        = string
  description = "hiramekun.dev の Cloudflare ゾーン ID"
}

# --- ホスト名 ----------------------------------------------------------------
# notes.hiramekun.dev (tech-notes) と同じ命名規則に揃えている。
variable "profile_hostname" {
  type        = string
  description = "プロフィール(リンク集)を公開する apex ホスト名"
  default     = "hiramekun.dev"
}

variable "blog_hostname" {
  type        = string
  description = "ブログを公開するホスト名"
  default     = "blog.hiramekun.dev"
}

# --- Pages プロジェクト名 -----------------------------------------------------
# <project_name>.pages.dev は Cloudflare 全体で一意なので、名前は重複しにくいものにする。
variable "profile_project_name" {
  type        = string
  description = "プロフィールサイトの Pages プロジェクト名"
  default     = "hiramekun-dev"
}

variable "blog_project_name" {
  type        = string
  description = "ブログの Pages プロジェクト名"
  default     = "hiramekun-blog"
}

# --- GitHub ------------------------------------------------------------------
variable "github_owner" {
  type        = string
  description = "Pages が参照する GitHub のオーナー名"
  default     = "hiramekun"
}

variable "github_repo" {
  type        = string
  description = "Pages が参照するリポジトリ名"
  default     = "my-blog"
}

# 数値 ID は秘密ではない。gh api repos/<owner>/<repo> --jq '.id, .owner.id' で取れる。
# owner / repo_name だけでは Pages がリポジトリを解決できないことがあるため明示しておく。
variable "github_owner_id" {
  type        = string
  description = "GitHub のオーナー ID"
  default     = "20180425"
}

variable "github_repo_id" {
  type        = string
  description = "GitHub のリポジトリ ID"
  default     = "1025664014"
}

variable "production_branch" {
  type        = string
  description = "本番デプロイの対象ブランチ"
  default     = "main"
}

variable "compatibility_date" {
  type        = string
  description = "Workers ランタイムの互換性日付"
  default     = "2026-01-01"
}
