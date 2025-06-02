resource "auth0_connection" "custom_db" {
  name     = "cf-import-off-d1"
  strategy = "auth0"

  options {
    custom_scripts = {
      login = file("${path.module}/../custom-db/login.js")
      get_user = file("${path.module}/../custom-db/getUser.js")
      create = file("${path.module}/../custom-db/create.js")
    }

    configuration = {
      API_TOKEN    = var.api_token
      API_BASE_URL = var.api_base_url
    }

    authentication_methods {
      passkey {
        enabled = true
      }
      password {
        enabled = true
      }
    }

    requires_username              = false
    disable_signup                 = false
    import_mode                    = false
    enabled_database_customization = true
    enable_script_context          = true
    brute_force_protection         = false
  }

  realms = ["cf-import-off-d1"]

}

resource "auth0_connection_clients" "custom_db_connections" {
  connection_id = auth0_connection.custom_db.id
  enabled_clients = [
    "At5IQTvLVMhalbVc0WZ07iKUyJtpXmkJ"  # your test client
  ]
}

output "custom_db_connection_id" {
  value       = auth0_connection.custom_db.id
  description = "The ID of the created Auth0 custom database connection"
}

output "custom_db_connection_name" {
  value       = auth0_connection.custom_db.name
  description = "The name of the created Auth0 custom database connection"
}