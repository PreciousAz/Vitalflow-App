terraform {
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
  region = "us-east-1"
}

resource "random_id" "bucket_id" {
  byte_length = 4
}

resource "aws_s3_bucket" "vitalflow_bucket" {
  bucket = "vitalflow-bucket-${random_id.bucket_id.hex}"
  acl    = "private"

  versioning {
    enabled = true
  }

  tags = {
    Name        = "vitalflow-bucket"
    Environment = "dev"
  }
}

resource "aws_cloudfront_origin_access_identity" "vitalflow_oai" {
  comment = "Origin access identity for vitalflow bucket"
}

resource "aws_s3_bucket_policy" "vitalflow_bucket_policy" {
  bucket = aws_s3_bucket.vitalflow_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipal"
        Effect    = "Allow"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.vitalflow_oai.iam_arn
        }
        Action   = ["s3:GetObject"]
        Resource = ["${aws_s3_bucket.vitalflow_bucket.arn}/*"]
      }
    ]
  })
}

resource "aws_cloudfront_distribution" "vitalflow_distribution" {
  enabled = true
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.vitalflow_bucket.bucket_regional_domain_name
    origin_id   = "S3-vitalflow-bucket"

    s3_origin_config {
      origin_access_identity = "origin-access-identity/cloudfront/${aws_cloudfront_origin_access_identity.vitalflow_oai.id}"
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-vitalflow-bucket"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Name        = "vitalflow-distribution"
    Environment = "dev"
  }
}

output "bucket_name" {
  value = aws_s3_bucket.vitalflow_bucket.bucket
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.vitalflow_distribution.domain_name
}

output cloudfront_distribution_id {
  value = aws_cloudfront_distribution.vitalflow_distribution.id
}