terraform {
  required_providers {
    auth0 = {
      source  = "auth0/auth0"
      version = "~> 1.20.1"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "5.5.0"
    }
  }
  required_version = ">= 1.0.0"
}

provider "auth0" {
  domain        = var.auth0_domain
  client_id     = var.auth0_tf_client_id
  client_secret = var.auth0_tf_client_secret
}

# Configure the Cloudflare provider
provider "cloudflare" {
  api_token = var.cloudflare_api_token
  email = var.cloudflare_email
}