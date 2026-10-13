# Error Handling

## Centralized Exception Handling

La FAM uses centralized exception handling in the backend using `@ControllerAdvice` and `@ExceptionHandler` annotations.

### Error HTTP Status Exception Response DTO
1. `timestamp`: datetime when the error occurred
2. `status`: HTTP status code
3. `error`: HTTP status message
4. `message`: error message
5. `path`: URL path

Example:
```json
{
    "timestamp": "2023-10-26T10:30:00.000+07:00",
    "status": 403,
    "error": "Forbidden",
    "message": "Access denied: You do not have permission to access this resource",
    "path": "/api/groups/1/bills"
}
```

## Logs
La FAM uses SLF4J and Logback for logging.
1. GlobalExceptionHandler: catch exception and log HTTP status code, message and stacktrace at ERROR level.
2. TurnstileService: verification fail error and network error with third-party service log at INFO WARN ERROR level
3. JwtAuthFilter: authentication error with token verify fail, token expired, token is null log at WARN level







