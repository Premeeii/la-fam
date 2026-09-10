package premeees.lafam.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import premeees.lafam.dto.response.TurnstileResponse;

import java.util.Map;

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
            return false;
        }

        try {
            TurnstileResponse response = restClient.post()
                    .uri(VERIFY_URL)
                    .body(Map.of(
                            "secret", secretKey,
                            "response", token))
                    .retrieve()
                    .body(TurnstileResponse.class);

            return response != null && response.isSuccess();

        } catch (Exception e) {
            return false;
        }
    }
}