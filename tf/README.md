# Auth0 Custom Database Terraform Configuration

This directory contains Terraform configuration files for setting up an Auth0 custom database connection that uses the Cloudflare Worker D1 implementation.

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html) (v1.0.0 or later)
- Auth0 account with a tenant
- Auth0 Machine-to-Machine application with the Management API and the following permissions:
  - `read:connections`
  - `create:connections`
  - `update:connections`
  - `delete:connections`
  - `read:clients`

## Configuration

1. Update the `terraform.auto.tfvars` file with your Auth0 domain, client ID, client secret, Cloudflare Worker API base URL, and API token:

```hcl
auth0_domain         = "your-tenant.auth0.com"
auth0_tf_client_id   = "your-client-id"
auth0_tf_client_secret = "your-client-secret"
api_base_url         = "https://auth0-customdb.your-subdomain.workers.dev"
api_token            = "your-api-token"
```

## Usage

1. Initialize Terraform:

```bash
terraform init
```

2. Preview the changes:

```bash
terraform plan
```

3. Apply the changes:

```bash
terraform apply
```

4. To destroy the resources:

```bash
terraform destroy
```

## Resources Created

- Auth0 custom database connection that uses the scripts in the `custom-db` directory
- The connection is configured with the API token and base URL for the Cloudflare Worker

## Outputs

- `custom_db_connection_id`: The ID of the created Auth0 custom database connection
- `custom_db_connection_name`: The name of the created Auth0 custom database connection