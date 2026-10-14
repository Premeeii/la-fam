### Query Caching

Frequently accessed data is cached using TanStack Query to avoid unnecessary API requests when previously fetched data can be reused. Cache behavior is configured according to the characteristics of each resource, including its update frequency and the application's freshness requirements.

### Refetching Frequently Updated Data

For resources that change frequently and require fresh data whenever a component mounts, La Fam uses the following TanStack Query configuration where appropriate:

```typescript
refetchOnMount: 'always'
```

This setting instructs TanStack Query to trigger a refetch whenever the query's component mounts, including when the cached data is still considered fresh.
