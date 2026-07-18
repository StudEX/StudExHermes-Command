# 🏗️ Africa VM Infrastructure - Deployment Guide
## Technical Setup & Cloud Architecture

**Prepared by:** Sentinel (CTO)  
**Target Deployment:** July 30-31, 2026  
**Go Live:** August 1, 2026

---

## 🌐 Architecture Overview

### High-Level Infrastructure Design

```
┌───────────────────────────────────────────────────────────────┐
│                    GLOBAL STUDEX NETWORK                      │
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │         KIGALI EDGE NODE (Low-latency Hub)              │  │
│  │  - 20-30 VM instances for peak hackathon hours          │  │
│  │  - Local cache & CDN for content delivery               │  │
│  │  - Backup power & networking redundancy                 │  │
│  └─────────────────────────────────────────────────────────┘  │
│              ↕  (Secure Tunnel)                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │    AWS REGION (Primary - us-east-1)                      │  │
│  │  - 50-80 VM instances (scalable)                         │  │
│  │  - Sentinel orchestrator                                 │  │
│  │  - Agent processing cluster                              │  │
│  │  - Database & storage systems                            │  │
│  │  - Backup & disaster recovery                            │  │
│  └─────────────────────────────────────────────────────────┘  │
│              ↕  (Failover)                                     │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │    GCP REGION (Secondary - europe-west1)                │  │
│  │  - Backup instances & failover                          │  │
│  │  - European data residency (GDPR)                       │  │
│  │  - Agent model serving                                  │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└───────────────────────────────────────────────────────────────┘
```

---

## 🖥️ VM Instance Configuration

### Standard Participant VM

**Instance Specifications:**
```yaml
Instance Type: compute-optimized (e.g., AWS c5.xlarge equivalent)
vCPU: 4 cores
RAM: 8GB DDR4
Storage: 100GB SSD NVMe
Network: 1Gbps baseline, 10Gbps burst capability
Region: AWS us-east-1 (primary), GCP failover
OS: Ubuntu 22.04 LTS

Pre-installed Software:
  - Docker (for containerized tools)
  - Node.js 20 LTS (for web apps)
  - Python 3.11 (for data analysis)
  - PostgreSQL 15 (database)
  - Nginx (web server)
  - Git (version control)
  - SSH keys (secure access)

Pre-loaded Data:
  - Coffee market research (500MB)
  - Russian trade data (200MB)
  - Competitor database (300MB)
  - Business templates (100MB)
  - Agent API credentials
```

### Agent Processing VM

**Agent Infrastructure:**
```yaml
Instance Type: high-memory (e.g., AWS r5.4xlarge)
vCPU: 16 cores
RAM: 128GB DDR4
Storage: 500GB SSD RAID
GPU: Optional (for model serving)
Replicas: 3 per agent (for redundancy)

Hermes Agent Server:
  - Model: Kimi-K2.6:cloud
  - Requests/hour: 500
  - Concurrent tasks: 25
  - Latency target: < 2 seconds

OpenClaw Agent Server:
  - Model: GLM-5.1:cloud
  - Requests/hour: 300
  - Concurrent analyses: 20
  - Latency target: < 3 seconds

Codex Agent Server:
  - Model: Minimax-01:cloud
  - Requests/hour: 400
  - Concurrent implementations: 30
  - Latency target: < 2 seconds
```

---

## 🚀 Deployment Steps

### Phase 1: Infrastructure Setup (July 24-28)

#### Step 1: Cloud Account & Permissions
```bash
# AWS Setup
aws configure
aws ec2 create-security-group --group-name studex-africa --description "Africa VM Group"
aws ec2 authorize-security-group-ingress --group-name studex-africa --protocol tcp --port 22 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-name studex-africa --protocol tcp --port 443 --cidr 0.0.0.0/0

# Create VPC & Subnets
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=studex-africa}]'
aws ec2 create-subnet --vpc-id vpc-xxxxx --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
```

#### Step 2: Database & Storage
```bash
# RDS Database for business data
aws rds create-db-instance \
  --db-instance-identifier studex-africa-db \
  --db-instance-class db.t3.large \
  --engine postgres \
  --master-username admin \
  --db-name studex_africa \
  --allocated-storage 500 \
  --backup-retention-period 7

# S3 Bucket for documents & media
aws s3 mb s3://studex-africa-data --region us-east-1
aws s3 put-bucket-versioning --bucket studex-africa-data --versioning-configuration Status=Enabled
aws s3 put-bucket-encryption --bucket studex-africa-data --server-side-encryption-configuration '...'

# Elasticache for caching
aws elasticache create-cache-cluster \
  --cache-cluster-id studex-africa-cache \
  --cache-node-type cache.t3.medium \
  --engine redis \
  --num-cache-nodes 3
```

