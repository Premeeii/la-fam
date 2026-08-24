package premeees.lafam.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import premeees.lafam.Service.AuthService;
import premeees.lafam.dto.request.LoginRequest;
import premeees.lafam.dto.request.RefreshTokenRequest;
import premeees.lafam.dto.request.RegisterRequest;
import premeees.lafam.dto.response.AuthResponse;

import java.time.Duration;



@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final String REFRESH_TOKEN_COOKIE = "refresh_token";

    private final AuthService authService;

    @Value("${spring.security.jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    @Value("${app.auth.refresh-cookie.secure:true}")
    private boolean refreshCookieSecure;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request){
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
        
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request){
        AuthResponse response = authService.login(request);
        return withRefreshCookie(HttpStatus.OK, response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(
            @CookieValue(value = REFRESH_TOKEN_COOKIE, required = false) String refreshToken) { //find refresh token at db
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token is required");
        }

        AuthResponse response = authService.refreshToken(new RefreshTokenRequest(refreshToken));
        return withRefreshCookie(HttpStatus.OK, response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(value = REFRESH_TOKEN_COOKIE, required = false) String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            authService.logout(new RefreshTokenRequest(refreshToken));
        }
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, clearRefreshCookie().toString())
                .build();
    }

    private ResponseEntity<AuthResponse> withRefreshCookie(HttpStatus status, AuthResponse response) { //as response container to have authresponse and httpOnly cookie together
        return ResponseEntity.status(status)
                .header(HttpHeaders.SET_COOKIE, refreshCookie(response.getRefreshToken()).toString())
                .body(response);
    }

    private ResponseCookie refreshCookie(String refreshToken) {
        return ResponseCookie.from(REFRESH_TOKEN_COOKIE, refreshToken)
                .httpOnly(true)
                .secure(refreshCookieSecure) //set http through
                .sameSite("Lax") //protect cross-site request forgery(csrf) browser will not sent cookie on every request
                .path("/api/auth")
                .maxAge(Duration.ofMillis(refreshTokenExpiration)) //expiration equal as in config
                .build();
    }

    private ResponseCookie clearRefreshCookie() {
        return ResponseCookie.from(REFRESH_TOKEN_COOKIE, "")
                .httpOnly(true)
                .secure(refreshCookieSecure)
                .sameSite("Lax")
                .path("/api/auth")
                .maxAge(Duration.ZERO)
                .build();
    }
}
