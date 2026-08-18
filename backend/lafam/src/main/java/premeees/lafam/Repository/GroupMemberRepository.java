package premeees.lafam.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import premeees.lafam.Entity.GroupMember;

public interface GroupMemberRepository extends JpaRepository<GroupMember, UUID> {
    Optional<GroupMember> findByUserId(UUID userId);
    List<GroupMember> findAllByUserId(UUID userId);
}
