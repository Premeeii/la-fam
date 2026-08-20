package premeees.lafam.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import premeees.lafam.Entity.Event;
import premeees.lafam.Entity.Group;
import premeees.lafam.Entity.User;
import premeees.lafam.Repository.EventRepository;
import premeees.lafam.Repository.GroupMemberRepository;
import premeees.lafam.Repository.GroupRepository;
import premeees.lafam.Repository.UserRepository;
import premeees.lafam.dto.request.CreateEventRequest;
import premeees.lafam.dto.request.UpdateEventRequest;
import premeees.lafam.dto.response.EventResponse;

@Service
public class EventService {

    private static final String DEFAULT_COLOR = "#4F46E5";

    private final EventRepository eventRepository;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository, GroupRepository groupRepository,
                        GroupMemberRepository groupMemberRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public EventResponse createEvent(UUID groupId, CreateEventRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        if (group.getDeletedAt() != null) {
            throw new IllegalArgumentException("Group has been deleted");
        }

        // check a user is member of this group
        groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this group"));

        // if don't identify color
        String color = (request.getColor() != null && !request.getColor().isBlank())
                ? request.getColor()
                : DEFAULT_COLOR;

        Event event = new Event(group, request.getTitle(), request.getDescription(),
                user, request.getStartDate(), request.getEndDate(), color);
        eventRepository.save(event);

        return EventResponse.fromEntity(event);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getGroupEvents(UUID groupId, OffsetDateTime from, OffsetDateTime to, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        if (group.getDeletedAt() != null) {
            throw new IllegalArgumentException("Group has been deleted");
        }

        // check a user is member of this group
        groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this group"));

        List<Event> events = eventRepository.findAllByGroupIdAndStartDateGreaterThanEqualAndEndDateLessThanEqual(groupId, from, to);

        return events.stream()
                .map(EventResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public EventResponse getEvent(UUID groupId, UUID eventId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        if (group.getDeletedAt() != null) {
            throw new IllegalArgumentException("Group has been deleted");
        }

        // check a user is member of this group
        groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this group"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        if (!event.getGroup().getId().equals(groupId)) {
            throw new IllegalArgumentException("Event does not belong to this group");
        }

        return EventResponse.fromEntity(event);
    }

    @Transactional
    public EventResponse updateEvent(UUID groupId, UUID eventId, UpdateEventRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        if (group.getDeletedAt() != null) {
            throw new IllegalArgumentException("Group has been deleted");
        }

        // check a user is member of this group
        groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this group"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        if (!event.getGroup().getId().equals(groupId)) {
            throw new IllegalArgumentException("Event does not belong to this group");
        }

        // Only the event owner can update this event
        if (!event.getOwner().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Only the event owner can update this event");
        }

        // Partial update
        if (request.getTitle() != null) {
            event.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            event.setDescription(request.getDescription());
        }

        if (request.getStartDate() != null) {
            event.setStartDate(request.getStartDate());
        }

        if (request.getEndDate() != null) {
            event.setEndDate(request.getEndDate());
        }

        if (request.getColor() != null) {
            event.setColor(request.getColor());
        }

        eventRepository.save(event);

        return EventResponse.fromEntity(event);
    }

    @Transactional
    public void deleteEvent(UUID groupId, UUID eventId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        if (group.getDeletedAt() != null) {
            throw new IllegalArgumentException("Group has been deleted");
        }

        // check a user is member of this group
        groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this group"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        if (!event.getGroup().getId().equals(groupId)) {
            throw new IllegalArgumentException("Event does not belong to this group");
        }

        // Only the event owner can update this event
        if (!event.getOwner().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Only the event owner can delete this event");
        }

        eventRepository.delete(event);
    }
}
