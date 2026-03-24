# Technical Architecture

## System Overview

The platform follows a layered architecture with clear ownership boundaries. All external traffic enters through CloudFlare, which handles CDN, DDoS protection, and edge caching before routing to the internal infrastructure.

## Request Flow

```
User Portal / App
       ↓
CloudFlare (CDN + Edge)
       ↓
Envoy Proxy (ext_auth/tcp ↔ Control Service)
       ↓
Dynamic Forward Proxy → K8s GPU Cluster → Models
```

## Component Map

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Edge Layer | CloudFlare | CDN, DDoS mitigation, TLS termination, edge caching |
| API Gateway | Envoy Proxy | Auth (ext_auth/tcp), rate limiting, request routing |
| Control Service | Custom service | Auth decisions, ext_proc/gRPC processing, policy enforcement |
| Backend | Application server | Dashboard API, billing logic, org management |
| Dynamic Forward Proxy | Envoy | Routes inference requests to model endpoints in GPU cluster |
| Model Serving | K8s GPU Cluster | Hosts open-source model instances (LLaMA, DeepSeek, Mistral, etc.) |
| Operator | K8s Operator | Model lifecycle management, scaling, health checks |
| Data Storage | Engineering team decision | Users, orgs, API keys, billing, plans, model metadata, configurations, caching |
| CI/CD | GitHub | Source control, operator deployment pipelines |

## Envoy Proxy Integration

Envoy acts as the central API gateway with two extension points connecting to the Control Service:

| Extension | Protocol | Purpose |
|-----------|----------|---------|
| ext_auth | TCP | Authentication & authorization — validates API keys (`tf-` prefix), checks rate limits, verifies org membership |
| ext_proc | gRPC | Request/response processing — token counting, usage metering, request transformation, billing event emission |

## GPU Cluster

Models run on a Kubernetes GPU cluster managed by a custom operator. The operator handles model deployment, scaling, health monitoring, and connects to GitHub for GitOps-driven model configuration. Inference requests reach models via Envoy's Dynamic Forward Proxy, which routes based on the requested model ID.

## Data Stores

Database and storage technology choices are left to the engineering team. Key data domains to support:

| Data Domain | Access Pattern |
|-------------|---------------|
| Users, orgs, API keys, billing accounts, invoices, plans, tags | Transactional CRUD, joins for billing aggregation |
| Model catalog, provider configs, playground conversations | Document reads, flexible updates |
| Rate limit counters, session tokens, cached model lists | High-frequency reads/writes, TTL-based expiry |

## Ownership Domains

| Owner | Domain | Components |
|-------|--------|-----------|
| Jawad | Infrastructure & Data | Backend, Control Service, Envoy Proxy, Data Stores, Dynamic Forward Proxy |
| Shivank | Platform & Models | Plans/Tags/Org/Keys/Usage/Billing logic, Model Management & Operations, K8s GPU Cluster, Operator, GitHub CI/CD |
