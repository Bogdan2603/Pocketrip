package ro.pocketrip.services.events;

public record PlanChangedEvent(Long userId, Long oldPlanId, Long newPlanId)
{
}
