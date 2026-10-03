package premeees.lafam.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.concurrent.atomic.AtomicBoolean;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.util.ReflectionTestUtils;

import jakarta.servlet.http.Cookie;

class JwtAuthenticationFilterTest {

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void opaqueRefreshTokenDoesNotAuthenticateAProtectedRequest() throws Exception {
        JwtService jwtService = new JwtService();
        //test only verify opaque token
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

    //no token will continue filter chain without authentication
    @Test
    void noTokenShouldContinueFilterChainWithoutAuthentication() throws Exception {
        JwtService jwtService = new JwtService();
        String secretKey = System.getenv().getOrDefault("JWT_SECRET", "dGVzdF9qd3Rfc2VjcmV0X2tleV9mb3JfdGVzdGluZ19wdXJwb3Nlc18zMmJ5dGVz");
        ReflectionTestUtils.setField(jwtService, "secretKey", secretKey);
        ReflectionTestUtils.setField(jwtService, "accessTokenExpiration", 3600000L);
        UserDetailsService userDetailsService = email -> {
            throw new AssertionError("Should not reach user lookup when no token is present");
        };
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtService, userDetailsService);

        //request with no cookie and no Authorization header
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/users/me");
        MockHttpServletResponse response = new MockHttpServletResponse();
        AtomicBoolean filterChainCalled = new AtomicBoolean(false);

        filter.doFilter(request, response, (servletRequest, servletResponse) -> {
            filterChainCalled.set(true);
            assertNull(SecurityContextHolder.getContext().getAuthentication());
        });

        assertTrue(filterChainCalled.get());
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    //valid JWT in cookie will authenticate successfully
    @Test
    void validJwtInCookieShouldAuthenticate() throws Exception {
        JwtService jwtService = new JwtService();
        String secretKey = System.getenv().getOrDefault("JWT_SECRET", "dGVzdF9qd3Rfc2VjcmV0X2tleV9mb3JfdGVzdGluZ19wdXJwb3Nlc18zMmJ5dGVz");
        ReflectionTestUtils.setField(jwtService, "secretKey", secretKey);
        ReflectionTestUtils.setField(jwtService, "accessTokenExpiration", 3600000L);

        UserDetails userDetails = User.withUsername("cookie-auth@example.com")
                .password("password")
                .roles("USER")
                .build();

        String validJwt = jwtService.generateAccessToken(userDetails);

        UserDetailsService userDetailsService = email -> {
            assertEquals("cookie-auth@example.com", email);
            return userDetails;
        };
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtService, userDetailsService);

        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/users/me");
        request.setCookies(new Cookie("access_token", validJwt));
        MockHttpServletResponse response = new MockHttpServletResponse();
        AtomicBoolean filterChainCalled = new AtomicBoolean(false);

        filter.doFilter(request, response, (servletRequest, servletResponse) -> {
            filterChainCalled.set(true);
            assertNotNull(SecurityContextHolder.getContext().getAuthentication());
            assertEquals("cookie-auth@example.com",
                    SecurityContextHolder.getContext().getAuthentication().getName());
        });

        assertTrue(filterChainCalled.get());
        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
    }

    //expired JWT will not authenticate successfully
    @Test
    void expiredJwtShouldNotAuthenticate() throws Exception {
        JwtService jwtService = new JwtService();
        String secretKey = System.getenv().getOrDefault("JWT_SECRET", "dGVzdF9qd3Rfc2VjcmV0X2tleV9mb3JfdGVzdGluZ19wdXJwb3Nlc18zMmJ5dGVz");
        ReflectionTestUtils.setField(jwtService, "secretKey", secretKey);
        ReflectionTestUtils.setField(jwtService, "accessTokenExpiration", 1L); // 1ms → expires immediately

        UserDetails userDetails = User.withUsername("expired@example.com")
                .password("password")
                .roles("USER")
                .build();

        String expiredJwt = jwtService.generateAccessToken(userDetails);
        Thread.sleep(10); //ensure token is expired

        UserDetailsService userDetailsService = email -> {
            throw new AssertionError("Expired JWT should not reach user lookup");
        };
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtService, userDetailsService);

        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/users/me");
        request.setCookies(new Cookie("access_token", expiredJwt));
        MockHttpServletResponse response = new MockHttpServletResponse();
        AtomicBoolean filterChainCalled = new AtomicBoolean(false);

        //it should not authenticate because the token is expired
        filter.doFilter(request, response, (servletRequest, servletResponse) -> {
            filterChainCalled.set(true);
            assertNull(SecurityContextHolder.getContext().getAuthentication());
        });

        //make sure filter chain was called and no authentication was set
        assertTrue(filterChainCalled.get());
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    //cookie should take priority over Authorization header
    @Test
    void cookieShouldTakePriorityOverAuthorizationHeader() throws Exception {
        JwtService jwtService = new JwtService();
        String secretKey = System.getenv().getOrDefault("JWT_SECRET", "dGVzdF9qd3Rfc2VjcmV0X2tleV9mb3JfdGVzdGluZ19wdXJwb3Nlc18zMmJ5dGVz");
        ReflectionTestUtils.setField(jwtService, "secretKey", secretKey);
        ReflectionTestUtils.setField(jwtService, "accessTokenExpiration", 3600000L);

        UserDetails cookieUser = User.withUsername("cookie-user@example.com")
                .password("password")
                .roles("USER")
                .build();

        UserDetails headerUser = User.withUsername("header-user@example.com")
                .password("password")
                .roles("USER")
                .build();

        String cookieJwt = jwtService.generateAccessToken(cookieUser);
        String headerJwt = jwtService.generateAccessToken(headerUser);

        UserDetailsService userDetailsService = email -> {
            // should only be called with the cookie user's email
            assertEquals("cookie-user@example.com", email);
            return cookieUser;
        };
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtService, userDetailsService);

        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/users/me");
        request.setCookies(new Cookie("access_token", cookieJwt));
        request.addHeader("Authorization", "Bearer " + headerJwt);
        MockHttpServletResponse response = new MockHttpServletResponse();
        AtomicBoolean filterChainCalled = new AtomicBoolean(false);

        filter.doFilter(request, response, (servletRequest, servletResponse) -> {
            filterChainCalled.set(true);
            assertNotNull(SecurityContextHolder.getContext().getAuthentication());
            assertEquals("cookie-user@example.com",
                    SecurityContextHolder.getContext().getAuthentication().getName());
        });

        assertTrue(filterChainCalled.get());
        assertEquals("cookie-user@example.com",
                SecurityContextHolder.getContext().getAuthentication().getName());
    }
}
