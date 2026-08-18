package premeees.lafam.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import premeees.lafam.Entity.Group;
import premeees.lafam.Entity.GroupMember;
import premeees.lafam.Entity.InviteToken;
import premeees.lafam.Entity.User;
import premeees.lafam.Repository.GroupMemberRepository;
import premeees.lafam.Repository.GroupRepository;
import premeees.lafam.Repository.InviteTokenRepository;
import premeees.lafam.Repository.UserRepository;
import premeees.lafam.dto.request.CreateGroupRequest;
import premeees.lafam.dto.response.GroupResponse;

@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final InviteTokenRepository inviteTokenRepository;
    private final UserRepository userRepository;

    public GroupService(GroupRepository groupRepository, GroupMemberRepository groupMemberRepository,
            InviteTokenRepository inviteTokenRepository, UserRepository userRepository) {
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.inviteTokenRepository = inviteTokenRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public GroupResponse createGroup(CreateGroupRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 1. Create the group
        Group group = new Group(request.getName(), user);
        groupRepository.save(group);

        // 2. Add user as OWNER in group_members
        GroupMember member = new GroupMember(group, user, "OWNER");
        groupMemberRepository.save(member);

        // 3. Generate an invite token for the group
        String token = UUID.randomUUID().toString();
        OffsetDateTime expiresAt = OffsetDateTime.now().plusDays(7);

        InviteToken inviteToken = new InviteToken(group, token, user, "MEMBER", expiresAt);
        inviteTokenRepository.save(inviteToken);

        return GroupResponse.fromEntity(group);
    }

    @Transactional(readOnly = true)
    public List<GroupResponse> getUserGroups(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<GroupMember> memberships = groupMemberRepository.findAllByUserId(user.getId());

        return memberships.stream()
                .map(member -> GroupResponse.fromEntity(member.getGroup()))
                .toList();
    }

    
}
