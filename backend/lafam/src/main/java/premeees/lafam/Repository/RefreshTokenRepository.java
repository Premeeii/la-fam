package premeees.lafam.Repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import premeees.lafam.Entity.RefreshToken;
import premeees.lafam.Entity.User;

public interface RefreshTokenRepository extends JpaRepository <RefreshToken, UUID> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);
    
    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.isRevoked = true WHERE rt.tokenHash = :tokenHash")
    void revokeAllByTokenHash(@Param("tokenHash") String tokenHash);

    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.isRevoked = true WHERE rt.user = :user")
     void revokeAllByUser(@Param("user") User user); 
}
