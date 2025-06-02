variable "auth0_domain" {
  description = "Auth0 domain"
  type        = string
}

variable "auth0_tf_client_id" {
  description = "Auth0 Terraform client ID"
  type        = string
}

variable "auth0_tf_client_secret" {
  description = "Auth0 Terraform client secret"
  type        = string
  sensitive   = true
}

variable "api_base_url" {
  description = "Base URL for the Cloudflare Worker API"
  type        = string
}

variable "api_token" {
  description = "API token for authenticating with the Cloudflare Worker"
  type        = string
  sensitive   = true
}