package ro.pocketrip.mappers;

import org.mapstruct.Mapper;
import ro.pocketrip.dto.PlanDto;
import ro.pocketrip.models.Plan;

@Mapper(componentModel = "spring")
public interface PlanMapper
{
    PlanDto toDto(Plan plan);
    Plan toEntity(PlanDto planDto);
}
