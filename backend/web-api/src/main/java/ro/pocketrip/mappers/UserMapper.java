package ro.pocketrip.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ro.pocketrip.dto.UserDto;
import ro.pocketrip.models.User;

@Mapper(componentModel = "spring")
public interface UserMapper
{
    UserDto toDto(User user);

    @Mapping(target = "passwordHash",ignore = true)
    @Mapping(target = "emailVerifiedAt",ignore = true)
    @Mapping(target = "createdAt",ignore = true)
    User toEntity(UserDto dto);

}
