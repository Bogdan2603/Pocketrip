package ro.pocketrip.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.pocketrip.models.Waypoint;

public interface WaypointRepository extends JpaRepository <Waypoint, Long>
{

}
