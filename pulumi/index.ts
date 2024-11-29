import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const captureBucket = new aws.s3.BucketV2("website-capture-bucket");
const sqs = new aws.sqs.Queue("website-capture-queue");

// create iam role for Fargate task
const taskRole = new aws.iam.Role("website-capture-task", {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
    Service: "ecs-tasks.amazonaws.com",
  }),
});

const sqsPolicy = new aws.iam.Policy("website-capture-task-sqsPolicy", {
  description:
    "Policy to allow Fargate task to pull and delete messages from SQS",
  policy: pulumi.output({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes",
          "sqs:SendMessage",
        ],
        Resource: sqs.arn,
      },
    ],
  }),
});

new aws.iam.RolePolicyAttachment(
  "taskRolePolicyAttachment",
  {
    role: taskRole.name,
    policyArn: sqsPolicy.arn,
  }
);

const cluster = new aws.ecs.Cluster("cluster", {});

const loadbalancer = new awsx.lb.ApplicationLoadBalancer("loadbalancer", {});
// Create the ECR repository to store our container image
const repo = new awsx.ecr.Repository("repo", {
  forceDelete: true,
});

// Build and publish our application's container image from ./app to the ECR repository.
const image = new awsx.ecr.Image("image", {
  repositoryUrl: repo.url,
  context: "../backend",
  platform: "linux/amd64",
});

// Define the service and configure it to use our image and load balancer.
new awsx.ecs.FargateService("service", {
  cluster: cluster.arn,
  assignPublicIp: true,
  taskDefinitionArgs: {
    container: {
      name: "awsx-ecs",
      image: image.imageUri,
      cpu: 128,
      memory: 512,
      essential: true,
      portMappings: [
        {
          containerPort: 80,
          targetGroup: loadbalancer.defaultTargetGroup,
        },
      ],
      environment: [
        { name: "PORT", value: "80" },
        { name: "NODE_ENV", value: "production" },
        {
          name: "DATABASE_URL",
          value:
            "postgresql://postgres.uwwczawxktfwwyhmdhhf:%23QuanTran2025@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres",
        },
        {
          name: "S3_URL",
          value: captureBucket.bucket,
        },
        {
          name: "AWS_QUEUE_URL",
          value: sqs.url,
        },
      ],
    },
    taskRole: {
      roleArn: taskRole.arn,
    }, // Add the taskRole here
  },
});

// Export the URL so we can easily access it.
export const frontendURL = pulumi.interpolate`http://${loadbalancer.loadBalancer.dnsName}`;

// Create IAM role for the Lambda function
const websiteCaptureRunnerRole = new aws.iam.Role("website-capture-runner", {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
    Service: "lambda.amazonaws.com",
  }),
});

new aws.iam.RolePolicyAttachment("webCaptureRunnerRoleAttach", {
  role: websiteCaptureRunnerRole,
  policyArn: aws.iam.ManagedPolicies.AWSLambdaExecute,
});

new aws.iam.RolePolicyAttachment("webCaptureRunnerRoleAttachSQS", {
  role: websiteCaptureRunnerRole,
  policyArn: aws.iam.ManagedPolicies.AmazonSQSFullAccess,
});

const websiteCaptureRunnerFnc = new aws.lambda.Function(
  "websiteCaptureRunnerFnc",
  {
    runtime: "nodejs20.x",
    role: websiteCaptureRunnerRole.arn,
    handler: "index.handler",
    // Upload the code for the Lambda from the directory.
    code: new pulumi.asset.AssetArchive({
      ".": new pulumi.asset.FileArchive(
        "../backend/dist/apps/web-capture-runner"
      ),
    }),
  }
);

// set sqs trigger for lambda
new aws.lambda.EventSourceMapping("website-capture-runner-sqs", {
  eventSourceArn: sqs.arn,
  functionName: websiteCaptureRunnerFnc.arn,
});
