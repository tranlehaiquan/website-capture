
resource "aws_sqs_queue" "sqs_capture" {
  name          = "web-capture-queue"
  delay_seconds = 0
}