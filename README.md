# Greppmästerskapen Scoreboard

## Overview

Greppmästerskapen Scoreboard is a web application for managing and tracking bouldering competitions. It allows climbers to register, join competitions, select their grade, and log their problem attempts. Organizers can create competitions and manage problems for each grade. The application provides a user-friendly interface for climbers to view and update their attempts, and for admins to oversee competition progress.

The project consists of two main parts:

- **Frontend:** A React + TypeScript app using Vite, Tailwind CSS, shadcn-ui, and Radix UI for the user interface.
- **Backend:** A FastAPI (Python) REST API for managing climbers, competitions, problems, and attempts, with a MySQL database.

## Features

- **Climber Registration & Login:** Climbers can register with a name, password, and select their climbing grade.
- **Competition Management:** Organizers can create new competitions and define problems for each grade.
- **Join Competitions:** Climbers can join competitions and are assigned problems based on their grade.
- **Problem Attempt Tracking:** Climbers can log the number of attempts, tops, and bonuses for each problem.
- **Profile Dashboard:** Climbers can view and update their attempts for each competition.
- **Responsive UI:** Modern, mobile-friendly design with dark mode support.

## Technologies Used

- **Frontend:**  
  - [React](https://react.dev/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Vite](https://vitejs.dev/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [shadcn-ui](https://ui.shadcn.com/)
  - [Radix UI](https://www.radix-ui.com/)
  - [Zustand](https://zustand-demo.pmnd.rs/) (state management)
  - [React Query](https://tanstack.com/query/latest) (data fetching)

- **Backend:**  
  - [FastAPI](https://fastapi.tiangolo.com/)
  - [SQLAlchemy](https://www.sqlalchemy.org/) (ORM)
  - [Alembic](https://alembic.sqlalchemy.org/) (migrations)
  - [MySQL](https://www.mysql.com/) (database)
  - [Pydantic](https://docs.pydantic.dev/) (data validation)

## Getting Started

### Prerequisites

- Node.js & npm
- Python 3.10+
- MySQL database

### Setup

#### 1. Clone the repository

```sh
git clone <YOUR_GIT_URL>
cd ClimbingApp
```

#### 2. Install frontend dependencies

```sh
cd boulder-beat-scoreboard
npm install
```

#### 3. Configure environment variables

- Copy `.env.example` to `.env` in both `boulder-beat-scoreboard/` and `ClimbAPI/` and fill in the required values (API URLs, tokens, database credentials).

#### 4. Set up the backend

```sh
cd ../ClimbAPI
pip install -r requirements.txt
# Set up the database (see Alembic migrations or run `init_db.py`)
```

#### 5. Run the backend server

```sh
uvicorn main:app --reload
```

#### 6. Run the frontend development server

```sh
cd ../boulder-beat-scoreboard
npm run dev
```

The app will be available at [http://localhost:8080](http://localhost:8080).

## Project Structure

```
boulder-beat-scoreboard/
  ├── src/
  │   ├── components/         # React components (Login, Registration, ProblemGrid, etc.)
  │   ├── hooks/              # API hooks for backend communication
  │   ├── pages/              # Route pages (Login, Profile, Registration, NotFound)
  │   ├── store/              # Zustand state management
  │   ├── types/              # TypeScript types
  │   └── index.css           # Tailwind and custom styles
  ├── tailwind.config.ts      # Tailwind theme config
  └── ...
ClimbAPI/
  ├── models/                 # SQLAlchemy models (Climber, Competition, Problem, etc.)
  ├── routes/                 # FastAPI route handlers
  ├── schemas/                # Pydantic schemas
  ├── migrations/             # Alembic migrations
  ├── main.py                 # FastAPI app entrypoint
  └── ...
```

## Usage

1. **Register as a climber**  
   Go to the registration page and create an account, selecting your preferred grade.

2. **Login**  
   Use your credentials to log in.

3. **Create a competition**
    If there isn't one available

4. **Join a competition**  
   After logging in, you can join available competitions and will be assigned problems for your grade.

5. **Log attempts**  
   On your profile page, update your attempts, tops, and bonuses for each problem.

6. **Save progress**  
   Click "Spara ändringar" to save your progress to the backend.
