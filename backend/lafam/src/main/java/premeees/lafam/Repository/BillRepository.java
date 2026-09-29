package premeees.lafam.Repository;

import java.util.List;
import java.util.UUID;

import premeees.lafam.Entity.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import premeees.lafam.Entity.Bill;

public interface BillRepository extends JpaRepository<Bill, UUID> {
    Page<Bill> findAllByGroupId(UUID groupId, Pageable pageable);
    List<Bill> findAllByGroupIdAndCreatedById(UUID groupId, UUID createdById);
    List<Bill> findAllByGroupIdAndBillCategoryId(UUID groupId, UUID categoryId);
    void deleteAllByCreatedBy(User user);
}
