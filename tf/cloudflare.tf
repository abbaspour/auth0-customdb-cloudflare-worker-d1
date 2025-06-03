# Define the path to your worker source code
/*
locals {
  worker_name = "auth0-customdb"
  worker_src_dir  = "${path.module}/../worker"
  worker_build_dir = "${local.worker_src_dir}/dist"
  worker_output_file = "${local.worker_build_dir}/worker.js"
}

# Null resource to trigger the local bundling script
resource "null_resource" "bundle_worker" {
  triggers = {
    source_code_hash = join("", [for f in fileset(local.worker_src_dir, "src/*.ts") : filesha1("${local.worker_src_dir}/${f}")])
    package_json_hash = filesha1("${local.worker_src_dir}/package.json")
  }

  provisioner "local-exec" {
    command = "cd ${local.worker_src_dir} && npm install && npm run build"
    working_dir = local.worker_src_dir # Ensure the command runs from the worker directory
  }

  # This ensures that if the output directory or file doesn't exist,
  # the bundling step will fail and prevent the worker deployment.
  depends_on = [
    null_resource.bundle_worker
  ]
}

# terraform import cloudflare_d1_database.db '${cf_account_id}/db_uuid'

resource "cloudflare_d1_database" "db" {
  account_id  = var.cloudflare_account_id
  name = "auth0_users"
  read_replication = {
    mode = "disabled"
  }
}

# Cloudflare Worker script resource
resource "cloudflare_workers_script" "worker_script" {
  account_id  = var.cloudflare_account_id
  script_name = local.worker_name
  content     = file(local.worker_output_file)

  #main_module = basename(local.worker_output_file) #"worker.js"
  main_module = "worker.js"
  compatibility_date = "2025-06-01"

  # Ensure the worker is only deployed after it's bundled
  depends_on = [
    null_resource.bundle_worker
  ]

  bindings = [
    {
      type = "secret_text"
      name = "API_TOKEN"
      text = var.api_token
    },
    {
      type = "d1"
      name = "DB"
      id = cloudflare_d1_database.db.id
    }
  ]

  observability = {
    enabled            = true
    head_sampling_rate = 1
  }
}
*/