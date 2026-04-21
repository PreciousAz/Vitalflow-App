variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "VitalFlow"
  type        = string
  default     = "vitalflow"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "multi-AZ setup"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "container_port" {
  description = "Port on which the container listens"
  type        = number
  default     = 8000
}

variable "container_cpu" {
  description = "CPU units for ECS task (256 = 0.25 vCPU)"
  type        = number
  default     = 512
}

variable "container_memory" {
  description = "Memory for ECS task in MB"
  type        = number
  default     = 1024
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "vitalflow-app"
}

variable "desired_count" {
  description = "Desired number of ECS tasks"
  type        = number
  default     = 2
}

variable "min_capacity" {
  description = "Minimum number of ECS tasks for auto-scaling"
  type        = number
  default     = 2
}

variable "max_capacity" {
  description = "Maximum number of ECS tasks for auto-scaling"
  type        = number
  default     = 4
}

variable "enable_autoscaling" {
  description = "Enable auto-scaling for ECS"
  type        = bool
  default     = true
}

variable "ecr_repository_name" {
  description = "ECR repository name"
  type        = string
  default     = "vitalflow-app"
}

variable "app_image_uri" {
  description = "Container image URI"
  type        = string
}
variable "ecr_image_tag_mutability" {
  description = "ECR image tag mutability"
  type        = string
  default     = "MUTABLE"
}

variable "tags" {
  description = "Additional tags"
  type        = map(string)
  default     = {}
}
