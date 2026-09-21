package premeees.lafam.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.OffsetDateTime;
import java.util.HexFormat;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import premeees.lafam.Entity.EmailChangeToken;
import premeees.lafam.Entity.User;
import premeees.lafam.Repository.EmailChangeTokenRepository;
import premeees.lafam.Repository.UserRepository;

@Service
public class EmailChangeService {

    private static final int TOKEN_EXPIRY_MINUTES = 15;

    private final EmailChangeTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public EmailChangeService(EmailChangeTokenRepository tokenRepository,
                              UserRepository userRepository,
                              EmailService emailService,
                              PasswordEncoder passwordEncoder) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Step 1: User requests email change.
     * Sends a verification link to their CURRENT email.
     * Requires authentication (username from JWT).
     */
    @Transactional
    public void requestEmailChange(String currentEmail, String frontendUrl) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // delete old unused tokens
        tokenRepository.deleteByUserAndUsedAtIsNull(user);

        // create raw token (to send via email)
        String rawToken = UUID.randomUUID().toString();

        // save hash in DB (don't save raw token for security)
        String tokenHash = sha256(rawToken);

        EmailChangeToken changeToken = new EmailChangeToken(
                user,
                tokenHash,
                OffsetDateTime.now().plusMinutes(TOKEN_EXPIRY_MINUTES)
        );
        tokenRepository.save(changeToken);

        // create verification URL then send email to CURRENT email
        String verifyUrl = frontendUrl + "/settings/change-email?token=" + rawToken;
        emailService.sendEmailChangeVerificationEmail(currentEmail, verifyUrl);
    }

    /**
     * Step 2: Validate token only (used by frontend to check if token is valid
     * before showing the change email form).
     */
    public void validateToken(String rawToken) {
        String tokenHash = sha256(rawToken);

        EmailChangeToken changeToken = tokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired token"));

        if (!changeToken.isValid()) {
            throw new IllegalArgumentException("Invalid or expired token");
        }
    }

    /**
     * Step 3: Confirm email change with token + new email + password verification.
     */
    @Transactional
    public void confirmEmailChange(String rawToken, String newEmail, String password) {
        String tokenHash = sha256(rawToken);

        EmailChangeToken changeToken = tokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired token"));

        if (!changeToken.isValid()) {
            throw new IllegalArgumentException("Invalid or expired token");
        }

        User user = changeToken.getUser();

        // verify password
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Incorrect password");
        }

        // check new email is not already in use
        if (userRepository.findByEmail(newEmail).isPresent()) {
            throw new IllegalArgumentException("Email is already in use");
        }

        // check new email is not the same as current
        if (user.getEmail().equalsIgnoreCase(newEmail)) {
            throw new IllegalArgumentException("New email must be different from current email");
        }

        // change email
        user.setEmail(newEmail);
        userRepository.save(user);

        // mark token as used
        changeToken.setUsedAt(OffsetDateTime.now());
        tokenRepository.save(changeToken);
    }

    /**
     * SHA-256 hash of raw token - save hash in DB instead of raw token
     * to prevent case DB leak, token can't be used
     */
    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }
}
