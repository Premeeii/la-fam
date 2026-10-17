## Code Organization

### Backnend(Java Spring Boot)
Spring Boot Layers Architecture is main design of this directory, its be Separation of Concerns
for scalability and maintainability.

```bash
backend/lafam/src/main/java/premeees/lafam/
├── Controller/         # HTTP Rest API Endpoints (I/O DTO Only)
├── Service/            # Business Logic & Transaction Management
├── Repository/         # Spring Data JPA Data Access Layer
├── Entity/             # JPA Database Entities
├── dto/
│   ├── request/        # Request Payloads
│   └── response/       # Response Payloads
├── security/           # JWT, SecurityConfig, Rate Limiting, Turnstile
├── exception/          # GlobalExceptionHandler & Custom Exceptions
└── config/             # CORS, S3/R2 Client, App Configs
```

### Unit and Integration Testing
```bash
backend/lafam/src/main/test/java/premeees
├── integration/        # Integration tests
├── lafam               
│   ├── Controller      # Unit test
└── security  
```

### Frontend(Next.js)

```bash
frontend/lafam-web/src/
├── app/                # Next.js App Router (Layouts & Pages)
├── components/         # Reusable UI Components (Saperate modules such as calendar/, layout/)
├── lib/
│   ├── api/            # Axios API wrappers (Connect Backend)
│   ├── hooks/          # TanStack Query Custom Hooks
│   ├── schemas/        # Zod Validation Schemas
│   └── stores/         # Zustand Client State Stores
└── types/              # OpenAPI Type Definitions
```

## Design and Implement

### Constructor Dependency Injection
  Shoudn't use `@Autowired` for avoid Null Pointer, should use Dependency Injection.
  ```java
  public class EventController {
      private final EventService eventService;
      public EventController(EventService eventService) {
          this.eventService = eventService;
      }
  }
  ```

### Declarative Transactions
  In Service Layer if that service has interact with database should identify Annotation to service as `@Transactional`
  or GET method should identify `@Transcation(readOnly = true)`

### Tenant Isolation
Saperate groups of feature (Bills, Events, Member) should check authorize privilege  in service before send query.
  ```java
  groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId())
      .orElseThrow(() -> new IllegalArgumentException("You are not a member of this group"));
  ```

### Stateless Authentication with Double-Cookies
- Access Token(15 minutes) + Refresh Token(7 Days)
- Doesn't set Token on localStorage, should set on HttpOnly

### Form Management & Validation
  Management by React Hook Form and Zod Schema Resolver for validate form to same as DTO
  ```typescript
  const form = useForm<EventFormValues>({ 
      resolver: zodResolver(eventSchema), //schema for validation
      defaultValues: { //default values when open form
        title: '',
        description: '',
        startDate: defaultStartDate,
        endDate: defaultEndDate,
        color: '#3b82f6',
    },
  });
  ```

## Code Quality 
  - Check syntax and type through ESLint by `npm run lint` and compile with `npm run build`.
  - Before run spring boot `mvn spring-boot:run`, should run unit test and intregration test `./mvnw clean test` berfore run or commit.
  - Don't indentify Environment Hard Coding in Production, should identify `.env` to define.
  - Before merge branch to main should wait CI to Analyze Pull Request such as CodeQL to analyze security or ESLint.

## Related Documnetation
- [Database Migration](database-migration.md)
- [Error Handling](error-handling.md)

