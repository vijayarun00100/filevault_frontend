# FileVault Frontend - React Cloud Storage Interface

<div align="center">

![FileVault Frontend](https://img.shields.io/badge/FileVault-Frontend-blue?style=for-the-badge&logo=react&logoColor=white)

**Modern React frontend for the FileVault cloud storage platform**

[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Apollo GraphQL](https://img.shields.io/badge/Apollo%20GraphQL-311C87?style=flat&logo=apollo-graphql&logoColor=white)](https://www.apollographql.com/)
[![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat&logo=graphql&logoColor=white)](https://graphql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=json-web-tokens&logoColor=white)](https://jwt.io/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![React Router](https://img.shields.io/badge/React%20Router-CA4245?style=flat&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![React Icons](https://img.shields.io/badge/React%20Icons-61DAFB?style=flat&logo=react&logoColor=black)](https://react-icons.github.io/react-icons/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://docker.com/)

[Live Demo](https://filevault-frontend.vercel.app/) [ Password for Admin portal in the UI = Admin ] • [Backend Repository](https://github.com/vijayarun00100/filevault)

</div>

---

## Features

### Beautiful User Interface
- **Modern Design** - Glassmorphism effects with gradient backgrounds
- **Responsive Layout** - Optimized for desktop, tablet, and mobile
- **Interactive Elements** - Smooth animations and hover effects
- **Dark Theme** - Elegant dark interface with purple/blue gradients
- **Custom Icons** - React Icons integration for consistent visual language

### Authentication System
- **User Registration** - Create new accounts with email validation
- **Secure Login** - JWT-based authentication with persistent sessions
- **Protected Routes** - Automatic redirection for unauthenticated users
- **User Profile** - Display user name and email in interface
- **Session Management** - Automatic token handling and refresh

### File Management
- **Drag & Drop Upload** - Intuitive file upload with visual feedback
- **Multi-file Support** - Upload multiple files simultaneously
- **Progress Tracking** - Real-time upload progress indicators
- **File Preview** - Visual file type recognition with custom icons
- **Search & Filter** - Find files quickly with built-in search functionality
- **File Actions** - Download, share, and delete operations

### Admin Panel
- **Password Protection** - Secure admin access with password prompt
- **User Management** - View all registered users and their details
- **File Oversight** - Monitor all uploaded files with uploader information
- **Storage Analytics** - Track system-wide storage usage and statistics
- **Responsive Design** - Admin interface optimized for all devices

### User Experience
- **Toast Notifications** - Real-time feedback with React Toastify
- **Loading States** - Elegant loading animations and spinners
- **Error Handling** - Comprehensive error messages and recovery
- **Keyboard Navigation** - Full keyboard accessibility support
- **Performance Optimized** - Lazy loading and efficient rendering

---

## Tech Stack

### **Core Technologies**
- **[React 18](https://reactjs.org/)** - Modern UI library with hooks and concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript for better development experience
- **[Create React App](https://create-react-app.dev/)** - Zero-configuration React setup with modern tooling

### **GraphQL & API**
- **[Apollo Client](https://www.apollographql.com/docs/react/)** - Comprehensive GraphQL client with caching
- **[GraphQL Code Generator](https://www.graphql-code-generator.com/)** - Type-safe GraphQL operations
- **[Apollo Link](https://www.apollographql.com/docs/react/api/link/introduction/)** - Modular GraphQL networking

### **Styling & UI**
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[React Icons](https://react-icons.github.io/react-icons/)** - Popular icon library with 10k+ icons
- **[React Toastify](https://fkhadra.github.io/react-toastify/)** - Beautiful toast notifications
- **Custom CSS** - Glassmorphism effects and gradient backgrounds

### **Routing & Navigation**
- **[React Router](https://reactrouter.com/)** - Declarative routing for React applications
- **Protected Routes** - Authentication-based route protection
- **Dynamic Navigation** - Context-aware navigation components

---

## Quick Start

### Prerequisites
```bash
Node.js 18+ and npm
Git
Docker (optional, for containerized deployment)
```

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/filevault-frontend.git
cd filevault-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your backend GraphQL endpoint

# Start development server
npm start
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Backend GraphQL endpoint
REACT_APP_GRAPHQL_ENDPOINT=https://your-backend.onrender.com/query

# Optional: Enable development features
REACT_APP_DEV_MODE=true
```

---

## Component Architecture

### **Main Components**
- **`App.tsx`** - Root component with routing and global providers
- **`home/main.tsx`** - Main dashboard with file management
- **`login/`** - Authentication components (login, register)
- **`components/AdminPanel.tsx`** - Administrative interface

### **Key Features**
- **Apollo Provider** - GraphQL client configuration and caching
- **Authentication Context** - Global user state management
- **Protected Routes** - Route-level authentication guards
- **Error Boundaries** - Graceful error handling and recovery

---

## Design System

### **Color Palette**
- **Primary**: Purple to Blue gradients (`from-purple-500 to-blue-600`)
- **Background**: Light gradients (`from-blue-50 via-white to-purple-50`)
- **Glass Effects**: Semi-transparent whites with backdrop blur
- **Accents**: Green for success, Red for errors, Blue for info

### **Typography**
- **Headings**: Inter font family with semibold weights
- **Body**: System font stack for optimal readability
- **Code**: Monospace fonts for technical content

### **Spacing & Layout**
- **Grid System**: CSS Grid and Flexbox for responsive layouts
- **Spacing Scale**: Tailwind's consistent spacing system
- **Breakpoints**: Mobile-first responsive design approach

---

## File Upload Specifications

### Storage Limits
- **Maximum file size**: 10MB per file
- **Storage provider**: Supabase Storage
- **Enforcement**: Server-side validation before upload

### MIME Type Verification
- **Validation method**: Supabase built-in MIME type checking
- **Allowed file types**: 
  - Documents: PDF, DOC, DOCX, TXT
  - Images: JPG, JPEG, PNG, GIF, WEBP
  - Archives: ZIP, RAR
  - Other formats as configured in Supabase
- **Security**: Files are validated both client-side and server-side
- **Rejection**: Invalid file types are automatically rejected during upload

---

## GraphQL Schema

### Queries
```graphql
type Query {
  users: [User!]!
  userFiles(userID: ID!): [File!]!
  allFiles: [File!]!
  downloadFile(fileID: ID!): File!
  userStorageInfo(userID: ID!): StorageInfo!
}
```

### Mutations
```graphql
type Mutation {
  createUser(name: String!, email: String!, password: String!): User!
  login(email: String!, password: String!): AuthPayload!
  uploadFile(userID: ID!, file: Upload!): File!
  deleteFile(fileID: ID!): Boolean!
}
```

---

## Docker Setup

### Frontend Container Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   PostgreSQL    │
│   (React+Nginx) │◄──►│   (Go+GraphQL)  │◄──►│   Database      │
│   Port: 3000    │    │   Port: 8080    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Supabase      │
                       │   File Storage  │
                       └─────────────────┘
```

### Docker Build & Run

```bash
# Create Dockerfile in frontend directory
cat > Dockerfile << EOF
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app to nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx config (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
EOF

# Build the Docker image
docker build -t filevault-frontend .

# Run the container
docker run -p 3000:80 filevault-frontend
```

### Docker Compose Integration

```yaml
# docker-compose.yml (in root directory)
version: '3.8'

services:
  frontend:
    build: ./filevault_frontend
    ports:
      - "3000:80"
    environment:
      - REACT_APP_GRAPHQL_ENDPOINT=http://backend:8080/query
    depends_on:
      - backend

  backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - JWT_CODE=${JWT_CODE}
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=filevault
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Quick Docker Commands

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs frontend

# Stop services
docker-compose down

# Rebuild frontend only
docker-compose build frontend
docker-compose up -d frontend
```

---

## Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set `REACT_APP_GRAPHQL_ENDPOINT` environment variable
3. Deploy with automatic builds on push

### Render Deployment
1. **Create Web Service**: Connect your GitHub repository to Render
2. **Build Settings**:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`
   - Node Version: `18.x`
3. **Environment Variables**:
   ```
   REACT_APP_GRAPHQL_ENDPOINT=https://your-backend.onrender.com/query
   ```
4. **Auto-Deploy**: Enable automatic deploys from your main branch
5. **Custom Domain**: Configure custom domain if needed

### Docker Production Deployment
1. Build production image: `docker build -t filevault-frontend:prod .`
2. Run with environment variables for your backend
3. Use reverse proxy (nginx) for SSL and domain routing
