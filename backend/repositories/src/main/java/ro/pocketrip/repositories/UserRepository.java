package ro.pocketrip.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.pocketrip.models.User;

public interface UserRepository extends JpaRepository<User, Long>
{
}
