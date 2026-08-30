output "site_urls" {
  description = "公開 URL"
  value       = { for key, site in local.sites : key => "https://${site.hostname}" }
}

output "pages_subdomains" {
  description = "Pages が振る <project>.pages.dev。CNAME の向き先であり、_middleware が 301 で弾く対象でもある"
  value       = { for key, project in cloudflare_pages_project.site : key => project.subdomain }
}
