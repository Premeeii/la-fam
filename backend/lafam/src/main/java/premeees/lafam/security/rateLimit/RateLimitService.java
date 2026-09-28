package premeees.lafam.security.rateLimit;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;

@Service
public class RateLimitService {

    private final Cache<String, Bucket> buckets = Caffeine.newBuilder()
            .expireAfterAccess(1, TimeUnit.HOURS)
            .maximumSize(10_000)
            .build();

    public boolean tryConsume(String key, RateLimitProperties.Limit limit) {
        if (limit == null) { //check limit is not set
            return true;
        }
        Bucket bucket = buckets.get(key, k -> createBucket(limit));
        return bucket != null && bucket.tryConsume(1);
    }

    private Bucket createBucket(RateLimitProperties.Limit limit) {
        Bandwidth bandwidth = Bandwidth.builder()
                .capacity(limit.capacity())
                .refillGreedy(limit.capacity(), Duration.ofMinutes(limit.refillMinutes()))
                .build();
        return Bucket.builder()
                .addLimit(bandwidth)
                .build();
    }
}
