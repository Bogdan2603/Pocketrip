package ro.pocketrip.services.exceptions;

public class PlanNotFoundException extends RuntimeException
{
    public PlanNotFoundException(Long id)
    {
        super("Nu exista planul cu id " + id);
    }
}
