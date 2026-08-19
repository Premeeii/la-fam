package premeees.lafam.Service;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import premeees.lafam.Entity.Bill;
import premeees.lafam.Entity.BillCategory;
import premeees.lafam.Entity.Group;
import premeees.lafam.Entity.User;
import premeees.lafam.Repository.BillCategoryRepository;
import premeees.lafam.Repository.BillRepository;
import premeees.lafam.Repository.GroupMemberRepository;
import premeees.lafam.Repository.GroupRepository;
import premeees.lafam.Repository.UserRepository;
import premeees.lafam.dto.request.CreateBillRequest;
import premeees.lafam.dto.request.UpdateBillRequest;
import premeees.lafam.dto.response.BillCategoryResponse;
import premeees.lafam.dto.response.BillResponse;

@Service
public class BillService {

    private final BillRepository billRepository;
    private final BillCategoryRepository billCategoryRepository;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;

    public BillService(BillRepository billRepository, BillCategoryRepository billCategoryRepository,
                       GroupRepository groupRepository, GroupMemberRepository groupMemberRepository,
                       UserRepository userRepository) {
        this.billRepository = billRepository;
        this.billCategoryRepository = billCategoryRepository;
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BillResponse createBill(UUID groupId, CreateBillRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        if (group.getDeletedAt() != null) {
            throw new IllegalArgumentException("Group has been deleted");
        }

        // ตรวจสอบว่า user เป็นสมาชิกของ group
        groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this group"));

        // ตรวจสอบว่า category มีอยู่จริง
        BillCategory category = billCategoryRepository.findById(request.getBillCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Bill category not found"));

        Bill bill = new Bill(category, group, request.getTitle(), request.getAmount(), request.getBillMonth(), user);
        billRepository.save(bill);

        return BillResponse.fromEntity(bill);
    }

    @Transactional(readOnly = true)
    public List<BillResponse> getGroupBills(UUID groupId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        if (group.getDeletedAt() != null) {
            throw new IllegalArgumentException("Group has been deleted");
        }

        // ตรวจสอบว่า user เป็นสมาชิกของ group
        groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this group"));

        List<Bill> bills = billRepository.findAllByGroupId(groupId);

        return bills.stream()
                .map(BillResponse::fromEntity)
                .toList();
    }

    @Transactional
    public BillResponse updateBill(UUID groupId, UUID billId, UpdateBillRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        if (group.getDeletedAt() != null) {
            throw new IllegalArgumentException("Group has been deleted");
        }

        // ตรวจสอบว่า user เป็นสมาชิกของ group
        groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this group"));

        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found"));

        // ตรวจสอบว่า bill อยู่ใน group นี้จริง
        if (!bill.getGroup().getId().equals(groupId)) {
            throw new IllegalArgumentException("Bill does not belong to this group");
        }

        // อัปเดตเฉพาะ field ที่ส่งมา (partial update)
        if (request.getBillCategoryId() != null) {
            BillCategory category = billCategoryRepository.findById(request.getBillCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Bill category not found"));
            bill.setBillCategory(category);
        }

        if (request.getTitle() != null) {
            bill.setTitle(request.getTitle());
        }

        if (request.getAmount() != null) {
            bill.setAmount(request.getAmount());
        }

        if (request.getBillMonth() != null) {
            bill.setBillMonth(request.getBillMonth());
        }

        billRepository.save(bill);

        return BillResponse.fromEntity(bill);
    }

    @Transactional
    public void deleteBill(UUID groupId, UUID billId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        if (group.getDeletedAt() != null) {
            throw new IllegalArgumentException("Group has been deleted");
        }

        // ตรวจสอบว่า user เป็นสมาชิกของ group
        groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this group"));

        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found"));

        // ตรวจสอบว่า bill อยู่ใน group นี้จริง
        if (!bill.getGroup().getId().equals(groupId)) {
            throw new IllegalArgumentException("Bill does not belong to this group");
        }

        billRepository.delete(bill);
    }

    @Transactional(readOnly = true)
    public List<BillCategoryResponse> getAllCategories() {
        return billCategoryRepository.findAll().stream()
                .map(BillCategoryResponse::fromEntity)
                .toList();
    }
}
