package premeees.lafam.Controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import premeees.lafam.Service.EmailChangeService;
import premeees.lafam.dto.request.ConfirmEmailChangeRequest;

@RestController
@RequestMapping("/api/users/me/email")
public class EmailChangeController {

    private final EmailChangeService emailChangeService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public EmailChangeController(EmailChangeService emailChangeService) {
        this.emailChangeService = emailChangeService;
    }

    /**
     * Step 1: User requests email change (requires authentication).
     * Sends verification link to current email.
     */
    @PostMapping("/request-change")
    public ResponseEntity<Void> requestEmailChange(
            @AuthenticationPrincipal UserDetails userDetails) {
        emailChangeService.requestEmailChange(userDetails.getUsername(), frontendUrl);
        return ResponseEntity.ok().build();
    }

    /**
     * Step 2: Validate token (called when user clicks link from email).
     * Frontend uses this to check if the token is still valid before
     * showing the change email form.
     * 
     * This endpoint is PUBLIC (no auth required) because user clicks 
     * a link from their email which may open in a different browser/session.
     */
    @GetMapping("/verify-token")
    public ResponseEntity<Void> verifyToken(@RequestParam String token) {
        emailChangeService.validateToken(token);
        return ResponseEntity.ok().build();
    }

    /**
     * Step 3: Confirm email change with token + new email + password.
     * This endpoint is PUBLIC because the user may not be logged in
     * when clicking the email link.
     */
    @PostMapping("/confirm-change")
    public ResponseEntity<Void> confirmEmailChange(
            @Valid @RequestBody ConfirmEmailChangeRequest request) {
        emailChangeService.confirmEmailChange(
                request.getToken(),
                request.getNewEmail(),
                request.getPassword()
        );
        return ResponseEntity.noContent().build();
    }
}
