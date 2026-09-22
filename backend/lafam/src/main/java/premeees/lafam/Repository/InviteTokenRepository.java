package premeees.lafam.Repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import premeees.lafam.Entity.InviteToken;
import premeees.lafam.Entity.User;

public interface InviteTokenRepository extends JpaRepository<InviteToken, UUID> {
    Optional<InviteToken> findByToken(String token);

    @Modifying
@Query("UPDATE InviteToken it SET it.invitedBy = null WHERE it.invitedBy = :user")
void nullifyInvitedBy(@Param("user") User user);

@Modifying
@Query("UPDATE InviteToken it SET it.usedBy = null WHERE it.usedBy = :user")
void nullifyUsedBy(@Param("user") User user);
}
