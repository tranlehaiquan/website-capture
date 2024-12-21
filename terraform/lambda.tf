
data "archive_file" "web-capture-worker-lambda" {
  type        = "zip"
  source_file = "../backend/dist/apps/web-capture-runner/index.js"
  output_path = "./dist/worker_lambda_function_payload.zip"
}

resource "aws_lambda_function" "web-capture-worker" {
  function_name    = "web-capture-worker"
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  role             = aws_iam_role.lambda-worker.arn
  filename         = data.archive_file.web-capture-worker-lambda.output_path
  source_code_hash = data.archive_file.web-capture-worker-lambda.output_base64sha256
  environment {
    variables = {
      DATABASE_URL = var.DATABASE_URL
    }
  }
}