#!/bin/bash
# Deploy the Terraform configuration
terraform init
terraform apply -auto-approve

bucket_name=$(terraform output -raw bucket_name)
cloudfront_distribution_id=$(terraform output -raw cloudfront_distribution_id)
cloudfront_domain_name=$(terraform output -raw cloudfront_domain_name)

#copy all files to the S3 bucket
aws s3 sync "./VitalFlow Frontend" "s3://${bucket_name}/" --delete

#invalidate the CloudFront distribution to ensure the new content is served
aws cloudfront create-invalidation --distribution-id "${cloudfront_distribution_id}" --paths "/*"

echo "https://${cloudfront_domain_name}/"
