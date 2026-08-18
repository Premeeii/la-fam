package premeees.lafam.Repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import premeees.lafam.Entity.InviteToken;

public interface InviteTokenRepository extends JpaRepository<InviteToken, UUID> {
}
