variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "vitalflow"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "github_owner" {
  description = "GitHub username or organization"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
}

variable "github_branch" {
  description = "GitHub branch allowed to assume this role"
  type        = string
  default     = "main"
}

variable "frontend_bucket_arn" {
  description = "ARN of the frontend S3 bucket"
  type        = string
}


variable "frontend_infra_branch" {
  type    = string
  default = "main"
}

variable "terraform_state_bucket_arn" {
  type = string
}

variable "terraform_lock_table_arn" {
  type = string
}

variable "frontend_state_key" {
  type    = string
  default = "frontend/terraform.tfstate"
}
variable "iam_roles_state_key" {
  type    = string
  default = "iam-roles/terraform.tfstate"
}

variable "frontend_deploy_branch" {
  type    = string
  default = "main"
}