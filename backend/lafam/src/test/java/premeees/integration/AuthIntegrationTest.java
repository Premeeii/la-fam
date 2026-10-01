package premeees.integration;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.stream.Stream;

import org.springframework.http.MediaType;

import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mockito;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import premeees.lafam.LafamApplication;
import premeees.lafam.Service.EmailService;
import premeees.lafam.TestcontainersConfiguration;
import premeees.lafam.Repository.UserRepository;
import premeees.lafam.security.TurnstileService;
import premeees.lafam.security.rateLimit.RateLimitService;
import jakarta.servlet.http.Cookie;

@SpringBootTest(classes = LafamApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
public class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @MockitoBean
    private TurnstileService turnstileService;

    @MockitoBean
    private EmailService emailService;

    @MockitoBean
    private RateLimitService rateLimitService;

    @BeforeEach
    void setUp() {
        Mockito.when(turnstileService.verify(Mockito.anyString())).thenReturn(true);
        Mockito.when(rateLimitService.tryConsume(Mockito.anyString(), Mockito.any())).thenReturn(true);
    }

    @Test
    void registerAndLoginFlowShouldSetHttpOnlyCookies() throws Exception {
        String registerJson = """
                {
                    "email": "integration@example.com",
                    "password": "Password123!",
                    "displayName": "Integration User",
                    "turnstileToken": "dummy"
                }
                """;
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson))
                .andExpect(status().isCreated())
                .andExpect(cookie().exists("access_token"))
                .andExpect(cookie().exists("refresh_token"))
                .andExpect(jsonPath("$.refresh_token").doesNotExist()) // check from response body
                .andExpect(jsonPath("$.access_token").doesNotExist());

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson))
                .andExpect(status().isBadRequest());

        assertTrue(userRepository.findByEmail("integration@example.com").isPresent());
        assertNotEquals("Password123!", userRepository.findByEmail("integration@example.com").get().getPasswordHash());
    }

    @Test
    void turnStileFalseShouldNotBeAbleToRegister() throws Exception {
        Mockito.when(turnstileService.verify(Mockito.anyString())).thenReturn(false);

        String registerJson = """
                {
                    "email": "integration2@example.com",
                    "password": "Password123!",
                    "displayName": "Integration User2",
                    "turnstileToken": "dummy"
                }
                """;

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson))
                .andExpect(status().isForbidden());

        assertFalse(userRepository.findByEmail("integration2@example.com").isPresent());
    }

    @ParameterizedTest
    @MethodSource("invalidRegisterRequests")
    void registerShouldReturnBadRequestForInvalidInput(
            String email,
            String password,
            String displayName) throws Exception {
        String registerJson = """
                {
                    "email": "%s",
                    "password": "%s",
                    "displayName": "%s",
                    "turnstileToken": "dummy"
                }
                """.formatted(email, password, displayName);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson))
                .andExpect(status().isBadRequest());
    }

    static Stream<Arguments> invalidRegisterRequests() {
        return Stream.of(
                // Email
                Arguments.of(
                        "invalid-email",
                        "Password123!",
                        "Integration User"),

                // Display name
                Arguments.of(
                        "integration1@example.com",
                        "Password123!",
                        ""),
                Arguments.of(
                        "integration2@example.com",
                        "Password123!",
                        "A"),
                Arguments.of(
                        "integration3@example.com",
                        "Password123!",
                        "A".repeat(101)),

                // Password
                Arguments.of(
                        "integration4@example.com",
                        "",
                        "Integration User"),
                Arguments.of(
                        "integration5@example.com",
                        "123",
                        "Integration User"),
                Arguments.of(
                        "integration6@example.com",
                        "A".repeat(101),
                        "Integration User"));
    }
    
    //Login Integration Test
    @Test
    void loginFlowShouldSetHttpOnlyCookies() throws Exception {
        String registerJson = """
                {
                    "email": "login-test@example.com",
                    "password": "Password123!",
                    "displayName": "Login Test User",
                    "turnstileToken": "dummy"
                }
                """;

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson))
                .andExpect(status().isCreated());

        String loginJson = """
                {
                    "email": "login-test@example.com",
                    "password": "Password123!",
                    "turnstileToken": "dummy"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("access_token"))
                .andExpect(cookie().exists("refresh_token"))
                .andExpect(jsonPath("$.refresh_token").doesNotExist())
                .andExpect(jsonPath("$.access_token").doesNotExist());
    }

    @Test
    void wrongPasswordShouldReturnUnauthorized() throws Exception {
        String registerJson = """
                {
                    "email": "wrong-pass-test@example.com",
                    "password": "Password123!",
                    "displayName": "Wrong Pass User",
                    "turnstileToken": "dummy"
                }
                """;

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson))
                .andExpect(status().isCreated());

        String loginJson = """
                {
                    "email": "wrong-pass-test@example.com",
                    "password": "WrongPassword123!",
                    "turnstileToken": "dummy"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isUnauthorized())
                .andExpect(cookie().doesNotExist("access_token"))
                .andExpect(cookie().doesNotExist("refresh_token"));
    }

    @Test
    void userNotExistsShouldReturnUnauthorized() throws Exception {
        String loginJson = """
                {
                    "email": "wronguser@example.com",
                    "password": "Password123!",
                    "turnstileToken": "dummy"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isUnauthorized())
                .andExpect(cookie().doesNotExist("access_token"))
                .andExpect(cookie().doesNotExist("refresh_token"));
    }

    @Test
    void invalidEmailShouldReturnBadRequest() throws Exception {
        String loginJson = """
                {
                    "email": "invalid-email",
                    "password": "Password123!",
                    "turnstileToken": "dummy"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isBadRequest())
                .andExpect(cookie().doesNotExist("access_token"))
                .andExpect(cookie().doesNotExist("refresh_token"));
    }

    //Refresh Token
    @Test
    void RefreshTokenShouldReturnNewAccessTokenAndRefreshToken() throws Exception {
        String registerJson = """
                {
                    "email": "refresh-test@example.com",
                    "password": "Password123!",
                    "displayName": "Refresh Test User",
                    "turnstileToken": "dummy"
                }
                """;

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson))
                .andExpect(status().isCreated());

        String loginJson = """
                {
                    "email": "refresh-test@example.com",
                    "password": "Password123!",
                    "turnstileToken": "dummy"
                }
                """;

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("access_token"))
                .andExpect(cookie().exists("refresh_token"))
                .andReturn();

        Cookie refreshCookie = result.getResponse().getCookie("refresh_token");

        mockMvc.perform(post("/api/auth/refresh")
                .cookie(refreshCookie))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("access_token"))
                .andExpect(cookie().exists("refresh_token"))
                .andExpect(jsonPath("$.refresh_token").doesNotExist())
                .andExpect(jsonPath("$.access_token").doesNotExist());

        mockMvc.perform(post("/api/auth/refresh")
                .cookie(refreshCookie))
                .andExpect(status().isBadRequest());
    }
}