#### Step 3: Networking & Load Balancing
```bash
# Application Load Balancer
aws elbv2 create-load-balancer \
  --name studex-africa-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-xxxxx \
  --scheme internet-facing

# Auto-scaling group for VM fleet
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name studex-africa-asg \
  --launch-template LaunchTemplateName=studex-vm,Version=\$Latest \
  --min-size 10 \
  --max-size 100 \
  --desired-capacity 50 \
  --vpc-zone-identifier "subnet-xxxxx,subnet-yyyyy"
```

### Phase 2: Sentinel Orchestrator Setup (July 28-29)

#### Sentinel Configuration
```yaml
# sentinel-config.yaml

orchestration:
  mode: distributed
  primary_region: us-east-1
  secondary_region: europe-west1
  edge_region: africa-central1

vm_fleet:
  min_instances: 10
  max_instances: 100
  desired_instances: 50
  scaling_policy:
    metric: cpu_utilization
    target: 70%
    scale_up_threshold: 80%
    scale_down_threshold: 30%

agents:
  hermes:
    model: kimi-k2.6:cloud
    replicas: 3
    capacity: 500_requests_per_hour
  openclaw:
    model: glm-5.1:cloud
    replicas: 3
    capacity: 300_requests_per_hour
  codex:
    model: minimax-01:cloud
    replicas: 3
    capacity: 400_requests_per_hour

monitoring:
  metrics_collection: enabled
  dashboards: [performance, costs, participants]
  alert_thresholds:
    cpu: 85%
    memory: 80%
    disk: 90%
    agent_response_time: 5s

backup:
  frequency: hourly
  retention: 7_days
  geographic_redundancy: enabled
```

#### Deployment Script
```bash
#!/bin/bash
# deploy_sentinel.sh

echo "🚀 Deploying Sentinel Orchestrator..."

# Load environment
source .env.production

# Deploy Sentinel service
docker pull studex/sentinel:latest
docker run -d \
  --name sentinel-orchestrator \
  --restart always \
  -e ENVIRONMENT=production \
  -e AWS_REGION=us-east-1 \
  -v /etc/sentinel/config.yaml:/app/config.yaml \
  -p 8080:8080 \
  studex/sentinel:latest

# Initialize database
docker exec sentinel-orchestrator /app/init-db.sh

# Start monitoring
docker exec sentinel-orchestrator /app/start-monitoring.sh

echo "✅ Sentinel deployed and running!"
```

### Phase 3: VM Fleet Provisioning (July 29-30)

#### VM Image Building
```dockerfile
# Dockerfile.participant-vm
FROM ubuntu:22.04

# System packages
RUN apt-get update && apt-get install -y \
    curl git docker.io nodejs python3-pip postgresql-client \
    nginx openssh-server build-essential

# Node.js setup
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# Python setup
RUN pip3 install --upgrade pip pandas numpy scikit-learn

# Pre-load data
COPY ./data/coffee_market_research.zip /data/
COPY ./data/russian_trade_data.zip /data/
COPY ./data/templates/ /app/templates/

# Agent API client
RUN npm install -g @studex/agent-sdk

# Start services
CMD ["/bin/bash", "-c", "service ssh start && nginx -g 'daemon off;'"]
```

#### Fleet Provisioning Script
```bash
#!/bin/bash
# provision_vm_fleet.sh

INSTANCE_COUNT=$1
INSTANCE_TYPE="t3.xlarge"

echo "📦 Provisioning $INSTANCE_COUNT VM instances..."

# Build AMI from Dockerfile
aws ec2 build-image \
  --name studex-participant-vm-$(date +%Y%m%d) \
  --dockerfile ./Dockerfile.participant-vm

IMAGE_ID=$(aws ec2 describe-images --filters "Name=name,Values=studex-participant-vm*" | jq -r '.Images[0].ImageId')

# Launch instances
for i in $(seq 1 $INSTANCE_COUNT); do
  aws ec2 run-instances \
    --image-id $IMAGE_ID \
    --instance-type $INSTANCE_TYPE \
    --key-name studex-africa \
    --security-groups studex-africa \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=participant-vm-$i}]" \
    --monitoring Enabled=true
done

echo "✅ Provisioned $INSTANCE_COUNT instances"
```

