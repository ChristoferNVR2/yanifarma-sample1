# Yanifarma Sample1

A full-stack application with FastAPI backend, React + TypeScript frontend, and MySQL database, all containerized with Docker.

## Prerequisites

- Docker and Docker Compose installed
- Git

## Project Structure

```
yanifarma-sample1/
├── backend/              # FastAPI application
│   ├── app/             # Application modules
│   │   ├── app.py       # Main FastAPI app
│   │   ├── crud.py      # Database operations
│   │   ├── database.py  # Database configuration
│   │   ├── models.py    # SQLAlchemy models
│   │   └── schemas.py   # Pydantic schemas
│   ├── main.py          # Entry point
│   ├── Dockerfile       # Backend container config
│   └── pyproject.toml   # Python dependencies (uv)
├── frontend/            # React + TypeScript application
│   ├── src/            
│   │   ├── components/  # React components
│   │   ├── App.tsx      # Main app component
│   │   └── main.tsx     # Entry point
│   ├── Dockerfile       # Frontend container config
│   └── package.json     # Node dependencies
└── docker-compose.yml   # Docker orchestration
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ChristoferNVR2/yanifarma-sample1
cd yanifarma-sample1
```

### 2. Create the Docker Network

```bash
docker network create yanifarma-sample1
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
touch backend/.env
```

Add your database configuration to `backend/.env`:

```env
DB_NAME=test
DB_HOST=database
DB_PASSWORD=123456
DB_DIALECT=mysql+pymysql
DB_USER=root
```

### 4. Run the Application

From the root directory, build and start all services:

```bash
docker-compose up --build
```

For running in detached mode (background):

```bash
docker-compose up -d --build
```

The services will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation (Swagger)**: http://localhost:8000/docs
- **MySQL Database**: localhost:3306

### 5. View Logs

To view logs from all services:

```bash
docker-compose logs -f
```

To view logs from a specific service:

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

### 6. Stop the Application

To stop all containers:

```bash
docker-compose down
```

To stop and remove volumes (this will delete the database data):

```bash
docker-compose down -v
```

## Development

### Hot Reloading

The application uses volume mounts for hot-reloading during development:
- Backend: Changes to Python files will trigger automatic reload via uvicorn
- Frontend: Changes to React/TypeScript files will trigger Vite's HMR (Hot Module Replacement)

### Backend Development

The backend uses:
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: ORM for database operations
- **Pydantic**: Data validation using Python type annotations
- **uv**: Fast Python package installer and resolver
- **MySQL**: Database

Dependencies are managed through `pyproject.toml` and installed automatically via the Dockerfile.

### Frontend Development

The frontend uses:
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **npm**: Package manager

Dependencies are managed through `package.json` and installed automatically via the Dockerfile.

## Database

The MySQL database uses a named Docker volume (`mysql_data`) to persist data between container restarts. This ensures your data is not lost when containers are stopped or recreated.

The database is automatically initialized with the `test` database on first run.

## API Endpoints

Once the backend is running, you can explore the API at:
- Interactive API docs: http://localhost:8000/docs
- Alternative API docs: http://localhost:8000/redoc

## Troubleshooting

### Port Already in Use

If you get port conflict errors, make sure no other services are running on ports 3306, 5173, or 8000.

### Database Connection Issues

If the backend can't connect to the database:
1. Ensure the database service is healthy: `docker-compose ps`
2. Check the logs: `docker-compose logs database`
3. Verify the `.env` file in the backend directory has correct credentials

### Network Not Found

If you get a "network not found" error:
```bash
docker network create yanifarma-sample1
```

### Starting Fresh

To completely reset the application and database:
```bash
docker-compose down -v
docker-compose up --build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. See the LICENSE file for details.
