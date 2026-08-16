package premeees.lafam.security;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) 
            throws IOException {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);

                Map<String, Object> body = new HashMap<>();
                objectMapper.writeValue(response.getOutputStream(), authException.getMessage());
                body.put("timestamp", OffsetDateTime.now().toString());
                body.put("status", 401);
                body.put("error", "Unauthorized");
                body.put("message", "Full authentication is required to access this resource");
                body.put("path", request.getRequestURI());

                objectMapper.writeValue(response.getOutputStream(), body);
    }
}
