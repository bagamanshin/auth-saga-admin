# React Admin Panel

This is an admin panel boilerplate built with React, TypeScript, and a feature-sliced architecture.

## Technologies Used

- **Framework/Library:** React, TypeScript
- **Build Tool:** Vite
- **State Management:** Redux, Redux-Saga
- **Routing:** React-Router-Dom v5, Connected-React-Router
- **UI Library:** Ant Design v4
- **Authentication:** React-Auth-Kit v1.x
- **API Client:** Fetch API
- **Linting/Formatting:** ESLint + Prettier
- **Testing:** Jest, Redux-Saga-Test-Plan

## Architecture

The project follows the **Feature-Sliced Design (FSD)** methodology. The codebase is organized into the following layers:

- `/app`: Global settings, styles, providers, and store configuration.
- `/pages`: Application pages, each composed of widgets and features.
- `/widgets`: Composite UI components like the main layout, sidebar, etc.
- `/features`: Specific user-facing features (e.g., login form, post table).
- `/entities`: Business entities and their related logic (e.g., Post, User).
- `/shared`: Reusable code, utilities, and UI components used across the app.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1.  Clone the repository.
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

To start the development server, run:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Lints the codebase and automatically fixes issues.
- `npm run typecheck`: Runs the TypeScript compiler to check for type errors.
- `npm run test`: Runs the unit tests.
- `npm run preview`: Serves the production build locally.
