terraform {
  required_version = ">= 1.0"

  backend "s3" {
    bucket         = "vitalflow-remote-bucket"
    key            = "ecs/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "vitalflow-Remote-table"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Chibuike Azubuine"
    }
  }
}

data "aws_caller_identity" "current" {}