resource "auth0_connection" "custom_db" {
  name     = "cf-import-off-d1"
  strategy = "auth0"
  
  options {
    custom_scripts = {
      get_user = file("${path.module}/../custom-db/getUser.js")
      create   = file("${path.module}/../custom-db/create.js")
    }
    
    configuration = {
      API_TOKEN   = var.api_token
      API_BASE_URL = var.api_base_url
    }
    
    requires_username = false
    disable_signup    = false
    import_mode       = false
    enabled_database_customization = true
    enable_script_context = true
  }
  
  realms = ["cf-import-off-d1"]
  
}

output "custom_db_connection_id" {
  value = auth0_connection.custom_db.id
  description = "The ID of the created Auth0 custom database connection"
}

output "custom_db_connection_name" {
  value = auth0_connection.custom_db.name
  description = "The name of the created Auth0 custom database connection"
}