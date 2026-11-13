package premeees.lafam.Service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import premeees.lafam.Entity.Group;
import premeees.lafam.Entity.GroupMember;
import premeees.lafam.Entity.Note;
import premeees.lafam.Entity.User;
import premeees.lafam.Repository.GroupMemberRepository;
import premeees.lafam.Repository.GroupRepository;
import premeees.lafam.Repository.NoteRepository;
import premeees.lafam.Repository.UserRepository;
import premeees.lafam.dto.request.CreateNoteRequest;
import premeees.lafam.dto.request.UpdateNoteRequest;
import premeees.lafam.dto.response.NoteResponse;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;

    public NoteService(NoteRepository noteRepository, GroupRepository groupRepository,
                       GroupMemberRepository groupMemberRepository, UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public NoteResponse createNote(UUID groupId, CreateNoteRequest request, String email) {
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

        Note note = new Note(group, request.getTitle(), request.getContent(), user);
        noteRepository.save(note);

        return NoteResponse.fromEntity(note);
    }

    @Transactional(readOnly = true)
    public Page<NoteResponse> getGroupNotes(UUID groupId, String email, Pageable pageable) {
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

        if (pageable == null || pageable.isUnpaged()) {
            pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "updatedAt")); //new to old
        }

        Page<Note> notes = noteRepository.findAllByGroupId(groupId, pageable);

        return notes.map(NoteResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public NoteResponse getNote(UUID groupId, UUID noteId, String email) {
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

        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found"));

        // check a note is in this group
        if (!note.getGroup().getId().equals(groupId)) {
            throw new IllegalArgumentException("Note does not belong to this group");
        }

        return NoteResponse.fromEntity(note);
    }

    @Transactional
    public NoteResponse updateNote(UUID groupId, UUID noteId, UpdateNoteRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        if (group.getDeletedAt() != null) {
            throw new IllegalArgumentException("Group has been deleted");
        }

        // check a user is member of this group
        GroupMember member = groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this group"));

        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found"));

        // check a note is in this group
        if (!note.getGroup().getId().equals(groupId)) {
            throw new IllegalArgumentException("Note does not belong to this group");
        }

        boolean isCreator = note.getCreatedBy().getId().equals(user.getId());
        boolean isGroupOwner = "OWNER".equals(member.getRole());

        //check you are owner note or group owner
        if (!isCreator && !isGroupOwner) {
            throw new IllegalArgumentException("You are not authorized to modify this note");
        }

        // update a note
        if (request.getTitle() != null) {
            note.setTitle(request.getTitle());
        }

        if (request.getContent() != null) {
            note.setContent(request.getContent());
        }

        note.setUpdatedBy(user);
        noteRepository.save(note);

        return NoteResponse.fromEntity(note);
    }

    @Transactional
    public void deleteNote(UUID groupId, UUID noteId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        if (group.getDeletedAt() != null) {
            throw new IllegalArgumentException("Group has been deleted");
        }

        // check a user is member of this group
        GroupMember member = groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this group"));

        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found"));

        // check a note is in this group
        if (!note.getGroup().getId().equals(groupId)) {
            throw new IllegalArgumentException("Note does not belong to this group");
        }

        boolean isCreator = note.getCreatedBy().getId().equals(user.getId());
        boolean isGroupOwner = "OWNER".equals(member.getRole());

        //check you are owner note or group owner
        if (!isCreator && !isGroupOwner) {
            throw new IllegalArgumentException("You are not authorized to delete this note");
        }

        noteRepository.delete(note);
    }
}
