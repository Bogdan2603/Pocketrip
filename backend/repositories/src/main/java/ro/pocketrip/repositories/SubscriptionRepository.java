package ro.pocketrip.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.pocketrip.models.Subscription;

import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository <Subscription , Long>
{
    Optional<Subscription> findByUserIdAndStatus(Long userId, String status);
}
