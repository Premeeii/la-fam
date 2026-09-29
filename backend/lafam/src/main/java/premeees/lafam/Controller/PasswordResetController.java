package premeees.lafam.Controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import premeees.lafam.Service.PasswordResetService;
import premeees.lafam.dto.request.ForgotPasswordRequest;
import premeees.lafam.dto.request.ResetPasswordRequest;
import premeees.lafam.security.rateLimit.RateLimitException;
import premeees.lafam.security.rateLimit.RateLimitProperties;
import premeees.lafam.security.rateLimit.RateLimitService;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;
    private final RateLimitService rateLimitService;
    private final RateLimitProperties rateLimitProperties;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public PasswordResetController(PasswordResetService passwordResetService, RateLimitService rateLimitService, RateLimitProperties rateLimitProperties) {
        this.passwordResetService = passwordResetService;
        this.rateLimitService = rateLimitService;
        this.rateLimitProperties = rateLimitProperties;
    }

    /**
     * User send email → create token then send email
     * return 200 always whether email is in system or not (prevent User Enumeration)
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request, HttpServletRequest httpRequest) {
        String ip = getClientIp(httpRequest);
        if (!rateLimitService.tryConsume("forgot-password:" + ip, rateLimitProperties.forgotPassword())) {
            throw new RateLimitException("Too many login attempts. Please try again later.");
        }
        passwordResetService.requestPasswordReset(request.getEmail(), frontendUrl);
        return ResponseEntity.ok().build();
    }

    /**
     * User send token (from email) + new password → reset password
     */
    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request, HttpServletRequest httpRequest) {
        String ip = getClientIp(httpRequest);
        if (!rateLimitService.tryConsume("reset-password:" + ip, rateLimitProperties.resetPassword())) {
            throw new RateLimitException("Too many login attempts. Please try again later.");
        }
        passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.noContent().build();
    }

        private String getClientIp(HttpServletRequest request) {
        return request.getRemoteAddr();
    }
}
