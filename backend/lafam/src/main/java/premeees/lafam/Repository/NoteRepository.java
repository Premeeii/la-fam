package premeees.lafam.Repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import premeees.lafam.Entity.Note;
import premeees.lafam.Entity.User;

public interface NoteRepository extends JpaRepository<Note, UUID> {
    Page<Note> findAllByGroupId(UUID groupId, Pageable pageable);
    List<Note> findAllByGroupIdAndCreatedById(UUID groupId, UUID createdById);
    List<Note> findAllByCreatedById(UUID userId);
    void deleteAllByCreatedBy(User user);
}
