package premeees.lafam.security.rateLimit;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "rate-limit")
public record RateLimitProperties(
        Limit login,
        Limit register,
        Limit forgotPassword,
        Limit resetPassword,
        Limit createGroup,
        Limit inviteGroup,
        Limit billCreate,
        Limit global

) {

    public record Limit(
            long capacity,
            long refillMinutes
    ) {}
}
