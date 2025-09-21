# 🗄️ FileVault Frontend - React Cloud Storage Interface

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

[🚀 Live Demo](https://your-app.vercel.app) • [🔗 Backend Repository](https://github.com/your-username/filevault)

</div>

---

## ✨ Features

### 🎨 **Beautiful User Interface**
- **Modern Design** - Glassmorphism effects with gradient backgrounds
- **Responsive Layout** - Optimized for desktop, tablet, and mobile
- **Interactive Elements** - Smooth animations and hover effects
- **Dark Theme** - Elegant dark interface with purple/blue gradients
- **Custom Icons** - React Icons integration for consistent visual language

### 🔐 **Authentication System**
- **User Registration** - Create new accounts with email validation
- **Secure Login** - JWT-based authentication with persistent sessions
- **Protected Routes** - Automatic redirection for unauthenticated users
- **User Profile** - Display user name and email in interface
- **Session Management** - Automatic token handling and refresh

### 📁 **File Management**
- **Drag & Drop Upload** - Intuitive file upload with visual feedback
- **Multi-file Support** - Upload multiple files simultaneously
- **Progress Tracking** - Real-time upload progress indicators
- **File Preview** - Visual file type recognition with custom icons
- **Search & Filter** - Find files quickly with built-in search functionality
- **File Actions** - Download, share, and delete operations

### 👑 **Admin Panel**
- **Password Protection** - Secure admin access with password prompt
- **User Management** - View all registered users and their details
- **File Oversight** - Monitor all uploaded files with uploader information
- **Storage Analytics** - Track system-wide storage usage and statistics
- **Responsive Design** - Admin interface optimized for all devices

### 🔔 **User Experience**
- **Toast Notifications** - Real-time feedback with React Toastify
- **Loading States** - Elegant loading animations and spinners
- **Error Handling** - Comprehensive error messages and recovery
- **Keyboard Navigation** - Full keyboard accessibility support
- **Performance Optimized** - Lazy loading and efficient rendering

---

## 🏗️ Tech Stack

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

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 18+ and npm
Git
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

## 📱 Component Architecture

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

## 🎨 Design System

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

## 🔧 Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
