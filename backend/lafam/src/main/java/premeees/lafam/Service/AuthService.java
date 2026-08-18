package premeees.lafam.Service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

import org.springframework.beans.factory.annotation.Value;
import premeees.lafam.Repository.RefreshTokenRepository;
import premeees.lafam.Repository.UserRepository;
import premeees.lafam.dto.request.LoginRequest;
import premeees.lafam.dto.request.RefreshTokenRequest;
import premeees.lafam.dto.request.RegisterRequest;
import premeees.lafam.dto.response.AuthResponse;
import premeees.lafam.dto.response.UserResponse;
import premeees.lafam.security.JwtService;
import premeees.lafam.Entity.RefreshToken;
import premeees.lafam.Entity.User;


@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Value("${spring.security.jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    public AuthService(UserRepository userRepository, RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    //Register Service
    @Transactional
    public AuthResponse register(RegisterRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User(
            request.getEmail(),
            passwordEncoder.encode(request.getPassword()),
            request.getDisplayName()
        );
        userRepository.save(user);

        return generateAuthResponse(user);
        
    }

    //Login Service
    @Transactional
    public AuthResponse login(LoginRequest request){
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return generateAuthResponse(user);
        
    }   

    //RefreshToken
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request){
        String requestToken = request.getRefreshToken();

        RefreshToken refreshToken = refreshTokenRepository.findByToken(requestToken)
            .orElseThrow(() -> new IllegalArgumentException("Refresh token not found"));

        if (!refreshToken.isValid()) {
            throw new IllegalArgumentException("Refresh token is expired or revoked");
        }

        User user = refreshToken.getUser();
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

        refreshToken.setIsRevoked(true);
        refreshTokenRepository.save(refreshToken);
        

        return generateAuthResponse(user);
    }

    @Transactional
    public void logout(RefreshTokenRequest request){
        refreshTokenRepository.findByToken(request.getRefreshToken())
            .ifPresent(token -> {
                token.setIsRevoked(true);
                refreshTokenRepository.save(token);
            });
    }

    public UserResponse getMyProfile(String email){
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return UserResponse.fromEntity(user);
    }


    private AuthResponse generateAuthResponse(User user) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshTokenValue = jwtService.generateRefreshToken(userDetails);

        RefreshToken refreshToken = new RefreshToken(
            user,
            refreshTokenValue,
            OffsetDateTime.now().plusSeconds(refreshTokenExpiration / 1000)
        );

        refreshTokenRepository.save(refreshToken);

        return new AuthResponse(
            accessToken,
            refreshTokenValue,
            UserResponse.fromEntity(user)
        );
    }




}
