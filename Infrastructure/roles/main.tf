terraform {
  required_version = ">= 1.5.0"

  backend "s3" {
    bucket         = "vitalflow-remote-bucket"
    key            = "iam-roles/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "vitalflow-Remote-table"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}


# remote-state.tf

data "terraform_remote_state" "frontend" {
  backend = "s3"

  config = {
    bucket         = "vitalflow-remote-bucket"
    key            = "frontend/terraform.tfstate"
    region         = var.aws_region
    dynamodb_table = "vitalflow-Remote-table"
  }
}