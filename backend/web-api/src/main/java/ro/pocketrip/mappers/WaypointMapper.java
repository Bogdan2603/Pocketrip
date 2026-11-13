package ro.pocketrip.mappers;

import org.mapstruct.Mapper;
import ro.pocketrip.dto.WaypointDto;
import ro.pocketrip.models.Waypoint;

@Mapper(componentModel = "spring")
public interface WaypointMapper
{
    WaypointDto toDto(Waypoint waypoint);
    Waypoint toEntity(WaypointDto dto);
}
