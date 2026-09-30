package premeees.lafam.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import premeees.lafam.dto.response.TurnstileResponse;

import java.util.Map;

@Slf4j
@Service
public class TurnstileService {

    private static final String VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    private final RestClient restClient;
    private final String secretKey;

    public TurnstileService(
            RestClient restClient,
            @Value("${cloudflare.turnstile.secret-key}") String secretKey) {
        this.restClient = restClient;
        this.secretKey = secretKey;
    }

    public boolean verify(String token) {

        if (token == null || token.isBlank()) {
            log.warn("[Turnstile] Token is null or blank");
            return false;
        }

        log.info("[Turnstile] Verifying token: {}...", token.substring(0, Math.min(20, token.length())));

        try {
            TurnstileResponse response = restClient.post()
                    .uri(VERIFY_URL)
                    .body(Map.of(
                            "secret", secretKey,
                            "response", token))
                    .retrieve()
                    .body(TurnstileResponse.class);

            if (response != null) {
                log.info("[Turnstile] Response: success={}, hostname={}, errorCodes={}",
                        response.isSuccess(), response.getHostname(), response.getErrorCodes());
            } else {
                log.warn("[Turnstile] Response is null");
            }

            return response != null && response.isSuccess();

        } catch (Exception e) {
            log.error("[Turnstile] Exception during verification: {}", e.getMessage(), e);
            return false;
        }
    }
}