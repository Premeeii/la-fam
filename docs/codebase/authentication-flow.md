# Authentication
Authentication's La FAM have 7 Layers of Protection still Network layer to Database layer

- **Layer 1:** CORS & Origin Whitelising
  Access only identify domain to able request and set cookie from Spring Boot.
- **Layer 2:** Cloudflare Turnstile
  Every authentication endpoint should set turnstile token and check on Cloudflare to provide Bot Verification
- **Layer 3:** Rate Limiting
  Token Bucket with Caffein In-Memory cache to limit request per IP Address to protect Brute-Force and DDOS
- **Layer 4:** Input Validation
  Checking input before send request to server for avoid increase load to server.
- **Layer 5:** BCrypt Hashing
  Password should not record as Plain text, but hashing with BCrypt and Salting for not access to read real password.
- **Layer 6:** Double HttpOnly Cookies + JWT
  - Protect XSS by Set-Cookie on HttpOnly for not access to Script read a token.
  - Protect CSRF by identify `SameSite="Lax"` for not access send token to another site.
  - Short-Lived access token
  - Refresh token should set only auth path for avoid Attack surface.
- **Layer 7:** Encrytion and Refresh token LifeCycle
  - Backend should not keep real refresh token, should keeo Opaque Refresh Token(Refresh token hashing with SHA-256)
  - If Refresh token has used, Old token should revoked and generate new token to protect Replay Attack.

## Request flow
  Content API requests pass through authentication and authorization proxy(middleware):
  1. Proxy looks for the credentials accepted by that API and attaches the matching identity to the request.
  2. Authorization proxy requires an identity where the route is private.
  Start with:
  - [`lafam-web/src/proxy.ts`](../../frontend/lafam-web/src/proxy.ts) for the authentication and authorization for each endpoint

## Authentication Sequence Flow Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Client as Frontend (Next.js)
    participant API as Backend (AuthController)
    participant Auth as AuthService / JwtService
    participant DB as Database (users, refresh_tokens)
    participant Filter as JwtAuthenticationFilter

    User->>Client: Email + Password + Turnstile token
    Client->>API: POST /api/auth/login {email, password, turnstileToken}
    API->>RateLimit: check
    API->>Turnstile: verify token
    API->>Auth: authenticate via AuthenticationManager
    Auth->>DB: query user by email
    DB-->>Auth: user + password hash
    Auth->>Auth: verify password (BCrypt)
    alt Credentials valid
        Auth->>Auth: generate access JWT (short-lived)
        Auth->>Auth: generate opaque refresh token (random)
        Auth->>DB: store hash(refreshToken), expiry, not revoked
        API-->>Client: Return AuthResponse and set authentication cookies
    else Credentials invalid
        API-->>Client: 401 Unauthorized
    end

    Note over Client,API: Subsequent requests include access_token cookie

    Client->>API: Request protected resource (cookie sent)
    API->>Filter: JwtAuthenticationFilter resolves token from cookie/header
    Filter->>Auth: validate JWT (JwtService)
    alt JWT valid
        Filter->>API: set SecurityContext -> API returns resource
    else JWT expired/invalid
        API-->>Client: 401
        Client->>API: POST /api/auth/refresh (axios interceptor)
        API->>DB: find refresh token by hash(cookie)
        DB-->>API: refresh token record
        alt refresh valid and not revoked
            API->>DB: mark existing refresh token revoked
            Auth->>Auth: create new access JWT + new opaque refresh token (rotate)
            DB->>Auth: store new refresh token hash
            API-->>Client: Return AuthResponse and set updated authentication cookies
            Client->>API: retry original request (now with new access_token cookie)
        else refresh invalid
            API-->>Client: 401 -> frontend redirects to /login
        end
    end

