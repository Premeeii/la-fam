package premeees.lafam.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import premeees.lafam.Entity.Event;

public interface EventRepository extends JpaRepository<Event, UUID> {
    List<Event> findAllByGroupId(UUID groupId);
    List<Event> findAllByGroupIdAndStartDateGreaterThanEqualAndEndDateLessThanEqual(UUID groupId, OffsetDateTime from, OffsetDateTime to);
}
