package premeees.lafam.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import premeees.lafam.Entity.GroupMember;

public interface GroupMemberRepository extends JpaRepository<GroupMember, UUID> {
    List<GroupMember> findByUserId(UUID userId);
    List<GroupMember> findAllByUserId(UUID userId);
    
    @EntityGraph(attributePaths = {"group", "user"})
    List<GroupMember> findAllByUserIdAndGroupDeletedAtIsNull(UUID userId);

    List<GroupMember> findAllByUserIdAndGroupDeletedAtIsNullAndLeavedAtIsNull(UUID userId);

    @EntityGraph(attributePaths = { "group", "user" })
    List<GroupMember> findAllByGroupIdAndLeavedAtIsNull(UUID groupId);

    Optional<GroupMember> findByGroupIdAndUserId(UUID groupId, UUID userId);
}
