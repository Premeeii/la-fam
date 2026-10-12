package premeees.lafam.Controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import premeees.lafam.Service.AccountDeletionService;
import premeees.lafam.Service.DataExportService;
import premeees.lafam.Service.UserService;
import premeees.lafam.dto.request.ChangePasswordRequest;
import premeees.lafam.dto.request.UpdateProfileRequest;
import premeees.lafam.dto.response.AvatarUploadResponse;
import premeees.lafam.dto.response.DataExportResponse;
import premeees.lafam.dto.request.ConfirmAvatarRequest;
import premeees.lafam.dto.request.DeleteAccountRequest;
import premeees.lafam.dto.response.UserResponse;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AccountDeletionService accountDeletionService;
    private final DataExportService dataExportService;

    public UserController(UserService userService, AccountDeletionService accountDeletionService, DataExportService dataExportService) {
        this.userService = userService;
        this.accountDeletionService = accountDeletionService;
        this.dataExportService = dataExportService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UserResponse response = userService.getMyProfile(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/me")
    public ResponseEntity<UserResponse> updateMyProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        UserResponse response = userService.updateMyProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/me/change-password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        userService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/me/avatar/upload-url")
    public ResponseEntity<AvatarUploadResponse> requestAvatarUploadUrl(
            @RequestParam String contentType,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (!contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().build();
        }
        AvatarUploadResponse request = userService.requestAvatarUpload(userDetails.getUsername(), contentType);
        return ResponseEntity.ok(request);
    }

    @PatchMapping("/me/avatar/confirm")
    public ResponseEntity<UserResponse> confirmAvatarUpload(
            @Valid @RequestBody ConfirmAvatarRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        UserResponse response = userService.confirmAvatarUpload(
                userDetails.getUsername(), request.getObjectKey());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMyAccount(
            @Valid @RequestBody DeleteAccountRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        accountDeletionService.deleteAccount(userDetails.getUsername(), request.getPassword());
        return ResponseEntity.noContent().build();
    }

    @GetMapping ("me/export")
    public ResponseEntity<DataExportResponse> exportMyData(@AuthenticationPrincipal UserDetails userDetails){
        DataExportResponse data = dataExportService.exportData(userDetails.getUsername());
        String fileName = "lafam_data_export_" + System.currentTimeMillis()+ ".json";
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .body(data);
    }
}
