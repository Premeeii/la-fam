# La FAM Documentation
Welcome to the La FAM Documentation These docs for anyone wanting to interest 
about La FAM. Directory route to application and system documentation.

## Repository Structure

```text
la-fam/
├── backend/                  # Backend service (Spring Boot 3 + Java 21)
├── frontend/                 # Frontend web client (Next.js 15 App Router)
├── infra/                    # Reverse proxy & infrastructure configurations
├── performance/              # k6 performance and load testing scripts
├── docs/                     # Project architecture, practices, and guidelines
├── docker-compose.yml        # Local development container orchestration
├── docker-compose.prod.yml   # Production container orchestration
└── .github/                  # CI/CD workflows and automated pipelines
```

## Guides

### Overview
High-level Purpose, scope, features, and domain terminology for the La FAM platform
- [Application Overview](./overview/application-overview.md)
- [Requirement Scope](./overview/requirement-scope.md)
- [Scope and Feature](./overview/scope-and-feature.md)
- [Glossary](./overview/glossary.md)

### Codebase
Structural blueprints, data pipelines, and security mechanisms
- [System Structure](docs/codebase/system-structure.md)
- [Authentication Flow](./codebase/authentication-flow.md)
- [API Design](./codebase/api-designed.md)
- [Data Flow](./codebase/data-flow.md)
- [Configuration]()

### Practices
Conventions and development standards followed across the codebase
- [Coding Convention](./practices/coding-convention.md)
- [API Guidelines](./practices/api-guidelines.md)
- [Database Migration](./practices/database-migration.md)
- [Error Handling & Logging](./practices/error-handling.md)

### Development & Operations
- [Local Development](docs/development/local-development.md)
- [Testing Guide](docs/development/testing-guide.md)
- [Monitoring & Health](./operations/monitoring.md)

### Quality & Performance
Quality assurance protocols and performance verification
- [Testing Strategy](./quality/testing-strategy.md)
- [Performance Testing](./quality/performance-testing.md)

### Architecture Decision Records
Context and rationale behind major architectural and technical choices
- [Architecture Decisions](./adr/architecture-decision.md)
- [Technology Decisions](./adr/technology-decision.md)
