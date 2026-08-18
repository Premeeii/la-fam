package premeees.lafam.Repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import premeees.lafam.Entity.Group;

public interface GroupRepository extends JpaRepository<Group, UUID> {
    
}
