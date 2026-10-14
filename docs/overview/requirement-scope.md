# Requirement & Scope
This document defines the scope and requirements of La Fam, including the functional capabilities, quality expectations, 
system constraints, and acceptance criteria.

## Scope
### In Scope
- ### Authentication & Identity Security
  - Register and Login by email and password.
  - Bot Protection and Brute-Force Attack by Cloudflare Turnstile on Auth Endpoints.
  - Authentication by Double-Cookie JWT Pattern (access token and refresh token).
  - Refresh token is work on background(Silent Token Refresh process through axios) when HTTP Status 401 happened.
  - Forgot & Reset Password and Email by Resend API and token going to link on account email.
  - Token Bucket Rate Limiting by Bucket4j limit rate request api split by IP Address and Action.
- ### User Profile & Data Management
  - Management user account such as display name, bio or avatar.
  - Upload Avatar and save on Cloudflare R2(S3-compatible Object Storage).
  - Export user account data such as event, receipt, personal data(on PDPA Standard).
  - Theme web application.
  - Account Deletion.
- ### Group Management (Multi-tenancy Workspaces)
  - Create, Setting and Delete(Soft Delete) Group.
  - Identify user roles (OWNER, MEMBER, USER).
  - Group Bookmark.
  - Invite Token & Link with preview invited page before invite group confirm.
  - Inspect member details such as bio or avatar.
  - Ownership Transfer to member in group.
- ### Shared Calendar & Events
  - Create appointment/Event with Title, Description, Start Date, End Date and Color Tag.
  - Support Local Timezone on ISO-8601 Standard.
  - Calendar Grid View on Monthly and Weekly style.
  - Edit and delete event by owner event or owner group only.
- ### Shared Bills & Finance Management
  - Record bills or expenses central group such as bill name, cost, date, owner, category.
  - Pagination and sort bills with record date and categories.
  - Calculate cost with BigDecimal(Avoid floating-point rounding errors).
  - Edit and delete bills by payer or owner group only.
### Oute of Scope
- Multi-Currency & FX Exchange system to exchange abroad curenncy(only THB).
- Push Notification or Mobile Notification
- Native Mobile Application
- Advanced Bill Splitting / OCR
- Third-Party Social Login
###  User Roles & Permissions
- ### System-Level Roles
| Roles              | Permissions                                           |  
| -----------------  | ----------------------------------------------------- |
| Guest / Anonymous  | Landing Page, Authentication Page, Invite Preview Page| 
| Authenticated User | Access web application features on main page          |                   

- ### Group Level Roles(Tenant Context)
| Function / Action | Group OWNER | Group MEMBER |
|---|:---:|:---:|
| View group Dashboard, Bills, and Calendar | ✓ | ✓ |
| Create a new expense bill | ✓ | ✓ |
| Edit / delete own bills | ✓ | ✓ |
| Edit / delete bills created by other members | ✓ | ✗ |
| Create calendar events | ✓ | ✓ |
| Edit / delete own calendar events | ✓ | ✓ |
| Edit / delete calendar events created by other members | ✗ (Creator only) | ✗ |
| Create and copy group invite links | ✓ | ✗ |
| Remove regular members (MEMBER) from the group | ✓ | ✗ |
| Transfer group ownership | ✓ | ✗ |
| Edit group name / information | ✓ | ✗ |
| Permanently delete the group | ✓ | ✗ |
| Leave the group voluntarily | ✗ (Must transfer ownership first) | ✓ |

## Funtional Requirements(FR)
- ### FR-01 Authentication & User Accounts
  - FR-011: User can register with email and password, subject to pass cloudflare turnstile verify.
  - FR-012: Password should encryption by BCrypt before record to database.
  - FR-013: User should authenticated for claim HttpOnly Token(access token, refresh token)
  - FR-014: User should requrest Reset or Change Password by Email Link with token
  - FR-015: User can logout for revoke and clear cookie from browser.
- ### FR-02 Profile & Storage
  - FR-021: User can update display name, bio.
  - FR-022: User can upload avatar image then file will save on Cloudflare R2
  - FR-023: User can download personal data account with JSON form (Data Export)
- ### FR-03 Group Management
  - FR-031: User can create group and being a OWNER group.
  - FR-032: User to be OWNER has authority to create invite token.
  - FR-033: User who has invite link can see preview invite page and group name before joined.
  - FR-034: Infomation in group should access limit only member in group.
- ### FR-04 Bills & Finance
  - FR-041: Member group can create or edit bill by identify amount, date, bill name, category and payer is who create bill.
  - FR-042: Support Pagination page 5 bills per page.
  - FR-043: Payer and Owner can edit and delete bill.
- ### FR-05 Calendar & Events
  - FR-051: Member group can create event or appointment by identify title, description(Optional), StartDate, EndDate and Tag Color.
  - FR-052: Calendar Grid should fetch follow start and end date event to show on grid.
  - FR-053: Only Owner event and Owner group should delete or edit event.

## Non-Functional Requirements(NFR)
- ### NFR-01 Security
  - NFR-011: Protection XSS to set token on HttpOnly, SameSite=Lax, Secure Cookie.
  - NFR-012: Protection CSRF and SQL Injection by Spring Data JPA Parameterized Queries.
  - NFR-013: Protection Brute Force & DDoS by Rate Limiting by Bucket4j and Cloudflare Turnstile.
  - NFR-014: Hind Stacktrace of HTTP Status 500 to don't leak to client.
- ### NFR-02 Performance & Scalability
  - NFR-021: Frontend should use TanStack Query for reduce redundant API on Client-side caching.
  - NFR-022: Backend is stateless design for easier to horizontal scaling.
- ### NFR-03 Reliability & Data Consistency
  - NFR-031: when change data on database should support ACID Transaction by @Transactional.
  - NFR-032: when need to modify database schema must modify by Flyway Versioned Migrations only.
- ### NFR-04: Usability & Accessibility
  - NFR-041: Design Responsive UI for support 375px(Mobile) to 1920px(Desktop).
  - NFR-042: Toast Feedback when action whether is success or fail.
- ### NFR-05: Privacy & Compliance
  - NFR-051: Follow PDPA Standard to user can download account data such as group, bills, event group and personal data, and can delete account.
## Constraints & Assuptions
### Constraints
- Backend: Java 21 and Spring Boot 3.3.x
- Frontend: Next.js 15(React 19, App Router. TypeScript)
- Database: PostgreSQL 16
- External Services Dependencies
    - Cloudflare Turnstile(Need secret key and Site key)
    - Cloudflare R2(Need S3 credentials and bucket name)
    - Resend(Need API Key to send Transactional Email)
### Assumptions
- User should have email to can send verify forgot-password or reset link.
- Member group should use same Timezone.
- Every request should process through HTTPS on Production.
  
