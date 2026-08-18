package premeees.lafam.Controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import premeees.lafam.Service.GroupService;
import premeees.lafam.dto.request.CreateGroupRequest;
import premeees.lafam.dto.response.GroupMemberResponse;
import premeees.lafam.dto.response.GroupResponse;

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

}
