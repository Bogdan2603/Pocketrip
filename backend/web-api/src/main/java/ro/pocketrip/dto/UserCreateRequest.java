package ro.pocketrip.dto;

public record UserCreateRequest(String email, String password, String role,
                                String displayName, String preferredLanguage)
{
}
