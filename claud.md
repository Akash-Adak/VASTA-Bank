<div align="center">

```
██╗   ██╗ █████╗ ███████╗████████╗ █████╗     ██████╗  █████╗ ███╗   ██╗██╗  ██╗
██║   ██║██╔══██╗██╔════╝╚══██╔══╝██╔══██╗    ██╔══██╗██╔══██╗████╗  ██║██║ ██╔╝
██║   ██║███████║███████╗   ██║   ███████║    ██████╔╝███████║██╔██╗ ██║█████╔╝ 
╚██╗ ██╔╝██╔══██║╚════██║   ██║   ██╔══██║    ██╔══██╗██╔══██║██║╚██╗██║██╔═██╗ 
 ╚████╔╝ ██║  ██║███████║   ██║   ██║  ██║    ██████╔╝██║  ██║██║ ╚████║██║  ██╗
  ╚═══╝  ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝
```

### **Enterprise-Grade Full-Stack Digital Banking Platform**

*Microservices · Event-Driven · Cloud-Native · Production-Ready*

---

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-VASTA_Bank-1a73e8?style=for-the-badge)](https://vasta-bank.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?style=for-the-badge&logo=docker&logoColor=white)](docker-compose.yml)
[![Java](https://img.shields.io/badge/Java-17-f89820?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6db33f?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/)
[![React](https://img.shields.io/badge/React_+_Vite-Frontend-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Kafka](https://img.shields.io/badge/Apache_Kafka-Event_Driven-231f20?style=for-the-badge&logo=apachekafka)](https://kafka.apache.org/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestrated-326ce5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/)

</div>

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Why VASTA Bank Stands Out](#-why-vasta-bank-stands-out)
- [System Architecture](#-system-architecture)
- [Backend Microservices](#-backend-microservices)
- [Security Model](#-security-model)
- [Event-Driven Architecture (Kafka)](#-event-driven-architecture-kafka)
- [Frontend](#-frontend-react--vite)
- [Payment Gateway](#-payment-gateway-razorpay)
- [Monitoring & Observability](#-monitoring--observability)
- [DevOps & Deployment](#-devops--deployment)
- [Kubernetes (K8s)](#-kubernetes-k8s)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Service Access URLs](#-service-access-urls)
- [What This Project Proves](#-what-this-project-proves)

---

## 🏦 Project Overview

**VASTA Bank** is a **real-world, production-inspired enterprise banking platform** — not a CRUD demo.

It simulates how modern FinTech companies architect digital banking systems at scale: distributed microservices with clearly defined boundaries, event-driven communication via Kafka, bank-grade JWT security, payment gateway integration, real-time monitoring, and full Kubernetes orchestration.

> Built to demonstrate mastery of backend engineering, distributed systems, DevOps, and cloud-native architecture — all in a single cohesive project.

---

## ✨ Why VASTA Bank Stands Out

| Capability | Implementation |
|---|---|
| 🔐 Bank-Grade Security | JWT RS256 + RBAC + Redis token management + BCrypt |
| ⚡ Real-Time Event Streaming | Apache Kafka for transactions, notifications, auditing |
| 💳 Live Payment Gateway | Razorpay integration for real money flow |
| 🧩 True Microservices | 9 independently deployable services |
| 🌐 Service Discovery | Netflix Eureka + Feign Clients |
| 📊 Full Observability | Prometheus + Grafana dashboards |
| 🐳 One-Command Startup | Docker Compose — everything up instantly |
| ☸️ Kubernetes Ready | HPA auto-scaling, rolling deployments, health probes |
| ⚡ High Performance | Redis caching for low-latency reads |
| 🧪 Production Reliability | DB transactions, pessimistic locking, Kafka DLQ |

---

## 🏗️ System Architecture

```
                          ┌─────────────────────────────────────────────────────────┐
                          │                      CLIENT LAYER                        │
                          │              React + Vite Frontend (SPA)                 │
                          └───────────────────────────┬─────────────────────────────┘
                                                      │ HTTPS
                          ┌───────────────────────────▼─────────────────────────────┐
                          │                   API GATEWAY (8080)                     │
                          │         JWT Validation · Rate Limiting · Routing         │
                          └─────┬──────┬──────┬──────┬──────┬──────┬──────┬────────┘
                                │      │      │      │      │      │      │
              ┌─────────────────▼─┐  ┌─▼──┐ ┌▼────┐ ┌▼───┐ ┌▼────┐ ┌▼──┐ ┌▼──────┐
              │  Auth Service     │  │User│ │Acct │ │Txn │ │Loan │ │Notif│ │Payment│
              │  (8081)           │  │8082│ │8083 │ │8084│ │8086 │ │8085 │ │Service│
              └─────────────────┬─┘  └─┬──┘ └┬────┘ └┬───┘ └┬────┘ └┬──┘ └┬──────┘
                                │      │     │       │      │       │      │
                          ┌─────▼──────▼─────▼───────▼──────▼───────▼──────▼──────┐
                          │                   KAFKA EVENT BUS                       │
                          │  transaction.events · account.events · loan.events      │
                          │  notification.events · audit.events · payment.events    │
                          └──────────────────────────────────────────────────────────┘
                                │                   │                  │
                          ┌─────▼──────┐     ┌──────▼──────┐   ┌──────▼──────┐
                          │   MySQL    │     │    Redis    │   │   Eureka    │
                          │ (Persist.) │     │  (Cache)    │   │  (Discovery)│
                          └────────────┘     └─────────────┘   └─────────────┘
                                │                                       │
                          ┌─────▼───────────────────────────────────────▼──────────┐
                          │              Prometheus + Grafana (Monitoring)           │
                          └────────────────────────────────────────────────────────┘
```

---

## 🧩 Backend Microservices

Each service is **independently deployable**, owns its own database schema, and communicates asynchronously via **Kafka** and synchronously via **Feign Clients** where needed.

### Service Registry

| Service | Port | Responsibility |
|---|---|---|
| **API Gateway** | `8080` | Single entry point — JWT validation, rate limiting, intelligent routing |
| **Auth Service** | `8081` | Login, registration, JWT RS256 issuance, refresh token lifecycle |
| **User Service** | `8082` | User profiles, KYC management, account linking |
| **Account Service** | `8083` | Bank account creation, balance management, account types |
| **Transaction Service** | `8084` | Fund transfers, transaction validation, history & ledger |
| **Notification Service** | `8085` | Email, SMS, in-app alerts triggered by Kafka events |
| **Loan Service** | `8086` | Loan applications, EMI calculations, repayment lifecycle |
| **Admin Service** | `8087` | Admin dashboard, user management, system-wide oversight |
| **Payment Service** | `8088` | Razorpay integration — money top-up, payment verification |
| **Eureka Server** | `8761` | Service discovery & health registry for all microservices |

### Inter-Service Communication

```
Auth Service  ──── (Feign) ────► User Service
Admin Service ──── (Feign) ────► Account Service + User Service
Payment Svc   ──── (Kafka) ────► Account Service (balance update)
Transaction   ──── (Kafka) ────► Notification Service
Loan Service  ──── (Kafka) ────► Notification Service + Account Service
```

> **Spring Cloud OpenFeign** is used for synchronous inter-service REST calls with **Eureka-based service discovery** — no hardcoded URLs, fully dynamic.

---

## 🔐 Security Model

VASTA Bank implements **bank-grade, multi-layered security** throughout the entire stack.

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
├─────────────────────────────────────────────────────────────┤
│  1. JWT RS256          Asymmetric signing (private/public)  │
│  2. RBAC               ADMIN / MANAGER / USER roles         │
│  3. Redis Token Store  Stateless sessions with revocation   │
│  4. BCrypt Hashing     Salted password storage              │
│  5. OTP Verification   High-value transaction approval      │
│  6. Rate Limiting      API Gateway — per-IP request limits  │
│  7. IP Tracking        Suspicious access detection          │
└─────────────────────────────────────────────────────────────┘
```

**Why RS256?**
Unlike HS256 (symmetric), RS256 uses a **private key to sign** and a **public key to verify** — meaning only the Auth Service can issue tokens, while all other services can validate them without knowing the secret. True zero-trust design.

---

## 📡 Event-Driven Architecture (Kafka)

All high-throughput, loosely-coupled operations are handled asynchronously through **Apache Kafka**.

```
PRODUCERS                    KAFKA TOPICS                    CONSUMERS
─────────                    ────────────                    ─────────
Transaction Svc ──────► transaction.events ──────► Notification Svc
                                         ──────► Audit Service
                                         ──────► Account Svc

Account Svc ──────────► account.events ────────► Admin Svc
                                       ────────► Notification Svc

Loan Svc ─────────────► loan.events ───────────► Notification Svc
                                    ───────────► Account Svc (EMI debit)

Payment Svc ──────────► payment.events ────────► Account Svc
                                       ────────► Notification Svc

All Services ─────────► audit.events ──────────► Audit/Log Store
```

**Benefits:**
- ✅ Async processing — no request blocking
- ✅ Loose coupling — services don't know about each other
- ✅ Replay capability — events can be reprocessed
- ✅ Dead-letter queues — failed events are captured and retried
- ✅ Scales independently — Kafka handles millions of events/sec

---

## 🖥️ Frontend (React + Vite)

**Stack:** React · Vite · Tailwind CSS · Axios · JWT Auth Flow

**Architecture:**
```
src/
├── components/          # Reusable UI components
│   ├── auth/            # Login, Register, OTP
│   ├── dashboard/       # Account overview, balance cards
│   ├── transactions/    # Transfer form, history table
│   ├── loans/           # Loan application, EMI tracker
│   ├── payment/         # Razorpay checkout integration
│   ├── admin/           # Admin panels (role-gated)
│   └── notifications/   # In-app alerts
├── hooks/               # Custom React hooks
├── context/             # Auth context, global state
├── services/            # Axios API service layer
└── utils/               # JWT helpers, formatters
```

**Features:**
- 🔑 JWT-based authentication with token refresh
- 👤 Role-based UI — Admin sees different panels than Users
- 💸 Real-time fund transfer with OTP confirmation
- 📈 Transaction history with filtering & pagination
- 🏦 Loan application wizard with EMI preview
- 💳 Razorpay payment modal for account top-up
- 📱 Fully responsive across all screen sizes

---

## 💳 Payment Gateway (Razorpay)

VASTA Bank integrates **Razorpay** for real money flow into bank accounts.

```
User Initiates Top-Up
        │
        ▼
Razorpay Order Created (Backend)
        │
        ▼
Razorpay Checkout Modal (Frontend)
        │
        ▼
Payment Verified (Signature validation on backend)
        │
        ▼
Kafka: payment.events published
        │
        ▼
Account Service: Balance credited
        │
        ▼
Notification Service: Confirmation sent
```

---

## 📊 Monitoring & Observability

Full observability stack for understanding system health in real time.

| Tool | Purpose |
|---|---|
| **Prometheus** | Scrapes metrics from Spring Boot Actuator endpoints |
| **Grafana** | Dashboards for visualization and alerting |
| **Spring Actuator** | Exposes `/actuator/metrics`, `/health`, `/info` |

**Tracked Metrics:**
- 📈 Request throughput & latency (p50, p95, p99)
- ❌ HTTP error rates per service
- 🔁 Kafka consumer lag per topic
- 🧠 JVM heap usage, GC pauses, thread count
- 💾 MySQL query performance & connection pool
- ⚡ Redis cache hit/miss ratio
- 💰 Business metrics: transactions/sec, loan approvals/hr

---

## 🐳 DevOps & Deployment

### Docker Compose (Local / Dev)

The entire platform runs with a **single command**:

```bash
# Clone the repository
git clone https://github.com/Akash-Adak/VASTA-Bank.git
cd VASTA-Bank

# Start all services
docker-compose up -d

# Stop all services
docker-compose down
```

**Services started automatically:**
- All 9 microservices
- MySQL (with schema auto-init)
- Redis
- Apache Kafka + Zookeeper
- Prometheus + Grafana
- Eureka Server

> ⏳ First startup may take 3–5 minutes as images are pulled and services initialize.

---

## ☸️ Kubernetes (K8s)

VASTA Bank is fully **Kubernetes-ready** for production-grade deployment.

```
k8s/
├── namespaces/
│   └── vasta-bank-ns.yaml
├── deployments/
│   ├── auth-deployment.yaml
│   ├── user-deployment.yaml
│   ├── account-deployment.yaml
│   ├── transaction-deployment.yaml
│   ├── loan-deployment.yaml
│   ├── notification-deployment.yaml
│   ├── payment-deployment.yaml
│   ├── admin-deployment.yaml
│   └── gateway-deployment.yaml
├── services/
│   └── (ClusterIP / LoadBalancer per service)
├── hpa/
│   └── (HorizontalPodAutoscaler per service)
├── configmaps/
│   └── (environment configs)
├── secrets/
│   └── (DB credentials, JWT keys, Razorpay keys)
└── monitoring/
    ├── prometheus-deployment.yaml
    └── grafana-deployment.yaml
```

**K8s Features:**
- ☸️ **HPA (Horizontal Pod Autoscaler)** — services auto-scale under load
- 🔄 **Rolling Deployments** — zero-downtime updates
- 🏥 **Liveness & Readiness Probes** — automatic restart of unhealthy pods
- 🔒 **Secrets management** — credentials never in plain config
- 📡 **Service mesh ready** — clean service-to-service communication
- 📊 **Prometheus + Grafana** deployed in-cluster for full observability

```bash
# Deploy to Kubernetes
kubectl apply -f k8s/

# Check status
kubectl get pods -n vasta-bank

# Scale a service manually
kubectl scale deployment transaction-service --replicas=3 -n vasta-bank
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Usage |
|---|---|---|
| Java | 17 | Core language |
| Spring Boot | 3.x | Microservice framework |
| Spring Security | 6.x | Auth & RBAC |
| Spring Cloud Gateway | Latest | API Gateway |
| Spring Cloud Eureka | Latest | Service Discovery |
| Spring Cloud OpenFeign | Latest | Sync inter-service calls |
| Apache Kafka | Latest | Event streaming |
| MySQL | 8.x | Primary database |
| Redis | 7.x | Caching & token store |
| Razorpay Java SDK | Latest | Payment gateway |

### Frontend
| Technology | Usage |
|---|---|
| React | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| Axios | HTTP client |
| React Router | Client-side routing |
| Context API | Global state management |

### DevOps & Infrastructure
| Technology | Usage |
|---|---|
| Docker | Service containerization |
| Docker Compose | Local orchestration |
| Kubernetes | Production orchestration |
| Helm (optional) | K8s package management |
| Prometheus | Metrics collection |
| Grafana | Visualization & alerting |
| Spring Boot Actuator | Metrics endpoint exposure |

---

## 🚀 Quick Start

### Prerequisites

```
✅ Docker & Docker Compose
✅ Git
✅ (Optional) kubectl + K8s cluster for K8s deployment
```

### Run with Docker Compose

```bash
git clone https://github.com/Akash-Adak/VASTA-Bank.git
cd VASTA-Bank
docker-compose up -d
```

### Run on Kubernetes

```bash
# Apply all manifests
kubectl apply -f k8s/

# Watch pods come up
kubectl get pods -n vasta-bank --watch
```

---

## 🌐 Service Access URLs

| Service | URL | Description |
|---|---|---|
| **Frontend** | http://localhost:5173 | React + Vite app |
| **API Gateway** | http://localhost:8080 | Single entry point |
| **Auth Service** | http://localhost:8081 | Auth endpoints |
| **User Service** | http://localhost:8082 | User/KYC endpoints |
| **Account Service** | http://localhost:8083 | Account management |
| **Transaction Service** | http://localhost:8084 | Fund transfers |
| **Notification Service** | http://localhost:8085 | Alert management |
| **Loan Service** | http://localhost:8086 | Loan lifecycle |
| **Admin Service** | http://localhost:8087 | Admin dashboard |
| **Payment Service** | http://localhost:8088 | Razorpay integration |
| **Eureka Dashboard** | http://localhost:8761 | Service registry |
| **Grafana** | http://localhost:3000 | Monitoring dashboards |
| **Prometheus** | http://localhost:9090 | Metrics explorer |

---

## 🧪 Testing & Reliability

- ✅ **Unit Tests** — Business logic per service (JUnit 5 + Mockito)
- ✅ **Integration Tests** — Service-to-service flow validation
- ✅ **Pessimistic Locking** — Prevents race conditions in concurrent transfers
- ✅ **Database Transactions** — ACID compliance for all money operations
- ✅ **Kafka Dead-Letter Queues** — Failed events are captured and retried
- ✅ **Health Checks** — Actuator endpoints for all services
- ✅ **Circuit Breaker Ready** — Architecture supports Resilience4j integration

---

## 👨‍💻 What This Project Proves

| Skill Domain | Demonstrated By |
|---|---|
| **Backend Engineering** | 9 Spring Boot microservices with clean service boundaries |
| **Distributed Systems** | Kafka, Eureka, Feign, Redis across services |
| **Security** | RS256 JWT, RBAC, Redis sessions, OTP, BCrypt |
| **Payment Systems** | Real Razorpay integration with signature verification |
| **Event-Driven Design** | Kafka producers/consumers with DLQ and retry |
| **DevOps** | Docker, Docker Compose, full K8s manifests with HPA |
| **Observability** | Prometheus metrics + Grafana dashboards |
| **Frontend** | React + Vite + Tailwind with role-based UI |
| **System Design** | End-to-end ownership — infra, backend, frontend |

---

## 🤝 Contributing & Feedback

Contributions, suggestions, and reviews are welcome.

If you are an **interviewer, reviewer, or recruiter** — feel free to explore the codebase deeply. Every architectural decision is intentional and documented.

```bash
# Raise an issue
https://github.com/Akash-Adak/VASTA-Bank/issues

# Submit a PR
Fork → Branch → Commit → Pull Request
```

---

## 📄 License

```
MIT License — free to use, modify, and distribute with attribution.
```

---

<div align="center">

**Built with precision. Designed for scale. Ready for production.**

*VASTA Bank — Enterprise Digital Banking, End to End.*

</div>