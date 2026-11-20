package ro.pocketrip.services.exceptions;

public class SubscriptionNotFoundException extends RuntimeException
{
    public SubscriptionNotFoundException(Long id)
    {
        super("Subscription not found with id " + id);
    }
}
