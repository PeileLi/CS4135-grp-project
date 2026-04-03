# CS4135 group project
**online food order & delivery system**

This project implements a distributed online food order & delivery system designed to simulate real-world interactions between customers, restaurants, delivery driver, and payment services.

## Project Introduction

Online food delivery system typically involve multiple independent participants operating simultaneously. Payment providers, restaurant and delivery drivers function as separate systems rather than as a single tightly integrated application. Due to this inherent separation of responsibilities, the domain is particularly suitable for studying distributed architecture and asynchronous coordination between services.
The system aims to demonstrate modern distributed system principles, including microservice-based architecture, event-driven communication, and the Saga pattern for managing distributed transactions.

## Team Member
| # | Name | Student ID | Role | Description |
|:-:|:-----|:----------:|:-----|:------------|
| 1 | Peile Li | 22305319 | Project Manager | System Architecture / Database / Project Integration |
| 2 | Tianxing Fan | 20100035 | Frontend Dev  | UI / Interaction / Front-end Logic |
| 3 | Hongtao Zhu | 20282958 | Backend Dev | Backend Logic / Core Function Modules & Testing |

## Project Tech Stack
- **Frontend**: React + Vite
- **Backend**: Java21 + Spring Boot
- **Database**: PostgreSQL
- **Container**: Docker & Docker Compose
- **Event-driven**: RabbitMQ
- **Service Discovery**: Eureka Server

## Documentation

For detailed documentation on each component, please visit our [Project Wiki](https://github.com/PeileLi/CS4135-grp-project/wiki):
- [Frontend Documentation](https://github.com/PeileLi/CS4135-grp-project/wiki/Frontend-Doc) - React components, UI design, and frontend architecture
- [Backend Documentation](https://github.com/PeileLi/CS4135-grp-project/wiki/Backend-Doc) - API endpoints, service layer, and database schema

## Prerequisites

### For Docker (Option 1)
- [Docker](https://www.docker.com/get-started) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)

### For Local Development (Option 2)
- [Java 21](https://adoptium.net/) (JDK 21+)
- [Node.js](https://nodejs.org/) (20+ LTS version recommended)
- [npm](https://www.npmjs.com/)
- [Maven](https://maven.apache.org/)
- [PostgreSQL](https://www.postgresql.org/) (15+)
- [RabbitMQ](https://www.rabbitmq.com/) (3.x)

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/PeileLi/CS4135-grp-project.git
cd CS4135-grp-project
```

### 2. Configure Environment
```bash
cp .env.example .env
```
Edit `.env` to customize settings (database credentials, JWT secret, ports, etc.). The defaults work out of the box for local development.

### 3. Start the Application

#### **Option 1: Using Docker Compose (Recommended)**

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode (background)
docker-compose up --build -d
```

**Service URLs:**
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API Gateway | http://localhost:8080 |
| Eureka Dashboard | http://localhost:8761 |
| RabbitMQ Management | http://localhost:15672 |

**Useful Docker Commands:**
```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f api-gateway
docker-compose logs -f user-service
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Stop and remove volumes (clean restart)
docker-compose down -v

# Rebuild specific service
docker-compose up --build api-gateway
docker-compose up --build frontend
```

#### **Option 2: Run Separately (Local Development)**

**Prerequisites for local run:** Make sure PostgreSQL and RabbitMQ are running locally (or via Docker) before starting the backend services.

**Backend (Spring Boot Microservices)**

First, build all modules:
```bash
cd backend
mvn install -DskipTests
```

Then start each service in a separate terminal (start in order):
```bash
# Terminal 1 - Eureka Server (port 8761) — start first
mvn spring-boot:run -pl eureka-server

# Terminal 2 - API Gateway (port 8080)
mvn spring-boot:run -pl api-gateway

# Terminal 3 - User Service (port 8081)
mvn spring-boot:run -pl user-service

# Terminal 4 - Restaurant Service (port 8082)
mvn spring-boot:run -pl restaurant-service

# Terminal 5 - Order Service (port 8083)
mvn spring-boot:run -pl order-service

# Terminal 6 - Payment Service (port 8084)
mvn spring-boot:run -pl payment-service

# Terminal 7 - Delivery Service (port 8085)
mvn spring-boot:run -pl delivery-service

# Terminal 8 - Notification Service (port 8086)
mvn spring-boot:run -pl notification-service
```

| Service | Port | Description |
|---------|------|-------------|
| Eureka Server | 8761 | Service discovery |
| API Gateway | 8080 | Request routing |
| User Service | 8081 | Auth & user management |
| Restaurant Service | 8082 | Restaurant & menu management |
| Order Service | 8083 | Order, rating & discount |
| Payment Service | 8084 | Payment processing |
| Delivery Service | 8085 | Delivery & driver management |
| Notification Service | 8086 | Notification handling |

**Frontend (React + Vite)**
```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Other useful commands
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```
Frontend will be available at: http://localhost:5173

