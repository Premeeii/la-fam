package premeees.lafam.Controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import premeees.lafam.Service.NoteService;
import premeees.lafam.dto.request.CreateNoteRequest;
import premeees.lafam.dto.request.UpdateNoteRequest;
import premeees.lafam.dto.response.NoteResponse;

@RestController
@RequestMapping("/api")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @PostMapping("/groups/{groupId}/notes")
    public ResponseEntity<NoteResponse> createNote(
            @PathVariable UUID groupId,
            @Valid @RequestBody CreateNoteRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        NoteResponse response = noteService.createNote(groupId, request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/groups/{groupId}/notes")
    public ResponseEntity<Page<NoteResponse>> getGroupNotes(
            @PathVariable UUID groupId,
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 10, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<NoteResponse> notes = noteService.getGroupNotes(groupId, userDetails.getUsername(), pageable);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/groups/{groupId}/notes/{noteId}")
    public ResponseEntity<NoteResponse> getNote(
            @PathVariable UUID groupId,
            @PathVariable UUID noteId,
            @AuthenticationPrincipal UserDetails userDetails) {
        NoteResponse note = noteService.getNote(groupId, noteId, userDetails.getUsername());
        return ResponseEntity.ok(note);
    }

    @PatchMapping("/groups/{groupId}/notes/{noteId}")
    public ResponseEntity<NoteResponse> updateNote(
            @PathVariable UUID groupId,
            @PathVariable UUID noteId,
            @Valid @RequestBody UpdateNoteRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        NoteResponse response = noteService.updateNote(groupId, noteId, request, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/groups/{groupId}/notes/{noteId}")
    public ResponseEntity<Void> deleteNote(
            @PathVariable UUID groupId,
            @PathVariable UUID noteId,
            @AuthenticationPrincipal UserDetails userDetails) {
        noteService.deleteNote(groupId, noteId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
