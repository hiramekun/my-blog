# Cloudflare へのセットアップ手順

`hiramekun.dev`（プロフィール）と `blog.hiramekun.dev`（ブログ）を
Cloudflare Pages に載せるまでの手順。ダッシュボードでの操作が必要なところと、
コマンドで済むところを分けてある。

`notes.hiramekun.dev`（[tech-notes](https://github.com/hiramekun/tech-notes)）で
アカウント・ゾーン・Zero Trust はすでに作ってあるので、ここでやるのは
**API トークンと state 置き場を用意して `terraform apply` する**だけ。

## 構成

| ホスト | Pages プロジェクト | ビルド対象 | リポジトリ |
|---|---|---|---|
| `hiramekun.dev` | `hiramekun-dev` | `apps/profile` | このリポジトリ |
| `blog.hiramekun.dev` | `hiramekun-blog` | `apps/blog` | このリポジトリ |
| `notes.hiramekun.dev` | `tech-notes` | — | [tech-notes](https://github.com/hiramekun/tech-notes) |

1 つのリポジトリから 2 つの Pages プロジェクトを作る。どちらもリポジトリ直下を
ビルドのルートにして、`npm run build -w <workspace>` で片方だけを作り、
`apps/<name>/out` を公開する。npm workspaces なので `package-lock.json` は
リポジトリ直下にしかなく、`apps/<name>` を Pages の root directory にすると
依存が解決できない。**root directory は変更しないこと。**

## 1. Terraform 用の API トークン（ダッシュボード）

トークンには 2 つのポリシーが要る。新しい権限ピッカーでは、ポリシーごとに
対象リソース（アカウント全体 / 指定ドメイン）を選ぶと、選べる権限の一覧が入れ替わる。

| ポリシー | 対象 | 権限 |
|---|---|---|
| 1 | アカウント全体 | Cloudflare Pages : Edit |
| 2 | 指定ドメイン（hiramekun.dev） | DNS : Edit |

2 つ目は DNS レコードを Terraform で管理するために要る。DNS の権限は Zone スコープなので、
「アカウント全体」のポリシーの一覧には出てこない。既存のポリシーの対象を変えるのではなく、
**ポリシーを追加**すること（対象を変えると 1 つ目の権限が外れる）。

tech-notes 用のトークンは D1 と Access も持っているが、こちらは Pages と DNS だけでよい。
使い回さず、このリポジトリ専用に発行する。

## 2. Terraform の state 置き場（R2）

1. R2 でバケット `my-blog-tfstate` を作る。
2. R2 のアクセスキー（S3 互換）を発行する。
3. `infra/backend.hcl.example` を `backend.hcl` にコピーし、endpoint のアカウント ID を埋める。

```bash
cp infra/backend.hcl.example infra/backend.hcl
```

## 3. GitHub 側（ダッシュボード）

Cloudflare の GitHub App を `hiramekun/my-blog` にインストールする（Pages の Git 連携）。
tech-notes で入れてあるアプリの許可リポジトリに追加すればよい。

## 認証情報の渡し方（mise）

Terraform には 2 系統の認証情報が要る。state 置き場（R2 = S3 互換）とリソース作成
（Cloudflare API）でクライアントが別だからで、前者は AWS SDK の作法に従うため変数名が `AWS_*` になる。

| | 何をする | 環境変数 |
|---|---|---|
| backend | R2 に state を読み書き | `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` |
| provider | Pages / DNS を作る | `CLOUDFLARE_API_TOKEN` |

毎回 `export` しなくて済むように、プロジェクト直下の `mise.local.toml` に置く。
このファイルは gitignore 済みで、コミットされない。

```toml
[env]
AWS_ACCESS_KEY_ID = "..."
AWS_SECRET_ACCESS_KEY = "..."
CLOUDFLARE_API_TOKEN = "..."
CLOUDFLARE_ACCOUNT_ID = "..."
```

値を埋めたら一度だけ `mise trust` を実行する（mise は未信頼の設定ファイルを読まない）。

## 4. インフラを作る（手元で 1 回）

```bash
cp infra/terraform.tfvars.example infra/terraform.tfvars   # account_id / zone_id を埋める
terraform -chdir=infra init -backend-config=backend.hcl
terraform -chdir=infra plan
terraform -chdir=infra apply
```

ホスト名・プロジェクト名・GitHub のリポジトリは `infra/variables.tf` の default で足りるので、
`terraform.tfvars` に書くのは `account_id` と `zone_id` の 2 つだけでよい。

`apply` の時点ではまだサイトは存在しない。Pages は `main` からビルドするので、
最初のデプロイが走るのはこのブランチを `main` にマージした後になる。

## 5. GitHub Pages を止める（ダッシュボード）

移行後は `hiramekun.github.io/my-blog/` を使わない。リポジトリの
Settings → Pages → Build and deployment → Source を **None** にする。
デプロイ用のワークフロー（`.github/workflows/deploy.yml`）はこの変更で削除済み。

## 6. 動作確認

```bash
# 2 サイトが 200 を返すか
curl -sS -o /dev/null -w '%{http_code}\n' https://hiramekun.dev/
curl -sS -o /dev/null -w '%{http_code}\n' https://blog.hiramekun.dev/

# pages.dev が正規ホストへ 301 で飛ぶか
curl -sS -o /dev/null -w '%{http_code} -> %{redirect_url}\n' https://hiramekun-blog.pages.dev/
```

`.github/workflows/smoke-test.yml` が同じ確認を毎日 07:00 JST に回す。
手で回したいときは Actions から `Smoke Test` を workflow_dispatch する。

## 踏みやすい落とし穴

Cloudflare provider v5 は OpenAPI から自動生成されており、「省略した属性を更新時に
null で送ってしまう」系の不具合をいくつか持つ。作成は通るのに更新で 400 になるのが典型で、
回避策は**その属性を明示的に書く**こと。

| 症状 | 原因 | 対処 |
|---|---|---|
| `fail_open` を production と preview で揃えろ | production しか定義していなかった | 設定を `locals` に切り出して両方へ渡す（対処済み） |
| カスタムドメインが `pending` のまま（`CNAME record not set`）、サイトは 522 | proxied な CNAME が先に無いと Pages の検証が走らない | `cloudflare_dns_record` を先に作る（`depends_on` 済み） |
| 環境変数を変えたのに反映されない | Pages の環境変数はデプロイ時に確定するため、`terraform apply` だけでは反映されない | 再デプロイする |
| ビルドが `npm ci` で落ちる | Pages の root directory を `apps/<name>` にすると `package-lock.json` が無い | root directory はリポジトリ直下のままにする |
| apex に CNAME を置けない気がする | Cloudflare は CNAME フラット化を行うので proxied なら置ける | そのまま `cloudflare_dns_record` で作る |

プロジェクト設定と実際に動いているデプロイを**別々に**見ると切り分けが早い。

```bash
# プロジェクト設定
curl -s -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/hiramekun-blog"
# 稼働中のデプロイが持つ値
curl -s -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/hiramekun-blog/deployments?per_page=3"
```
