## Project Overview

The repository contains two projects: a Frontend (in the `frontend` folder) and a Backend (in the `backend` folder). Both are written in TypeScript.

The Backend is built using the Express.js framework, while the Frontend is a single-page application (SPA) developed with React (Vite) and styled using Tailwind CSS.

Some resources and services run in Docker containers. There are three Docker Compose files located in the root directory of the project:

- `docker-compose.yaml` – for local development (`dev` environment)  
- `docker-compose.prod.yaml` – for the production environment (not a real-world production setup; this was created to satisfy a requirement and to allow the project to run with a single command: `npm run start`)  
- `docker-compose.test.yaml` – for running automated tests (unit and integration tests)  

The project still has room for improvement.

---

## Running the Project

### Requirements

> ⚠️ This project has only been tested on macOS (Apple Silicon, M3 chip).

Before running the project locally, ensure you have the following installed:

- Docker  
- Node.js (version 20.x or higher)  
- npm  

Also ensure that:

- Docker Desktop (Docker daemon) is running  
- Your system can execute shell scripts (`.sh`, e.g., `sh example.sh`)  

---

### Production

> ⚠️ Make sure no Docker containers are currently running.

Run the following command from the project root directory:

- `npm run start`  
  *(No need to run `npm install`)*

After starting:

- Frontend: http://localhost:3001  
- Backend API: http://localhost:3000  

> Note: Hot reloading is not enabled in the production setup.

---

### Local Development

> ⚠️ Ensure no Docker containers are running.  
> If you previously ran `npm run start`, first run `npm run down`.

#### Setup

1. Navigate to the `backend` folder:
   - `npm install && cp .env.local .env` *(required)*

2. Navigate to the `frontend` folder:
   - `npm install && cp .env.local .env` *(required)*

3. Return to the project root directory:
   - `npm run up:dev`  
   - `npm run run-migration:dev`

#### Start Services

- Start the backend:
  - `npm run start:be-dev`  
  - API will run on: http://localhost:3000  
  - Keep this terminal open  

- In a new terminal, start the frontend:
  - `npm run start:fe-dev`  
  - App will run on: http://localhost:5173/  
  - Keep this terminal open  

#### Shutdown

To stop the development environment:

- `npm run down:dev`

---

## Running the Tests

End-to-end tests for the frontend (e.g., using Cypress) were planned but not implemented due to time constraints. Currently, only backend API tests are included.

> ⚠️ Ensure no other Docker containers are running before starting tests.

Run:

- `npm run up:test`  
- `npm run test`  