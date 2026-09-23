package premeees.lafam.dto.response;

import java.time.LocalDateTime;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL) 
public class ErrorResponse {
    
    private LocalDateTime timestamp;
    private int status;
    private String message;
    private String error;
    private String path;
    //for validation errors
    private Map<String, String> fieldErrors;
}
