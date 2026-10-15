# Test Strategy

## Unit Testing
  **First Line of Defense** its testing to garuntee AuthController before spring boot start
  if testing fail its should alert when CI
  | **Test Method** | **Scenario / Conditions** | **Expected Results (Assertions)** |
| :--- | :--- | :--- |
| `loginSetsHttpOnlyRefreshAndAccessCookie...` | Turnstile verification succeeds (`true`), the rate limit is not exceeded (`true`), and the credentials are valid. | - The `Set-Cookie` header contains both access and refresh tokens with the `HttpOnly`, `Secure`, and `SameSite=Lax` attributes.<br>- `ObjectMapper` deserializes the response body into JSON, and `assertFalse` verifies that neither token is exposed in the JSON response body. |
| `turnStileFalseShouldNotBeAbleToLogin` | Turnstile verification fails (`false`). | - A `ResponseStatusException` is thrown.<br>- The response status is `403 FORBIDDEN`. |
| `rateLimitFalseShouldNotBeAbleToLogin` | The rate limit quota has been exceeded (`false`). | - A `RateLimitException` is thrown.<br>- The exception message is `"Too many login attempts. Please try again later."` |

## Database for Integration test
  Identify Test Containers Configuration for Integration test
  ```java
    @Bean
      @ServiceConnection
      PostgreSQLContainer<?> postgresContainer() {
          return new PostgreSQLContainer<>(DockerImageName.parse("postgres:16-alpine"))
                  .withDatabaseName("lafam_test_db")
                  .withUsername("test")
                  .withPassword("test");
      }
    }  
  ```

## Integration Test
### 1. End-to-End Authentication Lifecycle
- Test the complete authentication lifecycle: **Register → Login → Refresh Token Rotation → Logout**.
- Verify that registration and login succeed, token rotation issues a new token pair, and logout revokes the refresh token.
- Verify that subsequent attempts to use the revoked refresh token are rejected.

### 2. Database and Cryptographic Verification
- **BCrypt Password Hashing:** Verify that passwords are hashed using BCrypt before being stored in the `users` table and are never stored as plaintext (`assertNotEquals`).
- **SHA-256 Refresh Token Hashing:** Verify that refresh tokens are hashed using SHA-256 before being stored in the `refresh_tokens` table. The raw refresh token must not be stored in the database.
- **Token Revocation:** Verify that the corresponding record in the `refresh_tokens` table is updated to `is_revoked = true` after logout.

### 3. Refresh Token Replay Attack Prevention
- Verify that after a refresh token has been successfully rotated, reusing the original token is rejected.
- Assert that the API returns `400 Bad Request`, according to the current API contract.

### 4. Jakarta Bean Validation
- Use `@ParameterizedTest` to verify that invalid inputs, including malformed email addresses, names that are too short or too long, and empty passwords, are rejected.
- Assert that invalid requests return `400 Bad Request`.
- Verify that invalid requests do not create unintended records in the database.

### 5. Cookie Invalidation on Logout
- Verify that the server instructs the browser to clear both the `access_token` and `refresh_token` cookies upon logout.
- Assert that the corresponding `Set-Cookie` headers specify `Max-Age=0`.
