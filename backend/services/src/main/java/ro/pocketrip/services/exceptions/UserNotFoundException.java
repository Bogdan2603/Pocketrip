package ro.pocketrip.services.exceptions;

public class UserNotFoundException extends RuntimeException
{
    public UserNotFoundException(Long id)
    {
        super("User-ul cu id " + id + " nu a fost gasit");
    }
}
