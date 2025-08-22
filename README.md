# NestJS Microservices Example (API Gateway & User Services)

This project demonstrates how to build a **microservices architecture** using **NestJS** with:

- **API Gateway** (handles REST API requests, communicates with microservices via Redis).
- **User Microservice** (manages users).

---

## 📂 Project Structure

```
microservices-nest-app/
│── gateway/ # API Gateway (REST + Swagger)
│── user/ # User Microservice
```

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd microservices-nest-app
```

### 2️⃣ Install Dependencies

For each service (api-gateway, user-service), install dependencies:

```bash
cd gateway && npm install
cd user && npm install
```

### 3️⃣ Start the Services

Run each service in a separate terminal:

```bash
# Terminal 1 - API Gateway
cd gateway
npm run start:dev

# Terminal 2 - User Service
cd user
npm run start:dev
```

### 📖 API Documentation (Swagger)

Swagger is enabled in the API Gateway.

Once the gateway is running, open:

```bash
http://localhost:3000/api
```

## 📌 API Endpoints

### 👤 User Endpoints

| Method | Endpoint          | Description       |
| ------ | ----------------- | ----------------- |
| POST   | `/users/register` | Create a new user |
| GET    | `/users`          | Get all users     |

## 🛠️ Tech Stack

- NestJS: Framework
- Swagger: API Documentation
