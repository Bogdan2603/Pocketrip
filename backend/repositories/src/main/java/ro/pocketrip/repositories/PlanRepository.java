package ro.pocketrip.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.pocketrip.models.Plan;

public interface PlanRepository extends JpaRepository<Plan,Long>
{

}
