############################################
# Frontend Infra Role
# Used by: frontend Terraform infra workflow
# Purpose:
# - terraform init/plan/apply for frontend stack
# - manage S3 bucket, bucket policy, public access block,
#   versioning, object ownership, CloudFront, OAC
# - access Terraform remote backend
############################################

data "aws_iam_policy_document" "frontend_infra_assume_role" {
  statement {
    sid     = "GitHubActionsFrontendInfraAssumeRole"
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github_actions.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values = [
        "repo:${var.github_owner}/${var.github_repo}:environment:production"
      ]
    }
  }
}

resource "aws_iam_role" "frontend_infra" {
  name               = "${var.project_name}-github-actions-frontend-infra-role"
  assume_role_policy = data.aws_iam_policy_document.frontend_infra_assume_role.json

  tags = {
    Name        = "${var.project_name}-github-actions-frontend-infra-role"
    Environment = var.environment
    ManagedBy   = "Terraform"
    Purpose     = "frontend-infra"
  }
}

data "aws_iam_policy_document" "frontend_infra_policy" {
  # Terraform remote backend access
  statement {
    sid    = "TerraformStateBucketList"
    effect = "Allow"
    actions = [
      "s3:ListBucket"
    ]
    resources = [
      var.terraform_state_bucket_arn
    ]
  }

  statement {
    sid    = "TerraformStateObjectAccess"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject"
    ]
    resources = [
      "${var.terraform_state_bucket_arn}/${var.iam_roles_state_key}",
      "${var.terraform_state_bucket_arn}/${var.iam_roles_state_key}/*",
      "${var.terraform_state_bucket_arn}/${var.frontend_state_key}",
      "${var.terraform_state_bucket_arn}/${var.frontend_state_key}/*"
    ]
  }

  statement {
    sid    = "TerraformLockTableAccess"
    effect = "Allow"
    actions = [
      "dynamodb:DescribeTable",
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:DeleteItem"
    ]
    resources = [
      var.terraform_lock_table_arn
    ]
  }

  # Frontend S3 bucket management
  # Kept bootstrap-friendly with project_name wildcard
  statement {
    sid    = "ManageFrontendBuckets"
    effect = "Allow"
    actions = [
      "s3:CreateBucket",
      "s3:DeleteBucket",
      "s3:ListBucket",
      "s3:GetBucketLocation",
      "s3:GetBucketPolicy",
      "s3:PutBucketPolicy",
      "s3:DeleteBucketPolicy",
      "s3:GetBucketVersioning",
      "s3:PutBucketVersioning",
      "s3:GetBucketPublicAccessBlock",
      "s3:PutBucketPublicAccessBlock",
      "s3:DeleteBucketPublicAccessBlock",
      "s3:GetBucketTagging",
      "s3:PutBucketTagging"
    ]
    resources = [
      "arn:aws:s3:::${var.project_name}-*"
    ]
  }

  statement {
    sid    = "ManageFrontendBucketObjects"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject"
    ]
    resources = [
      "arn:aws:s3:::${var.project_name}-*/*"
    ]
  }

  # CloudFront distribution and OAC
  statement {
    sid    = "ManageCloudFront"
    effect = "Allow"
    actions = [
      "cloudfront:CreateDistribution",
      "cloudfront:UpdateDistribution",
      "cloudfront:DeleteDistribution",
      "cloudfront:GetDistribution",
      "cloudfront:GetDistributionConfig",
      "cloudfront:ListDistributions",
      "cloudfront:TagResource",
      "cloudfront:UntagResource",
      "cloudfront:ListTagsForResource",
      "cloudfront:CreateOriginAccessControl",
      "cloudfront:UpdateOriginAccessControl",
      "cloudfront:GetOriginAccessControl",
      "cloudfront:GetOriginAccessControlConfig",
      "cloudfront:DeleteOriginAccessControl",
      "cloudfront:ListOriginAccessControls"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "frontend_infra" {
  name   = "${var.project_name}-frontend-infra-policy"
  role   = aws_iam_role.frontend_infra.id
  policy = data.aws_iam_policy_document.frontend_infra_policy.json
}










############################################
# Frontend Deploy Role
# Used by: frontend app deploy workflow
# Purpose:
# - Sync static files to S3
# - Invalidate CloudFront
############################################

data "aws_iam_policy_document" "frontend_deploy_assume_role" {
  statement {
    sid     = "GitHubActionsFrontendDeployAssumeRole"
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github_actions.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values = [
        "repo:${var.github_owner}/${var.github_repo}:ref:refs/heads/${var.frontend_deploy_branch}"
      ]
    }
  }
}

resource "aws_iam_role" "frontend_deploy" {
  name               = "${var.project_name}-github-actions-frontend-deploy-role"
  assume_role_policy = data.aws_iam_policy_document.frontend_deploy_assume_role.json

  tags = {
    Name        = "${var.project_name}-github-actions-frontend-deploy-role"
    Environment = var.environment
    ManagedBy   = "Terraform"
    Purpose     = "frontend-deploy"
  }
}

data "aws_iam_policy_document" "frontend_deploy_policy" {
  statement {
    sid    = "AllowListFrontendBucket"
    effect = "Allow"
    actions = [
      "s3:ListBucket"
    ]
    resources = [
      var.frontend_bucket_arn
    ]
  }

  statement {
    sid    = "AllowFrontendObjectWriteDelete"
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:DeleteObject"
    ]
    resources = [
      "${var.frontend_bucket_arn}/*"
    ]
  }

  statement {
    sid    = "AllowCloudFrontInvalidation"
    effect = "Allow"
    actions = [
      "cloudfront:CreateInvalidation"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "frontend_deploy" {
  name   = "${var.project_name}-frontend-deploy-policy"
  role   = aws_iam_role.frontend_deploy.id
  policy = data.aws_iam_policy_document.frontend_deploy_policy.json
}

