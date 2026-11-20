package ro.pocketrip.services;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ro.pocketrip.models.User;
import ro.pocketrip.repositories.UserRepository;
import ro.pocketrip.services.exceptions.UserNotFoundException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService
{
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository)
    {
        this.userRepository = userRepository;
    }

    public List<User> getAll()
    {
        return userRepository.findAll();
    }

    public Optional<User> getById(Long id)
    {
        return userRepository.findById(id);
    }

    public User create(User user, String rawPassword)
    {
        user.setPasswordHash(encoder.encode(rawPassword));
        user.setCreatedAt(LocalDateTime.now());
        if(user.getRole()==null)
            user.setRole("USER");

        if(user.getPreferredLanguage()==null)
            user.setPreferredLanguage("ro");

        return userRepository.save(user);
    }

    public User update(Long id, User nou)
    {
        User existent = userRepository.findById(id)
                .orElseThrow( () -> new UserNotFoundException(id));
        existent.setEmail(nou.getEmail());
        existent.setRole(nou.getRole());
        existent.setDisplayName(nou.getDisplayName());
        existent.setPreferredLanguage(nou.getPreferredLanguage());

        return userRepository.save(existent);
    }

    public void delete(Long id)
    {
        if(!userRepository.existsById(id))
            throw new UserNotFoundException(id);
        userRepository.deleteById(id);
    }

}
