resource "aws_ssm_parameter" "backend_ecr_repository_url" {
  name  = "/${var.project_name}/${var.environment}/backend/ecr_repository_url"
  type  = "String"
  value = aws_ecr_repository.app.repository_url
}

resource "aws_ssm_parameter" "backend_ecs_cluster_name" {
  name  = "/${var.project_name}/${var.environment}/backend/ecs_cluster_name"
  type  = "String"
  value = aws_ecs_cluster.main.name
}

resource "aws_ssm_parameter" "backend_ecs_service_name" {
  name  = "/${var.project_name}/${var.environment}/backend/ecs_service_name"
  type  = "String"
  value = aws_ecs_service.app.name
}

resource "aws_ssm_parameter" "backend_task_definition_family" {
  name  = "/${var.project_name}/${var.environment}/backend/task_definition_family"
  type  = "String"
  value = aws_ecs_task_definition.app.family
}

resource "aws_ssm_parameter" "backend_container_name" {
  name  = "/${var.project_name}/${var.environment}/backend/container_name"
  type  = "String"
  value = var.app_name
}