#### Automated Instance Configuration
```bash
#!/bin/bash
# configure_vm_instance.sh

PARTICIPANT_ID=$1
AGENT_ASSIGNMENT=$2

echo "Configuring VM for participant $PARTICIPANT_ID..."

# Set hostname
sudo hostnamectl set-hostname vm-participant-$PARTICIPANT_ID

# Create participant user
sudo useradd -m -s /bin/bash participant-$PARTICIPANT_ID
sudo usermod -aG docker participant-$PARTICIPANT_ID
sudo usermod -aG sudo participant-$PARTICIPANT_ID

# Generate SSH keys
sudo -u participant-$PARTICIPANT_ID ssh-keygen -t ed25519 -f /home/participant-$PARTICIPANT_ID/.ssh/id_ed25519 -N ""

# Configure agent API client
cat > /etc/environment << EOF
PARTICIPANT_ID=$PARTICIPANT_ID
AGENT_ASSIGNMENT=$AGENT_ASSIGNMENT
AGENT_API_KEY=$(aws secretsmanager get-secret-value --secret-id studex/agent/$AGENT_ASSIGNMENT | jq -r '.SecretString')
STUDEX_API_ENDPOINT=https://api.studex.dev
EOF

# Start services
sudo systemctl start docker
sudo systemctl start nginx
sudo systemctl start ssh

# Test connectivity
curl -s https://api.studex.dev/health && echo "✅ VM $PARTICIPANT_ID ready!"
```

### Phase 4: Agent Integration (July 30)

#### Agent Deployment
```bash
#!/bin/bash
# deploy_agents.sh

echo "🤖 Deploying Trinity Agents..."

# Deploy Hermes
docker run -d \
  --name hermes-agent \
  --restart always \
  -e MODEL=kimi-k2.6:cloud \
  -e MAX_REQUESTS=500 \
  -e REGION=africa \
  -p 5001:5000 \
  studex/hermes:latest

# Deploy OpenClaw
docker run -d \
  --name openclaw-agent \
  --restart always \
  -e MODEL=glm-5.1:cloud \
  -e MAX_REQUESTS=300 \
  -e REGION=africa \
  -p 5002:5000 \
  studex/openclaw:latest

# Deploy Codex
docker run -d \
  --name codex-agent \
  --restart always \
  -e MODEL=minimax-01:cloud \
  -e MAX_REQUESTS=400 \
  -e REGION=africa \
  -p 5003:5000 \
  studex/codex:latest

# Deploy Natalia (Orchestrator)
docker run -d \
  --name natalia-orchestrator \
  --restart always \
  -e MODE=orchestration \
  -e GLOBAL_SCOPE=true \
  -e AGENT_ENDPOINTS="hermes:5001,openclaw:5002,codex:5003" \
  -p 8090:5000 \
  studex/natalia:latest

echo "✅ All agents deployed!"
```

#### Agent Health Check
```bash
#!/bin/bash
# health_check.sh

echo "🏥 Checking agent health..."

agents=("hermes" "openclaw" "codex" "natalia-orchestrator")

for agent in "${agents[@]}"; do
  status=$(docker exec $agent curl -s http://localhost:5000/health)
  if [ $? -eq 0 ]; then
    echo "✅ $agent: HEALTHY"
  else
    echo "❌ $agent: FAILED"
    docker restart $agent
  fi
done

echo "Health check complete!"
```

### Phase 5: Pre-Launch Testing (July 30-31)

#### Load Testing
```bash
#!/bin/bash
# load_test.sh

echo "⚡ Running load tests..."

# Test with 50 concurrent participants
ab -n 1000 -c 50 https://api.studex.dev/health

# Test agent response time
for i in {1..100}; do
  time curl -X POST https://api.hermes.studex.dev/generate \
    -H "Content-Type: application/json" \
    -d '{"prompt":"Generate a coffee export pitch"}'
done

# Monitor resource usage
docker stats --no-stream
```

