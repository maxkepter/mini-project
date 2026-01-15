# Mini Project - Exam Management System

A full-stack examination management application built with NestJS (backend) and Nuxt.js (frontend).

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Project Overview

This is a comprehensive exam management system that allows users to create, manage, and take exams. The system supports multiple user roles (Admin, Teacher, Student) with different permission levels and provides a complete workflow for examination management.

## Tech Stack

### Backend

- **Framework**: NestJS 11.0
- **Language**: TypeScript
- **Database**: MSSQL (Microsoft SQL Server)
- **ORM**: TypeORM
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Validation**: class-validator, class-transformer

### Frontend

- **Framework**: Nuxt.js 2.14
- **UI Framework**: Bootstrap Vue
- **HTTP Client**: Axios
- **CSS**: Bootstrap 5.3
- **Icons**: FontAwesome

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher
- **npm**: v8 or higher
- **MSSQL Server**: v2019 or higher (or use Azure SQL Database)
- **Git**: For version control

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mini-project
```

### 2. Backend Setup

```bash
cd backend/mini-project

# Install dependencies
npm install
```

### 3. Frontend Setup

```bash
cd ../../frontend

# Install dependencies
npm install
```

## Configuration

### Backend Configuration

1. **Create environment file**:
   Create a `.env` file in `backend/mini-project/` root directory with the following variables:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=1433
   DB_USERNAME=sa
   DB_PASSWORD=your_secure_password
   DB_DATABASE=exam_db

   # JWT Configuration
   JWT_SECRET=your_very_secure_jwt_secret_key_here
   JWT_EXPIRATION=3600

   # Application
   NODE_ENV=development
   PORT=3000
   ```

   **Important Notes**:

   - Replace `DB_PASSWORD` with your MSSQL Server password
   - Use a strong, random string for `JWT_SECRET`
   - Adjust `JWT_EXPIRATION` as needed (in seconds)

2. **Database Configuration**:
   - The database configuration is handled by TypeORM
   - Update `src/config/typeorm.config.ts` if you need custom settings

### Frontend Configuration

1. **Create environment file**:
   Create a `.env.local` file in `frontend/` root directory:

   ```env
   NUXT_ENV_API_URL=http://localhost:3000/api
   ```

## Running the Application

### Backend

```bash
cd backend/mini-project

# Development mode (with auto-reload on file changes)
npm run start:dev

# Debug mode (with debugger attached)
npm run start:debug

# Production mode (requires build first)
npm run build
npm run start:prod
```

The backend API will be available at `http://localhost:3000`
Swagger API docs will be available at `http://localhost:3000/api/docs`

### Frontend

```bash
cd frontend

# Development mode (with hot module replacement)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Generate static site
npm run generate
```

The frontend will be available at `http://localhost:3000` (Nuxt will automatically use the next available port if 3000 is taken)

### Running Both Services Concurrently

You can run both services simultaneously by using separate terminal windows:

**Terminal 1 - Backend**:

```bash
cd backend/mini-project
npm run start:dev
```

**Terminal 2 - Frontend**:

```bash
cd frontend
npm run dev
```

## Testing

### Backend Tests

```bash
cd backend/mini-project

# Run all unit tests
npm run test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:cov

# Run end-to-end tests
npm run test:e2e

# Debug tests (allows breakpoint debugging)
npm run test:debug
```

Test files are located in:

- Unit tests: `src/**/*.spec.ts`
- E2E tests: `test/`

## Project Structure

