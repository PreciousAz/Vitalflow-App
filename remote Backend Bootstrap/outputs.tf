output "backend_bucket_name" {
  description = "The S3 bucket name created for Terraform remote state"
  value       = aws_s3_bucket.terraform_state.bucket
}

output "backend_lock_table_name" {
  description = "The DynamoDB table name created for Terraform state locking"
  value       = aws_dynamodb_table.terraform_locks.name
}