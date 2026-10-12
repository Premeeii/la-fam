package premeees.lafam.Service;

import premeees.lafam.Entity.User;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import premeees.lafam.Repository.BillRepository;
import premeees.lafam.Repository.EventRepository;
import premeees.lafam.Repository.GroupMemberRepository;
import premeees.lafam.Repository.UserRepository;
import premeees.lafam.dto.response.DataExportResponse;
import premeees.lafam.dto.response.DataExportResponse.UserGroupExport;

@Service
public class DataExportService {
    private final UserRepository userRepository;
    private final BillRepository billRepository;
    private final EventRepository eventRepository;
    private final GroupMemberRepository groupMemberRepository;

    public DataExportService(UserRepository userRepository, BillRepository billRepository,
            EventRepository eventRepository, GroupMemberRepository groupMemberRepository) {
        this.userRepository = userRepository;
        this.billRepository = billRepository;
        this.eventRepository = eventRepository;
        this.groupMemberRepository = groupMemberRepository;
    }

    @Transactional(readOnly = true)
    public DataExportResponse exportData(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // profile
        var profileDto = new DataExportResponse.UserProfileExport(
                user.getId(),
                user.getEmail(),
                user.getDisplayName(),
                user.getBio(),
                user.getAvatarUrl(),
                user.getCreatedAt(),
                user.getUpdatedAt());

        var groupMembers = groupMemberRepository.findAllByUserIdAndGroupDeletedAtIsNullAndLeavedAtIsNull(user.getId());

        List<DataExportResponse.UserGroupExport> groupDtos = groupMembers.stream()
                .map(gm -> new DataExportResponse.UserGroupExport(
                        gm.getGroup().getId(),
                        gm.getGroup().getName(),
                        gm.getRole(),
                        gm.getJoinedAt()))
                .toList();

        var bills = billRepository.findAllByCreatedById(user.getId());

        List<DataExportResponse.UserBillExport> billDtos = bills.stream()
                .map(b -> new DataExportResponse.UserBillExport(
                        b.getId(),
                        b.getGroup().getId(),
                        b.getTitle(),
                        b.getAmount(),
                        b.getBillMonth(),
                        b.getBillCategory() != null ? b.getBillCategory().getName() : null,
                        b.getCreatedAt()))
                .toList();

        var events = eventRepository.findAllByOwnerId(user.getId());

        List<DataExportResponse.UserEventExport> eventDtos = events.stream()
                .map(e -> new DataExportResponse.UserEventExport(
                        e.getId(),
                        e.getGroup().getId(),
                        e.getTitle(),
                        e.getDescription(),
                        e.getStartDate(),
                        e.getEndDate(),
                        e.getColor(),
                        e.getCreatedAt()))
                .toList();

        return new DataExportResponse(OffsetDateTime.now(), profileDto, groupDtos, billDtos, eventDtos);
    }
}
