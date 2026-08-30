terraform {
  required_version = "~> 1.9"

  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
      # v5 は OpenAPI から自動生成された全面書き換えで、v4 とは互換性がない。
      # 世に出回っているサンプルの多くは v4 なので必ず固定する。
      version = "~> 5.13"
    }
  }

  # state は R2(S3 互換)に置く。terraform init -backend-config=backend.hcl で
  # bucket と endpoint を渡す。
  backend "s3" {
    key    = "prod/terraform.tfstate"
    region = "auto"

    # R2 は S3 の一部の検証に応答しないので、まとめて無効化する
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    skip_s3_checksum            = true
    use_path_style              = true
  }
}

# 認証は環境変数 CLOUDFLARE_API_TOKEN で渡す。tf ファイルには書かない
provider "cloudflare" {}

locals {
  # 1 つのリポジトリから 2 つのサイトを配信する。
  # 違うのはプロジェクト名・ホスト名・ビルド対象の workspace だけなので、
  # 差分をここにまとめて for_each で回す。
  sites = {
    profile = {
      project_name = var.profile_project_name
      hostname     = var.profile_hostname
      workspace    = "@hiramekun/profile"
      output_dir   = "apps/profile/out"
    }
    blog = {
      project_name = var.blog_project_name
      hostname     = var.blog_hostname
      workspace    = "@hiramekun/blog"
      output_dir   = "apps/blog/out"
    }
  }

  # Pages の API は production と preview で fail_open を揃えることを要求する
  # ("You must set the `fail_open` property value equally...")。
  # 片方だけ書くと 400 になるので、同じ設定を両方に渡す。
  deployment_configs = {
    for key, site in local.sites : key => {
      compatibility_date = var.compatibility_date

      # Function が落ちたときに静的アセットへフォールスルーさせない
      fail_open = false

      env_vars = {
        # functions/_middleware.ts がこの 2 つを見て、本番の pages.dev だけを
        # 正規ホストへ 301 で送り返す(プレビューは素通し)
        CANONICAL_HOST = {
          type  = "plain_text"
          value = site.hostname
        }
        PAGES_HOST = {
          type  = "plain_text"
          value = "${site.project_name}.pages.dev"
        }
      }
    }
  }
}

# --- サイト ------------------------------------------------------------------
resource "cloudflare_pages_project" "site" {
  for_each = local.sites

  account_id        = var.account_id
  name              = each.value.project_name
  production_branch = var.production_branch

  # npm workspaces なので root_dir は指定せず、リポジトリ直下でビルドする。
  # (apps/<name> を root_dir にすると package-lock.json が無く、
  #  ワークスペース依存の @hiramekun/theme も解決できない)
  build_config = {
    build_command   = "npm run build -w ${each.value.workspace}"
    destination_dir = each.value.output_dir
  }

  deployment_configs = {
    production = local.deployment_configs[each.key]
    preview    = local.deployment_configs[each.key]
  }

  source = {
    type = "github"
    config = {
      owner                          = var.github_owner
      owner_id                       = var.github_owner_id
      repo_name                      = var.github_repo
      repo_id                        = var.github_repo_id
      production_branch              = var.production_branch
      production_deployments_enabled = true

      # プレビューは残す。_middleware が弾くのは本番の pages.dev だけなので、
      # <hash>.<project>.pages.dev はそのまま開ける
      preview_deployment_setting = "all"
    }
  }
}

# カスタムドメインの DNS レコード。
#
# Pages のカスタムドメインは、API から登録しただけでは
# "CNAME record not set" のまま検証が通らない。proxied な CNAME が
# 先に存在してはじめて Cloudflare 側の検証が走り、active になる
# (ダッシュボードのフローはこの 2 つを一体で行っている)。
#
# hiramekun.dev は apex だが、Cloudflare は CNAME フラット化を行うので
# proxied な CNAME をそのまま置ける。
resource "cloudflare_dns_record" "site" {
  for_each = local.sites

  zone_id = var.zone_id
  name    = each.value.hostname
  type    = "CNAME"
  content = cloudflare_pages_project.site[each.key].subdomain
  proxied = true
  ttl     = 1 # proxied のときは自動(1)
  comment = "Cloudflare Pages: ${each.value.project_name}"
}

# Pages プロジェクトにカスタムドメインを繋ぐ。
resource "cloudflare_pages_domain" "site" {
  for_each = local.sites

  account_id   = var.account_id
  project_name = cloudflare_pages_project.site[each.key].name
  name         = each.value.hostname

  # レコードが先にないと検証が通らない
  depends_on = [cloudflare_dns_record.site]
}
