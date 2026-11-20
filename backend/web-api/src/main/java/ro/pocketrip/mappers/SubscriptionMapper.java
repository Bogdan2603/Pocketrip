package ro.pocketrip.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ro.pocketrip.dto.SubscriptionDto;
import ro.pocketrip.models.Subscription;

@Mapper(componentModel = "spring")
public interface SubscriptionMapper
{
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "plan.id", target = "planId")
    SubscriptionDto toDto(Subscription subscription);

    @Mapping(target = "user",ignore = true)
    @Mapping(target = "plan",ignore = true)
    Subscription toEntity(SubscriptionDto dto);
}
