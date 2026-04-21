variable "aws_region" {
  description = "AWS region for the backend resources"
  type        = string
  default     = "us-east-1"
}

variable "remote_bucket_name" {
  description = "Globally unique S3 bucket name for Terraform state"
  type        = string
}

variable "remote_lock_table_name" {
  description = "DynamoDB table name for Terraform state locking"
  type        = string
}

variable "tags" {
  description = "Tags applied to backend resources"
  type        = map(string)
  default     = {
    Environment = "prod"
    ManagedBy   = "Terraform"
  }
}