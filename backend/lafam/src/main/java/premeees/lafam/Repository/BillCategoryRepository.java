package premeees.lafam.Repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import premeees.lafam.Entity.BillCategory;

public interface BillCategoryRepository extends JpaRepository<BillCategory, UUID> {

}
