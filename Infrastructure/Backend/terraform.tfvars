# Terraform Variables - Production Configuration
aws_region         = "us-east-1"
environment         = "production"
project_name        = "Vitalflow"
ecr_repository_name = "vitalflow-app"
app_image_uri = "123456789012.dkr.ecr.us-east-1.amazonaws.com/vitalflow-app:bootstrap"

# VPC Configuration
vpc_cidr = "10.0.0.0/16"

availability_zones = ["us-east-1a", "us-east-1b"]

# Application Configuration
app_name       = "vitalflow-app"
container_port = 8000
container_cpu  = 512              # 0.5 vCPU
container_memory = 1024           # 1 GB

# Capacity Configuration
desired_count      = 0
min_capacity       = 2
max_capacity       = 4
enable_autoscaling = true

# ECR Configuration
ecr_image_tag_mutability = "MUTABLE"

# Additional Tags
tags = {
  "Team"       = "Platform"
  "CostCenter" = "Engineering"
}
