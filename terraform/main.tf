# Provider configuration
provider "aws" {
  region = "ap-southeast-1"
}

variable "DATABASE_URL" {
  type        = string
  description = "Database URL"
}

# VPC Configuration
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "fargate-vpc"
  }
}

# Public Subnets
resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index + 1}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "fargate-public-${count.index + 1}"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "fargate-igw"
  }
}

# Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "fargate-public-rt"
  }
}

# Route Table Association
resource "aws_route_table_association" "public" {
  count          = 2
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# ECR Repository
resource "aws_ecr_repository" "app" {
  name                 = "my-app-repo"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "my-app-repo"
  }
}

# ECR Lifecycle Policy
resource "aws_ecr_lifecycle_policy" "app" {
  repository = aws_ecr_repository.app.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 2 images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 2
      }
      action = {
        type = "expire"
      }
    }]
  })
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "fargate-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "fargate-cluster"
  }
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/fargate-app"
  retention_in_days = 3

  tags = {
    Name = "fargate-app-logs"
  }
}

# Security Group for ECS Tasks
resource "aws_security_group" "ecs_tasks" {
  name        = "ecs-tasks-sg"
  description = "Allow inbound traffic for ECS tasks"
  vpc_id      = aws_vpc.main.id

  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow HTTP inbound"
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound"
  }

  tags = {
    Name = "ecs-tasks-sg"
  }
}

# ECS Task Execution Role
resource "aws_iam_role" "ecs_execution_role" {
  name = "ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "ecs-execution-role"
  }
}

# Attach policies to ECS Task Execution Role
resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# ECS Task Role
resource "aws_iam_role" "ecs_task_role" {
  name = "ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "ecs-task-role"
  }
}

# Task Definition
resource "aws_ecs_task_definition" "app" {
  family                   = "app"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name  = "app"
      image = "${aws_ecr_repository.app.repository_url}:latest"
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs.name
          "awslogs-region"        = "ap-southeast-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
      environment = [
        {
          name  = "ENVIRONMENT"
          value = "production"
        },
        {
          name  = "PORT"
          value = "80"
        },
        {
          name = "DATABASE_URL"
          value = var.DATABASE_URL
        }
      ]
    }
  ])

  tags = {
    Name = "app-task-definition"
  }
}

# Data source for availability zones
data "aws_availability_zones" "available" {
  state = "available"
}

# Add ALB Security Group
resource "aws_security_group" "alb" {
  name        = "alb-sg"
  description = "ALB Security Group"
  vpc_id      = aws_vpc.main.id

  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow HTTP inbound"
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "alb-sg"
  }
}

# Create ALB
resource "aws_lb" "main" {
  name               = "fargate-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets           = aws_subnet.public[*].id

  tags = {
    Name = "fargate-alb"
  }
}

# Create ALB Target Group
resource "aws_lb_target_group" "app" {
  name        = "fargate-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    healthy_threshold   = "3"
    interval           = "30"
    protocol           = "HTTP"
    matcher            = "200"
    timeout            = "3"
    path              = "/"
    unhealthy_threshold = "2"
  }

  tags = {
    Name = "fargate-tg"
  }
}

# Create ALB Listener
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

# Modify the ECS Service to use the ALB
resource "aws_ecs_service" "app" {
  name            = "app"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.public[*].id
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "app"
    container_port   = 80
  }

  depends_on = [aws_lb_listener.http]

  tags = {
    Name = "app-service"
  }
}

# Modify ECS Tasks Security Group to allow traffic from ALB
resource "aws_security_group_rule" "ecs_tasks_ingress_alb" {
  security_group_id        = aws_security_group.ecs_tasks.id
  type                    = "ingress"
  protocol                = "tcp"
  from_port               = 80
  to_port                 = 80
  source_security_group_id = aws_security_group.alb.id
  description             = "Allow traffic from ALB"
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
  value = "http://${aws_lb.main.dns_name}"
  description = "Application URL"
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}


resource "aws_iam_role" "lambda-worker" {
  name = "web-capture-worker-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "archive_file" "web-capture-worker-lambda" {
  type        = "zip"
  source_file = "../backend/dist/apps/web-capture-runner/main.js"
  output_path = "./dist/worker_lambda_function_payload.zip"
}

resource "aws_sqs_queue" "sqs_capture" {
  name = "web-capture-queue"
  delay_seconds = 0
}

# create lambda
resource "aws_lambda_function" "web-capture-worker" {
  function_name = "web-capture-worker"
  handler = "index.handler"
  runtime = "nodejs20.x"
  role = aws_iam_role.lambda-worker.arn
  filename = data.archive_file.web-capture-worker-lambda.output_path
  source_code_hash = data.archive_file.web-capture-worker-lambda.output_base64sha256
  environment {
    variables = {
      DATABASE_URL = var.DATABASE_URL
    }
  }
}