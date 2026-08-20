package premeees.lafam.Controller;

import java.time.OffsetDateTime;

import java.util.List;
import java.util.UUID;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import premeees.lafam.Service.EventService;
import premeees.lafam.dto.request.CreateEventRequest;
import premeees.lafam.dto.request.UpdateEventRequest;
import premeees.lafam.dto.response.EventResponse;

@RestController
@RequestMapping("/api/groups/{groupId}/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(
            @PathVariable UUID groupId,
            @Valid @RequestBody CreateEventRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        EventResponse response = eventService.createEvent(groupId, request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<EventResponse>> getGroupEvents(
            @PathVariable UUID groupId,
            @RequestParam OffsetDateTime from,
            @RequestParam OffsetDateTime to,
            @AuthenticationPrincipal UserDetails userDetails) {
        List<EventResponse> events = eventService.getGroupEvents(groupId, from, to, userDetails.getUsername());
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventResponse> getEvent(
            @PathVariable UUID groupId,
            @PathVariable UUID eventId,
            @AuthenticationPrincipal UserDetails userDetails) {
        EventResponse response = eventService.getEvent(groupId, eventId, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{eventId}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable UUID groupId,
            @PathVariable UUID eventId,
            @Valid @RequestBody UpdateEventRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        EventResponse response = eventService.updateEvent(groupId, eventId, request, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable UUID groupId,
            @PathVariable UUID eventId,
            @AuthenticationPrincipal UserDetails userDetails) {
        eventService.deleteEvent(groupId, eventId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
