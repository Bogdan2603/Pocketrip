package ro.pocketrip.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.pocketrip.models.Plan;

import java.util.List;

public interface PlanRepository extends JpaRepository<Plan,Long>
{
    List<Plan> findByDeletedAtIsNull();
}
