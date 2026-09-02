package premeees.lafam.Repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import premeees.lafam.Entity.Bill;

public interface BillRepository extends JpaRepository<Bill, UUID> {
    List<Bill> findAllByGroupId(UUID groupId);
    List<Bill> findAllByGroupIdAndCreatedById(UUID groupId, UUID createdById);
    List<Bill> findAllByGroupIdAndBillCategoryId(UUID groupId, UUID categoryId);
}
