package premeees.lafam.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import premeees.lafam.Entity.PasswordResetToken;
import premeees.lafam.Entity.User;

import java.util.Optional;
import java.util.UUID;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
    Optional<PasswordResetToken> findByTokenHash(String tokenHash);

    void deleteByUserAndUsedAtIsNull(User user);
}
