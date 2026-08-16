package premeees.lafam.security;


import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    
    @Value("${spring.security.jwt.secret}")
    private String secretKey;
    
    @Value("${spring.security.jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${spring.security.jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    private SecretKey getSignInKey(){
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    //Encryption
    private String generateToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration){
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey())
                .compact();
                    
    }

    public String generateAccessToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails, accessTokenExpiration);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails, refreshTokenExpiration);
    }

    //Decryption
    public Claims extractAllClaims(String token){
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    //For choose field after decryption
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    //choose subject field after from extractClaim function
    public String extractUsername(String token){
        return extractClaim(token, Claims::getSubject);
    }

    //choose expiration field after from extractClaim function
    public Date extractExpiration(String token){
        return extractClaim(token, Claims::getExpiration);
    }

    //check token is expired or not
    private boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    //check token is valid or not
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(username) && !isTokenExpired(token);
    }

}   
