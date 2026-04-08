variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "bucket_name_prefix" {
  description = "Prefix for the S3 bucket name"
  type        = string
  default     = "vitalflow-bucket"
}

variable "cloudfront_origin_id" {
  description = "Origin ID for CloudFront"
  type        = string
  default     = "S3-vitalflow-bucket"
}