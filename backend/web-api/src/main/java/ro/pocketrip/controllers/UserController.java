package ro.pocketrip.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.pocketrip.dto.UserCreateRequest;
import ro.pocketrip.dto.UserDto;
import ro.pocketrip.mappers.UserMapper;
import ro.pocketrip.models.User;
import ro.pocketrip.services.UserService;

import java.util.List;

@RestController
@RequestMapping("api/users")
public class UserController
{
    private final UserService userService;
    private final UserMapper userMapper;

    public UserController(UserService userService, UserMapper userMapper)
    {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @GetMapping
    public List<UserDto> getAll()
    {
        return userService.getAll().stream().map(userMapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getById(@PathVariable Long id)
    {
        return userService.getById(id).map(userMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserDto> create(@RequestBody UserCreateRequest request)
    {
        User user = new User();
        user.setEmail(request.email());
        user.setRole(request.role());
        user.setDisplayName(request.displayName());
        user.setPreferredLanguage(request.preferredLanguage());

        User saved = userService.create(user, request.password());
        return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> update(@PathVariable Long id, @RequestBody UserDto userDto)
    {
        User updated = userService.update(id, userMapper.toEntity(userDto));
        return ResponseEntity.ok(userMapper.toDto(updated));
    }
}