```
mini-project/
├── backend/
│   └── mini-project/
│       ├── src/
│       │   ├── modules/              # Feature modules
│       │   │   ├── auth/             # Authentication module
│       │   │   ├── exam/             # Exam management module
│       │   │   ├── question/         # Question management module
│       │   │   ├── student-exam/     # Student exam module
│       │   │   └── user/             # User management module
│       │   ├── domain/               # Core business logic
│       │   │   ├── entities/         # Database entities
│       │   │   ├── enum/             # Enumerations
│       │   │   └── repository/       # Custom repositories
│       │   ├── service/              # Shared services
│       │   │   ├── dto/              # Data Transfer Objects
│       │   │   └── mapper/           # Entity mappers
│       │   ├── utils/                # Utility functions
│       │   ├── config/               # Configuration files
│       │   ├── app.module.ts         # Root module
│       │   ├── app.service.ts        # Application service
│       │   ├── app.controller.ts     # Application controller
│       │   └── main.ts               # Application entry point
│       ├── test/                     # End-to-end tests
│       ├── dist/                     # Compiled output (auto-generated)
│       ├── node_modules/             # Dependencies (auto-generated)
│       ├── package.json              # Dependencies and scripts
│       ├── tsconfig.json             # TypeScript configuration
│       ├── tsconfig.build.json       # TypeScript build configuration
│       ├── nest-cli.json             # NestJS CLI configuration
│       ├── eslint.config.mjs          # ESLint configuration
│       └── README.md                 # Backend-specific README
├── frontend/
│   ├── pages/                        # Nuxt pages (routes)
│   │   ├── auth/                     # Authentication pages
│   │   ├── admin/                    # Admin dashboard
│   │   ├── exam/                     # Exam pages
│   │   └── profile/                  # User profile
│   ├── components/                   # Reusable Vue components
│   ├── layouts/                      # Layout templates
│   ├── middleware/                   # Nuxt middleware
│   ├── services/                     # API service clients
│   ├── store/                        # Vuex store modules
│   ├── utils/                        # Utility functions
│   ├── const/                        # Application constants
│   ├── assets/                       # Static assets (CSS, images)
│   ├── static/                       # Static files
│   ├── node_modules/                 # Dependencies (auto-generated)
│   ├── .nuxt/                        # Nuxt build output (auto-generated)
│   ├── package.json                  # Dependencies and scripts
│   ├── nuxt.config.js                # Nuxt configuration
│   └── jsconfig.json                 # JavaScript configuration
└── README.md                         # This file
```

## Features

### Authentication & Authorization

- User registration and login
- JWT-based token authentication
- Role-based access control (RBAC):
  - **Admin**: Full system access
  - **Teacher**: Can manage exams and questions
  - **Student**: Can take exams and view results
- Password hashing with bcrypt
- Token refresh mechanism

### User Management

- User registration with email verification
- User profile management
- Password change/reset functionality
- User list management (Admin only)
- Role assignment and modification

### Exam Management

- Create and edit exams
- Set exam duration and status
- View all exams with filtering
- Exam history tracking
- Exam analytics and statistics
- Bulk exam operations

### Question Management

- Create multiple-choice questions
- Add options with correct answer marking
- Edit and delete questions
- Question categorization
- Reusable question bank
- Question validation

### Student Exam Features

- Take exams with timer
- Submit individual answers
- Auto-save functionality
- View exam progress
- Submit exam for grading
- View results and score
- Review submitted answers
- Exam history and statistics

### Additional Features

- Real-time exam timer
- Answer validation
- Score calculation
- Comprehensive audit logging
- Error handling and validation
- Data persistence and recovery

## Available Scripts

### Backend

| Script                | Description                              |
| --------------------- | ---------------------------------------- |
| `npm run build`       | Compile TypeScript to JavaScript         |
| `npm run start`       | Start the application in production mode |
| `npm run start:dev`   | Start with hot reload (development)      |
| `npm run start:debug` | Start with debugging enabled             |
| `npm run start:prod`  | Start from production build              |
| `npm run lint`        | Run ESLint and fix issues                |
| `npm run format`      | Format code with Prettier                |
| `npm run seed`        | Seed database with initial data          |
| `npm run test`        | Run unit tests                           |
| `npm run test:watch`  | Run tests in watch mode                  |
| `npm run test:cov`    | Run tests with coverage                  |
| `npm run test:e2e`    | Run end-to-end tests                     |
| `npm run test:debug`  | Debug tests                              |

### Frontend

| Script             | Description                       |
| ------------------ | --------------------------------- |
| `npm run dev`      | Start development server with HMR |
| `npm run build`    | Build for production              |
| `npm run start`    | Start production server           |
| `npm run generate` | Generate static site              |

## API Documentation

Once the backend is running, you can view the complete API documentation:

```
http://localhost:3000/api/docs
```

This Swagger UI documentation provides:

- All available endpoints
- Request/response schemas
- Authentication requirements
- Parameter descriptions
- Try-it-out functionality

### Main API Endpoints

#### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

#### Users

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Exams

- `GET /api/exams` - Get all exams
- `GET /api/exams/:id` - Get exam details
- `POST /api/exams` - Create new exam
- `PUT /api/exams/:id` - Update exam
- `DELETE /api/exams/:id` - Delete exam

#### Questions

- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get question details
- `POST /api/questions` - Create new question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

#### Student Exams

- `GET /api/student-exams` - Get student's exams
- `POST /api/student-exams/:examId/start` - Start an exam
- `POST /api/student-exams/:examId/submit` - Submit exam
- `GET /api/student-exams/:examId/result` - Get exam result

## Database Setup

The application uses TypeORM with MSSQL. The database schema is automatically created when the application starts.

### Manual Database Setup (if needed)

1. Open SQL Server Management Studio (SSMS) or Azure Data Studio
2. Create a new database:
   ```sql
   CREATE DATABASE exam_db;
   ```
3. Start the backend application - TypeORM will auto-create all tables

### Database Entities

The system includes the following main entities:

- **User** - System users with roles
- **Exam** - Examination configurations
- **Question** - Exam questions
- **Option** - Multiple choice options for questions
- **StudentExam** - Student exam attempts
- **StudentExamAnswer** - Individual student answers
- **StudentExamQuestion** - Tracking student question progress
- **RefreshToken** - JWT refresh tokens for extended sessions

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Problem**: Port 3000 is already in use

**Solution**:

- Change the PORT in `.env` for backend
- Nuxt frontend will automatically use the next available port

#### 2. Database Connection Error

**Problem**: Cannot connect to MSSQL server

**Solution**:

- Verify MSSQL Server is running and accessible
- Check connection credentials in `.env`
- Ensure the database `exam_db` exists
- Verify firewall allows connection to MSSQL port (default: 1433)

#### 3. Module Not Found Errors

**Problem**: "Cannot find module" errors

**Solution**:

```bash
# Clear and reinstall dependencies
rm -r node_modules
npm install
```

#### 4. CORS Errors

**Problem**: Frontend cannot reach backend API

**Solution**:

- Verify backend is running on the configured URL
- Check `NUXT_ENV_API_URL` in frontend `.env.local`
- Ensure CORS is properly configured in backend

#### 5. Authentication Failed

**Problem**: Cannot login or JWT errors

**Solution**:

- Verify `JWT_SECRET` is set in backend `.env`
- Ensure tokens haven't expired
- Check browser console and backend logs for specific errors

#### 6. Node Modules Cache Issues

**Problem**: Strange build or runtime errors

**Solution**:

```bash
# Clear all caches
npm cache clean --force

# Reinstall with clean slate
rm -r node_modules package-lock.json
npm install
```

## Environment Variables Reference

### Backend (.env)

```env
# Database
DB_HOST=localhost              # MSSQL server hostname
DB_PORT=1433                   # MSSQL server port
DB_USERNAME=sa                 # MSSQL username
DB_PASSWORD=password           # MSSQL password
DB_DATABASE=exam_db            # Database name

# JWT
JWT_SECRET=super_secret_key    # Secret for JWT signing
JWT_EXPIRATION=3600            # Token expiry in seconds

# Application
NODE_ENV=development           # development|production
PORT=3000                      # Backend server port
```

### Frontend (.env.local)

```env
NUXT_ENV_API_URL=http://localhost:3000/api  # Backend API base URL
```

## Development Guidelines

- Follow the project structure for organizing new features
- Create modules for feature-related code
- Use DTOs for data validation
- Implement proper error handling
- Write tests for critical functionality
- Follow TypeScript and ESLint rules
- Use dependency injection for better testability

## Contributing

1. Create a new branch for your feature:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and ensure they follow project conventions

3. Commit your changes:

   ```bash
   git commit -am 'Add new feature: description'
   ```

4. Push to your branch:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Submit a pull request with a clear description of changes

## Performance Tips

- Use database indexing for frequently queried columns
- Implement pagination for large data sets
- Cache static data when appropriate
- Use lazy loading for frontend components
- Monitor database query performance
- Implement proper error boundaries

## Security Best Practices

- Never commit `.env` files to version control
- Use strong, random JWT secrets
- Implement rate limiting for API endpoints
- Validate all user inputs
- Use HTTPS in production
- Keep dependencies updated
- Use environment variables for sensitive data
- Implement proper CORS policies

## License

This project is licensed under the UNLICENSED license.

## Support

For issues or questions:

1. Check this README for common solutions
2. Review API documentation at `/api/docs`
3. Check backend logs for error details
4. Review frontend browser console for client-side errors
5. Create an issue in the project repository

---

**Last Updated**: January 15, 2026

**Version**: 1.0.0
