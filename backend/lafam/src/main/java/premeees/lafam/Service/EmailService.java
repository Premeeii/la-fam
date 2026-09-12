package premeees.lafam.Service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestClient;

@Service
public class EmailService {
    private static final String RESEND_URL = "https://api.resend.com/emails";

    private final RestClient restClient;

    private String resendApiKey;
    private String fromEmail;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public EmailService(RestClient restClient, @Value("${resend.api-key}") String resendApiKey,
            @Value("${resend.from-email}") String fromEmail) {
        this.restClient = restClient;
        this.resendApiKey = resendApiKey;
        this.fromEmail = fromEmail;
    }

    public void sendPasswordResetEmail(String email, String resetUrl){
          Map<String, Object> body = Map.of(
                "from", fromEmail,
                "to", List.of(email),
                "subject", "Reset your La Fam password",
                "html", """
                        <h2>Reset your password</h2>

                        <p>
                            We received a request to reset your
                            La Fam password.
                        </p>

                        <p>
                            <a href="%s">
                                Reset Password
                            </a>
                        </p>

                        <p>
                            This link will expire in 15 minutes.
                        </p>

                        <p>
                            If you did not request a password reset,
                            you can safely ignore this email.
                        </p>
                        """.formatted(resetUrl)
        );

        restClient.post()
                .uri(RESEND_URL)
                .header(
                        "Authorization",
                        "Bearer " + resendApiKey
                )
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }
}
