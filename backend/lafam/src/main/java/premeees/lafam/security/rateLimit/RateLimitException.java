package premeees.lafam.security.rateLimit;

public class RateLimitException extends RuntimeException {
    
    public RateLimitException(String message) {
        super(message);
    }
}
