# API Design
This document defines the API design principles and conventions used by La Fam. It describes how the frontend communicates with the backend, how requests and responses are structured, API's La FAM Design follow RESTful API Architecture Statless.

## Hierarchical Resource Nesting
- `/api/groups/{groupId}/bills`: endpoint for bills in group.
- `/api/groups/{groupId}/events`: endpoint for events or appointment in group.
- `/api/groups/{groupId}/members`: endpoint for member in group.

## CORS Configuration
- Allowed Origin: Identify properties `${spring.cors.allowed-origins}` such as `http://localhost:3000` and domain production
- Allowed Credentials: Access browser to send and receive cookie cross domain.
- Exposed Headers: Set reveal `Set-Cookie` header for client.

## Request and Response Design
- ### DTO Pattern & Bean Validation
  Seperate Data Transfer Objects (DTO) from JPA Entity for protection Over-Posting Problem such as password
  - Request Validation use Jakarta Validation Annotations
    ```typescript
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;
    ```

## Connect API Backend and Frontend
- ### Axios Client Configuration
  Frontend identify central instance on axios
  `baseURl`: fetch api url from environment
  `withCredentials`: command browser to automation attract HttpOnly Cookie with every request.
  ```typescript
  export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  });
  ```

## Custom API Hooks
### Seperation of Concerns
  Keep API-related logic separate from presentation logic, separate fetch api file and import to query on hook.
  ### Identify function on api directory folder
  ```typescript
    export async function getGroupBills(groupId: string, page = 0, size = 5): Promise<PageResponse<BillResponse>> {
    const response = await apiClient.get(`/api/groups/${groupId}/bills`, {
        params: { page, size }
    });
    if (Array.isArray(response.data)) {
        return {
            content: response.data,
            totalPages: 1,
            totalElements: response.data.length,
            number: page,
            size: size
        };
    }
    return response.data;
}
  ```
  ### Import and use on custom api hook
  ```typescript
  export function useGroupBills(groupId: string, page = 0, size = 5) {
    return useQuery<PageResponse<BillResponse>>({
        queryKey: ['bills', groupId, page, size],
        queryFn: () => getGroupBills(groupId, page, size),
        enabled: !!groupId,
        staleTime: 0,
        refetchOnMount: 'always',
    });
  ```

## Query Caching
Frequently accessed data is cached using TanStack Query to avoid unnecessary API requests when previously fetched data can be reused. Cache behavior is configured according to the characteristics of each resource, including its update frequency and the application's freshness requirements.

## Refetching Frequently Updated Data
For resources that change frequently and require fresh data whenever a component mounts, La Fam uses the following TanStack Query configuration where appropriate:

```typescript
refetchOnMount: 'always'
```

This setting instructs TanStack Query to trigger a refetch whenever the query's component mounts, including when the cached data is still considered fresh.
