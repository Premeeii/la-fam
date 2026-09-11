package premeees.lafam.Service;

import java.time.OffsetDateTime;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import premeees.lafam.Repository.RefreshTokenRepository;

@Service 
public class TokenCleanupService {

    private final RefreshTokenRepository refreshTokenRepository;

    public TokenCleanupService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Scheduled (cron = "0 0 2 * * *")
    @Transactional
    public void cleanupExpiredTokens() {
        int deleted = refreshTokenRepository.deleteExpiredAndRevoked(OffsetDateTime.now());
         System.out.println("[TokenCleanup] Deleted " + deleted + " expired/revoked refresh tokens.");
    }
}
