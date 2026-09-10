package premeees.lafam.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class TurnstileResponse {
    
    private boolean success;
    
    private String challenge_ts;
    
    private String hostname;
    
    @JsonProperty("error-codes")
    private List<String> errorCodes;

    public TurnstileResponse() {}

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getChallenge_ts() {
        return challenge_ts;
    }

    public void setChallenge_ts(String challenge_ts) {
        this.challenge_ts = challenge_ts;
    }

    public String getHostname() {
        return hostname;
    }

    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

    public List<String> getErrorCodes() {
        return errorCodes;
    }

    public void setErrorCodes(List<String> errorCodes) {
        this.errorCodes = errorCodes;
    }
}
