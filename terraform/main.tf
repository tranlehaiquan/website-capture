# Provider configuration
provider "aws" {
  region = "ap-southeast-1"
}

variable "DATABASE_URL" {
  type        = string
  description = "Database URL"
}

# Data source for availability zones
data "aws_availability_zones" "available" {
  state = "available"
}

# Outputs
output "ecr_repository_url" {
  value = aws_ecr_repository.app.repository_url
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "vpc_id" {
  value = aws_vpc.main.id
}

# Output the ALB DNS name
output "alb_url" {
  value       = "http://${aws_lb.main.dns_name}"
  description = "Application URL"
}