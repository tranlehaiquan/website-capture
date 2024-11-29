# Authenticate to ECR
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin $(terraform output -raw ecr_repository_url)

# Build and tag your image
docker build -t website-capture .
docker tag website-capture:latest $(terraform output -raw ecr_repository_url):latest

# Push the image
docker push $(terraform output -raw ecr_repository_url):latest

```mermaid
graph TD
    subgraph VPC[VPC 10.0.0.0/16]
        subgraph PublicSubnets[Public Subnets]
            PS1[Subnet 1<br/>10.0.1.0/24]
            PS2[Subnet 2<br/>10.0.2.0/24]
        end
        
        ALB[Application Load Balancer]
        
        subgraph ECSCluster[ECS Cluster]
            Service[ECS Service]
            subgraph Tasks[Fargate Tasks]
                T1[Task 1]
                T2[Task 2]
            end
        end
        
        SG_ALB[ALB Security Group<br/>Port 80]
        SG_ECS[ECS Tasks Security Group<br/>Port 80]
    end
    
    Internet((Internet))
    IGW[Internet Gateway]
    
    Internet -->|HTTP 80| IGW
    IGW -->|HTTP 80| ALB
    ALB -->|HTTP 80| Service
    Service --> T1
    Service --> T2
    
    ALB ---|Uses| SG_ALB
    T1 ---|Uses| SG_ECS
    T2 ---|Uses| SG_ECS
    
    T1 ---|Runs in| PS1
    T2 ---|Runs in| PS2
    
    classDef subnet fill:#e4f0f8,stroke:#333
    classDef sg fill:#ffe6cc,stroke:#333
    class PS1,PS2 subnet
    class SG_ALB,SG_ECS sg
```