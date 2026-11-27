package ro.pocketrip.services.exceptions;

public class SubscriptionNotFoundException extends RuntimeException
{
    public SubscriptionNotFoundException(Long id)
    {
        super("Abonamentul cu id " + id + "nu a fost gasit");
    }
}
