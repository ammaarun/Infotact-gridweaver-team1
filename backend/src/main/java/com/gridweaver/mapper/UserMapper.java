package com.gridweaver.mapper;

import com.gridweaver.dto.user.UserResponse;
import com.gridweaver.dto.user.UserSummaryResponse;
import com.gridweaver.entity.Role;
import com.gridweaver.entity.User;
import org.mapstruct.*;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * MapStruct mapper for bidirectional conversion between {@link User} entities
 * and their corresponding DTOs.
 *
 * <p>MapStruct generates the implementation at compile-time — no reflection overhead.
 * The Spring component model ({@code componentModel = "spring"}) is set globally via
 * the {@code -Amapstruct.defaultComponentModel=spring} compiler arg in {@code pom.xml}.
 *
 * @author GridWeaver Team
 */
@Mapper(
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface UserMapper {

    /**
     * Maps a {@link User} entity to a full {@link UserResponse} DTO.
     *
     * @param user the domain entity
     * @return the response DTO
     */
    @Mapping(target = "roles",    expression = "java(mapRoleNames(user.getRoles()))")
    @Mapping(target = "fullName", expression = "java(user.getFullName())")
    UserResponse toResponse(User user);

    /**
     * Maps a {@link User} entity to a lightweight {@link UserSummaryResponse}.
     *
     * @param user the domain entity
     * @return the summary DTO
     */
    @Mapping(target = "fullName", expression = "java(user.getFullName())")
    UserSummaryResponse toSummaryResponse(User user);

    /**
     * Extracts role name strings from a set of {@link Role} entities.
     * Used in {@link #toResponse(User)} mapping expression.
     *
     * @param roles the set of role entities
     * @return set of role name strings
     */
    default Set<String> mapRoleNames(Set<Role> roles) {
        if (roles == null) return Set.of();
        return roles.stream()
            .map(Role::getName)
            .collect(Collectors.toSet());
    }
}
