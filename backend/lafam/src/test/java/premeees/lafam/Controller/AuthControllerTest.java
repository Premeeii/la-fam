package premeees.lafam.Controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import premeees.lafam.Service.AuthService;
import premeees.lafam.Service.EmailService;
import premeees.lafam.security.TurnstileService;
import premeees.lafam.security.rateLimit.RateLimitProperties;
import premeees.lafam.security.rateLimit.RateLimitService;
import premeees.lafam.dto.request.LoginRequest;
import premeees.lafam.dto.response.AuthResponse;

import jakarta.servlet.http.HttpServletRequest;

class AuthControllerTest {

    @Test
    void loginSetsHttpOnlyRefreshAndAccessCookieWithoutReturningItInJson() throws Exception {
        AuthService authService = Mockito.mock(AuthService.class);
        TurnstileService turnstileService = Mockito.mock(TurnstileService.class);
        EmailService emailService = Mockito.mock(EmailService.class);
        RateLimitService rateLimitService = Mockito.mock(RateLimitService.class);
        RateLimitProperties rateLimitProperties = Mockito.mock(RateLimitProperties.class);
        HttpServletRequest httpRequest = Mockito.mock(HttpServletRequest.class);

        AuthController controller = new AuthController(authService, turnstileService, emailService, rateLimitService,
                rateLimitProperties);
        ReflectionTestUtils.setField(controller, "refreshTokenExpiration", 604800000L);
        ReflectionTestUtils.setField(controller, "accessTokenExpiration", 900000L);
        ReflectionTestUtils.setField(controller, "refreshCookieSecure", true);

        when(rateLimitService.tryConsume(Mockito.anyString(), Mockito.any())).thenReturn(true);
        when(turnstileService.verify(Mockito.anyString())).thenReturn(true);
        when(authService.login(Mockito.any(LoginRequest.class)))
                .thenReturn(new AuthResponse("access-token", "refresh-token", null));

        ResponseEntity<AuthResponse> response = controller
                .login(new LoginRequest("member@example.com", "password", "dummy-turnstile-token"), httpRequest);
        String setCookie = response.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
        String accessTokenCookie = response.getHeaders().get(HttpHeaders.SET_COOKIE).get(1);
        String json = new ObjectMapper().writeValueAsString(response.getBody());

        //assert refresh token
        assertTrue(setCookie.contains("refresh_token=refresh-token"));
        assertTrue(setCookie.contains("HttpOnly"));
        assertTrue(setCookie.contains("Secure"));
        assertTrue(setCookie.contains("SameSite=Lax"));
        assertFalse(json.contains("refresh-token"));
        
        //assert access token
        assertTrue(accessTokenCookie.contains("access_token=access-token"));
        assertTrue(accessTokenCookie.contains("HttpOnly"));
        assertTrue(accessTokenCookie.contains("Secure"));
        assertTrue(accessTokenCookie.contains("SameSite=Lax"));
        assertFalse(json.contains("access-token"));
        
        //assert cookie path
        assertTrue(setCookie.contains("Path=/api/auth"));
        assertTrue(accessTokenCookie.contains("Path=/"));
    }

}
