variable "aws_region" {
  description = "AWS region for the frontend infrastructure"
  type        = string
}

variable "project_name" {
  description = "Project name used for naming resources"
  type        = string
  default     = "vitalflow"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "bucket_name_prefix" {
  description = "Prefix for the S3 bucket name"
  type        = string
}