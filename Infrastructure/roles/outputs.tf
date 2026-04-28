output "github_oidc_provider_arn" {
  description = "GitHub OIDC provider ARN"
  value       = aws_iam_openid_connect_provider.github_actions.arn
}

output "frontend_deploy_role_arn" {
  description = "IAM role ARN for GitHub Actions frontend app deployment"
  value       = aws_iam_role.frontend_deploy.arn
}

output "frontend_infra_role_arn" {
  description = "IAM role ARN for GitHub Actions frontend infrastructure deployment"
  value       = aws_iam_role.frontend_infra.arn
}

output "backend_infra_role_arn" {
  description = "IAM role ARN for GitHub Actions backend infrastructure deployment"
  value       = aws_iam_role.backend_infra.arn
}