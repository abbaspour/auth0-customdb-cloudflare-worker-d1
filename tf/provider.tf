terraform {
  required_providers {
    auth0 = {
      source  = "auth0/auth0"
      version = "~> 1.20.1"
    }
  }
  required_version = ">= 1.0.0"
}

provider "auth0" {
  domain        = var.auth0_domain
  client_id     = var.auth0_tf_client_id
  client_secret = var.auth0_tf_client_secret
}