#### Data Validation
```bash
#!/bin/bash
# validate_data.sh

echo "📊 Validating data integrity..."

# Check database
psql -h $DB_HOST -U $DB_USER -d studex_africa -c "SELECT COUNT(*) FROM businesses;"
psql -h $DB_HOST -U $DB_USER -d studex_africa -c "SELECT COUNT(*) FROM market_data;"

# Check S3 buckets
aws s3 ls s3://studex-africa-data --recursive --summarize

# Verify agent credentials
aws secretsmanager list-secrets --filters Key=Name,Values=studex/agent

echo "✅ Data validation complete!"
```

---

## 📈 Monitoring & Observability

### CloudWatch Dashboard
```json
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["AWS/EC2", "CPUUtilization", {"stat": "Average"}],
          ["AWS/EC2", "NetworkIn", {"stat": "Sum"}],
          ["AWS/RDS", "DatabaseConnections"],
          ["StudEx/Agents", "ResponseTime"],
          ["StudEx/Agents", "ErrorRate"]
        ],
        "period": 60,
        "stat": "Average",
        "region": "us-east-1"
      }
    }
  ]
}
```

### Logging & Tracing
```bash
# Enable CloudWatch Logs
aws logs create-log-group --log-group-name /studex/africa/vms
aws logs create-log-group --log-group-name /studex/africa/agents

# Configure agent logging
export AGENT_LOG_LEVEL=INFO
export AGENT_LOG_DESTINATION=cloudwatch
export AGENT_LOG_GROUP=/studex/africa/agents

# Enable distributed tracing
export AWS_XRAY_TRACING_ENABLED=true
export AWS_XRAY_CONTEXT_MISSING=LOG_ERROR
```

---

## 🔐 Security Hardening

### Network Security
```bash
# VPC Security Group Rules
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 22 \
  --cidr 10.0.0.0/16  # Only from internal IPs
```

### Encryption
```bash
# Enable EBS encryption
aws ec2 modify-instance-attribute \
  --instance-id i-xxxxx \
  --block-device-mappings DeviceName=/dev/sda1,Ebs={Encrypted=true}

# Enable S3 encryption
aws s3api put-bucket-encryption \
  --bucket studex-africa-data \
  --server-side-encryption-configuration '{...}'

# Enable database encryption
aws rds modify-db-instance \
  --db-instance-identifier studex-africa-db \
  --storage-encrypted \
  --apply-immediately
```

### Secrets Management
```bash
# Store API keys securely
aws secretsmanager create-secret \
  --name studex/agent/hermes \
  --secret-string '{"api_key":"xxx","model":"kimi-k2.6:cloud"}'

aws secretsmanager create-secret \
  --name studex/db/credentials \
  --secret-string '{"username":"admin","password":"xxx"}'
```

---

## 🚨 Disaster Recovery

### Backup Strategy
```bash
#!/bin/bash
# backup_strategy.sh

# Automated daily snapshots
aws ec2 create-snapshot \
  --volume-id vol-xxxxx \
  --description "Daily backup - $(date)"

# Database backups (automated by RDS)
aws rds describe-db-instances \
  --db-instance-identifier studex-africa-db \
  --query 'DBInstances[0].[LatestRestorableTime,BackupRetentionPeriod]'

# Cross-region replication
aws s3 put-bucket-replication \
  --bucket studex-africa-data \
  --replication-configuration file://replication.json
```

### Failover Procedures
```bash
# If primary region fails:
1. Detect failure (automated via Route 53 health checks)
2. Failover DNS to secondary region (GCP)
3. Restore RDS from latest snapshot
4. Sync S3 data from primary backup
5. Restart agent cluster in secondary region
6. Notify participants & reschedule as needed
```

---

## 📋 Pre-Launch Checklist

- [ ] AWS/GCP accounts configured & secure
- [ ] VPC & networking set up
- [ ] RDS database created & tested
- [ ] S3 buckets created with encryption & versioning
- [ ] Sentinel orchestrator deployed & running
- [ ] All 3 agents deployed & healthy
- [ ] 50-100 VM instances provisioned
- [ ] Load testing completed successfully
- [ ] Monitoring dashboards active
- [ ] Backup & disaster recovery tested
- [ ] Security hardening applied
- [ ] Team trained on incident response
- [ ] Participants registered & onboarded
- [ ] Go-live approval from leadership

---

**Status:** 🟡 Ready for Deployment  
**Last Updated:** 2026-07-18  
**Maintained by:** Sentinel (CTO) & Infrastructure Team

**Deployment Window:** July 30-31, 2026  
**Go Live:** August 1, 09:00 EAT
