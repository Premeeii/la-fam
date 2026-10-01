package premeees.lafam.security;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.concurrent.atomic.AtomicBoolean;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.util.ReflectionTestUtils;

class JwtAuthenticationFilterTest {

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void opaqueRefreshTokenDoesNotAuthenticateAProtectedRequest() throws Exception {
        JwtService jwtService = new JwtService();
        String secretKey = System.getenv().getOrDefault("JWT_SECRET", "dGVzdF9qd3Rfc2VjcmV0X2tleV9mb3JfdGVzdGluZ19wdXJwb3Nlc18zMmJ5dGVz");
        ReflectionTestUtils.setField(jwtService, "secretKey", secretKey);
        UserDetailsService userDetailsService = email -> {
            throw new AssertionError("Opaque refresh tokens must not reach user lookup");
        };
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtService, userDetailsService);

        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/users/me");
        request.addHeader("Authorization", "Bearer this-is-an-opaque-refresh-token-not-a-jwt");
        MockHttpServletResponse response = new MockHttpServletResponse();
        AtomicBoolean filterChainCalled = new AtomicBoolean(false);

        filter.doFilter(request, response, (servletRequest, servletResponse) -> {
            filterChainCalled.set(true);
            assertNull(SecurityContextHolder.getContext().getAuthentication());
        });

        assertTrue(filterChainCalled.get());
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }
}
