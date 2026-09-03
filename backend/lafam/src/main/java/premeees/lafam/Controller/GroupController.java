package premeees.lafam.Controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import premeees.lafam.Service.GroupService;
import premeees.lafam.dto.request.ConfirmAvatarRequest;
import premeees.lafam.dto.request.CreateGroupRequest;
import premeees.lafam.dto.response.AvatarUploadResponse;
import premeees.lafam.dto.response.GroupMemberResponse;
import premeees.lafam.dto.response.GroupResponse;
import premeees.lafam.dto.response.InviteTokenResponse;
import premeees.lafam.dto.response.UserResponse;
import premeees.lafam.dto.response.InviteTokenPreviewResponse;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping
    public ResponseEntity<GroupResponse> createGroup(
            @Valid @RequestBody CreateGroupRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        GroupResponse response = groupService.createGroup(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{groupId}")
    public ResponseEntity<GroupResponse> updateGroup(
            @PathVariable UUID groupId,
            @Valid @RequestBody premeees.lafam.dto.request.UpdateGroupRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        GroupResponse response = groupService.updateGroup(groupId, request, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<GroupMemberResponse>> getUserGroups(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<GroupMemberResponse> groups = groupService.getUserGroups(userDetails.getUsername());
        return ResponseEntity.ok(groups);
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity<Void> deleteGroup(
            @PathVariable UUID groupId,
            @AuthenticationPrincipal UserDetails userDetails) {
        groupService.softDeleteGroup(groupId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/join")
    public ResponseEntity<GroupMemberResponse> joinGroup(
            @RequestParam String token,
            @AuthenticationPrincipal UserDetails userDetails) {
        GroupMemberResponse response = groupService.joinGroupByToken(token, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{groupId}/invites")
    public ResponseEntity<InviteTokenResponse> generateInviteToken(
            @PathVariable UUID groupId,
            @AuthenticationPrincipal UserDetails userDetails) {
        InviteTokenResponse response = groupService.generateInviteToken(groupId, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<GroupMemberResponse>> getGroupMembers(
            @PathVariable UUID groupId,
            @AuthenticationPrincipal UserDetails userDetails) {
        List<GroupMemberResponse> members = groupService.getGroupMembers(groupId, userDetails.getUsername());
        return ResponseEntity.ok(members);
    }

    @GetMapping("/invites/{token}/preview")
    public ResponseEntity<InviteTokenPreviewResponse> previewInviteToken(
            @PathVariable String token) {
        InviteTokenPreviewResponse response = groupService.previewInviteToken(token);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{groupId}/avatar/upload-url")
    public ResponseEntity<AvatarUploadResponse> requestGroupAvatarUploadUrl(
            @PathVariable UUID groupId,
            @RequestParam String contentType,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (!contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().build();
        }
        AvatarUploadResponse request = groupService.requestGroupAvatarUpload(groupId, userDetails.getUsername(),
                contentType);
        return ResponseEntity.ok(request);
    }

    @PatchMapping("/{groupId}/avatar/confirm")
    public ResponseEntity<GroupResponse> confirmAvatarUpload(
            @PathVariable UUID groupId,
            @Valid @RequestBody ConfirmAvatarRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        GroupResponse response = groupService.confirmGroupAvatarUpload(
            groupId, userDetails.getUsername(), request.getObjectKey());
        return ResponseEntity.ok(response);
    }
}
