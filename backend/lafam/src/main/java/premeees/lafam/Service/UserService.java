package premeees.lafam.Service;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import premeees.lafam.Entity.User;
import premeees.lafam.Repository.UserRepository;
import premeees.lafam.dto.request.UpdateProfileRequest;
import premeees.lafam.dto.response.AvatarUploadResponse;
import premeees.lafam.dto.response.UserResponse;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final R2StorageService r2StorageService;

    public UserService(UserRepository userRepository, R2StorageService r2StorageService) {
        this.userRepository = userRepository;
        this.r2StorageService = r2StorageService;
    }

    public UserResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return UserResponse.fromEntity(user);
    }

    @Transactional
    public UserResponse updateMyProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (request.getDisplayName() != null) {
            user.setDisplayName(request.getDisplayName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        userRepository.save(user);
        return UserResponse.fromEntity(user);
    }

    //use for request presigned url to upload picture
    public AvatarUploadResponse requestAvatarUpload(String email, String contentType) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        //convert contentType to be extension like "image/webp" → "webp"
        String extension = contentType.split("/")[1];

        //create objectKey use for userId have a file name in one row
        String objectKey = "avatar/" + user.getId() + "." + extension;

        //Generate presigned URL
        String uploadUrl = r2StorageService.generatePresignedUploadUrl(objectKey, contentType);

        //Create publicUrl for show picture after upload
        String publicUrl = r2StorageService.buildPublicUrl(objectKey);

        return new AvatarUploadResponse(uploadUrl, publicUrl, objectKey);
    }

    //use for confirm and delete old avatarUrl
    public UserResponse confirmAvatarUpload(String email, String objectKey) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        //delete oldAvatarUrl out of R2 if has it
        String oldAvatarUrl = user.getAvatarUrl();
        //"<https://pub-xxx.r2.dev/avatars/abc.webp>" → "avatars/abc.webp"
        if (oldAvatarUrl != null && !oldAvatarUrl.isBlank()) {
            try{
                String oldKey = oldAvatarUrl.substring(oldAvatarUrl.lastIndexOf("avatar/"));
                r2StorageService.deleteObject(oldKey);
            }catch(Exception e) {

            }
        }
        //create new public Url in DB
        String newAvatarUrl = r2StorageService.buildPublicUrl(objectKey);
        user.setAvatarUrl(newAvatarUrl);
        userRepository.save(user);
        return UserResponse.fromEntity(user);
    }
}
