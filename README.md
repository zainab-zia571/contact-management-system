# TouchBase — Contact Management System

A full-stack contact management application built with Spring Boot and React.js.

---

## Tech Stack

### Backend
- Java 21
- Spring Boot 3.5
- Spring Data JPA + Hibernate
- Spring Security + JWT Authentication
- SQL Server
- JUnit 5 + Mockito (61 unit tests)
- SonarQube + JaCoCo (80%+ coverage)
- Slf4J + Logback

### Frontend
- React.js (Vite)
- Framer Motion
- Axios
- React Router DOM
- Vitest + React Testing Library


---

## Features

- User registration (email or phone) and login
- JWT-based authentication — session cleared on browser close
- Change password
- Add, edit, delete, and view contacts
- Multiple emails and phone numbers per contact with labels
- Search and filter contacts by name
- Paginated contact list
- Filter views — Work, Personal, Home, Favourites, Recent
- Contact detail page with quick actions (email/call)
- Full input validation on frontend and backend
- Application logging with Logback
- Global exception handling

---

## Project Structure
contact-management-system/
├── backend/       # Spring Boot REST API
└── frontend/      # React.js application

---

## Setup Instructions

### Prerequisites
- Java 21+
- Maven 3.9+
- Node.js 20+
- SQL Server (Express)
- Docker (for SonarQube)

### Database Setup
1. Open SSMS and connect to `localhost\SQLEXPRESS`
2. Run the schema script in `backend/database/schema.sql`

### Backend Setup
```bash
cd backend
# update src/main/resources/application.properties with your DB credentials
.\mvnw clean install
.\mvnw spring-boot:run
```
Backend runs on `http://localhost:8080`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

### Running Tests

Backend:
```bash
cd backend
.\mvnw clean test
```



### SonarQube Analysis
```bash
# Backend
cd backend
.\mvnw sonar:sonar -Dsonar.login=YOUR_TOKEN

# Frontend
cd frontend
npm run sonar
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/change-password` | Change password |
| GET | `/api/users/me` | Get current user |
| GET | `/api/contacts` | Get all contacts (paginated) |
| GET | `/api/contacts/{id}` | Get contact by ID |
| POST | `/api/contacts` | Create contact |
| PUT | `/api/contacts/{id}` | Update contact |
| DELETE | `/api/contacts/{id}` | Delete contact |


---

## Test Coverage

| Layer | Tests | Coverage |
|-------|-------|----------|
| Backend Services | 27 tests | 97%+ |
| Backend Controllers | 20 tests | 93%+ |
| Backend Security | 18 tests | 80%+ |

