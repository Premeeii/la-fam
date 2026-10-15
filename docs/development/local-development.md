# Local Development

## Structure
  - `backend/lafam`: Java Spring Boot
  - `frontend/lafam-web`: Next.js
  - `docker-compose.yml`: PostgreSQL and pgAdmin for local database
  - `docs`: Requirement and Technical Documentation 

## Prerequisites
  - JDK 21
  - Maven 3.6+
  - Node.js 18.x+
  - npm
  - Docker

## Clone Repository
  ```bash
  git clone <https://github.com/Premeeii/la-fam.git>
  cd la-fam
  ```

## Environment Variables for Database
identify evironment on `docker-compose.yml`
  ```bash
  export POSTGRES_USER=
  export POSTGRES_PASSWORD=
  export POSTGRES_DB=
  export PGADMIN_DEFAULT_EMAIL=
  export PGADMIN_DEFAULT_PASSWORD=
  ```
create `.env` for store value for environment varaiables on root directory

## Start Docker Database Container
  ```bash
  docker compose up -d
  ```
PostgreSQL available on `localhost:5432`
pgAdmin available on `http://localhost:5050`

## Backend(Spring Boot)
  ```bash
  cd backend/lafam
  ```
  Compile maven to run application
  ```bash
  mvn clean install
  mvn spring-boot:run
  ```
  Spring Boot available on `http://localhost:8080`
  Swagger/OpenAPI available on `http://localhost:8080/swagger-ui/index.html`

  *Note:* Use the configuration values ​​from `application-example.properties` as a template for your local environment setup
  , and adjust the settings related to the database, JWT, and secrets to match your own local configuration.

  ### Testing
  ```bash
  ./mvnw clean test
  ```
  for integration and unit test case and provide backend working fine.

## Frontend(Next.js)
  ```bash
  cd frontend/lafam-web
  npm install
  npm run dev
  ```
  Next.js available on `http://localhost:3000`
  ### Testing
  ```bash
  npm run lint
  ```
  Checking code with ESLint for type, syntax or standard.
  ```bash
  npm run build
  ```
  Checking compile TypeScript and build to provide frontend working fine.
  
