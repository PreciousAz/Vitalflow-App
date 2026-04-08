output "bucket_name" {
  value = aws_s3_bucket.vitalflow_bucket.bucket
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.vitalflow_distribution.domain_name
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.vitalflow_distribution.id
}