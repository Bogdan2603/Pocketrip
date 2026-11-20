package ro.pocketrip.dto;

public record UserDto(Long id, String email, String role, String displayName, String preferredLanguage)
{
}
