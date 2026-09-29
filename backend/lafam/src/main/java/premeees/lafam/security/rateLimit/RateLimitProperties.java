package premeees.lafam.security.rateLimit;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "rate-limit")
public record RateLimitProperties(
        Limit login,
        Limit register,
        Limit forgotPassword,
        Limit resetPassword

) {

    public record Limit(
            long capacity,
            long refillMinutes
    ) {}
}
