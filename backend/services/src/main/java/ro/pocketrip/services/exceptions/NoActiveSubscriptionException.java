package ro.pocketrip.services.exceptions;

public class NoActiveSubscriptionException extends RuntimeException
{
    public NoActiveSubscriptionException(Long userId)
    {
        super("Utilizatorul " + userId + "nu are abonament activ");

    }
}
