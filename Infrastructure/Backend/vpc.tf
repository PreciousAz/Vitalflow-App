module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.21.0"

  name = var.project_name
  cidr = var.vpc_cidr

  azs = var.availability_zones

  public_subnets = [
    "10.0.1.0/24",
    "10.0.2.0/24"
  ]

  private_subnets = [
    "10.0.11.0/24",
    "10.0.12.0/24"
  ]

  enable_dns_hostnames = true
  enable_dns_support   = true

  enable_nat_gateway     = false
  one_nat_gateway_per_az = true
  single_nat_gateway     = false

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }

  public_subnet_tags = {
    Name = "${var.project_name}-public-subnet"
  }

  private_subnet_tags = {
    Name = "${var.project_name}-private-subnet"
  }
}