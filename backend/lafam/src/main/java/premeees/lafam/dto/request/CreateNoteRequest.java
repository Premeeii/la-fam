package premeees.lafam.dto.request;

import jakarta.validation.constraints.NotBlank;

public class CreateNoteRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String content;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
