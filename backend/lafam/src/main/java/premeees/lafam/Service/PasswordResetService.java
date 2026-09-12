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

import premeees.lafam.Entity.PasswordResetToken;
import premeees.lafam.Entity.User;
import premeees.lafam.Repository.PasswordResetTokenRepository;
import premeees.lafam.Repository.UserRepository;

@Service
public class PasswordResetService {

    private static final int TOKEN_EXPIRY_MINUTES = 15;

    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public PasswordResetService(PasswordResetTokenRepository tokenRepository,
                                UserRepository userRepository,
                                EmailService emailService,
                                PasswordEncoder passwordEncoder) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Request a password reset.
     * Always responds the same way whether the email exists or not
     * to prevent User Enumeration attacks.
     */
    @Transactional
    public void requestPasswordReset(String email, String frontendUrl) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            // not tell that email doesn't exist in system - prevent User Enumeration
            return;
        }

        // delete old token that not used yet
        tokenRepository.deleteByUserAndUsedAtIsNull(user);

        // create raw token (send to user via email)
        String rawToken = UUID.randomUUID().toString();

        // save hash in DB (don't save raw token for security)
        String tokenHash = sha256(rawToken);

        PasswordResetToken resetToken = new PasswordResetToken(
                user,
                tokenHash,
                OffsetDateTime.now().plusMinutes(TOKEN_EXPIRY_MINUTES)
        );
        tokenRepository.save(resetToken);

        // create reset URL then send email
        String resetUrl = frontendUrl + "/reset-password?token=" + rawToken;
        emailService.sendPasswordResetEmail(email, resetUrl);
    }

    /**
     * Reset password using a valid token.
     */
    @Transactional
    public void resetPassword(String rawToken, String newPassword) {
        String tokenHash = sha256(rawToken);

        PasswordResetToken resetToken = tokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired reset token"));

        if (!resetToken.isValid()) {
            throw new IllegalArgumentException("Invalid or expired reset token");
        }

        // change password
        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // mark token as used
        resetToken.setUsedAt(OffsetDateTime.now());
        tokenRepository.save(resetToken);
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
