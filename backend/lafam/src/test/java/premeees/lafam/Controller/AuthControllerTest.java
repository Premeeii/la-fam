package premeees.lafam.Controller;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import premeees.lafam.Service.AuthService;
import premeees.lafam.dto.request.LoginRequest;
import premeees.lafam.dto.response.AuthResponse;

class AuthControllerTest {

    @Test
    void loginSetsHttpOnlyRefreshCookieWithoutReturningItInJson() throws Exception {
        AuthService authService = Mockito.mock(AuthService.class);
        AuthController controller = new AuthController(authService);
        ReflectionTestUtils.setField(controller, "refreshTokenExpiration", 604800000L);
        ReflectionTestUtils.setField(controller, "refreshCookieSecure", true);

        when(authService.login(Mockito.any(LoginRequest.class)))
                .thenReturn(new AuthResponse("access-token", "refresh-token", null));

        ResponseEntity<AuthResponse> response = controller.login(new LoginRequest("member@example.com", "password"));
        String setCookie = response.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
        String json = new ObjectMapper().writeValueAsString(response.getBody());

        assertTrue(setCookie.contains("refresh_token=refresh-token"));
        assertTrue(setCookie.contains("HttpOnly"));
        assertTrue(setCookie.contains("Secure"));
        assertTrue(setCookie.contains("SameSite=Lax"));
        assertFalse(json.contains("refresh-token"));
    }
}
