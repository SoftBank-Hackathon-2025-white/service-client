# 🌊 Lambda the Sea

<div align="center">

**An Observability Platform That Visualizes Serverless Lambda Like a Transparent Sea**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Language / 言語:** [🇯🇵 日本語](README.md) | [🇰🇷 한국어](README.ko.md) | [🇺🇸 English](README.en.md)

</div>

---

## 📝 Project Overview

**Lambda the Sea** is an Observability platform that enables execution of various programming languages through an ECS-based Serverless model, providing Whitebox Execution through step-by-step execution flow visualization that Lambda didn't offer before.

### 🎯 Hackathon Theme

Our goal is to visualize the execution process, which has been opaque in traditional Serverless environments, "like a transparent sea," allowing developers to intuitively understand Lambda function behavior.

---

## ✨ Key Features

### 1. 🔍 Whitebox Execution

- Step-by-step execution flow visualization
- Real-time execution state monitoring
- Detailed logs and trace information

### 2. 🚀 Multi-Language Support

- ECS-based Serverless model
- Support for various programming languages
- Flexible execution environment

### 3. 📊 Project Management

- Project list and detailed information
- Execution history tracking
- Status-based filtering

### 4. 🎨 Intuitive UI/UX

- Modern and user-friendly interface
- Real-time metrics display
- Dark mode support

---

## 🛠️ Technology Stack

### Frontend

- **React 19** - Latest React framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Styled Components** - CSS-in-JS
- **React Router v7** - Routing

### State Management & Data Fetching

- **Zustand** - Lightweight state management
- **TanStack Query** - Server state management
- **Axios** - HTTP client
- **Immer** - Immutable state updates

### UI/UX

- **ECharts** - Data visualization
- **Framer Motion** - Smooth animations
- **Lucide React** - Icon library

### Development Tools

- **MSW (Mock Service Worker)** - API mocking
- **ESLint** - Code quality
- **Prettier** - Code formatting

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd service-client

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit the .env file to configure MSW on/off

# Start the development server
pnpm dev
```

### Environment Variables Configuration

You can configure the following settings in the `.env` file:

| Variable Name       | Description                                                                                | Default Value           |
| ------------------- | ------------------------------------------------------------------------------------------ | ----------------------- |
| `VITE_ENABLE_MSW`   | Whether to enable MSW mocking<br/>`true`: Use mock API<br/>`false`: Use actual backend API | `true`                  |
| `VITE_API_BASE_URL` | Base URL of the backend API<br/>(Used when MSW is disabled)                                | `http://localhost:8000` |

**Example: Disabling MSW to use the actual backend**

```env
VITE_ENABLE_MSW=false
VITE_API_BASE_URL=http://localhost:8000
```

### Access

Open your browser and navigate to `http://localhost:5173`.

---

## 📦 Project Structure

```
service-client/
├── src/
│   ├── api/               # API communication
│   │   ├── _client.ts    # Axios client
│   │   ├── execution.ts  # Execution related API
│   │   ├── monitoring.ts # Monitoring API
│   │   └── project.ts    # Project management API
│   ├── components/        # React components
│   │   ├── common/       # Common components
│   │   ├── pages/        # Page components
│   │   ├── pipeline/     # Pipeline execution steps
│   │   └── whiteboard/   # Data visualization
│   ├── constants/        # Constant definitions
│   ├── mocks/            # MSW mocks
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── theme/            # Theme configuration
├── public/               # Static files
└── index.html           # Entry point
```

---

## 🧪 Development Mode

### MSW (Mock Service Worker)

APIs are mocked with MSW to enable frontend development without a backend.

**Project Execution Simulation:**

- Real-time log streaming
- State transition visualization
- Metrics collection and monitoring

---

## 📱 Main Screens

### 1. Landing Page (`/`)

Displays project introduction and main features.

### 2. Project List (`/projects`)

- Display project list
- Status-based filtering
- Search functionality
- Create new project

### 3. Project Details (`/projects/:id`)

- Execution history
- Detailed metrics
- Log viewer
- Execution management

### 4. Whiteboard (`/whiteboard`)

- System metrics visualization
- Real-time monitoring
- Performance analysis

---

## 🎯 Future Expansion Plans

- [ ] More detailed execution flow analysis features
- [ ] Multi-region support
- [ ] Cost optimization suggestion features
- [ ] Team collaboration features

---

## 👥 Team

**Lambda the Sea Team**

- Software Engineer × 5 members

---

## 🙏 Acknowledgments

This project was developed for a hackathon.
We aim to make Serverless development more transparent and easier to understand.

---

<div align="center">

**Made with ❤️ and 🌊**

</div>
