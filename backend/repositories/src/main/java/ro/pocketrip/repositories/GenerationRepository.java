package ro.pocketrip.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.pocketrip.models.Generation;

import java.time.LocalDateTime;

public interface GenerationRepository extends JpaRepository<Generation, Long>
{
    long countByUserIdAndStatusAndExtraFalseAndCreatedAtBetween(Long userId, String status , LocalDateTime from,
                                                               LocalDateTime to);
}
