package premeees.lafam.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import premeees.lafam.Entity.EmailChangeToken;
import premeees.lafam.Entity.User;

import java.util.Optional;
import java.util.UUID;

public interface EmailChangeTokenRepository extends JpaRepository<EmailChangeToken, UUID> {
    Optional<EmailChangeToken> findByTokenHash(String tokenHash);

    void deleteByUserAndUsedAtIsNull(User user);
}
