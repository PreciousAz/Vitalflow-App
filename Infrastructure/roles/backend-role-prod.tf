############################################
# Backend Infra Role
# Used by: backend Terraform infra workflow
# Purpose:
# - terraform init/plan/apply for backend stack
# - manage VPC, ECS, ECR, ALB, CloudWatch Logs, IAM roles
# - manage VPC endpoints
# - write backend deployment outputs to SSM Parameter Store
# - access Terraform remote backend
############################################

data "aws_iam_policy_document" "backend_infra_assume_role" {
  statement {
    sid     = "GitHubActionsBackendInfraAssumeRole"
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
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values = [
        "repo:${var.github_owner}/${var.github_repo}:environment:production"
      ]
    }
  }
}

resource "aws_iam_role" "backend_infra" {
  name               = "${var.project_name}-github-actions-backend-infra-role"
  assume_role_policy = data.aws_iam_policy_document.backend_infra_assume_role.json

  tags = {
    Name        = "${var.project_name}-github-actions-backend-infra-role"
    Environment = var.environment
    ManagedBy   = "Chibuike Azubuine"
    Purpose     = "backend-infra"
  }
}

data "aws_iam_policy_document" "backend_infra_policy" {
  ############################################
  # Terraform Remote Backend - S3 State Bucket
  ############################################

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
      "${var.terraform_state_bucket_arn}/*"
    ]
  }

  ############################################
  # Terraform Remote Backend - DynamoDB Locking
  ############################################

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

  ############################################
  # Backend Infrastructure Bootstrap Permissions
  # Broad for now. Tighten later using CloudTrail /
  # IAM Access Analyzer once the pipeline is stable.
  ############################################

  statement {
    sid    = "ManageBackendInfrastructure"
    effect = "Allow"
    actions = [
      "ecs:*",
      "ecr:*",
      "ec2:*",
      "elasticloadbalancing:*",
      "logs:*",
      "cloudwatch:*",
      "application-autoscaling:*"
    ]
    resources = ["*"]
  }

  ############################################
  # IAM Management for ECS Task Roles
  # Needed because Terraform creates/updates ECS
  # task execution role and task role.
  ############################################

  statement {
    sid    = "ManageBackendIamRoles"
    effect = "Allow"
    actions = [
      "iam:CreateRole",
      "iam:DeleteRole",
      "iam:GetRole",
      "iam:UpdateRole",
      "iam:TagRole",
      "iam:UntagRole",
      "iam:ListRolePolicies",
      "iam:ListAttachedRolePolicies",
      "iam:PutRolePolicy",
      "iam:GetRolePolicy",
      "iam:DeleteRolePolicy",
      "iam:AttachRolePolicy",
      "iam:DetachRolePolicy",
      "iam:PassRole"
    ]
    resources = [
      "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/${var.project_name}-*",
      "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/${title(var.project_name)}-*"
    ]
  }

  ############################################
  # SSM Parameter Store
  # Backend infra writes deployment config here
  # for the backend app deploy workflow.
  ############################################

  statement {
    sid    = "DescribeSsmParameters"
    effect = "Allow"
    actions = [
      "ssm:DescribeParameters"
    ]
    resources = ["*"]
  }

  statement {
    sid    = "ManageBackendSsmParameters"
    effect = "Allow"
    actions = [
      "ssm:PutParameter",
      "ssm:DeleteParameter",
      "ssm:GetParameter",
      "ssm:GetParameters",
      "ssm:AddTagsToResource",
      "ssm:ListTagsForResource"
    ]
    resources = [
      "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/${var.project_name}/${var.environment}/backend/*",
      "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/${title(var.project_name)}/${var.environment}/backend/*"
    ]
  }
}

resource "aws_iam_role_policy" "backend_infra" {
  name   = "${var.project_name}-backend-infra-policy"
  role   = aws_iam_role.backend_infra.id
  policy = data.aws_iam_policy_document.backend_infra_policy.json
}