package premeees.lafam.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

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
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request){
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshTokenRequest request){
        authService.logout(request);
        return ResponseEntity.noContent().build();
    }
    
    
}
