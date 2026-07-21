package com.gridweaver.config;

import com.gridweaver.entity.Permission;
import com.gridweaver.entity.Role;
import com.gridweaver.entity.User;
import com.gridweaver.repository.PermissionRepository;
import com.gridweaver.repository.RoleRepository;
import com.gridweaver.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Set;

/**
 * Data seeder that bootstraps required reference data on every application startup.
 *
 * <p>Creates default {@link Role roles} and {@link Permission permissions} if they
 * do not already exist. This is idempotent — safe to run multiple times.
 *
 * <p>Required for the application to function: {@code AuthServiceImpl.register()}
 * depends on {@code ROLE_USER} existing in the database.
 *
 * @author GridWeaver Team
 */
@Slf4j
@Configuration
public class DataSeeder {

    /**
     * Seeds default permissions and roles on startup.
     * Uses {@link CommandLineRunner} to run after the application context is ready.
     *
     * @param permissionRepository repository for permission persistence
     * @param roleRepository       repository for role persistence
     * @param userRepository       repository for user persistence
     * @param passwordEncoder      encoder for hashing passwords
     * @return the seeder runner
     */
    @Bean
    @Transactional
    public CommandLineRunner seedData(PermissionRepository permissionRepository,
                                      RoleRepository roleRepository,
                                      UserRepository userRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            log.info("Running data seeder...");

            // ---------------------------------------------------------------
            // Seed Permissions
            // ---------------------------------------------------------------
            Map<String, String> permissions = Map.of(
                Permission.Names.USER_READ,   "Read user data",
                Permission.Names.USER_WRITE,  "Create and update users",
                Permission.Names.USER_DELETE, "Delete users",
                Permission.Names.ADMIN_ALL,   "Full administrative access"
            );

            permissions.forEach((name, description) -> {
                if (!permissionRepository.existsByName(name)) {
                    Permission perm = Permission.builder()
                        .name(name)
                        .description(description)
                        .build();
                    permissionRepository.save(perm);
                    log.info("Created permission: {}", name);
                }
            });

            // ---------------------------------------------------------------
            // Seed Roles
            // ---------------------------------------------------------------
            Permission userRead   = permissionRepository.findByName(Permission.Names.USER_READ).orElseThrow();
            Permission userWrite  = permissionRepository.findByName(Permission.Names.USER_WRITE).orElseThrow();
            Permission userDelete = permissionRepository.findByName(Permission.Names.USER_DELETE).orElseThrow();
            Permission adminAll   = permissionRepository.findByName(Permission.Names.ADMIN_ALL).orElseThrow();

            if (!roleRepository.existsByName(Role.Names.USER)) {
                Role userRole = Role.builder()
                    .name(Role.Names.USER)
                    .description("Standard application user")
                    .permissions(Set.of(userRead))
                    .build();
                roleRepository.save(userRole);
                log.info("Created role: {}", Role.Names.USER);
            }

            if (!roleRepository.existsByName(Role.Names.MODERATOR)) {
                Role modRole = Role.builder()
                    .name(Role.Names.MODERATOR)
                    .description("Content moderator with elevated read access")
                    .permissions(Set.of(userRead, userWrite))
                    .build();
                roleRepository.save(modRole);
                log.info("Created role: {}", Role.Names.MODERATOR);
            }

            if (!roleRepository.existsByName(Role.Names.ADMIN)) {
                Role adminRole = Role.builder()
                    .name(Role.Names.ADMIN)
                    .description("System administrator with full access")
                    .permissions(Set.of(userRead, userWrite, userDelete, adminAll))
                    .build();
                roleRepository.save(adminRole);
                log.info("Created role: {}", Role.Names.ADMIN);
            }

            // ---------------------------------------------------------------
            // Seed Default Admin User
            // ---------------------------------------------------------------
            if (!userRepository.existsByEmailAndNotDeleted("admin@gridweaver.io")) {
                Role adminRole = roleRepository.findByName(Role.Names.ADMIN).orElseThrow();
                User adminUser = User.builder()
                    .username("admin")
                    .email("admin@gridweaver.io")
                    .password(passwordEncoder.encode("Admin@1234"))
                    .firstName("System")
                    .lastName("Admin")
                    .enabled(true)
                    .accountLocked(false)
                    .credentialsExpired(false)
                    .roles(Set.of(adminRole))
                    .build();
                userRepository.save(adminUser);
                log.info("Created default admin user: admin@gridweaver.io");
            }

            log.info("Data seeder completed successfully.");
        };
    }
}

