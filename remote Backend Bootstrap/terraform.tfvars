aws_region              = "us-east-1"
remote_bucket_name     = "vitalflow-remote-bucket"
remote_lock_table_name = "vitalflow-Remote-table"

tags = {
  Environment = "prod"
  ManagedBy   = "Terraform"
}