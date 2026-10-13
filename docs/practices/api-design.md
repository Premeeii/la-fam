## Principle
### Postel's Law states:

> Be conservative in what you send, and liberal in what you accept.

This principle encourages APIs to produce consistent, predictable responses while accepting reasonable variations in input when doing so is safe and unambiguous.

Being liberal in what the API accepts does not mean accepting arbitrary properties, silently ignoring mistakes, or weakening validation. A misspelled field such as member: {naem: "John"} is not useful input and should produce an error rather than being silently ignored.

### Hyrum's Law states:

> With a sufficient number of users of an API, every observable behaviour will be depended on by somebody.

This principle highlights that any observable API behavior may become an implicit contract, even if it was never intentionally designed or documented as one.

As La Fam evolves, frontend components, external consumers, automated tests, and other integrations may come to depend on API response structures, field values, ordering, default behaviors, error responses, and side effects.

Therefore, API changes must be evaluated not only for functional correctness but also for their potential impact on existing consumers and long-term maintainability.

## Data Privacy and Access Control

La Fam handles user-specific and group-specific data, some of which may contain sensitive or private information. Therefore, every API that accesses protected resources must enforce appropriate authentication and authorization checks.

Access control must ensure that users can access or modify only the resources they are authorized to use. For group-related resources, the backend must verify the requesting user's membership, role, or permissions as required by the resource's access policy.

Authorization must be enforced on the backend and must not rely solely on frontend route protection or client-provided identifiers. This helps prevent unauthorized access to resources belonging to other users or groups, including insecure direct object reference (IDOR) vulnerabilities.

## Client-Side Data Fetching and Caching

La Fam uses TanStack Query to manage server-state, cache API responses, and reduce unnecessary network requests. This approach improves application responsiveness and provides a consistent mechanism for fetching, updating, and synchronizing data between the client and backend.

### Query Caching

Frequently accessed data is cached using TanStack Query to avoid unnecessary API requests when previously fetched data can be reused. Cache behavior is configured according to the characteristics of each resource, including its update frequency and the application's freshness requirements.

### Refetching Frequently Updated Data

For resources that change frequently and require fresh data whenever a component mounts, La Fam uses the following TanStack Query configuration where appropriate:

```typescript
refetchOnMount: 'always'
```

This setting instructs TanStack Query to trigger a refetch whenever the query's component mounts, including when the cached data is still considered fresh.
