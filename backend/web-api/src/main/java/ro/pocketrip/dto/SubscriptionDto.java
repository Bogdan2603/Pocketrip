package ro.pocketrip.dto;

import java.time.LocalDate;

public record SubscriptionDto(Long id,
                              Long userId,
                              Long planId,
                              LocalDate startDate,
                              LocalDate endDate,
                              String status)
{
}
